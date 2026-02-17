// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ISuperfluid.sol";

/// @title SSSShells — Non-transferable governance shares with GDA dividends
/// @notice Created by burning $sSSS via SSSCorvee. 2-year lock from minting.
///         Integrates with Superfluid GDA pool — Shell balance = pool units.
contract SSSShells is ERC20, Ownable {
    ISuperToken public immutable sssToken;
    ISuperfluidPool public immutable dividendPool;
    address public corveeContract;

    uint256 public constant LOCK_PERIOD = 730 days; // ~2 years

    /// @notice Track when shells were minted for lock enforcement
    mapping(address => uint256) public mintedAt;

    event ShellsMinted(address indexed to, uint256 amount);

    constructor(
        ISuperToken _sssToken,
        ISuperfluidPool _dividendPool,
        address _corveeContract,
        address _owner
    ) ERC20("SSS Shells", "SHELL") Ownable(_owner) {
        sssToken = _sssToken;
        dividendPool = _dividendPool;
        corveeContract = _corveeContract;
    }

    /// @notice Set corvée contract (for circular dependency resolution)
    function setCorveeContract(address _corveeContract) external onlyOwner {
        corveeContract = _corveeContract;
    }

    /// @notice Mint Shells — only callable by SSSCorvee during conversion
    function mintFromCorvee(address to, uint256 amount) external {
        require(msg.sender == corveeContract, "Only corvee contract");
        require(amount > 0, "Zero amount");

        _mint(to, amount);
        mintedAt[to] = block.timestamp;

        // Update GDA pool units to match new Shell balance
        dividendPool.updateMemberUnits(to, uint128(balanceOf(to)));

        emit ShellsMinted(to, amount);
    }

    /// @dev Non-transferable + 2-year lock
    function _update(address from, address to, uint256 value) internal override {
        require(from == address(0) || to == address(0), "Non-transferable");
        if (to == address(0) && from != address(0)) {
            // Burning — check lock period
            require(
                block.timestamp >= mintedAt[from] + LOCK_PERIOD,
                "Lock period not elapsed"
            );
        }
        super._update(from, to, value);
    }
}
