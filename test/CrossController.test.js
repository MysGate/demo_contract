const { expect } = require("chai"); 
const { ethers, upgrades } = require("hardhat"); 

describe("CrossController", function () { 
  it("Should return the correct floatRate and porterPool", async function () { 
    [addr1, addr2, addr3, addr4, ...addrs] = await ethers.getSigners();
    const CrossController = await ethers.getContractFactory("CrossController");
    const PorterPoolFactory = await ethers.getContractFactory("PorterPoolFactory");
    const PorterPool = await ethers.getContractFactory("PorterPool");
  
    const CC = await CrossController.deploy();
    await CC.deployed();
    await CC.initialize(addr1.address);
    console.log("CrossControllerAddr: ", CC.address);

    const PF = await PorterPoolFactory.deploy(CC.address);
    await PF.deployed();
  
    await CC.setPorterFactory(PF.address);
    console.log("PF: ", PF.address);

    expect(await CC.porterFactory()).to.equal(PF.address); 
    await CC.setFloatFee(2);
    expect(await CC.floatFee()).to.equal(2); 

    await PF.createPorterPool("0x");
    var porterPoolAddr = await PF.porterPools(addr1.address);
    console.log("porterPoolAddr: ", porterPoolAddr);

    var porterPool = await PorterPool.attach(porterPoolAddr);
    await porterPool.setFixedFee(10000);
    expect(await porterPool.fixedFee()).to.equal(10000); 
  }); 
}); 