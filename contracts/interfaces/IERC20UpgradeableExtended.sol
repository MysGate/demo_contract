// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

interface IERC20UpgradeableExtended is IERC20Upgradeable {
    function decimals() external view returns (uint8);
}
