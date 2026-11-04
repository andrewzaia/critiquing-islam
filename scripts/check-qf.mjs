import assert from "node:assert/strict";
import {onRequestGet} from "../functions/api/quran.js";
const request = verse => new Request("https://example.org/api/quran?kind=qiraat&verse=" + verse);
const run = (verse, env = {}) => onRequestGet({request:request(verse), env});
{
  const res = await run("0:999");
  assert.equal(res.status, 400);
  assert.equal((await res.json()).status, "invalid_reference");
}
{
  const res = await run("1:4");
  assert.equal(res.status, 503);
  assert.equal((await res.json()).status, "not_configured");
}
{
  const res = await run("1:4", {QF_CLIENT_ID:"id", QF_CLIENT_SECRET:"secret", QF_ENV:"prelive"});
  assert.equal((await res.json()).status, "production_required");
}
const originalFetch = globalThis.fetch;
try {
  let tokenCalls = 0, matrixCalls = 0;
  globalThis.fetch = async (url, options) => {
    if (url.includes("/oauth2/token")) {
      tokenCalls++;
      assert.ok(options.headers.Authorization.startsWith("Basic "));
      assert.equal(new URLSearchParams(options.body).get("scope"), "qiraat.read");
      return new Response(JSON.stringify({access_token:"mock-token",expires_in:3600}),{status:200});
    }
    matrixCalls++;
    assert.ok(url.includes("/qiraat/matrix/by_verse/1:4"));
    assert.equal(options.headers["x-auth-token"], "mock-token");
    return new Response(JSON.stringify({verse:{verse_key:"1:4"}, readers:[], transmitters:[], junctures:[], meta:{}}),{status:200});
  };
  const env = {QF_CLIENT_ID:"test-qf-id", QF_CLIENT_SECRET:"private-test-secret", QF_ENV:"production"};
  const first = await run("1:4",env);
  assert.equal(first.status,200);
  const body = await first.text();
  assert.equal(JSON.parse(body).status,"ok");
  assert.ok(!body.includes("private-test-secret"));
  await run("2:184",env);
  assert.equal(tokenCalls,1,"OAuth token must be cached");
  assert.equal(matrixCalls,2);
} finally {
  globalThis.fetch = originalFetch;
}
console.log("Quran Foundation proxy tests passed (mocked HTTP; no production credentials used).");
