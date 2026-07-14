import { NextResponse } from "next/server";
import { locationQuerySchema } from "@/features/location/schemas/location.schema";
import { getQueryParams } from "@/lib/utils/parse-query";

type SuccessResponse = {
  status: "ok";
  data: {
    lat: number;
    lon: number;
  };
};

type ErrorResponse = {
  status: "error";
  message: string;
  errors?: Record<string, string[]>;
};

export async function GET(request: Request) {
  try {
    const rawParams = getQueryParams(request.url);

    const parsed = locationQuerySchema.safeParse(rawParams);

    if (!parsed.success) {
      return NextResponse.json<ErrorResponse>(
        {
          status: "error",
          message: "Invalid query parameters",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { lat, lon } = parsed.data;

    return NextResponse.json<SuccessResponse>({
      status: "ok",
      data: { lat, lon },
    });
  } catch (error) {
    return NextResponse.json<ErrorResponse>(
      {
        status: "error",
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
