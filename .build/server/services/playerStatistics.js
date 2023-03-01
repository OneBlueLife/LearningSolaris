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
var playerStatistics_exports = {};
__export(playerStatistics_exports, {
  default: () => PlayerStatisticsService
});
module.exports = __toCommonJS(playerStatistics_exports);
class PlayerStatisticsService {
  constructor(starService, carrierService, technologyService, specialistService, shipService) {
    this.starService = starService;
    this.carrierService = carrierService;
    this.technologyService = technologyService;
    this.specialistService = specialistService;
    this.shipService = shipService;
  }
  getStats(game, player) {
    var _a;
    let playerStars = this.starService.listStarsOwnedByPlayer(game.galaxy.stars, player._id);
    let playerCarriers = this.carrierService.listCarriersOwnedByPlayer(game.galaxy.carriers, player._id);
    let totalStarSpecialists = this.calculateTotalStarSpecialists(playerStars);
    let totalCarrierSpecialists = this.calculateTotalCarrierSpecialists(playerCarriers);
    let totalStars = playerStars.length;
    let totalHomeStars = this.calculateTotalHomeStars(playerStars);
    if (game.settings.general.mode === "battleRoyale") {
      totalStars = playerStars.filter((s) => !this.starService.isDeadStar(s)).length;
    }
    return {
      totalStars,
      totalHomeStars,
      totalCarriers: playerCarriers.length,
      totalShips: this.shipService.calculateTotalShips(playerStars, playerCarriers),
      totalShipsMax: ((_a = this.shipService.calculatePopulationCap(game, player._id)) == null ? void 0 : _a.shipsMaximum) || null,
      totalEconomy: this.calculateTotalEconomy(playerStars),
      totalIndustry: this.calculateTotalIndustry(playerStars),
      totalScience: this.calculateTotalScience(playerStars),
      newShips: this.calculateTotalManufacturing(game, playerStars),
      warpgates: this.calculateWarpgates(playerStars),
      totalStarSpecialists,
      totalCarrierSpecialists,
      totalSpecialists: totalStarSpecialists + totalCarrierSpecialists
    };
  }
  calculateTotalStars(player, stars) {
    let playerStars = this.starService.listStarsOwnedByPlayer(stars, player._id);
    return playerStars.length;
  }
  calculateTotalHomeStars(playerStars) {
    return playerStars.filter((s) => s.homeStar).length;
  }
  calculateTotalEconomy(playerStars) {
    let totalEconomy = playerStars.reduce((sum, s) => {
      var _a;
      let multiplier = this.specialistService.getEconomyInfrastructureMultiplier(s);
      let eco = ((_a = s.infrastructure) == null ? void 0 : _a.economy) ?? 0;
      return sum + eco * multiplier;
    }, 0);
    return totalEconomy;
  }
  calculateTotalIndustry(playerStars) {
    let totalIndustry = playerStars.reduce((sum, s) => {
      var _a;
      let ind = ((_a = s.infrastructure) == null ? void 0 : _a.industry) ?? 0;
      return sum + ind;
    }, 0);
    return totalIndustry;
  }
  calculateTotalScience(playerStars) {
    let totalScience = playerStars.reduce((sum, s) => {
      var _a;
      let multiplier = this.specialistService.getScienceInfrastructureMultiplier(s);
      let sci = ((_a = s.infrastructure) == null ? void 0 : _a.science) ?? 0;
      return sum + sci * multiplier;
    }, 0);
    return totalScience;
  }
  calculateTotalManufacturing(game, playerStars) {
    const totalManufacturing = playerStars.reduce((sum, s) => {
      return sum + this.shipService.calculateStarManufacturing(game, s);
    }, 0);
    return Math.round((totalManufacturing + Number.EPSILON) * 100) / 100;
  }
  calculateWarpgates(playerStars) {
    return playerStars.reduce((sum, s) => s.warpGate ? sum + 1 : sum, 0);
  }
  calculateTotalCarriers(player, carriers) {
    let playerCarriers = this.carrierService.listCarriersOwnedByPlayer(carriers, player._id);
    return playerCarriers.length;
  }
  calculateTotalStarSpecialists(playerStars) {
    return playerStars.filter((s) => s.specialistId).length;
  }
  calculateTotalCarrierSpecialists(playerCarriers) {
    return playerCarriers.filter((c) => c.specialistId).length;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=playerStatistics.js.map
