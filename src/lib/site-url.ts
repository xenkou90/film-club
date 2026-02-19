export function getSiteUrl() {
  // Preferred: explicit env var
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl;

  // Fallback for local dev if env is missing
  return "http://localhost:3000";
}
