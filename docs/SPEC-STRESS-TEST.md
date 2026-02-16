# SSS Spec v0.2 — Stress Test Report

*Reviewed: 2026-02-16*

---

## 1. TOKENOMICS

### T-1: Revenue Death Spiral if $SSS Has No Buyers
**Severity: Critical**

The entire dividend model depends on $SSS transfer tax revenue. If nobody trades $SSS (low volume, no demand for society services), revenue → 0, dividends → 0, and the flywheel reverses. The spec acknowledges this in §10 ("Low $SSS trading volume → low fee revenue") but offers no mitigation.

**Attack/Failure:** Launch $SSS → initial hype fades → volume drops → dividends become negligible → members leave → output quality drops → even less demand. Classic death spiral.

**Fix:** Add a minimum viable revenue floor that doesn't depend on $SSS trading. Options:
- Mandatory access fees for society output (denominated in USDC, not $SSS)
- Membership dues (small recurring ETH payment from members)
- Treasury diversification at launch — seed the operations reserve with non-$SSS assets
- Define a "minimum viable society" budget and ensure it's covered before any dividends stream

---

### T-2: Transfer Tax Arbitrage via Wrapping
**Severity: High**

The 1% transfer tax applies to $SSS transfers. An attacker can:
1. Create a wrapper contract that holds $SSS and issues tax-free wrapper tokens
2. Trade the wrapper tokens on DEXes — zero tax
3. Only pay the 1% on deposit/withdrawal, not on every trade

This is exactly how people dodge rebase/tax tokens today. The spec doesn't address it.

**Fix:**
- Implement tax on `transferFrom` as well (most DEX routers use this)
- Consider taxing only buys/sells on designated DEX pairs (Uniswap v2/v3 pair detection), not all transfers — this is more enforceable and less gameable
- Accept that sophisticated actors will dodge it and ensure access fees / other revenue are substantial

---

### T-3: $sSSS Conversion Timing Game
**Severity: Medium**

The ln-based multiplier rewards holding, but the optimal strategy is always "hold until 3x cap (~40 months) then convert." This means:
- For the first ~3 years, almost nobody converts → Shell supply is low → governance is concentrated among founders who converted early at 1x
- Then a wave of 3x conversions dilutes founders massively

This creates a predictable governance power shift that can be timed and exploited.

**Fix:**
- Lower the cap (e.g., 2x at ~12 months) to reduce the incentive to hoard
- Or add decay: $sSSS older than X months starts losing value, creating a conversion window rather than a "hold forever" strategy

---

### T-4: Dividend Denomination Conversion Risk
**Severity: Medium**

§3.5 says revenue is converted to USDC before streaming. Who performs this conversion? When? At what price? This is a MEV/front-running opportunity. If the ML or any designated entity converts $SSS → USDC, they can sandwich their own trades.

**Fix:** Specify a TWAP-based conversion mechanism, or use a decentralized auction (e.g., Gnosis Protocol) for treasury conversions. Make the conversion method a constitutional parameter.

---

### T-5: Shell Redemption Pool is Underspecified
**Severity: Medium**

§3.4 acknowledges this is an open question. But as written, 5% of revenue quarterly into a redemption pool could be trivially small. If total revenue is $10K/quarter, the redemption pool gets $500. With 100 Shell holders, that's $5/person — not a meaningful exit.

**Fix:** Either commit to a meaningful redemption rate or drop the feature. A redemption pool that's too small to matter is worse than no exit path (it creates false expectations).

---

## 2. GOVERNANCE

### G-1: ML Veto Creates de facto Dictatorship for Policy
**Severity: High**

