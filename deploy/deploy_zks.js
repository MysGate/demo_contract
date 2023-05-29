const Wallet = require("zksync-web3").Wallet;
const Deployer = require("@matterlabs/hardhat-zksync-deploy").Deployer;
const hre = require("hardhat");
require("dotenv").config({
    path: "../.env",
});

async function deploy() {
    const wallet = new Wallet(process.env.ZKSTEST_DEPLOYER);
    const deployer = new Deployer(hre, wallet);

    const CrossController = await deployer.loadArtifact("CrossController");
    const PorterPoolFactory = await deployer.loadArtifact("PorterPoolFactory");
    const PorterPool = await deployer.loadArtifact("PorterPool");

    const CC = await deployer.deploy(CrossController);
    await CC.deployed();
    await CC.initialize(wallet.address);

    console.log("CC: ", CC.address);

    const PF = await deployer.deploy(PorterPoolFactory, [CC.address]);
    await PF.deployed();

    console.log("PF: ", PF.address);

    // await PF.createPorterPool("0x");

    // var porterPoolAddr = await PF.porterPools(wallet.address);
    // console.log("porterPoolAddr: ", porterPoolAddr);

    // var porterPool = await PorterPool.attach(porterPoolAddr);
    // await porterPool.setFixedFee("25000");
    // await porterPool.setFloatFee("2"); //0.0002
}


module.exports = deploy;