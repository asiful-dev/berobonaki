import { locationQuerySchema } from "@/features/location/schemas/location.schema";
import { getQueryParams } from "@/lib/utils/parse-query";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { fetchWeather } from "@/lib/weather/fetch-weather";
import type { WeatherSuccessResponse } from "@/features/weather-decision/types/api.types";

export async function GET(request: Request) {
  try {
    const rawParams = getQueryParams(request.url);

    if (!rawParams.lat || !rawParams.lon) {
      return errorResponse(
        "Missing required query parameters: lat and lon",
        400,
      );
    }

    const parsed = locationQuerySchema.safeParse(rawParams);

    if (!parsed.success) {
      return errorResponse(
        "Invalid query parameters",
        400,
        parsed.error.flatten().fieldErrors,
      );
    }

    const { lat, lon } = parsed.data;

    const weather = await fetchWeather(lat, lon);

    const response: WeatherSuccessResponse = {
      status: "ok",
      data: {
        lat,
        lon,
        weather,
      },
    };

    return successResponse(response.data);
  } catch {
    return errorResponse("Internal server error", 500);
  }
}

export async function POST() {
  return errorResponse("Method not allowed", 405);
}
