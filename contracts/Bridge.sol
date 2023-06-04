// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "./MerkleTree.sol";
import "./verifier.sol";

contract Bridge is MerkleTree ,Verifier {
    event CommitmentAdded(uint256 indexed commitment, uint256 leafIndex, uint256 timestamp);
    
    address public controller;

    mapping (uint256 => bool) public roots;
    mapping(uint256 => bool) public commitments;

    constructor  (address _mimc, address _controller) MerkleTree(_mimc) public {
        controller = _controller;
    }
    
    modifier onlyController() {
        require(msg.sender == controller, "");
        _;
    }

    function addCommitment(uint256 _commitment) public onlyController {
        require(!commitments[_commitment], "The commitment has been submitted");
        uint256 insertedIndex = insert(_commitment);
        commitments[_commitment] = true;
        roots[getRoot()] = true;
        emit CommitmentAdded(_commitment,insertedIndex,block.timestamp);
    }

    function verify (
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input) public view returns (bool) {
        require(isKnownRoot(input[0]), "Cannot find your merkle root"); // Make sure to use a recent one
        require(verifyProof(a, b, c, input), "Invalid proof");
        return true;
    }

    function isKnownRoot(uint256 _root) public view returns(bool){
        return roots[_root];
    }

}
