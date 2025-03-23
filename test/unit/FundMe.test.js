const { deployments, getNamedAccounts, ethers } = require("hardhat");
const { assert, expect } = require("chai");

describe("FundMe", function () {
  let fundMe, mockV3Aggregator;
  let sendValue = ethers.parseEther("1");
  let deployer;
  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    const fundMeDeployment = await deployments.get("FundMe");
    console.log("fundMeDeployment : ", fundMeDeployment)
    fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address);
    console.log("fundMe : ", fundMe)
    const aggregatorDeployment = await deployments.get("MockV3Aggregator");
    mockV3Aggregator = await ethers.getContractAt(
      "MockV3Aggregator",
      aggregatorDeployment.address
    );
  });
  describe("constructor", function () {
    it("sets the aggregator address correctly", async function () {
      const response = await fundMe.pricefeed();
      const add = await mockV3Aggregator.getAddress();
      assert.equal(response, add);
    });
  });
  describe("fund", function () {
    it("fails if you do not send enough ether", async function () {
      await expect(fundMe.fund()).to.be.revertedWith(
        "You need to spend more ETH!"
      );
    });
    it("Updated the amount funded data structure", async function () {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.addressToAmountFunded(deployer);
      assert.equal(response.toString(), sendValue.toString());
    });
    it("Adds funder to funder's array list", async function () {
      await fundMe.fund({ value: sendValue });
      const funder = await fundMe.funders(0);
      assert.equal(funder, deployer);
    });
  });
  describe("Withdraw", function name() {
    beforeEach(async () => {
      await fundMe.fund({ value: sendValue });
    });
    it("Withdraw ETH from a single account", async function () {
      const fundmeaddress = (await deployments.get("FundMe")).address;
      const fundMeBalance = await ethers.provider.getBalance(fundmeaddress);
      const deployerBalance = await ethers.provider.getBalance(deployer);
      console.log(fundMeBalance, " ", deployerBalance);
      const response = await fundMe.withdraw();
      const reciept = await response.wait(1);

      console.log("Reciept : ", reciept);
      const newFundMeBalance = await ethers.provider.getBalance(fundmeaddress);
      const newDeployerBalance = await ethers.provider.getBalance(deployer);
      console.log(newFundMeBalance, " ", newDeployerBalance);
      assert.equal(newFundMeBalance.toString(), "0");
      assert.equal(newDeployerBalance + reciept.fee, deployerBalance + fundMeBalance);
    });
  });
});
