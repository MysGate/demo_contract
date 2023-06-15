const { expect, assert } = require("chai");
const {ethers, upgrades} = require("hardhat");
const path = require("path");
const cls = require("circomlibjs");
import * as utils from "../src/utils";

describe("zkbridge", function () { 
    it("Should verify the proof", async function () { 
      const [porter, bob, bob1, bob2, ...addrs] = await ethers.getSigners();
      const CrossController = await ethers.getContractFactory("CrossController");
      const PorterPoolFactory = await ethers.getContractFactory("PorterPoolFactory");
      const PorterPool = await ethers.getContractFactory("PorterPool");

      // crosscontroller
      const CC = await CrossController.deploy();
      await CC.deployed();
      await CC.initialize(porter.address);
      console.log("CrossController Addr: ", CC.address);

      // porterpool
      const PF = await PorterPoolFactory.deploy(CC.address);
      await PF.deployed();

      await CC.setPorterFactory(PF.address);
      console.log("porter factory Addr: ", PF.address);

      expect(await CC.porterFactory()).to.equal(PF.address); 
      await CC.setFloatFee(2);
      expect(await CC.floatFee()).to.equal(2); 

      await PF.createPorterPool("0x");
      var porterPoolAddr = await PF.porterPools(porter.address);
      console.log("porterPool Addr: ", porterPoolAddr);

      var porterPool = await PorterPool.attach(porterPoolAddr);
      await porterPool.setFixedFee(10000);
      expect(await porterPool.fixedFee()).to.equal(10000); 

      var porterPool = await PorterPool.attach(porterPoolAddr);
      await porterPool.setFixedFee(10000);

      // zk
      const poseidonHash = await cls.buildPoseidonReference();
      const C6 = new ethers.ContractFactory(
            cls.poseidonContract.generateABI(2),
            cls.poseidonContract.createCode(2),
            porter);
      const poseidonContract = await C6.deploy();
      console.log("poseidon Address:", poseidonContract.address)

      var bridgeFactory = await ethers.getContractFactory("Bridge");
      let bridge = await bridgeFactory.deploy(poseidonContract.address, CC.address);
      await bridge.deployed();
      console.log("Bridge Addr: ", bridge.address);
      await CC.setZkVerifier(bridge.address); 
      expect(await CC.zkVerifier()).to.equal(bridge.address); 

      // token
      const supply = ethers.utils.parseUnits("100000000","ether")
      const tokenMock = await ethers.getContractFactory("TokenMock"); 
      const mysUSDT = await upgrades.deployProxy(tokenMock, ['mys USDT', 'mysUSDT', supply]); 
      await mysUSDT.deployed(); 
      console.log("mysUSDT deployed to:", mysUSDT.address); 
      
      // porter transfer 90token to bob
      var amount = ethers.utils.parseUnits("90","ether")
      const tx = await mysUSDT.transfer(bob.address, amount);
      await tx.wait();
      expect(await mysUSDT.balanceOf(bob.address)).to.equal(amount); 
      // generate proof verify it
      console.log("mysUSDT transfer to bob tx:", tx.hash);
      console.log("===addCommitment===")
      console.log("root before operation: ", await bridge.getRoot())
      const txadd = await CC.addCommitment(tx.hash);
      await txadd.wait();
      console.log("root after operation: ", await bridge.getRoot())
      const path2RootPos = [0, 0, 0, 0, 0, 0, 0, 0]
      const cmtIdx = utils.Bits2Num(8, path2RootPos)
      console.log("cmtIdx", cmtIdx);
      const [a, b, c, publicInfo] = await utils.generateProof(bridge, cmtIdx, tx.hash);
      console.log("===verify===", publicInfo);
      expect(await(await bridge.verify(a, b, c, publicInfo))).to.equal(true); 

      // porter transfer 100token to bob1
      amount = ethers.utils.parseUnits("100","ether")
      const tx1 = await mysUSDT.transfer(bob1.address, amount);
      expect(await mysUSDT.balanceOf(bob1.address)).to.equal(amount); 
      await tx1.wait();
      console.log("mysUSDT transfer to bob1 tx:", tx1.hash);
      console.log("===addCommitment===")
      console.log("root before operation: ", await bridge.getRoot())
      const txadd1 = await CC.addCommitment(tx1.hash);
      await txadd1.wait();
      console.log("root after operation: ", await bridge.getRoot())
      const path2RootPos1 = [1, 0, 0, 0, 0, 0, 0, 0]
      const cmtIdx1 = utils.Bits2Num(8, path2RootPos1)
      console.log("cmtIdx", cmtIdx1);
      const [a1, b1, c1, publicInfo1] = await utils.generateProof(bridge, cmtIdx1, tx1.hash);
      console.log("===verify===", publicInfo1);
      expect(await(await bridge.verify(a1, b1, c1, publicInfo1))).to.equal(true); 

      // porter transfer 800token to bob2
      amount = ethers.utils.parseUnits("80","ether")
      const tx2 = await mysUSDT.transfer(bob2.address, amount);
      expect(await mysUSDT.balanceOf(bob2.address)).to.equal(amount); 
      // generate proof verify it
      await tx2.wait();
      console.log("mysUSDT transfer to bob2 tx:", tx2.hash);
      console.log("===addCommitment===")
      console.log("root before operation: ", await bridge.getRoot())
      const txadd2 = await CC.addCommitment(tx2.hash);
      await txadd2.wait();
      console.log("root after operation: ", await bridge.getRoot())
      const path2RootPos2 = [0, 1, 0, 0, 0, 0, 0, 0]
      const cmtIdx2 = utils.Bits2Num(8, path2RootPos2)
      console.log("cmtIdx", cmtIdx2);
      const [a2, b2, c2, publicInfo2] = await utils.generateProof(bridge, cmtIdx2, tx2.hash);
      console.log("===verify===", publicInfo2);
      expect(await(await bridge.verify(a2, b2, c2, publicInfo2))).to.equal(true); 
    }); 
  }); 