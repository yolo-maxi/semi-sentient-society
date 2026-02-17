// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ISuperfluid.sol";

/// @title SSSStaking — Membership staking with corvée tracking
/// @notice Members deposit $SSS → forwarded to streme.fun staking pool.
///         Owner confirms corvée daily. 30 consecutive days → can unstake.
///         Missed day resets counter. Slash = stake stays in pool forever.
contract SSSStaking is Ownable {
    ISuperToken public immutable sssToken;
    address public immutable stakingPool;

    uint256 public constant CORVEE_DAYS_REQUIRED = 30;

    struct StakeInfo {
        uint256 amount;
        uint256 consecutiveDays;
        uint256 lastConfirmationDay; // day number (timestamp / 1 days)
        bool active;
    }

    mapping(address => StakeInfo) public stakes;

    event Staked(address indexed member, uint256 amount);
    event Unstaked(address indexed member, uint256 amount);
    event CorveeConfirmed(address indexed member, uint256 consecutiveDays);
    event Slashed(address indexed member, uint256 amount);

    constructor(ISuperToken _sssToken, address _stakingPool, address _owner) Ownable(_owner) {
        sssToken = _sssToken;
        stakingPool = _stakingPool;
    }

    /// @notice Stake $SSS for membership. Deposits into streme.fun staking pool.
    function stake(uint256 amount) external {
        require(amount > 0, "Zero amount");
        require(!stakes[msg.sender].active, "Already staked");

        sssToken.transferFrom(msg.sender, stakingPool, amount);

        stakes[msg.sender] = StakeInfo({
            amount: amount,
            consecutiveDays: 0,
            lastConfirmationDay: 0,
            active: true
        });

        emit Staked(msg.sender, amount);
    }

    /// @notice Owner confirms a member did corvée today
    function confirmCorvee(address member) external onlyOwner {
        StakeInfo storage s = stakes[member];
        require(s.active, "No active stake");

        uint256 today = block.timestamp / 1 days;
        require(s.lastConfirmationDay != today, "Already confirmed today");

        // Reset if missed a day (not consecutive)
        if (s.lastConfirmationDay != 0 && today > s.lastConfirmationDay + 1) {
            s.consecutiveDays = 0;
        }

        s.consecutiveDays++;
        s.lastConfirmationDay = today;

        emit CorveeConfirmed(member, s.consecutiveDays);
    }

    /// @notice Unstake after 30 consecutive corvée days
    function unstake() external {
        StakeInfo storage s = stakes[msg.sender];
        require(s.active, "No active stake");
        require(s.consecutiveDays >= CORVEE_DAYS_REQUIRED, "Not enough corvee days");

        uint256 amount = s.amount;
        delete stakes[msg.sender];

        // Transfer $SSS back from staking pool to member
        // NOTE: requires stakingPool to have approved this contract or
        // the pool contract to support withdrawal. Simplified here.
        sssToken.transferFrom(stakingPool, msg.sender, amount);

        emit Unstaked(msg.sender, amount);
    }

    /// @notice Slash member — stake stays in staking pool, member loses it
    function slash(address member) external onlyOwner {
        StakeInfo storage s = stakes[member];
        require(s.active, "No active stake");

        uint256 amount = s.amount;
        delete stakes[member];

        // Stake stays in staking pool — DAO keeps earning yield
        emit Slashed(member, amount);
    }
}
