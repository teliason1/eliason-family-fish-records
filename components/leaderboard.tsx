"use client";

import { useState, type CSSProperties } from "react";
import type { FishRecord } from "@/lib/types";
import { Trophy } from "./icons";

type Leader = [string, number];
type Plot = "podium" | "tiles" | "donut" | "bars";

const plots: { value: Plot; label: string }[] = [
  { value: "podium", label: "Podium" },
  { value: "tiles", label: "Cards" },
  { value: "donut", label: "Donut" },
  { value: "bars", label: "Bars" },
];

export function Leaderboard({ records }: { records: FishRecord[] }) {
  const [plot, setPlot] = useState<Plot>("bars");
  const leaders = [...records.filter((r) => r.status === "current").reduce((counts, record) => counts.set(record.angler, (counts.get(record.angler) || 0) + 1), new Map<string, number>())].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  return <section className="leaderboard" aria-labelledby="leaderboard-title">
    <div className="leaderboard-top">
      <div className="leaderboard-heading"><span className="leaderboard-icon"><Trophy /></span><div><span className="kicker">Family standings</span><h2 id="leaderboard-title">Current record leaderboard</h2><p>Every current species record counts—including ties.</p></div></div>
      <div className="plot-picker" aria-label="Compare leaderboard styles">{plots.map((option) => <button type="button" key={option.value} className={plot === option.value ? "selected" : ""} onClick={() => setPlot(option.value)} aria-pressed={plot === option.value}>{option.label}</button>)}</div>
    </div>
    <div className="leaderboard-plot" aria-live="polite">
      {plot === "podium" ? <Podium leaders={leaders} /> : plot === "tiles" ? <Tiles leaders={leaders} /> : plot === "donut" ? <Donut leaders={leaders} /> : <Bars leaders={leaders} />}
    </div>
  </section>;
}

function Podium({ leaders }: { leaders: Leader[] }) {
  const order = [leaders[1], leaders[0], leaders[2]].filter(Boolean) as Leader[];
  return <div className="podium-plot">{order.map(([angler, count]) => { const rank = leaders.findIndex(([name]) => name === angler) + 1; return <div className={`podium-place podium-${rank}`} key={angler}><span className="podium-medal">{rank}</span><strong>{shortName(angler)}</strong><b>{count}</b><small>records</small></div>; })}</div>;
}

function Tiles({ leaders }: { leaders: Leader[] }) {
  return <div className="tile-plot">{leaders.slice(0, 6).map(([angler, count], index) => <div className="leader-tile" key={angler}><span>#{index + 1}</span><strong>{shortName(angler)}</strong><b>{count}</b></div>)}</div>;
}

function Donut({ leaders }: { leaders: Leader[] }) {
  const shown = leaders.slice(0, 5);
  const total = leaders.reduce((sum, [, count]) => sum + count, 0);
  let cursor = 0;
  const stops = shown.map(([, count], index) => { const start = cursor; cursor += count / total * 100; return `var(--chart-${index + 1}) ${start}% ${cursor}%`; });
  if (cursor < 100) stops.push(`var(--chart-other) ${cursor}% 100%`);
  return <div className="donut-plot"><div className="donut" style={{ "--donut": `conic-gradient(${stops.join(",")})` } as CSSProperties}><span><strong>{total}</strong><small>records</small></span></div><div className="donut-legend">{shown.map(([angler, count], index) => <div key={angler}><i style={{ background: `var(--chart-${index + 1})` }} /><span>{shortName(angler)}</span><strong>{count}</strong></div>)}</div></div>;
}

function Bars({ leaders }: { leaders: Leader[] }) {
  const max = leaders[0]?.[1] || 1;
  return <div className="bar-chart">{leaders.map(([angler, count], index) => <div className="bar-row" key={angler}><span className="bar-rank">{index + 1}</span><span className="bar-name">{shortName(angler)}</span><div className="bar-track"><span className="bar-fill" style={{ width: `${count / max * 100}%`, animationDelay: `${index * 45}ms` }} /></div><strong>{count}</strong></div>)}</div>;
}

function shortName(name: string) { return name.replace(" Eliason", ""); }
