# Critiquing Islam

An independent, evidence-based examination of Islamic scripture, theology, history and religious claims through primary sources, textual criticism and historical research.

## Purpose

Critiquing Islam is a public research website. Its articles distinguish direct textual observations, historical inference, disputed interpretation and unresolved questions. Claims are supported by traceable references, and meaningful corrections are documented.

**Source priority:** Quranic claims are tested against the Quranic text and context first. Hadith is evidence of attributed reports and later transmitted beliefs, not independent verification of extraordinary events or proof of unwritten Quranic clauses. Tafsir records proposed interpretations, not binding amendments to the text. All source claims, including inconvenient ones, are subjected to the same checks; a convenient conclusion is not a reason to accept a weak source.

The subject of scrutiny is religious claims, texts, institutions and ideas, not the identity or dignity of Muslims as people.

## Quran readings comparison

The [Quran reading browser](/site/quran/index.html) searches all 6,236 verses in the Cairo 1924 Hafs reference numbering and displays documented word-level variations for seven canonical readers and fourteen transmitters. Arabic base text and scholarly transliteration differences are locally hosted; non-Hafs lines are reconstructed transliteration, not independent full Arabic editions. The three additional canonical readers and their transmissions are not supplied by the current dataset.

The underlying data derive from Corpus Coranicum and Abdul Rahim Nizamani's 2026 variant corpus and are adapted under **CC BY-SA 4.0**. Two missing variant CSV positions are flagged explicitly. See [source provenance and limitations](docs/qiraat-source-provenance-v0.29.0.md).

## Explore

- [Research library](https://github.com/andrewzaia/critiquing-islam/tree/main/site/research)
- [Primary sources](https://github.com/andrewzaia/critiquing-islam/blob/main/site/sources/index.html)
- [Methodology](https://github.com/andrewzaia/critiquing-islam/blob/main/site/methodology/index.html)
- [Changelog](CHANGELOG.md)

## Run locally

Requires Node.js 20 or later. The site has no runtime dependencies.

```sh
npm run check
npm run audit:evidence
npm run audit:references
npm run audit:claims
npm run build
```

The v0.28.0 research release adds CI-035 on Quran 12:20 and Joseph's counted dirhams. The investigation checks the exact Arabic term against evidence for pre-coinage weighed silver, the emergence of minted coins and the possibility of later vocabulary being used in an earlier narrative. See [the monetary history audit](docs/joseph-dirhams-audit-v0.28.0.md).

The v0.27.0 release adds the al-Samiri and golden-calf investigation, corrects homepage link wrapping on narrow screens and removes repetitive homepage announcement panels. The historical audit explains why identifying al-Samiri with later Samaritans is a hypothesis rather than a fact established by the Quran's wording. See [the audit](docs/samiri-source-audit-v0.27.0.md).

The v0.26.0 research revision assigns CI-020 to the historicity of Haman in Pharaoh's court and retains the existing doctrinal guide without an investigation identifier. See [the source audit](docs/haman-historical-audit-v0.26.0.md) for evidence boundaries, source dates and outstanding authentication requirements.

The v0.25.0 research revision deepens CI-015 and CI-013 and adds CI-033 on scientific miracle claims. Automated checks validate structure, citations and navigability, not the substantive historical or scientific verdicts.

The v0.23.0 research revision adds regression checks for the Quran 65:4 wording and several historically contested harmonisations, while distinguishing automatic source-structure checks from human historical verification.

The evidence audit checks every research article for sequential, resolved and non-duplicated numbered references, including whether each listed source is cited. A separate primary-reference audit checks that directly named Quran and hadith identifiers agree with their linked destinations. Neither check establishes the factual accuracy of a reference or checks every external website in real time. The claim citation check detects incorrect scholar-to-reference attribution and protects a curated set of reviewed claims. See [the v0.20.0 source-content audit](docs/source-content-audit-v0.20.0.md) for what was checked directly and the limitations of those checks.

The generated static site is in `dist/`. Serve it with any local static HTTP server, such as `python3 -m http.server 8000 --directory dist`.

The v0.24.0 review deepens four previously published Quran-first investigations into prophetic identification, miracle testimony and celestial claims. Structural tests enforce research depth, anchored citations and retained verdicts; they are not substitutes for philological or historical verification. See [the evidence audit](docs/prophecy-miracles-science-audit-v0.24.0.md).

## Versioning

This project follows Semantic Versioning: `MAJOR.MINOR.PATCH`.

- **PATCH**: corrections, styling improvements, accessibility and technical fixes with no substantial new features.
- **MINOR**: new articles, research sections, navigation features or other backward-compatible additions.
- **MAJOR**: significant architectural or incompatible changes.

To propose a version increment:

```sh
npm run release -- patch
npm run release -- minor
npm run release -- major
```

The version is maintained in `package.json` and inserted into the website footer during the build. Review the automatically prepared changelog entry before committing. Changes are not committed or tagged by the release script.

## Editorial standards

Research must identify sources precisely, distinguish quotation from interpretation and present conclusions no more broadly than the evidence supports. Contributions and corrections should include verifiable references and concise explanations.

## Rights and attribution

Source code and original editorial material are not currently offered under an open-source or open-content licence. External scriptures, scholarship and media remain subject to their respective rights and licences. Contact the repository owner before reusing material beyond applicable legal exceptions.
