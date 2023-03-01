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
var carrier_exports = {};
__export(carrier_exports, {
  default: () => carrier_default
});
module.exports = __toCommonJS(carrier_exports);
var PIXI = __toESM(require("pixi.js-legacy"));
var import_events = __toESM(require("events"));
var import_texture = __toESM(require("./texture"));
var import_helpers = __toESM(require("./helpers"));
class Carrier extends import_events.default {
  static culling_margin = 16;
  static zoomLevel = 140;
  constructor(pathManager) {
    super();
    this.container = new PIXI.Container();
    this.fixedContainer = new PIXI.Container();
    this.container.interactive = true;
    this.container.interactiveChildren = false;
    this.container.buttonMode = true;
    this.graphics_colour = new PIXI.Sprite();
    this.graphics_selected = new PIXI.Graphics();
    this.graphics_ship = new PIXI.Graphics();
    this.container.addChild(this.graphics_colour);
    this.container.addChild(this.graphics_selected);
    this.container.addChild(this.graphics_ship);
    this.container.on("pointerup", this.onClicked.bind(this));
    this.container.on("mouseover", this.onMouseOver.bind(this));
    this.container.on("mouseout", this.onMouseOut.bind(this));
    this.pathManager = pathManager;
    this.sharedPathsIDs = Array();
    this.uniquePaths = Array();
    this.isMouseOver = false;
    this.zoomPercent = 100;
  }
  setup(data, userSettings, stars, player, lightYearDistance) {
    this.data = data;
    this.stars = stars;
    this.player = player;
    this.colour = player.colour.value;
    this.lightYearDistance = lightYearDistance;
    this.container.position.x = data.location.x;
    this.container.position.y = data.location.y;
    this.container.hitArea = new PIXI.Circle(0, 0, 10);
    this.userSettings = userSettings;
    this.clampedScaling = this.userSettings.map.objectsScaling == "clamped";
    this.baseScale = 1;
    this.minScale = this.userSettings.map.objectsMinimumScale / 4;
    this.maxScale = this.userSettings.map.objectsMaximumScale / 4;
    Carrier.zoomLevel = userSettings.map.zoomLevels.carrierShips;
    this.clearPaths();
    this.enableInteractivity();
  }
  draw() {
    this.drawColour();
    this.drawSelectedCircle();
    this.drawCarrier();
    this.drawShips();
    this.drawSpecialist();
    this.drawCarrierWaypoints();
    this.drawDepth();
  }
  drawActive() {
    this.drawShips();
  }
  drawShape() {
    if (this.graphics_colour) {
      this.container.removeChild(this.graphics_colour);
      this.graphics_colour = null;
    }
    if (Object.keys(import_texture.default.PLAYER_SYMBOLS).includes(this.player.shape)) {
      this.graphics_colour = new PIXI.Sprite(import_texture.default.PLAYER_SYMBOLS[this.player.shape][4]);
    }
    this.graphics_colour.anchor.set(0.5);
    this.graphics_colour.width = 12;
    this.graphics_colour.height = 12;
    this.graphics_colour.tint = this.colour;
    this.container.addChild(this.graphics_colour);
  }
  drawColour() {
    if (this.graphics_colour) {
      this.container.removeChild(this.graphics_colour);
      this.graphics_colour = null;
    }
    if (!this.data.orbiting) {
      this.drawShape();
    }
  }
  drawCarrier() {
    if (this.graphics_ship) {
      this.container.removeChild(this.graphics_ship);
    }
    this.graphics_ship = new PIXI.Sprite(import_texture.default.CARRIER_TEXTURE);
    this.graphics_ship.anchor.set(0.5);
    this.graphics_ship.width = 10;
    this.graphics_ship.height = 10;
    this.container.addChild(this.graphics_ship);
    import_helpers.default.rotateCarrierTowardsWaypoint(this.data, this.stars.map((s) => s.data), this.graphics_ship);
  }
  drawShips() {
    if (this.text_ships) {
      this.container.removeChild(this.text_ships);
      this.text_ships = null;
    }
    if (!this.text_ships) {
      let totalShips = this.data.ships == null ? "???" : this.data.ships;
      let shipsText = totalShips.toString();
      let bitmapFont = { fontName: "chakrapetch", fontSize: 4 };
      this.text_ships = new PIXI.BitmapText(shipsText, bitmapFont);
      this.text_ships.x = -(this.text_ships.width / 2);
      this.text_ships.y = 5;
      this.container.addChild(this.text_ships);
      if (this.data.isGift) {
        let style = new PIXI.TextStyle({
          fontFamily: `Chakra Petch,sans-serif;`,
          fill: 16777215,
          padding: 3,
          fontSize: 4,
          fontWeight: "bold"
        });
        let giftText = new PIXI.Text("\u{1F381}", style);
        giftText.resolution = 12;
        giftText.position.x = this.text_ships.width;
        giftText.position.y = -1;
        this.text_ships.addChild(giftText);
      }
    }
  }
  drawSpecialist() {
    if (this.specialistSprite) {
      this.container.removeChild(this.specialistSprite);
      this.specialistSprite = null;
    }
    if (!this.hasSpecialist() || this.data.orbiting) {
      return;
    }
    let specialistTexture = import_texture.default.getSpecialistTexture(this.data.specialist.key);
    this.specialistSprite = new PIXI.Sprite(specialistTexture);
    this.specialistSprite.width = 6;
    this.specialistSprite.height = 6;
    this.specialistSprite.x = -3;
    this.specialistSprite.y = -3;
    this.container.addChild(this.specialistSprite);
  }
  hasSpecialist() {
    return this.data.specialistId && this.data.specialistId > 0 && this.data.specialist;
  }
  clearPaths() {
    for (let path of this.uniquePaths) {
      this.pathManager.removeUniquePath(path);
    }
    for (let pathID of this.sharedPathsIDs) {
      this.pathManager.removeSharedPath(pathID, this);
    }
    this.uniquePaths = Array();
    this.sharedPathsIDs = Array();
  }
  _isSourceLastDestination() {
    let numof_waypoints = this.data.waypoints.length;
    let lastWaypoint = this.data.waypoints[numof_waypoints - 1];
    if (numof_waypoints < 2)
      return false;
    return this.data.waypoints[0].source === lastWaypoint.destination;
  }
  drawCarrierWaypoints() {
    this.clearPaths();
    const PATH_WIDTH = 0.5 * this.userSettings.map.carrierPathWidth;
    let lineWidth = this.data.waypointsLooped ? PATH_WIDTH : PATH_WIDTH;
    let lineAlpha = this.data.waypointsLooped ? 0.3 : 0.5;
    let lastPoint = this;
    let sourceIsLastDestination = false;
    sourceIsLastDestination = this._isSourceLastDestination();
    if (this.data.waypointsLooped) {
      if (sourceIsLastDestination) {
        lastPoint = this.stars.find((s) => s.data._id === this.data.waypoints[0].source);
      }
    }
    let star;
    for (let i = 0; i < this.data.waypoints.length; i++) {
      let waypoint = this.data.waypoints[i];
      star = this.stars.find((s) => s.data._id === waypoint.destination);
      if (!star) {
        break;
      }
      if (this.data.waypointsLooped) {
        if (lastPoint === this) {
          this.uniquePaths.push(this.pathManager.addUniquePath(lastPoint, star, true, this.colour));
        } else {
          this.sharedPathsIDs.push(this.pathManager.addSharedPath(lastPoint, star, this));
        }
      } else {
        this.uniquePaths.push(this.pathManager.addUniquePath(lastPoint, star, false, this.colour));
      }
      lastPoint = star;
    }
    if (this.data.waypointsLooped) {
      if (!sourceIsLastDestination && this.data.waypoints && this.data.waypoints.length) {
        let firstPoint = this.stars.find((s) => s.data._id === this.data.waypoints[0].destination);
        if (firstPoint && lastPoint && firstPoint !== lastPoint) {
          this.sharedPathsIDs.push(this.pathManager.addSharedPath(star, firstPoint, this));
        }
      }
    }
  }
  drawSelectedCircle() {
    this.graphics_selected.clear();
    if (this.isSelected) {
      this.graphics_selected.lineStyle(0.5, 16777215);
      this.graphics_selected.alpha = 0.3;
      this.graphics_selected.drawCircle(0, 0, 15);
    }
  }
  drawDepth() {
    if (!this.data.orbiting) {
      const waypoint = this.data.waypoints[0];
      const seeds = [waypoint.source, waypoint.destination];
      const depth = import_helpers.default.calculateDepthModifiers(this.userSettings, seeds);
      this.container.alpha = depth;
      this.baseScale = depth * (this.userSettings.map.objectsDepth === "disabled" ? 1 : 1.5);
    } else {
      this.container.alpha = 1;
    }
  }
  enableInteractivity() {
    if (!this.data.orbiting) {
      this.container.interactive = true;
      this.container.buttonMode = true;
    } else {
      this.container.interactive = false;
      this.container.buttonMode = false;
    }
  }
  disableInteractivity() {
    this.container.interactive = false;
    this.container.buttonMode = false;
  }
  onZoomChanging(zoomPercent) {
    this.zoomPercent = zoomPercent;
    this.setScale(zoomPercent);
    this.updateVisibility();
  }
  setScale(zoomPercent) {
    if (this.clampedScaling) {
      let currentScale = zoomPercent / 100;
      if (currentScale < this.minScale) {
        this.container.scale.x = 1 / currentScale * this.minScale;
        this.container.scale.y = 1 / currentScale * this.minScale;
      } else if (currentScale > this.maxScale) {
        this.container.scale.x = 1 / currentScale * this.maxScale;
        this.container.scale.y = 1 / currentScale * this.maxScale;
      } else {
        this.container.scale.x = this.baseScale;
        this.container.scale.y = this.baseScale;
      }
    } else {
      this.container.scale.x = this.baseScale;
      this.container.scale.y = this.baseScale;
    }
  }
  onClicked(e) {
    if (e && e.data && e.data.originalEvent && e.data.originalEvent.button === 2) {
      this.emit("onCarrierRightClicked", this.data);
    } else {
      let eventData = e ? e.data : null;
      this.emit("onCarrierClicked", { carrierData: this.data, eventData });
      this.deselectAllText();
    }
  }
  updateVisibility() {
    if (this.graphics_ship)
      this.graphics_ship.visible = !this.data.orbiting && !this.hasSpecialist();
    if (this.text_ships)
      this.text_ships.visible = !this.data.orbiting && (this.zoomPercent >= Carrier.zoomLevel || this.isSelected && this.zoomPercent > Carrier.zoomLevel || this.isMouseOver && this.zoomPercent > Carrier.zoomLevel);
  }
  deselectAllText() {
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else if (document.selection) {
      document.selection.empty();
    }
  }
  onMouseOver(e) {
    this.isMouseOver = true;
    this.emit("onCarrierMouseOver", this);
  }
  onMouseOut(e) {
    this.isMouseOver = false;
    this.emit("onCarrierMouseOut", this);
  }
  refreshZoom(zoomPercent) {
    this.zoomPercent = zoomPercent;
  }
  cleanupEventHandlers() {
    this.container.off("pointerup", this.onClicked.bind(this));
    this.container.off("mouseover", this.onMouseOver.bind(this));
    this.container.off("mouseout", this.onMouseOut.bind(this));
  }
  destroy() {
    this.container.destroy();
    this.fixedContainer.destroy();
  }
  select() {
    this.isSelected = true;
    this.drawSelectedCircle();
    this.emit("onSelected", this.data);
    this.updateVisibility();
  }
  unselect() {
    this.isSelected = false;
    this.drawSelectedCircle();
    this.emit("onUnselected", this.data);
    this.updateVisibility();
  }
  toggleSelected() {
    if (this.isSelected) {
      this.unselect();
    } else {
      this.select();
    }
  }
}
var carrier_default = Carrier;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=carrier.js.map
