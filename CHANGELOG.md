# Changelog

Changes are recorded by release using MAJOR.MINOR.PATCH versioning.

## v0.32.0 - 2026-11-05

- Published CI-036, a standalone 19-section, 20-source critical investigation into the identification of Abraham's father as Azar in Quran 6:74 versus Terah in earlier Jewish and Christian textual traditions.
- Analysed the Quranic father-address in Arabic; compared Genesis, Joshua, Chronicles, Septuagint, Josephus, Jubilees, Genesis Rabbah and the Apocalypse of Abraham; examined what pre-Islamic manuscript and literary witnesses can actually establish.
- Tested the uncle, alternate-name, title and parent-prayer reconciliations against source-specific proof requirements, distinguishing an attested naming discrepancy from a claim to know the patriarch's actual biological parent independently of the texts.
- Updated homepage and research catalogue navigation to 36 investigations, expanded the source register, and added new release checks for research depth, section links and citation use.
- Documented the early textual evidence and limitations, including the distinction between a Qumran witness to Jubilees as a work and the later complete chapter 12 wording. No Quran data or API integration files changed.

## v0.31.2 - 2026-11-05

- Updated the optional Quran Foundation live Qira'at proxy to support the approved parent `qiraat` scope as an alternative to the `qiraat.read` scope, using an explicit allowlist.
- Strengthened matrix response validation to reject malformed attribution structures and mismatched verse identifiers.
- Improved live comparison display of verse-boundary context, provider glosses and provider-specific error messages without changing the locally hosted Quran data.
- Expanded automated tests to verify both OAuth scope paths and exercise the browser renderer against the provider's published matrix schema. Real production permissions and connectivity remain separate verification requirements.

## v0.31.1 - 2026-11-05

- Limited Quran verse previews in linked research cards to the verse text itself, rather than the entire card hover area.
- Preserved standard card navigation and existing Quran.com source-link previews; added a regression check for the hover target.

## v0.31.0 - 2026-11-05

- Added sitewide Quran reference hovercards, using the local Cairo/Hafs Arabic verse and scholarly transliteration corpus rather than a live API request on hover.
- Recognise explicit Quran citations and grouped references, direct Quran.com source links, single verses, same-chapter ranges and consecutive cross-chapter ranges while avoiding automatic misidentification of Bible citations.
- Added mouse hover, keyboard focus, mobile tap-to-preview, Escape/close controls, bounded scrollable range views and links to the Quran reading explorer and Quran.com translations.
- Included one preview engine per generated HTML page without changing editorial content or existing source-link targets. Added dedicated regression checks for reference parsing, validation and multi-verse boundaries.
- The hovercard presents the locally verified Hafs Arabic and transliteration only; it does not claim to be an English translation or another independently attested reading.

## v0.30.1 - 2026-11-05

- Consolidated Quran verse lookup and Arabic/transliteration keyword search into one field, removing the redundant surah and verse picker and its associated JavaScript and styling.
- Preserved reference ranges, example shortcuts, previous/next verse navigation, shareable verse URLs and the optional live Qira'at comparison.
- Extended regression checks to protect the single-search layout and removed unused controls.

## v0.30.0 - 2026-11-05

- Added an optional Quran Foundation Qira'at matrix view below the existing locally hosted Quran readings, keeping source provenance and comparison limitations distinct.
- Introduced a Cloudflare Pages Function to retrieve approved production-only matrices through server-side OAuth2 Client Credentials with cached tokens and no browser access to secrets.
- Provided explicit fallback statuses when credentials, production permission or provider availability prevent a live comparison; retained the v0.29.0 local corpus unchanged.
- Added responsive matrix styling, regression checks using mocked provider responses and deployment/permission documentation. Live production connectivity remains unverified pending approved credentials.

## v0.29.0 - 2026-11-05

