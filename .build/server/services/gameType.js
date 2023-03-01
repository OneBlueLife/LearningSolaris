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
var gameType_exports = {};
__export(gameType_exports, {
  default: () => GameTypeService
});
module.exports = __toCommonJS(gameType_exports);
class GameTypeService {
  isNewPlayerGame(game) {
    return ["new_player_rt", "new_player_tb"].includes(game.settings.general.type);
  }
  isTutorialGame(game) {
    return game.settings.general.type === "tutorial";
  }
  isOfficialGame(game) {
    return game.settings.general.createdByUserId == null;
  }
  isCustomGame(game) {
    return game.settings.general.type === "custom";
  }
  isFeaturedGame(game) {
    return game.settings.general.featured;
  }
  isSpecialGameMode(game) {
    return [
      "special_dark",
      "special_fog",
      "special_ultraDark",
      "special_orbital",
      "special_battleRoyale",
      "special_homeStar",
      "special_homeStarElimination",
      "special_anonymous",
      "special_kingOfTheHill",
      "special_tinyGalaxy",
      "special_freeForAll",
      "special_arcade"
    ].includes(game.settings.general.type);
  }
  is32PlayerGame(game) {
    return game.settings.general.playerLimit === 32;
  }
  isConquestMode(game) {
    return game.settings.general.mode === "conquest";
  }
  isKingOfTheHillMode(game) {
    return game.settings.general.mode === "kingOfTheHill";
  }
  isAnonymousGame(game) {
    return game.settings.general.anonymity === "extra";
  }
  isForEstablishedPlayersOnly(game) {
    return game.settings.general.playerType === "establishedPlayers";
  }
  isOrbitalMode(game) {
    return game.settings.orbitalMechanics.enabled === "enabled";
  }
  isBattleRoyaleMode(game) {
    return game.settings.general.mode === "battleRoyale";
  }
  isDarkModeExtra(game) {
    return game.settings.specialGalaxy.darkGalaxy === "extra";
  }
  isDarkMode(game) {
    return game.settings.specialGalaxy.darkGalaxy === "standard" || game.settings.specialGalaxy.darkGalaxy === "extra";
  }
  isDarkFogged(game) {
    return game.settings.specialGalaxy.darkGalaxy === "fog";
  }
  isDarkStart(game) {
    return game.settings.specialGalaxy.darkGalaxy === "start" || this.isDarkFogged(game);
  }
  isTurnBasedGame(game) {
    return game.settings.gameTime.gameType === "turnBased";
  }
  isRealTimeGame(game) {
    return game.settings.gameTime.gameType === "realTime";
  }
  isSplitResources(game) {
    return game.settings.specialGalaxy.splitResources === "enabled";
  }
  is1v1Game(game) {
    return ["1v1_rt", "1v1_tb"].includes(game.settings.general.type);
  }
  isFluxGame(game) {
    return game.settings.general.fluxEnabled === "enabled";
  }
  isRankedGame(game) {
    return !this.isTutorialGame(game) && !this.isNewPlayerGame(game) && (!this.isCustomGame(game) || this.isFeaturedGame(game));
  }
  isCapitalStarEliminationMode(game) {
    return this.isConquestMode(game) && game.settings.conquest.capitalStarElimination === "enabled";
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=gameType.js.map
