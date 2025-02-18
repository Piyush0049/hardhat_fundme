const { network, run } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config")

const func = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    const chainID = network.config.chainId;
    var ethUsdPriceAddress;
    if (chainID == 31337) {
        console.log("abcde")
        const contract = await deployments.get("MockV3Aggregator");
        ethUsdPriceAddress = contract.address;
    } else {
        console.log("abcde12345")
        ethUsdPriceAddress = networkConfig[chainID]["ethUsdPriceFeed"];
    }
    log("Deploying the contract...");
    console.log(ethUsdPriceAddress)
    const fundme = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceAddress],
        log: true,
        waitConfirmation: network.config.blockConfirmation || 1
    })
    console.log("Contract deployed!");
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log(ethUsdPriceAddress)
        log("Verifying contract...");
        await run("verify:verify", {
            address: fundme.address,
            constructorArguments: [ethUsdPriceAddress],
        });
    }
}

module.exports = func;
module.exports.tags = ["all", "fundme"];

