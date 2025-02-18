require("@nomicfoundation/hardhat-toolbox");
require('hardhat-deploy');
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */

if (!process.env.RPC_URL || !process.env.PRIVATE_KEY) {
  console.log(process.env.RPC_URL, process.env.PRIVATE_KEY)
  console.error("Missing environment variables. Check your .env file.");
  process.exit(1);
}

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
    },
    localhost: {
      url: "http://localhost:8545",
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  sourcify: {
    enabled: true
  },
  namedAccounts: {
    deployer: {
      default: 0
    },
  },
  gasReporter: {
    enabled: true,
    outputFile: "output.txt",
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    noColors: true
  },
  solidity: "0.8.28",
};