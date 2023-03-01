"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var recalculateRankings_exports = {};
module.exports = __toCommonJS(recalculateRankings_exports);
var import_config = __toESM(require("../config"));
var import__ = __toESM(require("."));
var import_services = __toESM(require("../services"));
let mongo, container;
function binarySearchUsers(users, id) {
  let start = 0;
  let end = users.length - 1;
  while (start <= end) {
    let middle = Math.floor((start + end) / 2);
    let user = users[middle];
    if (user._id.toString() === id.toString()) {
      return user;
    } else if (user._id.toString() < id.toString()) {
      start = middle + 1;
    } else {
      end = middle - 1;
    }
  }
  return users.find((s) => s._id.toString() === id.toString());
}
async function startup() {
  mongo = await (0, import__.default)(import_config.default, {
    syncIndexes: true,
    poolSize: 1
  });
  container = (0, import_services.default)(import_config.default, null);
  console.log("Recalculating all player ranks...");
  console.log(`Resetting users...`);
  await container.userService.userRepo.updateMany({}, {
    $set: {
      "achievements.level": 1,
      "achievements.rank": 0,
      "achievements.eloRating": null,
      "achievements.victories": 0,
      "achievements.victories1v1": 0,
      "achievements.completed": 0,
      "achievements.quit": 0,
      "achievements.afk": 0,
      "achievements.defeated": 0,
      "achievements.defeated1v1": 0,
      "achievements.joined": 0,
      "achievements.badges.victor32": 0,
      "achievements.badges.special_dark": 0,
      "achievements.badges.special_fog": 0,
      "achievements.badges.special_ultraDark": 0,
      "achievements.badges.special_orbital": 0,
      "achievements.badges.special_battleRoyale": 0,
      "achievements.badges.special_homeStar": 0,
      "achievements.badges.special_homeStarElimination": 0,
      "achievements.badges.special_anonymous": 0,
      "achievements.badges.special_kingOfTheHill": 0,
      "achievements.badges.special_tinyGalaxy": 0,
      "achievements.badges.special_freeForAll": 0,
      "achievements.badges.special_arcade": 0
    }
  });
  console.log(`Done.`);
  let users = await container.userService.userRepo.find(
    {},
    {
      _id: 1,
      achievements: 1
    },
    { _id: 1 }
  );
  console.log(`Total users: ${users.length}`);
  let dbQuery = {
    "state.endDate": { $ne: null },
    "settings.general.type": { $ne: "tutorial" }
  };
  let total = await container.gameService.gameRepo.count(dbQuery);
  console.log(`Recalculating rank for ${total} games...`);
  let page = 0;
  let pageSize = 10;
  let totalPages = Math.ceil(total / pageSize);
  const incAchievement = (userId, key) => {
    let u = binarySearchUsers(users, userId);
    if (u) {
      u.achievements[key]++;
    }
  };
  do {
    let games = await container.gameService.gameRepo.find(
      dbQuery,
      {},
      { _id: 1 },
      pageSize,
      pageSize * page
    );
    for (let game of games) {
      let playerUserIds = game.galaxy.players.filter((p) => p.userId).map((p) => p.userId.toString());
      let quitterUserIds = game.quitters.filter((q) => q != null).map((q) => q.toString());
      let afkerUserIds = [...new Set(game.afkers.filter((a) => a != null).map((a) => a.toString()).concat(game.galaxy.players.filter((p) => p.userId && p.afk).map((p) => p.userId.toString())))];
      let defeatedUserIds = game.galaxy.players.filter((p) => p.userId && p.defeated && !p.afk).map((p) => p.userId.toString());
      let completedUserIds = game.galaxy.players.filter((p) => p.userId && !p.defeated && !p.afk).map((p) => p.userId.toString());
      let joinerUserIds = [...new Set(playerUserIds.concat(quitterUserIds).concat(afkerUserIds))];
      joinerUserIds.forEach((j) => incAchievement(j, "joined"));
      quitterUserIds.forEach((q) => incAchievement(q, "quit"));
      afkerUserIds.forEach((a) => incAchievement(a, "afk"));
      completedUserIds.forEach((c) => incAchievement(c, "completed"));
      defeatedUserIds.forEach((d) => incAchievement(d, "defeated"));
      let leaderboard = container.leaderboardService.getGameLeaderboard(game).leaderboard;
      game.state.leaderboard = leaderboard.map((l) => l.player._id);
      container.gameTickService._awardEndGameRank(game, users, false);
    }
    let leaderboardWrites = games.map((game) => {
      return {
        updateOne: {
          filter: {
            _id: game._id
          },
          update: {
            "state.leaderboard": game.state.leaderboard
          }
        }
      };
    });
    await container.gameService.gameRepo.bulkWrite(leaderboardWrites);
    page++;
    console.log(`Page ${page}/${totalPages}`);
  } while (page <= totalPages);
  console.log(`Done.`);
  let dbWrites = users.map((user) => {
    return {
      updateOne: {
        filter: {
          _id: user._id
        },
        update: {
          "achievements.level": user.achievements.level,
          "achievements.rank": user.achievements.rank,
          "achievements.eloRating": user.achievements.eloRating,
          "achievements.victories": user.achievements.victories,
          "achievements.victories1v1": user.achievements.victories1v1,
          "achievements.completed": user.achievements.completed,
          "achievements.quit": user.achievements.quit,
          "achievements.afk": user.achievements.afk,
          "achievements.defeated": user.achievements.defeated,
          "achievements.defeated1v1": user.achievements.defeated1v1,
          "achievements.joined": user.achievements.joined,
          "achievements.badges.victor32": user.achievements.badges.victor32,
          "achievements.badges.special_dark": user.achievements.badges.special_dark,
          "achievements.badges.special_fog": user.achievements.badges.special_fog,
          "achievements.badges.special_ultraDark": user.achievements.badges.special_ultraDark,
          "achievements.badges.special_orbital": user.achievements.badges.special_orbital,
          "achievements.badges.special_battleRoyale": user.achievements.badges.special_battleRoyale,
          "achievements.badges.special_homeStar": user.achievements.badges.special_homeStar,
          "achievements.badges.special_homeStarElimination": user.achievements.badges.special_homeStarElimination,
          "achievements.badges.special_anonymous": user.achievements.badges.special_anonymous,
          "achievements.badges.special_kingOfTheHill": user.achievements.badges.special_kingOfTheHill,
          "achievements.badges.special_tinyGalaxy": user.achievements.badges.special_tinyGalaxy,
          "achievements.badges.special_freeForAll": user.achievements.badges.special_freeForAll,
          "achievements.badges.special_arcade": user.achievements.badges.special_arcade
        }
      }
    };
  });
  console.log(`Updating users...`);
  await container.userService.userRepo.bulkWrite(dbWrites);
  console.log(`Users updated.`);
}
process.on("SIGINT", async () => {
  await shutdown();
});
async function shutdown() {
  console.log("Shutting down...");
  await mongo.disconnect();
  console.log("Shutdown complete.");
  process.exit();
}
startup().then(async () => {
  console.log("Done.");
  await shutdown();
}).catch(async (err) => {
  console.error(err);
  await shutdown();
});
//# sourceMappingURL=recalculateRankings.js.map
