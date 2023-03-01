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
var trade_exports = {};
__export(trade_exports, {
  TradeServiceEvents: () => TradeServiceEvents,
  default: () => TradeService
});
module.exports = __toCommonJS(trade_exports);
var import_validation = __toESM(require("../errors/validation"));
var import_ledger = require("./ledger");
const EventEmitter = require("events");
const moment = require("moment");
const TradeServiceEvents = {
  onPlayerCreditsReceived: "onPlayerCreditsReceived",
  onPlayerCreditsSent: "onPlayerCreditsSent",
  onPlayerCreditsSpecialistsReceived: "onPlayerCreditsSpecialistsReceived",
  onPlayerCreditsSpecialistsSent: "onPlayerCreditsSpecialistsSent",
  onPlayerRenownReceived: "onPlayerRenownReceived",
  onPlayerRenownSent: "onPlayerRenownSent",
  onPlayerTechnologyReceived: "onPlayerTechnologyReceived",
  onPlayerTechnologySent: "onPlayerTechnologySent"
};
class TradeService extends EventEmitter {
  constructor(gameRepo, eventRepo, userService, playerService, diplomacyService, ledgerService, achievementService, reputationService, gameTypeService, randomService, playerCreditsService, playerAfkService) {
    super();
    this.gameRepo = gameRepo;
    this.eventRepo = eventRepo;
    this.userService = userService;
    this.playerService = playerService;
    this.diplomacyService = diplomacyService;
    this.ledgerService = ledgerService;
    this.achievementService = achievementService;
    this.reputationService = reputationService;
    this.gameTypeService = gameTypeService;
    this.randomService = randomService;
    this.playerCreditsService = playerCreditsService;
    this.playerAfkService = playerAfkService;
  }
  isTradingCreditsDisabled(game) {
    return game.settings.player.tradeCredits === false;
  }
  isTradingAllyRestricted(game) {
    return this.diplomacyService.isFormalAlliancesEnabled(game) && this.diplomacyService.isTradeRestricted(game);
  }
  isTradingCreditsSpecialistsDisabled(game) {
    return game.settings.player.tradeCreditsSpecialists === false;
  }
  isTradingTechnologyDisabled(game) {
    return game.settings.player.tradeCost === 0;
  }
  async sendCredits(game, fromPlayer, toPlayerId, amount) {
    if (this.isTradingCreditsDisabled(game)) {
      throw new import_validation.default(`Trading credits is disabled.`);
    }
    if (!game.state.startDate) {
      throw new import_validation.default(`Cannot trade credits, the game has not started yet.`);
    }
    if (amount <= 0) {
      throw new import_validation.default(`Amount must be greater than 0.`);
    }
    let toPlayer = this.playerService.getById(game, toPlayerId);
    if (fromPlayer === toPlayer) {
      throw new import_validation.default(`Cannot send credits to yourself.`);
    }
    if (this.isTradingAllyRestricted(game) && this.diplomacyService.getDiplomaticStatusToPlayer(game, fromPlayer._id, toPlayerId).actualStatus !== "allies") {
      throw new import_validation.default(`You are only allowed to trade with allies.`);
    }
    this._tradeScanningCheck(game, fromPlayer, toPlayer);
    if (fromPlayer.credits < amount) {
      throw new import_validation.default(`You do not own ${amount} credits.`);
    }
    let dbWrites = [
      await this.playerCreditsService.addCredits(game, fromPlayer, -amount, false),
      await this.playerCreditsService.addCredits(game, toPlayer, amount, false)
    ];
    await this.gameRepo.bulkWrite(dbWrites);
    await this.ledgerService.addDebt(game, fromPlayer, toPlayer, amount, import_ledger.LedgerType.Credits);
    if (!this.gameTypeService.isTutorialGame(game)) {
      if (fromPlayer.userId && !fromPlayer.defeated) {
        await this.achievementService.incrementTradeCreditsSent(fromPlayer.userId, amount);
      }
      if (toPlayer.userId && !toPlayer.defeated) {
        await this.achievementService.incrementTradeCreditsReceived(toPlayer.userId, amount);
      }
    }
    let reputationResult = await this.reputationService.tryIncreaseReputationCredits(game, toPlayer, fromPlayer, amount);
    if (reputationResult.increased) {
      await this.tryTradeBack(game, toPlayer, fromPlayer, reputationResult.rep.reputation);
    }
    let eventObject = {
      gameId: game._id,
      gameTick: game.state.tick,
      fromPlayer,
      toPlayer,
      amount,
      reputation: reputationResult.rep.reputation,
      date: moment().utc()
    };
    this.emit(TradeServiceEvents.onPlayerCreditsReceived, eventObject);
    this.emit(TradeServiceEvents.onPlayerCreditsSent, eventObject);
    return eventObject;
  }
  async sendCreditsSpecialists(game, fromPlayer, toPlayerId, amount) {
    if (this.isTradingCreditsSpecialistsDisabled(game)) {
      throw new import_validation.default(`Trading specialist tokens is disabled.`);
    }
    if (!game.state.startDate) {
      throw new import_validation.default(`Cannot trade specialist tokens, the game has not started yet.`);
    }
    if (amount <= 0) {
      throw new import_validation.default(`Amount must be greater than 0.`);
    }
    let toPlayer = this.playerService.getById(game, toPlayerId);
    if (fromPlayer === toPlayer) {
      throw new import_validation.default(`Cannot send specialist tokens to yourself.`);
    }
    if (this.isTradingAllyRestricted(game) && this.diplomacyService.getDiplomaticStatusToPlayer(game, fromPlayer._id, toPlayerId).actualStatus !== "allies") {
      throw new import_validation.default(`You are only allowed to trade with allies.`);
    }
    this._tradeScanningCheck(game, fromPlayer, toPlayer);
    if (fromPlayer.creditsSpecialists < amount) {
      throw new import_validation.default(`You do not own ${amount} specialist tokens.`);
    }
    let dbWrites = [
      await this.playerCreditsService.addCreditsSpecialists(game, fromPlayer, -amount, false),
      await this.playerCreditsService.addCreditsSpecialists(game, toPlayer, amount, false)
    ];
    await this.gameRepo.bulkWrite(dbWrites);
    await this.ledgerService.addDebt(game, fromPlayer, toPlayer, amount, import_ledger.LedgerType.CreditsSpecialists);
    if (!this.gameTypeService.isTutorialGame(game)) {
      if (fromPlayer.userId && !fromPlayer.defeated) {
        await this.achievementService.incrementTradeCreditsSpecialistsSent(fromPlayer.userId, amount);
      }
      if (toPlayer.userId && !toPlayer.defeated && toPlayer.userId) {
        await this.achievementService.incrementTradeCreditsSpecialistsReceived(toPlayer.userId, amount);
      }
    }
    let reputationResult = await this.reputationService.tryIncreaseReputationCreditsSpecialists(game, toPlayer, fromPlayer, amount);
    if (reputationResult.increased) {
      await this.tryTradeBack(game, toPlayer, fromPlayer, reputationResult.rep.reputation);
    }
    let eventObject = {
      gameId: game._id,
      gameTick: game.state.tick,
      fromPlayer,
      toPlayer,
      amount,
      reputation: reputationResult.rep.reputation,
      date: moment().utc()
    };
    this.emit(TradeServiceEvents.onPlayerCreditsSpecialistsReceived, eventObject);
    this.emit(TradeServiceEvents.onPlayerCreditsSpecialistsSent, eventObject);
    return eventObject;
  }
  async sendRenown(game, fromPlayer, toPlayerId, amount) {
    if (!game.state.startDate) {
      throw new import_validation.default(`Cannot award renown, the game has not started yet.`);
    }
    if (amount <= 0) {
      throw new import_validation.default(`Amount must be greater than 0.`);
    }
    if (game.settings.general.anonymity === "extra" && !game.state.endDate) {
      throw new import_validation.default(`Renown cannot be sent to players in anonymous games until the game has finished.`);
    }
    let toPlayer = this.playerService.getById(game, toPlayerId);
    if (fromPlayer === toPlayer) {
      throw new import_validation.default(`Cannot award renown to yourself.`);
    }
    if (fromPlayer.renownToGive < amount) {
      throw new import_validation.default(`You do not have ${amount} renown to award.`);
    }
    if (!toPlayer.userId) {
      throw new import_validation.default(`Cannot award renown to an empty slot.`);
    }
    let toUser = await this.userService.getById(toPlayer.userId);
    if (!toUser) {
      throw new import_validation.default(`There is no user associated with this player.`);
    }
    await this.gameRepo.updateOne({
      _id: game._id,
      "galaxy.players._id": fromPlayer._id
    }, {
      $inc: {
        "galaxy.players.$.renownToGive": -amount
      }
    });
    if (!this.gameTypeService.isTutorialGame(game)) {
      if (fromPlayer.userId) {
        await this.achievementService.incrementRenownSent(fromPlayer.userId, amount);
      }
      if (toPlayer.userId) {
        await this.achievementService.incrementRenownReceived(toPlayer.userId, amount);
      }
    }
    let eventObject = {
      gameId: game._id,
      gameTick: game.state.tick,
      fromPlayer,
      toPlayer,
      amount,
      date: moment().utc()
    };
    this.emit(TradeServiceEvents.onPlayerRenownReceived, eventObject);
    this.emit(TradeServiceEvents.onPlayerRenownSent, eventObject);
    return eventObject;
  }
  async sendTechnology(game, fromPlayer, toPlayerId, technology, techLevel) {
    if (this.isTradingTechnologyDisabled(game)) {
      throw new import_validation.default(`Trading technology is disabled.`);
    }
    let toPlayer = this.playerService.getById(game, toPlayerId);
    if (fromPlayer === toPlayer) {
      throw new import_validation.default(`Cannot trade technology with yourself.`);
    }
    if (this.isTradingAllyRestricted(game) && this.diplomacyService.getDiplomaticStatusToPlayer(game, fromPlayer._id, toPlayerId).actualStatus !== "allies") {
      throw new import_validation.default(`You are only allowed to trade with allies.`);
    }
    this._tradeScanningCheck(game, fromPlayer, toPlayer);
    let tradeTechs = this.listTradeableTechnologies(game, fromPlayer, toPlayerId);
    let tradeTech = tradeTechs.find((t) => t.name === technology && t.level === techLevel);
    if (!tradeTech) {
      throw new import_validation.default(`The technology ${technology} cannot be traded with this player.`);
    }
    let toPlayerTech = toPlayer.research[tradeTech.name];
    if (toPlayerTech.level >= tradeTech.level) {
      throw new import_validation.default(`The recipient already owns technology ${technology} level ${tradeTech.level} or greater.`);
    }
    if (fromPlayer.credits < tradeTech.cost) {
      throw new import_validation.default(`You cannot afford to trade this technology.`);
    }
    let levelDifference = tradeTech.level - toPlayerTech.level;
    let updateResearchQuery = {};
    updateResearchQuery["galaxy.players.$.research." + tradeTech.name + ".level"] = tradeTech.level;
    updateResearchQuery["galaxy.players.$.research." + tradeTech.name + ".progress"] = 0;
    let dbWrites = [
      await this.playerCreditsService.addCredits(game, fromPlayer, -tradeTech.cost, false),
      {
        updateOne: {
          filter: {
            _id: game._id,
            "galaxy.players._id": toPlayer._id
          },
          update: updateResearchQuery
        }
      }
    ];
    await this.gameRepo.bulkWrite(dbWrites);
    await this.ledgerService.addDebt(game, fromPlayer, toPlayer, tradeTech.cost, import_ledger.LedgerType.Credits);
    if (!this.gameTypeService.isTutorialGame(game)) {
      if (toPlayer.userId && !toPlayer.defeated) {
        await this.achievementService.incrementTradeTechnologyReceived(toPlayer.userId, 1);
      }
      if (fromPlayer.userId && !fromPlayer.defeated) {
        await this.achievementService.incrementTradeTechnologySent(fromPlayer.userId, 1);
      }
    }
    let eventTechnology = {
      name: tradeTech.name,
      level: tradeTech.level,
      difference: levelDifference
    };
    let reputationResult = await this.reputationService.tryIncreaseReputationTechnology(game, toPlayer, fromPlayer, eventTechnology);
    if (reputationResult.increased) {
      await this.tryTradeBack(game, toPlayer, fromPlayer, reputationResult.rep.reputation);
    }
    let eventObject = {
      gameId: game._id,
      gameTick: game.state.tick,
      fromPlayer,
      toPlayer,
      technology: eventTechnology,
      reputation: reputationResult.rep.reputation,
      date: moment().utc()
    };
    this.emit(TradeServiceEvents.onPlayerTechnologyReceived, eventObject);
    this.emit(TradeServiceEvents.onPlayerTechnologySent, eventObject);
    return eventObject;
  }
  listTradeableTechnologies(game, fromPlayer, toPlayerId) {
    if (this.isTradingTechnologyDisabled(game)) {
      return [];
    }
    let toPlayer = this.playerService.getById(game, toPlayerId);
    if (fromPlayer._id.toString() === toPlayer._id.toString()) {
      throw new import_validation.default("Cannot trade with the same player");
    }
    let techKeys = Object.keys(fromPlayer.research).filter((k) => {
      return k.match(/^[^_\$]/) != null;
    });
    let tradeTechs = [];
    for (let i = 0; i < techKeys.length; i++) {
      let techKey = techKeys[i];
      let techFromPlayer = fromPlayer.research[techKey];
      let techToPlayer = toPlayer.research[techKey];
      let techLevel = techFromPlayer.level;
      while (techLevel > techToPlayer.level) {
        tradeTechs.push({
          name: techKey,
          level: techLevel,
          cost: techLevel * game.settings.player.tradeCost
        });
        techLevel--;
      }
    }
    return tradeTechs;
  }
  _tradeScanningCheck(game, fromPlayer, toPlayer) {
    if (game.settings.player.tradeScanning === "scanned") {
      let isInRange = this.playerService.isInScanningRangeOfPlayer(game, fromPlayer, toPlayer);
      if (!isInRange) {
        throw new import_validation.default(`You cannot trade with this player, they are not within scanning range.`);
      }
    }
  }
  async listTradeEventsBetweenPlayers(game, playerId, playerIds) {
    let events = await this.eventRepo.find({
      gameId: game._id,
      playerId,
      type: {
        $in: [
          "playerCreditsReceived",
          "playerCreditsSpecialistsReceived",
          "playerRenownReceived",
          "playerTechnologyReceived",
          "playerGiftReceived",
          "playerCreditsSent",
          "playerCreditsSpecialistsSent",
          "playerRenownSent",
          "playerTechnologySent",
          "playerGiftSent",
          "playerDebtSettled",
          "playerDebtForgiven"
        ]
      },
      $or: [
        { "data.fromPlayerId": { $in: playerIds } },
        { "data.toPlayerId": { $in: playerIds } },
        {
          $and: [
            { "data.debtorPlayerId": { $in: playerIds } },
            { "data.creditorPlayerId": { $in: playerIds } }
          ]
        }
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
  async tryTradeBack(game, fromPlayer, toPlayer, reputation) {
    if (!this.playerAfkService.isAIControlled(game, fromPlayer, true)) {
      return;
    }
    const TRADE_CHANCE_BASE = 50;
    const TRADE_CHANCE_STEP = 5;
    const TRADE_CHANCE_MIN_REPUTATION = 1;
    if (reputation.score < TRADE_CHANCE_MIN_REPUTATION) {
      return;
    }
    let tradeChance = TRADE_CHANCE_BASE + TRADE_CHANCE_STEP * reputation.score;
    let tradeRoll = this.randomService.getRandomNumber(100);
    let canPerformTrade = tradeRoll <= tradeChance || true;
    if (!canPerformTrade) {
      return;
    }
    let tradeTechs = await this.listTradeableTechnologies(game, fromPlayer, toPlayer._id);
    tradeTechs = tradeTechs.filter((t) => t.cost <= fromPlayer.credits);
    if (!tradeTechs.length) {
      return;
    }
    let tradeTech = tradeTechs[this.randomService.getRandomNumber(tradeTechs.length - 1)];
    await this.sendTechnology(game, fromPlayer, toPlayer._id, tradeTech.name, tradeTech.level);
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TradeServiceEvents
});
//# sourceMappingURL=trade.js.map
