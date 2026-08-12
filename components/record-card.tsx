import Link from "next/link";
import type { Concept, FishRecord } from "@/lib/types";
import { formatDate, locationLabel, sizeLabel } from "@/lib/data";
import { ArrowRight, MapPin, Trophy } from "./icons";
import { RecordImage } from "./record-image";

export function RecordCard({ record, concept }: { record: FishRecord; concept: Concept }) {
  return <article className="record-card">
    <Link href={`/concepts/${concept}/records/${record.id}`} className="card-image"><RecordImage src={record.photo} alt={`${record.species} caught by ${record.angler}`} />{record.status === "current" && <span className="photo-badge"><Trophy size={13} /> Current record</span>}</Link>
    <div className="card-body"><div className="eyebrow">{formatDate(record.date)}</div><h3><Link href={`/concepts/${concept}/records/${record.id}`}>{record.species}</Link></h3><p className="byline">Caught by <strong>{record.angler}</strong></p><p className="location"><MapPin size={15} />{locationLabel(record) || "Location not recorded"}</p><div className="card-footer"><span>{sizeLabel(record)}</span><Link aria-label={`View ${record.species} record`} href={`/concepts/${concept}/records/${record.id}`}><ArrowRight size={19} /></Link></div></div>
  </article>;
}
