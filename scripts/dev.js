const hre = require("hardhat");
const { ethers } = require("hardhat");

const WHALE_ADDRESS = "0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43"

async function main() {
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [WHALE_ADDRESS],
    });
    const impersonatedSigner = await ethers.provider.getSigner(WHALE_ADDRESS);
    const b = await ethers.provider.getBalance("0x2ea1b03143De6dA1Cb6a1b6C3fDD83167A2c5653");
    const balance = ethers.utils.formatEther(b)
    console.log('balance: ', balance);

    const network = await ethers.provider.getNetwork();
    const chainId = network.chainId;
    console.log("Chain ID:", chainId);

    const TrustVoteV1 = await ethers.getContractAt("TrustVoteV1", '0x2Ecdd5008b8f85aa2c9796687308F25511878eF7'); // Replace "CONTRACT_ADDRESS_HERE" with the actual contract address

    const pollIds = await TrustVoteV1.getAllPollIds();
    console.log("Poll IDs:", pollIds);
}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});

