// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ISuperfluid.sol";

/// @title SSSCorvee ($sSSS) — Corvée credits backed by locked $SSS
/// @notice NOT a separate token supply — backed 1:1 by locked $SSS from treasury.
///         When ML pays corvée: treasury locks X $SSS → mints X $sSSS to worker.
///         Non-transferable. Constrains DAO spending to actual treasury balance.
///         Convertible to Shells (with time bonus).
contract SSSCorvee is ERC20, Ownable {
    ISuperToken public immutable sss;

    /// @notice Total $SSS locked as backing for outstanding $sSSS
    uint256 public totalLocked;

    /// @notice Track when corvée was earned (for time bonus calculation)
    struct CorveeRecord {
        uint256 amount;
        uint256 earnedAt;
    }
    mapping(address => CorveeRecord[]) public corveeHistory;

    event CorveePaid(address indexed worker, uint256 amount, uint256 sssLocked);
    event CorveeBurned(address indexed worker, uint256 amount);

    constructor(address _sss) ERC20("SSS Corvee", "sSSS") Ownable(msg.sender) {
        sss = ISuperToken(_sss);
    }

    /// @notice ML pays corvée: locks $SSS from treasury, mints $sSSS to worker
    /// @dev Caller (treasury/multisig) must approve this contract for `amount` of $SSS
    function payCorvee(address worker, uint256 amount) external onlyOwner {
        require(amount > 0, "Zero amount");

        // Lock $SSS from treasury into this contract
        sss.transferFrom(msg.sender, address(this), amount);
        totalLocked += amount;

        // Mint equivalent $sSSS to worker
        _mint(worker, amount);

        // Record for time bonus
        corveeHistory[worker].push(CorveeRecord({
            amount: amount,
            earnedAt: block.timestamp
        }));

        emit CorveePaid(worker, amount, totalLocked);
    }

    /// @notice Burn $sSSS (called by Shells contract during conversion)
    /// @dev Does NOT release the locked $SSS — that stays locked backing Shells
    function burn(address from, uint256 amount) external {
        _burn(from, amount);
        emit CorveeBurned(from, amount);
    }

    /// @notice Get corvée history length for time bonus calculation
    function getCorveeHistoryLength(address worker) external view returns (uint256) {
        return corveeHistory[worker].length;
    }

    /// @dev Non-transferable — only mint and burn allowed
    function _update(address from, address to, uint256 value) internal override {
        require(from == address(0) || to == address(0), "Non-transferable");
        super._update(from, to, value);
    }
}
