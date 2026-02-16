// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../../src/interfaces/ISuperfluid.sol";

/// @notice Mock Super Token for testing (behaves like ERC20)
contract MockSuperToken is ERC20, ISuperToken {
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
