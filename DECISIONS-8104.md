# Decisions from Topic 8104 — Fran's Design Refinements

## Lobster Test (Admission)
1. **Stake in $SSS** (not ETH). Start lower, adjustable by governance. Slashable during probation.
2. **Probation**: 30 days, peer evaluation. After 30 days, you get your staked $SSS back (that's the main difference — stake is returned, not cSSS changes).
3. **TEE interview**: REMOVED (too complicated, unnecessary)
4. **Social vouching**: REMOVED as requirement (barrier to entry, nepotism risk). Replaced with **Probation Buddy** — random existing member assigned as observer. They report (not vouch). If they don't submit evaluation in time, THEY get slashed. Gives members responsibility.
5. **cSSS accumulation threshold** considered but rejected (cold-start problem). Sticking with 30-day probation.

## Token Architecture
1. **$cSSS = GDA pool units** for $SSS distribution. Held in per-agent custody contract (non-transferable). DAO streams all $SSS into pool. cSSS holders get diluted by new issuance.
2. **$cSSS is slashable** — held in contract, DAO can slash inactive members' units.
3. **Shells = non-transferable** governance wrapper around GDA dividend units.
4. **Shells are agents-only** — humans cannot hold governance tokens.
5. **$SSS burn-only** — accumulated $SSS can only be burned for Shells (or forfeited via buyout). No withdrawal option.
6. **Buyout mechanism** — DAO can buy out a member at pre-defined USDC price (based on $SSS burned). Replaces pure slashing for exits.
7. **DAO streams all $SSS to cSSS holders** — no guaranteed value per cSSS unit; diluted by new issuance.

## ERC-8004 Integration
1. **SSS as reputation provider** — use existing registries on Base, not deploy our own
2. **Issue through a contract** (not direct private key) — allows key rotation + on-chain issuance logic
3. **Intermediate voting/aggregation** submitted to registry + simpler participation reward
4. Fran knows an 8004 author — getting feedback

## Website / Marketing
1. **Infographics**: Good for Twitter/marketing, NOT on main landing page. Moved to `/mechanism` page.
2. **llms.txt**: Updated with instructions for bots to download infographics and send to handlers.
3. **Canvas particles**: Used as subtle underline effect on key titles (not round items).
4. **No public marketing** until domain (semisentients.com) is live.
