export type RecordStatus = "current" | "historical" | "micro";

export interface FishRecord {
  id: number | string;
  species: string;
  angler: string;
  date: string;
  weight: number | null;
  length: number | null;
  state: string | null;
  city: string | null;
  water: string | null;
  caughtWith: string | null;
  status: RecordStatus;
  story: string | null;
  lat: number | null;
  lng: number | null;
  coordinateAccuracy: "exact" | "estimated" | "unknown";
  photo: string | null;
}

export interface RecordFilters {
  query: string;
  anglers: string[];
  species: string[];
  states: string[];
  statuses: RecordStatus[];
  yearFrom: number;
  yearTo: number;
  photosOnly: boolean;
}

export type Concept = "atlas";
