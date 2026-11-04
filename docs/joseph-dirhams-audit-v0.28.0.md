# Joseph, dirhams and coinage - primary-source audit v0.28.0

Date: 2026-11-05

## Question and limits

Does Quran 12:20 describe the sale of Joseph in a monetary form incompatible with the earlier setting of the narrative? This audit distinguishes Quranic Arabic wording, the older literary tradition, physical archaeological evidence and historical conjecture. It does not claim that the exact historic date or existence of Joseph is independently verified.

## Primary text

- Quran 12:20 reads `darahima ma'dudatin`; the Arabic Corpus parses the noun as the plural of dirham. https://quran.com/12/20 and https://corpus.quran.com/wordmorphology.jsp?location=%2812%3A20%3A4%29 .
- Parallel translations use "dirhams", "silver coins" and "pieces of silver". This variety demonstrates an interpretation issue, not an altered Quranic noun: https://corpus.quran.com/translation.jsp?chapter=12&verse=20 .
- Genesis 37:28 describes the payment as twenty in silver, without a Greek-derived dirham label. The Hebrew original is available at https://www.sefaria.org/Genesis.37.28 .
- Genesis 23:16 mentions payment reckoned by weighing silver, consistent with the ancient Near Eastern use of precious metal by mass. https://www.sefaria.org/Genesis.23.16 .

## External material evidence

- Harvard Museum of the Ancient Near East documents Bronze Age balance weights, silver exchange, the shekel and the Uluburun shipwreck: https://hmane.harvard.edu/duck-weight .
- UCL Digital Egypt explains Egyptian weight standards and their history: https://www.ucl.ac.uk/museums-static/digitalegypt/weights/weight.html .
- The el-Amarna metal hoard documents fourteenth-century BCE Egyptian ingots and rings. The Hallie Ford Museum description attributes the relevant material to the British Museum: https://library.willamette.edu/hfma/omeka/items/show/16 .
- The Australian National University Classics Museum dates early minted coins to the late seventh century BCE in Lydia or adjacent western Anatolia: https://slll.cass.anu.edu.au/classics-museum/catalogue/object-clusters/greek-coins .
- UCL describes Egyptian coinage as substantially later, with regular minting in the Ptolemaic period: https://www.ucl.ac.uk/museums-static/digitalegypt/metal/coins.html .
- Archaeological reviews document silver as pre-coinage money: Eshel (2025), https://link.springer.com/article/10.1007/s10963-025-09191-7 ; Mediterranean Silver Trade (2024), https://link.springer.com/article/10.1007/s10814-024-09200-x .
- Encyclopaedia Iranica identifies dirham as a word derived from Greek drachma via Middle Persian drahm and a measure both of weight and coinage: https://www.iranicaonline.org/articles/dirham/ .

## Decision boundaries

- Direct textual fact: Quran 12:20 uses the term darahima in the Joseph story.
- Independently grounded: pre-coinage silver payment was familiar in the Bronze Age, and minting appeared much later.
- Conditional conclusion: if darahima specifically requires minted coins in this scene, the currency is anachronistic to the conventional setting.
- Qualified alternative: a weight denomination or familiar later unit used to convey an earlier silver payment may not be a factual assertion that those later stamped coins physically existed in the setting.
- Historical gap: Joseph's exact year and the actual transaction's form and amount have not been established by a contemporary sale document.
- No claim to have inspected every artefact or source edition is made. The cited source material and web-accessible scholarly analysis inform the narrower assessment. Automated checks verify article integrity, not the historical truth of the narrative.

## Separate operational finding

The repository intentionally or accidentally blocks crawler indexing at three layers: `site/robots.txt` disallows all paths, `site/_headers` sends `X-Robots-Tag: noindex, nofollow`, and the HTML templates use `<meta name="robots" content="noindex, nofollow">`. This policy was left unchanged in v0.28.0 because changing search visibility is distinct from a research release and may be intentional. It should be reviewed before a discoverability launch.
