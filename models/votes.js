const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const votesSchema = new Schema({
  matchId: {
    type: String,
    required: true,
  },
  opponent: {
    type: String,
    required: true,
  },
  player: {
    type: String,
    required: true,
  },
  opponentVotes: {
    type: Number,
    default: 0,
  },
  playerVotes: {
    type: Number,
    default: 0,
  },
  tgNames: [String],
});

module.exports = mongoose.model("votes", votesSchema);
