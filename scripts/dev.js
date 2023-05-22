const hre = require("hardhat");
const { ethers } = require("hardhat");

const WHALE_ADDRESS = "0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43"

async function main() {
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [WHALE_ADDRESS],
    });
    const impersonatedSigner = await ethers.provider.getSigner(WHALE_ADDRESS);
}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});

