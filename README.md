# Critiquing Islam

A Biblical-Christian critique of Islamic scripture, theology, history and claimed divine authority, grounded in original-language primary texts, textual criticism and historical research.

## Purpose

Critiquing Islam is a public research website working from an expressly Biblical-Christian theological framework. The Bible is the doctrinal benchmark for competing claims about Jesus, revelation and salvation. Historical and manuscript claims are independently evaluated rather than presumed true merely because the Christian framework affirms a doctrine. Articles distinguish direct textual observations, historical inference, Biblical theological verdicts, disputed interpretation and unresolved questions. Claims are supported by traceable references, and meaningful corrections are documented.

**Source priority:** Quranic claims are tested against the Quranic text and context first. Hadith is evidence of attributed reports and later transmitted beliefs, not independent verification of extraordinary events or proof of unwritten Quranic clauses. Tafsir records proposed interpretations, not binding amendments to the text. All source claims, including inconvenient ones, are subjected to the same checks; a convenient conclusion is not a reason to accept a weak source.

The subject of scrutiny is religious claims, texts, institutions and ideas, not the identity or dignity of Muslims as people.

## Quran readings comparison

The [Quran reading browser](/site/quran/index.html) searches all 6,236 verses in the Cairo 1924 Hafs reference numbering and displays documented word-level variations for seven canonical readers and fourteen transmitters. Arabic base text and scholarly transliteration differences are locally hosted; non-Hafs lines are reconstructed transliteration, not independent full Arabic editions. The three additional canonical readers and their transmissions are not supplied by the current dataset.

An optional live Quran Foundation matrix is displayed separately when server-side API credentials and approved production `qiraat.read` or parent `qiraat` permission are available. The local corpus remains functional without an API. Configure Cloudflare Pages secrets `QF_CLIENT_ID` and `QF_CLIENT_SECRET`, plus `QF_ENV=production`. See [integration and deployment notes](docs/quran-foundation-api-v0.30.0.md).

The underlying data derive from Corpus Coranicum and Abdul Rahim Nizamani's 2026 variant corpus and are adapted under **CC BY-SA 4.0**. Two missing variant CSV positions are flagged explicitly. See [source provenance and limitations](docs/qiraat-source-provenance-v0.29.0.md).

## Latest research

v0.56.0 adds [CI-045, Did the Quran turn an earlier long-sleep narrative into a hundred-year resurrection?](site/research/quran-hundred-year-resurrection-and-abimelech/index.html), a 25-section investigation with 30 numbered references. It checks the original Arabic of Quran 2:259, the two documented verb readings for the bones, the Greek and manuscript history of 4 Baruch, Abimelech's sixty-six years and preserved figs, the seventy-year Honi narrative and the separate Biblical Jeremiah and Ezekiel evidence. The Quranic protagonist and city remain unnamed. The source-critical verdict identifies earlier narrative circulation without assuming a precise copying intermediary or a physically authenticated miracle. See the [primary-text and chronology audit](docs/quran-2-259-abimelech-source-audit-v0.56.0.md). The library now has **45 numbered investigations and one research guide**.


v0.55.0 adds [CI-044, Abraham and the pre-Islamic fire tradition](site/research/abraham-fire-and-pre-islamic-traditions/index.html), a 23-section investigation with 28 numbered sources. It compares the Quran's direct fire-rescue claim with Jubilees' distinct burning of the idol house, Pseudo-Philo's early Abrahamic furnace narrative and Genesis Rabbah's Nimrod account. It distinguishes the Quran's unnamed persecutors from later identification, manuscript survival from literary dating, and demonstrable narrative priority from unproven eyewitness history. See the [primary-source and chronology audit](docs/abraham-fire-tradition-evidence-audit-v0.55.0.md). The library now contains **44 numbered investigations and one research guide**.


