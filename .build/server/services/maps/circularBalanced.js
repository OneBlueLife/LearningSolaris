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
var circularBalanced_exports = {};
__export(circularBalanced_exports, {
  default: () => CircularBalancedMapService
});
module.exports = __toCommonJS(circularBalanced_exports);
var import_validation = __toESM(require("../../errors/validation"));
const RNG = require("random-seed");
class CircularBalancedMapService {
  constructor(randomService, starService, starDistanceService, distanceService, resourceService, gameTypeService) {
    this.randomService = randomService;
    this.starService = starService;
    this.starDistanceService = starDistanceService;
    this.distanceService = distanceService;
    this.resourceService = resourceService;
    this.gameTypeService = gameTypeService;
  }
  _generateStarPositionInSector(currentRadius, rng, playerCount) {
    const tau = 2 * Math.PI;
    let angle = rng.random() * (tau / playerCount);
    let posx = 0;
    let posy = currentRadius / 2 + rng.random() * (currentRadius * 2);
    return {
      x: Math.cos(angle) * posx + Math.sin(angle) * posy,
      y: Math.sin(angle) * -posx + Math.cos(angle) * posy,
      linked: false
    };
  }
  _getRotatedLocation(location, angle) {
    return {
      x: Math.cos(angle) * location.x + Math.sin(angle) * location.y,
      y: Math.sin(angle) * -location.x + Math.cos(angle) * location.y,
      homeStar: null,
      distanceToClosestReachable: null,
      closestReachable: null,
      linkedLocations: []
    };
  }
  _moveLocationTowards(location, towards, minDistance) {
    let dx = towards.x - location.x;
    let dy = towards.y - location.y;
    let dist = this.distanceService.getDistanceBetweenLocations(location, towards);
    if (dist < minDistance) {
      return;
    }
    let amount = 1 - minDistance / dist;
    location.x += dx * amount;
    location.y += dy * amount;
  }
  generateLocations(game, starCount, resourceDistribution, playerCount) {
    if (this.gameTypeService.isKingOfTheHillMode(game)) {
      throw new import_validation.default(`King of the hill is not supported in circular balanced maps.`);
    }
    const locations = [];
    let seed = (Math.random() * 10 ** 8).toFixed(0);
    const rng = RNG.create(seed);
    const tau = 2 * Math.PI;
    let currentRadius = game.constants.distances.minDistanceBetweenStars;
    let radiusStep = game.constants.distances.minDistanceBetweenStars;
    let maxTries = 2;
    let sectorAngle = tau / playerCount;
    do {
      let createdLocations = false;
      for (let i = 0; i < maxTries; i++) {
        let candidateLocations = [];
        let baseLocation = this._generateStarPositionInSector(currentRadius, rng, playerCount);
        let locationRejected = false;
        for (let sectorIndex = 0; sectorIndex < playerCount; sectorIndex++) {
          let location = this._getRotatedLocation(baseLocation, sectorIndex * sectorAngle);
          if (this.isLocationTooCloseToOthers(game, location, locations) || this.isLocationTooCloseToOthers(game, location, candidateLocations)) {
            locationRejected = true;
            break;
          }
          candidateLocations.push(location);
        }
        if (locationRejected) {
          continue;
        }
        locations.push(...candidateLocations);
        createdLocations = true;
        break;
      }
      if (!createdLocations) {
        currentRadius += radiusStep;
      }
    } while (locations.length < starCount);
    const distanceFromCenter = this.starDistanceService.getMaxGalaxyDiameter(locations) / 2 / 2;
    let playerAngle = sectorAngle / 2;
    let desiredLocation = this._getRotatedLocation({ x: 0, y: distanceFromCenter }, playerAngle);
    let firstHomeLocation = this.distanceService.getClosestLocation(desiredLocation, locations);
    let firstHomeLocationIndex = locations.indexOf(firstHomeLocation);
    for (let i = 0; i < playerCount; i++) {
      let locationIndex = firstHomeLocationIndex + i;
      locations[locationIndex].homeStar = true;
    }
    let homeLocations = locations.filter((location) => {
      return location.homeStar;
    });
    let initialHyperRange = game.settings.technology.startingTechnologyLevel.hyperspace;
    let startingStarsCount = game.settings.player.startingStars - 1;
    for (let homeLocation of homeLocations) {
      homeLocation.linkedLocations = [];
    }
    let unlinkedLocations = locations.filter((loc) => {
      return !loc.homeStar;
    });
    while (startingStarsCount--) {
      for (let homeLocation of homeLocations) {
        let closestUnlinkedLocation = this.distanceService.getClosestLocation(homeLocation, unlinkedLocations);
        homeLocation.linkedLocations.push(closestUnlinkedLocation);
        closestUnlinkedLocation.linked = true;
        unlinkedLocations = unlinkedLocations.filter((loc) => {
          return loc !== closestUnlinkedLocation;
        });
      }
    }
    let minimumClaimDistance = this.distanceService.getHyperspaceDistance(game, initialHyperRange) - 2;
    for (let homeLocation of homeLocations) {
      let reachableLocations = [];
      let unreachebleLocations = [];
      reachableLocations.push(homeLocation);
      for (let location of homeLocation.linkedLocations) {
        unreachebleLocations.push(location);
      }
      while (unreachebleLocations.length > 0) {
        for (let unreachebleLocation of unreachebleLocations) {
          let distanceToClosestReachable;
          let closestReachableLocation;
          let smallestDistance = Number.MAX_VALUE;
          for (let reachableLocation of reachableLocations) {
            let distance = this.distanceService.getDistanceBetweenLocations(unreachebleLocation, reachableLocation);
            if (distance < smallestDistance) {
              smallestDistance = distance;
              distanceToClosestReachable = distance;
              closestReachableLocation = reachableLocation;
            }
          }
          unreachebleLocation.distanceToClosestReachable = distanceToClosestReachable;
          unreachebleLocation.closestReachable = closestReachableLocation;
        }
        let closestUnreachable = unreachebleLocations[0];
        for (let unreachebleLocation of unreachebleLocations) {
          if (unreachebleLocation.distanceToClosestReachable < closestUnreachable.distanceToClosestReachable) {
            closestUnreachable = unreachebleLocation;
          }
        }
        this._moveLocationTowards(closestUnreachable, closestUnreachable.closestReachable, minimumClaimDistance);
        unreachebleLocations.splice(unreachebleLocations.indexOf(closestUnreachable), 1);
        reachableLocations.push(closestUnreachable);
      }
    }
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
//# sourceMappingURL=circularBalanced.js.map
