import { NormalizedWeather } from "@/lib/weather/types/weather.types";

export type WeatherSuccessResponse = {
  status: "ok";
  data: {
    lat: number;
    lon: number;
    weather: NormalizedWeather;
  };
};

export type WeatherErrorResponse = {
  status: "error";
  message: string;
  errors?: Record<string, string[]>;
};
