require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers")

const { blocktimestamp, accounts } = require('./tasks/tasks');


module.exports = {
  defaultNetwork: "hardhat",
  solidity: "0.8.18",
  tasks: {
    blocktimestamp,
    accounts
  },
};