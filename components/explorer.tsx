"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { maxYear, minYear, records as allRecords } from "@/lib/data";
import type { FishRecord, RecordFilters } from "@/lib/types";
import { FilterPanel } from "./filter-panel";
import { RecordCard } from "./record-card";
import { RecordTable } from "./record-table";
import { Images, List, Map, SlidersHorizontal, Waves } from "./icons";
import { Leaderboard } from "./leaderboard";

const FishMap = dynamic(() => import("./fish-map"), { ssr: false, loading: () => <div className="map-loading">Charting the waters…</div> });
type View = "gallery" | "list" | "map";

export function Explorer() {
  const params = useSearchParams();
  const router = useRouter();
  const requestedView = params.get("view");
  const initialView: View = requestedView === "list" || requestedView === "map" || requestedView === "gallery" ? requestedView : "gallery";
  const [view, setView] = useState<View>(initialView);
  const [filters, setFilters] = useState<RecordFilters>({ query: "", anglers: [], species: [], states: [], statuses: [], yearFrom: minYear, yearTo: maxYear, photosOnly: false });
  const [mobileFilters, setMobileFilters] = useState(false);
  const records = allRecords;
  const filtered = useMemo(() => filterRecords(records, filters), [filters, records]);
  const mapped = filtered.filter((r) => r.lat !== null && r.lng !== null).length;
  const changeView = (next: View) => { setView(next); const p = new URLSearchParams(params); p.set("view", next); router.replace(`?${p}`, { scroll: false }); };

  return <>
    <section className="hero">
      <div className="hero-copy"><h1>Family Fish Records</h1><p>For bragging rights only!</p></div>
      <Leaderboard records={records} />
    </section>
    <section className="explorer-shell">
      <FilterPanel filters={filters} setFilters={setFilters} mobileOpen={mobileFilters} close={() => setMobileFilters(false)} />
      <main className="results">
        <div className="results-toolbar"><div><span className="result-count">{filtered.length} catches</span><span className="mapped-count"> · {mapped} mapped</span></div><div className="toolbar-actions"><button className="filter-trigger" onClick={() => setMobileFilters(true)}><SlidersHorizontal size={17} /> Filter</button><div className="view-picker"><span className="view-label">View</span><div className="view-switcher" aria-label="Choose view">{([ ["gallery", Images], ["list", List], ["map", Map] ] as const).map(([name, Icon]) => <button key={name} className={view === name ? "selected" : ""} onClick={() => changeView(name)} aria-label={`${name} view`}><Icon size={20} /><span>{name}</span></button>)}</div></div></div></div>
        {filtered.length === 0 ? <div className="empty-state"><Waves size={48} /><h2>No catches in these waters</h2><p>Try removing a filter or widening the year range.</p></div> : view === "gallery" ? <div className="card-grid">{filtered.map((r) => <RecordCard key={r.id} record={r} />)}</div> : view === "list" ? <RecordTable records={filtered} /> : <div className="map-panel"><FishMap records={filtered} /><div className="map-legend"><span><i className="current-dot" />Current</span><span><i className="past-dot" />Past</span><span><i className="estimate-dot" />Approximate</span></div></div>}
      </main>
    </section>
  </>;
}

function filterRecords(records: FishRecord[], f: RecordFilters) {
  const q = f.query.toLowerCase().trim();
  return records.filter((r) => {
    const year = +r.date.slice(0, 4);
    const haystack = [r.species, r.angler, r.state, r.city, r.water, r.caughtWith, r.story].filter(Boolean).join(" ").toLowerCase();
    return (!q || haystack.includes(q)) && (!f.anglers.length || f.anglers.includes(r.angler)) && (!f.species.length || f.species.includes(r.species)) && (!f.states.length || (!!r.state && f.states.includes(r.state))) && (!f.statuses.length || f.statuses.includes(r.status)) && year >= f.yearFrom && year <= f.yearTo && (!f.photosOnly || !!r.photo);
  });
}
