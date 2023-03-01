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
var diplomacyHelper_exports = {};
__export(diplomacyHelper_exports, {
  default: () => diplomacyHelper_default
});
module.exports = __toCommonJS(diplomacyHelper_exports);
class DiplomacyHelper {
  isFormalAlliancesEnabled(game) {
    return game.settings.diplomacy.enabled === "enabled";
  }
  isTradeRestricted(game) {
    return game.settings.diplomacy.tradeRestricted === "enabled";
  }
  maxAlliances(game) {
    return game.settings.diplomacy.maxAlliances;
  }
  isMaxAlliancesEnabled(game) {
    return game.settings.diplomacy.maxAlliances < game.settings.general.playerLimit - 1;
  }
  isAllianceUpkeepEnabled(game) {
    return game.settings.diplomacy.upkeepCost !== "none";
  }
  getAllianceUpkeepCost(game, player, cycleCredits, allianceCount) {
    const costPerAlly = game.constants.diplomacy.upkeepExpenseMultipliers[game.settings.diplomacy.upkeepCost];
    const upkeep = Math.round(allianceCount * costPerAlly * cycleCredits);
    return upkeep;
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
  getDiplomaticStatusToPlayer(game, playerIdA, playerIdB) {
    if (playerIdA.toString() === playerIdB.toString()) {
      return {
        playerIdFrom: playerIdA,
        playerIdTo: playerIdB,
        statusFrom: "allies",
        statusTo: "allies",
        actualStatus: "allies"
      };
    }
    let playerA = game.galaxy.players.find((p) => p._id.toString() === playerIdA.toString());
    let playerB = game.galaxy.players.find((p) => p._id.toString() === playerIdB.toString());
    let playerADiplo = playerA.diplomacy.find((x) => x.playerId.toString() === playerB._id.toString());
    let playerBDiplo = playerB.diplomacy.find((x) => x.playerId.toString() === playerA._id.toString());
    let statusTo = playerADiplo == null ? "neutral" : playerADiplo.status;
    let statusFrom = playerBDiplo == null ? "neutral" : playerBDiplo.status;
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
      statusFrom,
      statusTo,
      actualStatus
    };
  }
}
var diplomacyHelper_default = new DiplomacyHelper();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=diplomacyHelper.js.map
