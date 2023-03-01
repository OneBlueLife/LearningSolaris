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
var game_exports = {};
__export(game_exports, {
  GameServiceEvents: () => GameServiceEvents,
  default: () => GameService
});
module.exports = __toCommonJS(game_exports);
var import_validation = __toESM(require("../errors/validation"));
const EventEmitter = require("events");
const GameServiceEvents = {
  onPlayerQuit: "onPlayerQuit",
  onPlayerDefeated: "onPlayerDefeated",
  onGameDeleted: "onGameDeleted"
};
class GameService extends EventEmitter {
  constructor(gameRepo, userService, starService, carrierService, playerService, passwordService, achievementService, avatarService, gameTypeService, gameStateService, conversationService, playerReadyService) {
    super();
    this.gameRepo = gameRepo;
    this.userService = userService;
    this.starService = starService;
    this.carrierService = carrierService;
    this.playerService = playerService;
    this.passwordService = passwordService;
    this.achievementService = achievementService;
    this.avatarService = avatarService;
    this.gameTypeService = gameTypeService;
    this.gameStateService = gameStateService;
    this.conversationService = conversationService;
    this.playerReadyService = playerReadyService;
  }
  async getByIdAll(id) {
    return await this.gameRepo.findByIdAsModel(id);
  }
  async getByIdAllLean(id) {
    return await this.gameRepo.findById(id);
  }
  async getById(id, select) {
    return await this.gameRepo.findByIdAsModel(id, select);
  }
  async getByNameStateSettingsLean(name) {
    return await this.gameRepo.find({
      "settings.general.name": name
    }, {
      state: 1,
      settings: 1
    });
  }
  async getByIdSettingsLean(id) {
    return await this.gameRepo.findById(id, {
      "settings": 1
    });
  }
  async getByIdLean(id, select) {
    return await this.gameRepo.findById(id, select);
  }
  async getByIdGalaxyLean(id) {
    return await this.getByIdLean(id, {
      settings: 1,
      state: 1,
      galaxy: 1,
      constants: 1,
      spectators: 1
    });
  }
  async getGameStateTick(id) {
    let game = await this.getByIdLean(id, {
      "state.tick": 1
    });
    if (!game) {
      return null;
    }
    return game.state.tick;
  }
  async getGameSettings(id) {
    let game = await this.getByIdLean(id, {
      "settings": 1
    });
    return game == null ? void 0 : game.settings;
  }
  async quit(game, player) {
    if (game.state.startDate) {
      throw new import_validation.default("Cannot quit a game that has started.");
    }
    if (game.state.endDate) {
      throw new import_validation.default("Cannot quit a game that has finished.");
    }
    if (this.gameTypeService.isTutorialGame(game)) {
      await this.delete(game);
      return null;
    }
    let alias = player.alias;
    if (player.userId && !this.gameTypeService.isNewPlayerGame(game)) {
      game.quitters.push(player.userId);
    }
    if (player.userId && !this.gameTypeService.isTutorialGame(game)) {
      await this.achievementService.incrementQuit(player.userId);
    }
    this.playerService.resetPlayerForGameStart(game, player);
    this.gameStateService.updateStatePlayerCount(game);
    await game.save();
    let e = {
      gameId: game._id,
      gameTick: game.state.tick,
      playerId: player._id,
      playerAlias: alias
    };
    this.emit(GameServiceEvents.onPlayerQuit, e);
    return player;
  }
  async concedeDefeat(game, player, openSlot) {
    if (player.defeated) {
      throw new import_validation.default("The player has already been defeated.");
    }
    if (!game.state.startDate) {
      throw new import_validation.default("Cannot concede defeat in a game that has not yet started.");
    }
    if (game.state.endDate) {
      throw new import_validation.default("Cannot concede defeat in a game that has finished.");
    }
    if (this.gameTypeService.isTutorialGame(game)) {
      return this.delete(game);
    }
    game.quitters.push(player.userId);
    this.playerService.setPlayerAsDefeated(game, player, openSlot);
    game.state.players--;
    if (game.settings.general.advancedAI === "disabled") {
      this.carrierService.clearPlayerCarrierWaypointsLooped(game, player);
    }
    if (player.userId && !this.gameTypeService.isTutorialGame(game)) {
      await this.achievementService.incrementDefeated(player.userId, 1);
    }
    await game.save();
    let e = {
      gameId: game._id,
      gameTick: game.state.tick,
      playerId: player._id,
      playerAlias: player.alias,
      openSlot
    };
    this.emit(GameServiceEvents.onPlayerDefeated, e);
  }
  async delete(game, deletedByUserId) {
    if (deletedByUserId && game.state.startDate) {
      throw new import_validation.default("Cannot delete games that are in progress or completed.");
    }
    if (deletedByUserId && game.settings.general.createdByUserId && game.settings.general.createdByUserId.toString() !== deletedByUserId.toString()) {
      throw new import_validation.default("Cannot delete this game, you did not create it.");
    }
    if (game.state.startDate == null && !this.gameTypeService.isTutorialGame(game)) {
      for (let player of game.galaxy.players) {
        if (player.userId) {
          await this.achievementService.incrementJoined(player.userId, -1);
        }
      }
    }
    await this.gameRepo.deleteOne({
      _id: game._id
    });
    this.emit(GameServiceEvents.onGameDeleted, {
      gameId: game._id
    });
  }
  async getPlayerUser(game, playerId) {
    if (this.gameTypeService.isAnonymousGame(game)) {
      return null;
    }
    let player = game.galaxy.players.find((p) => p._id.toString() === playerId.toString());
    return await this.userService.getInfoByIdLean(player.userId, {
      "achievements.level": 1,
      "achievements.rank": 1,
      "achievements.renown": 1,
      "achievements.victories": 1,
      "achievements.eloRating": 1,
      roles: 1
    });
  }
  async lock(gameId, locked = true) {
    await this.gameRepo.updateOne({
      _id: gameId
    }, {
      $set: {
        "state.locked": locked
      }
    });
  }
  async lockAll(locked = true) {
    await this.gameRepo.updateMany({
      "state.locked": { $ne: locked }
    }, {
      $set: {
        "state.locked": locked
      }
    });
  }
  listAllUndefeatedPlayers(game) {
    if (this.gameTypeService.isTutorialGame(game)) {
      return game.galaxy.players.filter((p) => p.userId);
    }
    return game.galaxy.players.filter((p) => !p.defeated);
  }
  isAllUndefeatedPlayersReady(game) {
    let undefeatedPlayers = this.listAllUndefeatedPlayers(game);
    return undefeatedPlayers.filter((x) => x.ready).length === undefeatedPlayers.length;
  }
  isAllUndefeatedPlayersReadyToQuit(game) {
    let undefeatedPlayers = this.listAllUndefeatedPlayers(game);
    return undefeatedPlayers.filter((x) => x.readyToQuit).length === undefeatedPlayers.length;
  }
  async forceEndGame(game) {
    let undefeatedPlayers = this.listAllUndefeatedPlayers(game);
    for (let player of undefeatedPlayers) {
      await this.playerReadyService.declareReadyToQuit(game, player, true);
    }
  }
  async quitAllActiveGames(userId) {
    let allGames = await this.gameRepo.findAsModels({
      "galaxy.players": {
        $elemMatch: {
          userId,
          defeated: false
        }
      },
      $and: [
        { "state.endDate": { $eq: null } }
      ]
    });
    for (let game of allGames) {
      let player = this.playerService.getByUserId(game, userId);
      if (this.gameStateService.isInProgress(game)) {
        await this.concedeDefeat(game, player, false);
      } else {
        await this.quit(game, player);
      }
    }
  }
  async markAsCleaned(gameId) {
    await this.gameRepo.updateOne({
      _id: gameId
    }, {
      $set: {
        "state.cleaned": true,
        "settings.general.timeMachine": "disabled"
      }
    });
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GameServiceEvents
});
//# sourceMappingURL=game.js.map
