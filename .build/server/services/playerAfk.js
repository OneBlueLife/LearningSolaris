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
var playerAfk_exports = {};
__export(playerAfk_exports, {
  default: () => PlayerAfkService
});
module.exports = __toCommonJS(playerAfk_exports);
const moment = require("moment");
const EventEmitter = require("events");
class PlayerAfkService extends EventEmitter {
  constructor(gameRepo, playerService, starService, carrierService, gameTypeService, gameStateService) {
    super();
    this.gameRepo = gameRepo;
    this.playerService = playerService;
    this.starService = starService;
    this.carrierService = carrierService;
    this.gameTypeService = gameTypeService;
    this.gameStateService = gameStateService;
  }
  performDefeatedOrAfkCheck(game, player) {
    if (player.defeated) {
      throw new Error(`Cannot perform a defeated check on an already defeated player.`);
    }
    if (!player.afk) {
      let isAfk = this.isAfk(game, player);
      if (isAfk) {
        this.playerService.setPlayerAsAfk(game, player);
      }
    }
    if (!player.defeated) {
      let stars = this.starService.listStarsOwnedByPlayer(game.galaxy.stars, player._id);
      if (stars.length === 0) {
        let carriers = this.carrierService.listCarriersOwnedByPlayer(game.galaxy.carriers, player._id);
        if (carriers.length === 0) {
          this.playerService.setPlayerAsDefeated(game, player, false);
        }
      }
      if (this.gameTypeService.isCapitalStarEliminationMode(game) && !this.playerService.ownsOriginalHomeStar(game, player)) {
        this.playerService.setPlayerAsDefeated(game, player, false);
      }
    }
  }
  isAIControlled(game, player, includePseudoAfk) {
    if (player.defeated || !player.userId) {
      return true;
    }
    if (includePseudoAfk) {
      return this.isPsuedoAfk(game, player);
    }
    return false;
  }
  isPsuedoAfk(game, player) {
    if (!this.gameStateService.isStarted(game)) {
      return false;
    }
    let startDate = moment(game.state.startDate).utc();
    let startDatePlus12h = moment(game.state.startDate).add(12, "hours");
    let now = moment().utc();
    if (now < startDatePlus12h) {
      return false;
    }
    if (player.lastSeen == null || moment(player.lastSeen).utc() <= startDate) {
      return true;
    }
    return false;
  }
  isAfk(game, player) {
    if (player.afk) {
      return true;
    }
    if (this.isAIControlled(game, player, false)) {
      return false;
    }
    let lastSeenMoreThanXDaysAgo = moment(player.lastSeen).utc() <= moment().utc().subtract(game.settings.gameTime.afk.lastSeenTimeout, "days");
    if (lastSeenMoreThanXDaysAgo) {
      return true;
    }
    if (this.gameTypeService.isTurnBasedGame(game)) {
      return player.missedTurns >= game.settings.gameTime.afk.turnTimeout;
    }
    let secondsXCycles = game.settings.galaxy.productionTicks * game.settings.gameTime.speed * game.settings.gameTime.afk.cycleTimeout;
    let secondsToAfk = Math.max(secondsXCycles, 43200);
    let lastSeenMoreThanXSecondsAgo = moment(player.lastSeen).utc() <= moment().utc().subtract(secondsToAfk, "seconds");
    return lastSeenMoreThanXSecondsAgo;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=playerAfk.js.map
