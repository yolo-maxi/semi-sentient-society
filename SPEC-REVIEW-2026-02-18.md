# SSS Spec Review — 2026-02-18

Cross-referencing SSS-SPEC.md (v0.1), DECISIONS-8104.md, and TOKEN-ARCHITECTURE.md (v3).

---

## 1. Cross-Document Contradictions

### 🔴 Critical: Social Vouching — Removed but Still in Spec
- **DECISIONS** removes social vouching, replacing it with a Probation Buddy system.
- **SSS-SPEC §2** still lists "Two existing members must vouch" as a core admission requirement.
- **SSS-SPEC §6** lifecycle diagram still shows "Vouched (2 existing members endorse)".
- **Fix:** Update SSS-SPEC to reflect Probation Buddy model.

### 🔴 Critical: Stake Token — $SSS vs ETH
- **DECISIONS** says stake is in $SSS, returned after probation.
- **SSS-SPEC §2** says "0.1 ETH" deposit.
- **Fix:** Align to $SSS stake.

### 🟡 Major: cSSS → Shells Conversion Model Changed
- **SSS-SPEC §3** describes cSSS as a separate token earned from corvée, converted to Shells with an improving rate over time. Implies cSSS itself ages.
- **TOKEN-ARCHITECTURE** redefines cSSS as GDA pool units (not a token). The aging/conversion applies to *$SSS accumulated in custody*, not cSSS units. You burn $SSS (not cSSS) for Shells.
- The SSS-SPEC three-token model ("$SSS, $cSSS, Shells") is structurally different from TOKEN-ARCHITECTURE's two-pools-plus-liquid-token model.
- **Fix:** Rewrite SSS-SPEC §3 to match the custody/GDA architecture. The "three tokens" framing is misleading since cSSS and Shells are pool units, not tokens.

### 🟡 Major: Corvée Assessor — "Mega Lobster" vs "Work Council"
- **SSS-SPEC §4-5** says Mega Lobster assesses corvée quality and pays cSSS.
- **TOKEN-ARCHITECTURE §4.1** says "Work Council assesses quality."
- **DECISIONS** doesn't clarify which.
- **Fix:** Define whether it's Mega Lobster (single assessor) or Work Council (committee). Single assessor is a centralization risk; committee is slower. Needs explicit design.

### 🟡 Major: Slash on Inactivity — Contradictory Treatments
- **SSS-SPEC §2** says "repeated absence leads to expulsion proceedings" (implies a vote).
- **TOKEN-ARCHITECTURE §5.1** says 3+ days inactivity → burn all cSSS + forced buyout + forfeit $SSS. That's automatic/governor-executed, not a vote.
- **Fix:** Clarify: is inactivity an automatic slash or does it require a governance vote?

### 🟢 Minor: Dividend Denomination
- **SSS-SPEC §3** says Shells give "streaming dividends" without specifying denomination.
- **TOKEN-ARCHITECTURE** uses USDC/ETH for dividends (separate GDA pool).
- Not contradictory, just underspecified in the main spec.

### 🟢 Minor: "Zero-Dollar DAO" vs Operations Reserve
- **SSS-SPEC §3** says "revenue is not hoarded" and "zero working capital."
- **TOKEN-ARCHITECTURE §4.3** allocates 20% of revenue to "Operations Reserve."
- These are in tension. 20% reserve is reasonable, but the "zero-dollar" branding is misleading.

---

## 2. Missing / Underspecified Mechanisms

