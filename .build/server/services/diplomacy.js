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
var diplomacy_exports = {};
__export(diplomacy_exports, {
  DiplomacyServiceEvents: () => DiplomacyServiceEvents,
  default: () => DiplomacyService
});
module.exports = __toCommonJS(diplomacy_exports);
var import_validation = __toESM(require("../errors/validation"));
const EventEmitter = require("events");
const moment = require("moment");
const DiplomacyServiceEvents = {
  onDiplomacyStatusChanged: "onDiplomacyStatusChanged",
  onDiplomacyPeaceDeclared: "onDiplomacyPeaceDeclared",
  onDiplomacyWarDeclared: "onDiplomacyWarDeclared"
};
class DiplomacyService extends EventEmitter {
  constructor(gameRepo, eventRepo, diplomacyUpkeepService) {
    super();
    this.gameRepo = gameRepo;
    this.eventRepo = eventRepo;
    this.diplomacyUpkeepService = diplomacyUpkeepService;
  }
  isFormalAlliancesEnabled(game) {
    return game.settings.diplomacy.enabled === "enabled";
  }
  isTradeRestricted(game) {
    return game.settings.diplomacy.tradeRestricted === "enabled";
  }
  isMaxAlliancesEnabled(game) {
    return game.settings.diplomacy.maxAlliances < game.settings.general.playerLimit - 1;
  }
  isGlobalEventsEnabled(game) {
    return game.settings.diplomacy.globalEvents === "enabled";
  }
  getDiplomaticStatusBetweenPlayers(game, playerIds) {
    let statuses = [];
    for (let i = 0; i < playerIds.length; i++) {
      for (let ii = 0; ii < playerIds.length; ii++) {
        if (i === ii) {
          continue;
        }
        let playerIdA = playerIds[i];
        let playerIdB = playerIds[ii];
        let diplomaticStatus = this.getDiplomaticStatusToPlayer(game, playerIdA, playerIdB);
        statuses.push(diplomaticStatus.actualStatus);
      }
    }
    if (statuses.indexOf("enemies") > -1) {
      return "enemies";
    } else if (statuses.indexOf("neutral") > -1) {
      return "neutral";
    }
    return "allies";
  }
  getDiplomaticStatusToPlayer(game, playerIdA, playerIdB) {
    var _a, _b;
    let playerA = game.galaxy.players.find((p) => p._id.toString() === playerIdA.toString());
    let playerB = game.galaxy.players.find((p) => p._id.toString() === playerIdB.toString());
    if (playerIdA.toString() === playerIdB.toString()) {
      return {
        playerIdFrom: playerIdA,
        playerIdTo: playerIdB,
        playerFromAlias: playerA.alias,
        playerToAlias: playerB.alias,
        statusFrom: "allies",
        statusTo: "allies",
        actualStatus: "allies"
      };
    }
    let statusTo = ((_a = playerA.diplomacy.find((x) => x.playerId.toString() === playerB._id.toString())) == null ? void 0 : _a.status) ?? "neutral";
    let statusFrom = ((_b = playerB.diplomacy.find((x) => x.playerId.toString() === playerA._id.toString())) == null ? void 0 : _b.status) ?? "neutral";
    let actualStatus;
    if (statusTo === "enemies" || statusFrom === "enemies") {
      actualStatus = "enemies";
    } else if (statusTo === "neutral" || statusFrom === "neutral") {
      actualStatus = "neutral";
    } else {
      actualStatus = "allies";
    }
    return {
      playerIdFrom: playerIdA,
      playerIdTo: playerIdB,
      playerFromAlias: playerA.alias,
      playerToAlias: playerB.alias,
      statusFrom,
      statusTo,
      actualStatus
    };
  }
  getDiplomaticStatusToAllPlayers(game, player) {
    let diplomaticStatuses = [];
    for (let otherPlayer of game.galaxy.players) {
      if (player._id.toString() === otherPlayer._id.toString()) {
        continue;
      }
      diplomaticStatuses.push(this.getDiplomaticStatusToPlayer(game, player._id, otherPlayer._id));
    }
    return diplomaticStatuses;
  }
  getAlliesOfPlayer(game, player) {
    let allies = [];
    for (let otherPlayer of game.galaxy.players) {
      if (otherPlayer._id.toString() === player._id.toString()) {
        continue;
      }
      let diplomaticStatus = this.getDiplomaticStatusToPlayer(game, player._id, otherPlayer._id);
      if (diplomaticStatus.actualStatus === "allies") {
        allies.push(otherPlayer);
      }
    }
    return allies;
  }
  getAlliesOrOffersOfPlayer(game, player) {
    let allies = [];
    for (let otherPlayer of game.galaxy.players) {
      if (otherPlayer._id.toString() === player._id.toString()) {
        continue;
      }
      let diplomaticStatus = this.getDiplomaticStatusToPlayer(game, player._id, otherPlayer._id);
      if (diplomaticStatus.actualStatus === "allies" || diplomaticStatus.statusTo === "allies") {
        allies.push(otherPlayer);
      }
    }
    return allies;
  }
  isDiplomaticStatusBetweenPlayersAllied(game, playerIds) {
    return this.getDiplomaticStatusBetweenPlayers(game, playerIds) === "allies";
  }
  isDiplomaticStatusToPlayersAllied(game, playerId, toPlayerIds) {
    let playerIdA = playerId;
    for (let i = 0; i < toPlayerIds.length; i++) {
      let playerIdB = toPlayerIds[i];
      let diplomaticStatus = this.getDiplomaticStatusToPlayer(game, playerIdA, playerIdB);
      if (["enemies", "neutral"].includes(diplomaticStatus.actualStatus)) {
        return false;
      }
    }
    return true;
  }
  getFilteredDiplomacy(player, forPlayer) {
    return player.diplomacy.filter((a) => a.toString() === forPlayer._id.toString());
  }
  async _declareStatus(game, playerId, playerIdTarget, state, saveToDB = true) {
    let player = game.galaxy.players.find((p) => p._id.toString() === playerId.toString());
    let diplo = player.diplomacy.find((d) => d.playerId.toString() === playerIdTarget.toString());
    if (!diplo) {
      diplo = {
        playerId: playerIdTarget,
        status: state
      };
      player.diplomacy.push(diplo);
      if (saveToDB) {
        await this.gameRepo.updateOne({
          _id: game._id,
          "galaxy.players._id": playerId
        }, {
          $addToSet: {
            "galaxy.players.$.diplomacy": diplo
          }
        });
      }
    } else {
      diplo.status = state;
      if (saveToDB) {
        await this.gameRepo.updateOne({
          _id: game._id
        }, {
          $set: {
            "galaxy.players.$[p].diplomacy.$[d].status": diplo.status
          }
        }, {
          arrayFilters: [
            { "p._id": player._id },
            { "d.playerId": diplo.playerId }
          ]
        });
      }
    }
    let diplomaticStatus = this.getDiplomaticStatusToPlayer(game, playerId, playerIdTarget);
    return diplomaticStatus;
  }
  async declareAlly(game, playerId, playerIdTarget, saveToDB = true) {
    let oldStatus = this.getDiplomaticStatusToPlayer(game, playerId, playerIdTarget);
    if (oldStatus.statusTo === "allies") {
      throw new import_validation.default(`The player has already been declared as allies`);
    }
    if (this.isMaxAlliancesEnabled(game)) {
      let player = game.galaxy.players.find((p) => p._id.toString() === playerId.toString());
      let allianceCount = this.getAlliesOrOffersOfPlayer(game, player).length;
      if (allianceCount >= game.settings.diplomacy.maxAlliances) {
        throw new import_validation.default(`You have reached the alliance cap, you cannot declare any more alliances.`);
      }
    }
    if (this.diplomacyUpkeepService.isAllianceUpkeepEnabled(game)) {
      let player = game.galaxy.players.find((p) => p._id.toString() === playerId.toString());
      await this.diplomacyUpkeepService.deductUpkeep(game, player, 1, saveToDB);
    }
    let wasAtWar = this.getDiplomaticStatusToPlayer(game, playerId, playerIdTarget).actualStatus === "enemies";
    let newStatus = await this._declareStatus(game, playerId, playerIdTarget, "allies", saveToDB);
    let isAllied = newStatus.actualStatus === "allies";
    let isFriendly = isAllied || newStatus.actualStatus === "neutral";
    this.emit(DiplomacyServiceEvents.onDiplomacyStatusChanged, {
      gameId: game._id,
      gameTick: game.state.tick,
      status: newStatus
    });
    if (this.isGlobalEventsEnabled(game) && wasAtWar && isFriendly) {
      let e = {
        gameId: game._id,
        gameTick: game.state.tick,
        status: newStatus
      };
      this.emit(DiplomacyServiceEvents.onDiplomacyPeaceDeclared, e);
    }
    return newStatus;
  }
  async declareEnemy(game, playerId, playerIdTarget, saveToDB = true) {
    let oldStatus = this.getDiplomaticStatusToPlayer(game, playerId, playerIdTarget);
    if (oldStatus.statusTo === "enemies") {
      throw new import_validation.default(`The player has already been declared as enemies`);
    }
    let wasAtWar = oldStatus.actualStatus === "enemies";
    await this._declareStatus(game, playerId, playerIdTarget, "enemies", saveToDB);
    await this._declareStatus(game, playerIdTarget, playerId, "enemies", saveToDB);
    let newStatus = this.getDiplomaticStatusToPlayer(game, playerId, playerIdTarget);
    this.emit(DiplomacyServiceEvents.onDiplomacyStatusChanged, {
      gameId: game._id,
      gameTick: game.state.tick,
      status: newStatus
    });
    if (this.isGlobalEventsEnabled(game) && !wasAtWar) {
      let e = {
        gameId: game._id,
        gameTick: game.state.tick,
        status: newStatus
      };
      this.emit(DiplomacyServiceEvents.onDiplomacyWarDeclared, e);
    }
    return newStatus;
  }
  async declareNeutral(game, playerId, playerIdTarget, saveToDB = true) {
    let oldStatus = this.getDiplomaticStatusToPlayer(game, playerId, playerIdTarget);
    if (oldStatus.statusTo === "neutral") {
      throw new import_validation.default(`The player has already been declared as neutral`);
    }
    let wasAtWar = oldStatus.actualStatus === "enemies";
    let wasAllied = oldStatus.actualStatus === "allies";
    await this._declareStatus(game, playerId, playerIdTarget, "neutral", saveToDB);
    if (wasAllied) {
      await this._declareStatus(game, playerIdTarget, playerId, "neutral", saveToDB);
    }
    let newStatus = this.getDiplomaticStatusToPlayer(game, playerId, playerIdTarget);
    let isNeutral = newStatus.actualStatus === "neutral";
    this.emit(DiplomacyServiceEvents.onDiplomacyStatusChanged, {
      gameId: game._id,
      gameTick: game.state.tick,
      status: newStatus
    });
    if (this.isGlobalEventsEnabled(game) && wasAtWar && isNeutral) {
      let e = {
        gameId: game._id,
        gameTick: game.state.tick,
        status: newStatus
      };
      this.emit(DiplomacyServiceEvents.onDiplomacyPeaceDeclared, e);
    }
    return newStatus;
  }
  async listDiplomacyEventsBetweenPlayers(game, playerIdA, playerIdB) {
    let events = await this.eventRepo.find({
      gameId: game._id,
      playerId: playerIdA,
      type: "playerDiplomacyStatusChanged",
      $or: [
        { "data.playerIdFrom": playerIdB },
        { "data.playerIdTo": playerIdB }
      ]
    });
    return events.map((e) => {
      return {
        playerId: e.playerId,
        type: e.type,
        data: e.data,
        sentDate: moment(e._id.getTimestamp()),
        sentTick: e.tick
      };
    });
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DiplomacyServiceEvents
});
//# sourceMappingURL=diplomacy.js.map
