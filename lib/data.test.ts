import { describe, expect, it } from "vitest";
import { records } from "./data";

describe("records archive", () => {
  it("contains records with unique IDs", () => {
    expect(records.length).toBeGreaterThan(0);
    expect(new Set(records.map((record) => String(record.id))).size).toBe(records.length);
  });

  it("uses supported record statuses", () => {
    expect(records.every((record) => record.status === "current" || record.status === "historical")).toBe(true);
  });

  it("uses public paths for configured photos", () => {
    expect(records.every((record) => record.photo === null || record.photo.startsWith("/fish/"))).toBe(true);
  });

  it("keeps latitude and longitude paired", () => {
    expect(records.every((record) => (record.lat === null) === (record.lng === null))).toBe(true);
  });
});
