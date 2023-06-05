const { ethers } = require("hardhat");

const pollData = [
  {
    name: "Poll 1",
    description: "This is the description for Poll 1.",
    startTime: 1665927600, // Example: January 15, 2023, 00:00:00 (UTC)
    endTime: 1666017600, // Example: January 16, 2023, 00:00:00 (UTC)
    options: ["Option 1", "Option 2", "Option 3"],
  },
  {
    name: "Poll 2",
    description: "This is the description for Poll 2.",
    startTime: 1666014000, // Example: January 16, 2023, 00:00:00 (UTC)
    endTime: 1666104000, // Example: January 17, 2023, 00:00:00 (UTC)
    options: ["Option A", "Option B", "Option C"],
  },
  {
    name: "Poll 3",
    description: "This is the description for Poll 3.",
    startTime: 1666100400, // Example: January 17, 2023, 00:00:00 (UTC)
    endTime: 1666190400, // Example: January 18, 2023, 00:00:00 (UTC)
    options: ["Option X", "Option Y", "Option Z"],
  },
];

async function main() {
  const TrustVoteV1 = await ethers.getContractAt(
    "TrustVoteV1",
    "0x2Ecdd5008b8f85aa2c9796687308F25511878eF7"
  );

  for (const poll of pollData) {
    const { name, description, startTime, endTime, options } = poll;

    await TrustVoteV1.createPoll(name, description, startTime, endTime);

    const pollIds = await TrustVoteV1.getAllPollIds();
    const pollId = pollIds[pollIds.length - 1];
    console.log("Created Poll ID:", pollId);

    for (const optionName of options) {
      await TrustVoteV1.addOption(pollId, optionName);
      console.log(`Added option "${optionName}" to Poll ID ${pollId}`);
    }
  }

  const allPollIds = await TrustVoteV1.getAllPollIds();
  console.log("All Poll IDs:", allPollIds);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
