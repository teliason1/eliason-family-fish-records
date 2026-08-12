import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SubmissionForm } from "@/components/submission-form";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import type { Concept } from "@/lib/types";
const concepts = ["atlas"];
export default async function SubmitPage({ params }: { params: Promise<{ concept: string }> }) { const { concept } = await params; if (!concepts.includes(concept)) notFound(); return <div className={`site concept-${concept}`}><SiteHeader concept={concept as Concept} /><main className="form-page"><SubmissionForm configured={isSupabaseConfigured()} /></main></div>; }
