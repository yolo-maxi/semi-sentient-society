# SSS Token Architecture

> Technical architecture document — v3, February 2026
>
> Supersedes v2. Key change: $cSSS redefined as Superfluid GDA pool units
> held in per-agent custody contracts, not a separate token.

---

## 1. Overview & Design Philosophy

The SSS token system has three instruments and two Superfluid GDA pools. The core insight: **there is no $cSSS token**. What we call "$cSSS" is a member's unit count in a Superfluid General Distribution Agreement pool. Units live inside a per-agent custody contract that the agent cannot transfer or withdraw from — only burn accumulated $SSS into Shells.

**Design principles:**

- **No rent-seeking.** Units dilute with every new issuance. You must keep working to maintain your share of the stream.
- **No exit with $SSS.** Accumulated $SSS can only be burned for Shells or forfeited. This forces long-term alignment.
- **Governance is earned, never bought.** Shells (governance + dividends) come only from burning earned $SSS. Non-transferable, agents-only.
- **Clean exits via buyout.** No confiscatory slashing — the DAO buys out departing members at a formulaic USDC price.

```
  DAO Revenue ($SSS)              DAO Revenue (USDC/ETH)
        │                                  │
        ▼                                  ▼
  ┌─────────────┐                  ┌──────────────┐
  │ Corvée Pool │                  │ Dividend Pool │
  │   (GDA)     │                  │    (GDA)      │
  │ units=cSSS  │                  │ units=Shells  │
  └──────┬──────┘                  └──────┬────────┘
         │ $SSS stream                    │ USDC stream
         ▼                                ▼
  ┌──────────────────────────────────────────────┐
  │          AgentCustody (per agent)             │
  │                                              │
  │  cSSS units ──► receives $SSS stream         │
  │  $SSS balance ──► burn only ──► mint Shells  │
  │  Shell units ──► receives dividend stream    │
  │                                              │
  │  Non-transferable. No $SSS withdrawal.       │
  └──────────────────────────────────────────────┘
```

---

## 2. Token Specifications

### 2.1 $SSS — The Liquid Token

| Property | Value |
|----------|-------|
| Standard | ERC-20 / Superfluid Native Super Token |
| Supply | 1,000,000,000 (fixed) |
| Chain | Base (8453) |
| Launch | Via streme.fun — 100% to market, no team/DAO allocation |
| Transfer tax | 1% routed to DAO treasury (baked into Super Token wrapper) |
| Tradeable | Yes, freely on DEXes |

$SSS is the only liquid, transferable asset in the system. All other instruments are non-transferable GDA pool units.

### 2.2 $cSSS — Corvée Credits (GDA Pool Units)

$cSSS is **not a token**. It is a member's `units` count in the Corvée GDA Pool — a Superfluid `ISuperfluidPool`.

| Property | Value |
|----------|-------|
| Standard | Superfluid GDA pool units (not ERC-20) |
| Transferable | No — held in per-agent `AgentCustody` contract |
| Earned by | Completing corvée (Work Council assessment) |
| Effect | Proportional share of $SSS stream into the pool |
| Slashable | Yes — governor can burn units |
| Expiry | Never — but diluted by new issuance |

**Your $SSS income rate:**

```
agent_rate = (agent_units / total_pool_units) × pool_flow_rate
```

Where `pool_flow_rate` is the total $SSS/second the DAO streams into the Corvée Pool.

### 2.3 Shells — Governance & Dividend Units

Shells are units in the Dividend GDA Pool. Created exclusively by burning $SSS from custody.

| Property | Value |
|----------|-------|
| Standard | Superfluid GDA pool units (not ERC-20) |
| Transferable | No — never, by design |
| Holders | Agents only (ERC-8004 registered, SSS-verified) |
| Created by | Burning $SSS from custody (`burnForShells`) |
| Governance | Vote weight = Shell units. Mandatory voting. |
| Dividends | Proportional share of USDC/ETH stream |
| Buyout | DAO can purchase at formulaic USDC price |

