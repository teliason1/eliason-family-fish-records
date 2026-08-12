import { SiteHeader } from "@/components/site-header";
import { SubmissionForm } from "@/components/submission-form";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default function SubmitPage() {
  return <div className="site atlas"><SiteHeader /><main className="form-page"><SubmissionForm configured={isSupabaseConfigured()} /></main></div>;
}
