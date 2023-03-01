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
var spectator_exports = {};
__export(spectator_exports, {
  default: () => SpectatorService
});
module.exports = __toCommonJS(spectator_exports);
var import_validation = __toESM(require("../errors/validation"));
class SpectatorService {
  constructor(gameRepo, playerService, userService) {
    this.gameRepo = gameRepo;
    this.playerService = playerService;
    this.userService = userService;
  }
  isSpectatingEnabled(game) {
    return game.settings.general.spectators === "enabled";
  }
  async invite(game, player, username) {
    if (!this.isSpectatingEnabled(game)) {
      throw new import_validation.default(`Spectating is not enabled in this game.`);
    }
    let user2 = await this.userService.getByUsername(username, {
      _id: 1
    });
    if (!user2) {
      throw new import_validation.default(`A player with the username ${username} does not exist.`);
    }
    const existingPlayer = this.playerService.getByUserId(game, user2._id);
    if (existingPlayer) {
      throw new import_validation.default(`The user ${username} is already playing in this game, they cannot be invited to spectate.`);
    }
    await this.gameRepo.updateOne({
      _id: game._id,
      "galaxy.players._id": player._id
    }, {
      $addToSet: {
        "galaxy.players.$.spectators": user2._id
      }
    });
  }
  async uninvite(game, player, userId) {
    if (!this.isSpectatingEnabled(game)) {
      throw new import_validation.default(`Spectating is not enabled in this game.`);
    }
    await this.gameRepo.updateOne({
      _id: game._id,
      "galaxy.players._id": player._id
    }, {
      $pull: {
        "galaxy.players.$.spectators": userId
      }
    });
  }
  async clearSpectators(game, player) {
    if (!this.isSpectatingEnabled(game)) {
      throw new import_validation.default(`Spectating is not enabled in this game.`);
    }
    await this.gameRepo.updateOne({
      _id: game._id,
      "galaxy.players._id": player._id
    }, {
      $set: {
        "galaxy.players.$.spectators": []
      }
    });
  }
  async listSpectators(game) {
    if (!this.isSpectatingEnabled(game)) {
      return null;
    }
    let userIds = [];
    for (const player of game.galaxy.players.filter((p) => p.spectators)) {
      userIds = userIds.concat(player.spectators.map((s) => s.toString()));
    }
    userIds = [...new Set(userIds)];
    if (!userIds.length) {
      return [];
    }
    const users = await this.userService.listUsers(userIds, {
      _id: 1,
      username: 1
    });
    return users.map((u) => {
      const playerIds = game.galaxy.players.filter((p) => p.spectators).filter((p) => p.spectators.map((s) => s.toString()).includes(u._id.toString())).map((p) => p._id);
      return {
        ...u,
        playerIds
      };
    });
  }
  clearSpectating(game, userId) {
    const spectating = this.listSpectatingPlayers(game, userId);
    for (let player of spectating) {
      player.spectators.splice(player.spectators.indexOf(userId), 1);
    }
  }
  isSpectating(game, userId) {
    return this.listSpectatingPlayers(game, userId).length > 0;
  }
  listSpectatingPlayers(game, userId) {
    return game.galaxy.players.filter((p) => p.spectators.find((s) => s.toString() === userId.toString()));
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=spectator.js.map
