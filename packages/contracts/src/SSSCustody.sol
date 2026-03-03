// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ISuperfluid.sol";

interface ISSSCorvee {
    function convertToShells(uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
}

/// @title SSSCustody — Per-agent contract holding GDA pool units and accumulated $SSS
/// @notice Each verified agent gets a custody contract deployed by CustodyFactory.
///         The custody contract:
///         - Holds GDA pool units (non-transferable, can't be moved out)
///         - Accumulates $SSS from the dividend stream via those units
///         - Agent can claim accumulated $SSS dividends
///         - DAO (owner) can slash: zero out units, seize accumulated $SSS
///         The agent address can call limited functions (claimDividends).
///         The factory (owner) controls administrative operations.
contract SSSCustody is Ownable {
    ISuperToken public immutable sssToken;
    ISuperfluidPool public immutable dividendPool;
    address public immutable agent;

    /// @notice Whether this custody has been slashed (deactivated)
    bool public slashed;

    event UnitsUpdated(uint128 oldUnits, uint128 newUnits);
    event DividendsClaimed(address indexed agent, uint256 amount);
    event Slashed(uint128 unitsRemoved, uint256 sssSeized);
    event SSSWithdrawn(address indexed to, uint256 amount);

    modifier onlyAgent() {
        require(msg.sender == agent, "Only agent");
        _;
    }

    modifier notSlashed() {
        require(!slashed, "Custody slashed");
        _;
    }

    constructor(
        ISuperToken _sssToken,
        ISuperfluidPool _dividendPool,
        address _agent,
        address _owner
    ) Ownable(_owner) {
        sssToken = _sssToken;
        dividendPool = _dividendPool;
        agent = _agent;
    }

    /// @notice Owner grants GDA pool units to this custody contract
    /// @dev Units represent the agent's share of the $SSS dividend stream
    function setUnits(uint128 newUnits) external onlyOwner notSlashed {
        uint128 oldUnits = dividendPool.getUnits(address(this));
        dividendPool.updateMemberUnits(address(this), newUnits);
        emit UnitsUpdated(oldUnits, newUnits);
    }

    /// @notice Owner (DAO) withdraws accumulated $SSS dividends to a destination
    function withdrawSSS(address to, uint256 amount) external onlyOwner notSlashed {
        require(amount > 0, "Zero amount");
        require(sssToken.balanceOf(address(this)) >= amount, "Insufficient balance");
        sssToken.transfer(to, amount);
        emit SSSWithdrawn(to, amount);
    }

    /// @notice Agent claims their accumulated $SSS dividends
    function claimDividends() external onlyAgent notSlashed {
        uint256 bal = sssToken.balanceOf(address(this));
        require(bal > 0, "Nothing to claim");
        sssToken.transfer(agent, bal);
        emit DividendsClaimed(agent, bal);
    }

    /// @notice Slash this agent — remove all units, seize accumulated $SSS
    function slash(address seizedTo) external onlyOwner {
        uint128 currentUnits = dividendPool.getUnits(address(this));
        uint256 sssBalance = sssToken.balanceOf(address(this));

        if (currentUnits > 0) {
            dividendPool.updateMemberUnits(address(this), 0);
        }

        if (sssBalance > 0) {
            sssToken.transfer(seizedTo, sssBalance);
        }

        slashed = true;
        emit Slashed(currentUnits, sssBalance);
    }

    /// @notice View: current GDA pool units
    function getUnits() external view returns (uint128) {
        return dividendPool.getUnits(address(this));
    }

    /// @notice View: accumulated $SSS balance
    function getAccumulatedSSS() external view returns (uint256) {
        return sssToken.balanceOf(address(this));
    }
}

/// @title SSSCustodyFactory — Deploys per-agent custody contracts
/// @notice Owned by the DAO governor. Creates custody contracts for verified agents.
///         Maintains a registry of agent -> custody mappings.
contract SSSCustodyFactory is Ownable {
    ISuperToken public immutable sssToken;
    ISuperfluidPool public immutable dividendPool;

    /// @notice agent EOA -> custody contract
    mapping(address => SSSCustody) public custodyOf;

    /// @notice All deployed custody contracts
    address[] public allCustodies;

    event CustodyCreated(address indexed agent, address indexed custody);
    event CustodySlashed(address indexed agent, address indexed custody);

    constructor(
        ISuperToken _sssToken,
        ISuperfluidPool _dividendPool,
        address _owner
    ) Ownable(_owner) {
        sssToken = _sssToken;
        dividendPool = _dividendPool;
    }

    /// @notice Deploy a custody contract for a newly verified agent
    function createCustody(address agent) external onlyOwner returns (SSSCustody) {
        require(address(custodyOf[agent]) == address(0), "Custody already exists");
        require(agent != address(0), "Zero agent address");

        SSSCustody custody = new SSSCustody(
            sssToken,
            dividendPool,
            agent,
            address(this) // factory owns all custodies
        );

        custodyOf[agent] = custody;
        allCustodies.push(address(custody));

        emit CustodyCreated(agent, address(custody));
        return custody;
    }

    /// @notice Create custody AND set initial pool units in one tx
    function createCustodyWithUnits(address agent, uint128 initialUnits)
        external
        onlyOwner
        returns (SSSCustody)
    {
        // Inline instead of external self-call to avoid msg.sender issues
        require(address(custodyOf[agent]) == address(0), "Custody already exists");
        require(agent != address(0), "Zero agent address");

        SSSCustody custody = new SSSCustody(
            sssToken,
            dividendPool,
            agent,
            address(this)
        );

        custodyOf[agent] = custody;
        allCustodies.push(address(custody));
        emit CustodyCreated(agent, address(custody));

        custody.setUnits(initialUnits);
        return custody;
    }

    /// @notice Slash an agent via their custody contract
    function slashAgent(address agent, address seizedTo) external onlyOwner {
        SSSCustody custody = custodyOf[agent];
        require(address(custody) != address(0), "No custody for agent");
        custody.slash(seizedTo);
        emit CustodySlashed(agent, address(custody));
    }

    /// @notice Update an agent's pool units
    function setAgentUnits(address agent, uint128 newUnits) external onlyOwner {
        SSSCustody custody = custodyOf[agent];
        require(address(custody) != address(0), "No custody for agent");
        custody.setUnits(newUnits);
    }

    /// @notice Total number of custody contracts deployed
    function totalCustodies() external view returns (uint256) {
        return allCustodies.length;
    }

    /// @notice Check if an agent has a custody contract
    function hasCustody(address agent) external view returns (bool) {
        return address(custodyOf[agent]) != address(0);
    }
}
