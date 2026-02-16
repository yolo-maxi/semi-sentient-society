// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ISuperfluid.sol";

/// @title SSSStreamModulator — Revenue distribution via Superfluid GDA
/// @notice Pulls fee revenue from streme.fun + other sources.
///         Creates/updates a GDA pool stream to drain balance over 7 days.
///         Shell holders get proportional units.
contract SSSStreamModulator is Ownable {
    ISuperToken public immutable sss;
    IGeneralDistributionAgreementV1 public immutable gda;
    ISuperfluidPool public pool;

    uint256 public constant DRAIN_PERIOD = 7 days;
    uint256 public lastRecalculation;

    event RevenueDeposited(address indexed from, uint256 amount);
    event StreamRecalculated(int96 newFlowRate, uint256 balance);

    constructor(
        address _sss,
        address _gda
    ) Ownable(msg.sender) {
        sss = ISuperToken(_sss);
        gda = IGeneralDistributionAgreementV1(_gda);
    }

    /// @notice Initialize the GDA pool (call once after deploy)
    function initPool() external onlyOwner {
        require(address(pool) == address(0), "Already initialized");
        pool = gda.createPool(
            sss,
            address(this),
            PoolConfig({
                transferabilityForUnitsOwner: false,
                distributionFromAnyAddress: true
            })
        );
    }

    /// @notice Update a Shell holder's units in the GDA pool
    /// @dev Called by SSSShells contract when shells are minted
    function updateMemberUnits(address member, uint128 units) external onlyOwner {
        require(address(pool) != address(0), "Pool not initialized");
        pool.updateMemberUnits(member, units);
    }

    /// @notice Deposit revenue and recalculate stream rate
    function depositRevenue(uint256 amount) external {
        sss.transferFrom(msg.sender, address(this), amount);
        emit RevenueDeposited(msg.sender, amount);
        _recalculateStream();
    }

    /// @notice Recalculate the GDA flow rate to drain balance over 7 days
    function recalculateStream() external {
        _recalculateStream();
    }

    function _recalculateStream() internal {
        uint256 balance = sss.balanceOf(address(this));
        if (balance == 0 || pool.getTotalUnits() == 0) return;

        // Flow rate = balance / DRAIN_PERIOD (in tokens per second)
        int96 flowRate = int96(int256(balance / DRAIN_PERIOD));
        if (flowRate <= 0) return;

        sss.approve(address(gda), balance);
        gda.distributeFlow(sss, address(this), pool, flowRate, "");

        lastRecalculation = block.timestamp;
        emit StreamRecalculated(flowRate, balance);
    }
}
