import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Clock3, ShieldCheck } from "@/components/icons";

export default async function AdminPage() {
  if (!isSupabaseConfigured()) return <main className="admin-page"><span className="kicker">Admin</span><h1>Moderation queue</h1><div className="setup-notice">Connect Supabase and apply <code>supabase/schema.sql</code> to activate moderation.</div><Link href="/">← Back to the archive</Link></main>;
  const supabase = await createClient(); const { data: { user } } = await supabase!.auth.getUser(); if (!user) redirect("/login");
  const { data: profile } = await supabase!.from("profiles").select("role").eq("id", user.id).single(); if (profile?.role !== "admin") redirect("/");
  const { data: submissions } = await supabase!.from("submissions").select("*").eq("status", "pending").order("created_at");
  return <main className="admin-page"><span className="kicker">Admin review</span><h1>Moderation queue</h1><p>{submissions?.length || 0} catches waiting for approval.</p><a className="primary-button" href="/api/admin/export">Download Excel backup</a>{submissions?.map((s) => <article className="admin-card" key={s.id}><header><div><span className="status status-historical"><Clock3 size={12} /> pending</span><h2>{s.species}</h2></div><strong>{s.angler}</strong></header><p>{s.water} · {s.date}</p><p>{s.story}</p><form action={`/api/admin/submissions/${s.id}/approve`} method="post"><label>Record classification <select name="record_status"><option value="historical">Historical catch</option><option value="current">Current family record</option><option value="micro">Micro catch</option></select></label><button className="primary-button"><ShieldCheck size={16} /> Approve & publish</button></form></article>)}</main>;
}
