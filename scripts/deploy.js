// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const [deployer] = await ethers.getSigners();

  const CrossController = await hre.ethers.getContractFactory("CrossController");
  const PorterPoolFactory = await hre.ethers.getContractFactory("PorterPoolFactory");
  const PorterPool = await hre.ethers.getContractFactory("PorterPool");

  const CC = await CrossController.deploy();
  await CC.deployed();
  await CC.initialize(deployer.address);

  console.log("CC: ", CC.address);

  const PF = await PorterPoolFactory.deploy(CC.address);
  await PF.deployed();

  console.log("PF: ", PF.address);

  await PF.createPorterPool("0x");

  var porterPoolAddr = await PF.porterPools(deployer.address);
  console.log("porterPoolAddr: ", porterPoolAddr);

  var porterPool = await PorterPool.attach(porterPoolAddr);
  await porterPool.setFixedFee("25000");
  await porterPool.setFloatFee("2"); //0.0002
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
