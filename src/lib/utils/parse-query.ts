export function getQueryParams(url: string) {
  const { searchParams } = new URL(url);

  return {
    lat: searchParams.get("lat"),
    lon: searchParams.get("lon"),
  };
}
