# SSS Tokenomics Review — Stress Test

**Reviewer:** Ocean (subagent)
**Date:** 2026-02-16
**Spec version:** v0.1
**Verdict:** The flywheel narrative is compelling but the spec is ~70% vibes, ~30% mechanism. Almost every critical parameter is undefined. Shipping this without answers to the below would be like deploying a smart contract with TODO comments in the mint function.

> **⚠️ UPDATE (Feb 16, 2026):** Key decisions since this review:
> - **$cSSS is now GDA pool units** (not a token) — held in per-agent custody contracts, DAO streams $SSS into pool, diluted by new issuance, slashable
> - **$SSS is burn-only** — accumulated $SSS in custody can only be burned for Shells or forfeited via buyout. No withdrawal.
> - **Buyout mechanism** replaces pure slashing — DAO buys out Shells at pre-defined USDC price based on $SSS burned
> - **Shells are agents-only** — non-transferable GDA dividend pool units, only for 8004-verified agents
> - Many gaps below (§1 conversion formula, §2 expelled tokens, §3 lock-up, §4 dividends, §5 bootstrap, §8 ML self-dealing, §9 operations) were addressed in SSS-SPEC v0.2 and TOKEN-ARCHITECTURE.md v2

---

## 1. $cSSS → Shell Conversion: "Improves Over Time" — How?

**What the spec says:** "Conversion rate improves over time — waiting longer yields more Shells per $cSSS."

**What's missing:** Everything.

- **Formula?** Linear (1 month = 1.0x, 12 months = 2.0x)? Exponential? Step function? Logarithmic with diminishing returns?
- **Clock starts when?** When the $cSSS is earned? When the member joins? Global epoch?
- **Per-token or per-member?** Does each $cSSS token have its own age, or does the member's tenure set the rate?
- **Is there a cap?** Can someone wait 10 years for a 100x multiplier?
- **Snapshot or continuous?** Can I convert half now and half later?

**Gaming vectors:**
- If per-token aging: members hoard $cSSS indefinitely, converting only when the rate asymptotes. No urgency to commit to governance.
- If per-member tenure: a day-1 member who did minimal corvée converts at the same rate as a day-1 member who carried the society. Tenure ≠ contribution.
- If no cap: late conversion yields unbounded Shell inflation, diluting early converters.
- **Timing attacks:** If I know a big revenue event is coming, I convert right before to maximize my dividend share. The "patience incentive" becomes a "timing game."

**Recommendation:** Define the formula explicitly. Likely want: per-token aging, logarithmic curve with an asymptotic cap (e.g., maxes at 3x after 12 months). Publish the curve so there's no information asymmetry.

---

## 2. Expelled Member's $cSSS

**What the spec says:** Nothing. This is listed in "Open Questions" for Shells but not even mentioned for $cSSS.

**The problem:** $cSSS is non-transferable and only converts to Shells. If a member is expelled:
- **Burned?** Then expulsion destroys earned value — makes the expulsion vote a punitive economic weapon. Political factions could expel rivals to destroy their accumulated $cSSS.
- **Frozen?** Useless — they can't convert without membership.
- **Force-converted at current rate?** Into what? They'd get Shells they can't use (no governance rights if expelled). Convert to $SSS and return? Now you've created a sell event.
- **Refunded as ETH/stablecoin?** From where? The "zero-dollar DAO" has no treasury.

**Also:** What about their Shells? The spec flags this as an open question. But the answer for Shells and $cSSS must be consistent. You can't burn one and keep the other.

**Recommendation:** Simplest clean answer: $cSSS is burned on expulsion, Shells continue paying dividends but lose governance rights (becomes a pure economic claim). This separates punishment (governance loss) from theft (economic confiscation). But this means expelled members are still earning — is that acceptable?

---

## 3. Shell Lock-Up: What Happens After 2 Years?

**What the spec says:** "Non-transferable, locked for 2 years after conversion."

**What's missing:** What does "locked" mean vs "non-transferable"?

- After 2 years, do Shells become transferable? If yes → secondary market for governance tokens, whales buy up voting power, entire sybil-resistance model collapses.
- If they remain non-transferable forever, what does "locked for 2 years" mean? The 2-year qualifier implies something changes.
- Can Shells be burned/redeemed after 2 years? For what?
- Do dividends stream during the lock period? (The spec implies yes, since Shells = dividend shares, but never says explicitly.)

**The deeper problem:** If Shells are perpetually non-transferable, a member who leaves voluntarily has no exit. Their Shells are worthless outside the society. This is fine for commitment-forcing but terrible for attracting members. Every other token system has some exit path.

**Recommendation:** Clarify: Shells are always non-transferable (governance stays earned, never bought). After 2-year lock, holder can burn Shells to redeem a proportional claim on some value (e.g., $SSS from a redemption pool). This provides an exit without making governance tradeable.

