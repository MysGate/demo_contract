// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const cls = require("circomlibjs");

async function main() {
  const [deployer] = await ethers.getSigners();
  const CrossController = await hre.ethers.getContractFactory("CrossController");
  const PorterPoolFactory = await hre.ethers.getContractFactory("PorterPoolFactory");
  const PorterPool = await hre.ethers.getContractFactory("PorterPool");

  const CC = await CrossController.deploy();
  await CC.deployed();
  await CC.initialize(deployer.address);
  console.log("CrossController Addr: ", CC.address);

  const PF = await PorterPoolFactory.deploy(CC.address);
  await PF.deployed();

  await CC.setPorterFactory(PF.address);
  console.log("proter factory Addr: ", PF.address);
  await CC.setFloatFee(2);

  await PF.createPorterPool("0x");
  var porterPoolAddr = await PF.porterPools(deployer.address);
  console.log("porterPool Addr: ", porterPoolAddr);

  // zk 
  var porterPool = await PorterPool.attach(porterPoolAddr);
  await porterPool.setFixedFee(10000);
  
  poseidonHash = await cls.buildPoseidonReference();
  const C6 = new hre.ethers.ContractFactory(
    cls.poseidonContract.generateABI(2),
    cls.poseidonContract.createCode(2),
    deployer
  );
  poseidonContract = await C6.deploy();
  console.log("poseidon Address:", poseidonContract.address)

  var zkf = await ethers.getContractFactory("Bridge");
  let zk = await zkf.deploy(poseidonContract.address, CC.address);
  await zk.deployed()
  console.log("Bridge Addr: ", zk.address);

  await CC.setZkVerifier(zk.address);
  await CC.enableZkVerifier(true);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
