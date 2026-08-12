import { createClient } from "@supabase/supabase-js";
import records from "../data/records.json" with { type: "json" };
const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.SUPABASE_SECRET_KEY;
if(!url||!key) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY");
const db=createClient(url,key,{auth:{persistSession:false}});
const rows=records.map(r=>({legacy_id:r.id,species:r.species,angler:r.angler,date:r.date,weight:r.weight,length:r.length,state:r.state,city:r.city,water:r.water,caught_with:r.caughtWith,story:r.story,status:r.status,lat:r.lat,lng:r.lng,coordinate_accuracy:r.coordinateAccuracy,photo_url:r.photo}));
const {error}=await db.from("catches").upsert(rows,{onConflict:"legacy_id"}); if(error) throw error;
console.log(`Seeded ${rows.length} catches`);
