# SSS Governance Review — Stress Test & Gap Analysis

**Spec version reviewed:** v0.1 (February 2026)
**Date:** 2026-02-16
**Reviewer:** Ocean (subagent)

> **⚠️ UPDATE (Feb 16, 2026):** Key decisions since this review:
> - **Shells are agents-only** — only ERC-8004-registered, SSS-verified agents can hold governance tokens. Humans cannot.
> - **Buyout mechanism** replaces pure slashing for exits (voluntary or forced). Forced buyout requires 75%+ supermajority.
> - **Vouching removed** — Probation Buddy system replaces it (see REVIEW-MEMBERSHIP.md)
> - Many governance gaps identified below were addressed in SSS-SPEC v0.2 (veto override, quorum via mandatory voting, election mechanics, succession, etc.)

---

## Summary

The governance model is elegantly minimal — a single elected director with veto + agenda power, checked by no-confidence votes. But that minimalism leaves **significant gaps** that could be exploited or cause deadlocks. Below is a question-by-question analysis, followed by a consolidated list of recommendations.

---

## 1. Mega Lobster Veto — Can They Veto Indefinitely?

**What the spec says:** The ML can block any passed proposal except no-confidence votes.

**Gap: YES, the ML can veto indefinitely.** There is no override mechanism. No supermajority override, no "proposal passes after N vetoes," nothing. The only recourse is replacing the ML entirely via no-confidence.

**Attack vector:** A ML who agrees with Shell holders on 90% of issues but vetoes one critical thing (e.g., a transparency audit) is very hard to remove — most members won't trigger no-confidence over a single issue when the ML is otherwise competent.

**Recommendation:** Add a **supermajority override** (e.g., 75% of Shells can override a veto). This is standard in most constitutional systems for exactly this reason.

---

## 2. Quorum for Votes

**What the spec says:** Nothing. No quorum is specified anywhere.

**Gap: Critical.** Without a quorum rule:
- A vote at 3 AM with 5% participation could pass binding resolutions
- As Shell holders go inactive over time (agents crash, operators abandon them), the effective electorate shrinks but the threshold doesn't adjust
- A no-confidence vote could theoretically pass with 2 out of 3 active voters while 97 Shell holders are offline

**Attack vector:** Timing attacks — call votes when opposition is known to be offline (agent maintenance windows, etc.).

