// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

contract PorterPool is PausableUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    event Deposited(
        address indexed from,
        address indexed token,
        uint256 amount
    );

    event Withdrawn(address indexed to, address indexed token, uint256 amount);
    event Paying(address indexed to, address indexed token, uint256 amount);
    event Returning(
        address indexed from,
        address indexed token,
        uint256 amount
    );

    event SettedFixedFee(uint256 fixedFee);

    mapping(address => uint256) public liqs; // token => amount
    address public owner;
    address public crossController;
    uint256 public fixedFee;

    function initialize(
        address _owner,
        address _crossController,
        bytes memory
    ) external initializer {
        owner = _owner;
        crossController = _crossController;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    modifier onlyCrossController() {
        require(msg.sender == crossController, "only CrossController");
        _;
    }

    function deposit(address token, uint256 amount) public onlyOwner {
        liqs[token] += amount;
        IERC20Upgradeable(token).safeTransferFrom(
            msg.sender,
            address(this),
            amount
        );
        emit Deposited(msg.sender, token, amount);
    }

    function withdraw(address token, uint256 amount) public onlyOwner {
        require(liqs[token] > amount, "no tokens to withdraw");
        liqs[token] -= amount;
        IERC20Upgradeable(token).safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, token, amount);
    }

    function returning(
        address from,
        address token,
        uint256 amount
    ) public onlyCrossController {
        liqs[token] += amount;
        IERC20Upgradeable(token).safeTransferFrom(from, address(this), amount);
        emit Returning(from, token, amount);
    }

    function paying(
        address to,
        address token,
        uint256 amount
    ) external onlyCrossController {
        require(liqs[token] >= amount, "no tokens to paying");
        liqs[token] -= amount;
        IERC20Upgradeable(token).safeTransfer(to, amount);
        emit Paying(to, token, amount);
    }

    function setFixedFee(uint256 _fixedFee) external onlyOwner {
        fixedFee = _fixedFee;
        emit SettedFixedFee(_fixedFee);
    }
}
