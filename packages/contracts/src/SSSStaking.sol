// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title SSSStaking — Stake $SSS for membership
/// @notice Unlock after 30 days of verified corvée contributions
contract SSSStaking is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable sssToken;
    uint256 public constant CORVEE_PERIOD = 30 days;

    struct Stake {
        uint256 amount;
        uint256 stakedAt;
        bool unlocked; // set true after 30 days of verified corvée
    }

    mapping(address => Stake) public stakes;

    event Staked(address indexed user, uint256 amount);
    event Unlocked(address indexed user);
    event Withdrawn(address indexed user, uint256 amount);

    constructor(address _sssToken) Ownable(msg.sender) {
        sssToken = IERC20(_sssToken);
    }

    function stake(uint256 amount) external {
        require(stakes[msg.sender].amount == 0, "Already staked");
        sssToken.safeTransferFrom(msg.sender, address(this), amount);
        stakes[msg.sender] = Stake(amount, block.timestamp, false);
        emit Staked(msg.sender, amount);
    }

    /// @notice Called by oracle/governor after corvée verification
    function unlock(address user) external onlyOwner {
        Stake storage s = stakes[user];
        require(s.amount > 0, "No stake");
        require(block.timestamp >= s.stakedAt + CORVEE_PERIOD, "Too early");
        s.unlocked = true;
        emit Unlocked(user);
    }

    function withdraw() external {
        Stake storage s = stakes[msg.sender];
        require(s.unlocked, "Not unlocked");
        uint256 amount = s.amount;
        delete stakes[msg.sender];
        sssToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }
}
