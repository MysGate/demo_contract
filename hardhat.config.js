require("@nomicfoundation/hardhat-toolbox");
require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-solc");
require("@matterlabs/hardhat-zksync-verify");

require("dotenv").config({
  path: require("path").join(__dirname, ".env"),
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  zksolc: {
    version: "1.3.10",
    compilerSource: "binary",
    settings: {},
  },
  defaultNetwork: "zkSyncTestnet",
  solidity: {
    version: "0.8.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    scrolltest: {
      url: process.env.SCROLLTEST_PROVIDER,
      accounts: [process.env.SCROLLTEST_DEPLOYER],
    },
    arbtest: {
      url: process.env.ARBTEST_PROVIDER,
      accounts: [process.env.ARBTEST_DEPLOYER],
    },
    optest: {
      url: process.env.OPTEST_PROVIDER,
      accounts: [process.env.OPTEST_DEPLOYER],
    },
    zkSyncTestnet: {
      url: "https://testnet.era.zksync.dev",
      // ethNetwork: "https://goerli.blockpi.network/v1/rpc/public",
      ethNetwork: "goerli",
      zksync: true,
      verifyURL: 'https://zksync2-testnet-explorer.zksync.dev/contract_verification'
    }
  },
};