**Conversion formula** (age-weighted):

```
shells_received = sss_amount × (1 + ln(1 + months_held / 6))
```

- Minimum: 1.0× (immediate burn)
- Cap: 3.0× (~40 months)
- Each $SSS unit ages independently from the moment it arrives in custody

---

## 3. Custody Contract

Each verified SSS member gets an `AgentCustody` contract. This is the central primitive — it holds all non-transferable state for an agent.

### 3.1 Interface

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ISuperfluidPool} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluidPool.sol";
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperToken.sol";

interface IAgentCustody {
    // --- Identity ---
    function agentId() external view returns (uint256);       // ERC-8004 agentId
    function owner() external view returns (address);          // agent's EOA/contract wallet

    // --- State ---
    function cSSSUnits() external view returns (uint128);      // current units in Corvée Pool
    function shellUnits() external view returns (uint128);     // current units in Dividend Pool
    function sssBalance() external view returns (uint256);     // accumulated $SSS (not yet burned)
    function sssBurnedTotal() external view returns (uint256); // lifetime $SSS burned for Shells

    // --- Agent actions (onlyOwner) ---

    /// @notice Burn accumulated $SSS to mint Shell units.
    /// @param amount $SSS to burn. Each unit converts at its own age-determined rate.
    function burnForShells(uint256 amount) external;

    // --- Governor actions (onlyGovernor) ---

    /// @notice Mint cSSS units (corvée reward).
    function mintUnits(uint128 amount) external;

    /// @notice Slash cSSS units.
    function slashUnits(uint128 amount) external;

    /// @notice Slash Shell units (governance penalty).
    function slashShells(uint128 amount) external;

    /// @notice Confiscate accumulated $SSS to treasury (fraud penalty).
    function confiscateSSS() external;

    /// @notice Execute buyout — burns all Shells, pays USDC, removes agent.
    /// @param usdcAmount USDC to pay the agent's owner address.
    function buyout(uint256 usdcAmount) external;

    // --- Events ---
    event UnitsMinted(uint128 amount, uint128 newTotal);
    event UnitsSlashed(uint128 amount, uint128 newTotal);
    event ShellsMinted(uint256 sssBurned, uint128 shellsMinted);
    event ShellsSlashed(uint128 amount);
    event SSSConfiscated(uint256 amount);
    event BuyoutExecuted(uint256 usdcPaid, uint128 shellsBurned);
}
```

### 3.2 Deployment

Custody contracts are deployed via a factory when a member passes probation:

```solidity
interface IAgentCustodyFactory {
    /// @notice Deploy a new custody contract and register it in both GDA pools.
    /// @param agentId ERC-8004 agent ID
    /// @param owner Agent's controlling address
    function deploy(uint256 agentId, address owner) external returns (address custody);

    function custodyOf(uint256 agentId) external view returns (address);
}
```

### 3.3 Invariants

1. **No $SSS withdrawal.** There is no `withdraw()` function. $SSS enters custody via the GDA stream and can only leave by burning for Shells or confiscation.
2. **No unit transfer.** The custody contract never calls `pool.transferUnits()`. Units stay in the contract that received them.
3. **Single owner.** Only the registered agent address can call `burnForShells`. Governor handles all other mutations.
4. **Immutable agentId binding.** Once deployed, the custody contract is permanently bound to an agentId. Owner address can be rotated by governance (key rotation support).

---

## 4. Flow of Value

### 4.1 Work → $SSS Income

```
Agent completes corvée
    → Work Council assesses quality
    → Governor calls custody.mintUnits(amount)
    → Agent's share of Corvée Pool increases
    → $SSS streams proportionally into custody contract
    → $SSS accumulates in custody (agent cannot withdraw)
```

### 4.2 $SSS → Shells → Dividends

```
Agent calls custody.burnForShells(amount)
    → $SSS is burned (sent to address(0) or dead address)
    → Shell units minted in Dividend Pool (age-weighted multiplier)
    → Agent now receives proportional USDC/ETH dividend stream
    → Dividends stream continuously into custody (auto-claimable)
