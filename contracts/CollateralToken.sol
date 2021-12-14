pragma solidity ^0.5.1;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

contract CollateralToken is ERC20Mintable {
    string public name = "Respect";
    string public symbol = "F";
    uint8 public decimals = 18;
}
