const { Telegraf } = require("telegraf");
const db = require("./utils/db/connect");
const { matches } = require("./utils/matches");
const { getVotesByMatch, makeVote } = require("./controllers/votes");

const dotenv = require("dotenv");
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("Welcome ");
  ctx.reply("Available commands /matches /help");
});

bot.help((ctx) => {
  ctx.reply("Available commands /matches /help");
});

bot.command("matches", async (ctx) => {
  const fetchedMatches = await matches()
  const fiveMatches = fetchedMatches.items.slice(0,5);
  fiveMatches.forEach((el) => {
    ctx.telegram.sendMessage(
      ctx.chat.id,
      `<b>Tournament ${el.tournamentName}</b> \n` +
        `<b>${el.opponent.name}</b>  - ` +
        `<b>${el.player.name}</b> \n` +
        `           <b>${
          el.status === "future"
            ? new Date(el.startedAt).toLocaleString()
            : "LIVE!"
        }</b> \n` +
        `Vote for the winner`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: el.opponent.name,
                callback_data: `${el.id}, ${el.opponent.name}, ${el.opponent.name}, ${el.player.name}`,
              },
            ],
            [
              {
                text: el.player.name,
                callback_data: `${el.id}, ${el.player.name}, ${el.opponent.name}, ${el.player.name}`,
              },
            ],
            [
              {
                text: "Check Votes",
                callback_data: `${el.id},`,
              },
            ],
          ],
        },
        parse_mode: "HTML",
      }
    );
  });
});

bot.on("callback_query", async (ctx) => {

  //getting info from callback_data
  const matchId = ctx.callbackQuery.data.split(",")[0];
  const team = ctx.callbackQuery.data.split(",")[1];
  const opponent = ctx.callbackQuery.data.split(",")[2];
  const player = ctx.callbackQuery.data.split(",")[3];

  // if we dont have team for voting that means, that we want to check votes
  if (!team) {
    const votes = await getVotesByMatch(matchId);
    if (!votes) {
      ctx.reply("No votes for this match");
    } else {
      ctx.telegram.sendMessage(
        ctx.chat.id,
        `Votes for ${votes.opponent} - <b>${votes.opponentVotes}</b> \n` +
          `Votes for ${votes.player} - <b>${votes.playerVotes}</b>   `,
        {
          parse_mode: "HTML",
        }
      );
    }
  } else {
    const result = await makeVote(
      matchId,
      team,
      opponent,
      player,
      ctx.from.username
    );
    ctx.reply(result);
  }
});

bot.launch();

db();
console.log("success");
