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
var ledger_exports = {};
__export(ledger_exports, {
  LedgerServiceEvents: () => LedgerServiceEvents,
  LedgerType: () => LedgerType,
  default: () => LedgerService
});
module.exports = __toCommonJS(ledger_exports);
var import_validation = __toESM(require("../errors/validation"));
const EventEmitter = require("events");
var LedgerType = /* @__PURE__ */ ((LedgerType2) => {
  LedgerType2["Credits"] = "credits";
  LedgerType2["CreditsSpecialists"] = "creditsSpecialists";
  return LedgerType2;
})(LedgerType || {});
const LedgerServiceEvents = {
  onDebtAdded: "onDebtAdded",
  onDebtSettled: "onDebtSettled",
  onDebtForgiven: "onDebtForgiven"
};
class LedgerService extends EventEmitter {
  constructor(gameRepo, playerService, playerCreditsService) {
    super();
    this.gameRepo = gameRepo;
    this.playerService = playerService;
    this.playerCreditsService = playerCreditsService;
  }
  getLedger(player, type) {
    return player.ledger[type];
  }
  getLedgerForPlayer(player, playerId, type) {
    let fullLedger = this.getLedger(player, type);
    let playerLedger = fullLedger.find((l) => l.playerId.toString() === playerId.toString());
    let isNew = false;
    if (!playerLedger) {
      playerLedger = {
        playerId,
        debt: 0
      };
      player.ledger[type].push(playerLedger);
      isNew = true;
    }
    playerLedger = fullLedger.find((l) => l.playerId.toString() === playerId.toString());
    return {
      ledger: playerLedger,
      isNew
    };
  }
  async addDebt(game, creditor, debtor, debt, type) {
    let ledgerCreditor = this.getLedgerForPlayer(creditor, debtor._id, type);
    let ledgerDebtor = this.getLedgerForPlayer(debtor, creditor._id, type);
    ledgerCreditor.ledger.debt += debt;
    ledgerDebtor.ledger.debt -= debt;
    await this._updateLedger(game, creditor, ledgerCreditor.ledger, ledgerCreditor.isNew, type);
    await this._updateLedger(game, debtor, ledgerDebtor.ledger, ledgerDebtor.isNew, type);
    this.emit(LedgerServiceEvents.onDebtAdded, {
      gameId: game._id,
      gameTick: game.state.tick,
      debtor: debtor._id,
      creditor: creditor._id,
      amount: debt,
      ledgerType: type
    });
    return ledgerCreditor;
  }
  async settleDebt(game, debtor, playerBId, type) {
    let creditor = this.playerService.getById(game, playerBId);
    let ledgerDebtor = this.getLedgerForPlayer(debtor, playerBId, type);
    let ledgerCreditor = this.getLedgerForPlayer(creditor, debtor._id, type);
    if (ledgerDebtor.ledger.debt > 0) {
      throw new import_validation.default("You do not owe the player anything.");
    }
    let debtAmount = Math.abs(ledgerDebtor.ledger.debt);
    let debtorCredits = type === "credits" /* Credits */ ? debtor.credits : debtor.creditsSpecialists;
    if (debtorCredits < debtAmount) {
      debtAmount = debtorCredits;
    }
    ledgerDebtor.ledger.debt += debtAmount;
    ledgerCreditor.ledger.debt -= debtAmount;
    if (type === "credits" /* Credits */) {
      await this.playerCreditsService.addCredits(game, debtor, -debtAmount);
      await this.playerCreditsService.addCredits(game, creditor, debtAmount);
    } else if (type === "creditsSpecialists" /* CreditsSpecialists */) {
      await this.playerCreditsService.addCreditsSpecialists(game, debtor, -debtAmount);
      await this.playerCreditsService.addCreditsSpecialists(game, creditor, debtAmount);
    } else {
      throw new Error(`Unsupported ledger type: ${type}`);
    }
    await this._updateLedger(game, debtor, ledgerDebtor.ledger, ledgerDebtor.isNew, type);
    await this._updateLedger(game, creditor, ledgerCreditor.ledger, ledgerCreditor.isNew, type);
    this.emit(LedgerServiceEvents.onDebtSettled, {
      gameId: game._id,
      gameTick: game.state.tick,
      debtor: debtor._id,
      creditor: creditor._id,
      amount: debtAmount,
      ledgerType: type
    });
    return ledgerDebtor;
  }
  async forgiveDebt(game, creditor, playerBId, type) {
    let debtor = this.playerService.getById(game, playerBId);
    let ledgerCreditor = this.getLedgerForPlayer(creditor, playerBId, type);
    let ledgerDebtor = this.getLedgerForPlayer(debtor, creditor._id, type);
    if (ledgerCreditor.ledger.debt <= 0) {
      throw new import_validation.default("The player does not owe you anything.");
    }
    let debtAmount = ledgerCreditor.ledger.debt;
    ledgerDebtor.ledger.debt += debtAmount;
    ledgerCreditor.ledger.debt = 0;
    await this._updateLedger(game, creditor, ledgerCreditor.ledger, ledgerCreditor.isNew, type);
    await this._updateLedger(game, debtor, ledgerDebtor.ledger, ledgerDebtor.isNew, type);
    this.emit(LedgerServiceEvents.onDebtForgiven, {
      gameId: game._id,
      gameTick: game.state.tick,
      debtor: debtor._id,
      creditor: creditor._id,
      amount: debtAmount,
      ledgerType: type
    });
    return ledgerCreditor;
  }
  async _updateLedger(game, player, ledger, isNew, type) {
    let dbWrites = [];
    if (isNew) {
      const updateObject = {
        $push: {}
      };
      updateObject.$push[`galaxy.players.$[p].ledger.${type}`] = {
        playerId: ledger.playerId,
        debt: ledger.debt
      };
      dbWrites.push({
        updateOne: {
          filter: {
            _id: game._id,
            "galaxy.players._id": player._id
          },
          update: updateObject,
          arrayFilters: [
            { "p._id": player._id }
          ]
        }
      });
    } else {
      const updateObject = {};
      updateObject[`galaxy.players.$[p].ledger.${type}.$[l].debt`] = ledger.debt;
      dbWrites.push({
        updateOne: {
          filter: {
            _id: game._id
          },
          update: updateObject,
          arrayFilters: [
            { "p._id": player._id },
            { "l.playerId": ledger.playerId }
          ]
        }
      });
    }
    await this.gameRepo.bulkWrite(dbWrites);
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LedgerServiceEvents,
  LedgerType
});
//# sourceMappingURL=ledger.js.map
