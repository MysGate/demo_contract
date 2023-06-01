// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const supply = 10000000000000000000000000000n;
  const tokenMock = await ethers.getContractFactory("TokenMock"); 
  const mysUSDT = await upgrades.deployProxy(tokenMock, ["mys USDT", "mysUSDT", supply], { initializer: "initialize" }); 
  await mysUSDT.deployed(); 
  console.log("mysUSDT deployed to:", mysUSDT.address); 
  console.log("mysUSDT name:", mysUSDT.name());
  console.log("mysUSDT symbol:", mysUSDT.symbol());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
