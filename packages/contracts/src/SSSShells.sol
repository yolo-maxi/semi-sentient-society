// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SSSCorvee.sol";
import "./SSSStreamModulator.sol";

/// @title SSSShells — Non-transferable governance token with streaming dividends
/// @notice Created by burning $sSSS. 2-year lock. Confer GDA units for
///         streaming dividends via SSSStreamModulator.
contract SSSShells is ERC20, Ownable {
    SSSCorvee public immutable corvee;
    SSSStreamModulator public streamModulator;

    uint256 public constant LOCK_PERIOD = 730 days; // ~2 years

    struct Lock {
        uint256 amount;
        uint256 lockedAt;
    }

    mapping(address => Lock) public locks;

    event ShellsMinted(address indexed user, uint256 corveesBurned, uint256 shellsMinted);

    constructor(address _corvee) ERC20("SSS Shells", "SHELL") Ownable(msg.sender) {
        corvee = SSSCorvee(_corvee);
    }

    function setStreamModulator(address _modulator) external onlyOwner {
        streamModulator = SSSStreamModulator(_modulator);
    }

    /// @notice Convert $sSSS to Shells
    /// @dev Time bonus: logarithmic curve based on corvée earning history (TODO: finalize formula)
    function convertFromCorvee(uint256 corveeAmount) external {
        require(corveeAmount > 0, "Zero amount");

        // Burn the $sSSS (locked $SSS stays locked — now backing Shells)
        corvee.burn(msg.sender, corveeAmount);

        // TODO: time bonus multiplier — logarithmic curve based on
        // how long the corvée credits were held before conversion.
        // For now, 1:1 conversion.
        uint256 shellAmount = corveeAmount;

        _mint(msg.sender, shellAmount);
        locks[msg.sender] = Lock({
            amount: locks[msg.sender].amount + shellAmount,
            lockedAt: block.timestamp
        });

        // Update GDA pool units for streaming dividends
        if (address(streamModulator) != address(0)) {
            streamModulator.updateMemberUnits(
                msg.sender,
                uint128(balanceOf(msg.sender))
            );
        }

        emit ShellsMinted(msg.sender, corveeAmount, shellAmount);
    }

    /// @dev Non-transferable
    function _update(address from, address to, uint256 value) internal override {
        require(from == address(0) || to == address(0), "Non-transferable");
        super._update(from, to, value);
    }
}
