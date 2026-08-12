import { describe, expect, it } from "vitest";
import { submissionSchema } from "./submission-schema";
const valid = { species: "Bluegill", angler: "Karl Eliason", date: "2026-08-01", water: "White River", length: "9.5" };
describe("submissionSchema", () => { it("accepts a measured catch", () => expect(submissionSchema.safeParse(valid).success).toBe(true)); it("requires a measurement", () => expect(submissionSchema.safeParse({ ...valid, length: undefined }).success).toBe(false)); it("rejects invalid coordinates", () => expect(submissionSchema.safeParse({ ...valid, lat: 120 }).success).toBe(false)); });
