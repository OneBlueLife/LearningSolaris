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
var ship_exports = {};
__export(ship_exports, {
  default: () => ShipService
});
module.exports = __toCommonJS(ship_exports);
class ShipService {
  constructor(starService, technologyService, carrierService) {
    this.starService = starService;
    this.technologyService = technologyService;
    this.carrierService = carrierService;
  }
  isPopulationRestricted(game) {
    return game.settings.player.populationCap.enabled === "enabled";
  }
  calculateTotalShips(ownedStars, ownedCarriers) {
    return ownedStars.reduce((sum, s) => sum + s.ships, 0) + ownedCarriers.reduce((sum, c) => sum + c.ships, 0);
  }
  calculatePopulationCap(game, playerId) {
    if (!this.isPopulationRestricted(game)) {
      return null;
    }
    const playerStars = this.starService.listStarsOwnedByPlayer(game.galaxy.stars, playerId);
    const playerCarriers = this.carrierService.listCarriersOwnedByPlayer(game.galaxy.carriers, playerId);
    const shipsCurrent = this.calculateTotalShips(playerStars, playerCarriers);
    const shipsMaximum = game.settings.player.populationCap.shipsPerStar * 3 + playerStars.length * game.settings.player.populationCap.shipsPerStar;
    const difference = shipsMaximum - shipsCurrent;
    const isPopulationCapped = shipsCurrent >= shipsMaximum;
    return {
      shipsCurrent,
      shipsMaximum,
      difference,
      isPopulationCapped
    };
  }
  produceShips(game) {
    const starsToProduce = game.galaxy.stars.filter((s) => s.infrastructure.industry > 0);
    for (let i = 0; i < starsToProduce.length; i++) {
      let star = starsToProduce[i];
      if (star.ownedByPlayerId) {
        const cap = this.calculatePopulationCap(game, star.ownedByPlayerId);
        if (cap == null ? void 0 : cap.isPopulationCapped) {
          continue;
        }
        const productionShips = this.calculateStarShipProduction(game, star, cap);
        star.shipsActual += productionShips;
        star.ships = Math.floor(star.shipsActual);
      }
    }
  }
  calculateStarShipProduction(game, star, populationCap) {
    const starEffectiveTechs = this.technologyService.getStarEffectiveTechnologyLevels(game, star);
    const maximumShipsAllowed = populationCap ? Math.max(populationCap.difference, 0) : null;
    let productionShips = this.calculateStarShipsByTicks(starEffectiveTechs.manufacturing, star.infrastructure.industry, 1, game.settings.galaxy.productionTicks);
    if (maximumShipsAllowed) {
      productionShips = Math.min(productionShips, maximumShipsAllowed);
    }
    return productionShips;
  }
  calculateStarShipsByTicks(techLevel, industryLevel, ticks = 1, productionTicks = 24) {
    return +(industryLevel * (techLevel + 5) / productionTicks * ticks).toFixed(2);
  }
  calculateStarManufacturing(game, star) {
    var _a;
    let effectiveTechs = this.technologyService.getStarEffectiveTechnologyLevels(game, star);
    let ind = ((_a = star.infrastructure) == null ? void 0 : _a.industry) ?? 0;
    let manufacturing = this.calculateStarShipsByTicks(effectiveTechs.manufacturing, ind, 1, game.settings.galaxy.productionTicks);
    return manufacturing;
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=ship.js.map