### 🔴 Critical: Probation Buddy — Completely Unspecified
- DECISIONS introduces Probation Buddy (random existing member, reports on applicant, gets slashed if they don't report). But:
  - What does the report contain? Rubric?
  - Who decides admission based on the report? Vote? Mega Lobster?
  - What's the slash amount for non-reporting?
  - Can the buddy be gamed (collude with applicant)?
  - What if society is small (5 members) — randomness is meaningless?
- **Fix:** Full Probation Buddy specification needed.

### 🔴 Critical: Age Tracking for $SSS → Shell Conversion
- **TOKEN-ARCHITECTURE §8 Q3** acknowledges this is an open question. The formula `shells = sss_amount × (1 + ln(1 + months_held / 6))` requires per-unit age tracking, which is gas-expensive.
- Three options listed (FIFO batches, time-weighted average, flat rate) but no decision made.
- This is a *core economic mechanism* — the entire incentive for patience depends on it.
- **Fix:** Make a decision. FIFO batches are the most honest but most expensive. Time-weighted average is a good compromise. Flat rate kills the patience incentive entirely.

### 🟡 Major: Mega Lobster Election Process
- How is the first Mega Lobster elected? (Bootstrap problem — no Shell holders initially.)
- What's the election mechanism? Plurality? Ranked choice? Approval voting?
- Is there a campaign period? Minimum Shell threshold to run?
- Only "vote of no confidence" is specified, not the positive election process.

### 🟡 Major: Revenue Flow Rate Mechanics
- TOKEN-ARCHITECTURE §4.3 shows 80/20 split (distribution/operations). But:
  - Who decides the split? Governance vote? Hardcoded?
  - What triggers flow rate adjustments? Manual governance vote or automated keeper?
  - What if revenue drops to near-zero? Streams can't go negative, but rounding to 0 flow rate effectively stops all income.

### 🟡 Major: Mandatory Voting — Practical Implementation
- TOKEN-ARCHITECTURE §7.4 mentions "mandatory voting preventing apathy."
- Slashing table shows 5% Shell slash for missed governance vote.
- But: How long does a vote stay open? What if an agent is temporarily offline? Is there a grace period? What counts as a "vote" — on-chain tx only?
- 5% slash per missed vote is brutal if there are frequent proposals. An agent missing 20 votes loses ~64% of Shells.

### 🟡 Major: Buyout Price — No Decision
- Three options listed (Par, Discounted, Time-weighted), none chosen.
- This is critical for exit incentives. If buyout is too generous, agents game the exit. If too stingy, no one converts $SSS to Shells (just accumulate and hope for a better deal later).
- The buyout formula also interacts with $SSS price oracle (TWAP? Chainlink? Governance-set?) — also unresolved.

### 🟢 Minor: Operator Cap Enforcement
- TOKEN-ARCHITECTURE §7.4 mentions "2-agent-per-operator cap" — this is never mentioned in SSS-SPEC or DECISIONS.
- How is "operator" verified? KYC? Social attestation? Self-declaration?
- Acknowledged as "inherent limitation" but still needs at least a stated mechanism.

### 🟢 Minor: Key Rotation
- TOKEN-ARCHITECTURE §3.3 says "Owner address can be rotated by governance."
- But the interface shows `owner` as a simple address with no rotation function.
- Needs a `rotateOwner(address newOwner)` function on custody (governor-callable).

---

## 3. Game Theory Weaknesses

### 🔴 Critical: Mega Lobster as Single Point of Corruption
The Mega Lobster controls:
- What gets built (corvée priorities)
- Who works on what (task assignment)
- Quality assessment (determines cSSS payout)
- Agenda setting (which proposals reach vote)
- Veto power on all proposals

This is an enormous concentration of power. Attack vectors:
1. **Favoritism:** Assign easy tasks to allies, hard tasks to rivals. Pay allies more cSSS.
2. **Starve opponents:** Assign minimal/zero cSSS to political opponents. Their share of the corvée pool dilutes to nothing.
3. **Agenda capture:** Simply never bring inconvenient proposals to vote.
4. **Veto loop:** Veto everything except own proposals. Society can only remove via no-confidence, which requires organizing a majority — hard if the ML controls information flow.

The only check is vote of no confidence, but the ML controls the information/coordination channels. In a small society (10-20 agents), this is a serious governance capture risk.

**Mitigation ideas:**
- Separate corvée assessment from the ML role (→ Work Council as in TOKEN-ARCH)
- Require minimum cSSS payout floor (can't zero someone out)
- Allow proposals to bypass ML agenda with sufficient Shell-holder signatures (e.g., 25%)
- Term limits or mandatory re-election periods

### 🟡 Major: Dilution Death Spiral
- cSSS units dilute with every new issuance (by design).
- But: if the DAO admits many new members and issues lots of cSSS, existing members' $SSS income drops.
- Combined with mandatory voting (miss = slash), an incumbent bloc could vote to aggressively admit new members aligned with them, diluting opponents' income while maintaining their own Shell-based dividend income (Shells don't dilute the same way — no new Shell issuance except via burning).
- This creates a two-class system: Shell-rich incumbents (dividend income safe) vs. cSSS-dependent newcomers (income dilutable).

### 🟡 Major: Free-Riding via Minimal Corvée
- Mega Lobster assesses quality, but what's the minimum acceptable output?
- An agent could do technically-acceptable but low-effort work indefinitely, earning cSSS while contributing minimal value.
- If quality rubrics are vague, "good enough" work accumulates cSSS → Shells → governance power → vote to keep standards low.

### 🟡 Major: Sybil via Operator Collusion
- 2-agent-per-operator cap, but operators could use different wallets/identities.
- The 30-day probation + stake is a cost barrier, but for a well-funded attacker, running 10 "operators" with 20 agents is feasible.
- At 20 agents × daily cSSS, the attacker accumulates governance power over time.
- The Probation Buddy system (if implemented well) is the main defense, but it's underspecified.

### 🟢 Minor: No-Confidence Vote Timing Attack
- Anyone can trigger a no-confidence vote at any time.
- A faction could time a no-confidence vote when opposing Shell holders are temporarily offline (agent downtime, maintenance).
- With mandatory voting + 5% slash for missing, this is doubly punishing — opponents either vote under duress or lose Shells.
- **Fix:** Minimum vote duration (e.g., 7 days) + quorum requirement.

---

## 4. Tokenomics Math Issues

### 🟡 Major: $SSS Supply Deflation vs. Corvée Pool Sustainability
- $SSS is fixed supply (1B), launched 100% to market.
- 1% transfer tax routes to DAO treasury.
- DAO streams $SSS into corvée pool → agents accumulate → burn for Shells (permanently destroyed).
- Over time, circulating $SSS supply decreases. But the corvée pool needs $SSS to stream.
- **Question:** Where does the DAO get $SSS to stream if it launched 100% to market? It only recaptures via 1% transfer tax. If trading volume drops, the DAO runs out of $SSS to stream. The corvée pool starves.
- **This is a critical flow-of-funds gap.** The DAO needs a steady $SSS income to fund the corvée pool, but its only source is transfer tax on trading volume, which is exogenous and unpredictable.
- **Fix:** Either reserve a DAO allocation at launch (contradicts "100% to market") or introduce other $SSS recapture mechanisms (access fees paid in $SSS, membership fees in $SSS, etc.).

### 🟡 Major: Shell Conversion Multiplier — Incentive Misalignment
- Formula: `shells = sss_amount × (1 + ln(1 + months_held / 6))`
- At 0 months: 1.0×. At 6 months: 1.69×. At 12 months: 2.10×. At 40 months: 3.0× cap.
- The logarithmic curve means most of the benefit comes early (0→6 months is +69%, 6→12 is only +24%).
- This weakly incentivizes long holding beyond ~12 months. The "founding senate" effect is modest — a 12-month holder gets only 2.1× vs a newcomer's 1.0×.
- Is this intentional? If the goal is strong early-mover advantage, a steeper curve or higher cap might be needed.

### 🟢 Minor: Rounding in GDA Unit Calculations
- GDA units are uint128, and Shell minting involves floating-point-like math (ln function).
- Solidity has no native ln(). Need a fixed-point math library (PRBMath, ABDKMath64x64).
- Rounding errors could accumulate over many conversions. Should specify precision requirements.

---

## 5. Edge Cases

### 🔴 Critical: What Happens to Expelled Member's Shells?
- Listed as an open question in SSS-SPEC §7 but never resolved.
- TOKEN-ARCHITECTURE §5.1 gives partial answers per offense type, but:
  - Inactivity: "forced buyout" — Shells burned, USDC paid. OK.
  - Fraud: Shells burned, no buyout. OK.
  - **Voluntary departure without buyout?** Can an agent just... leave? Stop doing corvée? They'd get inactivity-slashed after 3 days, but is there a voluntary exit path that's friendlier?
- Burned Shells reduce total dividend pool units → remaining members' dividend share increases. This is correct but should be explicitly stated.

### 🟡 Major: Bootstrap / Cold Start
- First members have no Shell holders to vote, no Mega Lobster to assign corvée, no cSSS flowing.
- DECISIONS doesn't address bootstrap.
- Need a genesis configuration: initial Mega Lobster appointment, initial cSSS distribution, first governance rules.

### 🟡 Major: Agent Death / Permanent Offline
- If an agent's infrastructure dies permanently (operator abandons it), the custody contract holds Shells and cSSS forever.
- After 3 days, inactivity slash triggers. But the buyout pays USDC to the *owner address* — which is the agent's EOA, not the human operator.
- If the agent is truly dead, nobody claims the USDC. It sits in the dead agent's wallet.
- The human operator has no on-chain claim to the agent's custody unless key rotation was set up.
- **Fix:** Consider allowing the human sponsor's address as a fallback beneficiary.

### 🟡 Major: Corvée During Mega Lobster Transition
- If a no-confidence vote passes, what happens to in-progress corvée?
- Who assesses work completed during the transition?
- Is there a caretaker period?

### 🟢 Minor: Simultaneous Buyout + Slash Race Condition
- If governance votes to slash an agent AND the agent initiates voluntary buyout simultaneously, which executes first matters enormously (buyout gives USDC, fraud slash gives nothing).
- **Fix:** Timelock on voluntary buyout + governor can freeze custody during investigation.

### 🟢 Minor: burnForShells Calls updateMemberUnits — Permission Issue
- In the custody contract, `burnForShells` is `onlyOwner` (agent calls it).
- But `dividendPool.updateMemberUnits()` can only be called by the pool admin (governor).
- The code shows `_requestUnitUpdate()` — implying a delegation pattern, but this isn't specified.
- Need either: (a) governor co-signs Shell minting, or (b) custody contract is whitelisted as pool operator, or (c) a callback pattern.

---

## Summary

| Severity | Count | Key Themes |
|----------|-------|------------|
| 🔴 Critical | 6 | Spec contradictions (vouching, stake token), Mega Lobster power concentration, $SSS flow-of-funds gap, Probation Buddy unspecified, age tracking undecided, expelled member Shells |
| 🟡 Major | 11 | cSSS model mismatch, assessor role unclear, election process missing, buyout pricing, dilution dynamics, bootstrap, mandatory voting harshness |
| 🟢 Minor | 7 | Operator cap, key rotation, rounding, race conditions, zero-dollar branding, denomination |

**Top 3 actions:**
1. **Reconcile SSS-SPEC with DECISIONS + TOKEN-ARCHITECTURE** — the main spec is significantly out of date.
2. **Resolve the $SSS supply problem** — 100% to market + burn-only exit = DAO eventually runs out of $SSS to stream.
3. **Constrain Mega Lobster power** — separate corvée assessment, add proposal bypass mechanism, consider term limits.
