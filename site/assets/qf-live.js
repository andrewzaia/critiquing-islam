(() => {
  "use strict";
  const panel = document.getElementById("qf-live-panel");
  if (!panel) return;
  const state = document.getElementById("qf-live-status");
  const result = document.getElementById("qf-live-results");
  let sequence = 0;
  const element = (tag, className, value) => {
    const item = document.createElement(tag);
    if (className) item.className = className;
    if (value !== undefined && value !== null) item.textContent = String(value);
    return item;
  };
  const note = (text, cls = "") => element("p", "qiraat-note " + cls, text);
  const categories = {A:"Potentially meaning-affecting variation", B:"Orthographic variation with the same meaning", C:"Phonetic variation only"};
  const names = (ids, dictionary) => ids.map(id => dictionary.get(id) || "Unidentified source #" + id).join(", ");
  function display(data, key) {
    const readers = new Map((data.readers || []).map(x => [x.id, x.translated_name || x.name]));
    const transmitters = new Map((data.transmitters || []).map(x => [x.id, x.translated_name || x.name]));
    result.replaceChildren();
    result.append(note("Quran Foundation source matrix for " + key + ". Entries are specific differences, not complete independent Arabic editions."));
    const list = data.junctures || [];
    if (!list.length) { result.append(note("No approved junctures returned in this response.")); return; }
    for (const junction of list) {
      const item = element("article", "qf-juncture");
      item.append(element("h4", "", categories[junction.category] || "Recorded reading variation"));
      if (junction.text) {
        const base = element("p", "qf-arabic", junction.text);
        base.lang = "ar"; base.dir = "rtl"; base.translate = false;
        item.append(base);
      }
      if (junction.verse_range) item.append(note("Position: " + junction.verse_range));
      for (const reading of junction.readings || []) {
        const row = element("div", "qf-reading");
        const arabic = element("p", "qf-arabic", reading.text || reading.text_uthmani || "");
        arabic.lang = "ar"; arabic.dir = "rtl"; arabic.translate = false;
        row.append(arabic);
        const axis = reading.matrix || {};
        if ((axis.transmitters || []).length) row.append(note("Transmitters: " + names(axis.transmitters, transmitters)));
        if ((axis.readers || []).length) row.append(note("Readers: " + names(axis.readers, readers)));
        if (reading.translation) row.append(note("Provided meaning: " + reading.translation));
        if (reading.transliteration) row.append(note("Transliteration: " + reading.transliteration));
        item.append(row);
      }
      result.append(item);
    }
  }
  async function load(key) {
    const id = ++sequence;
    panel.hidden = false;
    state.textContent = "Checking Quran Foundation for " + key + "...";
    result.replaceChildren();
    try {
      const response = await fetch("/api/quran?kind=qiraat&verse=" + encodeURIComponent(key), {headers:{"Accept":"application/json"}});
      const payload = await response.json();
      if (id !== sequence) return;
      if (payload.status === "ok") {
        display(payload.data, key);
        state.textContent = "Live source: Quran Foundation. Local readings remain available above.";
      } else if (payload.status === "no_record") {
        state.textContent = "The API returned no approved matrix for this verse. This does not establish that every recitation is identical.";
      } else {
        const labels = {
          production_required:"Live Qira'at comparisons require production API access.",
          not_configured:"Live API credentials are not configured. The locally hosted comparison remains available.",
          scope_required:"The API application requires approved qiraat.read permission.",
          scope_or_credentials:"The API credentials or their approved scopes need attention.",
          rate_limited:"The provider is rate limiting requests. Local data remain available.",
          upstream_unavailable:"The live source is currently unavailable. Local data remain available."
        };
        state.textContent = labels[payload.status] || "Live comparison is not available. Local data remain available.";
      }
    } catch {
      if (id === sequence) state.textContent = "Live comparison is unavailable on this deployment. Local data remain available.";
    }
  }
  document.addEventListener("qiraat:verse", event => {
    const key = event.detail && event.detail.key;
    if (/^\d{1,3}:\d{1,3}$/.test(key || "")) load(key);
  });
})();