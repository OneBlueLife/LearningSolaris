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
var name_exports = {};
__export(name_exports, {
  default: () => NameService
});
module.exports = __toCommonJS(name_exports);
class NameService {
  constructor(gameNames, starNames, randomService) {
    this.gameNames = gameNames;
    this.starNames = starNames;
    this.randomService = randomService;
  }
  getRandomStarName() {
    return this.starNames[this.randomService.getRandomNumber(this.starNames.length - 1)];
  }
  getRandomStarNameInList(starNames) {
    return starNames.splice(this.randomService.getRandomNumber(starNames.length - 1), 1)[0];
  }
  getRandomGameName() {
    return this.gameNames[this.randomService.getRandomNumber(this.gameNames.length - 1)];
  }
  getRandomStarNames(count) {
    const list = [];
    let starNames = this.starNames.slice();
    do {
      let nextName = this.getRandomStarNameInList(starNames);
      if (!list.includes(nextName)) {
        list.push(nextName);
      }
    } while (list.length < count);
    return list;
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=name.js.map