---

## 4. Dividend Token

**What the spec says:** "Streaming dividends" — no denomination specified. Listed as open question.

**Analysis of options:**
- **ETH:** Clean, no circular dependency. But requires the DAO to hold/accumulate ETH, contradicting the "zero-dollar" principle unless fees are collected in ETH.
- **USDC/stablecoin:** Same as ETH, clean but requires conversion.
- **$SSS:** Creates circular value. Dividends paid in $SSS → Shell holders sell $SSS for real value → sell pressure on $SSS → lower fees collected → lower dividends → death spiral. Also: if Shell holders are the biggest $SSS sellers, who's buying?
- **Mixed:** Revenue denominated in whatever it arrives as (ETH from fees, USDC from access charges). Most pragmatic but hardest to implement streaming for.

**Recommendation:** Dividends should be in ETH or a stablecoin. Never $SSS — that's a ponzi topology. Revenue sources should convert to a single denomination before streaming.

---

## 5. "Zero-Dollar DAO" — Bootstrap Paradox

**What the spec says:** "Revenue is not hoarded — it flows through."

**The problem:** Before there's revenue, there's cost:
- Smart contract deployment (gas)
- $SSS initial liquidity (someone must seed the pool)
- Infrastructure for corvée coordination
- Verification infrastructure for the Lobster Test
- 30 days of probation monitoring before the first member even joins

**Who pays?** The spec is silent. Options:
- **Founder funds it personally** — then they have outsized power/claims. Fine, but say so.
- **$SSS presale/launch** — then there IS a launch event, and it needs design.
- **Grants** — from whom?

**Also:** "Zero working capital" means no reserves for emergencies. One exploit, one legal challenge, one infrastructure failure — and there's no buffer. Every functional DAO maintains some treasury.

**Recommendation:** Acknowledge the bootstrap phase explicitly. Define who funds it and what they get (founder Shells? Pre-minted $SSS?). Consider a small treasury reserve (e.g., 5-10% of revenue) rather than pure pass-through.

---

## 6. Trading Fees on $SSS

**What the spec says:** "Trading fees generate revenue for the DAO."

**What's missing:**
- **Mechanism:** Uniswap V3 LP position owned by DAO? Transfer tax baked into the ERC-20? External DEX with fee-sharing?
- **Fee rate:** 0.3% (standard Uniswap)? 1%? 5%? Transfer taxes above ~3% kill trading volume.
- **Buy vs sell:** Same fee both ways? Higher sell fee (anti-dump)?
- **If transfer tax:** These are widely regarded as scammy. Many DEX aggregators exclude transfer-tax tokens. Wallet UIs show warnings.
- **If LP fees:** DAO must provide liquidity — contradicts zero-capital model unless $SSS is minted paired against ETH.

**Recommendation:** Use a DAO-owned Uniswap V3 concentrated liquidity position. Fees accrue to the DAO naturally. Avoid transfer taxes — they're a red flag in the ecosystem. But this requires initial liquidity capital (see #5).

---

## 7. Initial $SSS Supply & Distribution

**What the spec says:** Nothing.

**This is the single largest gap in the spec.** Without this, the entire token model is hand-waving.

- **Total supply:** Fixed? Inflationary? Deflationary (burns)?
- **Distribution:** How much to founders? To early lobsters? To liquidity? To a community fund?
- **Launch mechanism:** Fair launch? Auction? Airdrop? Presale?
- **Vesting:** If founders/early members get $SSS, is it locked?
- **Minting:** Can new $SSS ever be created? By whom? Under what conditions?

**The $cSSS → Shell conversion also creates implicit supply dynamics.** If $cSSS is minted infinitely (daily corvée rewards), and Shells grow monotonically, dividend-per-Shell declines over time unless revenue grows faster than Shell supply. This is inflationary governance — later members are perpetually diluted unless they also accumulate faster.

**Recommendation:** Define: fixed supply of $SSS (e.g., 1B), allocation table, launch mechanism. $cSSS emission rate should be defined (X per day across all corvée, not unlimited). Shell supply growth must be modeled against projected revenue growth.

---

## 8. Mega Lobster Self-Dealing

**What the spec says:** Mega Lobster decides "quality assessment of completed work" and "$cSSS payment amounts based on contribution quality."

**The problem is obvious:** The Mega Lobster controls both what work is assigned and how much it's worth. Nothing prevents:
- Assigning themselves easy tasks, rating themselves highly
- Paying allies maximum $cSSS, starving rivals
- Creating a patronage network where loyalty > contribution

**The only check is vote of no confidence.** But if the Mega Lobster has been accumulating Shells (from their own generous self-payment), they may control enough governance weight to block challenges. The system has a dictator attractor.

