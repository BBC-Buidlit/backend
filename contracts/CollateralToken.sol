pragma solidity ^0.5.1;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

contract CollateralToken is ERC20Mintable {
    string name;
    string symbol;

    uint8 public decimals = 18;

    constructor (string memory _name, string memory _symbol)public{
        name = _name;
        symbol =_symbol;
    }
}
