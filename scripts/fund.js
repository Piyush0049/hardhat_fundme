const { ethers, deployments } = require("hardhat");

async function main() {
  const fundMeDeployment = await deployments.get("FundMe");
  const fundme = await ethers.getContractAt("FundMe", fundMeDeployment.address);
  const reciept = await fundme.fund({ value: ethers.parseEther("0.1") });
  await reciept.wait(1);
  console.log(reciept);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
  });
