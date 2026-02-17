// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ISuperfluid.sol";

interface ISSSShells {
    function mintFromCorvee(address to, uint256 amount) external;
}

/// @title SSSCorvee ($sSSS) — Corvée credits backed by locked $SSS
/// @notice Non-transferable. Backed 1:1 by locked $SSS from treasury.
///         Convertible to Shells with logarithmic time bonus.
contract SSSCorvee is ERC20, Ownable {
    ISuperToken public immutable sssToken;
    ISSSShells public shellsContract;

    /// @notice Total $SSS locked backing outstanding $sSSS
    uint256 public totalLocked;

    /// @notice Corvée earning records for time bonus calculation
    struct CorveeBatch {
        uint256 amount;
        uint256 mintedAt;
    }
    mapping(address => CorveeBatch[]) public corveeBatches;

    event CorveePaid(address indexed worker, uint256 amount);
    event ConvertedToShells(address indexed worker, uint256 corveeAmount, uint256 shellAmount);

    constructor(ISuperToken _sssToken, address _shellsContract, address _owner)
        ERC20("SSS Corvee", "sSSS")
        Ownable(_owner)
    {
        sssToken = _sssToken;
        shellsContract = ISSSShells(_shellsContract);
    }

    /// @notice Set shells contract (for circular dependency resolution)
    function setShellsContract(address _shellsContract) external onlyOwner {
        shellsContract = ISSSShells(_shellsContract);
    }

    /// @notice Owner pays corvée — locks $SSS from contract's treasury balance, mints $sSSS
    /// @dev Contract must hold sufficient $SSS (treasury). No transferFrom from caller.
    function payCorvee(address worker, uint256 amount) external onlyOwner {
        require(amount > 0, "Zero amount");
        uint256 available = sssToken.balanceOf(address(this)) - totalLocked;
        require(available >= amount, "Insufficient treasury");

        totalLocked += amount;
        _mint(worker, amount);

        corveeBatches[worker].push(CorveeBatch({
            amount: amount,
            mintedAt: block.timestamp
        }));

        emit CorveePaid(worker, amount);
    }

    /// @notice Convert $sSSS to Shells with time bonus
    /// @dev Burns $sSSS, releases locked $SSS back to treasury, mints Shells
    ///      Time bonus: 1 + ln(1 + months_held/6), capped at 3x
    function convertToShells(uint256 amount) external {
        require(amount > 0, "Zero amount");
        require(balanceOf(msg.sender) >= amount, "Insufficient sSSS");

        uint256 shellAmount = _calculateWithTimeBonus(msg.sender, amount);

        // Burn $sSSS
        _burn(msg.sender, amount);

        // Release locked $SSS back to treasury (stays in contract)
        totalLocked -= amount;

        // Mint Shells
        shellsContract.mintFromCorvee(msg.sender, shellAmount);

        emit ConvertedToShells(msg.sender, amount, shellAmount);
    }

    /// @notice Calculate amount with time bonus using weighted average of batches
    /// @dev Formula: amount * (1 + ln(1 + months_held/6)), cap 3x
    ///      Uses FIFO consumption of batches for time calc
    function _calculateWithTimeBonus(address worker, uint256 amount) internal view returns (uint256) {
        CorveeBatch[] storage batches = corveeBatches[worker];
        uint256 remaining = amount;
        uint256 weightedTotal = 0;

        for (uint256 i = 0; i < batches.length && remaining > 0; i++) {
            if (batches[i].amount == 0) continue;

            uint256 consume = remaining < batches[i].amount ? remaining : batches[i].amount;
            uint256 monthsHeld = (block.timestamp - batches[i].mintedAt) / 30 days;

            // multiplier = 1 + ln(1 + monthsHeld/6), cap at 3x
            // Using fixed-point: multiply by 1e18
            uint256 multiplier = 1e18 + _lnApprox(1e18 + (monthsHeld * 1e18) / 6);
            if (multiplier > 3e18) multiplier = 3e18;

            weightedTotal += (consume * multiplier) / 1e18;
            remaining -= consume;
        }

        // Any remaining (shouldn't happen if balanceOf >= amount) gets 1x
        weightedTotal += remaining;

        return weightedTotal;
    }

    /// @notice Approximate ln(x) where x is in 1e18 fixed point, returns 1e18 fixed point
    /// @dev Uses ln(x) ≈ series expansion. Good enough for x in [1, ~8]
    ///      ln(x) = 2 * sum_{k=0}^{n} (1/(2k+1)) * ((x-1)/(x+1))^(2k+1)
    function _lnApprox(uint256 x) internal pure returns (uint256) {
        if (x <= 1e18) return 0;

        // z = (x - 1e18) / (x + 1e18) in 1e18
        uint256 num = x - 1e18;
        uint256 den = x + 1e18;
        uint256 z = (num * 1e18) / den;
        uint256 z2 = (z * z) / 1e18;

        // ln(x) ≈ 2 * (z + z^3/3 + z^5/5 + z^7/7)
        uint256 term = z;
        uint256 sum = term;

        term = (term * z2) / 1e18;
        sum += term / 3;

        term = (term * z2) / 1e18;
        sum += term / 5;

        term = (term * z2) / 1e18;
        sum += term / 7;

        term = (term * z2) / 1e18;
        sum += term / 9;

        return (sum * 2);
    }

    /// @notice Get batch count for a worker
    function getBatchCount(address worker) external view returns (uint256) {
        return corveeBatches[worker].length;
    }

    /// @dev Non-transferable
    function _update(address from, address to, uint256 value) internal override {
        require(from == address(0) || to == address(0), "Non-transferable");
        super._update(from, to, value);
    }
}
