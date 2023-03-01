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
var helpers_exports = {};
__export(helpers_exports, {
  default: () => helpers_default
});
module.exports = __toCommonJS(helpers_exports);
var import_random_seed = __toESM(require("random-seed"));
class Helpers {
  rotateCarrierTowardsWaypoint(carrier, stars, graphics) {
    if (carrier.waypoints.length) {
      let waypoint = carrier.waypoints[0];
      let starDestination = stars.find((s) => s._id === waypoint.destination);
      if (!starDestination) {
        const sourceStar = stars.find((s) => s._id === waypoint.source);
        if (!sourceStar) {
          return;
        }
        const angle2 = this.getAngleTowardsLocation(carrier.location, sourceStar.location);
        graphics.angle = angle2 * (180 / Math.PI) - 90;
        return;
      }
      let destination = starDestination.location;
      let angle = this.getAngleTowardsLocation(carrier.location, destination);
      graphics.angle = angle * (180 / Math.PI) + 90;
    }
  }
  getAngleTowardsLocation(source, destination) {
    let deltaX = destination.x - source.x;
    let deltaY = destination.y - source.y;
    return Math.atan2(deltaY, deltaX);
  }
  calculateDepthModifier(userSettings, seed) {
    if (userSettings.map.objectsDepth === "disabled") {
      return 1;
    }
    const min = 50;
    const max = 100;
    const seededRNG = import_random_seed.default.create();
    seededRNG.seed(seed);
    const alpha = Math.floor(seededRNG.random() * (max - min + 1) + min) / 100;
    return alpha;
  }
  calculateDepthModifiers(userSettings, seeds) {
    if (userSettings.map.objectsDepth === "disabled") {
      return 1;
    }
    const sum = seeds.reduce((a, b) => this.calculateDepthModifier(userSettings, a) + this.calculateDepthModifier(userSettings, b));
    const avg = sum / seeds.length;
    return avg;
  }
}
var helpers_default = new Helpers();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=helpers.js.map
