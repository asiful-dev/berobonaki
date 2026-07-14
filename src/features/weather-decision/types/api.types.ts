export type WeatherSuccessResponse = {
  status: "ok";
  data: {
    lat: number;
    lon: number;
  };
};

export type WeatherErrorResponse = {
  status: "error";
  message: string;
  errors?: Record<string, string[]>;
};
