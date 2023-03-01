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
var gameJoin_exports = {};
__export(gameJoin_exports, {
  GameJoinServiceEvents: () => GameJoinServiceEvents,
  default: () => GameJoinService
});
module.exports = __toCommonJS(gameJoin_exports);
var import_validation = __toESM(require("../errors/validation"));
const EventEmitter = require("events");
const moment = require("moment");
const GameJoinServiceEvents = {
  onPlayerJoined: "onPlayerJoined",
  onGameStarted: "onGameStarted"
};
class GameJoinService extends EventEmitter {
  constructor(userService, starService, playerService, passwordService, achievementService, avatarService, gameTypeService, gameStateService, conversationService, randomService, spectatorService) {
    super();
    this.userService = userService;
    this.starService = starService;
    this.playerService = playerService;
    this.passwordService = passwordService;
    this.achievementService = achievementService;
    this.avatarService = avatarService;
    this.gameTypeService = gameTypeService;
    this.gameStateService = gameStateService;
    this.conversationService = conversationService;
    this.randomService = randomService;
    this.spectatorService = spectatorService;
  }
  async join(game, userId, playerId, alias, avatar, password) {
    if (game.state.endDate) {
      throw new import_validation.default("The game has already finished.");
    }
    if (game.settings.general.password) {
      let passwordMatch = await this.passwordService.compare(password, game.settings.general.password);
      if (!passwordMatch) {
        throw new import_validation.default("The password is invalid.");
      }
    }
    if (this.gameTypeService.isForEstablishedPlayersOnly(game)) {
      const isEstablishedPlayer = await this.userService.isEstablishedPlayer(userId);
      if (!isEstablishedPlayer && !this.gameTypeService.isNewPlayerGame(game)) {
        throw new import_validation.default('You must complete a "New Player" game or a custom game before you can join an official game.');
      }
    }
    const userAvatar = await this.avatarService.getUserAvatar(userId, avatar);
    if (!userAvatar.purchased) {
      throw new import_validation.default(`You have not purchased the selected avatar.`);
    }
    let isQuitter = game.quitters.find((x) => x.toString() === userId.toString());
    if (isQuitter) {
      throw new import_validation.default("You cannot rejoin this game.");
    }
    let existing = game.galaxy.players.find((x) => x.userId && x.userId.toString() === userId.toString());
    if (existing && !existing.afk) {
      throw new import_validation.default("You are already participating in this game.");
    }
    let player = game.galaxy.players.find((x) => x._id.toString() === playerId.toString());
    if (!player) {
      throw new import_validation.default("The player is not participating in this game.");
    }
    if (!player.isOpenSlot) {
      throw new import_validation.default(`The player slot is not open to be filled.`);
    }
    let isAfker = game.afkers.find((x) => x.toString() === userId.toString());
    let isRejoiningAfkSlot = isAfker && player.afk && userId && player.userId && player.userId.toString() === userId.toString();
    if (player.afk && isAfker && userId && player.userId && player.userId.toString() !== userId.toString()) {
      throw new import_validation.default("You can only rejoin this game in your own slot.");
    }
    let stars = this.starService.listStarsOwnedByPlayer(game.galaxy.stars, player._id);
    if (!stars.length) {
      throw new import_validation.default("Cannot fill this slot, the player does not own any stars.");
    }
    let aliasCheckPlayer = game.galaxy.players.find((x) => x.userId && x.alias.toLowerCase() === alias.toLowerCase());
    if (aliasCheckPlayer && !isRejoiningAfkSlot) {
      throw new import_validation.default(`The alias '${alias}' has already been taken by another player.`);
    }
    let aliasCheckUser = await this.userService.otherUsernameExists(alias, userId);
    if (aliasCheckUser) {
      throw new import_validation.default(`The alias '${alias}' is the username of another player.`);
    }
    let gameIsFull = this.assignPlayerToUser(game, player, userId, alias, avatar);
    if (gameIsFull) {
      this.assignNonUserPlayersToAI(game);
    }
    await game.save();
    if (player.userId && !this.gameTypeService.isTutorialGame(game)) {
      await this.achievementService.incrementJoined(player.userId);
    }
    let playerJoinedEvent = {
      gameId: game._id,
      gameTick: game.state.tick,
      playerId: player._id,
      playerAlias: player.alias
    };
    this.emit(GameJoinServiceEvents.onPlayerJoined, playerJoinedEvent);
    if (gameIsFull) {
      let e = {
        gameId: game._id,
        gameTick: game.state.tick
      };
      this.emit(GameJoinServiceEvents.onGameStarted, e);
    }
    return gameIsFull;
  }
  assignPlayerToUser(game, player, userId, alias, avatar) {
    if (!player.isOpenSlot) {
      throw new import_validation.default(`The player slot is not open to be filled`);
    }
    let isAfker = userId && game.afkers.find((x) => x.toString() === userId.toString()) != null;
    let isFillingAfkSlot = this.gameStateService.isInProgress(game) && player.afk;
    let isRejoiningOwnAfkSlot = isFillingAfkSlot && isAfker && (userId && player.userId && player.userId.toString() === userId.toString());
    let hasFilledOtherPlayerAfkSlot = isFillingAfkSlot && !isRejoiningOwnAfkSlot;
    player.userId = userId;
    player.alias = alias;
    player.avatar = avatar.toString();
    player.spectators = [];
    player.hasFilledAfkSlot = hasFilledOtherPlayerAfkSlot;
    player.isOpenSlot = false;
    player.defeated = false;
    player.defeatedDate = null;
    player.missedTurns = 0;
    player.afk = false;
    player.hasSentTurnReminder = false;
    if (!player.userId) {
      player.ready = true;
    }
    if (userId) {
      this.spectatorService.clearSpectating(game, userId);
    }
    this.gameStateService.updateStatePlayerCount(game);
    let shouldStartGame = false;
    if (!game.state.startDate) {
      shouldStartGame = game.state.players === game.settings.general.playerLimit || this.gameTypeService.isNewPlayerGame(game) && game.state.players >= game.settings.general.playerLimit / 2 || this.gameTypeService.isTutorialGame(game) && game.state.players > 0;
      if (shouldStartGame) {
        let startDate = moment().utc();
        if (this.gameTypeService.isRealTimeGame(game)) {
          startDate.add(game.settings.gameTime.startDelay, "minute");
        }
        game.state.paused = false;
        game.state.startDate = startDate;
        game.state.lastTickDate = startDate;
        for (let player2 of game.galaxy.players) {
          this.playerService.updateLastSeen(game, player2, startDate);
        }
      }
    } else {
      this.playerService.updateLastSeen(game, player);
      if (hasFilledOtherPlayerAfkSlot) {
        this.conversationService.leaveAll(game, player._id);
      }
    }
    return shouldStartGame;
  }
  assignNonUserPlayersToAI(game) {
    const players = game.galaxy.players.filter((p) => p.userId == null);
    if (!players.length) {
      return;
    }
    const aliases = this.avatarService.listAllAliases();
    const avatars = this.avatarService.listAllSolarisAvatars();
    for (const player of players) {
      const aliasIndex = this.randomService.getRandomNumberBetween(0, aliases.length - 1);
      const avatarIndex = this.randomService.getRandomNumberBetween(0, avatars.length - 1);
      const alias = aliases.splice(aliasIndex, 1)[0];
      const avatar = avatars.splice(avatarIndex, 1)[0].id.toString();
      player.alias = alias;
      player.avatar = avatar;
      player.researchingNext = "random";
      player.missedTurns = 0;
      player.hasSentTurnReminder = false;
      player.afk = false;
      player.defeated = false;
      player.defeatedDate = null;
      player.hasFilledAfkSlot = false;
      if (this.gameTypeService.isTurnBasedGame(game)) {
        player.ready = true;
      }
      player.isOpenSlot = !this.gameTypeService.isTutorialGame(game);
    }
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GameJoinServiceEvents
});
//# sourceMappingURL=gameJoin.js.map
