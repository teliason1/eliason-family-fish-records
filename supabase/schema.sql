create extension if not exists pgcrypto;
create type public.user_role as enum ('member', 'admin');
create type public.record_status as enum ('current', 'historical', 'micro');
create type public.review_status as enum ('pending', 'approved', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role public.user_role not null default 'member',
  created_at timestamptz not null default now()
);
create table public.catches (
  id uuid primary key default gen_random_uuid(), legacy_id integer unique,
  species text not null, angler text not null, date date not null,
  weight numeric, length numeric, state text, city text, water text,
  caught_with text, story text, status public.record_status not null,
  lat double precision, lng double precision, coordinate_accuracy text not null default 'exact' check (coordinate_accuracy in ('exact','estimated','unknown')), photo_url text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.submissions (
  id uuid primary key default gen_random_uuid(), submitted_by uuid not null references public.profiles(id),
  species text not null, angler text not null, date date not null,
  weight numeric, length numeric, state text, city text, water text not null,
  caught_with text, story text, lat double precision, lng double precision, photo_path text,
  status public.review_status not null default 'pending', reviewed_by uuid references public.profiles(id),
  review_notes text, approved_catch_id uuid references public.catches(id),
  created_at timestamptz not null default now(), reviewed_at timestamptz
);

alter table public.profiles enable row level security;
alter table public.catches enable row level security;
alter table public.submissions enable row level security;
create policy "Public reads catches" on public.catches for select using (true);
create policy "Members read own profile" on public.profiles for select to authenticated using (id = auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "Members submit" on public.submissions for insert to authenticated with check (submitted_by = auth.uid());
create policy "Members read own submissions" on public.submissions for select to authenticated using (submitted_by = auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "Admins update submissions" on public.submissions for update to authenticated using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

insert into storage.buckets (id, name, public) values ('pending-catches','pending-catches',false),('approved-catches','approved-catches',true) on conflict do nothing;
create policy "Members upload pending photos" on storage.objects for insert to authenticated with check (bucket_id='pending-catches' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "Members read own pending photos" on storage.objects for select to authenticated using (bucket_id='pending-catches' and ((storage.foldername(name))[1]=auth.uid()::text or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin')));

create or replace function public.approve_submission(submission_id uuid, approved_status text)
returns uuid language plpgsql security definer set search_path=public as $$
declare s public.submissions; new_id uuid;
begin
  if not exists(select 1 from profiles where id=auth.uid() and role='admin') then raise exception 'Forbidden'; end if;
  select * into s from submissions where id=submission_id and status='pending' for update;
  if not found then raise exception 'Submission is not pending'; end if;
  if approved_status not in ('current','historical','micro') then raise exception 'Invalid status'; end if;
  insert into catches(species,angler,date,weight,length,state,city,water,caught_with,story,status,lat,lng,coordinate_accuracy)
  values(s.species,s.angler,s.date,s.weight,s.length,s.state,s.city,s.water,s.caught_with,s.story,approved_status::record_status,s.lat,s.lng,case when s.lat is null then 'unknown' else 'exact' end) returning id into new_id;
  update submissions set status='approved',reviewed_by=auth.uid(),reviewed_at=now(),approved_catch_id=new_id where id=submission_id;
  return new_id;
end $$;
revoke all on function public.approve_submission(uuid,text) from public;
grant execute on function public.approve_submission(uuid,text) to authenticated;