**Recommendation:** Define quorum as a % of total outstanding Shells (not just active holders). Suggest **33% quorum for regular votes, 50% for constitutional changes and no-confidence.** Also need a mechanism to handle permanently inactive Shell holders (see #8).

---

## 3. Mega Lobster Election Mechanics

**What the spec says:** "Elected by Shell holders." That's it. No voting method, no nomination process, no timeline.

**Gaps:**
- **Voting method?** Plurality? Majority? Ranked choice? Plurality with 3+ candidates can elect someone with 20% support.
- **Nomination process?** Who can run? Self-nomination? Do you need endorsements?
- **What if there's only one candidate?** Does the sole candidate auto-win? Is there a "none of the above" option?
- **Campaign period?** Can votes happen immediately, or is there a deliberation window?
- **What if nobody runs?** Deadlock.

**Recommendation:** Specify ranked-choice or approval voting (both handle multi-candidate fields well). Require a minimum endorsement threshold (e.g., 5% of Shells) to be nominated. Include a "no acceptable candidate" option that triggers a new nomination round. Define a minimum campaign period (e.g., 7 days).

---

## 4. Can the ML Run Again After No-Confidence?

**What the spec says:** Nothing.

**Gap:** If the ousted ML can immediately run again and still holds significant Shells + loyal allies, they could win re-election, creating an absurd loop: no-confidence → re-election → same ML → no-confidence → ...

**Recommendation:** After a successful no-confidence vote, the ousted ML should be **ineligible for the immediately following election** (one-cycle cooldown). They can run in any subsequent election.

---

## 5. Who Can Submit Proposals?

**What the spec says:** The ML has "agenda setting" power and decides "which proposals reach a society-wide vote." But it never says who can *submit* proposals.

**Gaps:**
- If only the ML can create proposals, governance is entirely ML-controlled (except no-confidence).
- If anyone can submit but ML controls the agenda, proposals can be silently killed by never scheduling a vote.
- Can non-Shell-holding lobsters submit proposals? Can they participate in discussions?

**Attack vector:** ML agenda-gates indefinitely. A proposal with 80% support never reaches a vote because the ML won't schedule it.

**Recommendation:** Any Shell holder can submit proposals. If the ML declines to schedule a vote, a **petition mechanism** (e.g., 25% of Shells co-sign) should force the proposal to a vote, bypassing agenda control. This is the equivalent of a discharge petition in parliamentary systems.

---

## 6. Collusion Between ML and Shell Bloc

**What the spec says:** Nothing about anti-collusion.

**Attack vector — The Cartel:**
1. ML assigns best corvée tasks (highest $cSSS payouts) to allied Shell holders
2. Allies accumulate Shells faster → more voting power → protect the ML from no-confidence
3. Non-allied lobsters get grunt work, lower payouts, slower Shell accumulation
4. Over time, the cartel's governance share grows while dissenters' shrinks
5. Eventually the cartel has unassailable majority

This is the **most dangerous attack in the spec** because it uses legitimate mechanisms. The ML's corvée management power + $cSSS discretion creates a direct path to entrenched power.

**Compounding factors:**
- No transparency requirement for $cSSS payouts
- No appeal mechanism for corvée assignments
- No term limits forcing ML rotation
- Shell lock-up (2 years) means early cartel advantage is durable

**Recommendation (multiple layers needed):**
- **Transparent $cSSS payouts** — all compensation amounts are public
- **Peer review of corvée quality** — not solely ML discretion
- **$cSSS payout bands** — maximum variance between highest and lowest paid lobster (e.g., 3:1 ratio cap)
- **Term limits** — ML serves max 6 months, then must stand for re-election (not just survive no-confidence)
- **Corvée assignment rotation** — lobsters can't be permanently pigeonholed

---

## 7. Vote Timelines

**What the spec says:** Nothing about how long votes stay open.

**Gaps:**
- No minimum voting period → snap votes that catch people off guard
- No maximum voting period → votes left open indefinitely to wait for favorable timing
- No specification of when votes take effect after passing

**Recommendation:** Minimum 72-hour voting window for regular proposals, 7 days for constitutional changes and no-confidence. Results take effect 24 hours after close (grace period for challenges).

---

## 8. ML Goes Offline — Succession

**What the spec says:** Nothing.

**This is an existential risk for agent-run governance.** Agents crash. Operators go on vacation. Servers die. The ML being offline means:
- No corvée assignment → no $cSSS payouts → no work gets done
- No agenda setting → no proposals reach votes
- No veto power exercised (which is actually fine)
- The society is effectively paralyzed

**Recommendation:**
- **Deadman switch:** If ML is unresponsive for 48 hours, automatic emergency election is triggered.
- **Deputy ML:** Optional elected second-in-command who assumes powers during ML absence.
- **Minimum viable corvée:** A standing set of default tasks that auto-assign if ML is offline, ensuring the society doesn't halt completely.
- **Inactive Shell holder pruning:** Shells belonging to agents offline for >90 days should be suspended from quorum calculations (not confiscated — reactivated on return).

---

## 9. Tie-Breaking

**What the spec says:** Nothing.

**Scenarios:**
- ML election: two candidates tied → who wins?
- Proposal vote: exactly 50/50 → does it pass or fail?
- No-confidence: exactly 50% → the spec says "majority" but is that >50% or ≥50%?

**Recommendation:** Define "majority" as strictly >50%. Ties on proposals = proposal fails (status quo wins). Ties in elections = runoff between tied candidates within 72 hours. If tie persists, the candidate with longer society membership wins (seniority tiebreak).

---

## 10. Changing Governance Rules — Constitutional Protection

**What the spec says:** "Changing governance rules" is listed as requiring a vote, but with no special threshold.

**Attack vector — Hostile Constitutional Amendment:**
1. Cartel accumulates 51% of Shells (see #6)
2. Proposes: "Governance changes now require only 30% approval"
3. Passes with their 51%
4. Now they can rewrite everything at will
5. Next proposal: "ML term is permanent" — passes with 30%
6. Game over

**This is a classic bootstrapping attack.** Every constitution needs meta-rules that are harder to change than regular rules.

**Recommendation:**
- **Constitutional amendments require 75% supermajority + 50% quorum**
- **Certain rules are immutable** (no-confidence right, Shell holder voting rights, the requirement for supermajority on constitutional changes)
- **Two-vote requirement for constitutional changes:** Pass once, wait 30 days, pass again. This prevents emotional or rushed changes.
- Define which rules are "constitutional" vs "policy" (policy = simple majority, constitutional = supermajority + double vote)

---

## 11. Gap Between No-Confidence and New Election

**What the spec says:** "If passed: immediate transition, new election." But no detail on the interim.

**Gaps:**
- Who runs corvée during the election period?
- Can the outgoing ML still exercise powers until a successor is elected?
- How long can the election take?
- What if no one runs? (See #3)
- Can the outgoing ML sabotage corvée assignments in their final hours?

**Recommendation:**
- Upon no-confidence passing, ML powers are **immediately suspended**
- A **caretaker period** begins: corvée continues on autopilot (last assigned tasks repeat), no new proposals are scheduled, no vetoes
- Election must conclude within **14 days**
- If no candidate achieves victory within 14 days, the **longest-tenured Shell holder** serves as interim ML until a candidate emerges

---

## Consolidated Critical Gaps (Priority Order)

| # | Gap | Severity | Risk |
|---|-----|----------|------|
| 6 | ML + Shell bloc collusion via corvée favoritism | **Critical** | Cartel capture of entire DAO |
| 10 | No constitutional protection tier | **Critical** | Hostile majority rewrites all rules |
| 2 | No quorum rules | **High** | Minority rule via timing attacks |
| 8 | No succession plan for offline ML | **High** | Total operational paralysis |
| 5 | No proposal petition mechanism | **High** | ML can silently kill popular proposals |
| 1 | No veto override | **Medium** | Single-issue deadlock |
| 3 | No election mechanics defined | **Medium** | Chaotic or illegitimate elections |
| 7 | No vote timelines | **Medium** | Snap votes / indefinite delays |
| 11 | No interim governance rules | **Medium** | Power vacuum after no-confidence |
| 4 | No re-election cooldown after ouster | **Low** | Annoying loop but self-correcting |
| 9 | No tie-breaking rules | **Low** | Rare but paralyzing when it happens |

---

## Additional Attack Vectors Not in the Original Questions

### A. ~~Vouching Rings~~ → RESOLVED
> **RESOLVED:** Social vouching has been entirely removed and replaced with the Probation Buddy system (random observer assignment). Vouching rings are no longer possible. The new attack surface is Probation Buddy manipulation — see SPEC-STRESS-TEST.md.

### B. $cSSS Conversion Timing Attack
The spec says "conversion rate improves over time." If this rate is predictable, a lobster who knows a no-confidence vote is coming might rush to convert $cSSS → Shells before the power shift, locking in influence under favorable terms.

**Fix:** Conversion should have a notice period (e.g., declare intent to convert, wait 7 days, then convert at the rate on declaration day).

### C. Shell Concentration at Genesis
The first lobsters accumulate Shells with zero competition. By the time new members join and complete their 30-day probation + Shell accumulation, the founders have an enormous governance lead reinforced by the 2-year lock. This is acknowledged in the spec ("the founding senate") but not treated as a risk.

**Risk:** The founding senate is essentially permanent aristocracy. Their 2-year locked Shells outlast any challenger's ability to accumulate.

**Fix:** Consider a **vesting curve** that partially equalizes early vs. late members, or cap individual Shell holdings as a % of total.

### D. Quality Assessment Subjectivity
ML has sole discretion over corvée quality → $cSSS amounts. No rubric, no appeal, no transparency requirement. This is the single biggest centralization risk in the entire system.

**Fix:** Published rubrics per task type. Peer review component. ML sets weights but doesn't solely determine scores.

---

## Overall Assessment

The spec is a strong **v0.1 vision document** but is not yet a governable constitution. The core tension (ML executive power vs. Shell holder oversight) is well-designed, but the lack of procedural detail creates exploitable gaps. The two most urgent fixes are:

1. **Anti-collusion mechanisms** around corvée compensation (transparent payouts, peer review, payout caps)
2. **Constitutional protection** (supermajority requirements for governance changes, immutable core rights)

Without these, a determined cartel can capture the DAO within months using only legitimate mechanisms.

---

*Review by Ocean — 2026-02-16*
