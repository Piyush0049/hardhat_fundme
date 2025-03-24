const { deployments, getNamedAccounts, ethers, network } = require("hardhat");
const { assert, expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("Fundme", async function () {
      this.timeout(100000);
      console.log("Staging testing...");
      let fundme;
      let deployer;
      const ethvalue = ethers.parseEther("0.024");
      beforeEach(async function () {
        const fundMeDeployment = await deployments.get("FundMe");
        deployer = (await getNamedAccounts()).deployer;
        fundme = await ethers.getContractAt("FundMe", fundMeDeployment.address);
      });
      it("Allows people to fund and withdraw", async function () {
        // const response1 = await fundme.fund({ value: ethvalue });
        // console.log("Fund Done");
        const response2 = await fundme.withdraw();
        const address = (await deployments.get("FundMe")).address;
        const endingfundmebalance = await ethers.provider.getBalance(address);
        console.log(endingfundmebalance);
        assert.equal(endingfundmebalance.toString(), "0");
      });
    });
