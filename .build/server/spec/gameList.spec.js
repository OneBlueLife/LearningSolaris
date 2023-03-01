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
var import_gameList = __toESM(require("../services/gameList"));
const fakeGameModel = {
  find() {
    return 1;
  }
};
describe("game list", () => {
  let gameListService;
  beforeAll(() => {
    gameListService = new import_gameList.default(fakeGameModel);
  });
  it("should list official games", async () => {
    let result = await gameListService.listOfficialGames();
    expect(result).toBe(1);
  });
});
//# sourceMappingURL=gameList.spec.js.map
