// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import "./PorterPool.sol";

contract PorterPoolFactory {
    event CreatePorterPool(address indexed porter, address indexed pool);

    address public crossController;

    constructor(address _crossController) {
        crossController = _crossController;
    }

    mapping(address => address) public porterPools;

    function createPorterPool(bytes memory data) public {
        PorterPool porterPool = new PorterPool(); //TODO: beacon upgradeable
        porterPool.initialize(msg.sender, crossController, data);
        porterPools[msg.sender] = address(porterPool);
        emit CreatePorterPool(msg.sender, address(porterPool));
    }
}
