import { ethers, BigNumberish } from "ethers";
import { expect } from "chai";
const fs = require("fs");
const path = require("path");
const snarkjs = require("snarkjs");
const cls = require("circomlibjs");

export interface Proof {
  a: [BigNumberish, BigNumberish];
  b: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]];
  c: [BigNumberish, BigNumberish];
}

export function parseProof(proof: any): Proof {
  return {
      a: [proof.pi_a[0], proof.pi_a[1]],
      b: [
          [proof.pi_b[0][1], proof.pi_b[0][0]],
          [proof.pi_b[1][1], proof.pi_b[1][0]],
      ],
      c: [proof.pi_c[0], proof.pi_c[1]],
  };
}

export function Bits2Num(n, in1) {
  var lc1 = 0;

  var e2 = 1;
  for (var i = 0; i < n; i++) {
      lc1 += Number(in1[i]) * e2;
      e2 = e2 + e2;
  }
  return lc1
}

export async function getMerkleProof(bridgeInstance, leaf_index) {
  let res = []
  let addressBits = []
  let [proof, proof2] = await bridgeInstance.getMerkleProof(leaf_index);
  for (let i = 0; i < proof.length; i++) {
      let t = proof[i];
      res.push(t.toString())
  }

  for (let i = 0; i < proof2.length; i++) {
      let t = proof2[i];
      addressBits.push(t.toString())
  }
  return [res, addressBits];
}

export async function generateProof(contract, cmtIdx, param) {
    const poseidonHash = await cls.buildPoseidonReference();
    let [merklePath, path2RootPos2] = await getMerkleProof(contract, cmtIdx)
    let root = param;
    for (var i = 0; i < 8; i++) {
        if (path2RootPos2[i] == 1) {
            root = poseidonHash([root, merklePath[i]])
        } else {
            root = poseidonHash([merklePath[i], root])
        }
    }
    let input = {
        "root": poseidonHash.F.toString(root),
        "nullifierHash": param,
        "paths2_root": merklePath,
        "paths2_root_pos": path2RootPos2
    }
  
    let wasm = path.join(__dirname, "../circuit/main_js", "main.wasm");
    let zkey = path.join(__dirname, "../circuit", "circuit_final.zkey");
    const wc = require("../circuit/main_js/witness_calculator");
    const buffer = fs.readFileSync(wasm);
    const witnessCalculator = await wc(buffer);
  
    const witnessBuffer = await witnessCalculator.calculateWTNSBin(
        input,
        0
    );
    const { proof, publicSignals } = await snarkjs.groth16.prove(zkey, witnessBuffer);
    const { a, b, c } = parseProof(proof);
    return [a, b, c, publicSignals]
}

