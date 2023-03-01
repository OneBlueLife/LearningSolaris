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
var wormHole_exports = {};
__export(wormHole_exports, {
  default: () => wormHole_default
});
module.exports = __toCommonJS(wormHole_exports);
var PIXI = __toESM(require("pixi.js-legacy"));
class WormHoleLayer {
  constructor() {
    this.container = new PIXI.Container();
  }
  setup(game) {
    this.game = game;
  }
  clear() {
    this.container.removeChildren();
  }
  draw() {
    this.clear();
    const stars = this.game.galaxy.stars.filter((s) => s.wormHoleToStarId);
    for (let star of stars) {
      let starPair = stars.find((s) => s._id === star.wormHoleToStarId && s.wormHoleToStarId === star._id);
      if (!starPair) {
        continue;
      }
      let graphics = new PIXI.Graphics();
      let alpha = 0.1;
      let lineWidth = 5;
      graphics.lineStyle(lineWidth, 16777215, alpha);
      graphics.moveTo(star.location.x, star.location.y);
      graphics.lineTo(starPair.location.x, starPair.location.y);
      this.container.addChild(graphics);
    }
  }
}
var wormHole_default = WormHoleLayer;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=wormHole.js.map
