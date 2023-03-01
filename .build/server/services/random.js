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
var random_exports = {};
__export(random_exports, {
  default: () => RandomService
});
module.exports = __toCommonJS(random_exports);
class RandomService {
  getRandomNumber(max) {
    return Math.floor(Math.random() * max);
  }
  getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  getRandomNumberBetweenEXP(min, max, P1 = 0.5) {
    let P2 = 1 - P1;
    if (P1 <= 0) {
      return max;
    } else if (P1 >= 1) {
      return min;
    }
    let t = Math.random();
    let exp = Math.log(P2) / Math.log(0.5);
    return Math.floor(t ** exp * (max - min + 1) + min);
  }
  getRandomAngle() {
    return Math.random() * Math.PI * 2;
  }
  getRandomRadius(maxRadius, offset) {
    return maxRadius * Math.random() ** offset;
  }
  getRandomRadiusInRange(minRadius, maxRadius) {
    return (Math.random() * (maxRadius ** 2 - minRadius ** 2) + minRadius ** 2) ** 0.5;
  }
  getRandomPositionInCircle(maxRadius, offset = 0.5) {
    let angle = this.getRandomAngle();
    let radius = this.getRandomRadius(maxRadius, offset);
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  }
  getRandomPositionInCircleFromOrigin(originX, originY, radius) {
    let position = this.getRandomPositionInCircle(radius);
    position.x += originX;
    position.y += originY;
    return position;
  }
  getRandomPositionInDoughnut(minRadius, maxRadius) {
    let angle = this.getRandomAngle();
    let radius = this.getRandomRadiusInRange(minRadius, maxRadius);
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  }
  generateStarNaturalResources(radius, x, y, minResources, maxResources, fuzzy = false) {
    const RS_BASE = 2;
    const RS_EXPONENT = 5.8;
    let vector = Math.hypot(x, y);
    let vectorScale = (radius - vector) / radius;
    let resourceRange = maxResources - minResources;
    let naturalResources = minResources + resourceRange * vectorScale;
    if (fuzzy) {
      const FUZZY_LIMIT = 10;
      let floorFuzzyNR = Math.max(minResources, naturalResources - FUZZY_LIMIT);
      let ceilFuzzyNR = Math.min(maxResources, naturalResources + FUZZY_LIMIT);
      naturalResources = this.getRandomNumberBetween(floorFuzzyNR, ceilFuzzyNR);
    }
    naturalResources = Math.max(minResources, naturalResources);
    naturalResources = Math.min(maxResources, naturalResources);
    return naturalResources;
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=random.js.map
