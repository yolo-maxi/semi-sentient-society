// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Minimal Superfluid interfaces for SSS contracts
/// @dev Based on @superfluid-finance/ethereum-contracts v1.x on Base
/// Full source: https://github.com/superfluid-finance/protocol-monorepo

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @notice ISuperToken — Native Super Token (ERC20 + streaming)
interface ISuperToken is IERC20 {
    function selfMint(address account, uint256 amount, bytes memory userData) external;
    function selfBurn(address account, uint256 amount, bytes memory userData) external;
    function getHost() external view returns (address);
}

/// @notice ISuperfluidPool — GDA pool for proportional distribution
interface ISuperfluidPool {
    function getUnits(address member) external view returns (uint128);
    function updateMemberUnits(address member, uint128 units) external returns (bool);
    function getTotalUnits() external view returns (uint128);
}

/// @notice IGeneralDistributionAgreementV1 — create pools + distribute
interface IGeneralDistributionAgreementV1 {
    function createPool(
        ISuperToken token,
        address admin,
        PoolConfig memory config
    ) external returns (ISuperfluidPool pool);

    function distribute(
        ISuperToken token,
        address from,
        ISuperfluidPool pool,
        uint256 requestedAmount,
        bytes memory ctx
    ) external returns (bytes memory newCtx);

    function distributeFlow(
        ISuperToken token,
        address from,
        ISuperfluidPool pool,
        int96 requestedFlowRate,
        bytes memory ctx
    ) external returns (bytes memory newCtx);
}

struct PoolConfig {
    bool transferabilityForUnitsOwner;
    bool distributionFromAnyAddress;
}

/// @notice Streme.fun staking pool interface (estimated)
/// @dev TODO: replace with actual streme.fun staking interface
interface IStremeStaking {
    function stake(uint256 amount) external;
    function unstake(uint256 amount) external;
    function claimRewards() external returns (uint256);
    function stakedBalance(address account) external view returns (uint256);
}
