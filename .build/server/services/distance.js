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
var distance_exports = {};
__export(distance_exports, {
  default: () => DistanceService
});
module.exports = __toCommonJS(distance_exports);
class DistanceService {
  getDistanceBetweenLocations(loc1, loc2) {
    return Math.hypot(loc2.x - loc1.x, loc2.y - loc1.y);
  }
  getDistanceAlongLocationList(locations) {
    if (!locations || locations.length < 2) {
      return 0;
    }
    let distance = 0;
    let last = locations[0];
    for (let i = 1; i < locations.length; i++) {
      const current = locations[i];
      distance += this.getDistanceBetweenLocations(last, current);
      last = current;
    }
    return distance;
  }
  getDistanceSquaredBetweenLocations(loc1, loc2) {
    let xs = loc2.x - loc1.x, ys = loc2.y - loc1.y;
    xs *= xs;
    ys *= ys;
    return xs + ys;
  }
  getClosestLocations(loc, locs, amount) {
    let sorted = locs.filter((a) => a.x !== loc.x && a.y !== loc.y).sort((a, b) => {
      return this.getDistanceBetweenLocations(loc, a) - this.getDistanceBetweenLocations(loc, b);
    });
    return sorted.slice(0, amount);
  }
  getClosestLocation(loc, locs) {
    return this.getClosestLocations(loc, locs, 1)[0];
  }
  getDistanceToClosestLocation(loc, locs) {
    let closest = this.getClosestLocation(loc, locs);
    return this.getDistanceBetweenLocations(loc, closest);
  }
  getFurthestLocations(loc, locs, amount) {
    return this.getClosestLocations(loc, locs, locs.length).reverse().slice(0, amount);
  }
  getFurthestLocation(loc, locs) {
    return this.getFurthestLocations(loc, locs, 1)[0];
  }
  getScanningDistance(game, scanning) {
    return ((scanning || 1) + 1) * game.constants.distances.lightYear;
  }
  getHyperspaceDistance(game, hyperspace) {
    return ((hyperspace || 1) + 1.5) * game.constants.distances.lightYear;
  }
  getAngleTowardsLocation(source, destination) {
    let deltaX = destination.x - source.x;
    let deltaY = destination.y - source.y;
    return Math.atan2(deltaY, deltaX);
  }
  getNextLocationTowardsLocation(source, destination, distance) {
    let angle = this.getAngleTowardsLocation(source, destination);
    return {
      x: source.x + distance * Math.cos(angle),
      y: source.y + distance * Math.sin(angle)
    };
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=distance.js.map
