// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract TokenMock is ERC20Upgradeable {
    function initialize(string memory name, string memory symbol, uint256 totalSupply)
        public initializer {
        ERC20Upgradeable.__ERC20_init(name, symbol);
        ERC20Upgradeable._mint(msg.sender, totalSupply);
    }
}