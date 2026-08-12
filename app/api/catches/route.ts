import { NextResponse } from "next/server";
import { records } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
export async function GET() { const supabase = await createClient(); if (!supabase) return NextResponse.json(records); const { data, error } = await supabase.from("catches").select("*").order("date", { ascending: false }); if (error || !data?.length) return NextResponse.json(records); return NextResponse.json(data.map((r) => ({ id: r.legacy_id || r.id, species: r.species, angler: r.angler, date: r.date, weight: r.weight, length: r.length, state: r.state, city: r.city, water: r.water, caughtWith: r.caught_with, status: r.status, story: r.story, lat: r.lat, lng: r.lng, coordinateAccuracy: r.coordinate_accuracy || (r.lat == null ? "unknown" : "exact"), photo: r.photo_url }))); }
