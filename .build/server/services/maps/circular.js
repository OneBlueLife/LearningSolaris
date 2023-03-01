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
var circular_exports = {};
__export(circular_exports, {
  default: () => CircularMapService
});
module.exports = __toCommonJS(circular_exports);
class CircularMapService {
  constructor(randomService, starService, starDistanceService, distanceService, resourceService, gameTypeService) {
    this.randomService = randomService;
    this.starService = starService;
    this.starDistanceService = starDistanceService;
    this.distanceService = distanceService;
    this.resourceService = resourceService;
    this.gameTypeService = gameTypeService;
  }
  generateLocations(game, starCount, resourceDistribution) {
    const starDensity = 1.3 * 10 ** -4;
    const offset = 0.5;
    const maxRadius = (starCount / (Math.PI * starDensity)) ** 0.5;
    const locations = [];
    if (this.gameTypeService.isKingOfTheHillMode(game)) {
      locations.push(this.starDistanceService.getGalacticCenter());
    }
    do {
      while (true) {
        let location = this.randomService.getRandomPositionInCircle(maxRadius, offset);
        if (!this.isLocationTooCloseToOthers(game, location, locations)) {
          locations.push(location);
          break;
        }
      }
    } while (locations.length < starCount);
    this.resourceService.distribute(game, locations, resourceDistribution);
    return locations;
  }
  isLocationTooCloseToOthers(game, location, locations) {
    return locations.find((l) => this.starDistanceService.isLocationTooClose(game, location, l)) != null;
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=circular.js.map
