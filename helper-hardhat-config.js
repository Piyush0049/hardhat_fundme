const networkConfig = {
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
        blockConfirmation: 6
    }
};

const developmentChains = ["localhost", "hardhat"];
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000

module.exports = {
    networkConfig,
    developmentChains,
    INITIAL_ANSWER,
    DECIMALS
}