- Added /quran/, a locally hosted Quran reading browser supporting verse and short-range references, Arabic and scholarly-transliteration keyword search, shareable verse URLs, sequential navigation and responsive comparison of available transmitted variants.
- Adapted 6,236 Cairo/Hafs reference verses and attributed word-level differences from a Corpus Coranicum-derived dataset recording seven canonical readers and fourteen transmitters. Sharded the material by surah and added a separate search index.
- Distinguished full Hafs Arabic source text from reconstructed comparative scholarly transliteration. Other Arabic riwaya editions, the three additional canonical readers, differing verse numbering and general pronunciation rules are not misrepresented as covered.
- Verified 77,432 Cairo reference words against 77,430 variant CSV word records, preserving two missing attribution records as explicitly marked unknowns. The adapted local files retain CC BY-SA 4.0 attribution and provenance.
- Added Quran readings to the sitewide header and footer navigation, a homepage discovery link, the source register and automated corpus and navigation checks.
- No external runtime API, credential, subscription or additional CI job is required. Approved access to the broader Quran Foundation Qiraat API remains a separate potential enhancement.

## v0.28.0 - 2026-11-05

- Added CI-035, a 17-section, 17-reference investigation of counted dirhams in Quran 12:20, examining the Arabic noun, historical currency etymology and the difference between minted coins and Bronze Age weighed silver.
- Compared Quran 12:19-21 with Genesis 37:28 and Genesis 23:16, as well as Harvard, UCL and museum artefacts, numismatic dating and published archaeological research.
- Separated conditional claims of coin anachronism from the possibility of retrospective monetary vocabulary or a weight-based unit, with explicit criteria for what the wording proves and fails to prove.
- Updated the homepage research cards, library catalogue and source register while preserving the v0.27.0 responsive layout and removal of homepage announcement panels.
- Added regression checks for CI-035 section depth, source integrity, evidentiary distinctions, catalogue references and prior homepage protections.
- Documented source and archaeological verification boundaries in the v0.28.0 audit note.

## v0.27.0 - 2026-11-05

- Added CI-034, a standalone 18-section, 21-reference historical investigation into al-Samiri, Aaron and the golden calf. The study separates the Quran's direct attribution from the debated Samaritan identification and its conditional chronological problem.
- Compared Quran 20:83-97 and 7:148-152 with Exodus 32, Deuteronomy 9, Samaria under Omri, the Assyrian setting and academic work on Samaritan history and possible name etymologies.
- Removed five stacked editorial-note panels from the homepage. The research library already provides full access to those subjects, while the abrogated recitation study and ten-doctrine guide retain direct homepage links in more appropriate sections.
- Added responsive CSS so long text links can wrap on narrow screens and section headings accommodate their adjacent links.
- Updated research navigation, source register, release documentation and automated regression checks for article depth, references, homepage cleanup and retained research routes.
- Documented historical identification and source review limitations separately from structural CI validation.

## v0.26.0 - 2026-11-04

- Repurposed CI-020 as a standalone, 17-section historical investigation of Haman at Pharaoh's court, with 20 references and a source-specific evidence verdict.
- Compared all six Quranic occurrences with Persian Esther, the Genesis tower motif, Korah's Moses-era story, Arabic morphology and the limits of alleged hieroglyphic corroboration.
- Retained the ten-doctrine navigation guide at its original URL while removing its CI-020 identifier, preserving the independent CI-022 to CI-031 investigations.
- Updated the homepage, research index, source register and regression checks for CI-020 depth, references and the distinct unnumbered guide.
- Recorded historical verification limitations and the outstanding Egyptian epigraphic requirements in a separate audit note.

## v0.25.0 - 2026-11-04

- Expanded the Ezra and Uzayr investigation, CI-015, to 14 sections and 15 references, with the Arabic wording, the Fourth Ezra passages and a falsifiable burden for the alleged local sect.
- Added CI-033, a dedicated Quranic scientific miracle investigation with 13 substantive sections and 18 sources comparing cosmological, embryological and anatomical arguments against the Quranic wording and scientific observations.
- Expanded CI-013 to 21 sections and 25 references, distinguishing Quranic sign requests, attributed witnesses, independent observations and literary development of moon-splitting accounts.
- Updated research navigation, source catalogue, changelog and automated source and section regression checks.
- Automated checks test structure, references and navigation, not the historical occurrence or supernatural truth of religious claims.

