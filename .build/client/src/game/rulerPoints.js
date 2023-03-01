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
var rulerPoints_exports = {};
__export(rulerPoints_exports, {
  default: () => rulerPoints_default
});
module.exports = __toCommonJS(rulerPoints_exports);
var PIXI = __toESM(require("pixi.js-legacy"));
var import_events = __toESM(require("events"));
class RulerPoints extends import_events.default {
  constructor() {
    super();
    this.container = new PIXI.Container();
  }
  setup(game) {
    this.game = game;
    this.rulerPoints = [];
    this.lightYearDistance = game.constants.distances.lightYear;
    this.techLevel = 1;
    let userPlayer = game.galaxy.players.find((x) => x.userId);
    if (userPlayer) {
      this.techLevel = userPlayer.research.hyperspace.level;
    }
    this.emit("onRulerPointsCleared");
    this.clear();
  }
  clear() {
    this.container.removeChildren();
  }
  draw() {
    this.clear();
    this.drawPaths();
    this.drawHyperspaceRange();
  }
  drawPaths() {
    if (!this.rulerPoints.length) {
      return;
    }
    let graphics = new PIXI.Graphics();
    let firstPoint = this.rulerPoints[0];
    graphics.moveTo(firstPoint.location.x, firstPoint.location.y);
    graphics.lineStyle(1, 16777215, 0.8);
    for (let i = 1; i < this.rulerPoints.length; i++) {
      let point = this.rulerPoints[i];
      graphics.lineTo(point.location.x, point.location.y);
    }
    this.container.addChild(graphics);
  }
  drawHyperspaceRange() {
    let lastPoint = this.rulerPoints[this.rulerPoints.length - 1];
    if (!lastPoint) {
      return;
    }
    let graphics = new PIXI.Graphics();
    let radius = ((this.techLevel || 1) + 1.5) * this.lightYearDistance;
    graphics.lineStyle(1, 16777215, 0.2);
    graphics.beginFill(16777215, 0.075);
    graphics.drawStar(lastPoint.location.x, lastPoint.location.y, radius, radius, radius - 3);
    graphics.endFill();
    graphics.zIndex = -1;
    this.container.addChild(graphics);
  }
  onStarClicked(e) {
    this._createRulerPoint({
      type: "star",
      object: e,
      location: e.location
    });
  }
  onCarrierClicked(e) {
    this._createRulerPoint({
      type: "carrier",
      object: e,
      location: e.location
    });
  }
  removeLastRulerPoint() {
    const old = this.rulerPoints.pop();
    this.draw();
    this.emit("onRulerPointRemoved", old);
  }
  _createRulerPoint(desiredPoint) {
    let lastPoint = this.rulerPoints[this.rulerPoints.length - 1];
    if (lastPoint && lastPoint.location.x === desiredPoint.location.x && lastPoint.location.y === desiredPoint.location.y) {
      return;
    }
    desiredPoint.distance = this.rulerPoints.push(desiredPoint);
    this.draw();
    this.emit("onRulerPointCreated", desiredPoint);
  }
}
var rulerPoints_default = RulerPoints;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=rulerPoints.js.map
