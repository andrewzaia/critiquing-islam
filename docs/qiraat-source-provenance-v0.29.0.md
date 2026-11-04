# Quran qiraat comparison - source and scope audit (v0.29.0)

Date: 2026-11-05

## Sources and licensing

- Primary source project: Corpus Coranicum, originally a Berlin-Brandenburg Academy of Sciences and Humanities project, https://corpuscoranicum.org/en.
- Adapted upstream dataset: Abdul Rahim Nizamani, *Corpus Coranicum Quranic Variants Dataset* (2026), https://github.com/arnizamani/corpus_coranicum_variants_dataset.
- Pinned upstream Git revision: b2f30cb405fe33c92697bd35a6f56fe3e45f03f3.
- Source inputs: data/cairo_quran.json (Arabic Hafs/Cairo 1924 baseline) and data/taisir_variants.csv (attributed word-level variants from al-Dani, *at-Taysir*).
- Derived data licence: Creative Commons Attribution-ShareAlike 4.0, https://creativecommons.org/licenses/by-sa/4.0/. Credit is given on /quran/, /sources/ and in the manifest. The derived JSON data require share-alike treatment on redistribution.

## Coverage and validation

- Hafs/Cairo reference: 114 surahs, 6,236 verses, 77,432 Arabic words.
- CSV: 77,430 source word entries; 2,802 words with an attributed difference; 14,024 transmitter-level assignments after applying reader-level fallback to each of the two transmitters.
- Two CSV omissions, confirmed against the Cairo reference: 2:185:35 (al-usra) and 12:110:11 (fa-nujjiya). These words carry the baseline but no variant attribution, flagged unknown rather than counted as agreement.
- Readings covered: seven canonical readers and fourteen transmissions associated with al-Dani's seven-reader work. The three additional canonical traditions, Abu Jafar, Yaqub and Khalaf al-Ashir, and their six transmitters are not in this source.
- Verse keys use Hafs/Cairo 1924 numbering for alignment. Different riwayat can divide or number verses differently.

## Important evidence limitations

- The complete Arabic verse shown in the browser is only the Hafs reference text.
- Other lines reconstruct scholarly Latin transliteration from the Hafs word positions and the recorded alternatives. They are not independently verified Arabic Quran editions for each transmission.
- Some qiraat differences concern recitation rules, vowel length, phonology and pronunciation outside the word-level subset. A missing documented difference must not be presented as proof of identical recitation.
- No automatic claim of changed meaning is made. Every potentially meaning-bearing difference requires independent philological contextual analysis.
- The public Quran Foundation Qiraat matrix API offers a potential broader coverage path but requires approved production qiraat.read credentials. Secrets must be stored server-side, and provider rights and conditions verified before integration: https://api-docs.quran.com/docs/content_apis_versioned/4.0.0/get-qiraat-matrix-by-verse/.
- Automated tests verify source counts, provenance metadata, static navigation, JS syntax and structural integrity. They do not substitute for linguistic expert validation or physical browser-device testing.

## Implementation

- Static site pages: site/quran/index.html, site/assets/qiraat.js and site/assets/qiraat.css.
- Locally stored data: site/data/qiraat/manifest.json, 114 per-surah JSON shards and 15 keyword-search shards.
- No external API, stored user identifiers, paywall, or client-side third-party trackers are introduced by this feature.
- The sitewide noindex policy is deliberately unchanged from the preceding version.