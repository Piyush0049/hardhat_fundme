const { deployments, getNamedAccounts, ethers } = require("hardhat");
const { assert, expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", function () {
      console.log("Unit testing...");
      let fundMe, mockV3Aggregator;
      let sendValue = ethers.parseEther("1");
      let deployer;
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        const fundMeDeployment = await deployments.get("FundMe");
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address);
        const aggregatorDeployment = await deployments.get("MockV3Aggregator");
        mockV3Aggregator = await ethers.getContractAt(
          "MockV3Aggregator",
          aggregatorDeployment.address
        );
      });
      describe("constructor", function () {
        it("sets the aggregator address correctly", async function () {
          const response = await fundMe.s_pricefeed();
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
          const response = await fundMe.s_addressToAmountFunded(deployer);
          assert.equal(response.toString(), sendValue.toString());
        });
        it("Adds funder to funder's array list", async function () {
          await fundMe.fund({ value: sendValue });
          const funder = await fundMe.s_funders(0);
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
          const response = await fundMe.withdraw();
          const reciept = await response.wait(1);
          const newFundMeBalance = await ethers.provider.getBalance(
            fundmeaddress
          );
          const newDeployerBalance = await ethers.provider.getBalance(deployer);
          assert.equal(newFundMeBalance.toString(), "0");
          assert.equal(
            newDeployerBalance + reciept.fee,
            deployerBalance + fundMeBalance
          );
        });
        it("allows us to withdraw from multiple accounts", async function () {
          const accounts = await ethers.getSigners();
          for (let i = 0; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i]);
            await fundMeConnectedContract.fund({ value: sendValue });
          }
          const fundmeaddress = (await deployments.get("FundMe")).address;
          const collectedFund = await ethers.provider.getBalance(fundmeaddress);
          const deployerFund = await ethers.provider.getBalance(deployer);
          const response = await fundMe.withdraw();
          const reciept = await response.wait(1);
          const newcollectedFund = await ethers.provider.getBalance(
            fundmeaddress
          );
          const newdeployerFund = await ethers.provider.getBalance(deployer);
          assert.equal(newcollectedFund, 0);
          assert.equal(
            (newdeployerFund + reciept.fee).toString(),
            (collectedFund + deployerFund).toString()
          );
        });
      });
    });
