const { network } = require("hardhat");
const { networkConfig, developmentChains, DECIMALS, INITIAL_ANSWER } = require("../helper-hardhat-config");

const func = async ({ getNamedAccounts, deployments }) => {
    console.log("abcdef");
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    console.log(network)
    const chainID = network.config.chainId;
    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            log: true,
            from: deployer,
            args: [DECIMALS, INITIAL_ANSWER]
        });
        console.log("Mock deployed!");
    }
};

module.exports = func;
module.exports.tags = ["all", "mocks"];