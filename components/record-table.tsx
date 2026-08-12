import Link from "next/link";
import { formatDate, sizeLabel } from "@/lib/data";
import type { FishRecord } from "@/lib/types";
import { Trophy } from "./icons";

export function RecordTable({ records }: { records: FishRecord[] }) {
  return <div className="table-wrap"><table><thead><tr><th>Date</th><th>Species</th><th>Angler</th><th>Water</th><th>Location</th><th>Size</th><th>Status</th></tr></thead><tbody>{records.map((r) => <tr key={r.id}><td>{formatDate(r.date)}</td><td><Link href={`/records/${r.id}`}>{r.species}</Link></td><td>{r.angler}</td><td>{r.water || "—"}</td><td>{[r.city, r.state].filter(Boolean).join(", ") || "—"}</td><td>{sizeLabel(r)}</td><td><span className={`status status-${r.status}`}>{r.status === "current" && <Trophy size={12} />}{r.status}</span></td></tr>)}</tbody></table></div>;
}
