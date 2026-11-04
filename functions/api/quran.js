// Cloudflare Pages Function. Secrets are never returned to the browser.
// Quran Foundation API: https://api-docs.quran.com/docs/quickstart/
const tokenCache = new Map();
const json = (body, status = 200, cache = "no-store") => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": cache,
    "X-Content-Type-Options": "nosniff" }
});
const isVerse = key => /^(?:[1-9]|[1-9][0-9]|1[01][0-9]|11[0-4]):[1-9][0-9]{0,2}$/.test(key);
async function getToken(env, scope, hosts, refresh = false) {
  const id = env.QF_CLIENT_ID, secret = env.QF_CLIENT_SECRET;
  if (!id || !secret) throw new Error("not_configured");
  const cacheKey = hosts.oauth + "|" + id + "|" + scope;
  const cached = tokenCache.get(cacheKey);
  if (!refresh && cached && cached.expires > Date.now() + 60000) return cached.value;
  const credentials = btoa(id + ":" + secret);
  const res = await fetch(hosts.oauth + "/oauth2/token", {
    method: "POST",
    headers: { Authorization: "Basic " + credentials, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({grant_type: "client_credentials", scope}).toString(),
    signal: AbortSignal.timeout(10000)
  });
  if (!res.ok) throw new Error(res.status === 400 || res.status === 403 ? "scope_or_credentials" : "auth_unavailable");
  const data = await res.json();
  if (typeof data.access_token !== "string") throw new Error("auth_unavailable");
  tokenCache.set(cacheKey, {value: data.access_token, expires: Date.now() + Math.max(60, Number(data.expires_in) || 3600) * 1000});
  return data.access_token;
}
export async function onRequestGet({request, env}) {
  const url = new URL(request.url);
  const verse = url.searchParams.get("verse") || "";
  const kind = url.searchParams.get("kind") || "qiraat";
  if (!isVerse(verse) || !["qiraat", "verse"].includes(kind)) return json({status:"invalid_reference"}, 400);
  if (!env.QF_CLIENT_ID || !env.QF_CLIENT_SECRET) return json({status:"not_configured"}, 503);
  const production = env.QF_ENV === "production";
  if (kind === "qiraat" && !production) return json({status:"production_required"}, 503);
  const hosts = production
    ? {oauth:"https://oauth2.quran.foundation", api:"https://apis.quran.foundation"}
    : {oauth:"https://prelive-oauth2.quran.foundation", api:"https://apis-prelive.quran.foundation"};
  // Some approved clients receive the parent "qiraat" scope, not "qiraat.read".
  // Keep this strictly allowlisted so configuration cannot request unrelated scopes.
  const scope = kind === "qiraat"
    ? (env.QF_QIRAAT_SCOPE === "qiraat" ? "qiraat" : "qiraat.read")
    : (env.QF_CONTENT_SCOPE || "content");
  const path = kind === "qiraat"
    ? "/content/api/v4/qiraat/matrix/by_verse/" + verse + "?language=en"
    : "/content/api/v4/verses/by_key/" + verse + "?fields=text_uthmani&language=en";
  try {
    const load = async refresh => {
      const token = await getToken(env, scope, hosts, refresh);
      return fetch(hosts.api + path, {
        headers: {"x-auth-token":token, "x-client-id":env.QF_CLIENT_ID},
        signal: AbortSignal.timeout(12000)
      });
    };
    let upstream = await load(false);
    if (upstream.status === 401) upstream = await load(true);
    if (upstream.status === 404) return json({status:"no_record"}, 200, "public, max-age=1800");
    if (upstream.status === 403) return json({status:"scope_required"}, 503);
    if (upstream.status === 429) return json({status:"rate_limited"}, 503);
    if (!upstream.ok) return json({status:"upstream_unavailable"}, 502);
    const data = await upstream.json();
    if (kind === "qiraat" && (
      data?.verse?.verse_key !== verse ||
      !Array.isArray(data.junctures) ||
      !Array.isArray(data.readers) ||
      !Array.isArray(data.transmitters) ||
      data.junctures.some(j => !Array.isArray(j.readings) ||
        j.readings.some(r => !r.matrix ||
          !Array.isArray(r.matrix.readers) || !Array.isArray(r.matrix.transmitters)))
    )) {
      return json({status:"invalid_upstream_response"}, 502);
    }
    if (kind === "verse" && !data.verse) return json({status:"invalid_upstream_response"}, 502);
    return json({status:"ok", source:"Quran Foundation", data}, 200, "public, max-age=300, stale-while-revalidate=900");
  } catch (error) {
    const status = ["not_configured","scope_or_credentials","auth_unavailable"].includes(error.message) ? error.message : "upstream_unavailable";
    return json({status}, 503);
  }
}
