import { ethers } from "hardhat";

async function main() {
  const [owner, account2] = await ethers.getSigners();
  const MUETToken = await ethers.getContractFactory("Payment");
  const muetToken = await MUETToken.deploy(ethers.utils.parseEther("1000000"));
  await muetToken.deployed();

  console.log("Deployed MUETToken with address:", muetToken.address);

  const totalSupply = await muetToken.totalSupply();
  console.log("Total supply:", totalSupply);
}
 
main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
