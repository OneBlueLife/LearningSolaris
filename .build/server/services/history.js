"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var history_exports = {};
__export(history_exports, {
  default: () => HistoryService
});
module.exports = __toCommonJS(history_exports);
var import_validation = __toESM(require("../errors/validation"));
const cache = require("memory-cache");
class HistoryService {
  constructor(historyRepo, playerService, gameService, playerStatisticsService) {
    this.historyRepo = historyRepo;
    this.playerService = playerService;
    this.gameService = gameService;
    this.playerStatisticsService = playerStatisticsService;
    this.gameService.on("onGameDeleted", (args) => this.deleteByGameId(args.gameId));
  }
  async listIntel(gameId, startTick, endTick) {
    let settings = await this.gameService.getGameSettings(gameId);
    if (!settings || settings.specialGalaxy.darkGalaxy === "extra") {
      throw new import_validation.default("Intel is not available in this game mode.");
    }
    startTick = startTick || 0;
    endTick = endTick || Number.MAX_VALUE;
    ;
    let cacheKey = `intel_${gameId}_${startTick}_${endTick}`;
    let cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    let intel = await this.historyRepo.find({
      gameId,
      tick: {
        $gte: startTick,
        $lte: endTick
      }
    }, {
      gameId: 1,
      tick: 1,
      "players.playerId": 1,
      "players.statistics.totalStars": 1,
      "players.statistics.totalHomeStars": 1,
      "players.statistics.totalEconomy": 1,
      "players.statistics.totalIndustry": 1,
      "players.statistics.totalScience": 1,
      "players.statistics.totalShips": 1,
      "players.statistics.totalCarriers": 1,
      "players.statistics.totalSpecialists": 1,
      "players.statistics.totalStarSpecialists": 1,
      "players.statistics.totalCarrierSpecialists": 1,
      "players.statistics.newShips": 1,
      "players.statistics.warpgates": 1,
      "players.research.weapons.level": 1,
      "players.research.banking.level": 1,
      "players.research.manufacturing.level": 1,
      "players.research.hyperspace.level": 1,
      "players.research.scanning.level": 1,
      "players.research.experimentation.level": 1,
      "players.research.terraforming.level": 1,
      "players.research.specialists.level": 1
    }, {
      tick: 1
    });
    cache.put(cacheKey, intel, 36e5);
    return intel;
  }
  async log(game) {
    let history = await this.historyRepo.findOne({
      gameId: game._id,
      tick: game.state.tick
    });
    if (history) {
      return;
    }
    history = {
      gameId: game._id,
      tick: game.state.tick,
      productionTick: game.state.productionTick,
      players: [],
      stars: [],
      carriers: []
    };
    history.players = game.galaxy.players.map((player) => {
      let stats = this.playerStatisticsService.getStats(game, player);
      return {
        userId: player.userId,
        playerId: player._id,
        statistics: {
          totalStars: stats.totalStars,
          totalHomeStars: stats.totalHomeStars,
          totalEconomy: stats.totalEconomy,
          totalIndustry: stats.totalIndustry,
          totalScience: stats.totalScience,
          totalShips: stats.totalShips,
          totalCarriers: stats.totalCarriers,
          totalSpecialists: stats.totalSpecialists,
          totalStarSpecialists: stats.totalStarSpecialists,
          totalCarrierSpecialists: stats.totalCarrierSpecialists,
          newShips: stats.newShips,
          warpgates: stats.warpgates
        },
        alias: player.alias,
        avatar: player.avatar,
        researchingNow: player.researchingNow,
        researchingNext: player.researchingNext,
        credits: player.credits,
        creditsSpecialists: player.creditsSpecialists,
        isOpenSlot: player.isOpenSlot,
        defeated: player.defeated,
        defeatedDate: player.defeatedDate,
        afk: player.afk,
        ready: player.ready,
        readyToQuit: player.readyToQuit,
        research: player.research
      };
    });
    history.stars = game.galaxy.stars.map((s) => {
      return {
        starId: s._id,
        ownedByPlayerId: s.ownedByPlayerId,
        naturalResources: s.naturalResources,
        ships: s.ships,
        shipsActual: s.shipsActual,
        specialistId: s.specialistId,
        homeStar: s.homeStar,
        warpGate: s.warpGate,
        ignoreBulkUpgrade: s.ignoreBulkUpgrade,
        infrastructure: s.infrastructure,
        location: s.location
      };
    });
    history.carriers = game.galaxy.carriers.map((c) => {
      let x = {
        carrierId: c._id,
        ownedByPlayerId: c.ownedByPlayerId,
        name: c.name,
        orbiting: c.orbiting,
        ships: c.ships,
        specialistId: c.specialistId,
        isGift: c.isGift,
        location: c.location,
        waypoints: []
      };
      if (c.waypoints.length) {
        x.waypoints = [c.waypoints[0]];
      }
      return x;
    });
    await this.historyRepo.insertOne(history);
    await this.cleanupTimeMachineHistory(game);
  }
  async cleanupTimeMachineHistory(game) {
    let maxTick;
    const MIN_HISTORY_TICK_OFFSET = null;
    if (game.settings.general.timeMachine === "disabled") {
      maxTick = game.state.tick;
    } else if (MIN_HISTORY_TICK_OFFSET) {
      maxTick = Math.max(0, game.state.tick - MIN_HISTORY_TICK_OFFSET);
    }
    await this.historyRepo.updateMany({
      gameId: game._id,
      tick: {
        $lt: maxTick
      },
      stars: {
        $exists: true,
        $not: { $size: 0 }
      }
    }, {
      $unset: {
        "players.$[].alias": "",
        "players.$[].avatar": "",
        "players.$[].researchingNow": "",
        "players.$[].researchingNext": "",
        "players.$[].credits": "",
        "players.$[].creditsSpecialists": "",
        "players.$[].defeated": "",
        "players.$[].defeatedDate": "",
        "players.$[].afk": "",
        "players.$[].ready": "",
        "players.$[].readyToQuit": "",
        "stars": "",
        "carriers": ""
      }
    });
  }
  async getHistoryByTick(gameId, tick) {
    return await this.historyRepo.findOne({
      gameId,
      tick
    });
  }
  async deleteByGameId(gameId) {
    await this.historyRepo.deleteMany({
      gameId
    });
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=history.js.map
