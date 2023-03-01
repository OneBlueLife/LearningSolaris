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
var starDistance_exports = {};
__export(starDistance_exports, {
  default: () => StarDistanceService
});
module.exports = __toCommonJS(starDistance_exports);
class StarDistanceService {
  constructor(distanceService) {
    this.distanceService = distanceService;
  }
  getDistanceBetweenStars(star1, star2) {
    return this.distanceService.getDistanceBetweenLocations(star1.location, star2.location);
  }
  getDistanceBetweenStarAndLocation(star, loc) {
    return this.distanceService.getDistanceBetweenLocations(star.location, loc);
  }
  getClosestStar(star, stars) {
    return this.getClosestStars(star, stars, 1)[0];
  }
  getDistanceToClosestStar(star, stars) {
    let closest = this.getClosestStar(star, stars);
    return this.distanceService.getDistanceBetweenLocations(star.location, closest.location);
  }
  getClosestStars(star, stars, amount) {
    let sorted = stars.filter((s) => s._id !== star._id).sort((a, b) => {
      return this.getDistanceBetweenStars(star, a) - this.getDistanceBetweenStars(star, b);
    });
    return sorted.slice(0, amount);
  }
  getClosestUnownedStars(star, stars, amount) {
    let sorted = stars.filter((s) => s._id !== star._id).filter((s) => !s.ownedByPlayerId).sort((a, b) => {
      return this.getDistanceBetweenStars(star, a) - this.getDistanceBetweenStars(star, b);
    });
    return sorted.slice(0, amount);
  }
  getClosestUnownedStar(star, stars) {
    return this.getClosestUnownedStars(star, stars, 1)[0];
  }
  getClosestOwnedStars(star, stars) {
    return stars.filter((s) => s._id !== star._id).filter((s) => s.ownedByPlayerId).sort((a, b) => {
      return this.getDistanceBetweenStars(star, a) - this.getDistanceBetweenStars(star, b);
    });
  }
  getClosestPlayerOwnedStars(star, stars, player) {
    return this.getClosestOwnedStars(star, stars).filter((s) => s.ownedByPlayerId && s.ownedByPlayerId.toString() === player._id.toString());
  }
  getClosestPlayerOwnedStarsFromLocation(location, stars, ownedByPlayerId) {
    let sorted = stars.filter((s) => s.ownedByPlayerId && s.ownedByPlayerId.toString() === ownedByPlayerId.toString()).sort((a, b) => this.getDistanceBetweenStarAndLocation(a, location) - this.getDistanceBetweenStarAndLocation(b, location));
    return sorted;
  }
  getClosestPlayerOwnedStarsFromLocationWithinDistance(location, stars, ownedByPlayerId, maxDistance) {
    let sorted = stars.filter((s) => s.ownedByPlayerId && s.ownedByPlayerId.toString() === ownedByPlayerId.toString()).filter((s) => {
      let distance = this.getDistanceBetweenStarAndLocation(s, location);
      return maxDistance >= distance;
    }).sort((a, b) => this.getDistanceBetweenStarAndLocation(a, location) - this.getDistanceBetweenStarAndLocation(b, location));
    return sorted;
  }
  getClosestUnownedStarsFromLocation(location, stars, amount) {
    let sorted = stars.filter((s) => !s.ownedByPlayerId).sort((a, b) => this.getDistanceBetweenStarAndLocation(a, location) - this.getDistanceBetweenStarAndLocation(b, location));
    return sorted.slice(0, amount);
  }
  getClosestUnownedStarFromLocation(location, stars) {
    return this.getClosestUnownedStarsFromLocation(location, stars, 1)[0];
  }
  getStarsWithinRadiusOfStar(star, stars, radius) {
    let nearby = stars.filter((s) => s._id !== star._id && this.getDistanceBetweenStars(star, s) <= radius);
    return nearby;
  }
  isStarTooClose(game, star, otherStar) {
    return this.isStarLocationTooClose(game, star.location, otherStar);
  }
  isStarLocationTooClose(game, location, otherStar) {
    return this.isLocationTooClose(game, location, otherStar.location);
  }
  isLocationTooClose(game, location, otherLocation) {
    const distance = this.distanceService.getDistanceBetweenLocations(location, otherLocation);
    return distance < game.constants.distances.minDistanceBetweenStars;
  }
  isDuplicateStarPosition(location, stars) {
    const samePositionStars = stars.filter((star2) => {
      return location.x === star2.location.x && location.y === star2.location.y;
    });
    return samePositionStars.length > 0;
  }
  getClosestStarFromLocation(loc, stars) {
    return this.getClosestStarsFromLocation(loc, stars, 1);
  }
  getClosestStarsFromLocation(loc, stars, amount) {
    let sorted = stars.sort((a, b) => {
      return this.getDistanceBetweenStarAndLocation(a, loc) - this.getDistanceBetweenStarAndLocation(b, loc);
    });
    return sorted.slice(0, amount);
  }
  getFurthestStarsFromLocation(loc, stars, amount) {
    let sorted = stars.sort((a, b) => {
      return this.getDistanceBetweenStarAndLocation(b, loc) - this.getDistanceBetweenStarAndLocation(a, loc);
    });
    return sorted.slice(0, amount);
  }
  getMaxGalaxyDiameter(locations) {
    const diameter = this.getGalaxyDiameter(locations);
    return diameter.x > diameter.y ? diameter.x : diameter.y;
  }
  getGalaxyDiameter(locations) {
    let xArray = locations.map((location) => {
      return location.x;
    });
    let yArray = locations.map((location) => {
      return location.y;
    });
    let maxX = Math.max(...xArray);
    let maxY = Math.max(...yArray);
    let minX = Math.min(...xArray);
    let minY = Math.min(...yArray);
    return {
      x: maxX - minX,
      y: maxY - minY
    };
  }
  getGalacticCenter() {
    return {
      x: 0,
      y: 0
    };
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=starDistance.js.map
