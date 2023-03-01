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
var waypoints_exports = {};
__export(waypoints_exports, {
  default: () => waypoints_default
});
module.exports = __toCommonJS(waypoints_exports);
var PIXI = __toESM(require("pixi.js-legacy"));
var import_events = __toESM(require("events"));
var import_gameHelper = __toESM(require("../services/gameHelper"));
var import_waypointHelper = __toESM(require("../services/waypointHelper"));
class Waypoints extends import_events.default {
  constructor() {
    super();
    this.container = new PIXI.Container();
  }
  setup(game) {
    this.game = game;
    this.lightYearDistance = game.constants.distances.lightYear;
  }
  clear() {
    this.container.removeChildren();
  }
  draw(carrier) {
    this.clear();
    this.carrier = carrier;
    this.drawHyperspaceRange();
    this.drawLastWaypoint();
    this.drawNextWaypoints();
    this.drawPaths();
  }
  drawLastWaypoint() {
    let lastLocation = this._getLastLocation();
    this._highlightLocation(lastLocation, 0.8);
  }
  drawNextWaypoints() {
    let lastLocation = this._getLastLocation();
    let userPlayer = this.game.galaxy.players.find((p) => p.userId);
    const hyperspaceDistance = import_gameHelper.default.getHyperspaceDistance(this.game, userPlayer, this.carrier);
    for (let i = 0; i < this.game.galaxy.stars.length; i++) {
      let s = this.game.galaxy.stars[i];
      let distance = import_gameHelper.default.getDistanceBetweenLocations(lastLocation, s.location);
      if (distance <= hyperspaceDistance) {
        this._highlightLocation(s.location, 0.5);
      } else {
        this._highlightLocation(s.location, 0.2);
      }
    }
  }
  drawPaths() {
    if (!this.carrier.waypoints.length) {
      return;
    }
    let graphics = new PIXI.Graphics();
    let star;
    graphics.moveTo(this.carrier.location.x, this.carrier.location.y);
    graphics.lineStyle(1, 16777215, 0.8);
    for (let i = 0; i < this.carrier.waypoints.length; i++) {
      let waypoint = this.carrier.waypoints[i];
      star = this.game.galaxy.stars.find((s) => s._id === waypoint.destination);
      graphics.lineTo(star.location.x, star.location.y);
    }
    this.container.addChild(graphics);
  }
  drawHyperspaceRange() {
    let graphics = new PIXI.Graphics();
    let lastLocationStar = this._getLastLocationStar();
    let player = this.game.galaxy.players.find((p) => p.userId);
    let radius = ((this.carrier.effectiveTechs.hyperspace || 1) + 1.5) * this.lightYearDistance;
    graphics.lineStyle(1, player.colour.value, 0.2);
    graphics.beginFill(player.colour.value, 0.15);
    graphics.drawStar(lastLocationStar.location.x, lastLocationStar.location.y, radius, radius, radius - 3);
    graphics.endFill();
    this.container.addChild(graphics);
  }
  _highlightLocation(location, opacity) {
    let graphics = new PIXI.Graphics();
    let radius = 12;
    graphics.lineStyle(1, 16777215, opacity);
    graphics.drawStar(location.x, location.y, radius, radius, radius - 3);
    this.container.addChild(graphics);
  }
  onStarClicked(e) {
    if (!this.carrier) {
      return;
    }
    const userPlayer = this.game.galaxy.players.find((p) => p.userId);
    const hyperspaceDistance = import_gameHelper.default.getHyperspaceDistance(this.game, userPlayer, this.carrier);
    const lastLocationStar = this._getLastLocationStar();
    const lastLocation = lastLocationStar == null ? null : lastLocationStar.location;
    const distance = import_gameHelper.default.getDistanceBetweenLocations(lastLocation, e.location);
    let canCreateWaypoint = distance <= hyperspaceDistance;
    if (!canCreateWaypoint && lastLocationStar && lastLocationStar.wormHoleToStarId) {
      const wormHolePairStar = import_gameHelper.default.getStarById(this.game, lastLocationStar.wormHoleToStarId);
      canCreateWaypoint = wormHolePairStar && wormHolePairStar._id === e._id;
    }
    if (canCreateWaypoint) {
      this._createWaypoint(e._id);
    } else {
      this._createWaypointRoute(lastLocationStar._id, e._id);
    }
  }
  _createWaypoint(destinationStarId) {
    let newWaypoint = {
      destination: destinationStarId,
      action: "collectAll",
      actionShips: 0,
      delayTicks: 0
    };
    if (this.carrier.waypoints.length) {
      const lastWaypoint = this._getLastWaypoint();
      newWaypoint.source = lastWaypoint.destination;
    } else {
      newWaypoint.source = this.carrier.orbiting;
    }
    this.carrier.waypoints.push(newWaypoint);
    this.draw(this.carrier);
    this.emit("onWaypointCreated", newWaypoint);
  }
  _createWaypointRoute(sourceStarId, destinStarId) {
    const route = import_waypointHelper.default.calculateShortestRoute(this.game, this.carrier, sourceStarId, destinStarId);
    if (route.length > 1) {
      for (let i = 1; i < route.length; i++) {
        let waypointStar = route[i];
        this._createWaypoint(waypointStar._id);
      }
    } else {
      this.emit("onWaypointOutOfRange", null);
    }
  }
  _getLastWaypoint() {
    return this.carrier.waypoints[this.carrier.waypoints.length - 1];
  }
  _getLastLocation() {
    let lastLocationStar = this._getLastLocationStar();
    if (lastLocationStar) {
      return lastLocationStar.location;
    }
    return null;
  }
  _getLastLocationStar() {
    if (this.carrier.waypoints.length) {
      let lastWaypointStarId = this.carrier.waypoints[this.carrier.waypoints.length - 1].destination;
      return this.game.galaxy.stars.find((s) => s._id === lastWaypointStarId);
    } else {
      return this.game.galaxy.stars.find((s) => s._id === this.carrier.orbiting);
    }
  }
}
var waypoints_default = Waypoints;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=waypoints.js.map
