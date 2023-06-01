// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IPorterFactory {
    function getPorterPool(address porter) external view returns (address);
}