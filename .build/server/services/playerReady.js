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
var playerReady_exports = {};
__export(playerReady_exports, {
  PlayerReadyServiceEvents: () => PlayerReadyServiceEvents,
  default: () => PlayerReadyService
});
module.exports = __toCommonJS(playerReady_exports);
var import_validation = __toESM(require("../errors/validation"));
const EventEmitter = require("events");
const PlayerReadyServiceEvents = {
  onGamePlayerReady: "onGamePlayerReady"
};
class PlayerReadyService extends EventEmitter {
  constructor(gameRepo, gameTypeService) {
    super();
    this.gameRepo = gameRepo;
    this.gameTypeService = gameTypeService;
  }
  async declareReady(game, player) {
    player.ready = true;
    await this.gameRepo.updateOne({
      _id: game._id,
      "galaxy.players._id": player._id
    }, {
      $set: {
        "galaxy.players.$.ready": true
      }
    });
    this.emit(PlayerReadyServiceEvents.onGamePlayerReady, {
      gameId: game._id,
      gameTick: game.state.tick
    });
  }
  async declareReadyToCycle(game, player) {
    player.ready = true;
    player.readyToCycle = true;
    await this.gameRepo.updateOne({
      _id: game._id,
      "galaxy.players._id": player._id
    }, {
      $set: {
        "galaxy.players.$.ready": true,
        "galaxy.players.$.readyToCycle": true
      }
    });
    this.emit(PlayerReadyServiceEvents.onGamePlayerReady, {
      gameId: game._id,
      gameTick: game.state.tick
    });
  }
  async undeclareReady(game, player) {
    player.ready = false;
    player.readyToCycle = false;
    await this.gameRepo.updateOne({
      _id: game._id,
      "galaxy.players._id": player._id
    }, {
      $set: {
        "galaxy.players.$.ready": false,
        "galaxy.players.$.readyToCycle": false
      }
    });
  }
  async declareReadyToQuit(game, player, force = false) {
    if (!force && game.state.productionTick <= 0) {
      throw new import_validation.default("Cannot declare ready to quit until at least 1 production cycle has completed.");
    }
    if (!force && this.gameTypeService.isTutorialGame(game)) {
      throw new import_validation.default("Cannot declare ready to quit in a tutorial.");
    }
    player.readyToQuit = true;
    await this.gameRepo.updateOne({
      _id: game._id,
      "galaxy.players._id": player._id
    }, {
      $set: {
        "galaxy.players.$.readyToQuit": true
      }
    });
  }
  async undeclareReadyToQuit(game, player) {
    if (game.state.productionTick <= 0) {
      throw new import_validation.default("Cannot undeclare ready to quit until at least 1 production cycle has completed.");
    }
    if (this.gameTypeService.isTutorialGame(game)) {
      throw new import_validation.default("Cannot undeclare ready to quit in a tutorial.");
    }
    player.readyToQuit = false;
    await this.gameRepo.updateOne({
      _id: game._id,
      "galaxy.players._id": player._id
    }, {
      $set: {
        "galaxy.players.$.readyToQuit": false
      }
    });
  }
  resetReadyStatuses(game, hasProductionTicked) {
    for (let player of game.galaxy.players) {
      player.hasSentTurnReminder = false;
      if (player.userId == null) {
        player.ready = true;
        player.readyToCycle = true;
      } else if (!player.readyToCycle) {
        player.ready = false;
      } else if (player.readyToCycle && hasProductionTicked) {
        player.ready = false;
        player.readyToCycle = false;
      }
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PlayerReadyServiceEvents
});
//# sourceMappingURL=playerReady.js.map
