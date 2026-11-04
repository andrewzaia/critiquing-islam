import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {runInNewContext} from "node:vm";
import {onRequestGet} from "../functions/api/quran.js";

const request = (verse, kind = "qiraat") =>
  new Request("https://example.org/api/quran?kind=" + kind + "&verse=" + verse);
const run = (verse, env = {}, kind = "qiraat") =>
  onRequestGet({request: request(verse, kind), env});
assert.equal((await (await run("0:999")).json()).status, "invalid_reference");
assert.equal((await (await run("1:4")).json()).status, "not_configured");
assert.equal((await (await run("1:4",
  {QF_CLIENT_ID:"id",QF_CLIENT_SECRET:"secret",QF_ENV:"prelive"})).json()).status,
"production_required");

const officialShape = verse => ({
  verse:{verse_key:verse, chapter_number:Number(verse.split(":")[0]),
    verse_number:Number(verse.split(":")[1]), text:"Arabic verse",text_field:"text_uthmani"},
  navigation:{previous_verse:null,next_verse:{verse_key:"2:6"}},
  readers:[{id:1,name:"Nafi",translated_name:"Nafi",position:1}],
  transmitters:[{id:1,name:"Qalun",reader_id:1,position:1}],
  junctures:[{
    id:10, position:1, verse_key:verse, verse_range:verse, cross_verse:false,
    text:"Arabic source", category:"A", readings:[{
      id:20,position:1,text:"Arabic alternative",text_uthmani:"Arabic alternative",
      translation:"Supplied meaning",transliteration:"maliki",
      matrix:{readers:[1],transmitters:[1],cells:[{reader_id:1,transmitter_id:1,type:"transmitter"}]}
    }], combined_translation:"Combined source gloss"
  }],
  meta:{language:"en",direction:"ltr",text_field:"text_uthmani",total_junctures:1,total_readings:1}
});
const originalFetch = globalThis.fetch;
let payloadMode = "valid";
try {
  let tokenCalls=0, matrixCalls=0;
  const tokenScopes=[];
  globalThis.fetch = async (url, options) => {
    if (url.includes("/oauth2/token")) {
      tokenCalls++;
      assert.ok(options.headers.Authorization.startsWith("Basic "));
      tokenScopes.push(new URLSearchParams(options.body).get("scope"));
      return new Response(JSON.stringify({access_token:"mock-token",expires_in:3600}),{status:200});
    }
    matrixCalls++;
    assert.ok(url.startsWith("https://apis.quran.foundation/content/api/v4/qiraat/matrix/by_verse/"));
    assert.equal(options.headers["x-auth-token"],"mock-token");
    const verse = url.match(/by_verse\/(\d+:\d+)/)?.[1];
    assert.ok(verse);
    const shape = officialShape(verse);
    if (payloadMode === "invalid") shape.junctures[0].readings[0].matrix = null;
    if (payloadMode === "mismatch") shape.verse.verse_key = "99:99";
    return new Response(JSON.stringify(shape),{status:200});
  };
  const env={QF_CLIENT_ID:"test-qf-id",QF_CLIENT_SECRET:"private-test-secret",QF_ENV:"production"};
  const first=await run("1:4",env);
  assert.equal(first.status,200);
  const body=await first.text();
  assert.equal(JSON.parse(body).status,"ok");
  assert.ok(!body.includes("private-test-secret"));
  assert.deepEqual(JSON.parse(body).data.junctures[0].readings[0].matrix.transmitters,[1]);
  assert.equal((await (await run("2:184",env)).json()).status,"ok");
  assert.equal(tokenCalls,1,"OAuth token should be reused for the same approved scope");

  const parentEnv={...env,QF_QIRAAT_SCOPE:"qiraat"};
  assert.equal((await (await run("1:4",parentEnv)).json()).status,"ok");
  assert.deepEqual(tokenScopes,["qiraat.read","qiraat"]);
  assert.equal(tokenCalls,2,"Parent scope must have its own cached token");

  const untrustedEnv={...env,QF_QIRAAT_SCOPE:"admin unrestricted"};
  assert.equal((await (await run("1:4",untrustedEnv)).json()).status,"ok");
  assert.deepEqual(tokenScopes,["qiraat.read","qiraat"],"Do not request arbitrary scopes");

  payloadMode="invalid";
  assert.equal((await (await run("1:4",env)).json()).status,"invalid_upstream_response");
  payloadMode="mismatch";
  assert.equal((await (await run("1:4",env)).json()).status,"invalid_upstream_response");
  assert.equal(matrixCalls,6);
} finally {
  globalThis.fetch = originalFetch;
}

// Exercise the real browser renderer against the provider's documented matrix structure.
// This is a lightweight DOM simulation, not a physical browser test.
const elements = new Map();
const makeElement = tag => ({
  tag, children:[], attributes:{}, textContent:"", className:"", hidden:false,
  append(...nodes){this.children.push(...nodes);},
  replaceChildren(...nodes){this.children=[...nodes];},
  setAttribute(name,value){this.attributes[name]=value;}
});
for (const id of ["qf-live-panel","qf-live-status","qf-live-results"]) elements.set(id,makeElement("div"));
const events = new Map();
const document = {
  getElementById:id => elements.get(id),
  createElement:makeElement,
  addEventListener:(type,cb) => events.set(type,cb)
};
runInNewContext(await readFile("site/assets/qf-live.js","utf8"),{
  document,
  fetch:async () => new Response(JSON.stringify({status:"ok",data:officialShape("1:4")}),{status:200}),
  encodeURIComponent,
  console
});
events.get("qiraat:verse")({detail:{key:"1:4"}});
await new Promise(resolve => setTimeout(resolve, 15));
const texts = node => [node.textContent,...node.children.flatMap(texts)].filter(Boolean).join(" ");
const rendered = texts(elements.get("qf-live-results"));
for (const expected of ["Nafi","Qalun","Arabic alternative","maliki","Supplied meaning",
  "Combined source gloss","Meaning-affecting"]) {
  assert.ok(rendered.includes(expected),"The provider matrix view did not render " + expected);
}
assert.equal(elements.get("qf-live-panel").hidden,false);
console.log("Quran Foundation proxy and browser renderer tests passed against documented mocked schema.");
