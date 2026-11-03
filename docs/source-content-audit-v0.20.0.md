# Source-content audit - v0.20.0

Date: 2026-11-03

## Scope and standard

This review checks the meaning of selected high-impact primary and scholarly sources against their actual linked texts, rather than assuming that a working source link proves the adjacent statement. It focuses on Quranic compilation, reportedly abrogated recitation, miracle witness attributions, manuscript transmission and claims about earlier Jewish and Christian scripture. The review is **not** an exhaustive reading of every external publication cited in the research library.

A reference is assessed on three separate axes: what the linked source directly says, whether its transmission is independent of other cited reports, and whether a subsequent historical or theological conclusion follows. The code checks source labels and their attachment to named scholarly claims; the linked document's actual meaning still requires human editorial evaluation.

## Audited primary reports

| Linked source | Source-level finding | Evidentiary boundary |
| --- | --- | --- |
| [Sahih Muslim 1452a](https://sunnah.com/muslim:1452a) | Aisha reports ten and then five breastfeeding passages and includes a statement about the five being recited at Muhammad's death | A later report of a claimed recitation, not an extant early Quran leaf |
| [Sahih Muslim 1452b](https://sunnah.com/muslim:1452b) | Aisha again reports the transition from ten to five via Amra; this version omits the death-time wording | Shares Amra and Aisha with 1452a, so the omitted clause is not separately confirmed by this text |
| [Sahih Muslim 1691a](https://sunnah.com/muslim:1691a) | Umar is reported to have described a stoning verse as revealed, recited and remembered | The narrative traces through Ibn Abbas; it does not provide a surviving written verse or a verified abrogation announcement |
| [Sahih al-Bukhari 6829](https://sunnah.com/bukhari:6829) | Shorter Umar warning about loss of the stoning obligation because the passage is not found in the Book | The shorter wording does not include the full explicit recitation-memory statement in Muslim 1691a; both chains share Ibn Abbas and earlier named intermediaries |
| [Sahih al-Bukhari 5005](https://sunnah.com/bukhari:5005) | Umar says some of Ubayy's recitation was not retained and quotes Quran 2:106 | Does not enumerate all excluded wording or establish the reason for each separate omission |
| [Sahih al-Bukhari 4987](https://sunnah.com/bukhari:4987) | Hafsa's sheets, a named four-man committee, a Quraysh writing instruction and burning of other written material | Evidence of a transmitted standardisation account, not a complete inventory of destroyed readings |
| [Sahih al-Bukhari 4988](https://sunnah.com/bukhari:4988) | Zayd recalls locating Quran 33:23 with Khuzaima while copying | Reports diligence and search, not direct proof of all other verses' independent verification |
| [Sahih al-Bukhari 4864](https://sunnah.com/bukhari:4864) and [4865](https://sunnah.com/bukhari:4865) | Moon-splitting reports both attributed to Ibn Masud and sharing intermediary Abu Ma'mar | Different chains are not different named eyewitnesses; their later wording requires historical dating |
| [Sahih al-Bukhari 4866](https://sunnah.com/bukhari:4866) | Additional concise moon-splitting attribution to Ibn Abbas | Does not state that Ibn Abbas personally saw the event |
| [Sahih al-Bukhari 4867](https://sunnah.com/bukhari:4867) and [4868](https://sunnah.com/bukhari:4868) | Two reports attributed to Anas through Qatada | Distinct from Ibn Masud's companion attribution, but neither explicitly establishes personal sighting by Anas |

## Audited specialist scholarship

| Publication | Verified contribution | Correction or limitation |
| --- | --- | --- |
| [Marijn van Putten, 2019](https://doi.org/10.1017/S0041977X19000338) | Shared orthographic peculiarities in fourteen early manuscripts support a single written Uthmanic archetype | Supports early written common descent, not proof that the archetype included every earlier recitation |
| [Sadeghi and Goudarzi, 2012](https://doi.org/10.1515/islam-2011-0025) | The Sanaa palimpsest's lower writing represents a non-standard early textual tradition | Its contents are not a manuscript of the nursing or stoning passages; author attribution was corrected |
| [H. A. G. Houghton, 2023](https://doi.org/10.1017/S0028688522000224) | GA 239 and GA 304 should not be treated as additional witnesses for Mark ending at 16:8 | Previous phrasing incorrectly attached a wider critical-edition conclusion to a study specifically about two medieval catena manuscripts |
| [Brent Nongbri, 2020](https://doi.org/10.1017/S0028688520000089) | P52 cannot be assigned an exact year such as 125 CE from handwriting alone; plausible dates extend into the third century | Its pre-Islamic existence matters, but neither the fragment nor its date can certify an entire Gospel |
| [Oxford Handbook of the Septuagint, 2021](https://doi.org/10.1093/oxfordhb/9780199665716.001.0001) | Specialist coverage of Jewish Greek translation traditions, transmission and Christian reception | Replaces a general Cambridge chapter with a more appropriate specialist source for two theological comparisons |

## Corrected source-to-claim assignments

- The article on Jesus' divinity now cites the Septuagint reference when discussing the Greek Jewish textual tradition, and Ibn Kathir when describing the Quran's claimed authority over earlier scripture. Previously those reference numbers had been exchanged.
- The final-prophet study now attaches Ibn Kathir's actual tafsir reference to claims about his interpretation of Quran 33:40 and the prophet/messenger distinction.
- The Quran 65:4 study now attaches the named Ibn Kathir and al-Jalalayn commentaries to its statement about the classical treatment of non-menstruating minors.
- The Quran manuscript study now attributes its Sanaa lower-text claim to the correct published Sadeghi-Goudarzi work rather than presenting that publication as an unspecified discussion by van Putten.
- The Mark 16 discussion now states Houghton's narrower manuscript finding without crediting him with a claim his article was not designed to establish.

## Limitations and follow-up

The published article corrections and this audit are supported by the particular source texts reviewed above. They do not establish the truth or falsity of supernatural claims merely because the traditions are preserved, and they do not resolve every academic disagreement about textual history. Automated checks ensure that named scholarly attributions still point to appropriately named bibliography entries and that a curated set of verified claims retains its relevant citations. They do not read external publications, decide historical truth, or measure the independence of transmitters automatically.

Future source reviews should prioritise unverified quotations, ancient-language interpretive claims, contested historical chronology and claims whose references are to secondary summaries rather than the primary material.
