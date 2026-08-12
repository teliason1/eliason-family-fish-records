import { notFound } from "next/navigation";
import { Explorer } from "@/components/explorer";
import { SiteHeader } from "@/components/site-header";
import type { Concept } from "@/lib/types";

const concepts = ["atlas"];
export default async function ConceptPage({ params }: { params: Promise<{ concept: string }> }) { const { concept } = await params; if (!concepts.includes(concept)) notFound(); return <div className={`site concept-${concept}`}><SiteHeader concept={concept as Concept} /><Explorer concept={concept as Concept} /><footer className="site-footer"><span>Family Fish Records</span><span>For bragging rights only · Since 1976</span></footer></div>; }