v0.54.0 adds [CI-043, Did the Quran turn Mary's apocryphal childhood into revelation?](site/research/mary-guardian-lots-protevangelium/index.html), a 21-section investigation supported by 24 numbered references. It tests Quran 3:35-44 against the second-century Protevangelium of James, the early Greek Papyrus Bodmer V and the Hannah-Samuel Biblical framework. It distinguishes Zechariah from Joseph, pens from rods, a prayer chamber from an explicitly named Temple, and prior literary attestation from eyewitness proof. The Quran's claim of revealed unseen knowledge is explicit; its historical authority is not independently demonstrated by the sources examined. See the [primary-text and manuscript audit](docs/mary-guardianship-protevangelium-audit-v0.54.0.md). The library now has **43 numbered investigations and one research guide**.

v0.53.0 adds [CI-042, Does the Quran's palm-tree birth repeat earlier legend?](site/research/mary-palm-tree-and-apocrypha/index.html), a 22-section, 28-source investigation of Quran 19:22-30, Pseudo-Matthew 20-21, the Protevangelium of James, older Marian Repose traditions, fifth-century Sozomen, the Greek Leto palm-birth story, the excavated Kathisma church and its later Umayyad mosaics. It distinguishes the birth-time Quranic scene from the later flight-to-Egypt episode, composition from surviving manuscript dates, pre-Islamic motif from a proven literary intermediary, and textual parallels from independent historicity. The investigation considers the disputed proposed post-conquest composition of the Quranic Nativity without treating a late mosaic as proof. See the [palm-tree primary-text and chronology audit](docs/mary-palm-tree-source-audit-v0.53.0.md). The library now has **42 numbered investigations and one research guide**.

v0.52.0 adds [CI-041, Did the Quran adopt apocryphal infancy stories?](site/research/jesus-infancy-apocrypha/index.html), a standalone 22-section and 28-reference investigation of Jesus speaking from the cradle (Quran 19:29-30, 3:46, 5:110) and animating clay birds (Quran 3:49 and 5:110). It distinguishes the Infancy Gospel of Thomas from the Arabic Infancy Gospel and from the unrelated sayings Gospel of Thomas, examines the pre-Islamic fourth/fifth-century Greek papyrus P.Hamb.Graec. 1011, and identifies the late surviving Arabic cradle manuscripts. The infancy narratives differ theologically: the Arabic narrative identifies Jesus as Son of God and Logos, while the Quranic infant calls himself God's servant and prophet. The article tests literary priority, early witnesses, the historicity of miracles, direct borrowing and the limits of the label Gnostic forgery without conflating these propositions. See the [CI-041 primary-text and manuscript audit](docs/infancy-apocrypha-source-audit-v0.52.0.md). The research library now contains **41 numbered investigations and one guide**.

v0.51.0 substantially expands [CI-014, Did Uthman's standardisation preserve the original Quran?](site/research/uthman-and-quranic-authenticity/index.html) from 14 to 26 analytical sections and from 20 to 28 numbered references. It tests an early written archetype, the Sanaa lower text, regional codex branches, radiocarbon dating, canonical reading traditions, oral reports and the different historical burdens of consonantal preservation versus exhaustive originality. See [the manuscript evidence audit](docs/uthmanic-manuscripts-evidence-audit-v0.51.0.md).

The release also expands [CI-021, Al-Muhaymin: guardian of earlier scripture](site/research/al-muhaymin-and-quran-5-48/index.html) from 12 to 20 analytical sections and 19 to 27 numbered references. The Arabic Corpus gives *guardian* as the direct gloss of *muhaymin*. Quran 10:94 contains an explicit conditional command to ask earlier-scripture readers; 5:47 directs the People of the Gospel to judge by what God revealed in it. The separate command to Muhammad in 5:48 to judge by revelation must not be mistaken for the dictionary definition of *muhaymin*. See [the guardian and Gospel authority audit](docs/muhaymin-guardian-scripture-audit-v0.51.0.md). The library remains at 40 numbered investigations and one guide.

v0.50.0 expands [CI-012, Quran 65:4 and the marriage-age question](site/research/quran-65-4-and-marriage-age/index.html) from 10 to 25 analytical sections and from 11 to 30 numbered sources. It scrutinises the original Arabic, the relationship between Quran 65:4 and 33:49, age and judgement language in Quran 4:6 and puberty in 24:58-59, alternative adult medical conditions, direct Arabic commentary by al-Tabari and al-Qurtubi, later legal guardianship and marriage contracts, dated court records, Biblical ethical comparison and child protection. Separate textual, legal, historical and ethical conclusions avoid treating a waiting period as an eyewitness account. See [the v0.50.0 marriage-age source audit](docs/marriage-age-divorce-evidence-audit-v0.50.0.md). The research library remains at 40 numbered investigations and one guide.

v0.49.0 expands [CI-033, Does the Quran contain scientific miracles?](site/research/quran-scientific-miracles/index.html) from 13 to 25 analytical sections and from 18 to 34 numbered references. It tests original-language cosmology, alleged expansion, smoke, embryonic stages against Galen's pre-Islamic writings, reproductive anatomy, mountains as pegs and natural seawater boundaries. It distinguishes literal scientific error, metaphor, prior knowledge and unproven supernatural foreknowledge. See the [scientific-miracle evidence audit](docs/scientific-miracles-source-audit-v0.49.0.md).

This release also strengthens [CI-017, Religious compulsion and jizya](site/research/no-compulsion-jizya-and-religious-freedom/index.html) from 24 to 26 sections and 34 to 39 sources by explicitly examining Quran 2:106 and 16:101 on naskh, the historical claim that 9:29 is later than 2:256, and distinct traditional positions on whether 9:29, 9:5 or 9:73 is an abrogating passage. See the [abrogation follow-up audit](docs/no-compulsion-abrogation-followup-v0.49.0.md). The research library remains at 40 numbered investigations and one guide.

v0.48.0 expands [CI-017, Does Quran 2:256 guarantee religious freedom?](site/research/no-compulsion-jizya-and-religious-freedom/index.html) from 10 to 24 substantive analytical sections and from 12 to 34 numbered references. It compares Quran 2:256's original Arabic with the imperative, jizya and subordination wording of 9:29, while examining treaty protections, peace and non-combatants, Quranic apostasy passages, later juristic restrictions and the historical development of surrender agreements. It tests the strongest defensive reading, separates a Biblical theological comparison from historical analysis and states falsification criteria. See [the v0.48.0 source-critical audit](docs/religious-compulsion-jizya-audit-v0.48.0.md). The research library remains at 40 numbered investigations and one guide.

v0.47.0 expands [CI-016, Can Jews and Christians be saved?](site/research/quran-salvation-jews-christians/index.html) from 9 to 24 analytical sections and from 12 to 34 references. It examines Quran 2:62, 5:69 and 3:85 in Arabic, identifies chronological qualifications added by translation glosses, tests the Quran's obligations to accept all messengers, compares positive and negative statements about the People of the Book within Surah 5, and distinguishes abrogation, contextual specification and time-limited interpretations. It includes a separate Biblical theological verdict and falsification criteria. See [the v0.47.0 original-language audit](docs/jewish-christian-salvation-audit-v0.47.0.md). The library remains at 40 numbered investigations and one guide.

v0.46.0 substantially expands [CI-011, Is Muhammad predicted in the Torah and Gospel?](site/research/muhammad-in-torah-and-gospel/index.html), from 13 to 26 analytical sections and 17 to 34 numbered references. It tests Quran 7:157's original Arabic against the Hebrew of Deuteronomy 18, the Sinai-Seir-Paran theophanies, Kedar and Sela in Isaiah 42, Isaiah 29's sealed scroll, the Hebrew of Song of Songs 5:16, and the Greek of John 14. It distinguishes historical manuscripts from later theological interpretations, gives separate Biblical and historical verdicts, and states falsification criteria. See the [v0.46.0 source-critical audit](docs/muhammad-torah-gospel-original-language-audit-v0.46.0.md). The library remains at 40 numbered investigations and one guide.

v0.45.0 expands [CI-010, Is Jesus God?](site/research/is-jesus-god/index.html) from 15 to 25 analytical sections and from 38 to 50 references. It tests Quranic Arabic, the original Greek of John 1:1 and 20:28, the John 1:18 manuscript variant, Pauline Christology, Hebrews, Ignatius and Pliny, and the evidence required to establish an earlier Gospel corruption. Textual, historical and Biblical theological verdicts are separate. See [the v0.45.0 primary source audit](docs/jesus-divinity-original-language-audit-v0.45.0.md). The library remains at 40 numbered investigations and one guide.

v0.44.0 expands [CI-009, Was Jesus a Muslim?](site/research/was-jesus-a-muslim/index.html) to 24 substantive sections and 44 references. The study examines Quranic Arabic morphology, universal submission, first-century Jewish identity, early Pauline and Jerusalem sources, manuscripts, serious alternatives and falsification criteria. Separate Biblical theological and historical verdicts are provided. See [the v0.44.0 evidence audit](docs/jesus-muslim-original-language-audit-v0.44.0.md). The library remains at 40 numbered investigations and one guide.

v0.43.1 is an editorial patch standardising capitalisation of **Biblical** across published pages and public documentation without changing research URLs or substantive findings. The case convention is enforced by the existing build checks.

v0.43.0 adds [CI-040, Paul versus Muhammad: who speaks for God?](site/research/paul-vs-muhammad-prophetic-authority/index.html), a standalone Biblical-Christian critique with 24 analytical sections and 38 numbered references. It compares Paul's first-person apostleship claims and early contacts with Cephas and James, Muhammad's Quranic prophetic authority, the Biblical criteria of Deuteronomy 13 and 18 and Galatians 1, the historically attested crucifixion, Jesus' identity, visionary claims and early Islamic material witnesses. The Christian theological verdict and independent historical verdict are stated separately. The research library now contains **40 published numbered investigations and one research guide**. See the [CI-040 evidence audit](docs/paul-muhammad-biblical-evidence-audit-v0.43.0.md).

v0.42.0 expands [CI-001, the Ahmad and Paraclete claim](site/research/quran-61-6-and-paraclete/index.html), from 10 to 25 analytical sections and from 11 to 30 numbered sources. It compares Quran 61:6's Arabic proper name to Greek John 14:16-26 and 16:7-15, manuscript evidence in P66 and P75, the distinct Greek terms parakletos and periklutos, documented textual variants, and the early Islamic adaptation examined by Sean Anthony. The historical verdict distinguishes the surviving Gospel's explicit Holy Spirit identification from an otherwise uncorroborated claimed prophecy. See the [source-critical audit](docs/ahmad-paraclete-evidence-audit-v0.42.0.md).

v0.41.0 substantially expands [CI-002, the crucifixion in competing accounts](site/research/crucifixion-and-quran-4-157/index.html) to 31 sections and 44 numbered references. The study distinguishes Quran 4:157's explicit Arabic denials from later named-substitute narratives, analyses first-century Pauline traditions and contacts, examines Tacitus and early Roman material context, and tests pre-Islamic alternative doctrines without misrepresenting their independent historical status. The resulting verdict is that Jesus' execution by Roman crucifixion has much stronger early historical attestation than any alleged substitute. See [the v0.41.0 evidence audit](docs/crucifixion-evidence-audit-v0.41.0.md). The research library maintains 39 numbered investigations and one guide.

The v0.40.0 research release expands [CI-003, Quranic preservation and manuscript history](site/research/quran-preservation-and-manuscripts/index.html), to 23 substantive sections and 31 numbered references. The revised study tests the original Arabic of Quran 15:9, Uthmanic regional textual ancestry, the Sanaa lower-layer exception, the Birmingham parchment dating limits and genuine canonical reading variants at Quran 2:184 and 10:22. It distinguishes recoverable written text from alleged original oral revelation and separates specific reports about forgotten passages from independent manuscript evidence. See the [manuscript and transmission evidence audit](docs/quran-preservation-evidence-audit-v0.40.0.md).

v0.39.0 expands [CI-004, how hadith is authenticated](site/research/how-is-a-hadith-authenticated/index.html), to 25 source-critical sections and 29 numbered references. The investigation maps the actual shared upstream chain in Bukhari 1 and Muslim 1907a, examines Quranic report scrutiny and Muslim's early narrator traditions, tests oral and written transmission claims, and compares modern common-link dating with canonical grading. The [source and methods audit](docs/hadith-authentication-source-audit-v0.39.0.md) documents which inferences survive. The library remains at 39 substantive investigations and one research guide.

The v0.38.0 release substantially expands [CI-005: Does the Quran affirm the Torah and Gospel?](site/research/quran-and-earlier-scriptures/index.html) to 23 sections and 34 numbered references. It starts with the Arabic of Quran 5:43, 5:47 and 5:48 and tests claims about distortion against pre-Islamic Torah manuscripts, the Great Isaiah Scroll, fourth- and fifth-century Greek codices and early Johannine papyri. The evidence shows that scriptural copying predates Islam and that genuine variants exist, but does not corroborate a universal replacement of all Torah and Gospel texts. See the [v0.38.0 source audit](docs/earlier-scriptures-manuscript-evidence-audit-v0.38.0.md). The library remains at 39 numbered investigations and one guide.

The v0.37.0 research release expands [CI-006, when Quranic inheritance shares exceed 100 percent](site/research/inheritance-shares-and-awl/index.html) to 20 sections and 21 numbered references. It verifies 27/24 (112.5 percent) and 15/12 (125 percent) face-value cases, compares Sunni proportional awl with Imami priority reduction, analyses the Arabic of Quran 4:11-12 and assesses the separate legal implications of debts, bequests, eligibility and residue. See the [CI-006 evidence and computation audit](docs/inheritance-awl-evidence-audit-v0.37.0.md). The research library remains 39 investigations and one guide.

The v0.36.0 research release expands [CI-007, the Quran's portrayal of the Trinity](site/research/quran-5-116-and-trinity/index.html), into a 20-section, 28-reference investigation comparing Quran 5:116, 5:73 and 4:171 with fourth-century Greek creeds, early Christian texts, Epiphanius's Marian-rite report and the practice-based interpretation of Quranic polemic. The direct finding is that the orthodox Trinity excludes Mary, but the Quran does not explicitly list a Mary-inclusive Trinity; the historical target of a separate Marian-deification charge requires independent proof. See the [v0.36.0 primary-text evidence audit](docs/quran-5-116-trinity-source-audit-v0.36.0.md). The published library still contains 39 investigations and one research guide.

The v0.35.0 release substantially expands [CI-008: Mary, sister of Aaron and daughter of Imran](site/research/mary-sister-of-aaron/index.html) into a 20-section, 25-reference investigation. It distinguishes the Arabic family designations, Hebrew Miriam genealogy, the pre-Islamic Protevangelium of James and Papyrus Bodmer V, Gregory of Nyssa's typology and the historical limits of later reported harmonisations. See the [primary-text and manuscript evidence audit](docs/mary-aaron-imran-audit-v0.35.0.md). The published library remains 39 investigations and one guide.

The v0.34.1 editorial revision applies the **balance of probabilities** across the research methodology and strengthens the wording of CI-038, CI-008, CI-011 and CI-015 where weak hypothetical reconciliations were being given excessive prominence. The [verdict-level review of all 39 investigations](docs/verdict-level-evidence-audit-v0.34.1.md) records the conclusions retained or sharpened. No inference of a deceptive supernatural source is claimed without its stated theological premises, and structural checks do not verify miracles or manuscript history.

The v0.34.0 release publishes [CI-038, the first revelation and identification of Gabriel](site/research/first-revelation-gabriel-waraqah/index.html), and [CI-039, Quran 18 and the earlier Christian Seven Sleepers legend](site/research/companions-of-the-cave-seven-sleepers/index.html). The first evaluates Khadijah, Waraqah and competing explanations under equal burdens of proof, distinguishing physical intervention from an alleged angelic commission that conflicts with the earlier apostolic gospel. The second distinguishes earlier literary priority from a proven intermediary or independently verified miracle. The library contains **39 published investigations** and one research guide. See [the v0.34.0 evidence audit](docs/first-revelation-and-sleepers-audit-v0.34.0.md).

The v0.33.0 release adds [CI-037: Quran 5:32 and Mishnah Sanhedrin 4:5](site/research/quran-5-32-mishnah-sanhedrin/index.html), comparing the Cain-Abel life maxim, original Hebrew and Arabic, differing legal contexts, textual variants and chronological claims. See the [source verification audit](docs/quran-5-32-mishnah-audit-v0.33.0.md). The library now contains 37 published investigations and one unnumbered guide.

The v0.32.0 release introduces [CI-036: Abraham's father, Azar or Terah?](site/research/abraham-father-azar-terah/index.html). The article compares Quran 6:74 with Genesis, Joshua, Greek Biblical transmission, pre-Islamic Jewish retellings and the source evidence required by competing uncle or second-name hypotheses. See the [evidence audit and limitations](docs/abraham-azar-terah-audit-v0.32.0.md). This release expanded the research collection from 35 to 36 published investigations.

## Explore

- [Research library](https://github.com/andrewzaia/critiquing-islam/tree/main/site/research)
- [Primary sources](https://github.com/andrewzaia/critiquing-islam/blob/main/site/sources/index.html)
- [Methodology](https://github.com/andrewzaia/critiquing-islam/blob/main/site/methodology/index.html)
- [Changelog](CHANGELOG.md)

## Run locally

Requires Node.js 20 or later. The site has no runtime dependencies.

```sh
npm run check
npm run check:qf
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
