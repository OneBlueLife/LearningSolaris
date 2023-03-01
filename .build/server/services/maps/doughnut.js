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
var doughnut_exports = {};
__export(doughnut_exports, {
  default: () => DoughnutMapService
});
module.exports = __toCommonJS(doughnut_exports);
var import_validation = __toESM(require("../../errors/validation"));
class DoughnutMapService {
  constructor(randomService, starService, starDistanceService, distanceService, resourceService, gameTypeService) {
    this.randomService = randomService;
    this.starService = starService;
    this.starDistanceService = starDistanceService;
    this.distanceService = distanceService;
    this.resourceService = resourceService;
    this.gameTypeService = gameTypeService;
  }
  generateLocations(game, starCount, resourceDistribution) {
    if (this.gameTypeService.isKingOfTheHillMode(game)) {
      throw new import_validation.default(`King of the hill is not supported in doughnut maps.`);
    }
    const starDensity = 1.3 * 10 ** -4;
    const maxRadius = (4 * starCount / (3 * Math.PI * starDensity)) ** 0.5;
    const locations = [];
    do {
      while (true) {
        let location = this.randomService.getRandomPositionInDoughnut(0.5 * maxRadius, maxRadius);
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
//# sourceMappingURL=doughnut.js.map
