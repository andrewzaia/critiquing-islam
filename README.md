# Critiquing Islam

An independent, evidence-based examination of Islamic scripture, theology, history and religious claims through primary sources, textual criticism and historical research.

## Purpose

Critiquing Islam is a public research website. Its articles distinguish direct textual observations, historical inference, disputed interpretation and unresolved questions. Claims are supported by traceable references, and meaningful corrections are documented.

The subject of scrutiny is religious claims, texts, institutions and ideas, not the identity or dignity of Muslims as people.

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
npm run build
```

The evidence audit checks every research article for sequential, resolved and non-duplicated numbered references, including whether each listed source is cited. A separate primary-reference audit checks that directly named Quran and hadith identifiers agree with their linked destinations. Neither check establishes the factual accuracy of a reference or checks every external website in real time.

The generated static site is in `dist/`. Serve it with any local static HTTP server, such as `python3 -m http.server 8000 --directory dist`.

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
