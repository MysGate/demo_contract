// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IPorterPool {
    function paying(address token, address to, uint256 amount) external;

    function returning(
        address from,
        address token,
        uint256 amount
    ) external;

    function initialize(address owner, address crossController, bytes memory data) external;

    function fixedFee() external view returns(uint256);
}
