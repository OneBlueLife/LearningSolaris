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
var map_exports = {};
__export(map_exports, {
  default: () => MapService
});
module.exports = __toCommonJS(map_exports);
var import_validation = __toESM(require("../errors/validation"));
class MapService {
  constructor(randomService, starService, starDistanceService, nameService, circularMapService, spiralMapService, doughnutMapService, circularBalancedMapService, irregularMapService, gameTypeService, customMapService) {
    this.randomService = randomService;
    this.starService = starService;
    this.starDistanceService = starDistanceService;
    this.nameService = nameService;
    this.circularMapService = circularMapService;
    this.spiralMapService = spiralMapService;
    this.doughnutMapService = doughnutMapService;
    this.circularBalancedMapService = circularBalancedMapService;
    this.irregularMapService = irregularMapService;
    this.gameTypeService = gameTypeService;
    this.customMapService = customMapService;
  }
  generateStars(game, starCount, playerLimit, customJSON) {
    let stars = [];
    let homeStars = [];
    let linkedStars = [];
    const starNames = this.nameService.getRandomStarNames(starCount);
    let starLocations = [];
    switch (game.settings.galaxy.galaxyType) {
      case "circular":
        starLocations = this.circularMapService.generateLocations(game, starCount, game.settings.specialGalaxy.resourceDistribution);
        break;
      case "spiral":
        starLocations = this.spiralMapService.generateLocations(game, starCount, game.settings.specialGalaxy.resourceDistribution);
        break;
      case "doughnut":
        starLocations = this.doughnutMapService.generateLocations(game, starCount, game.settings.specialGalaxy.resourceDistribution);
        break;
      case "circular-balanced":
        starLocations = this.circularBalancedMapService.generateLocations(game, starCount, game.settings.specialGalaxy.resourceDistribution, playerLimit);
        break;
      case "irregular":
        starLocations = this.irregularMapService.generateLocations(game, starCount, game.settings.specialGalaxy.resourceDistribution, playerLimit);
        break;
      case "custom":
        starLocations = this.customMapService.generateLocations(customJSON, playerLimit);
        break;
      default:
        throw new import_validation.default(`Galaxy type ${game.settings.galaxy.galaxyType} is not supported or has been disabled.`);
    }
    let isCustomGalaxy = game.settings.galaxy.galaxyType === "custom";
    let starNamesIndex = 0;
    let unlinkedStars = starLocations.filter((l) => !l.linked);
    for (let i = 0; i < unlinkedStars.length; i++) {
      let starLocation = unlinkedStars[i];
      let star;
      let starName = starNames[starNamesIndex++];
      if (isCustomGalaxy) {
        star = this.starService.generateCustomGalaxyStar(starName, starLocation);
      } else {
        star = this.starService.generateUnownedStar(starName, starLocation, starLocation.resources);
      }
      stars.push(star);
      if (starLocation.homeStar) {
        let locLinkedStars = [];
        for (let linkedLocation of starLocation.linkedLocations) {
          let linkedStar;
          let linkedStarName = starNames[starNamesIndex++];
          if (isCustomGalaxy) {
            linkedStar = this.starService.generateCustomGalaxyStar(linkedStarName, linkedLocation);
          } else {
            linkedStar = this.starService.generateUnownedStar(linkedStarName, linkedLocation, linkedLocation.resources);
          }
          stars.push(linkedStar);
          locLinkedStars.push(linkedStar._id);
        }
        homeStars.push(star._id);
        linkedStars.push(locLinkedStars);
      }
    }
    return {
      stars,
      homeStars,
      linkedStars
    };
  }
  generateTerrain(game) {
    const playerCount = game.settings.general.playerLimit;
    if (game.settings.specialGalaxy.randomWarpGates) {
      this.generateGates(game.galaxy.stars, playerCount, game.settings.specialGalaxy.randomWarpGates);
    }
    if (game.settings.specialGalaxy.randomWormHoles) {
      this.generateWormHoles(game, game.galaxy.stars, playerCount, game.settings.specialGalaxy.randomWormHoles);
    }
    if (game.settings.specialGalaxy.randomNebulas) {
      this.generateNebulas(game, game.galaxy.stars, playerCount, game.settings.specialGalaxy.randomNebulas);
    }
    if (game.settings.specialGalaxy.randomAsteroidFields) {
      this.generateAsteroidFields(game, game.galaxy.stars, playerCount, game.settings.specialGalaxy.randomAsteroidFields);
    }
    if (game.settings.specialGalaxy.randomBinaryStars) {
      this.generateBinaryStars(game, game.galaxy.stars, playerCount, game.settings.specialGalaxy.randomBinaryStars);
    }
    if (game.settings.specialGalaxy.randomBlackHoles) {
      this.generateBlackHoles(game, game.galaxy.stars, playerCount, game.settings.specialGalaxy.randomBlackHoles);
    }
    if (game.settings.specialGalaxy.randomPulsars) {
      this.generatePulsars(game, game.galaxy.stars, playerCount, game.settings.specialGalaxy.randomPulsars);
    }
  }
  generateGates(stars, playerCount, percentage) {
    let gateCount = Math.floor((stars.length - playerCount) / 100 * percentage);
    do {
      let star = stars[this.randomService.getRandomNumberBetween(0, stars.length - 1)];
      if (star.homeStar || star.warpGate) {
        gateCount++;
      } else {
        star.warpGate = true;
      }
    } while (gateCount--);
  }
  generateWormHoles(game, stars, playerCount, percentage) {
    let wormHoleCount = Math.floor((stars.length - playerCount) / 2 / 100 * percentage);
    while (wormHoleCount--) {
      const remaining = stars.filter((s) => !s.wormHoleToStarId);
      let starA = remaining[this.randomService.getRandomNumberBetween(0, remaining.length - 1)];
      let starB = remaining[this.randomService.getRandomNumberBetween(0, remaining.length - 1)];
      if (starA.homeStar || starB.homeStar || starA._id.toString() === starB._id.toString() || starA.wormHoleToStarId || starB.wormHoleToStarId) {
        wormHoleCount++;
      } else {
        starA.wormHoleToStarId = starB._id;
        starB.wormHoleToStarId = starA._id;
        if (this.gameTypeService.isSplitResources(game)) {
          let minResources = game.constants.star.resources.maxNaturalResources * 1.5;
          let maxResources = game.constants.star.resources.maxNaturalResources * 3;
          starA.naturalResources.economy = this.randomService.getRandomNumberBetween(minResources, maxResources);
          starB.naturalResources.economy = this.randomService.getRandomNumberBetween(minResources, maxResources);
        }
      }
    }
  }
  generateNebulas(game, stars, playerCount, percentage) {
    let count = Math.floor((stars.length - playerCount) / 100 * percentage);
    do {
      let star = stars[this.randomService.getRandomNumberBetween(0, stars.length - 1)];
      if (star.homeStar || star.isNebula) {
        count++;
      } else {
        star.isNebula = true;
        if (this.gameTypeService.isSplitResources(game)) {
          let minResources = game.constants.star.resources.maxNaturalResources * 1.5;
          let maxResources = game.constants.star.resources.maxNaturalResources * 3;
          star.naturalResources.science = this.randomService.getRandomNumberBetween(minResources, maxResources);
        }
      }
    } while (count--);
  }
  generateAsteroidFields(game, stars, playerCount, percentage) {
    let count = Math.floor((stars.length - playerCount) / 100 * percentage);
    do {
      let star = stars[this.randomService.getRandomNumberBetween(0, stars.length - 1)];
      if (star.homeStar || star.isAsteroidField) {
        count++;
      } else {
        star.isAsteroidField = true;
      }
    } while (count--);
  }
  generateBinaryStars(game, stars, playerCount, percentage) {
    let count = Math.floor((stars.length - playerCount) / 100 * percentage);
    do {
      let star = stars[this.randomService.getRandomNumberBetween(0, stars.length - 1)];
      if (star.homeStar || star.isBinaryStar) {
        count++;
      } else {
        star.isBinaryStar = true;
        let minResources = game.constants.star.resources.maxNaturalResources * 1.5;
        let maxResources = game.constants.star.resources.maxNaturalResources * 3;
        if (this.gameTypeService.isSplitResources(game)) {
          star.naturalResources.industry = this.randomService.getRandomNumberBetween(minResources, maxResources);
        } else {
          let resources = this.randomService.getRandomNumberBetween(minResources, maxResources);
          star.naturalResources = {
            economy: resources,
            industry: resources,
            science: resources
          };
        }
      }
    } while (count--);
  }
  generateBlackHoles(game, stars, playerCount, percentage) {
    let count = Math.floor((stars.length - playerCount) / 100 * percentage);
    do {
      let star = stars[this.randomService.getRandomNumberBetween(0, stars.length - 1)];
      if (star.homeStar || star.isBlackHole) {
        count++;
      } else {
        star.isBlackHole = true;
        star.naturalResources.economy = Math.ceil(star.naturalResources.economy * 0.2);
        star.naturalResources.industry = Math.ceil(star.naturalResources.industry * 0.2);
        star.naturalResources.science = Math.ceil(star.naturalResources.science * 0.2);
      }
    } while (count--);
  }
  generatePulsars(game, stars, playerCount, percentage) {
    let count = Math.floor((stars.length - playerCount) / 100 * percentage);
    do {
      let star = stars[this.randomService.getRandomNumberBetween(0, stars.length - 1)];
      if (star.homeStar || star.isPulsar) {
        count++;
      } else {
        star.isPulsar = true;
      }
    } while (count--);
  }
  getGalaxyCenter(starLocations) {
    if (!starLocations.length) {
      return {
        x: 0,
        y: 0
      };
    }
    let maxX = starLocations.sort((a, b) => b.x - a.x)[0].x;
    let maxY = starLocations.sort((a, b) => b.y - a.y)[0].y;
    let minX = starLocations.sort((a, b) => a.x - b.x)[0].x;
    let minY = starLocations.sort((a, b) => a.y - b.y)[0].y;
    return {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2
    };
  }
  getGalaxyCenterOfMass(starLocations) {
    if (!starLocations.length) {
      return {
        x: 0,
        y: 0
      };
    }
    let totalX = starLocations.reduce((total, s) => total += s.x, 0);
    let totalY = starLocations.reduce((total, s) => total += s.y, 0);
    return {
      x: totalX / starLocations.length,
      y: totalY / starLocations.length
    };
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=map.js.map