## v0.24.0 - 2026-11-04

- Expanded the independent Ahmad and Paraclete investigation with six additional sections, direct Quranic language checks, John 14-16 context, the Greek word's use in 1 John, and documentary requirements for claims about lost readings.
- Deepened the Torah and Gospel prophecy investigation with five sections covering Quran 7:157, the Mosaic kinship setting, Isaiah 42's Kedar reference, the Johannine identity claim and evidentiary demands for an alleged altered prophecy.
- Expanded the historical miracle-witness investigation with five sections comparing Quranic responses to requests for signs, transmission chains, independent observations, public-crowd reports and suitable corroboration standards.
- Added four substantial sections to the Quranic meteor investigation, comparing the Arabic translation issues, the repeated heavenly-eavesdropping motif, NASA meteor science and the limits of calling an unseen supernatural purpose a scientific discovery.
- Added specialist and primary references, expanded article metadata, cross-links and research summaries, and regression tests for textual depth, source registers, relevant section anchors and evidence verdicts.
- Recorded the source-verification scope and outstanding historical uncertainties in a separate audit note.

## v0.23.0 - 2026-11-04

- Rebuilt the Quran 65:4 investigation around the Arabic clause, the Quranic waiting-period rules and the specific limits of what the text states; added two independent research sections and revised its source-weighted verdict.
- Distinguished the historical reception of the marriage-age interpretation from the actual textual wording, and classified the absence of a specified age threshold separately from claims about particular historical practices.
- Re-examined Quran 2:62, 5:69 and 3:85 without treating later chronological or abrogation theories as a demonstrated exception to the stated salvation promises.
- Refined the Quran 2:256 and 9:29 critique to distinguish freedom of belief from unequal political treatment directly from the verses without accepting a commentator's claim of abrogation.
- Clarified the difference between Quran 2:106's general statement, transmitted reports and independently observable manuscript evidence in the Quran preservation investigation.
- Added primary-reference regression checks, updated a reviewed citation mapping, and refreshed the research catalogue descriptions for these findings.

## v0.22.0 - 2026-11-04

- Established an explicit primary-text evidence hierarchy in the methodology and project introduction, distinguishing Quranic wording, attributed hadith reports, later exegesis and independent historical witnesses.
- Revised the inheritance, Trinity and Mary-Aaron investigations to focus their conclusions on the Quran's words and independently dated evidence rather than treating subsequent legal or theological explanations as resolutions.
- Replaced a modern interpretive source in the Trinity investigation with a pre-Islamic account by Epiphanius and added an early Christian council text for the doctrine being compared.
- Strengthened the scriptural corruption and crucifixion investigations by separating their direct Quranic assertions from historical details introduced by later traditions.
- Applied the same source priority to Quranic preservation, final prophethood, salvation, Jesus' return, al-muhaymin and the question of earlier biblical scripture.
- Clarified source use across the ten-doctrine research guide and added automated regression checks for the primary-text findings.

## v0.21.0 - 2026-11-04

- Expanded the inheritance, Quran 5:116 and Mary-Aaron-Imran investigations with twelve additional source-led research sections.
- Added a second inheritance over-allocation example, legal distinction between awl and residual distribution, and the historical disagreement over priority among fixed-share heirs.
- Distinguished the Quran's condemnation of taking Jesus and Mary as deities from its separate statements about three; assessed the interpretation that Marian veneration is the target rather than a formal Trinity definition.
- Examined the Najran exchange, classical kinship interpretations, the double Aaron-Imran name parallel and earlier Christian references to Aaronic family connections.
- Expanded the source registers, updated research catalogue descriptions, and added regression checks for each study's new sections and references.