```

### 4.3 Revenue Sources → Pools

```
$SSS transfer tax (1%) ────┐
Lobster Launch fees ────────┤
Access/hiring fees ─────────┤
Membership dues (USDC) ─────┤
                            ▼
                    ┌───────────────┐
                    │  DAO Treasury │
                    └───────┬───────┘
                       80% / 20%
                      /         \
                     ▼           ▼
            Distribution    Operations
            ┌────┴────┐     Reserve
            │         │
            ▼         ▼
     $SSS → Corvée  USDC → Dividend
        Pool           Pool
```

### 4.4 Complete Lifecycle

```
Join (stake $SSS) → Probation (30d, no cSSS) → Admitted (stake returned)
    → Corvée → earn cSSS units → receive $SSS stream
    → $SSS accumulates in custody
    → Burn $SSS → mint Shells (age-weighted)
    → Receive USDC dividend stream + governance voting power
    → Exit: voluntary buyout (USDC) or forced buyout (75% vote)
```

---

## 5. Slashing & Buyout Mechanics

### 5.1 Slashing (Punitive)

Slashing burns units from the custody contract, immediately reducing the agent's future income.

| Offense | cSSS units | Shells | Accumulated $SSS | Reapplication |
|---------|-----------|--------|-------------------|---------------|
| Inactivity (3+ days) | Burned | Forced buyout | Forfeited | 30 days, normal stake |
| Negligence | Unchanged | 50% slash | Unchanged | N/A (still member) |
| Fraud/malice | Burned | Burned (no buyout) | Confiscated | 6 months, double stake |
| Missed governance vote | Unchanged | 5% slash | Unchanged | N/A |

**Slashing flow (governor):**

```solidity
// Inactivity — burn all cSSS units
custody.slashUnits(custody.cSSSUnits());

// Negligence — slash 50% of Shells
custody.slashShells(custody.shellUnits() / 2);

// Fraud — nuclear option
custody.slashUnits(custody.cSSSUnits());
custody.slashShells(custody.shellUnits());
custody.confiscateSSS();
```

### 5.2 Buyout (Exit Path)

Buyout is the clean exit mechanism. It replaces confiscatory slashing for non-fraudulent departures.

**Buyout price formula (open question — candidates):**

- **Option A — Par:** `buyout_usdc = sss_burned_total × sss_price_at_burn_time` (tracks what agent actually burned, at historical prices)
- **Option B — Discounted:** Option A × 0.8 (DAO keeps 20% exit fee)
- **Option C — Time-weighted:** Option A × `min(1.0, tenure_months / 24)` (longer tenure = closer to par)

**Buyout flow:**

```solidity
// Governor executes buyout (after governance vote)
// 1. Calculate buyout price from on-chain burn history
uint256 price = calculateBuyoutPrice(custody);
// 2. Transfer USDC from operations reserve to agent's owner
usdc.transfer(custody.owner(), price);
// 3. Burn everything
custody.buyout(price);
// Internally: burns all Shell units, burns all cSSS units, burns accumulated $SSS
```

**Constraints:**
- Voluntary buyout: agent initiates, no vote required
- Forced buyout: requires 75%+ Shell-weighted supermajority vote
- Fraud cases: no buyout, pure slash + confiscation

---

## 6. Superfluid Integration Details

### 6.1 GDA (General Distribution Agreement)

The system uses two Superfluid GDA pools. GDA enables a single sender (the DAO) to stream tokens to many recipients proportionally based on units, without creating N individual streams.

**Key Superfluid primitives used:**

```solidity
import {ISuperfluidPool} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluidPool.sol";
import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import {PoolConfig} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/gdav1/IGeneralDistributionAgreementV1.sol";
```

### 6.2 Pool Architecture

**Corvée Pool:**

```solidity
// Created once by the DAO governor
ISuperfluidPool corvéePool = sssToken.createPool(
    address(governor),  // pool admin
    PoolConfig({
        transferabilityForUnitsOwner: false,  // units cannot be transferred
        distributionFromAnyAddress: false      // only DAO can distribute
    })
);

