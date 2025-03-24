const { network, run } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");

const func = async ({ getNamedAccounts, deployments }) => {
  console.log("Deployment command: 1");
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const chainID = network.config.chainId;
  var ethUsdPriceAddress;
  if (chainID == 31337) {
    console.log("Localhost");
    const contract = await deployments.get("MockV3Aggregator");
    ethUsdPriceAddress = contract.address;
  } else {
    console.log("Not a Localhost");
    ethUsdPriceAddress = networkConfig[chainID]["ethUsdPriceFeed"];
  }
  log("Deploying the contract...");
  const fundme = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceAddress],
    log: true,
    waitConfirmation: network.config.blockConfirmation || 5,
  });
  console.log("Contract deployed!");
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    console.log(ethUsdPriceAddress);
    log("Verifying contract...");
    await run("verify:verify", {
      address: fundme.address,
      constructorArguments: [ethUsdPriceAddress],
    });
  }
  console.log("-------------------------------->")
};

module.exports = func;
module.exports.tags = ["all", "fundme"];