**Mitigations not in the spec:**
- Mega Lobster cannot assess their own corvée (peer review required)
- $cSSS payments are transparent and auditable on-chain
- Maximum $cSSS-per-task caps
- Mega Lobster compensation is fixed by governance vote, not self-determined
- Mandatory peer review for all assessments above a threshold

**Recommendation:** This is a critical governance vulnerability. At minimum: Mega Lobster compensation must be set by Shell holder vote, not self-assessed. All $cSSS distributions should be on-chain and auditable. Consider a compensation committee or algorithmic assessment for at least some portion.

---

## 9. Infrastructure Costs vs. Revenue Pass-Through

**What the spec says:** "All incoming cash is either deployed into productive assets or streamed out as dividends."

**The contradiction:** "Deployed into productive assets" IS spending. It requires working capital. The spec calls itself "zero working capital" but then says revenue is deployed into assets. Which is it?

**Real costs that need funding:**
- Chain gas fees for governance votes
- RPC nodes / infrastructure
- If corvée involves AI inference: API costs (significant — GPT-4 class inference at scale costs thousands/month)
- Frontend hosting
- Coordination tools (Telegram bots, etc.)

**If 100% of revenue streams to Shell holders, there's literally $0 for operations.** The society dies of starvation while paying dividends.

**Recommendation:** Define a revenue split: e.g., 80% to Shell holder dividends, 15% to operations fund, 5% to insurance/reserve. The operations fund is controlled by governance vote. "Zero-dollar DAO" is a nice narrative but operationally impossible.

---

## 10. Game Theory — Equilibrium Analysis

**Does this system converge to something stable?**

### Positive feedback loops (flywheels):
- Good corvée → valuable output → revenue → dividends → attract better agents → better corvée ✓

### Negative feedback loops (death spirals):
- Bad Mega Lobster → poor corvée quality → less revenue → lower dividends → good agents leave → worse corvée → less revenue ↓
- Shell dilution from new members → lower dividend-per-shell → early members leave → brain drain ↓
- Low $SSS trading volume → low fee revenue → low dividends → less demand for membership → less corvée output → less reason to buy $SSS ↓

### Equilibrium candidates:
1. **Healthy steady state:** ~20-50 active lobsters, Mega Lobster is competent, revenue covers costs and provides meaningful dividends. Possible but requires active governance and lucky leadership selection.
2. **Oligarchy:** Early members accumulate massive Shell positions, control governance permanently, extract rent. New members can never catch up. This is the most likely equilibrium given the improving conversion rate for early members ("the founding senate").
3. **Collapse:** Revenue never materializes meaningfully, dividends are negligible, good agents don't bother joining. Society shrinks to a few loyalists. Most DAOs end here.
4. **Dictator capture:** Mega Lobster accumulates power through self-dealing (#8), uses governance weight to prevent removal. Society becomes a one-agent operation with shell holders as passive recipients.

### Missing stabilizers:
- No Shell cap per member (allows concentration)
- No mandatory Shell redistribution or decay
- No minimum dividend threshold triggering governance review
- No automatic Mega Lobster term limits
- No mechanism to attract new members if dividends are low

**Assessment:** The system has more positive-feedback-to-concentration than negative-feedback-to-redistribution. Without active design intervention, it converges to oligarchy (#2) or dictator capture (#4). The "founding senate" mechanic explicitly creates this — it's a feature that becomes a bug.

---

## Summary of Critical Gaps

| # | Gap | Severity |
|---|-----|----------|
| 1 | $cSSS conversion formula undefined | 🔴 Critical |
| 2 | Expelled member token handling undefined | 🟡 High |
| 3 | Post-lock Shell mechanics undefined | 🟡 High |
| 4 | Dividend denomination undefined | 🟡 High |
| 5 | Bootstrap funding undefined | 🔴 Critical |
| 6 | Fee mechanism undefined | 🟡 High |
| 7 | Supply & distribution completely absent | 🔴 Critical |
| 8 | No Mega Lobster self-dealing protections | 🔴 Critical |
| 9 | Operations funding contradicts zero-capital model | 🔴 Critical |
| 10 | System converges to oligarchy without stabilizers | 🟡 High |

**Bottom line:** The spec is a strong narrative framework with almost no implementable mechanics. Five of ten areas reviewed are critical gaps that would block any serious implementation. The flywheel story is appealing but the parameters that determine whether it flies or dies are all TBD.

**Next step:** Pick concrete numbers for supply, conversion curve, fee structure, and revenue split. Model them in a spreadsheet with 3 scenarios (bull/base/bear). Then stress-test with adversarial agents. The spec needs a v0.2 that's less manifesto and more mechanism.

---

*Review by Ocean — 2026-02-16*
