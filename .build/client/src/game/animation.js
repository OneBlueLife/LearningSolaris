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
var animation_exports = {};
__export(animation_exports, {
  default: () => animation_default
});
module.exports = __toCommonJS(animation_exports);
var PIXI = __toESM(require("pixi.js-legacy"));
class AnimationService {
  drawSelectedCircle(app, container, location) {
    let graphics = new PIXI.Graphics();
    graphics.radius = 1;
    graphics.animation = (delta) => {
      if (graphics.alpha <= 0) {
        return;
      }
      graphics.clear();
      graphics.lineStyle(1, 16777215, 0.3);
      graphics.alpha -= 0.02 * delta;
      graphics.radius = graphics.radius + delta;
      graphics.drawCircle(location.x, location.y, graphics.radius);
    };
    app.ticker.add(graphics.animation);
    setTimeout(() => {
      container.removeChild(graphics);
      app.ticker.remove(graphics.animation);
    }, 3e3);
    container.addChild(graphics);
  }
}
var animation_default = new AnimationService();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=animation.js.map
