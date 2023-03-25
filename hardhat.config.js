// require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


task('blockTimestamp', 'Prints the block timestamp', async (_, { ethers }) => {
  const currentBlock = await ethers.provider.getBlockNumber();
  const blockTimestamp = (await ethers.provider.getBlock(currentBlock)).timestamp;

  const oneWeekInSeconds = 60 * 60 * 24 * 7;
  const futureTimestamp = blockTimestamp + oneWeekInSeconds;

  console.log('current timestamp: ', blockTimestamp);
  console.log('after 1 week: ', futureTimestamp);
  const date = new Date(blockTimestamp * 1000); // Date requires ms, whereas block.timestamp is in s
  const dateAfterWeek = new Date(futureTimestamp * 1000); // Date requires ms, whereas block.timestamp is in s
  console.log('current date: ', date.toLocaleDateString())
  console.log('after 1 week: ', dateAfterWeek.toLocaleDateString())
});