async function main() { 
    const TrustVoteV1 = await hre.ethers.getContractFactory("TrustVoteV1");
    const trustVoteV1 = await TrustVoteV1.deploy();

    await trustVoteV1.deployed();

    console.log(`successfully deployed to ${trustVoteV1.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });