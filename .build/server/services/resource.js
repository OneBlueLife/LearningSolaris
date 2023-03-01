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
var resource_exports = {};
__export(resource_exports, {
  default: () => ResourceService
});
module.exports = __toCommonJS(resource_exports);
class ResourceService {
  constructor(randomService, distanceService, starDistanceService, gameTypeService) {
    this.randomService = randomService;
    this.distanceService = distanceService;
    this.starDistanceService = starDistanceService;
    this.gameTypeService = gameTypeService;
  }
  distribute(game, locations, resourceDistribution) {
    const forcedRandom = ["doughnut", "irregular"].includes(game.settings.galaxy.galaxyType);
    if (resourceDistribution !== "random" && !forcedRandom) {
      return this._distributeWeightedCenter(game, locations);
    }
    return this._distributeRandom(game, locations);
  }
  _distributeRandom(game, locations) {
    let minResources = game.constants.star.resources.minNaturalResources;
    let maxResources = game.constants.star.resources.maxNaturalResources;
    if (game.settings.galaxy.galaxyType === "circular-balanced") {
      this._distributeRandomMirrored(game, locations, minResources, maxResources);
    } else {
      this._distributeRandomAny(game, locations, minResources, maxResources);
    }
  }
  _distributeRandomMirrored(game, locations, minResources, maxResources) {
    let playerCount = game.settings.general.playerLimit;
    const splitRes = this.gameTypeService.isSplitResources(game);
    for (let i = 0; i < locations.length / playerCount; i++) {
      let resources = this._setResources(minResources, maxResources, splitRes);
      for (let j = 0; j < playerCount; j++) {
        locations[i * playerCount + j].resources = resources;
      }
    }
  }
  _distributeRandomAny(game, locations, minResources, maxResources) {
    const splitRes = this.gameTypeService.isSplitResources(game);
    for (let location of locations) {
      location.resources = this._setResources(minResources, maxResources, splitRes);
    }
  }
  _distributeWeightedCenter(game, locations) {
    let minResources = game.constants.star.resources.minNaturalResources;
    let maxResources = game.constants.star.resources.maxNaturalResources;
    let galaxyRadius = this.starDistanceService.getMaxGalaxyDiameter(locations) / 2;
    let galacticCenter = { x: 0, y: 0 };
    if (game.settings.galaxy.galaxyType == "circular-balanced") {
      this._distributeWeightedCenterMirrored(game, locations, minResources, maxResources, galaxyRadius, galacticCenter);
    } else {
      this._distributeWeightedCenterAny(game, locations, minResources, maxResources, galaxyRadius, galacticCenter);
    }
  }
  _distributeWeightedCenterMirrored(game, locations, minResources, maxResources, galaxyRadius, galacticCenter) {
    let playerCount = game.settings.general.playerLimit;
    const splitRes = this.gameTypeService.isSplitResources(game);
    for (let i = 0; i < locations.length / playerCount; i++) {
      let radius = this.distanceService.getDistanceBetweenLocations(galacticCenter, locations[i * playerCount]);
      let resources = this._setResources(minResources, maxResources, splitRes, radius / galaxyRadius * 0.6 + 0.2);
      for (let j = 0; j < playerCount; j++) {
        locations[i * playerCount + j].resources = resources;
      }
    }
  }
  _distributeWeightedCenterAny(game, locations, minResources, maxResources, galaxyRadius, galacticCenter) {
    const splitRes = this.gameTypeService.isSplitResources(game);
    for (let location of locations) {
      let radius = this.distanceService.getDistanceBetweenLocations(galacticCenter, location);
      location.resources = this._setResources(minResources, maxResources, splitRes, radius / galaxyRadius * 0.6 + 0.2);
    }
  }
  _setResources(minResources, maxResources, isSplitResources, EXP = 0.5) {
    if (isSplitResources) {
      return {
        economy: this.randomService.getRandomNumberBetweenEXP(minResources, maxResources, EXP),
        industry: this.randomService.getRandomNumberBetweenEXP(minResources, maxResources, EXP),
        science: this.randomService.getRandomNumberBetweenEXP(minResources, maxResources, EXP)
      };
    }
    let resources = this.randomService.getRandomNumberBetweenEXP(minResources, maxResources, EXP);
    return {
      economy: resources,
      industry: resources,
      science: resources
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=resource.js.map