## v0.20.0 - 2026-11-03

- Conducted a claim-level verification of primary hadith transmissions, manuscript scholarship and earlier-scripture citations, recording reviewed sources, findings and limits in an evidence audit.
- Identified shared intermediaries in two Ibn Masud moon reports, two Anas reports, both Aisha breastfeeding recitation reports and the Umar stoning-verse transmissions; differentiated independent companion attributions from personal eyewitness claims.
- Clarified that Muslim 1452b does not repeat the death-time recitation wording in Muslim 1452a, and that Bukhari 6829's Umar report is shorter than Muslim 1691a.
- Corrected misassigned references in the Jesus divinity, final prophethood and Quran 65:4 studies, ensuring that named commentaries substantiate the attached claims.
- Corrected attribution of the Sanaa palimpsest research to Sadeghi and Goudarzi, and narrowed the discussion of Houghton's Mark 16 study to its actual manuscript finding.
- Updated two Septuagint studies and the source register to cite the specialist Oxford Handbook of the Septuagint.
- Introduced a site-wide named-scholar citation check and curated claim-reference regression tests, integrated into the standard validation workflow without claiming automatic historical-content verification.

## v0.19.0 - 2026-11-03

- Published CI-032, an independently referenced twelve-section investigation of Quranic recitation reports omitted from the standard codex, the doctrine of abrogation, and the proof required to distinguish intentional withdrawal from possible omission.
- Examined Sahih Muslim 1452a-b on breastfeeding recitations, Muslim 1691a and Bukhari 6829 on the stoning verse, and Bukhari 5005 on Ubayy's recitation, distinguishing multiple transmitted accounts from independent direct witnesses.
- Integrated primary-source findings into the Quranic preservation and Uthmanic standardisation studies, alongside established evidence for early codification and the separate Sanaa textual tradition.
- Strengthened the miracle evidence study with separate hadith routes and companion-attributed reports of the moon-splitting narrative, distinguishing an attributed witness from independent historical corroboration.
- Repaired three research citations in which a source-register title listed multiple Quranic passages but opened only one, providing separate passage references.
- Added an automated Quranic verse and hadith reference-label concordance check and regression coverage for the new research article.
- Updated the research library, homepage, local audit commands and release version.

## v0.18.0 - 2026-11-03

- Audited numbered source registers across the research library, not only the ten standalone doctrine investigations.
- Removed repeated URLs that were presented under separate reference numbers, and updated in-text citation anchors to retain accurate source-to-claim tracing.
- Integrated previously unused references into explicit, claim-specific analysis, including the crucifixion, hadith authentication, Quranic preservation, tahrif, eschatological and earlier-scripture investigations.
- Corrected the Sanaa palimpsest citation to use Sadeghi and Goudarzi's dedicated manuscript study instead of a duplicate reference to van Putten's written-archetype research.
- Added distinct hadith evidence on seven ahruf and early reported recitation differences, carefully separated from later canonical qiraat and from independent proof of historical revelation.
- Added a site-wide automated evidence audit checking sequential source IDs, citation links, unused or repeated sources, outbound reference formats and analysis-section anchors.
- Documented the distinction between source attestation, historical independence, doctrinal interpretation and independent corroboration, with an independently runnable audit command.
- Adjusted minimum source counts for two investigations to reflect verified distinct references rather than duplicated source entries.

## v0.17.0 - 2026-11-03

