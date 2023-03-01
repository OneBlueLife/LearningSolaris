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
var orbital_exports = {};
__export(orbital_exports, {
  default: () => orbital_default
});
module.exports = __toCommonJS(orbital_exports);
var PIXI = __toESM(require("pixi.js-legacy"));
var import_helpers = __toESM(require("./helpers"));
class OrbitalLocationLayer {
  constructor() {
    this.container = new PIXI.Container();
  }
  setup(game) {
    this.game = game;
  }
  clear() {
    this.container.removeChildren();
  }
  drawStar(star) {
    if (!star.locationNext) {
      return;
    }
    let graphics = new PIXI.Graphics();
    let radius = 4;
    let alpha = 0.2;
    let starPoints = star.homeStar ? 9 : 6;
    let isDeadStar = star.naturalResources != null && star.naturalResources.economy <= 0 && star.naturalResources.industry <= 0 && star.naturalResources.science <= 0;
    let fillStar = !isDeadStar;
    let lineWidth = isDeadStar ? 0.5 : 1;
    graphics.lineStyle(lineWidth, 16777215, alpha);
    if (fillStar) {
      graphics.beginFill(16777215, alpha);
    }
    graphics.drawStar(star.locationNext.x, star.locationNext.y, starPoints, radius, radius - 2);
    if (fillStar) {
      graphics.endFill();
    }
    this.container.addChild(graphics);
  }
  drawCarrier(carrier) {
    if (!carrier.locationNext || carrier.orbiting) {
      return;
    }
    let graphics = new PIXI.Graphics();
    graphics.beginFill(16777215, 0.2);
    graphics.position.x = carrier.locationNext.x;
    graphics.position.y = carrier.locationNext.y;
    graphics.moveTo(0, 0 - 4);
    graphics.lineTo(0 + 1.5, 0 + 1);
    graphics.lineTo(0 + 3, 0 + 2);
    graphics.lineTo(0 + 1, 0 + 2);
    graphics.lineTo(0 + 0, 0 + 3);
    graphics.lineTo(0 + -1, 0 + 2);
    graphics.lineTo(0 - 3, 0 + 2);
    graphics.lineTo(0 - 1.5, 0 + 1);
    graphics.lineTo(0, 0 - 4);
    graphics.endFill();
    graphics.pivot.set(0, 0);
    graphics.scale.set(1);
    import_helpers.default.rotateCarrierTowardsWaypoint(carrier, this.game.galaxy.stars, graphics);
    this.container.addChild(graphics);
  }
}
var orbital_default = OrbitalLocationLayer;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=orbital.js.map
