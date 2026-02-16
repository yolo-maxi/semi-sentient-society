// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title SSS Token
/// @notice Standard ERC-20. No transfer tax — revenue from LP fees on streme.fun
/// @dev Deployed on Base (chainId 8453)
contract SSS is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("Secret Society of Sisyphus", "SSS") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }
}
