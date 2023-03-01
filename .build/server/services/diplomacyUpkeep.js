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
var diplomacyUpkeep_exports = {};
__export(diplomacyUpkeep_exports, {
  default: () => DiplomacyUpkeepService
});
module.exports = __toCommonJS(diplomacyUpkeep_exports);
var import_validation = __toESM(require("../errors/validation"));
class DiplomacyUpkeepService {
  constructor(playerCreditsService, playerCycleRewardsService) {
    this.playerCycleRewardsService = playerCycleRewardsService;
    this.playerCreditsService = playerCreditsService;
  }
  isAllianceUpkeepEnabled(game) {
    return game.settings.diplomacy.upkeepCost !== "none";
  }
  async deductUpkeep(game, player, allianceCount, saveToDB = true) {
    if (!this.isAllianceUpkeepEnabled(game)) {
      throw new Error(`Alliance upkeep is not enabled in this game`);
    }
    const cycleRewards = this.playerCycleRewardsService.calculatePlayerCreditsEndOfCycleRewards(game, player);
    let upkeep = this.getUpkeepCost(game, cycleRewards.creditsTotal, allianceCount);
    if (!upkeep) {
      return null;
    }
    if (saveToDB) {
      if (player.credits < upkeep.totalCost) {
        throw new import_validation.default(`You cannot afford to declare an alliance with this player. The upfront alliance fee is ${upkeep.totalCost} credits.`);
      }
      await this.playerCreditsService.addCredits(game, player, -upkeep.totalCost);
    } else {
      player.credits -= upkeep.totalCost;
    }
    return upkeep;
  }
  deductTotalUpkeep(game, player, creditsTotal, allianceCount) {
    if (!this.isAllianceUpkeepEnabled(game)) {
      throw new Error(`Alliance upkeep is not enabled in this game`);
    }
    let upkeep = this.getUpkeepCost(game, creditsTotal, allianceCount);
    if (!upkeep) {
      return null;
    }
    player.credits -= upkeep.totalCost;
    return upkeep;
  }
  getUpkeepCost(game, creditsTotal, allianceCount) {
    let costPerAlly = game.constants.diplomacy.upkeepExpenseMultipliers[game.settings.diplomacy.upkeepCost];
    if (costPerAlly === 0) {
      return null;
    }
    let totalCost = Math.round(allianceCount * costPerAlly * creditsTotal);
    return {
      allianceCount,
      totalCost
    };
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=diplomacyUpkeep.js.map