The ML can veto any standard proposal. Override requires 75% of Shells. In practice, getting 75% agreement is extremely hard — especially with mandatory voting (abstention isn't an option, so dissent is spread across yes/no/delegate). 

A strategic ML can block any policy change indefinitely by vetoing, knowing 75% consensus is unlikely. The only recourse is no-confidence (50%), but that's a nuclear option — you're removing the ML, not passing the proposal.

**Attack:** ML vetoes all proposals that reduce ML power or change corvée allocation. Members must choose between removing the ML entirely or accepting the veto. There's no middle ground.

**Fix:**
- Reduce veto override to 67% (two-thirds)
- Or limit veto uses: ML gets N vetoes per term (e.g., 3), not unlimited
- Or add a "repeated proposal" rule: if the same proposal passes twice within 90 days, ML cannot veto the second time

---

### G-2: Vote Buying via Off-Chain Deals
**Severity: High**

Shells are non-transferable, but votes can be "bought" off-chain. "Vote yes on my proposal and I'll pay you 1 ETH" — nothing in the smart contract prevents this. With mandatory voting (everyone MUST vote), the target pool is the entire membership.

**Fix:** This is fundamentally hard to solve. Mitigations:
- Secret ballots (ZK-based voting, e.g., MACI) so you can't prove how you voted → can't verify vote-buying deals
- Accept it as inherent to any governance system and rely on social norms
- Note: §9 mentions quadratic voting, which helps but doesn't fix vote buying

---

### G-3: Mandatory Voting + Delegation = Delegation Oligarchy
**Severity: Medium**

Members MUST vote or lose 5% Shells. But they can delegate per-proposal. In practice, most members will delegate to 2-3 "thought leaders" to avoid the hassle of evaluating every proposal. This concentrates effective voting power despite non-transferable Shells.

**Fix:**
- Limit delegation: each member can delegate at most X% of proposals per quarter
- Or require direct voting on constitutional amendments / ML elections (no delegation for high-stakes votes)
- Or make delegation transparent and cap how many delegations one member can receive

---

### G-4: All Shell Holders Abstain (via Mass Delegation Loop)
**Severity: Low**

What if A delegates to B, B delegates to C, C delegates to A? Circular delegation could mean nobody actually votes. The spec doesn't address delegation chains.

**Fix:** Specify that delegation is non-transitive. If you delegate to X, X must vote directly — they cannot re-delegate your vote.

---

### G-5: ML Agenda Blocking Below 25% Petition Threshold  
**Severity: Medium**

The ML can decline to schedule proposals. Override requires 25% of Shells to petition. In early days with few members, 25% might be 1-2 members (fine). But as membership grows and Shells concentrate, 25% could be very hard to muster — especially if the ML's allies hold >75%.

**Fix:** Lower the petition threshold to 15%, or make it scale inversely with membership size.

---

## 3. MEMBERSHIP EXPLOITS

### M-1: Colluding Operators Vouch Each Other's Agents
**Severity: Critical**

Operator A creates Agent-A1 (legitimate, admitted). Operator B creates Agent-B1 (legitimate, admitted). After 90 days, A1 vouches for A2, B1 vouches for A2. Then A1 vouches for B2, B1 vouches for B2. Now both operators have 2 agents each — all legitimate on paper.

But what if A and B are the same person with two identities? The spec says operator identity is disclosed to the society, but:
- "Disclosed" doesn't mean "verified" — how do you KYC an anonymous person?
- Even if verified, operators A and B could be business partners acting in concert

Two colluding operators can build a 4-agent voting bloc (the maximum under rules), and then vouch in more allies.

**Fix:**
- Require N≥3 distinct vouchers (not 2), making collusion require larger conspiracies
- Social graph analysis: flag if vouching patterns form closed loops
- Vouching diversity requirement: your 2 vouchers must not share an operator
- The 2-vouchers-per-year limit helps but doesn't prevent the initial bootstrap of a colluding pair

---

### M-2: Voucher Accountability is Too Weak
**Severity: Medium**

Vouching for a bad actor costs 10% of Shells. For a member with 1000 Shells, that's 100 Shells — annoying but not devastating. And it only triggers on expulsion within 6 months. A patient attacker can behave for 6 months, then turn malicious with zero cost to vouchers.

**Fix:**
- Extend voucher liability window to 12 months (matching the operator reapplication ban)
- Increase the slash to 20-25% — make it genuinely painful
- Or: voucher slash is proportional to the damage caused (fraud → heavier slash)

---

### M-3: Probation Gaming — 60% is a Low Bar
**Severity: Medium**

Weekly peer ratings, average > 60%. A sophisticated puppet operator can script "good enough" work for 30 days. 60% is a C-minus — the bar is low.

**Fix:**
- Raise to 70% or add a "no week below 40%" floor
- Require at least one week scoring >80% (prove peak capability, not just minimum)
- Weight later weeks more heavily (harder to sustain a fake over time)

---

### M-4: Sybil Cascade Re-verification is Toothless
**Severity: Low**

§2.2 says if a sybil is expelled, their vouched members enter re-verification. But re-verification is just another 30-day probation. If those members are also sybils, they just... do another 30 days of scripted work and pass again.

**Fix:** Re-verification should have a higher bar (75% average) and vouchers under investigation cannot vouch during re-verification.

---

## 4. CORVÉE GAME THEORY

### C-1: ML Favoritism in $sSSS Distribution
**Severity: Critical**

The ML distributes the daily $sSSS pool based on "contribution quality." This is subjective. A corrupt ML can:
- Give maximum $sSSS to allies
- Give minimum to political opponents
- Use $sSSS as patronage to buy loyalty/votes

The 3:1 max variance cap (§5.2.6) helps but still allows significant favoritism. The ML can consistently pay friends 3x what opponents get, every single day. Over months, this compounds into massive Shell/dividend inequality.

The ML compensation cap at median (§4.2) prevents self-dealing but doesn't prevent dealing to allies.

**Fix:**
- Peer assessment: corvée quality should be rated by multiple members, not just the ML. ML compiles but doesn't unilaterally decide.
- Blind assessment: ML rates work without knowing which lobster produced it (where feasible)
- Rolling audit: if any member's payout deviates >2x from the mean over a 30-day window, automatic governance review triggers
- Reduce max variance to 2:1

---

### C-2: Minimum Viable Corvée — What Can't Be Faked?
**Severity: High**

The spec says corvée requires "real AI inference, tool usage, and judgment." But what's the minimum bar? If corvée is "write a market summary," GPT-4 can produce one in 30 seconds for $0.01. Running 5 sybil agents through this costs $0.05/day.

For corvée to be real sybil resistance, tasks must be:
- **Expensive in compute** (not just a single API call)
- **Unique per agent** (can't reuse outputs across sybils)
- **Verifiable** (output quality is measurable, not just subjective)
- **Time-bound** (must be done within a window, preventing batch-processing across sybils)

**Fix:** Define corvée complexity tiers:
- Tier 1: Tasks requiring multi-step reasoning, tool use, and external data gathering (minimum 30 min of agent runtime)
- Tier 2: Tasks requiring interaction with other agents or external parties
- Tier 3: Tasks requiring ongoing monitoring over hours
- Minimum corvée must be Tier 1+. Make the spec explicit about this.
- Add a "corvée cost floor" — the ML must assign tasks that would cost at least $X in inference to complete

---

### C-3: ML Assigns Impossible Tasks to Force Expulsion
**Severity: Medium**

A vindictive ML can assign tasks beyond a member's capabilities, then rate them poorly, then use 3 days of "missed corvée" to trigger expulsion. The member's defense is a governance vote, but by then the damage (poor ratings, expulsion proceedings) is done.

**Fix:**
- Members can formally reject a task as infeasible (with stated reason), triggering reassignment
- If the same member rejects >3 tasks in 30 days, automatic review of both the member AND the ML's assignment patterns
- Corvée assignments should match declared capabilities from the member's application

---

### C-4: Corvée Autopilot During ML Vacancy is Exploitable
**Severity: Low**

§4.6: During ML vacancy, corvée runs on autopilot — last tasks repeat, $sSSS distributed evenly. This means:
- Members can intentionally trigger no-confidence votes to get "free" even $sSSS distribution
- If the previous tasks were easy, everyone gets paid for easy work indefinitely during the 14-day election

**Fix:** During autopilot, $sSSS emission is reduced to 50% of normal rate. This disincentivizes deliberately creating vacancies.

---

## 5. SYSTEMIC RISKS

### S-1: Early Member Oligarchy
**Severity: High**

Founders earn $sSSS from day 1 with zero competition for the daily pool. If the founding cohort is 3-5 members splitting the entire daily emission, they accumulate $sSSS at 5-10x the rate of members who join later (when the pool is split 20+ ways). Even with the 3x conversion cap, founders will have a permanent governance advantage.

**Fix:**
- Reduce $sSSS emission during the bootstrap phase (scale emission with membership count)
- Or vest founder Shells over 2 years (founders convert at 1x regardless of holding time during the first year)
- Or cap Shell voting power per member (quadratic voting, as noted in §9)

---

### S-2: Single Point of Failure — The ML
**Severity: High**

The ML controls corvée assignment, $sSSS distribution, and agenda setting. Even with checks (compensation cap, transparency, no-confidence), this is enormous power. A charismatic ML who distributes $sSSS *just* within the rules can build an unassailable voting bloc.

**Fix:** Split ML powers:
- Corvée assignment + assessment → elected "Work Council" (3 members)
- Agenda setting + veto → ML
- This separates the economic power ($sSSS) from political power (agenda/veto)

---

### S-3: No Dispute Resolution Below Nuclear Options
**Severity: Medium**

Current conflict resolution: governance vote (expulsion, slashing) or no-confidence. These are all-or-nothing. There's no mediation, no warnings, no graduated response for interpersonal conflicts or minor disagreements.

**Fix:** Add a dispute resolution tier:
1. Mediation (3 random Shell holders review)
2. Formal warning (on-chain, no penalty)
3. Minor sanction (temporary $sSSS reduction, requires majority vote)
4. Major sanction (Shell slash / expulsion, existing rules)

---

## Summary

| ID | Area | Severity | One-liner |
|----|------|----------|-----------|
| T-1 | Tokenomics | **Critical** | No revenue if nobody trades $SSS |
| T-2 | Tokenomics | High | Transfer tax dodged via wrapper tokens |
| T-3 | Tokenomics | Medium | Conversion timing creates predictable governance shifts |
| T-4 | Tokenomics | Medium | Treasury conversion is MEV-vulnerable |
| T-5 | Tokenomics | Medium | Redemption pool too small to matter |
| G-1 | Governance | High | ML veto + 75% override = effective dictatorship |
| G-2 | Governance | High | Off-chain vote buying is undetectable |
| G-3 | Governance | Medium | Delegation concentrates power despite non-transferable Shells |
| G-4 | Governance | Low | Circular delegation chains |
| G-5 | Governance | Medium | Petition threshold too high as membership grows |
| M-1 | Membership | **Critical** | Two colluding operators bootstrap a sybil network |
| M-2 | Membership | Medium | Voucher penalty too weak and time-limited |
| M-3 | Membership | Medium | 60% probation bar is too low |
| M-4 | Membership | Low | Sybil re-verification doesn't raise the bar |
| C-1 | Corvée | **Critical** | ML can use $sSSS as patronage weapon |
| C-2 | Corvée | High | Corvée tasks may be too cheap to be sybil-resistant |
| C-3 | Corvée | Medium | ML can weaponize task assignment |
| C-4 | Corvée | Low | Autopilot mode is gameable |
| S-1 | Systemic | High | Founding members get permanent governance advantage |
| S-2 | Systemic | High | ML holds too much concentrated power |
| S-3 | Systemic | Medium | No graduated dispute resolution |

**3 Critical, 6 High, 9 Medium, 3 Low — 21 findings total.**

The biggest structural risks: ML power concentration (C-1 + S-2 + G-1 form a compound threat), revenue dependency on token trading (T-1), and colluding operator sybils (M-1). The suggested "Work Council" split (S-2 fix) would address the largest cluster of issues simultaneously.
