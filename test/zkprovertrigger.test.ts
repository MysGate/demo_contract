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
      
      await CC.enableZkVerifier(true); 
      expect(await CC.enable()).to.equal(true);

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
    }); 
  }); 