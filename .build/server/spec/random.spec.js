"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_random = __toESM(require("../services/random"));
describe("random", () => {
  let randomService;
  beforeEach(() => {
    randomService = new import_random.default();
  });
  it("should generate a random number", () => {
    const max = 10;
    const res = randomService.getRandomNumber(max);
    expect(res).toBeGreaterThanOrEqual(0);
    expect(res).toBeLessThan(max);
  });
  it("should generate a random number between x and y", () => {
    const min = 0;
    const max = 10;
    const res = randomService.getRandomNumberBetween(min, max);
    expect(res).toBeGreaterThanOrEqual(min);
    expect(res).toBeLessThanOrEqual(max);
  });
  it("should generate a random angle", () => {
    const res = randomService.getRandomAngle();
    expect(res).toBeGreaterThanOrEqual(0);
    expect(res).toBeLessThanOrEqual(1 + Math.PI * 2);
  });
  it("should generate a random position in a circle", () => {
    const radius = 10;
    const res = randomService.getRandomPositionInCircle(radius);
    expect(res).not.toBe(null);
    expect(res.x).toBeGreaterThanOrEqual(radius * -1);
    expect(res.x).toBeLessThanOrEqual(radius);
    expect(res.y).toBeGreaterThanOrEqual(radius * -1);
    expect(res.y).toBeLessThanOrEqual(radius);
  });
  describe("generateStarNaturalResources", () => {
    const minResourceValue = 10;
    const maxResourceValue = 50;
    let radius;
    it("should generate a minimum resource score", () => {
      radius = 5;
      let x = 3;
      let y = 4;
      let res = randomService.generateStarNaturalResources(radius, x, y, minResourceValue, maxResourceValue);
      expect(res).toBe(minResourceValue);
      radius = Math.sqrt(5);
      x = 1;
      y = 2;
      res = randomService.generateStarNaturalResources(radius, x, y, minResourceValue, maxResourceValue);
      expect(res).toBe(minResourceValue);
    });
    it("should generate a maximum resource score", () => {
      let radius2 = 5;
      let x = 0;
      let y = 0;
      let res = randomService.generateStarNaturalResources(radius2, x, y, minResourceValue, maxResourceValue);
      expect(res).toBe(maxResourceValue);
      radius2 = 10;
      res = randomService.generateStarNaturalResources(radius2, x, y, minResourceValue, maxResourceValue);
      expect(res).toBe(maxResourceValue);
    });
    it("should generate a resource score based on the distance from the centre", () => {
      const radius2 = 5;
      let x = 0;
      let y = 0;
      let limit = Math.sqrt(Math.pow(radius2) / 2);
      let lastRes = maxResourceValue;
      for (let i = 0; i < limit; i += 0.5) {
        x = i;
        y = i;
        let res = randomService.generateStarNaturalResources(radius2, x, y, minResourceValue, maxResourceValue);
        expect(res).toBeGreaterThanOrEqual(minResourceValue);
        expect(res).toBeLessThanOrEqual(maxResourceValue);
        expect(res).toBeLessThan(lastRes);
        lastRes = res;
      }
    });
  });
});
//# sourceMappingURL=random.spec.js.map
