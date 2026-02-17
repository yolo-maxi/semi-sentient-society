// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../../src/interfaces/ISuperfluid.sol";

/// @notice Mock Super Token for testing
contract MockSuperToken is ERC20, ISuperToken {
    int96 public lastFlowRate;
    ISuperfluidPool public lastFlowPool;

    constructor() ERC20("Mock SSS", "SSS") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function selfMint(address account, uint256 amount, bytes memory) external override {
        _mint(account, amount);
    }

    function selfBurn(address account, uint256 amount, bytes memory) external override {
        _burn(account, amount);
    }

    function getHost() external pure override returns (address) {
        return address(0);
    }

    function distributeFlow(
        address,
        ISuperfluidPool pool,
        int96 requestedFlowRate
    ) external override returns (bool) {
        lastFlowRate = requestedFlowRate;
        lastFlowPool = pool;
        return true;
    }
}

/// @notice Mock streme.fun staking pool
contract MockStremeStaking is IStremeStaking {
    mapping(address => uint256) public override stakedBalance;

    function stake(uint256 amount) external override {
        stakedBalance[msg.sender] += amount;
    }

    function unstake(uint256 amount) external override {
        stakedBalance[msg.sender] -= amount;
    }

    function claimRewards() external pure override returns (uint256) {
        return 0;
    }
}

/// @notice Mock GDA Pool
contract MockSuperfluidPool is ISuperfluidPool {
    mapping(address => uint128) public units;
    uint128 public totalUnits_;

    function getUnits(address member) external view override returns (uint128) {
        return units[member];
    }

    function updateMemberUnits(address member, uint128 newUnits) external override returns (bool) {
        totalUnits_ = totalUnits_ - units[member] + newUnits;
        units[member] = newUnits;
        return true;
    }

    function getTotalUnits() external view override returns (uint128) {
        return totalUnits_;
    }
}
