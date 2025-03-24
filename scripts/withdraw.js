const { ethers, deployments } = require("hardhat");

async function main() {
  const fundMeDeployment = await deployments.get("FundMe");
  const fundme = await ethers.getContractAt("FundMe", fundMeDeployment.address);
  const withdrawReciept = await fundme.withdraw();
  await withdrawReciept.wait(1);
  console.log(withdrawReciept);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
  });
