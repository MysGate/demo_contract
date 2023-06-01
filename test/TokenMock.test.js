const { expect } = require("chai"); 
const { ethers, upgrades } = require("hardhat"); 

describe("TokenMock", function () { 
  it("Should return the correct name and symbol", async function () { 
    const supply = 10000000000000000000000000000n;
    const tokenMock = await ethers.getContractFactory("TokenMock"); 
    const mysUSDT = await upgrades.deployProxy(tokenMock, ["mysgate USDT", "mysUSDT", supply], { initializer: "initialize" }); 
    expect(await mysUSDT.name()).to.equal("mys USDT"); 
    expect(await mysUSDT.symbol()).to.equal("mysUSDT"); 
  }); 
}); 