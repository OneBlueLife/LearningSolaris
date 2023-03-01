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
var gameFlux_exports = {};
__export(gameFlux_exports, {
  default: () => GameFluxService
});
module.exports = __toCommonJS(gameFlux_exports);
const moment = require("moment");
const fluxes = require("../config/game/flux.json");
class GameFluxService {
  constructor() {
    this.SPECIALIST_BANS_STANDARD = 3;
    this.SPECIALIST_BANS_FLUX = 6;
    this.FLUX = [
      this.applyJanFlux,
      this.applyFebFlux,
      this.applyMarFlux,
      this.applyAprFlux,
      this.applyMayFlux,
      this.applyJunFlux,
      this.applyJulFlux,
      this.applyAugFlux,
      this.applySepFlux,
      this.applyOctFlux,
      this.applyNovFlux,
      this.applyDecFlux
    ];
  }
  getCurrentFlux() {
    return this.getFluxById(moment().utc().month() + 1);
  }
  getFluxById(fluxId) {
    if (fluxId == null) {
      return null;
    }
    return fluxes.find((f) => f.id === fluxId);
  }
  applyCurrentFlux(game) {
    const fluxId = moment().utc().month();
    const applyFlux = this.FLUX[fluxId];
    applyFlux(game);
    game.settings.general.fluxId = fluxId + 1;
  }
  applyJanFlux(game) {
    game.constants.player.bankingCycleRewardMultiplier = 50;
  }
  applyFebFlux(game) {
    game.constants.star.captureRewardMultiplier = 25;
  }
  applyMarFlux(game) {
    game.constants.research.sciencePointMultiplier = 2;
  }
  applyAprFlux(game) {
    game.constants.star.homeStarDefenderBonusMultiplier = 2;
  }
  applyMayFlux(game) {
    game.constants.research.experimentationMultiplier = 2;
  }
  applyJunFlux(game) {
    game.settings.player.tradeCost = 50;
  }
  applyJulFlux(game) {
    game.settings.technology.startingTechnologyLevel.weapons = 7;
    game.settings.technology.researchCosts.weapons = "none";
  }
  applyAugFlux(game) {
    game.settings.specialGalaxy.defenderBonus = "disabled";
  }
  applySepFlux(game) {
    game.settings.galaxy.productionTicks = Math.max(14, game.settings.galaxy.productionTicks - 6);
  }
  applyOctFlux(game) {
    game.constants.specialists.monthlyBanAmount = 6;
  }
  applyNovFlux(game) {
    game.settings.player.startingCredits = Math.min(3e3, game.settings.player.startingCredits * 2);
    game.settings.player.startingCreditsSpecialists = Math.min(100, game.settings.player.startingCreditsSpecialists * 2);
  }
  applyDecFlux(game) {
    game.constants.player.rankRewardMultiplier = 2;
  }
  getThisMonthSpecialistBanAmount() {
    return moment().utc().month() === 9 ? this.SPECIALIST_BANS_FLUX : this.SPECIALIST_BANS_STANDARD;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=gameFlux.js.map
