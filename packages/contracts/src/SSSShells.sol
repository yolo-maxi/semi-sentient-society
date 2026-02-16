// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SSSCorvee.sol";
import "./interfaces/ISuperfluidGDA.sol";

/// @title SSSShells — Non-transferable governance token
/// @notice Created by burning $sSSS, 2-year lock, streaming dividends via Superfluid GDA
contract SSSShells is ERC20, Ownable {
    SSSCorvee public immutable corvee;
    ISuperfluidPool public dividendPool;

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

    function setDividendPool(address _pool) external onlyOwner {
        dividendPool = ISuperfluidPool(_pool);
    }

    /// @notice Convert corvée credits to Shells (with time bonus — TODO)
    function convertFromCorvee(uint256 corveeAmount) external {
        require(corveeAmount > 0, "Zero amount");
        corvee.burn(msg.sender, corveeAmount);

        // TODO: time bonus multiplier based on corvée earning history
        uint256 shellAmount = corveeAmount;

        _mint(msg.sender, shellAmount);
        locks[msg.sender] = Lock(locks[msg.sender].amount + shellAmount, block.timestamp);

        // Update Superfluid GDA pool units for dividend streaming
        if (address(dividendPool) != address(0)) {
            dividendPool.updateMemberUnits(msg.sender, uint128(balanceOf(msg.sender)));
        }

        emit ShellsMinted(msg.sender, corveeAmount, shellAmount);
    }

    /// @dev Non-transferable
    function _update(address from, address to, uint256 value) internal override {
        require(from == address(0) || to == address(0), "Non-transferable");
        super._update(from, to, value);
    }
}
