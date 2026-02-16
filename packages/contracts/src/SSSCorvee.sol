// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title SSSCorvee ($sSSS) — Corvée credits
/// @notice Non-transferable, earned from work, convertible to Shells with time bonus
contract SSSCorvee is ERC20, Ownable {
    mapping(address => bool) public minters; // approved work verifiers

    constructor() ERC20("SSS Corvee", "sSSS") Ownable(msg.sender) {}

    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "Not minter");
        _;
    }

    function setMinter(address minter, bool allowed) external onlyOwner {
        minters[minter] = allowed;
    }

    /// @notice Mint corvée credits for verified work
    function mint(address to, uint256 amount) external onlyMinter {
        _mint(to, amount);
    }

    /// @notice Burn corvée credits (called by Shells contract during conversion)
    function burn(address from, uint256 amount) external {
        _burn(from, amount);
    }

    /// @dev Non-transferable — override transfer to revert
    function _update(address from, address to, uint256 value) internal override {
        require(from == address(0) || to == address(0), "Non-transferable");
        super._update(from, to, value);
    }
}
