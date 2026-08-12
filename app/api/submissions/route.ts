import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { submissionSchema } from "@/lib/submission-schema";
import { Resend } from "resend";

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Submissions are not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in with an invited family account" }, { status: 401 });
  const form = await request.formData();
  const candidate = Object.fromEntries([...form.entries()].filter(([key]) => key !== "photo").map(([key, value]) => [key, value === "" ? undefined : value]));
  const parsed = submissionSchema.safeParse(candidate);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  let photoPath: string | null = null;
  const photo = form.get("photo");
  if (photo instanceof File && photo.size) {
    if (photo.size > 10_000_000) return NextResponse.json({ error: "Photo must be under 10 MB" }, { status: 400 });
    if (!photo.type.match(/^image\/(jpeg|png|webp|gif)$/)) return NextResponse.json({ error: "Use a JPG, PNG, WebP, or GIF image" }, { status: 400 });
    const ext = photo.name.split(".").pop()?.toLowerCase() || "jpg";
    photoPath = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const uploaded = await supabase.storage.from("pending-catches").upload(photoPath, photo, { contentType: photo.type });
    if (uploaded.error) return NextResponse.json({ error: "Photo upload failed" }, { status: 500 });
  }
  const { caughtWith, ...values } = parsed.data;
  const { error } = await supabase.from("submissions").insert({ ...values, caught_with: caughtWith, submitted_by: user.id, photo_path: photoPath });
  if (error) return NextResponse.json({ error: "Unable to save the submission" }, { status: 500 });
  if (process.env.RESEND_API_KEY && process.env.ADMIN_NOTIFICATION_EMAIL) await new Resend(process.env.RESEND_API_KEY).emails.send({ from: "Fish Records <onboarding@resend.dev>", to: process.env.ADMIN_NOTIFICATION_EMAIL, subject: `New catch: ${parsed.data.species}`, html: `<p>${parsed.data.angler} submitted a ${parsed.data.species} caught at ${parsed.data.water}.</p><p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin">Review submission</a></p>` });
  return NextResponse.json({ ok: true }, { status: 201 });
}
