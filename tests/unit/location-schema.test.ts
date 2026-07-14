import { describe, it, expect } from "vitest";
import { locationQuerySchema } from "@/features/location/schemas/location.schema";

describe("locationQuerySchema", () => {
  it("should parse valid float values", () => {
    const result = locationQuerySchema.safeParse({
      lat: "23.8",
      lon: "90.4",
    });

    expect(result.success).toBe(true);
  });

  it("should fail for invalid numbers", () => {
    const result = locationQuerySchema.safeParse({
      lat: "abc",
      lon: "90.4",
    });

    expect(result.success).toBe(false);
  });

  it("should fail for out-of-range latitude", () => {
    const result = locationQuerySchema.safeParse({
      lat: "100",
      lon: "90.4",
    });

    expect(result.success).toBe(false);
  });

  it("should fail for infinity values", () => {
    const result = locationQuerySchema.safeParse({
      lat: "1e309",
      lon: "90.4",
    });

    expect(result.success).toBe(false);
  });
});
