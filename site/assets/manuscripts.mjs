// Static records remain readable when JavaScript is unavailable.
export function normaliseManuscriptSearch(value) {
  return String(value).normalize("NFKC").toLowerCase()
    .replace(/[\u0640\u064b-\u065f\u0670\u06d6-\u06ed]/g, "")
    .replace(/[\u0660-\u0669]/g, c => String(c.charCodeAt(0) - 0x660))
    .replace(/[\u06f0-\u06f9]/g, c => String(c.charCodeAt(0) - 0x6f0))
    .replace(/[أإآٱ]/g, "ا").replace(/\s+/g, " ").trim();
}
export function matchesManuscript(record, { query = "", family = "all", classification = "all", state = "all" } = {}) {
  if (family !== "all" && record.family !== family) return false;
  if (classification !== "all" && record.classification !== classification) return false;
  if (state !== "all" && record.state !== state) return false;
  const normal = normaliseManuscriptSearch(query).replace(/\b(\d+)\s*[:.]\s*(\d+)\b/g, "$1:$2");
  const verse = normal.match(/\b\d+:\d+\b/);
  if (verse && record.verse !== verse[0]) return false;
  const shelfmark = normal.match(/\bmarcel\s*(\d+)\b/);
  if (shelfmark) {
    const witnessShelfmark = normaliseManuscriptSearch(record.witness || "").match(/\bmarcel\s*(\d+)\b/);
    if (witnessShelfmark?.[1] !== shelfmark[1]) return false;
  }
  const terms = normal.replace(/\bmarcel\s*\d+\b/, "").split(/\s+/).filter(Boolean);
  const haystack = normaliseManuscriptSearch(record.text + " " + record.verse);
  return terms.every(term => term === verse?.[0] || haystack.includes(term));
}
if (typeof document !== "undefined") {
  const form = document.querySelector("#manuscript-filters");
  if (form) {
    const search = document.querySelector("#manuscript-search");
    const family = document.querySelector("#manuscript-family");
    const classification = document.querySelector("#manuscript-class");
    const state = document.querySelector("#manuscript-state");
    const count = document.querySelector("#manuscript-count");
    const empty = document.querySelector("#manuscript-empty");
    const cards = [...document.querySelectorAll(".manuscript-record")].map(element => ({
      element, family: element.dataset.family, classification: element.dataset.class,
      state: element.dataset.state, verse: element.dataset.verse,
      witness: element.querySelector(".manuscript-witness").textContent, text: element.textContent
    }));
    const update = () => {
      let visible = 0;
      for (const record of cards) {
        const show = matchesManuscript(record, { query: search.value, family: family.value, classification: classification.value, state: state.value });
        record.element.hidden = !show;
        if (show) visible++;
      }
      count.textContent = visible + " of " + cards.length + " comparisons displayed";
      empty.hidden = visible !== 0;
    };
    form.addEventListener("submit", event => event.preventDefault());
    search.addEventListener("input", update);
    for (const field of [family, classification, state]) field.addEventListener("change", update);
    form.addEventListener("reset", () => queueMicrotask(update));
    form.hidden = false;
    update();
    // Opening a permanent record must not leave it hidden by active filters.
    window.addEventListener("hashchange", () => {
      const record = cards.find(card => "#" + card.element.id === location.hash);
      if (record?.element.hidden) {
        form.reset();
        queueMicrotask(() => record.element.scrollIntoView({ block: "start" }));
      }
    });
  }
}
