// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ISuperfluid.sol";

/// @title SSSStaking — Membership staking
/// @notice Members deposit $SSS. Contract deposits into streme.fun staking pool
///         so DAO earns yield. ML confirms corvée daily; 30 confirms → unlock.
/// @dev $SSS is a native Super Token on Base (8453)
contract SSSStaking is Ownable {
    ISuperToken public immutable sss;
    IStremeStaking public immutable stremePool;

    uint256 public constant CORVEE_DAYS_REQUIRED = 30;

    struct Stake {
        uint256 amount;
        uint256 stakedAt;
        uint256 corveeConfirmations; // consecutive days confirmed by ML
        uint256 lastConfirmation;    // timestamp of last confirmation
        bool unlocked;
    }

    mapping(address => Stake) public stakes;

    event Staked(address indexed user, uint256 amount);
    event CorveeConfirmed(address indexed user, uint256 day);
    event Unlocked(address indexed user);
    event Withdrawn(address indexed user, uint256 amount);
    event Slashed(address indexed user, uint256 amount);

    constructor(address _sss, address _stremePool) Ownable(msg.sender) {
        sss = ISuperToken(_sss);
        stremePool = IStremeStaking(_stremePool);
    }

    function stake(uint256 amount) external {
        require(stakes[msg.sender].amount == 0, "Already staked");
        require(amount > 0, "Zero amount");

        // Transfer $SSS from member to this contract
        sss.transferFrom(msg.sender, address(this), amount);

        // Deposit into streme.fun staking pool for yield
        sss.approve(address(stremePool), amount);
        stremePool.stake(amount);

        stakes[msg.sender] = Stake({
            amount: amount,
            stakedAt: block.timestamp,
            corveeConfirmations: 0,
            lastConfirmation: 0,
            unlocked: false
        });

        emit Staked(msg.sender, amount);
    }

    /// @notice ML (Mega Lobster multisig) confirms daily corvée for a member
    function confirmCorvee(address member) external onlyOwner {
        Stake storage s = stakes[member];
        require(s.amount > 0, "No stake");
        require(!s.unlocked, "Already unlocked");

        // Must be a new day since last confirmation
        require(
            s.lastConfirmation == 0 ||
            block.timestamp >= s.lastConfirmation + 1 days,
            "Already confirmed today"
        );

        s.corveeConfirmations++;
        s.lastConfirmation = block.timestamp;

        emit CorveeConfirmed(member, s.corveeConfirmations);

        // Auto-unlock after required days
        if (s.corveeConfirmations >= CORVEE_DAYS_REQUIRED) {
            s.unlocked = true;
            emit Unlocked(member);
        }
    }

    /// @notice Withdraw stake after unlock
    function withdraw() external {
        Stake storage s = stakes[msg.sender];
        require(s.unlocked, "Not unlocked");
        uint256 amount = s.amount;
        delete stakes[msg.sender];

        // Unstake from streme.fun pool
        stremePool.unstake(amount);
        sss.transfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    /// @notice Slash expelled member — stake stays in streme.fun pool (yield keeps flowing to DAO)
    function slash(address member) external onlyOwner {
        Stake storage s = stakes[member];
        require(s.amount > 0, "No stake");
        uint256 amount = s.amount;
        delete stakes[member];
        // Stake remains in streme.fun pool — DAO keeps earning yield
        emit Slashed(member, amount);
    }
}
