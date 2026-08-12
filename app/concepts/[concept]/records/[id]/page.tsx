import { notFound } from "next/navigation";
import { records, getRecord } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { RecordDetail } from "@/components/record-detail";
import type { Concept } from "@/lib/types";
import type { FishRecord } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

const concepts = ["atlas"];
export default async function RecordPage({ params }: { params: Promise<{ concept: string; id: string }> }) { const { concept, id } = await params; if (!concepts.includes(concept)) notFound(); let record = getRecord(id); if (!record && id.includes("-")) { const supabase = await createClient(); const { data } = supabase ? await supabase.from("catches").select("*").eq("id", id).single() : { data: null }; if (data) record = { id: data.id, species: data.species, angler: data.angler, date: data.date, weight: data.weight, length: data.length, state: data.state, city: data.city, water: data.water, caughtWith: data.caught_with, status: data.status, story: data.story, lat: data.lat, lng: data.lng, coordinateAccuracy: data.coordinate_accuracy || (data.lat == null ? "unknown" : "exact"), photo: data.photo_url } as FishRecord; } if (!record) notFound(); const related = records.filter((r) => r.species === record.species && r.id !== record.id).slice(0, 5); return <div className={`site concept-${concept}`}><SiteHeader concept={concept as Concept} /><RecordDetail record={record} concept={concept as Concept} related={related} /><footer className="site-footer"><span>Family Fish Records</span><span>For bragging rights only · Since 1976</span></footer></div>; }
