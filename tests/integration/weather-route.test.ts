import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/weather/route";

function createRequest(url: string) {
  return new Request(url);
}

describe("GET /api/weather", () => {
  it("should return 200 for valid query params", async () => {
    const request = createRequest(
      "http://localhost:3000/api/weather?lat=23.8&lon=90.4",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("ok");
    expect(data.data.lat).toBe(23.8);
    expect(data.data.lon).toBe(90.4);
  });

  it("should return 400 for invalid latitude (non-number)", async () => {
    const request = createRequest(
      "http://localhost:3000/api/weather?lat=abc&lon=90.4",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.status).toBe("error");
    expect(data.errors.lat).toBeDefined();
  });

  it("should return 400 for out-of-range latitude", async () => {
    const request = createRequest(
      "http://localhost:3000/api/weather?lat=200&lon=90.4",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.errors.lat).toBeDefined();
  });

  it("should return 400 for missing params", async () => {
    const request = createRequest("http://localhost:3000/api/weather");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.status).toBe("error");
  });

  it("should return 400 for invalid longitude", async () => {
    const request = createRequest(
      "http://localhost:3000/api/weather?lat=23.8&lon=999",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.errors.lon).toBeDefined();
  });

  it("should handle floating point precision correctly", async () => {
    const request = createRequest(
      "http://localhost:3000/api/weather?lat=23.810331&lon=90.412521",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.lat).toBeCloseTo(23.810331);
    expect(data.data.lon).toBeCloseTo(90.412521);
  });

  it("should return error for missing params", async () => {
    const request = new Request("http://localhost:3000/api/weather");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("Missing required query parameters: lat and lon");
  });
});
