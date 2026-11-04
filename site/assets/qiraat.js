(() => {
  "use strict";
  if (!document.getElementById("qiraat-page")) return;
  const $ = id => document.getElementById(id);
  const prefix = "/data/qiraat/";
  const cache = new Map();
  let manifest, indexData, current, serial = 0;
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  };
  const setStatus = (msg, err = false) => {
    $("qiraat-status").textContent = msg;
    $("qiraat-status").classList.toggle("is-error", err);
  };
  const fetchJson = async url => {
    const response = await fetch(url, { cache: "force-cache" });
    if (!response.ok) throw new Error("Could not load source data (" + response.status + ")");
    return response.json();
  };
  const valid = (s, v) => Number.isInteger(s) && Number.isInteger(v) && s >= 1 && s <= 114 && v >= 1 && v <= manifest.counts[s - 1];
  const getChapter = async s => {
    if (!cache.has(s)) cache.set(s, fetchJson(prefix + s + ".json").then(data => {
      if (data.surah !== s || data.verses.length !== manifest.counts[s - 1]) throw new Error("Chapter metadata mismatch");
      return data.verses;
    }).catch(e => { cache.delete(s); throw e; }));
    return cache.get(s);
  };
  const differences = (words, reader) => words.flatMap((w, i) => {
    const word = w[2] && w[2][reader];
    return word ? [{ n: i + 1, arabic: w[0], baseline: w[1], reading: word }] : [];
  });
  function renderReadings() {
    const holder = $("qiraat-readings");
    holder.replaceChildren();
    let shown = 0;
    const words = current.words;
    for (let group = 0; group < 7; group++) {
      const section = make("section", "qiraat-reader");
      section.append(make("h3", "", manifest.readers[group]));
      let groupCount = 0;
      for (const reader of [group * 2, group * 2 + 1]) {
        const diff = differences(words, reader);
        if (!diff.length && !$("qiraat-show-all").checked) continue;
        shown++; groupCount++;
        const card = make("article", "qiraat-transmission");
        const heading = make("div", "qiraat-trans-head");
        heading.append(make("h4", "", manifest.transmitters[reader]));
        heading.append(make("small", "", diff.length ? diff.length + " variant word(s)" : "No variant recorded"));
        card.append(heading);
        const line = make("p", "qiraat-comparison-latin");
        line.setAttribute("lang", "ar-Latn");
        words.forEach((w, i) => {
          const val = w[2] && w[2][reader];
          line.append(make("span", val ? "qiraat-changed" : "", val || w[1]));
          if (i < words.length - 1) line.append(document.createTextNode(" "));
        });
        card.append(line);
        if (!diff.length) card.append(make("p", "qiraat-note", reader === 9
          ? "Hafs is the baseline for this comparison."
          : "No differing word is recorded in this dataset for this transmission."));
        else {
          const list = make("ul", "qiraat-word-list");
          diff.forEach(d => {
            const li = make("li");
            li.append(make("span", "qiraat-pos", "Word " + d.n));
            li.append(make("span", "qiraat-muted", d.baseline));
            li.append(make("span", "qiraat-muted", "to"));
            li.append(make("strong", "", d.reading));
            const ar = make("span", "qiraat-original-arabic", d.arabic);
            ar.dir = "rtl"; ar.lang = "ar";
            li.append(ar);
            list.append(li);
          });
          card.append(list);
        }
        section.append(card);
      }
      if (groupCount) holder.append(section);
    }
    if (!shown) holder.append(make("p", "qiraat-note", "No changes recorded. Enable all transmissions to see their reference-aligned lines."));
  }
  const adjacent = (s, v, d) => d < 0
    ? (v > 1 ? [s, v - 1] : s > 1 ? [s - 1, manifest.counts[s - 2]] : null)
    : (v < manifest.counts[s - 1] ? [s, v + 1] : s < 114 ? [s + 1, 1] : null);

  async function openVerse(s, v, setUrl = true) {
    if (!valid(s, v)) { setStatus("Invalid chapter or verse number", true); return; }
    const token = ++serial;
    setStatus("Loading " + s + ":" + v + "...");
    try {
      const verses = await getChapter(s);
      if (token !== serial) return;
      const words = verses[v - 1];
      if (!words || !words.length) throw new Error("This verse has no data");
      current = { s, v, words };
      $("qiraat-surah").value = String(s);
      $("qiraat-ayah").max = String(manifest.counts[s - 1]);
      $("qiraat-ayah").value = String(v);
      $("qiraat-query").value = s + ":" + v;
      $("qiraat-title").textContent = "Surah " + s + ", verse " + v;
      $("qiraat-external").href = "https://quran.com/" + s + "/" + v;
      const arabic = $("qiraat-arabic");
      arabic.replaceChildren();
      let changedWords = 0, gaps = 0;
      const changedReaders = new Set();
      words.forEach((w, i) => {
        const variant = w[2] && Object.keys(w[2]).length;
        const word = make("span", variant ? "qiraat-arabic-changed" : "", w[0]);
        if (w[3] === 1) { word.classList.add("qiraat-unchecked"); gaps++; }
        arabic.append(word);
        arabic.append(document.createTextNode(" "));
        if (variant) { changedWords++; Object.keys(w[2]).forEach(r => changedReaders.add(+r)); }
      });
      $("qiraat-baseline-trans").textContent = words.map(w => w[1]).join(" ");
      $("qiraat-word-note").textContent = gaps
        ? gaps + " word position(s) have no variant record in the source CSV. They are not treated as matching all readers."
        : "Underlined Arabic reference words have a recorded difference in at least one transmission.";
      $("qiraat-counts").textContent = changedWords + " word position(s) differ in " + changedReaders.size + " of 14 transmission lines against Hafs.";
      $("qiraat-prev").disabled = !adjacent(s, v, -1);
      $("qiraat-next").disabled = !adjacent(s, v, 1);
      $("qiraat-verse-panel").hidden = false;
      renderReadings();
      if (setUrl) {
        const url = new URL(location.href);
        url.searchParams.set("verse", s + ":" + v);
        history.replaceState(null, "", url.toString());
      }
      setStatus("Showing " + s + ":" + v + ". Source: local, attributed dataset.");
    } catch (e) { if (token === serial) setStatus(e.message, true); }
  }
  function norm(value) {
    return value.normalize("NFD").toLowerCase().replace(/[\u0300-\u036f]/g, "")
      .replace(/[ʿʾʽʻ]/g, "")
      .replace(/[\u064b-\u065f\u0670\u06d6-\u06ed\u08d3-\u08ff]/g, "")
      .replace(/[ٱأإآ]/g, "ا").replace(/[يىی]/g, "ي")
      .replace(/\u0640/g, "").replace(/\s+/g, " ").trim();
  }
  function showMatches(rows, total, term) {
    $("qiraat-search-results").hidden = false;
    $("qiraat-search-count").textContent = total ? "Showing " + rows.length + " of " + total + " matches for " + term
      : "No matches for " + term;
    const list = $("qiraat-result-list");
    list.replaceChildren();
    for (const [s, v, arabic, roman] of rows) {
      const item = make("button", "qiraat-result");
      item.type = "button";
      item.append(make("strong", "", s + ":" + v));
      const ar = make("span", "qiraat-result-arabic", arabic);
      ar.dir = "rtl"; ar.lang = "ar"; item.append(ar);
      item.append(make("small", "", roman));
      item.addEventListener("click", () => openVerse(s, v));
      list.append(item);
    }
  }
  async function loadSearchIndex() {
    if (indexData) return indexData;
    const rows = [];
    for (let i = 0; i < manifest.searchFiles.length; i += 4) {
      const parts = await Promise.all(manifest.searchFiles.slice(i, i + 4).map(fetchJson));
      parts.forEach(part => rows.push(...part));
    }
    if (rows.length !== manifest.verses) throw new Error("Search index is incomplete");
    indexData = rows;
    return rows;
  }
  async function searchTerm(term) {
    const query = norm(term);
    if (query.length < 2) { setStatus("Enter two or more characters", true); return; }
    const token = ++serial;
    setStatus("Searching all verses...");
    try {
      const rows = await loadSearchIndex();
      if (serial !== token) return;
      const found = [], limit = 40;
      let total = 0;
      for (const row of rows) {
        if (norm(row[2]).includes(query) || norm(row[3]).includes(query)) {
          total++; if (found.length < limit) found.push(row);
        }
      }
      showMatches(found, total, term);
      setStatus("Found " + total + " matching verses.");
    } catch (e) { if (serial === token) setStatus("Search failed: " + e.message, true); }
  }
  function parseRef(input) {
    const m = /^\s*(\d{1,3})\s*[:./]\s*(\d{1,3})(?:\s*-\s*(\d{1,3}))?\s*$/.exec(input);
    return m ? [+m[1], +m[2], m[3] ? +m[3] : null] : null;
  }
  async function searchInput(input) {
    const ref = parseRef(input);
    if (!ref) return searchTerm(input);
    const [s, v, end] = ref;
    if (!valid(s, v) || (end !== null && (!valid(s, end) || end < v || end - v > 19))) {
      setStatus("Invalid reference. Ranges are limited to 20 consecutive verses.", true); return;
    }
    $("qiraat-search-results").hidden = true;
    if (end !== null) {
      try {
        const chapter = await getChapter(s);
        const list = chapter.slice(v - 1, end).map((words, i) =>
          [s, v + i, words.map(w => w[0]).join(" "), words.map(w => w[1]).join(" ")]);
        showMatches(list, list.length, input);
      } catch (e) { setStatus(e.message, true); return; }
    }
    await openVerse(s, v);
  }
  async function start() {
    try {
      manifest = await fetchJson(prefix + "manifest.json");
      if (manifest.counts.length !== 114 || manifest.transmitters.length !== 14) throw new Error("Source metadata invalid");
      const surah = $("qiraat-surah");
      surah.replaceChildren();
      manifest.counts.forEach((_, i) => {
        const opt = make("option", "", i + 1); opt.value = String(i + 1); surah.append(opt);
      });
      surah.addEventListener("change", () => {
        $("qiraat-ayah").max = String(manifest.counts[+surah.value - 1]);
        $("qiraat-ayah").value = "1";
      });
      $("qiraat-search-form").addEventListener("submit", event => {
        event.preventDefault(); searchInput($("qiraat-query").value.trim());
      });
      $("qiraat-jump-form").addEventListener("submit", event => {
        event.preventDefault();
        $("qiraat-search-results").hidden = true;
        openVerse(+surah.value, +$("qiraat-ayah").value);
      });
      document.querySelectorAll("[data-verse]").forEach(button => button.addEventListener("click", () => {
        const [s, v] = button.dataset.verse.split(":").map(Number);
        $("qiraat-search-results").hidden = true; openVerse(s, v);
      }));
      $("qiraat-show-all").addEventListener("change", () => { if (current) renderReadings(); });
      [["qiraat-prev", -1], ["qiraat-next", 1]].forEach(([id, delta]) => $(id).addEventListener("click", () => {
        if (current) { const ref = adjacent(current.s, current.v, delta); if (ref) openVerse(ref[0], ref[1]); }
      }));
      const ref = parseRef(new URL(location.href).searchParams.get("verse") || "");
      await openVerse(ref && valid(ref[0], ref[1]) ? ref[0] : 1,
        ref && valid(ref[0], ref[1]) ? ref[1] : 4, false);
    } catch (e) { setStatus("Could not initialise Quran readings. " + e.message, true); }
  }
  start();
})();