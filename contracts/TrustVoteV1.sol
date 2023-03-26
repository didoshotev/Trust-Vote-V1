// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";


contract VotingSystem {
    // structure for each option in a poll
    struct Option {
        uint256 id;
        uint256 count;
        string name;
    }

    // structure for each poll
    struct Poll {
        uint256 id;
        address admin;
        string name;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        uint256[] optionIds;
        mapping(uint256 => Option) options;
        mapping(address => bool) voted;
    }

    mapping(uint256 => Poll) polls;
    uint256[] public pollIds;

    uint256 nextPollId = 0;

    event VoteSuccess(uint256 pollId, uint256 optionId, address voter);


    function createPoll(string memory name, uint256 startTime, uint256 endTime) public {
        require(startTime < endTime, "End time should be greater than start time.");

        polls[nextPollId].id = nextPollId;
        polls[nextPollId].admin = msg.sender;
        polls[nextPollId].name = name;
        polls[nextPollId].startTime = startTime;
        polls[nextPollId].endTime = endTime;

        pollIds.push(nextPollId);
        nextPollId++;
    }

    function addOption(uint256 pollId, string memory optionName) public {
        require(msg.sender == polls[pollId].admin, "Only poll admin can add options");

        uint optionId = polls[pollId].optionIds.length;
        polls[pollId].optionIds.push(optionId);
        polls[pollId].options[optionId] = Option({
            id: optionId,
            name: optionName,
            count: 0
        });
    }

    function vote(uint256 pollId, uint256 optionId) public { 
        require(block.timestamp >= polls[pollId].startTime, "The poll has not started yet");
        require(block.timestamp <= polls[pollId].endTime, "The poll has ended");
        require(!polls[pollId].voted[msg.sender], "You have already voted in this poll");
        require(optionId < polls[pollId].optionIds.length, "Invalid option ID");
        
        polls[pollId].options[optionId].count++;
        polls[pollId].voted[msg.sender] = true;

        emit VoteSuccess(pollId, optionId, msg.sender);
    }

    function getPollResult(uint256 pollId) public view returns (uint256[] memory counts, string[] memory optionNames) {
        uint256 optionCount = polls[pollId].optionIds.length;
        counts = new uint256[](optionCount);
        optionNames = new string[](optionCount);

        for (uint256 i = 0; i < optionCount; i++) {
            uint256 optionId = polls[pollId].optionIds[i];
            counts[i] = polls[pollId].options[optionId].count;
            optionNames[i] = polls[pollId].options[optionId].name;
        }
    }

    function getAllPollIds() public view returns (uint256[] memory) { 
        return pollIds;
    }
}