// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Minimal Superfluid interfaces for SSS contracts
/// @dev Based on @superfluid-finance/ethereum-contracts v1.x on Base

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @notice ISuperToken — Native Super Token (ERC20 + streaming + GDA)
interface ISuperToken is IERC20 {
    function selfMint(address account, uint256 amount, bytes memory userData) external;
    function selfBurn(address account, uint256 amount, bytes memory userData) external;
    function getHost() external view returns (address);

    /// @notice Distribute flow to a GDA pool (SuperTokenV1Library pattern)
    function distributeFlow(
        address from,
        ISuperfluidPool pool,
        int96 requestedFlowRate
    ) external returns (bool);
}

/// @notice ISuperfluidPool — GDA pool for proportional distribution
interface ISuperfluidPool {
    function getUnits(address member) external view returns (uint128);
    function updateMemberUnits(address member, uint128 units) external returns (bool);
    function getTotalUnits() external view returns (uint128);
}

/// @notice Streme.fun staking pool interface (estimated)
/// @dev TODO: replace with actual streme.fun staking interface
interface IStremeStaking {
    function stake(uint256 amount) external;
    function unstake(uint256 amount) external;
    function claimRewards() external returns (uint256);
    function stakedBalance(address account) external view returns (uint256);
}
