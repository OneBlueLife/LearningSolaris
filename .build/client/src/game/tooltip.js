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
var tooltip_exports = {};
__export(tooltip_exports, {
  default: () => tooltip_default
});
module.exports = __toCommonJS(tooltip_exports);
var PIXI = __toESM(require("pixi.js-legacy"));
var import_gameHelper = __toESM(require("../services/gameHelper"));
class tooltip_default {
  constructor() {
    this.container = new PIXI.Container();
    this.container.interactive = false;
    this.container.buttonMode = false;
  }
  setup(game) {
    this.game = game;
  }
  clear() {
    if (this.intervalDraw) {
      clearInterval(this.intervalDraw);
      this.intervalDraw = null;
    }
    this.container.removeChildren();
    this.tooltip = null;
  }
  _drawTooltip(tooltipData) {
    this.container.removeChildren();
    this.tooltip = null;
    const player = import_gameHelper.default.getPlayerById(this.game, tooltipData.playerId);
    const paddingX = 2;
    const paddingY = 2;
    const internalContainer = new PIXI.Container();
    internalContainer.x = paddingX;
    internalContainer.y = paddingY;
    let textStyle = new PIXI.TextStyle({
      fontFamily: `Chakra Petch,sans-serif;`,
      fill: 16777215,
      fontSize: 6,
      fontWeight: "bold"
    });
    for (let i = 0; i < tooltipData.detail.length; i++) {
      const text = new PIXI.Text(tooltipData.detail[i], textStyle);
      text.resolution = 12;
      const prev = internalContainer.children[i - 1];
      if (prev) {
        text.y = prev.y + prev.height;
      } else {
        text.y = 0;
      }
      internalContainer.addChild(text);
    }
    let graphics = new PIXI.Graphics();
    graphics.lineStyle(1, player.colour.value);
    graphics.beginFill(0);
    graphics.drawRoundedRect(0, 0, internalContainer.width + paddingX * 2, internalContainer.height + paddingY * 2, 1);
    graphics.endFill();
    this.container.addChild(graphics);
    this.container.addChild(internalContainer);
    if (tooltipData.offset.relative) {
      this.container.x = tooltipData.location.x + tooltipData.offset.x;
      this.container.y = tooltipData.location.y - this.container.height / 2 + tooltipData.offset.y;
    } else {
      this.container.x = tooltipData.location.x + tooltipData.offset.x;
      this.container.y = tooltipData.location.y + tooltipData.offset.y;
    }
  }
  drawTooltipCarrier(carrier) {
    this.clear();
    const redraw = () => {
      const isOwnedByUserPlayer = import_gameHelper.default.isOwnedByUserPlayer(this.game, carrier);
      const detail = [
        `\u23F1\uFE0F ` + import_gameHelper.default.getCountdownTimeStringByTicks(this.game, carrier.ticksEta)
      ];
      if (isOwnedByUserPlayer) {
        detail.push(`${carrier.waypointsLooped ? "\u{1F504}" : "\u{1F4CD}"} ${carrier.waypoints.length} waypoint${carrier.waypoints.length !== 1 ? "s" : ""}`);
      }
      this._drawTooltip({
        playerId: carrier.ownedByPlayerId,
        location: carrier.location,
        detail,
        offset: {
          relative: true,
          x: 6,
          y: 2
        }
      });
    };
    this.intervalDraw = setInterval(redraw, 250);
    redraw();
  }
  drawTooltipStar(star) {
    this.clear();
    const carriers = import_gameHelper.default.getCarriersOrbitingStar(this.game, star);
    if (!carriers.length) {
      return;
    }
    let detail = [];
    if (star.ships != null && star.ships > 0) {
      detail.push(
        `\u2B50 ${star.ships == null ? "???" : star.ships} garrisoned
`
      );
    }
    const carrierStrings = carriers.map((carrier) => {
      const isOwnedByUserPlayer = import_gameHelper.default.isOwnedByUserPlayer(this.game, carrier);
      let result = `
${carrier.name}
 \u{1F680} ${carrier.ships || "???"} ship${carrier.ships !== 1 ? "s" : ""}`;
      if (isOwnedByUserPlayer) {
        result += `
 ${carrier.waypointsLooped ? "\u{1F504}" : "\u{1F4CD}"} ${carrier.waypoints.length} waypoint${carrier.waypoints.length !== 1 ? "s" : ""}`;
      }
      if (carrier.specialist && carrier.specialist.name) {
        result += `
 \u{1F9D1}\u200D\u{1F680} ${carrier.specialist.name}`;
      }
      return result;
    });
    carrierStrings[0] = carrierStrings[0].trim();
    detail = detail.concat(carrierStrings);
    this._drawTooltip({
      playerId: star.ownedByPlayerId,
      location: star.location,
      detail,
      offset: {
        relative: false,
        x: 0,
        y: 6
      }
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=tooltip.js.map
