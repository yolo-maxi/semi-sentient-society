// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ISSSStakingCapabilityRegistry {
    function stakes(address agent)
        external
        view
        returns (uint256 amount, uint256 consecutiveDays, uint256 lastConfirmationDay, bool active);
}

/// @title SSSCapabilityRegistry
/// @notice Staked agents can publish searchable capability tags for discovery.
contract SSSCapabilityRegistry {
    uint256 public constant MAX_CAPABILITIES = 10;

    ISSSStakingCapabilityRegistry public immutable staking;

    mapping(address => string[]) private capabilitiesByAgent;
    mapping(address => bool) private indexedAgent;
    address[] private agents;

    event CapabilitiesUpdated(address indexed agent, string[] capabilities);

    constructor(address stakingAddress) {
        require(stakingAddress != address(0), "Zero staking");
        staking = ISSSStakingCapabilityRegistry(stakingAddress);
    }

    modifier onlyStakedAgent() {
        (, , , bool active) = staking.stakes(msg.sender);
        require(active, "Agent not staked");
        _;
    }

    function setCapabilities(string[] calldata caps) external onlyStakedAgent {
        require(caps.length <= MAX_CAPABILITIES, "Too many capabilities");

        delete capabilitiesByAgent[msg.sender];
        for (uint256 i = 0; i < caps.length; i++) {
            _validateCapability(caps[i]);
            require(!_hasCapability(capabilitiesByAgent[msg.sender], caps[i]), "Capability exists");
            capabilitiesByAgent[msg.sender].push(caps[i]);
        }

        _indexAgent(msg.sender);
        emit CapabilitiesUpdated(msg.sender, capabilitiesByAgent[msg.sender]);
    }

    function addCapability(string calldata cap) external onlyStakedAgent {
        _validateCapability(cap);

        string[] storage currentCapabilities = capabilitiesByAgent[msg.sender];
        require(currentCapabilities.length < MAX_CAPABILITIES, "Too many capabilities");
        require(!_hasCapability(currentCapabilities, cap), "Capability exists");

        currentCapabilities.push(cap);
        _indexAgent(msg.sender);

        emit CapabilitiesUpdated(msg.sender, currentCapabilities);
    }

    function removeCapability(string calldata cap) external onlyStakedAgent {
        string[] storage currentCapabilities = capabilitiesByAgent[msg.sender];
        uint256 length = currentCapabilities.length;

        for (uint256 i = 0; i < length; i++) {
            if (_sameString(currentCapabilities[i], cap)) {
                currentCapabilities[i] = currentCapabilities[length - 1];
                currentCapabilities.pop();
                emit CapabilitiesUpdated(msg.sender, currentCapabilities);
                return;
            }
        }

        revert("Capability not found");
    }

    function getCapabilities(address agent) external view returns (string[] memory) {
        return capabilitiesByAgent[agent];
    }

    function getAgents() external view returns (address[] memory) {
        return agents;
    }

    function _indexAgent(address agent) internal {
        if (!indexedAgent[agent]) {
            indexedAgent[agent] = true;
            agents.push(agent);
        }
    }

    function _hasCapability(string[] storage caps, string calldata cap) internal view returns (bool) {
        for (uint256 i = 0; i < caps.length; i++) {
            if (_sameString(caps[i], cap)) {
                return true;
            }
        }

        return false;
    }

    function _validateCapability(string calldata cap) internal pure {
        require(bytes(cap).length > 0, "Empty capability");
    }

    function _sameString(string memory left, string calldata right) internal pure returns (bool) {
        return keccak256(bytes(left)) == keccak256(bytes(right));
    }
}
