const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const TrustVoteV1 = await ethers.getContractFactory("TrustVoteV1");
  // const trustVoteV1 = await TrustVoteV1.deploy();
  const trustVote = await upgrades.deployProxy(TrustVoteV1);
  await trustVote.deployed();

  console.log("TrustVoteV1 deployed to:", trustVote.address);
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});

