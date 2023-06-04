// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

import "./interfaces/IPorterFactory.sol";
import "./interfaces/IPorterPool.sol";
import "./interfaces/IBridgeVerifier.sol";
import "./interfaces/IERC20UpgradeableExtended.sol";


contract CrossController is PausableUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    event CrossTo(
        address indexed account,
        Order order,
        uint256 fixedFeeAmount,
        uint256 floatFeeAmount,
        uint256 crossAmount
    );
    event CrossFrom(
        address indexed validator,
        Order order,
        uint8 srcTokenDecimals,
        uint256 crossAmount,
        uint256 paidAmount
    );
    event CommitReceipt(
        address indexed validator,
        bytes32 indexed orderHash,
        Receipt receipt
    );
    event SettedFloatFee(uint256 floatFee);
    event SettedPorterFactory(address _factory);
    event SettedZkVerifier(address _zkVerifier);
    event EnabledZkVerifier(bool _enable);

    struct Order {
        uint256 orderId; // unique required
        uint256 srcChainId;
        address srcAddress;
        address srcToken;
        uint256 srcAmount;
        uint256 destChainId;
        address destAddress;
        address destToken;
        address porter;
    }

    struct Proof {
        uint[2] a;
        uint[2][2] b;
        uint[2] c;
    }

    struct Receipt {
        bytes32 proofHash;
        bytes32 destTxHash;
    }

    uint256 public currentChainId;
    uint256 public floatFee;
    mapping(bytes32 => Order) public orders;
    mapping(bytes32 => Receipt) public receipts;
    mapping(uint256 => bytes32) public orderHashes;
    mapping(bytes32 => bool) public pendingOrders;
    mapping(bytes32 => bool) public paidOrders;
    address public owner;
    address public porterFactory;
    bool    public enable;
    address public zkVerifier;

    modifier onlyOwner() {
        require(msg.sender == owner, "");
        _;
    }

    function initialize(address _owner) external initializer {
        {
            uint256 chainId;
            assembly {
                chainId := chainid()
            }
            currentChainId = chainId;
        }
        owner = _owner;
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
                order.porter
            )
        );
        require(orderHashes[order.orderId] == bytes32(0), "");
        address porterPool = IPorterFactory(porterFactory).getPorterPool(order.porter);
        require(porterPool != address(0), "");

        orders[orderHash] = order;
        orderHashes[order.orderId] = orderHash;
        pendingOrders[orderHash] = true;
        IERC20Upgradeable(order.srcToken).safeTransferFrom(
            msg.sender,
            address(this),
            order.srcAmount
        );

        uint256 fixedFee = IPorterPool(porterPool).fixedFee();
        uint256 fixedFeeAmount = (fixedFee *
            (10 ** IERC20UpgradeableExtended(order.srcToken).decimals())) /
            10000;
        uint256 floatFeeAmount = (order.srcAmount * floatFee) / 10000;
        uint256 crossAmount = order.srcAmount - fixedFeeAmount - floatFeeAmount;

        emit CrossTo(
            msg.sender,
            order,
            fixedFeeAmount,
            floatFeeAmount,
            crossAmount
        );
    }

    function crossFrom(
        Order calldata order,
        uint8 srcTokenDecimals,
        uint256 crossAmount
    ) external onlyOwner {
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
                order.porter
            )
        );
        require(!paidOrders[orderHash], "");
        address porterPool = IPorterFactory(porterFactory).getPorterPool(order.porter);
        require(porterPool != address(0), "");

        paidOrders[orderHash] = true;

        uint256 paidAmount = (crossAmount *
            (10 ** IERC20UpgradeableExtended(order.destToken).decimals())) /
            (10 ** srcTokenDecimals);
        IPorterPool(porterPool).paying(
            order.destAddress,
            order.destToken,
            paidAmount
        );

        emit CrossFrom(
            msg.sender,
            order,
            srcTokenDecimals,
            crossAmount,
            paidAmount
        );
    }

    function commitReceipt(
        bytes32 orderHash,
        Receipt calldata receipt
    ) external onlyOwner {
        require(pendingOrders[orderHash], "");
        Order memory order = orders[orderHash];
        address porterPool = IPorterFactory(porterFactory).getPorterPool(order.porter);
        require(porterPool != address(0), "");

        pendingOrders[orderHash] = false;
        receipts[orderHash] = receipt;
        
        IERC20Upgradeable(order.srcToken).approve(
            porterPool,
            order.srcAmount
        );
        IPorterPool(porterPool).returning(
            address(this),
            order.srcToken,
            order.srcAmount
        );

        emit CommitReceipt(msg.sender, orderHash, receipt);
    }

    function commitReceiptWithZK(
        Proof calldata proof,
        uint[2] memory input,
        bytes32 orderHash,
        bytes32 destTxHash
    ) external onlyOwner {
        require(enable, "");
        require(zkVerifier != address(0), "");
        require(pendingOrders[orderHash], "");
        Order memory order = orders[orderHash];
        address porterPool = IPorterFactory(porterFactory).getPorterPool(order.porter);
        require(porterPool != address(0), "");
        

        pendingOrders[orderHash] = false;
        require(IBridgeVerifier(zkVerifier).verify(proof.a, proof.b, proof.c, input), "");
        
         bytes32 proofHash = keccak256(
            abi.encodePacked(
                proof.a,
                proof.b,
                proof.c
            )
        );
        
        Receipt memory receipt = Receipt({
            proofHash: proofHash,
            destTxHash: destTxHash
        });

        receipts[orderHash] = receipt;
        
        IERC20Upgradeable(order.srcToken).approve(
            porterPool,
            order.srcAmount
        );
        IPorterPool(porterPool).returning(
            address(this),
            order.srcToken,
            order.srcAmount
        );

        emit CommitReceipt(msg.sender, orderHash, receipt);
    }
    
    function addCommitment(uint256 _commitment) external onlyOwner {
        IBridgeVerifier(zkVerifier).addCommitment(_commitment);
    }
    
    function setFloatFee(uint256 _floatFee) external onlyOwner {
        require(_floatFee <= 10000, "");
        floatFee = _floatFee;

        emit SettedFloatFee(_floatFee);
    }

    function setPorterFactory(address _factory) external onlyOwner {
        require(_factory != address(0), "");
        porterFactory = _factory;

        emit SettedPorterFactory(_factory);
    }

    function setZkVerifier(address _verifier) external onlyOwner {
        require(_verifier != address(0), "");
        zkVerifier = _verifier;

        emit SettedZkVerifier(_verifier);
    }

    function enableZkVerifier(bool _enable) external onlyOwner {
        require(enable != _enable, "");
        enable = _enable;

        emit EnabledZkVerifier(_enable);
    }
}
