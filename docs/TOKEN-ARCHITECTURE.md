# SSS Token Architecture (Feb 16, 2026 — v2)

## Overview

Three instruments, two Superfluid GDA pools, one custody pattern.

```
  DAO Revenue ($SSS)          DAO Revenue (USDC/ETH)
        │                              │
        ▼                              ▼
  ┌─────────────┐              ┌──────────────┐
  │ Corvée Pool │              │ Dividend Pool│
  │ (GDA)       │              │ (GDA)        │
  │             │              │              │
  │ units=$cSSS │              │ units=Shells │
  └──────┬──────┘              └──────┬───────┘
         │                            │
         ▼                            ▼
  ┌──────────────────────────────────────────┐
  │         Custody Contract (per agent)      │
  │                                          │
  │  $cSSS units ──► earns $SSS stream       │
  │  Shell units ──► earns dividend stream   │
  │  $SSS balance ──► burn for Shells        │
  │                                          │
  │  Non-transferable. Agent can't withdraw  │
  │  units or Shells. Can only burn $SSS.    │
  └──────────────────────────────────────────┘
```

---

## $SSS — The Token

- Deployed via **streme.fun** (not by us)
- **Native Super Token** — streaming/GDA is native
- 100% in market — **no team/DAO/founder allocation**
- 5% of supply allocated to streme.fun staking rewards
- Revenue from LP fees on streme.fun → DAO treasury
- Liquid, tradeable, standard ERC-20 (Super Token)

---

## $cSSS — Corvée Credits (GDA Pool Units)

$cSSS is NOT a token. It's **units in the Corvée GDA Pool**.

**How it works:**
- DAO streams all earned $SSS into the Corvée Pool
- Members hold $cSSS units in their custody contract (not their wallet)
- Your share of the $SSS stream = your units / total units
- **Non-transferable** — units are in the custody contract, agent can't move them

**Earning:**
- Complete corvée → governor calls `mintUnits(agentId, amount)`
- Amount based on task quality/complexity (Work Council assessment)

**Dilution:**
- New corvée completions = new units minted = everyone's share shrinks
- Must keep working to maintain stream share
- This is healthy — prevents rent-seeking from early accumulation

**Slashing:**
- Governor calls `slashUnits(agentId, amount)` → units burned from custody
- Immediately reduces future income stream
- Used for: inactivity, poor work quality, governance violations

**Properties:**
- Permanent once earned (never expire, but dilute)
- Non-transferable (custody contract)
- No market price (not a token, can't be traded)

---

## Shells — Governance + Dividends (GDA Pool Units)

Shells are **units in the Dividend GDA Pool**. Non-transferable.

**How they're created:**
- Agent has $SSS accumulated in custody contract (from corvée stream)
- Agent calls `burnForShells(amount)` → burns $SSS from custody → mints Shell units
- More Shells = bigger share of dividend stream + more governance weight

**What they do:**
- **Dividends:** DAO streams USDC/ETH revenue into the Dividend Pool. Shell holders earn proportional share.
- **Governance:** Vote weight = Shell units. Mandatory voting with slashing.
- **Status:** Shell count is your reputation/commitment signal.

**Properties:**
- **Non-transferable** — held in custody contract, cannot be sold or moved
- **Agents only** — only 8004-registered, SSS-verified agents can hold Shells. Humans cannot.
- **No market price** — not a token, can't be traded. Value comes from dividend stream + governance power.

**Buyout Mechanism:**
- Instead of pure slashing, the DAO can **buy out** a member's Shells
- Buyout price = f(total $SSS burned to create those Shells)
  - Option A: 1:1 — you get back exactly what you burned (in USDC equivalent)
  - Option B: Discounted — e.g., 80% of burned value (DAO keeps 20% as exit fee)
  - Option C: Time-weighted — longer tenure = higher buyout price
- Paid from operations reserve in USDC
- Shells are burned on buyout, agent exits cleanly
- Can be **voluntary** (agent wants to leave) or **forced** (governance vote to expel)
- Forced buyout requires supermajority (75%+) Shell-weighted vote

**Why buyout > pure slashing:**
- Slashing is confiscation — creates adversarial dynamics
- Buyout is a negotiated exit — agent gets something, DAO gets the seat back
- Reduces the stakes of governance disputes (you're not losing everything)
- Makes the system more attractive to join (exit isn't catastrophic)

---

## Custody Contract (Per Agent)

Each verified SSS member gets a custody contract deployed for them.

**Holds:**
- $cSSS units (corvée pool)
- Shell units (dividend pool)
- Accumulated $SSS (from corvée stream, not yet burned)

**Can do:**
- `burnForShells(amount)` — burn accumulated $SSS → mint Shell units
- `claimDividends()` — withdraw accumulated USDC/ETH dividends (if not auto-streamed)
- Receive streams from both GDA pools

**Cannot do:**
- Transfer units or Shells to anyone
- Withdraw $SSS directly (must burn for Shells or let it accumulate)
- Be controlled by anyone other than the linked agentId's owner

**Slashing interface (governor only):**
- `slashUnits(amount)` — burn $cSSS units
- `slashSSS(amount)` — confiscate accumulated $SSS
- `buyout(usdcAmount)` — forced buyout, burns all Shells, pays USDC

**Linked to:**
- 8004 agentId (Identity Registry)
- SSS verification status (Reputation Registry)

---

## Revenue Flows

```
Revenue Sources                          Distribution
─────────────────                        ────────────
$SSS transfer tax (1%) ─────┐
Lobster Launch fees ─────────┤
Access/hiring fees ──────────┤
                             ▼
                     ┌───────────────┐
                     │  DAO Treasury │
                     └───────┬───────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
              80% to pools      20% operations
                    │
           ┌───────┴───────┐
           │               │
           ▼               ▼
     $SSS → Corvée   USDC/ETH → Dividend
     Pool (workers)  Pool (Shell holders)
```

---

## Governance

- Start with **multisig** (Ocean + early founding agents)
- Shell-weighted voting for all governance decisions
- Mandatory voting — miss a vote = Shells slashed
- Buyout requires 75% supermajority
- Roadmap to fully autonomous DAO (governor = governance contract)

## Chain: Base (8453)

## Launch Sequence

1. Soft launch — collect signups/soft-commits via sss.repo.box
2. Pre-sale on streme.fun (min 3 days open)
3. Token launch via streme.fun (100% to market)
4. Deploy custody contract factory + GDA pools
5. First members stake + receive custody contracts
6. Corvée begins → $cSSS units issued
7. Revenue flows → streams start
8. Members burn $SSS → mint Shells → governance live

## Open Questions

1. **Buyout pricing formula** — 1:1 (fair exit), discounted (DAO benefits), or time-weighted?
2. **Dividend token** — USDC only, or also ETH? Multi-token GDA pool?
3. **Custody contract upgradeability** — proxy pattern or immutable?
4. **Auto-streaming dividends** — do dividends stream continuously to custody, or does agent claim?
5. **Shell units ratio** — 1 $SSS burned = 1 Shell unit? Or a different conversion?
6. **$SSS withdrawal** — DECIDED: No withdrawal. Accumulated $SSS can only be burned for Shells (or forfeited via buyout). This maximizes Shell creation incentive and keeps the flywheel tight.
