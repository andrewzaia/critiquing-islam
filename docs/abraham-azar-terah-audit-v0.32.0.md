# CI-036 source and evidence audit - v0.32.0

Date: 2026-11-05

## Investigation

**Question:** Does Quran 6:74 identify Abraham's father as Azar in conflict with the earlier recorded name Terah, and can proposed reconciliations meet independent evidentiary requirements?

The study is a standalone argument with 19 analytical sections and 20 individually linked references. It prioritises the Quran's actual grammar, the earlier Hebrew genealogies and directly linked ancient literary witnesses.

## Directly verifiable text-level observations

- Quran 6:74 supplies the name Azar in a father-address. The Quranic Arabic Corpus tags Azar as a proper noun following the father's designation. https://corpus.quran.com/wordmorphology.jsp?location=%286%3A74%3A5%29
- Genesis 11:26-32 repeatedly names Terah as the father of Abram. https://www.sefaria.org/Genesis.11.26-32
- Joshua 24:2 associates Terah, Abraham's father, with the ancestors' worship of other gods. https://www.sefaria.org/Joshua.24.2-3
- 1 Chronicles 1:24-27 includes Terah in the genealogy. https://www.sefaria.org/I_Chronicles.1.24-27
- Greek Genesis 11:26 uses Thara; a separate Greek transliteration does not establish an attested alias Azar. https://adfonteslibrary.org/genesis-11
- Josephus, *Antiquities* 1.6.5, names Terah as Abraham's father, verifying circulation of this received genealogy in the first century CE. https://penelope.uchicago.edu/josephus/ant-1.html
- Jubilees 12:1-8 provides an idol-related dialogue between Abraham and his father Terah. https://www.sefaria.org/Book_of_Jubilees.12.1-8
- Genesis Rabbah 38:13 presents Terah as an idol dealer in an interpretive story about Abraham breaking idols. https://www.sefaria.org/Bereshit_Rabbah.38.13
- Quran 2:133 uses a plural ancestral expression including Ishmael, which supports a broader possible semantic range of the father-word without identifying Azar as a specific uncle. https://quran.com/2/133
- Quran 14:41 uses a distinct parent term, but does not explicitly supply a genealogy of two different male guardians. https://quran.com/14/41

## Chronological and independence limits

The earliest sources are not contemporary archaeological evidence of the purported patriarchal household. Genesis, Joshua, Chronicles, Jubilees, Josephus, Genesis Rabbah, and later retellings share material and literary traditions; listing them separately does not create independent eyewitness testimony.

The Israel Antiquities Authority identifies 4Q216 as a Hasmonean-period manuscript of Jubilees. This verifies early circulation of the *work*, **not** a directly preserved copy of the specific chapter 12 dialogue. https://www.deadseascrolls.org.il/explore-the-archive/manuscript/4Q216-1?locale=en_US

Orlov's academic article on the *Apocalypse of Abraham* helps locate its themes, not validate every historical or manuscript claim. https://epublications.marquette.edu/theo_fac/47/

## Interpretive hypotheses and proof requirements

- **Azar is an uncle:** the Arabic father-word can extend beyond a biological parent, but an independently attested family relationship identifying Azar remains required.
- **Azar is Terah's second name or title:** logically possible, but a dated independent witness establishing their equivalence is required.
- **The Quran preserves a lost, correct father name:** requires direct corroboration, not merely the Quran's claim to divine authority.
- **Terah was necessarily the historical birth name:** not independently established by the literary data alone.

**Finding:** the textual discrepancy is established; the evidence considered does not substantiate the specific uncle or dual-name reconciliations. This is a conclusion about the current evidence, not a demonstrated archaeological reconstruction of Abraham's actual family.

## Automated validation and limits

The standard `npm run check` suite verifies 19 analysis sections, 20 unique sequential source-note anchors, use of each reference, section navigation, route presence in the homepage/research library/source register, and continued coverage of the preceding CI-020 through CI-035 studies. The reference audit additionally checks citation structure; it does not independently guarantee external URLs remain live or validate historical testimony.

No changes are made to the Quran reader, Qira'at datasets, Quran.Foundation client, API credentials, or Cloudflare runtime configuration.
