// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {SSSCustodyFactory} from "../src/SSSCustody.sol";
import "../src/interfaces/ISuperfluid.sol";

contract DeployCustody is Script {
    function run() external {
        // Load from env or hardcode testnet addresses
        address sssToken = vm.envAddress("SSS_TOKEN");
        address dividendPool = vm.envAddress("DIVIDEND_POOL");
        address deployer = vm.envAddress("DEPLOYER");

        vm.startBroadcast();

        SSSCustodyFactory factory = new SSSCustodyFactory(
            ISuperToken(sssToken),
            ISuperfluidPool(dividendPool),
            deployer // owner = deployer for now
        );

        console.log("CustodyFactory deployed at:", address(factory));

        vm.stopBroadcast();
    }
}
