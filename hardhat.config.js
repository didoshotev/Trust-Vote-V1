require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers")
require('dotenv').config()

const { blocktimestamp, accounts } = require('./tasks/tasks');


const users = [
  { 
    privateKey: process.env.DEPLOYER_PK,
    balance: "100000000000000000000000"
  },
  { 
    privateKey: process.env.DEV_1_PK,
    balance: "500000000000000000000000"
  },
]

module.exports = {
  defaultNetwork: "localhost",
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
        enabled: false,
        url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
        // blockNumber: 17316577,
      },
      accounts: users
    },
  },
  
  tasks: {
    blocktimestamp,
    accounts
  },
};