"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var gameList_exports = {};
__export(gameList_exports, {
  default: () => GameListService
});
module.exports = __toCommonJS(gameList_exports);
const moment = require("moment");
class GameListService {
  constructor(gameRepo, gameService, conversationService, eventService, gameTypeService, leaderboardService) {
    this.gameRepo = gameRepo;
    this.gameService = gameService;
    this.conversationService = conversationService;
    this.eventService = eventService;
    this.gameTypeService = gameTypeService;
    this.leaderboardService = leaderboardService;
  }
  async listJoinableGames() {
    const games = await this.gameRepo.find({
      "state.startDate": { $eq: null },
      "settings.general.type": { $ne: "tutorial" }
    }, {
      "settings.general.type": 1,
      "settings.general.featured": 1,
      "settings.general.name": 1,
      "settings.general.playerLimit": 1,
      state: 1
    });
    const official = games.filter((g) => g.settings.general.type !== "custom");
    const custom = games.filter((g) => g.settings.general.type === "custom");
    return {
      official,
      custom
    };
  }
  async listOfficialGames() {
    return await this.gameRepo.find({
      "settings.general.type": { $nin: ["custom", "tutorial"] },
      "state.startDate": { $eq: null }
    }, {
      "settings.general.type": 1,
      "settings.general.featured": 1,
      "settings.general.name": 1,
      "settings.general.playerLimit": 1,
      state: 1
    });
  }
  async listCustomGames() {
    return await this.gameRepo.find({
      "settings.general.type": { $eq: "custom" },
      "state.startDate": { $eq: null }
    }, {
      "settings.general.type": 1,
      "settings.general.featured": 1,
      "settings.general.name": 1,
      "settings.general.playerLimit": 1,
      state: 1
    });
  }
  async listActiveGames(userId) {
    const games = await this.gameRepo.find({
      "state.endDate": { $eq: null },
      $or: [
        { "galaxy.players": { $elemMatch: { userId } } },
        { "afkers": { $in: [userId] } }
      ]
    }, {
      "settings.general.name": 1,
      "settings.general.type": 1,
      "settings.general.playerLimit": 1,
      "settings.gametime.speed": 1,
      "settings.gametime.gameType": 1,
      "settings.gameTime": 1,
      "settings.galaxy.productionTicks": 1,
      "galaxy.players._id": 1,
      "galaxy.players.userId": 1,
      "galaxy.players.ready": 1,
      "galaxy.players.defeated": 1,
      "galaxy.players.afk": 1,
      "conversations.participants": 1,
      "conversations.messages.readBy": 1,
      state: 1
    }, {
      "state.startDate": -1
    });
    return await Promise.all(games.map(async (game) => {
      game.userNotifications = await this.getUserPlayerNotifications(game, userId, true, true, true, false);
      delete game.conversations;
      delete game.galaxy;
      return game;
    }));
  }
  async listRecentlyCompletedGames(limit = 20) {
    return await this.gameRepo.find(
      {
        "state.endDate": { $ne: null },
        "settings.general.type": { $ne: "tutorial" }
      },
      {
        "settings.general.type": 1,
        "settings.general.featured": 1,
        "settings.general.name": 1,
        "settings.general.playerLimit": 1,
        state: 1
      },
      { "state.endDate": -1 },
      limit
    );
  }
  async listUserCompletedGames(userId) {
    const games = await this.gameRepo.find({
      "state.endDate": { $ne: null },
      "settings.general.type": { $ne: "tutorial" },
      $or: [
        { "galaxy.players": { $elemMatch: { userId } } },
        { "afkers": { $in: [userId] } }
      ]
    }, {
      "settings.general.name": 1,
      "settings.general.type": 1,
      "settings.general.playerLimit": 1,
      "settings.gametime.speed": 1,
      "settings.gametime.gameType": 1,
      "settings.gameTime": 1,
      "settings.galaxy.productionTicks": 1,
      "galaxy.players._id": 1,
      "galaxy.players.userId": 1,
      "galaxy.players.ready": 1,
      "galaxy.players.defeated": 1,
      "galaxy.players.afk": 1,
      "conversations.participants": 1,
      "conversations.messages.readBy": 1,
      state: 1
    }, {
      "state.endDate": -1
    });
    return await Promise.all(games.map(async (game) => {
      game.userNotifications = await this.getUserPlayerNotifications(game, userId, false, false, true, true);
      delete game.conversations;
      delete game.galaxy;
      return game;
    }));
  }
  async listSpectating(userId) {
    return await this.gameRepo.find(
      {
        "state.endDate": { $eq: null },
        "galaxy.players.spectators": {
          $elemMatch: {
            $in: [userId]
          }
        }
      },
      {
        "settings.general.type": 1,
        "settings.general.featured": 1,
        "settings.general.name": 1,
        "settings.general.playerLimit": 1,
        state: 1
      },
      { "state.endDate": -1 }
    );
  }
  async getUserPlayerNotifications(game, userId, includeTurnWaiting = true, includeUnreadEvents = true, includeUnreadConversastions = true, includePosition = true) {
    const player = game.galaxy.players.find((p) => p.userId && p.userId.toString() === userId.toString());
    let unreadConversations = null, unreadEvents = null, totalUnread = null, turnWaiting = null, position = null;
    if (player) {
      if (includeUnreadConversastions)
        unreadConversations = this.conversationService.getUnreadCount(game, player._id);
      if (includeUnreadEvents)
        unreadEvents = await this.eventService.getUnreadCount(game, player._id);
      if (includeTurnWaiting)
        turnWaiting = this.gameTypeService.isTurnBasedGame(game) && !player.ready;
      totalUnread = (unreadConversations || 0) + (unreadEvents || 0);
      if (includePosition) {
        position = this.leaderboardService.getGameLeaderboardPosition(game, player);
      }
    }
    let notification = {
      unreadConversations,
      unreadEvents,
      unread: totalUnread,
      turnWaiting,
      defeated: (player == null ? void 0 : player.defeated) || null,
      afk: (player == null ? void 0 : player.afk) || null,
      position
    };
    return notification;
  }
  async listOldCompletedGamesNotCleaned(months = 1) {
    let date = moment().subtract(months, "month");
    let query = {
      $and: [
        { "state.winner": { $ne: null } },
        { "state.endDate": { $lt: date } },
        {
          $or: [
            { "state.cleaned": false },
            { "state.cleaned": { $eq: null } }
          ]
        }
      ]
    };
    return await this.gameRepo.find(query, {
      _id: 1
    });
  }
  async listGamesTimedOutWaitingForPlayers() {
    let date = moment().subtract(7, "day");
    let games = await this.gameRepo.find({
      "settings.general.type": {
        $in: [
          "custom",
          "special_dark",
          "special_fog",
          "special_ultraDark",
          "special_orbital",
          "special_battleRoyale",
          "special_homeStar",
          "special_homeStarElimination",
          "special_anonymous",
          "special_kingOfTheHill",
          "special_tinyGalaxy",
          "special_freeForAll",
          "special_arcade"
        ]
      },
      "state.startDate": { $eq: null }
    }, {
      "galaxy.stars": 0,
      "galaxy.carriers": 0
    });
    return games.filter((g) => {
      return moment(g._id.getTimestamp()) <= date;
    });
  }
  async listInProgressGames() {
    let games = await this.gameRepo.find({
      "settings.general.type": { $nin: ["tutorial"] },
      "state.startDate": { $ne: null },
      "state.endDate": { $eq: null },
      "state.paused": { $eq: false }
    }, {
      "settings.general.name": 1,
      "settings.general.type": 1,
      "settings.general.playerLimit": 1,
      state: 1,
      "galaxy.players.isOpenSlot": 1
    }, {
      "state.startDate": -1
    });
    for (let game of games) {
      game.state.openSlots = game.galaxy.players.filter((p) => p.isOpenSlot).length;
      delete game.galaxy;
    }
    return games;
  }
  async listInProgressGamesGameTick() {
    return await this.gameRepo.find({
      "state.startDate": { $ne: null },
      "state.endDate": { $eq: null },
      "state.paused": { $eq: false },
      "state.locked": { $eq: false }
    }, {
      _id: 1,
      state: 1,
      settings: 1,
      "galaxy.players": 1
    }, {
      "settings.gameTime.speed": 1
    });
  }
  async listOpenGamesCreatedByUser(userId) {
    return await this.gameRepo.find({
      "settings.general.createdByUserId": { $eq: userId },
      "state.startDate": { $eq: null }
    });
  }
  async getUserTutorial(userId) {
    const tutorial = await this.gameRepo.findOne({
      "settings.general.type": "tutorial",
      "state.endDate": { $eq: null },
      "galaxy.players": {
        $elemMatch: {
          userId,
          defeated: false
        }
      }
    }, {
      _id: 1
    });
    return tutorial;
  }
  async listCompletedTutorials() {
    let date = moment().subtract(1, "day");
    let games = await this.gameRepo.find({
      "settings.general.type": "tutorial",
      "state.endDate": { $ne: null }
    }, {
      _id: 1
    });
    return games.filter((g) => {
      return moment(g._id.getTimestamp()) <= date;
    });
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=gameList.js.map