- Substantially expanded all four remaining standalone doctrine investigations, CI-028 through CI-031, with primary Quranic, hadith and classical commentary evidence.
- CI-028: distinguished al-Tabari's interpretation of finality and explicit no-prophet-after-me reports from independently proving a divine prohibition on future prophets; analysed the adoption-law context and claims of prophecies in earlier scriptures.
- CI-029: compared inherited consequences and inherited guilt using Quran 2:36-38 and the Adam-Moses narration, and evaluated the additional-burden texts and Ibn Kathir's response.
- CI-030: examined the classical reconciliation of broad and exclusive salvation passages; added sources on mercy, the judgement scales, intercession, the encounter with Hell and adequate prophetic warning.
- CI-031: documented classical alternative readings of Quran 4:159 and 43:61 and evaluated the relationship between Quranic statements, later Jesus-return predictions and the finality doctrine.
- Deduplicated the four source registers so distinct references are not inflated by repeated URLs. Extended regression checks for section counts, note resolution and complete source coverage in the ten-study series.
- Updated the research catalogue descriptions.

## v0.16.0 - 2026-11-03

- Deepened the separate crucifixion, tahrif and Quran preservation critiques (CI-025 to CI-027) with original Arabic, early manuscript witnesses and source-critical scholarship.
- Clarified the passive shubbiha in Quran 4:157, differing reports in al-Tabari, Ignatius's early testimony, the non-eyewitness limits of Tacitus and a historically defensible death date range.
- Anchored the biblical corruption discussion in real Isaiah Scroll variants, the contested long ending of Mark, the uncertain palaeographic dating of P52, and al-Tabari's alternative constructions of Quran 5:47.
- Incorporated early written Uthmanic archetype scholarship, the Sanaa palimpsest's distinct lower text, Birmingham's exact manuscript scope and parchment dating, and the meaning-level variation of the canonical qiraat of Quran 1:4.
- Explicitly rejected both unsupported extremes: arbitrary Uthmanic invention without evidence, and the claim that textual stability automatically establishes perfect preservation or supernatural origin.
- Expanded independent source registers and made the historical, linguistic and theological burdens distinguishable. Updated the source directory with direct evidence and study links, and added automated depth guards for the three newly expanded studies.

## v0.15.0 - 2026-11-03

- Substantially deepened the first three individual doctrinal studies, CI-022 (Tawhid and Trinity), CI-023 (divine sonship) and CI-024 (Jesus as prophet or God).
- Added Arabic morphology for Quran 4:171, 5:73, 5:116, 6:101 and 112:3, with separate grammatical conclusions rather than conflating the Quranic challenges.
- Incorporated al-Qurtubi's recognition that orthodox Christians profess one God and his distinct argument that three gods would nevertheless follow; contrasted al-Tabari's different reported explanations.
- Added pre-Nicene sources from Justin Martyr, Tertullian and Ignatius to constrain claims about when high Christology and distinct-person language arose.
- Compared Ibn Kathir's consort and offspring argument with the non-physical claim of eternal generation, and addressed the Quran's broader rejection beyond biology.
- Disclosed the competing ancient readings of John 1:18 rather than relying on a single unqualified English rendering.
- Added separate tests for historical dating, original-language meaning, doctrinal identification, philosophical entailment, manuscript variants and the authority of a later corrective revelation.
- Added automated structural checks that each of the three expanded investigations retains all added sections and references.

## v0.14.0 - 2026-11-03

- Replaced the single-summary CI-020 doctrine article with a navigation guide to ten separate, fully referenced investigations.
- Published CI-022 to CI-031, covering Tawhid and the Trinity, divine sonship, Jesus' divine identity, crucifixion and substitution, tahrif, Quranic preservation, final prophethood, original sin and atonement, salvation, and Jesus' return.
- Each investigation includes at least ten substantive analytical sections and a dedicated primary-source register, with opposing interpretations and evidentiary requirements treated individually.
- Refined the manuscript evidence in the Quranic preservation article with verified scholarship and an official Birmingham manuscript reference.
- Extended the research library, homepage and sources catalogue, with new automated safeguards requiring each doctrine investigation to meet structural and citation thresholds.
- Reclassified CI-020 as a research index so the site counts thirty investigations and one guide.

## v0.13.0 - 2026-11-03

