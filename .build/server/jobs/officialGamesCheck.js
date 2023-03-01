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
var officialGamesCheck_exports = {};
__export(officialGamesCheck_exports, {
  default: () => officialGamesCheck_default
});
module.exports = __toCommonJS(officialGamesCheck_exports);
const officialGameSettings = [
  require("../config/game/settings/official/newPlayer"),
  require("../config/game/settings/official/standard"),
  require("../config/game/settings/official/32player"),
  require("../config/game/settings/official/turnBased"),
  require("../config/game/settings/official/1v1"),
  require("../config/game/settings/official/1v1turnBased")
];
const specialGameSettings = [
  require("../config/game/settings/official/special_dark"),
  require("../config/game/settings/official/special_fog"),
  require("../config/game/settings/official/special_battleRoyale"),
  require("../config/game/settings/official/special_orbital"),
  require("../config/game/settings/official/special_ultraDark"),
  require("../config/game/settings/official/special_homeStar"),
  require("../config/game/settings/official/special_homeStarElimination"),
  require("../config/game/settings/official/special_anonymous"),
  require("../config/game/settings/official/special_kingOfTheHill"),
  require("../config/game/settings/official/special_tinyGalaxy"),
  require("../config/game/settings/official/special_freeForAll"),
  require("../config/game/settings/official/special_arcade")
];
var officialGamesCheck_default = (container) => {
  return {
    async handler(job, done) {
      let games = await container.gameListService.listOfficialGames();
      for (let i = 0; i < officialGameSettings.length; i++) {
        let settings = officialGameSettings[i];
        let existing = games.find((x) => x.settings.general.type === settings.general.type);
        if (!existing) {
          console.log(`Could not find game [${settings.general.type}], creating it now...`);
          try {
            let newGame = await container.gameCreateService.create(settings);
            console.log(`[${newGame.settings.general.name}] game created.`);
          } catch (e) {
            console.error(e);
          }
        }
      }
      const specialGameTypes = specialGameSettings.map((x) => x.general.type);
      const hasSpecialGame = games.find((x) => specialGameTypes.includes(x.settings.general.type)) != null;
      if (!hasSpecialGame) {
        console.log(`Could not find special game, creating one now...`);
        let settings = specialGameSettings[container.randomService.getRandomNumber(specialGameSettings.length - 1)];
        try {
          let newGame = await container.gameCreateService.create(settings);
          console.log(`[${newGame.settings.general.name}] special game created.`);
        } catch (e) {
          console.error(e);
        }
      }
      done();
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=officialGamesCheck.js.map
