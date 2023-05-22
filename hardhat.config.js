require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers")
require('dotenv').config()

const { blocktimestamp, accounts } = require('./tasks/tasks');


module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      forking: {
        url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
        blockNumber: 17316577
      }
    }
  },
  
  tasks: {
    blocktimestamp,
    accounts
  },
};