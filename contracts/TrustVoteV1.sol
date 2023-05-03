// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";

contract TrustVoteV1 {
    struct Option {
        uint256 id;
        uint256 count;
        string name;
    }

    struct Poll {
        uint256 id;
        address admin;
        string name;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        uint256[] optionIds;
        mapping(uint256 => Option) options;
        mapping(address => bool) votes;
    }

    mapping(uint256 => Poll) polls;
    uint256[] public pollIds;

    uint256 nextPollId = 0;

    event PollCreated(uint256 pollId, uint256 startTime, uint256 endTime);
    event VoteSuccess(uint256 pollId, uint256 optionId, address voter);

    modifier onlyBeforeStart(uint256 pollId) {
        require(
            block.timestamp < polls[pollId].startTime,
            "This action can only be performed before the start time."
        );
        _;
    }

    modifier onlyBeforeEnd(uint256 pollId) {
        require(
            block.timestamp < polls[pollId].endTime,
            "This action can only be performed before the end time."
        );
        _;
    }

    modifier onlyPollAdmin(uint256 pollId) {
        require(
            msg.sender == polls[pollId].admin,
            "Only poll admin can perform this action"
        );
        _;
    }

    function createPoll(
        string memory name,
        uint256 startTime,
        uint256 endTime
    ) public {
        require(
            startTime < endTime,
            "End time should be greater than start time."
        );

        polls[nextPollId].id = nextPollId;
        polls[nextPollId].admin = msg.sender;
        polls[nextPollId].name = name;
        polls[nextPollId].startTime = startTime;
        polls[nextPollId].endTime = endTime;

        pollIds.push(nextPollId);
        emit PollCreated(nextPollId, startTime, endTime);
        nextPollId++;
    }

    function addOption(
        uint256 pollId,
        string memory optionName
    ) public onlyPollAdmin(pollId) onlyBeforeEnd(pollId) {
        require(
            msg.sender == polls[pollId].admin,
            "Only poll admin can add options"
        );
        require(
            polls[pollId].id == pollId,
            "Poll with the given ID does not exist"
        );

        uint optionId = polls[pollId].optionIds.length;
        polls[pollId].optionIds.push(optionId);
        polls[pollId].options[optionId] = Option({
            id: optionId,
            name: optionName,
            count: 0
        });
    }

    function vote(uint256 pollId, uint256 optionId) public {
        require(
            block.timestamp >= polls[pollId].startTime,
            "The poll has not started yet"
        );
        require(block.timestamp <= polls[pollId].endTime, "The poll has ended");
        require(
            !polls[pollId].votes[msg.sender],
            "You have already votes in this poll"
        );
        require(optionId < polls[pollId].optionIds.length, "Invalid option ID");
        require(
            polls[pollId].id == pollId,
            "Poll with the given ID does not exist"
        );

        polls[pollId].options[optionId].count++;
        polls[pollId].votes[msg.sender] = true;

        emit VoteSuccess(pollId, optionId, msg.sender);
    }

    function getPollResult(
        uint256 pollId
    )
        public
        view
        returns (uint256[] memory counts, string[] memory optionNames)
    {
        require(
            polls[pollId].id == pollId,
            "Poll with the given ID does not exist"
        );

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

    function getPollDetails(
        uint256 pollId
    ) public view returns (uint256[] memory, uint256[] memory, string memory name, uint256 startTime, uint256 endTime, bool isActive, address admin) {
        Poll storage poll = polls[pollId];

        uint256[] memory optionIds = new uint256[](poll.optionIds.length);
        uint256[] memory voteCounts = new uint256[](poll.optionIds.length);

        for (uint256 i = 0; i < poll.optionIds.length; i++) {
            Option storage option = poll.options[poll.optionIds[i]];
            optionIds[i] = option.id;
            voteCounts[i] = option.count;
        }

        return (optionIds, voteCounts, poll.name, poll.startTime, poll.endTime, poll.isActive, poll.admin);
    }
}
