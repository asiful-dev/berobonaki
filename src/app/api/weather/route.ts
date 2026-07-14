import { locationQuerySchema } from "@/features/location/schemas/location.schema";
import { getQueryParams } from "@/lib/utils/parse-query";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import type {
  WeatherSuccessResponse,
  WeatherErrorResponse,
} from "@/features/weather-decision/types/api.types";

export async function GET(request: Request) {
  try {
    const rawParams = getQueryParams(request.url);

    // Explicit missing param check
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

    const response: WeatherSuccessResponse = {
      status: "ok",
      data: { lat, lon },
    };

    return successResponse(response.data);
  } catch (error) {
    return errorResponse("Internal server error", 500);
  }
}

export async function POST() {
  return errorResponse("Method not allowed", 405);
}
