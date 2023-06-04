// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IBridgeVerifier {
    function addCommitment(uint256 _commitment) external;
    function verify (
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input) external view returns (bool);
    function isKnownRoot(uint256 _root) external view returns(bool);
}