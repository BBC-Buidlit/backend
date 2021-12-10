// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ConditionalTokens } from "./ConditionalTokens.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract CollateralToken is ERC20 {
    constructor(string memory name, string memory symbol) public ERC20(name, symbol) {}
    
    function mint(address account, uint256 amount) external {
        _mint(account, amount);

    }
}
