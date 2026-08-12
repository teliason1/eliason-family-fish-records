import recordsJson from "../data/records.json";
import type { FishRecord } from "./types";

export const records = recordsJson as FishRecord[];

export const anglers = [...new Set(records.map((r) => r.angler))].sort();
export const species = [...new Set(records.map((r) => r.species))].sort();
export const states = [...new Set(records.map((r) => r.state).filter(Boolean))].sort() as string[];
export const years = records.map((r) => Number(r.date.slice(0, 4)));
export const minYear = Math.min(...years);
export const maxYear = Math.max(...years);

export function getRecord(id: number | string) {
  return records.find((record) => String(record.id) === String(id));
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

export function locationLabel(record: FishRecord) {
  return [record.water, record.city, record.state].filter(Boolean).join(" · ");
}

export function sizeLabel(record: FishRecord) {
  const parts = [];
  if (record.length !== null) parts.push(`${record.length} in`);
  if (record.weight !== null) parts.push(`${record.weight} lb`);
  return parts.join(" · ") || "Size not recorded";
}
