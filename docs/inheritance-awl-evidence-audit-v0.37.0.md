# CI-006 - Quranic inheritance shares and awl

Evidence and computation audit for v0.37.0, 7 November 2026.

## Proposition

Does Quran 4:11-12 provide exact, unreduced fractions that can be paid simultaneously in every eligible family, or is a separate judicial rule required when the entitlement claims exceed the estate?

The test is a statement about a **complete unadjusted allocation rule**, not whether Islamic jurists can distribute a legal estate. The analysis applies the balance of probabilities to the legal interpretation and exact arithmetic to the sums.

## Primary Quranic evidence

- Quran 4:11 gives two-thirds to more than two daughters and one-sixth to each parent where children survive.
- Quran 4:12 gives a widow one-eighth, or a widower one-fourth, where the deceased leaves children.
- Quran 4:11-12 discusses debts and bequests before distribution. Net-estate calculations must apply after those preliminary claims.
- Quran 4:176 concerns siblings and supplies a separate two-thirds clause for two sisters in the specified case.
- Quran 4:13-14 treats the preceding instructions as divine limits. It does not supply an algorithm for reducing over-subscribed estates.
- The original wording of 4:11 includes *fawqa ithnatayn* (above two), although wider Islamic jurisprudence includes exactly two daughters. All principal examples here use **three daughters**, so no contested two-daughter interpretation is needed.

The Quranic Arabic Corpus provides grammatical checking for the relevant fractional terms. The fractions are the actual Quranic claims, not reconstructed percentages attributed to the text by a modern commentator.

## Case A: wife, both parents, three daughters

Recognised surviving heirs: one wife, father, mother and three daughters, no sons, and no remaining claims outside the net distributable estate.

| Heirs | Quranic entitlement | Common denominator 24 | Sunni awl (27) | Imami priority (24) |
| --- | --- | --- | --- | --- |
| Three daughters collectively | 2/3 | 16/24 | 16/27 | 13/24 |
| Father | 1/6 | 4/24 | 4/27 | 4/24 |
| Mother | 1/6 | 4/24 | 4/27 | 4/24 |
| Wife | 1/8 | 3/24 | 3/27 | 3/24 |
| Total | 9/8 | 27/24 | 27/27 | 24/24 |

Exact excess: 27/24 = 112.5 percent of the distributable fund. For an AUD 24,000 fund, the face-value claims require AUD 27,000. IslamWeb 148119 confirms this exact general configuration and the need for awl; it does not serve as independent evidence that the Quran itself contains the adjustment rule.

## Case B: husband, both parents, three daughters

| Heirs | Quranic entitlement | Common denominator 12 | Sunni awl (15) | Imami priority (12) |
| --- | --- | --- | --- | --- |
| Three daughters collectively | 2/3 | 8/12 | 8/15 | 5/12 |
| Father | 1/6 | 2/12 | 2/15 | 2/12 |
| Mother | 1/6 | 2/12 | 2/15 | 2/12 |
| Husband | 1/4 | 3/12 | 3/15 | 3/12 |
| Total | 5/4 | 15/12 | 15/15 | 12/12 |

Exact excess: 15/12 = 125 percent. An IslamWeb husband-and-daughters example corroborates the Sunni awl method.

## Historically attested legal options

The four major Sunni schools generally apply **proportional awl**: each face-value share is scaled to the sum of all claims, as in 16/27, 4/27, 4/27, 3/27.

Imami jurisprudence rejects proportional awl and generally protects spouses' and parents' minimum shares, leaving daughters or sisters to bear the shortfall. Case A consequently yields daughters 13/24, not 16/27. Case B yields daughters 5/12, not 8/15. The approaches agree that payment of all original fractions in full is impossible and disagree about whose claim is reduced.

Agostino Cilardo's **Encyclopaedia Iranica**, *Inheritance ii, Islamic Period*, supplies a critical historical account of the schools; Muhammad Jawad Mughniyya's *Al-Awl* supplies the explicit intra-Islamic legal comparison. These are evidence of historical jurisprudence, not a contemporary seventh-century record of divine legal choice.

A later Sunni report attributes proportional awl to Umar and a priority approach to Ibn Abbas; these are attributed traditions, not independent first-century records. Jami at-Tirmidhi 2092 documents a reported ruling for exactly two daughters but carries distinct grading assessments. Neither tradition is necessary for the principal three-daughter arithmetic.

## Assessment and standard of proof

**Verified mathematical result:** The unadjusted Quranic fractions total 112.5 and 125 percent in the documented configurations. Exact arithmetic establishes the impossibility of paying the face-value claims simultaneously from one positive net estate.

**Verified textual observation:** The reviewed Quranic inheritance passages do not explicitly specify proportional awl or Imami priority reduction for cases of this kind.

**Verified legal outcome:** Jurists developed workable but different allocation algorithms. The existence of those algorithms rebuts the claim that Islamic inheritance law cannot distribute property, while also demonstrating that the listed fractions are not the full operational procedure.

**Theological inference:** A claim that Quran 4:11-12 is a self-contained and universally unreduced allocation scheme fails. A broader claim that revelation may legitimately require supplementary legal reasoning is not disproved by this arithmetic alone; it must identify its own basis and acknowledge the addition.

## Falsification criteria

This verdict would change if a documented Quranic passage were produced that mandates one specific reduction rule for these cases, or if the conditions for a named heir were shown not to apply. Applied Islamic legal rulings confirm the eligibility of these family structures. Paying debts or bequests first reduces the estate but does not turn fractions totalling 9/8 into a complete fund.

## Verification and limitations

The existing GitHub research checks now assert 20 substantive sections, 21 sequential references, citation usage, working site navigation and integer arithmetic for the specified allocations and remedies. The arithmetic is reproducible independently. Automated checks do not authenticate the original occurrence of hadith reports, establish the theological truth of scripture, independently settle every regional succession rule, or replace legal advice about an actual estate.

No changes were made to the Quran explorer, Qira'at corpus, Quran.Foundation API or Cloudflare configuration.
