import type { FishRecord } from "@/lib/types";
import { Trophy } from "./icons";

export function Leaderboard({ records }: { records: FishRecord[] }) {
  const leaders = [...records.filter((r) => r.status === "current").reduce((counts, record) => counts.set(record.angler, (counts.get(record.angler) || 0) + 1), new Map<string, number>())].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const max = leaders[0]?.[1] || 1;
  return <section className="leaderboard" aria-labelledby="leaderboard-title"><div className="leaderboard-heading"><span className="leaderboard-icon"><Trophy /></span><div><span className="kicker">Family standings</span><h2 id="leaderboard-title">Current record leaderboard</h2><p>Every current species record counts—including ties.</p></div></div><div className="bar-chart">{leaders.map(([angler, count], index) => <div className="bar-row" key={angler}><span className="bar-rank">{index + 1}</span><span className="bar-name">{angler.replace(" Eliason", "")}</span><div className="bar-track"><span className="bar-fill" style={{ width: `${(count / max) * 100}%`, animationDelay: `${index * 45}ms` }} /></div><strong>{count}</strong></div>)}</div></section>;
}
