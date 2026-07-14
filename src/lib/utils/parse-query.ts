export function getQueryParams(url: string) {
  const { searchParams } = new URL(url);

  return {
    lat: searchParams.get("lat") ?? undefined,
    lon: searchParams.get("lon") ?? undefined,
  };
}