- Published CI-020, a source-based comparative evidence audit covering ten disputed Islamic doctrines and their strongest counter-readings.
- Published CI-021, an independent Al-Muhaymin investigation grounded in Arabic morphology, Lisan al-Arab and the tafsir of al-Tabari, Ibn Kathir and al-Qurtubi.
- Distinguished internal scriptural authority from independent historical corroboration, and identified the precise burdens for any particular biblical corruption allegation.
- Corrected common overstatements about the Christian Trinity, divine sonship, unnamed crucifixion substitutes, salvation through works, and the Quran versus hadith on Jesus' return.
- Connected the new studies in the research library, homepage, source register and earlier-scripture analysis; extended required-file checks to cover both articles.
- Expanded the catalogue from 19 to 21 investigations. Future dedicated deep dives are identified for sonship, prophetic finality, atonement and eschatology.

## v0.12.0 - 2026-11-03

- Expanded the Dhul-Qarnayn and Syriac Alexander study (CI-018) to 17 analysis sections and 22 references.
- Added direct Corpus Coranicum original-script Syriac evidence with a passage-by-passage audit trail and explicit differences between the Syriac gate and Quranic barrier.
- Addressed the conflict between the 629-630 dating of the received Syriac legend and the traditionally Meccan chronology of Surah 18, alongside the earlier Justinianic-core proposal.
- Added a 2026 academic shared-narrative counterargument and clarified the difference between literary parallels and demonstrable direct dependence.
- Updated research and source listings, methodology, automated checks and the version history, and corrected a stale homepage reference counter.

## v0.11.0 - 2026-11-03

- Published five substantive studies: Ezra or Uzayr son-of-God allegation (CI-015); religious salvation across Quran 2:62, 5:69 and 3:85 (CI-016); religious liberty and jizya (CI-017); Dhul-Qarnayn and the Syriac Alexander Legend (CI-018); and shooting stars and devils (CI-019).
- Compared the Jewish documentary record and Muslim written responses; differentiated formal contradiction from textual qualification and political coercion from forced conversion.
- Incorporated the Syriac Alexander narrative in Budge's edition and recent Oxford scholarship on contested dating, alongside a passage-level motif comparison.
- Evaluated classical explanations of celestial projectiles against NASA's physical description of meteors, avoiding inaccurate whole-star arguments.
- Expanded the library to nineteen published investigations, updated the home page and source register, and extended required-page validation and the version history.

## v0.10.0 - 2026-11-03

- Published two comprehensive studies: attributed witnesses and independent evidence for Muhammad's miracles (CI-013), and Uthman's Quranic standardisation and the limits of authenticity claims (CI-014).
- Compared the moon-splitting and water-miracle reports with the historical requirements for corroborating extraordinary events.
- Distinguished Abu Bakr's collection from Uthman's official codex, documented Uthman's committee, dialect rule and destruction of competing material, and compared early written manuscript evidence with oral tradition.
- Applied the same evidentiary standards to Quranic and biblical transmission, without treating either oral tradition as automatically conclusive.
- Added cross-references, public source register entries and required-page validation, and expanded the library to fourteen published analyses.

## v0.9.0 - 2026-11-03

- Completed both previously planned research studies: Quranic preservation and manuscripts (CI-003) and hadith authentication and historical confidence (CI-004).
- Expanded source-based analysis in the Paraclete, Trinity, Mary/Imran, inheritance and marriage-law studies.
- Added research links to early Quranic manuscripts, Uthmanic standardisation reports, classical sahih conditions and critical scholarship on hadith dating.
- Converted both planned library cards to published entries and brought the research catalogue to twelve published investigations.
- Updated source registers, homepage, automated required-page checks and the public version history.

## v0.8.0 - 2026-11-03

- Published two research studies: Quran 7:157 and proposed prophecies about Muhammad, and Quran 65:4 with classical divorce-law interpretations.
- Added clear, claim-specific evidence verdicts to every existing published critique, distinguishing failed identifications, unsupported claims and genuine interpretive uncertainty.
- Added primary textual citations and classical Islamic interpretations, without introducing online commentator attribution.
- Updated the research library, homepage, methodology and public release history.

