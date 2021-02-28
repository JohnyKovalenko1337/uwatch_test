const Votes = require("../models/votes");

exports.getVotesByMatch = async (matchId) => {
  try {
    const votes = await Votes.findOne({ matchId });
    if (!votes) {
      return 0;
    }
    return votes;
  } catch (err) {
    console.log(err);
    throw new Error("server error:", err);
  }
};

exports.makeVote = async (matchId, voteTeam, opponent, player, tgName) => {
  try {
    const existVote = await Votes.findOne({ matchId });
    if (existVote) {
      if (existVote.tgNames.indexOf(tgName) > -1) {
        return "You have already voted for this match";
      }
      if (existVote.opponent == voteTeam) {
        existVote.opponentVotes++;
      } else {
        existVote.playerVotes++;
      }
      existVote.tgNames.push(tgName);
      await existVote.save();
      return "Your vote has been saved";
    }
    const newVote = new Votes({ matchId, opponent, player });

    if (newVote.opponent == voteTeam) {
      newVote.opponentVotes = 1;
    } else {
      newVote.playerVotes = 1;
    }
    newVote.tgNames.push(tgName);

    await newVote.save();
    return "Your vote has been saved";
  } catch (err) {
    console.log(err);
    throw new Error("server error:", err);
  }
};
