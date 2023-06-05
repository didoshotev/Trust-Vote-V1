const fs = require("fs");
const { ethers, artifacts } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const TrustVoteV1 = await ethers.getContractFactory("TrustVoteV1");
  const trustVoteV1 = await TrustVoteV1.deploy();
  await trustVoteV1.deployed();

  console.log("TrustVoteV1 deployed to:", trustVoteV1.address);

  const deploymentPath = "../frontend/src/utils/TrustVoteDeployment.json";
  const contractArtifact = await artifacts.readArtifact("TrustVoteV1");
  const contractABI = contractArtifact.abi;
  const updatedABI = JSON.stringify(contractABI, null, 4);

  const TrustVoteV1Deployment = await ethers.getContractAt("TrustVoteV1", trustVoteV1.address); // Replace "CONTRACT_ADDRESS_HERE" with the actual contract address
  const pollIds = await TrustVoteV1Deployment.getAllPollIds();
  console.log("Poll IDs:", pollIds);

  const contractInfo = {
    address: trustVoteV1.address,
    abi: contractABI,
  };

  fs.writeFileSync(deploymentPath, JSON.stringify(contractInfo, null, 4));

  console.log("Updated ABI file:", deploymentPath);
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});

