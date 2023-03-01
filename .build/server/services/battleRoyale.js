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
var battleRoyale_exports = {};
__export(battleRoyale_exports, {
  default: () => BattleRoyaleService
});
module.exports = __toCommonJS(battleRoyale_exports);
class BattleRoyaleService {
  constructor(starService, carrierService, mapService, starDistanceService, waypointService, carrierMovementService) {
    this.starService = starService;
    this.carrierService = carrierService;
    this.mapService = mapService;
    this.starDistanceService = starDistanceService;
    this.waypointService = waypointService;
    this.carrierMovementService = carrierMovementService;
  }
  performBattleRoyaleTick(game) {
    let starsToDestroy = this.getStarsToDestroy(game);
    for (let star of starsToDestroy) {
      this.destroyStar(game, star);
    }
  }
  getStarsToDestroy(game) {
    const peaceCycles = 3;
    if (game.state.productionTick < peaceCycles) {
      return [];
    }
    let galaxyCenter = this.mapService.getGalaxyCenter(game.galaxy.stars.map((s) => s.location));
    let starCountToDestroy = game.settings.general.playerLimit;
    if (game.galaxy.stars.length - starCountToDestroy < 1) {
      starCountToDestroy = game.galaxy.stars.length - 1;
    }
    let starsToDestroy = this.starDistanceService.getFurthestStarsFromLocation(galaxyCenter, game.galaxy.stars, starCountToDestroy);
    return starsToDestroy.sort((a, b) => a._id.toString().localeCompare(b._id.toString()));
  }
  destroyStar(game, star) {
    this.starService.destroyStar(game, star);
    let carriers = this.carrierMovementService.getCarriersEnRouteToStar(game, star);
    for (let carrier of carriers) {
      this.waypointService.cullWaypointsByHyperspaceRange(game, carrier);
      if (this.carrierMovementService.isLostInSpace(game, carrier)) {
        this.carrierService.destroyCarrier(game, carrier);
      }
    }
    carriers = this.carrierService.getCarriersAtStar(game, star._id);
    for (let carrier of carriers) {
      this.carrierService.destroyCarrier(game, carrier);
    }
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=battleRoyale.js.map
