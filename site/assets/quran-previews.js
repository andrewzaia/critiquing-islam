// Sitewide, non-invasive Quran reference hovercard. Uses locally hosted Cairo/Hafs Arabic.
const REFERENCE_PATTERN = /(?<![0-9:])(\d{1,3}:\d{1,3}(?:\s*[-\u2013\u2014]\s*(?:(?:\d{1,3}):)?\d{1,3})?)(?![0-9])/g;
const QURAN_CUE = /\b(?:Quran|Qur['’]an|Qurʾān|Qurān|Koran)(?:\s+(?:verses?|ayahs?))?\s*$/i;
const CONTINUATION = /^\s*(?:(?:[,;]\s*)(?:(?:and|or)\s*)?|(?:and|or)\s+)$/i;
const MAX_VERSES = 12;

export function parseQuranReference(input) {
  const m = /^\s*(\d{1,3}):(\d{1,3})(?:\s*[-\u2013\u2014]\s*(?:(\d{1,3}):)?(\d{1,3}))?\s*$/.exec(String(input));
  if (!m) return null;
  const chapter = +m[1], verse = +m[2], lastChapter = m[3] ? +m[3] : chapter;
  const lastVerse = m[4] ? +m[4] : verse;
  if (chapter < 1 || chapter > 114 || verse < 1 || lastChapter < 1 ||
      lastChapter > 114 || lastVerse < 1 || chapter > lastChapter ||
      (chapter === lastChapter && verse > lastVerse)) return null;
  return {
    chapter, verse, lastChapter, lastVerse,
    key: chapter + ":" + verse,
    label: chapter + ":" + verse + (m[4] ? "-" + (m[3] ? lastChapter + ":" : "") + lastVerse : "")
  };
}

export function findQuranReferences(text) {
  const found = [];
  let previousEnd = -1;
  for (const match of String(text).matchAll(REFERENCE_PATTERN)) {
    const start = match.index;
    const cue = QURAN_CUE.test(text.slice(Math.max(0, start - 48), start));
    const continuous = previousEnd >= 0 && CONTINUATION.test(text.slice(previousEnd, start));
    const ref = parseQuranReference(match[1]);
    if (!ref || (!cue && !continuous)) { previousEnd = -1; continue; }
    found.push({start, end: start + match[1].length, ref});
    previousEnd = start + match[1].length;
  }
  return found;
}

export function expandQuranRange(ref, counts, max = MAX_VERSES) {
  if (!ref || !Array.isArray(counts) || counts.length !== 114 ||
      !Number.isInteger(max) || max < 1 ||
      ref.verse > counts[ref.chapter - 1] || ref.lastVerse > counts[ref.lastChapter - 1]) return null;
  const ordinal = (chapter, verse) => counts.slice(0, chapter - 1).reduce((a, b) => a + b, 0) + verse;
  const total = ordinal(ref.lastChapter, ref.lastVerse) - ordinal(ref.chapter, ref.verse) + 1;
  if (total < 1) return null;
  const items = [];
  let chapter = ref.chapter, verse = ref.verse;
  for (let i = 0; i < Math.min(total, max); i++) {
    items.push({chapter, verse, key: chapter + ":" + verse});
    if (verse >= counts[chapter - 1]) { chapter++; verse = 1; }
    else verse++;
  }
  return {items, total, omitted: total - items.length};
}

function startPreviews() {
  const main = document.querySelector("main");
  if (!main) return;
  const dataCache = new Map();
  const link = (ref) => "/quran/?verse=" + encodeURIComponent(ref.key);
  const identifyLink = (anchor) => {
    try {
      const url = new URL(anchor.href, location.href);
      if (url.hostname !== "quran.com" && url.hostname !== "www.quran.com") return null;
      const m = /^\/(\d{1,3})\/(\d{1,3})(?:-(\d{1,3}))?\/?$/.exec(url.pathname);
      return m ? parseQuranReference(m[1] + ":" + m[2] + (m[3] ? "-" + m[3] : "")) : null;
    } catch { return null; }
  };
  for (const anchor of main.querySelectorAll("a[href]")) {
    const ref = identifyLink(anchor);
    if (ref) { anchor.dataset.quranReference = ref.label; anchor.classList.add("quran-preview-source"); }
  }
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  const changes = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.nodeValue || !node.parentElement ||
        node.parentElement.closest("script,style,textarea,input,select,button,pre,code,svg,[data-no-quran-preview]")) continue;
    const parentLink = node.parentElement.closest("a[href]");
    if (parentLink?.dataset.quranReference) continue;
    const matches = findQuranReferences(node.nodeValue);
    if (matches.length) changes.push({node, parentLink, matches});
  }
  for (const {node, parentLink, matches} of changes) {
    const fragment = document.createDocumentFragment();
    let position = 0;
    for (const {start, end, ref} of matches) {
      fragment.append(document.createTextNode(node.nodeValue.slice(position, start)));
      const tag = document.createElement(parentLink ? "span" : "a");
      tag.className = "quran-preview-reference";
      tag.dataset.quranReference = ref.label;
      tag.textContent = node.nodeValue.slice(start, end);
      // Preserve existing card links without attaching a preview to their whole surface.
      // Only the citation span is a hover target inside a linked card.
      if (!parentLink) {
        tag.href = link(ref);
        tag.setAttribute("aria-label", "Preview Quran " + ref.label + "; open reading explorer");
      }
      fragment.append(tag);
      position = end;
    }
    fragment.append(document.createTextNode(node.nodeValue.slice(position)));
    node.replaceWith(fragment);
  }

  const make = (tag, className, text) => {
    const elem = document.createElement(tag);
    if (className) elem.className = className;
    if (text !== undefined) elem.textContent = String(text);
    return elem;
  };
  const popup = make("aside", "quran-preview-card");
  popup.id = "quran-reference-popup";
  popup.hidden = true;
  popup.setAttribute("role", "dialog");
  popup.setAttribute("aria-label", "Quran verse preview");
  popup.setAttribute("aria-modal", "false");
  const header = make("div", "quran-preview-header");
  const heading = make("strong", "quran-preview-heading");
  const close = make("button", "quran-preview-close", "Close");
  close.type = "button";
  close.setAttribute("aria-label", "Close Quran verse preview");
  header.append(heading, close);
  const detail = make("p", "quran-preview-source-note", "Cairo 1924 / Hafs Arabic reference");
  const body = make("div", "quran-preview-body");
  const summary = make("p", "quran-preview-summary");
  const actions = make("div", "quran-preview-actions");
  const explore = make("a", "", "Compare readings");
  const translations = make("a", "", "Translations at Quran.com");
  translations.target = "_blank";
  translations.rel = "noopener noreferrer";
  actions.append(explore, translations);
  const provenance = make("p", "quran-preview-provenance",
    "Locally hosted Cairo/Hafs Arabic and scholarly transliteration. Transliteration is not an English translation; other Qira'at may differ.");
  popup.append(header, detail, body, summary, actions, provenance);
  document.body.append(popup);

  let active = null, serial = 0, hideTimer, lastTouchRef = null, touchPending = false;
  const cacheJson = (key) => {
    if (!dataCache.has(key)) {
      dataCache.set(key, fetch("/data/qiraat/" + key + ".json", {cache: "force-cache"})
        .then(response => {
          if (!response.ok) throw new Error("Quran source data could not be loaded");
          return response.json();
        }).catch(error => { dataCache.delete(key); throw error; }));
    }
    return dataCache.get(key);
  };
  function reposition() {
    if (!active || popup.hidden || !active.isConnected) return;
    const rect = active.getBoundingClientRect();
    const width = popup.offsetWidth, height = popup.offsetHeight;
    const left = Math.max(10, Math.min(rect.left, window.innerWidth - width - 10));
    const beneath = rect.bottom + 9;
    const above = rect.top - height - 9;
    const top = beneath + height <= window.innerHeight - 10 ? beneath :
      above >= 10 ? above : Math.max(10, Math.min(beneath, window.innerHeight - height - 10));
    popup.style.left = left + "px";
    popup.style.top = top + "px";
  }
  function hide() {
    clearTimeout(hideTimer);
    popup.hidden = true;
    active?.removeAttribute("aria-controls");
    active = null;
    lastTouchRef = null;
    serial++;
  }
  function scheduleHide() {
    clearTimeout(hideTimer);
    if (lastTouchRef) return;
    hideTimer = setTimeout(() => {
      if (popup.matches(":hover") || active?.matches(":hover") ||
          (active && document.activeElement === active) || popup.contains(document.activeElement)) return;
      hide();
    }, 150);
  }
  async function show(target, pin = false) {
    clearTimeout(hideTimer);
    if (active && active !== target) active.removeAttribute("aria-controls");
    active = target;
    if (pin) lastTouchRef = target;
    target.setAttribute("aria-controls", popup.id);
    const ref = parseQuranReference(target.dataset.quranReference);
    if (!ref) { hide(); return; }
    const thisRequest = ++serial;
    popup.hidden = false;
    heading.textContent = "Quran " + ref.label;
    explore.href = link(ref);
    translations.href = "https://quran.com/" + ref.chapter + "/" + ref.verse +
      (ref.lastChapter === ref.chapter && ref.lastVerse !== ref.verse ? "-" + ref.lastVerse : "");
    body.replaceChildren(make("p", "quran-preview-loading", "Loading verses..."));
    summary.textContent = "";
    reposition();
    try {
      const manifest = await cacheJson("manifest");
      if (thisRequest !== serial) return;
      const expanded = expandQuranRange(ref, manifest.counts);
      if (!expanded) {
        body.replaceChildren(make("p", "quran-preview-error", "This reference is outside the local Quran numbering."));
        reposition();
        return;
      }
      const chapterData = new Map(await Promise.all([...new Set(expanded.items.map(v => v.chapter))]
        .map(async chapter => [chapter, await cacheJson(chapter)])));
      if (thisRequest !== serial) return;
      body.replaceChildren();
      for (const item of expanded.items) {
        const chapter = chapterData.get(item.chapter);
        const words = chapter?.verses?.[item.verse - 1];
        if (!words?.length) throw new Error("Missing verse text in local corpus");
        const section = make("section", "quran-preview-verse");
        section.append(make("h3", "", item.key));
        const arabic = make("p", "quran-preview-arabic", words.map(w => w[0]).join(" "));
        arabic.dir = "rtl"; arabic.lang = "ar"; arabic.translate = false;
        section.append(arabic, make("p", "quran-preview-latin", words.map(w => w[1]).join(" ")));
        body.append(section);
      }
      summary.textContent = expanded.omitted
        ? "Showing the first " + expanded.items.length + " of " + expanded.total +
          " verses in this range. Follow the source link for the rest."
        : expanded.total > 1 ? expanded.total + " verses in this range." : "";
      reposition();
    } catch {
      if (thisRequest !== serial) return;
      body.replaceChildren(make("p", "quran-preview-error", "Verse preview is currently unavailable. The reference link still works."));
      reposition();
    }
  }

  const refTarget = node => node?.closest?.(".quran-preview-reference, a.quran-preview-source");
  document.addEventListener("pointerover", event => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    const target = refTarget(event.target);
    if (target && target !== active) show(target);
    else if (target) clearTimeout(hideTimer);
  });
  document.addEventListener("pointerout", event => {
    const target = refTarget(event.target);
    if (target && target === active && !target.contains(event.relatedTarget)) scheduleHide();
  });
  document.addEventListener("pointerdown", event => {
    touchPending = event.pointerType === "touch";
  }, true);
  document.addEventListener("focusin", event => {
    if (touchPending) return;
    const target = refTarget(event.target);
    if (target) show(target);
  });
  document.addEventListener("focusout", event => {
    if (event.target === active) scheduleHide();
  });
  document.addEventListener("click", event => {
    if (popup.contains(event.target)) return;
    const target = refTarget(event.target);
    if (touchPending && target) {
      touchPending = false;
      if (target !== lastTouchRef || popup.hidden) {
        event.preventDefault();
        show(target, true);
      } else {
        lastTouchRef = null;
      }
      return;
    }
    touchPending = false;
    if (!target) hide();
  });
  popup.addEventListener("pointerenter", () => clearTimeout(hideTimer));
  popup.addEventListener("pointerleave", scheduleHide);
  popup.addEventListener("focusout", scheduleHide);
  close.addEventListener("click", () => { const source = active; hide(); source?.focus?.(); });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !popup.hidden) { const source = active; hide(); source?.focus?.(); }
  });
  window.addEventListener("resize", reposition);
  window.addEventListener("scroll", reposition, {passive: true, capture: true});
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startPreviews, {once: true});
  else startPreviews();
}
