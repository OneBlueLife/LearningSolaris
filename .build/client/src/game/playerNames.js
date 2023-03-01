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
var playerNames_exports = {};
__export(playerNames_exports, {
  default: () => playerNames_default
});
module.exports = __toCommonJS(playerNames_exports);
var PIXI = __toESM(require("pixi.js-legacy"));
var import_gameHelper = __toESM(require("../services/gameHelper"));
class PlayerNames {
  static zoomLevel = 90;
  constructor() {
    this.container = new PIXI.Container();
    this.zoomPercent = 0;
  }
  setup(game, userSettings) {
    this.game = game;
    PlayerNames.zoomLevel = userSettings.map.zoomLevels.playerNames;
  }
  draw() {
    this.container.removeChildren();
    for (let player of this.game.galaxy.players) {
      let empireCenter = import_gameHelper.default.getPlayerEmpireCenter(this.game, player);
      if (empireCenter == null) {
        continue;
      }
      let style = new PIXI.TextStyle({
        fontFamily: `Chakra Petch,sans-serif;`,
        fill: 16777215,
        padding: 3,
        fontSize: 50
      });
      let textContainer = new PIXI.Container();
      let text_name = new PIXI.Text(player.alias, style);
      text_name.resolution = 2;
      text_name.zIndex = 10;
      let graphics = new PIXI.Graphics();
      graphics.beginFill(player.colour.value);
      graphics.drawRoundedRect(-10, -10, text_name.width + 20, text_name.height + 20, 10);
      graphics.endFill();
      graphics.alpha = 0.7;
      textContainer.x = empireCenter.x - text_name.width / 2;
      textContainer.y = empireCenter.y - text_name.height / 2;
      textContainer.addChild(graphics);
      textContainer.addChild(text_name);
      this.container.addChild(textContainer);
    }
    this.separate();
    this.refreshZoom(this.zoomPercent || 0);
  }
  separate() {
    const rects = this.container.children;
    const hasOverlap = (rectA, rectB) => {
      if (rectA.x >= rectB.x + rectB.width || rectB.x >= rectA.x + rectA.width) {
        return false;
      }
      if (rectA.y >= rectB.y + rectB.height || rectB.y >= rectA.y + rectA.height) {
        return false;
      }
      return true;
    };
    const hasOverlaps = () => {
      for (let i = 0; i < rects.length - 1; i++) {
        for (let ii = 0; ii < rects.length - 1; ii++) {
          if (i === ii) {
            continue;
          }
          if (hasOverlap(rects[i], rects[ii])) {
            return true;
          }
        }
      }
      return false;
    };
    const translate = (rect, index) => {
      const overlapVector = {
        x: 0,
        y: 0
      };
      for (let i = 0; i < rects.length - 1; i++) {
        if (i === index) {
          continue;
        }
        const otherRect = rects[i];
        if (hasOverlap(rect, otherRect)) {
          const rectMidVec = {
            x: (rect.x + rect.x + rect.width) / 2,
            y: (rect.y + rect.y + rect.height) / 2
          };
          const otherMidVec = {
            x: (otherRect.x + otherRect.x + otherRect.width) / 2,
            y: (otherRect.y + otherRect.y + otherRect.height) / 2
          };
          overlapVector.x += rectMidVec.x - otherMidVec.x;
          overlapVector.y += rectMidVec.y - otherMidVec.y;
        }
      }
      return overlapVector;
    };
    const normalize = (vector) => {
      const mag = Math.sqrt(vector.x ** 2 + vector.y ** 2);
      if (mag === 0) {
        return;
      }
      vector.x = vector.x / mag;
      vector.y = vector.y / mag;
    };
    while (hasOverlaps()) {
      for (let i = 0; i < rects.length - 1; i++) {
        const rect = rects[i];
        const newVector = translate(rect, i);
        normalize(newVector);
        rect.x += newVector.x;
        rect.y += newVector.y;
      }
    }
  }
  onTick(zoomPercent, zoomChanging) {
    this.zoomPercent = zoomPercent;
    if (zoomChanging) {
      if (this.container) {
        this.container.visible = zoomPercent <= PlayerNames.zoomLevel;
      }
    }
  }
  refreshZoom(zoomPercent) {
    this.zoomPercent = zoomPercent;
    if (this.container) {
      this.container.visible = zoomPercent <= PlayerNames.zoomLevel;
    }
  }
}
var playerNames_default = PlayerNames;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=playerNames.js.map
