"use client";

import { anglers, maxYear, minYear, species, states } from "@/lib/data";
import type { RecordFilters, RecordStatus } from "@/lib/types";
import { Search, SlidersHorizontal, X } from "./icons";

const statuses: { value: RecordStatus; label: string }[] = [
  { value: "current", label: "Current records" },
  { value: "historical", label: "Past records" },
];

export function FilterPanel({ filters, setFilters, mobileOpen, close }: { filters: RecordFilters; setFilters: (next: RecordFilters) => void; mobileOpen: boolean; close: () => void }) {
  const toggle = (key: "anglers" | "species" | "states" | "statuses", value: string) => {
    const values = filters[key] as string[];
    setFilters({ ...filters, [key]: values.includes(value) ? values.filter((v) => v !== value) : [...values, value] });
  };
  const activeCount = filters.anglers.length + filters.species.length + filters.states.length + filters.statuses.length + Number(filters.photosOnly) + Number(filters.yearFrom !== minYear || filters.yearTo !== maxYear);
  const reset = () => setFilters({ query: "", anglers: [], species: [], states: [], statuses: [], yearFrom: minYear, yearTo: maxYear, photosOnly: false });

  return <aside className={`filters ${mobileOpen ? "filters-open" : ""}`} aria-label="Record filters">
    <div className="filter-title"><span><SlidersHorizontal size={18} /> Filters {activeCount > 0 && <b>{activeCount}</b>}</span><button className="icon-button filter-close" onClick={close} aria-label="Close filters"><X /></button></div>
    <label className="search-box"><Search size={18} /><input value={filters.query} onChange={(e) => setFilters({ ...filters, query: e.target.value })} placeholder="Search catches, places, stories…" /></label>
    <FilterGroup title="Record type">
      {statuses.map((s) => <CheckOption key={s.value} label={s.label} checked={filters.statuses.includes(s.value)} onChange={() => toggle("statuses", s.value)} />)}
      <CheckOption label="Has a photo" checked={filters.photosOnly} onChange={() => setFilters({ ...filters, photosOnly: !filters.photosOnly })} />
    </FilterGroup>
    <FilterGroup title="Year">
      <div className="year-row"><label>From<select value={filters.yearFrom} onChange={(e) => setFilters({ ...filters, yearFrom: +e.target.value })}>{yearOptions()}</select></label><label>To<select value={filters.yearTo} onChange={(e) => setFilters({ ...filters, yearTo: +e.target.value })}>{yearOptions()}</select></label></div>
    </FilterGroup>
    <MultiSelect title="Angler" values={anglers} selected={filters.anglers} toggle={(v) => toggle("anglers", v)} />
    <MultiSelect title="Species" values={species} selected={filters.species} toggle={(v) => toggle("species", v)} />
    <MultiSelect title="State / region" values={states} selected={filters.states} toggle={(v) => toggle("states", v)} />
    {activeCount > 0 && <button className="text-button reset-button" onClick={reset}>Clear all filters</button>}
  </aside>;
}

function yearOptions() { return Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).map((y) => <option key={y}>{y}</option>); }
function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) { return <fieldset className="filter-group"><legend>{title}</legend>{children}</fieldset>; }
function CheckOption({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) { return <label className="check-option"><input type="checkbox" checked={checked} onChange={onChange} /><span>{label}</span></label>; }
function MultiSelect({ title, values, selected, toggle }: { title: string; values: string[]; selected: string[]; toggle: (value: string) => void }) { return <details className="filter-details"><summary>{title}<span>{selected.length ? selected.length : "All"}</span></summary><div className="option-list">{values.map((v) => <CheckOption key={v} label={v} checked={selected.includes(v)} onChange={() => toggle(v)} />)}</div></details>; }
