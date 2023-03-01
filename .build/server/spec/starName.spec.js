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
var import_name = __toESM(require("../services/name"));
const gameNames = [
  "Game 1",
  "Game 2",
  "Game 3",
  "Game 4",
  "Game 5"
];
const starNames = [
  "1",
  "2",
  "3",
  "4",
  "5"
];
describe("star name", () => {
  let randomService;
  let starService;
  beforeEach(() => {
    randomService = new import_random.default();
    starService = new import_name.default(gameNames, starNames, randomService);
  });
  it("should generate a random star name", () => {
    const name = starService.getRandomStarName();
    expect(name).toBeTruthy();
    const i = starNames.find((x) => x == name);
    expect(i).toBeTruthy();
  });
  it("should generate a list of random star names", () => {
    const count = 3;
    const names = starService.getRandomStarNames(count);
    expect(names.length).toEqual(count);
  });
  it("should generate a list of random unique star names", () => {
    const count = 3;
    const names = starService.getRandomStarNames(count);
    const distinct = [...new Set(names)];
    expect(distinct.length).toEqual(count);
  });
});
//# sourceMappingURL=starName.spec.js.map
