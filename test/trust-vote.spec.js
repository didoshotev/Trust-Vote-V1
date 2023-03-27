const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TrustVoteV1", function () {
  let trustVote;
  let admin;
  let option1;
  let option2;
  let startTime;
  let endTime;

  beforeEach(async function () {
    const TrustVoteV1 = await ethers.getContractFactory("TrustVoteV1");
    trustVote = await TrustVoteV1.deploy();
    await trustVote.deployed();

    [admin] = await ethers.getSigners();
    option1 = "Option 1";
    option2 = "Option 2";
    startTime = Math.floor(Date.now() / 1000) + 3600;
    endTime = Math.floor(Date.now() / 1000) + 7200;
  });
  it("should create a new poll", async function () {
    await trustVote.createPoll("Test Poll", startTime, endTime);
    const pollDetails = await trustVote.getPollDetails(0);
    expect(pollDetails.name).to.equal("Test Poll");
    expect(pollDetails.startTime.toNumber()).to.equal(startTime);
    expect(pollDetails.endTime.toNumber()).to.equal(endTime);
  });

  it("should add an option to a poll", async function () {
    await trustVote.createPoll("Test Poll", startTime, endTime);
    await trustVote.addOption(0, option1);
    const [counts, optionNames] = await trustVote.getPollResult(0);
    expect(counts.length).to.equal(1);
    expect(optionNames.length).to.equal(1);
    expect(optionNames[0]).to.equal(option1);
    expect(counts[0].toNumber()).to.equal(0);  
    });

  it("should not add an option after poll end time", async function () {
    await trustVote.createPoll("Test Poll", startTime, endTime);
    await ethers.provider.send("evm_increaseTime", [endTime - Math.floor(Date.now() / 1000) + 1]);
    await ethers.provider.send("evm_mine", []);
    await expect(trustVote.addOption(0, option1)).to.be.revertedWith("This action can only be performed before the end time.");
  });

})
