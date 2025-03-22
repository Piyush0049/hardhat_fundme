const { network } = require("hardhat");
const { developmentChains, DECIMALS, INITIAL_ANSWER } = require("../helper-hardhat-config");

const func = async ({ getNamedAccounts, deployments }) => {
    console.log("Deployment command: 0");
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
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
    console.log("-------------------------------->")
};

module.exports = func;
module.exports.tags = ["all", "mocks"];