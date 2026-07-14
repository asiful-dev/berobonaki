import { NextResponse } from "next/server";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      status: "ok",
      data,
    },
    { status },
  );
}

export function errorResponse(
  message: string,
  status = 400,
  errors?: Record<string, string[]>,
) {
  return NextResponse.json(
    {
      status: "error",
      message,
      errors,
    },
    { status },
  );
}