## v0.7.0 - 2026-11-03

- Expanded the crucifixion study to seventeen analytical sections and 27 textual and historical references.
- Distinguished Quran 4:157 from later, differing substitute accounts and examined the pre-Islamic Basilidean substitute tradition.
- Added early Pauline evidence, qualified Gospel and Josephus analysis, Ignatius, Greek codices, a chronology, a substitution hypothesis test and evidence matrix.
- Updated the homepage and research library to reflect the expanded study.

## v0.6.2 - 2026-11-03

- Expanded the Gospel authenticity critique with pre-Islamic documentary continuity for specific Johannine passages and a detailed-verses evidentiary test.
- Added Quran 12:111, 16:89 and 6:114, early papyrus evidence and classical tafsir, distinguishing explanatory adequacy from a formal logical contradiction.
- Documented the Johannine Comma as a genuine later textual addition rather than suggesting every biblical manuscript is identical.
- Updated the Christology analysis, manuscript source register and editorial methodology.

## v0.6.1 - 2026-11-03

- Strengthened the pre-Islamic manuscript argument in the earlier-scripture and Jesus' divinity studies.
- Distinguished documentary proof that biblical texts predate Islam from proof of an unchanged original or theological truth.
- Examined the Quran's instruction to use the Gospel alongside its role as a criterion, setting out the evidentiary burden for specific corruption allegations.
- Clarified that surviving fourth-century codices do not establish the precise books held by every seventh-century community.

## v0.6.0 - 2026-11-03

- Added Codex Vaticanus, Codex Sinaiticus and the Septuagint as distinguished manuscript and translation witnesses in the public source register.
- Expanded manuscript evidence and source citations in the studies of Jesus' divine status, scriptural authority, Jesus' historical identity and the Paraclete.
- Clarified the dates, preservation limits, manuscript scope, textual variants and image-use restrictions, without treating manuscript survival as proof of theology.

## v0.5.0 - 2026-11-03

- Published a comprehensive textual study of Jesus' divine identity in early Christianity and its rejection in the Quran.
- Compared first-century Christian passages with Quranic descriptions of Jesus, earlier Gospel authority and preservation claims.
- Examined the distinction between the Injil and canonical Gospels, competing interpretations, and documentary chronology.
- Added direct scriptural references and linked the study from the homepage and research library.

## v0.4.1 - 2026-11-03

- Added a dedicated public version history page with expandable release notes.
- Linked the footer version and About page to the release history.
- Generated public release history from the canonical changelog and added automated version consistency checks.

## v0.4.0 - 2026-11-03

- Published a comprehensive examination of the claim that Jesus was a Muslim.
- Compared the earliest Christian texts, Quranic portrayal, Jewish historical setting and key doctrinal differences.
- Added a primary-source register, cross-references and prominent access from the homepage and research library.

## v0.3.0 - 2026-11-03

- Published new studies of inheritance fractions, Christian Trinitarian doctrine and Mary's family designations.
- Added direct textual references, worked calculations and documented interpretive responses.
- Expanded the research library to six published articles and updated the homepage.

## v0.2.2 - 2026-11-03

- Corrected the homepage link and publication status for the crucifixion study.

## v0.2.1 - 2026-11-03

- Refined article references and source descriptions.
- Clarified primary-text citations and article methodology.

## v0.2.0 - 2026-11-03

- Published two additional studies covering earlier-scripture authority and Jesus' crucifixion.
- Expanded direct scriptural and historical references.
- Expanded research catalogue, filters and the source register.

## v0.1.0 - 2026-11-03

- Established the website foundation and research navigation.
- Published the initial textual comparison of Quran 61:6 and John 14-16.
- Added primary source register, editorial methodology and project information.
- Added responsive layouts, accessible navigation, theme selection and research filtering.
- Introduced automated static checks and shared semantic version display.