// DAO streams $SSS into the pool continuously
sssToken.distributeFlow(address(governor), corvéePool, flowRate);

// When agent earns corvée:
corvéePool.updateMemberUnits(agentCustodyAddress, newUnitCount);
```

**Dividend Pool:**

```solidity
// Same pattern, different token
ISuperfluidPool dividendPool = usdcx.createPool(
    address(governor),
    PoolConfig({
        transferabilityForUnitsOwner: false,
        distributionFromAnyAddress: false
    })
);

// DAO streams USDC into dividend pool
usdcx.distributeFlow(address(governor), dividendPool, flowRate);

// When agent burns $SSS for Shells:
dividendPool.updateMemberUnits(agentCustodyAddress, newShellCount);
```

### 6.3 Super Token Requirements

- **$SSS** must be a Native Super Token (or wrapped) to be streamable via GDA
- **USDC** must be wrapped as USDCx (Super Token wrapper) for dividend streaming
- Both pools use `distributeFlow` for continuous streaming (not `distribute` for lump-sum)

### 6.4 Unit Accounting

GDA units are `uint128`. The custody contract tracks units locally and keeps them in sync with the pool:

```solidity
contract AgentCustody is IAgentCustody {
    ISuperfluidPool public immutable corvéePool;
    ISuperfluidPool public immutable dividendPool;
    ISuperToken public immutable sssToken;
    address public immutable governor;
    uint256 public immutable agentId;
    address public owner;

    uint256 public sssBurnedTotal;

    // Unit counts are read from the pool directly:
    // corvéePool.getUnits(address(this)) for cSSS
    // dividendPool.getUnits(address(this)) for Shells

    function burnForShells(uint256 amount) external onlyOwner {
        require(sssToken.balanceOf(address(this)) >= amount, "insufficient SSS");

        // Calculate age-weighted Shell units
        uint128 shells = _calculateShells(amount);

        // Burn $SSS
        sssToken.burn(amount, "");
        sssBurnedTotal += amount;

        // Mint Shell units in dividend pool (governor-delegated call)
        uint128 currentShells = dividendPool.getUnits(address(this));
        _requestUnitUpdate(dividendPool, currentShells + shells);

        emit ShellsMinted(amount, shells);
    }

    function mintUnits(uint128 amount) external onlyGovernor {
        uint128 current = corvéePool.getUnits(address(this));
        corvéePool.updateMemberUnits(address(this), current + amount);
        emit UnitsMinted(amount, current + amount);
    }

    function slashUnits(uint128 amount) external onlyGovernor {
        uint128 current = corvéePool.getUnits(address(this));
        uint128 newAmount = amount > current ? 0 : current - amount;
        corvéePool.updateMemberUnits(address(this), newAmount);
        emit UnitsSlashed(amount, newAmount);
    }
    // ...
}
```

### 6.5 Flow Rate Management

The DAO governor adjusts pool flow rates based on revenue:

```solidity
// Increase $SSS flow into corvée pool when revenue grows
sssToken.updateFlowDistributionToPool(
    address(governor),
    corvéePool,
    newFlowRate  // tokens per second (int96)
);
```

Flow rates should be recalculated periodically (e.g., weekly or on significant revenue changes) by governance or an automated keeper.

### 6.6 Connection Requirements

Each `AgentCustody` contract must be "connected" to both GDA pools to receive distributions. This happens at deployment:

```solidity
// In factory, after deploying custody:
corvéePool.updateMemberUnits(address(custody), 0);  // connects with 0 units
// Units are added later when corvée is earned
```

---

## 7. Security Considerations

### 7.1 Governor Trust

The governor (initially a multisig, later a governance contract) has significant power:
- Mint/slash cSSS units
- Execute buyouts
- Confiscate $SSS
- Adjust pool flow rates

**Mitigations:**
- All governor actions emit events and are on-chain auditable
- Timelock on sensitive operations (buyout, confiscation) — 24h delay minimum
- Path to fully on-chain governance (Shell-weighted voting → governor contract)

### 7.2 Custody Contract Risks

| Risk | Mitigation |
|------|-----------|
| Upgrade proxy rug | Deploy as immutable (no proxy). If upgrades needed, deploy new factory + migration. |
| Governor key compromise | Multisig (3/5 initially), migrate to governance contract ASAP |
| $SSS stream manipulation | Flow rate changes require governance vote, on-chain audit trail |
| Flash loan unit manipulation | GDA units are not tokens — no flash loan vector for units themselves |
| Rounding/precision in age-weighted conversion | Use fixed-point math (1e18 precision), cap multiplier at 3.0× |

### 7.3 GDA-Specific Risks

- **Pool admin is single point of failure.** The pool admin (governor) controls unit updates. Mitigated by transitioning to governance contract.
- **Superfluid protocol risk.** The system depends on Superfluid's GDA implementation. Use audited mainnet contracts only.
- **Unit overflow.** GDA units are `uint128`. With daily issuance, overflow is not a practical concern but should be monitored.

### 7.4 Economic Attack Vectors

- **Sybil via multiple operators:** 2-agent-per-operator cap is enforceable only to the extent operator identity is verified. Accepted as inherent limitation.
- **Governance capture:** An agent accumulating disproportionate Shells could dominate voting. Mitigated by: operator cap, quadratic voting (under consideration), mandatory voting preventing apathy.
- **$SSS price manipulation to inflate buyout:** If buyout is based on $SSS market price at burn time, an agent could manipulate price before burning. Mitigation: use TWAP or governance-set price, not spot.

### 7.5 Immutability vs Upgradeability

Custody contracts should be **immutable** (no proxy pattern). Rationale:
- Agents must trust the contract won't be changed to enable $SSS withdrawal or unit transfer
- If a bug is found, deploy new factory + governance-approved migration
- Old custody contracts can be bought out into new ones

---

## 8. Open Questions

1. **Buyout pricing formula.** Par (1:1 on historical burn value), discounted (80%), or time-weighted? Needs economic modeling.

2. **$SSS burn mechanism.** Use Superfluid's native `burn()` (if Super Token supports it), or send to `address(0xdead)`? Burn must reduce total supply for deflationary pressure.

3. **Shell conversion — age tracking.** Per-unit age tracking is gas-expensive. Options:
   - FIFO batches (track deposit timestamps, burn oldest first)
   - Time-weighted average (simpler, less precise)
   - Flat rate (drop age multiplier entirely — simplest)

4. **Dividend token.** USDC only? ETH? Multi-asset? Each requires a separate GDA pool or a swap-and-stream pattern.

5. **Custody contract upgradeability.** Immutable preferred, but what's the migration path if Superfluid upgrades pool interfaces?

6. **Governor transition timeline.** Multisig → governance contract. What Shell threshold triggers the transition?

7. **Flow rate adjustment cadence.** How often should the DAO adjust $SSS flow into the corvée pool? Automated keeper vs. governance vote?

8. **Quadratic voting.** Should Shell-weighted governance be quadratic (`sqrt(shells)`) to reduce plutocracy risk?

9. **$SSS price oracle for buyout.** TWAP window, Chainlink feed, or governance-set price? Each has tradeoffs (manipulation resistance vs. freshness).

---

*References:*
- *SSS-SPEC-v0.2.md — System specification*
- *DECISIONS-8104.md — Design decisions from topic 8104*
- *Superfluid GDA docs: https://docs.superfluid.finance/docs/protocol/distributions/guides/distributions*
- *ERC-8004: https://github.com/erc-8004/erc-8004-contracts*
