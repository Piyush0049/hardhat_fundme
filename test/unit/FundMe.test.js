const { deployments, getNamedAccounts, ethers } = require("hardhat");
const { assert } = require("chai");

describe("FundMe", function () {
  let fundMe, mockV3Aggregator;
//   let deployer;
  beforeEach(async function () {
    // deployer = (await getNamedAccounts()).deployer;
    // console.log("deployer : ", deployer)
    // const deployerSigner = await ethers.getSigner(deployer);
    // console.log("deployerSigner : ", deployerSigner)
    await deployments.fixture(["all"]);
    const fundMeDeployment = await deployments.get("FundMe");
    fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address);
    const aggregatorDeployment = await deployments.get("MockV3Aggregator");
    mockV3Aggregator = await ethers.getContractAt("MockV3Aggregator", aggregatorDeployment.address);
  });
  describe("constructor", function () {
    it("sets the aggregator address correctly", async function () {
      const response = await fundMe.pricefeed();
      const add = await mockV3Aggregator.getAddress()
      assert.equal(response, add);
    });
  });
});
