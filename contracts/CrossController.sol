// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

import "./interfaces/IPorterPool.sol";

contract CrossController is PausableUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    struct Order {
        uint256 orderId; // unique required
        uint256 srcChainId;
        address srcAddress;
        address srcToken;
        uint256 srcAmount;
        uint256 destChainId;
        address destAddress;
        address destToken;
        uint256 destAmount;
        address porterPool;
    }

    struct Receipt {
        bytes32 proof;
        bytes32 destTxHash;
    }

    uint256 public currentChainId;
    mapping(bytes32 => Order) public orders;
    mapping(bytes32 => Receipt) public receipts;
    mapping(uint256 => bytes32) public orderHashes;
    mapping(bytes32 => bool) public pendingOrders;
    mapping(bytes32 => bool) public paidOrders;
    address public validator;

    //TODO: multi validators
    modifier onlyValidator() {
        require(msg.sender == validator, "");
        _;
    }

    function initialize(address _validator) external initializer {
        {
            uint256 chainId;
            assembly {
                chainId := chainid()
            }
            currentChainId = chainId;
        }
        validator = _validator;
    }

    function crossTo(Order calldata order) external {
        require(order.srcAddress == msg.sender, "");
        require(order.srcChainId == currentChainId, "");
        bytes32 orderHash = keccak256(
            abi.encodePacked(
                order.orderId,
                order.srcChainId,
                order.srcAddress,
                order.srcToken,
                order.srcAmount,
                order.destChainId,
                order.destAddress,
                order.destToken,
                order.destAmount,
                order.porterPool
            )
        );
        require(orderHashes[order.orderId] == bytes32(0), "");
        orders[orderHash] = order;
        orderHashes[order.orderId] = orderHash;
        pendingOrders[orderHash] = true;
        IERC20Upgradeable(order.srcToken).safeTransferFrom(
            msg.sender,
            address(this),
            order.srcAmount
        );
    }

    function crossFrom(Order calldata order) external onlyValidator {
        require(order.srcAddress == msg.sender, "");
        require(order.destChainId == currentChainId, "");
        bytes32 orderHash = keccak256(
            abi.encodePacked(
                order.orderId,
                order.srcChainId,
                order.srcAddress,
                order.srcToken,
                order.srcAmount,
                order.destChainId,
                order.destAddress,
                order.destToken,
                order.destAmount,
                order.porterPool
            )
        );
        require(!paidOrders[orderHash], "");
        paidOrders[orderHash] = true;
        IPorterPool(order.porterPool).paying(
            order.destAddress,
            order.destToken,
            order.destAmount
        );
    }

    function commitReceipt(
        bytes32 orderHash,
        Receipt calldata receipt
    ) external onlyValidator {
        require(pendingOrders[orderHash], "");
        pendingOrders[orderHash] = false;
        receipts[orderHash] = receipt;
        Order memory order = orders[orderHash];
        //TODO: verifier.sol
        IERC20Upgradeable(order.srcToken).approve(
            order.porterPool,
            order.srcAmount
        );
        IPorterPool(order.porterPool).returning(
            address(this),
            order.srcToken,
            order.srcAmount
        );
    }
}
