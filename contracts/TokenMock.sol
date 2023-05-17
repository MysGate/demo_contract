// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract TokenMock is ERC20Upgradeable {
    constructor(string memory name, string memory symbol, uint256 totalSupply) {
        ERC20Upgradeable.__ERC20_init(name, symbol);
        ERC20Upgradeable._mint(msg.sender, totalSupply);
    }
}