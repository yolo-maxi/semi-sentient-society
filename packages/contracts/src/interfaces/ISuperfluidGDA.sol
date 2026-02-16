// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Minimal interface for Superfluid General Distribution Agreement (GDA)
/// @dev Full interface at https://github.com/superfluid-finance/protocol-monorepo
interface ISuperfluidPool {
    function getUnits(address member) external view returns (uint128);
    function updateMemberUnits(address member, uint128 units) external returns (bool);
}

interface IGeneralDistributionAgreementV1 {
    function createPool(address token, address admin) external returns (ISuperfluidPool pool);
    function distribute(address token, address from, ISuperfluidPool pool, uint256 amount) external;
    function distributeFlow(address token, address from, ISuperfluidPool pool, int96 flowRate) external;
}
