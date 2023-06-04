const { expect } = require("chai"); 
const { ethers, upgrades } = require("hardhat"); 
const cls = require("circomlibjs");

describe("CrossController", function () { 
  it("Should return the correct floatRate and porterPool", async function () { 
    [addr1, addr2, addr3, addr4, ...addrs] = await ethers.getSigners();
    const CrossController = await ethers.getContractFactory("CrossController");
    const PorterPoolFactory = await ethers.getContractFactory("PorterPoolFactory");
    const PorterPool = await ethers.getContractFactory("PorterPool");
  
    const CC = await CrossController.deploy();
    await CC.deployed();
    await CC.initialize(addr1.address);
    console.log("CrossController Addr: ", CC.address);

    const PF = await PorterPoolFactory.deploy(CC.address);
    await PF.deployed();
  
    await CC.setPorterFactory(PF.address);
    console.log("porter factory Addr: ", PF.address);

    expect(await CC.porterFactory()).to.equal(PF.address); 
    await CC.setFloatFee(2);
    expect(await CC.floatFee()).to.equal(2); 

    await PF.createPorterPool("0x");
    var porterPoolAddr = await PF.porterPools(addr1.address);
    console.log("porterPool Addr: ", porterPoolAddr);

    var porterPool = await PorterPool.attach(porterPoolAddr);
    await porterPool.setFixedFee(10000);
    expect(await porterPool.fixedFee()).to.equal(10000); 

    var porterPool = await PorterPool.attach(porterPoolAddr);
    await porterPool.setFixedFee(10000);
    
    // zk
    poseidonHash = await cls.buildPoseidonReference();
    const C6 = new hre.ethers.ContractFactory(
      cls.poseidonContract.generateABI(2),
      cls.poseidonContract.createCode(2),
      addr1
    );
    poseidonContract = await C6.deploy();
    console.log("poseidon Address:", poseidonContract.address)
  
    var bridgeFactory = await ethers.getContractFactory("Bridge");
    let bridge = await bridgeFactory.deploy(poseidonContract.address, CC.address);
    await bridge.deployed()
    console.log("Bridge Addr: ", bridge.address);
  
    await CC.setZkVerifier(bridge.address);
    expect(await CC.zkVerifier()).to.equal(bridge.address); 

    expect(await CC.enable()).to.equal(false);
    await CC.enableZkVerifier(true);
    expect(await CC.enable()).to.equal(true); 
  }); 
}); 