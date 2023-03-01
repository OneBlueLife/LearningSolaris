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
var irregular_exports = {};
__export(irregular_exports, {
  default: () => IrregularMapService
});
module.exports = __toCommonJS(irregular_exports);
var import_validation = __toESM(require("../../errors/validation"));
const randomSeeded = require("random-seed");
const simplexNoise = require("simplex-noise");
class IrregularMapService {
  constructor(randomService, starService, starDistanceService, distanceService, resourceService, gameTypeService) {
    this.randomService = randomService;
    this.starService = starService;
    this.starDistanceService = starDistanceService;
    this.distanceService = distanceService;
    this.resourceService = resourceService;
    this.gameTypeService = gameTypeService;
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
  _removeLocationFromArray(array, location) {
    let index = array.indexOf(location);
    array.splice(index, 1);
  }
  _rotatedLocation(location, angle) {
    return {
      x: Math.cos(angle) * location.x + Math.sin(angle) * location.y,
      y: Math.sin(angle) * -location.x + Math.cos(angle) * location.y
    };
  }
  _displacedLocation(location1, location2) {
    return {
      x: location1.x + location2.x,
      y: location1.y + location2.y
    };
  }
  _getRingCount(starsPerPlayerMin, starsPerPlayerMax) {
    let ringCount = this._getNecessaryRingCount(starsPerPlayerMin) + 1;
    while (this._getStarCountInRings(ringCount) < starsPerPlayerMax) {
      ringCount += 1;
    }
    return ringCount - 1;
  }
  _getStarCountInRings(ringCount) {
    let starCount = 0;
    let ringIndex = 0;
    let lastRingPruning = 0;
    while (ringIndex < ringCount) {
      starCount += lastRingPruning;
      starCount += 6 + ringIndex * 6;
      lastRingPruning = 4 + ringIndex * 6 / 2;
      starCount -= lastRingPruning;
      ringIndex += 1;
    }
    return starCount;
  }
  _getNecessaryRingCount(starsPerPlayer) {
    let starCount = 0;
    let ringIndex = 0;
    let lastRingPruning = 0;
    while (starCount < starsPerPlayer) {
      starCount += lastRingPruning;
      starCount += 6 + ringIndex * 6;
      lastRingPruning = 4 + ringIndex * 6 / 2;
      starCount -= lastRingPruning;
      ringIndex += 1;
    }
    return ringIndex;
  }
  _generateHomeLocations(pivotDistance, playerCount, rng, simplexNoiseGenerator, noiseSpread) {
    const ONE_SIXTH = 1 / 6;
    const TAU = 2 * Math.PI;
    let homeLocations = [];
    let firstLocation = {
      x: 0,
      y: 0
    };
    homeLocations.push(firstLocation);
    while (homeLocations.length < playerCount) {
      let position;
      let positionIsValid = false;
      let attempts = 0;
      while (!positionIsValid) {
        let baseLocation = homeLocations[rng.range(homeLocations.length)];
        let pivot = { x: pivotDistance, y: 0 };
        let pivotRotation = ONE_SIXTH * TAU * rng.range(6);
        pivot = this._rotatedLocation(pivot, pivotRotation);
        pivot = this._displacedLocation(baseLocation, pivot);
        position = { x: pivotDistance, y: 0 };
        let rotation;
        if (rng.random() < 0.5) {
          rotation = pivotRotation - ONE_SIXTH * TAU;
        } else {
          rotation = pivotRotation + ONE_SIXTH * TAU;
        }
        position = this._rotatedLocation(position, rotation);
        position = this._displacedLocation(position, pivot);
        position.noiseIntensity = simplexNoiseGenerator.noise2D(position.x / noiseSpread, position.y / noiseSpread);
        positionIsValid = true;
        for (let homeLocation of homeLocations) {
          if (this.distanceService.getDistanceBetweenLocations(position, homeLocation) < pivotDistance) {
            positionIsValid = false;
            break;
          }
          if (position.noiseIntensity > 0.65 && attempts < 6) {
            positionIsValid = false;
            attempts += 1;
            break;
          }
        }
      }
      homeLocations.push(position);
    }
    return homeLocations;
  }
  _generateSupplementaryHomeLocations(pivotDistance, homeLocations) {
    const ONE_SIXTH = 1 / 6;
    const TAU = 2 * Math.PI;
    let supplementaryHomeLocations = [];
    for (let homeLocation of homeLocations) {
      for (let i = 0; i < 6; i++) {
        let pivot = { x: pivotDistance, y: 0 };
        let pivotRotation = ONE_SIXTH * TAU * i;
        pivot = this._rotatedLocation(pivot, pivotRotation);
        pivot = this._displacedLocation(homeLocation, pivot);
        let position = { x: pivotDistance, y: 0 };
        let rotation = ONE_SIXTH * TAU * (i + 1);
        position = this._rotatedLocation(position, rotation);
        position = this._displacedLocation(pivot, position);
        let isValidPosiiton = true;
        for (let homeLocation2 of homeLocations) {
          if (this.distanceService.getDistanceBetweenLocations(homeLocation2, position) < pivotDistance) {
            isValidPosiiton = false;
          }
        }
        for (let supplementaryHomeLocation of supplementaryHomeLocations) {
          if (this.distanceService.getDistanceBetweenLocations(supplementaryHomeLocation, position) < pivotDistance) {
            isValidPosiiton = false;
          }
        }
        if (isValidPosiiton) {
          supplementaryHomeLocations.push(position);
        }
      }
    }
    return supplementaryHomeLocations;
  }
  _generateConcentricHexRingsLocations(baseLocation, ringCount, distance, locations) {
    const ONE_SIXTH = 1 / 6;
    const TAU = 2 * Math.PI;
    for (let ringIndex = 0; ringIndex < ringCount; ringIndex++) {
      for (let sliceIndex = 0; sliceIndex < 6; sliceIndex++) {
        if (ringIndex == ringCount - 1 && sliceIndex < 3) {
          continue;
        }
        let position = { x: distance + distance * ringIndex, y: 0 };
        let rotation = sliceIndex * ONE_SIXTH * TAU;
        position = this._rotatedLocation(position, rotation);
        position = this._displacedLocation(baseLocation, position);
        if (ringIndex != ringCount - 1 || sliceIndex == 3 || sliceIndex == 4) {
          locations.push(position);
        }
        for (let i = 0; i < ringIndex; i++) {
          let edgePosition = { x: distance * (i + 1), y: 0 };
          let edgeRotation = (sliceIndex + 2) * (ONE_SIXTH * TAU);
          edgePosition = this._rotatedLocation(edgePosition, edgeRotation);
          edgePosition = this._displacedLocation(position, edgePosition);
          locations.push(edgePosition);
        }
      }
    }
  }
  _randomlyDislocateLocations(locations, threshold, rng) {
    const ONE_SIXTH = 1 / 6;
    const TAU = 2 * Math.PI;
    for (let location of locations) {
      let amount = 3 * (threshold / 4) + rng.random() * threshold / 4;
      let rotation = rng.random() * TAU;
      let dislocation = { x: amount, y: 0 };
      dislocation = this._rotatedLocation(dislocation, rotation);
      let newLocation = this._displacedLocation(location, dislocation);
      location.x = newLocation.x;
      location.y = newLocation.y;
    }
  }
  _pruneLocationsWithNoise(locations, desiredLocationCount, simplexNoiseGenerator, noiseSpread) {
    for (let location of locations) {
      location.noiseIntensity = simplexNoiseGenerator.noise2D(location.x / noiseSpread, location.y / noiseSpread);
    }
    locations.sort((loc1, loc2) => {
      return loc1.noiseIntensity - loc2.noiseIntensity;
    });
    locations.splice(desiredLocationCount);
  }
  _pruneLocationsOutsideMetaball(locations, homeLocations, homeStarRadius, rng) {
    const METABALL_FALLOFF = 8;
    let toRemove = [];
    for (let location of locations) {
      let metaballFieldIntensity = 0;
      for (let homeLocation of homeLocations) {
        let distance = this.distanceService.getDistanceBetweenLocations(homeLocation, location);
        distance = homeStarRadius / distance;
        metaballFieldIntensity += Math.pow(distance, METABALL_FALLOFF);
      }
      let chanceToRemove = 1 - metaballFieldIntensity;
      if (rng.random() < chanceToRemove) {
        toRemove.push(location);
      }
    }
    for (let location of toRemove) {
      this._removeLocationFromArray(locations, location);
    }
  }
  generateLocations(game, starCount, resourceDistribution, playerCount) {
    if (this.gameTypeService.isKingOfTheHillMode(game)) {
      throw new import_validation.default(`King of the hill is not supported in irregular maps.`);
    }
    const SEED = (Math.random() * 10 ** 8).toFixed(0);
    const SPREAD = 2.5;
    const RNG = randomSeeded.create(SEED);
    const SIMPLEX_NOISE = new simplexNoise(SEED);
    const NOISE_BASE_SPREAD = 32;
    const TAU = 2 * Math.PI;
    const STARS_PER_PLAYER = starCount / playerCount;
    const INITIAL_HYPER_RANGE = game.settings.technology.startingTechnologyLevel.hyperspace;
    const STARTING_STAR_COUNT = game.settings.player.startingStars - 1;
    const MINIMUM_STAR_DISTANCE = game.constants.distances.minDistanceBetweenStars * 0.75;
    const NOISE_SPREAD = NOISE_BASE_SPREAD * ((STARS_PER_PLAYER + 20) / 9);
    const STAR_COUNT_MULTIPLYER = 1.3;
    const RING_COUNT = this._getRingCount(STARS_PER_PLAYER, STARS_PER_PLAYER * STAR_COUNT_MULTIPLYER);
    const STAR_DISTANCE = MINIMUM_STAR_DISTANCE * SPREAD;
    const STAR_DISLOCATION_THRESHOLD = MINIMUM_STAR_DISTANCE * ((SPREAD - 1) / 2);
    const PIVOT_DISTANCE = RING_COUNT * STAR_DISTANCE;
    let locations = [];
    let homeLocations = this._generateHomeLocations(PIVOT_DISTANCE, playerCount, RNG, SIMPLEX_NOISE, NOISE_SPREAD);
    let supplementaryHomeLocations = this._generateSupplementaryHomeLocations(PIVOT_DISTANCE, homeLocations);
    let baseLocations = [];
    let supplementaryLocations = [];
    for (let homeLocation of homeLocations) {
      this._generateConcentricHexRingsLocations(homeLocation, RING_COUNT, STAR_DISTANCE, baseLocations);
    }
    for (let supplementaryHomeLocation of supplementaryHomeLocations) {
      this._generateConcentricHexRingsLocations(supplementaryHomeLocation, RING_COUNT, STAR_DISTANCE, supplementaryLocations);
    }
    locations = locations.concat(baseLocations, supplementaryLocations);
    this._pruneLocationsOutsideMetaball(locations, homeLocations, PIVOT_DISTANCE, RNG);
    this._randomlyDislocateLocations(locations, STAR_DISLOCATION_THRESHOLD, RNG);
    this._pruneLocationsWithNoise(locations, starCount - playerCount, SIMPLEX_NOISE, NOISE_SPREAD);
    for (let homeLocation of homeLocations) {
      homeLocation.homeStar = true;
      homeLocation.linkedLocations = [];
    }
    let unlinkedLocations = locations.filter((loc) => {
      return true;
    });
    let startingStarsCount = STARTING_STAR_COUNT;
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
    let minimumClaimDistance = this.distanceService.getHyperspaceDistance(game, INITIAL_HYPER_RANGE) - 2;
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
    locations = locations.concat(homeLocations);
    this.resourceService.distribute(game, locations, resourceDistribution);
    return locations;
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=irregular.js.map
