// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ISuperfluid.sol";

/// @title SSSStreamModulator — Revenue distribution via Superfluid GDA
/// @notice Holds $SSS revenue. Anyone calls modulate() to recalculate
///         the GDA flow rate to drain balance over 7 days.
contract SSSStreamModulator is Ownable {
    ISuperToken public immutable sssToken;
    ISuperfluidPool public immutable dividendPool;

    uint256 public constant DRAIN_PERIOD = 7 days;
    uint256 public lastModulation;

    event StreamModulated(int96 flowRate, uint256 balance);

    constructor(
        ISuperToken _sssToken,
        ISuperfluidPool _dividendPool,
        address _owner
    ) Ownable(_owner) {
        sssToken = _sssToken;
        dividendPool = _dividendPool;
    }

    /// @notice Recalculate GDA flow rate to drain balance over 7 days
    /// @dev Anyone can call. Flow rate = balance / DRAIN_PERIOD (per second)
    function modulate() external {
        uint256 balance = sssToken.balanceOf(address(this));
        require(balance > 0, "No balance");
        require(dividendPool.getTotalUnits() > 0, "No pool members");

        int96 flowRate = int96(int256(balance / DRAIN_PERIOD));
        require(flowRate > 0, "Flow rate too small");

        sssToken.distributeFlow(address(this), dividendPool, flowRate);

        lastModulation = block.timestamp;
        emit StreamModulated(flowRate, balance);
    }
}
