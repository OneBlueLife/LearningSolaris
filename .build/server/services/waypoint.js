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
var waypoint_exports = {};
__export(waypoint_exports, {
  default: () => WaypointService
});
module.exports = __toCommonJS(waypoint_exports);
var import_validation = __toESM(require("../errors/validation"));
const mongoose = require("mongoose");
class WaypointService {
  constructor(gameRepo, carrierService, starService, distanceService, starDistanceService, technologyService, gameService, playerService, carrierMovementService) {
    this.gameRepo = gameRepo;
    this.carrierService = carrierService;
    this.starService = starService;
    this.distanceService = distanceService;
    this.starDistanceService = starDistanceService;
    this.technologyService = technologyService;
    this.gameService = gameService;
    this.playerService = playerService;
    this.carrierMovementService = carrierMovementService;
  }
  async saveWaypoints(game, player, carrierId, waypoints, looped) {
    let carrier = this.carrierService.getById(game, carrierId);
    if (!carrier) {
      throw new import_validation.default(`Could not find carrier with id ${carrierId}`);
    }
    return await this.saveWaypointsForCarrier(game, player, carrier, waypoints, looped);
  }
  async saveWaypointsForCarrier(game, player, carrier, waypoints, looped, writeToDB = true) {
    if (looped == null) {
      looped = false;
    }
    if (carrier.ownedByPlayerId.toString() !== player._id.toString()) {
      throw new import_validation.default("The player does not own this carrier.");
    }
    if (waypoints.length > 30) {
      throw new import_validation.default("Cannot plot more than 30 waypoints.");
    }
    if (!carrier.orbiting) {
      let currentWaypoint = carrier.waypoints[0];
      let newFirstWaypoint = waypoints[0];
      if (!newFirstWaypoint || currentWaypoint.source.toString() !== newFirstWaypoint.source.toString() || currentWaypoint.destination.toString() !== newFirstWaypoint.destination.toString()) {
        throw new import_validation.default("The first waypoint course cannot be changed mid-flight.");
      }
      if (+newFirstWaypoint.delayTicks) {
        throw new import_validation.default("The first waypoint cannot have delay ticks if mid-flight.");
      }
    }
    for (let i = 0; i < waypoints.length; i++) {
      let waypoint = waypoints[i];
      let sourceStar = this.starService.getById(game, waypoint.source);
      let destinationStar = this.starService.getById(game, waypoint.destination);
      let sourceStarName = sourceStar == null ? "Unknown" : sourceStar.name;
      waypoint.actionShips = waypoint.actionShips || 0;
      waypoint.action = waypoint.action || "nothing";
      if (waypoint.actionShips == null || waypoint.actionShips == "" || +waypoint.actionShips < 0) {
        waypoint.actionShips = 0;
      }
      waypoint.delayTicks = waypoint.delayTicks || 0;
      if (waypoint.delayTicks == null || waypoint.delayTicks == "" || +waypoint.delayTicks < 0) {
        waypoint.delayTicks = 0;
      }
      if (+waypoint.delayTicks % 1 != 0) {
        throw new import_validation.default(`The waypoint ${sourceStarName} -> ${destinationStar.name} delay cannot be a decimal.`);
      }
      if (+waypoint.delayTicks < 0) {
        waypoint.delayTicks = 0;
      }
      if ((i > 0 || i === 0 && !this.carrierMovementService.isInTransit(carrier)) && (sourceStar && (!this._waypointRouteIsBetweenWormHoles(game, waypoint) && !this._waypointRouteIsWithinHyperspaceRange(game, carrier, waypoint)))) {
        throw new import_validation.default(`The waypoint ${sourceStarName} -> ${destinationStar.name} exceeds hyperspace range.`);
      }
    }
    carrier.waypoints = waypoints.map((w) => {
      return {
        _id: new mongoose.Types.ObjectId(),
        source: w.source,
        destination: w.destination,
        action: w.action,
        actionShips: w.actionShips,
        delayTicks: w.delayTicks
      };
    });
    if (looped && !this.canLoop(game, player, carrier)) {
      throw new import_validation.default(`The carrier waypoints cannot be looped.`);
    }
    carrier.waypointsLooped = looped;
    if (writeToDB) {
      await this.gameRepo.updateOne({
        _id: game._id,
        "galaxy.carriers._id": carrier._id
      }, {
        $set: {
          "galaxy.carriers.$.waypoints": waypoints,
          "galaxy.carriers.$.waypointsLooped": looped
        }
      });
    }
    const reportCarrier = Boolean(carrier.toObject) ? carrier.toObject() : carrier;
    this.populateCarrierWaypointEta(game, reportCarrier);
    return {
      ticksEta: reportCarrier.ticksEta,
      ticksEtaTotal: reportCarrier.ticksEtaTotal,
      waypoints: reportCarrier.waypoints
    };
  }
  _waypointRouteIsWithinHyperspaceRange(game, carrier, waypoint) {
    let sourceStar = this.starService.getById(game, waypoint.source);
    let destinationStar = this.starService.getById(game, waypoint.destination);
    if (sourceStar == null || destinationStar == null) {
      return false;
    }
    if (this.starService.isStarPairWormHole(sourceStar, destinationStar)) {
      return true;
    }
    let effectiveTechs = this.technologyService.getCarrierEffectiveTechnologyLevels(game, carrier, true);
    let hyperspaceDistance = this.distanceService.getHyperspaceDistance(game, effectiveTechs.hyperspace);
    let distanceBetweenStars = this.starDistanceService.getDistanceBetweenStars(sourceStar, destinationStar);
    return distanceBetweenStars <= hyperspaceDistance;
  }
  _waypointRouteIsBetweenWormHoles(game, waypoint) {
    let sourceStar = this.starService.getById(game, waypoint.source);
    let destinationStar = this.starService.getById(game, waypoint.destination);
    if (sourceStar == null || destinationStar == null) {
      return false;
    }
    return this.starService.isStarPairWormHole(sourceStar, destinationStar);
  }
  async cullWaypointsByHyperspaceRangeDB(game, carrier) {
    let cullResult = this.cullWaypointsByHyperspaceRange(game, carrier);
    if (cullResult) {
      await this.gameRepo.updateOne({
        _id: game._id,
        "galaxy.carriers._id": carrier._id
      }, {
        $set: {
          "galaxy.carriers.$.waypoints": cullResult.waypoints,
          "galaxy.carriers.$.waypointsLooped": cullResult.waypointsLooped
        }
      });
    }
    return cullResult;
  }
  cullWaypointsByHyperspaceRange(game, carrier) {
    if (!carrier.waypoints.length) {
      return;
    }
    let player = this.playerService.getById(game, carrier.ownedByPlayerId);
    let waypointsCulled = false;
    let startingWaypointIndex = this.carrierMovementService.isInTransit(carrier) ? 1 : 0;
    for (let i = startingWaypointIndex; i < carrier.waypoints.length; i++) {
      let waypoint = carrier.waypoints[i];
      if (!this._waypointRouteIsWithinHyperspaceRange(game, carrier, waypoint)) {
        waypointsCulled = true;
        carrier.waypoints.splice(i);
        if (carrier.waypointsLooped) {
          carrier.waypointsLooped = this.canLoop(game, player, carrier);
        }
        break;
      }
    }
    if (waypointsCulled) {
      return {
        waypoints: carrier.waypoints,
        waypointsLooped: carrier.waypointsLooped
      };
    }
    return null;
  }
  cullAllWaypointsByHyperspaceRange(game) {
    for (let carrier of game.galaxy.carriers) {
      this.cullWaypointsByHyperspaceRange(game, carrier);
    }
  }
  async loopWaypoints(game, player, carrierId, loop) {
    let carrier = this.carrierService.getById(game, carrierId);
    if (carrier.ownedByPlayerId.toString() !== player._id.toString()) {
      throw new import_validation.default("The player does not own this carrier.");
    }
    if (carrier.isGift) {
      throw new import_validation.default("Cannot loop waypoints of a carrier that is a gift.");
    }
    if (loop) {
      if (carrier.waypoints.length < 1) {
        throw new import_validation.default("The carrier must have 2 or more waypoints to loop");
      }
      if (!this.canLoop(game, player, carrier)) {
        throw new import_validation.default("The last waypoint star is out of hyperspace range of the first waypoint star.");
      }
    }
    await this.gameRepo.updateOne({
      _id: game._id,
      "galaxy.carriers._id": carrier._id
    }, {
      $set: {
        "galaxy.carriers.$.waypointsLooped": loop
      }
    });
  }
  canLoop(game, player, carrier) {
    if (carrier.waypoints.length < 2 || carrier.isGift) {
      return false;
    }
    let effectiveTechs = this.technologyService.getCarrierEffectiveTechnologyLevels(game, carrier, true);
    let firstWaypoint = carrier.waypoints[0];
    let lastWaypoint = carrier.waypoints[carrier.waypoints.length - 1];
    let firstWaypointStar = this.starService.getById(game, firstWaypoint.destination);
    let lastWaypointStar = this.starService.getById(game, lastWaypoint.destination);
    if (firstWaypointStar == null || lastWaypointStar == null) {
      return false;
    }
    if (this.starService.isStarPairWormHole(firstWaypointStar, lastWaypointStar)) {
      return true;
    }
    let distanceBetweenStars = this.starDistanceService.getDistanceBetweenStars(firstWaypointStar, lastWaypointStar);
    let hyperspaceDistance = this.distanceService.getHyperspaceDistance(game, effectiveTechs.hyperspace);
    return distanceBetweenStars <= hyperspaceDistance;
  }
  calculateWaypointTicks(game, carrier, waypoint) {
    const delayTicks = waypoint.delayTicks || 0;
    let carrierOwner = game.galaxy.players.find((p) => p._id.toString() === carrier.ownedByPlayerId.toString());
    if (waypoint.source.toString() === waypoint.destination.toString()) {
      return 1 + delayTicks;
    }
    let sourceStar = this.starService.getById(game, waypoint.source);
    let destinationStar = this.starService.getById(game, waypoint.destination);
    let instantSpeed = sourceStar && this.starService.isStarPairWormHole(sourceStar, destinationStar);
    if (instantSpeed) {
      return 1 + delayTicks;
    }
    let source = sourceStar == null ? carrier.location : sourceStar.location;
    let destination = destinationStar.location;
    if (!carrier.orbiting && carrier.waypoints[0]._id.toString() === waypoint._id.toString()) {
      source = carrier.location;
    }
    let distance = this.distanceService.getDistanceBetweenLocations(source, destination);
    let warpSpeed = this.carrierMovementService.canTravelAtWarpSpeed(game, carrierOwner, carrier, sourceStar, destinationStar);
    let tickDistance = this.carrierMovementService.getCarrierDistancePerTick(game, carrier, warpSpeed, instantSpeed);
    let ticks = 1;
    if (tickDistance) {
      ticks = Math.ceil(distance / tickDistance);
    }
    ticks += delayTicks;
    return ticks;
  }
  calculateWaypointTicksEta(game, carrier, waypoint) {
    let totalTicks = 0;
    for (let i = 0; i < carrier.waypoints.length; i++) {
      let cwaypoint = carrier.waypoints[i];
      totalTicks += this.calculateWaypointTicks(game, carrier, cwaypoint);
      if (cwaypoint._id.toString() === waypoint._id.toString()) {
        break;
      }
    }
    return totalTicks;
  }
  performWaypointAction(carrier, star, waypoint) {
    if (carrier.ownedByPlayerId.toString() !== star.ownedByPlayerId.toString()) {
      throw new Error("Cannot perform waypoint action, the carrier and star are owned by different players.");
    }
    switch (waypoint.action) {
      case "dropAll":
        this._performWaypointActionDropAll(carrier, star, waypoint);
        break;
      case "drop":
        this._performWaypointActionDrop(carrier, star, waypoint);
        break;
      case "dropPercentage":
        this._performWaypointActionDropPercentage(carrier, star, waypoint);
        break;
      case "dropAllBut":
        this._performWaypointActionDropAllBut(carrier, star, waypoint);
        break;
      case "collectAll":
        this._performWaypointActionCollectAll(carrier, star, waypoint);
        break;
      case "collect":
        this._performWaypointActionCollect(carrier, star, waypoint);
        break;
      case "collectPercentage":
        this._performWaypointActionCollectPercentage(carrier, star, waypoint);
        break;
      case "collectAllBut":
        this._performWaypointActionCollectAllBut(carrier, star, waypoint);
        break;
      case "garrison":
        this._performWaypointActionGarrison(carrier, star, waypoint);
        break;
    }
  }
  populateCarrierWaypointEta(game, carrier) {
    carrier.waypoints.forEach((w) => {
      w.ticks = this.calculateWaypointTicks(game, carrier, w);
      w.ticksEta = this.calculateWaypointTicksEta(game, carrier, w);
    });
    if (carrier.waypoints.length) {
      carrier.ticksEta = carrier.waypoints[0].ticksEta;
      carrier.ticksEtaTotal = carrier.waypoints[carrier.waypoints.length - 1].ticksEta;
    } else {
      carrier.ticksEta = null;
      carrier.ticksEtaTotal = null;
    }
  }
  _performWaypointActionDropAll(carrier, star, waypoint) {
    star.shipsActual += carrier.ships - 1;
    star.ships = Math.floor(star.shipsActual);
    carrier.ships = 1;
  }
  _performWaypointActionCollectAll(carrier, star, waypoint) {
    carrier.ships += star.ships;
    star.shipsActual -= star.ships;
    star.ships = Math.floor(star.shipsActual);
  }
  _performWaypointActionDrop(carrier, star, waypoint) {
    if (carrier.ships - 1 >= waypoint.actionShips) {
      star.shipsActual += waypoint.actionShips;
      star.ships = Math.floor(star.shipsActual);
      carrier.ships -= waypoint.actionShips;
    } else {
      this._performWaypointActionDropAll(carrier, star, waypoint);
    }
  }
  performWaypointActionsDrops(game, waypoints) {
    this._performFilteredWaypointActions(game, waypoints, ["dropAll", "drop", "dropAllBut", "dropPercentage"]);
  }
  _performWaypointActionCollect(carrier, star, waypoint) {
    if (star.ships >= waypoint.actionShips) {
      star.shipsActual -= waypoint.actionShips;
      star.ships = Math.floor(star.shipsActual);
      carrier.ships += waypoint.actionShips;
    } else {
      this._performWaypointActionCollectAll(carrier, star, waypoint);
    }
  }
  performWaypointActionsCollects(game, waypoints) {
    this._performFilteredWaypointActions(game, waypoints, ["collectAll", "collect", "collectAllBut", "collectPercentage"]);
  }
  _performWaypointActionDropPercentage(carrier, star, waypoint) {
    const toDrop = Math.floor(carrier.ships * (waypoint.actionShips * 0.01));
    if (toDrop >= 1 && carrier.ships - toDrop >= 1) {
      star.shipsActual += toDrop;
      star.ships = Math.floor(star.shipsActual);
      carrier.ships -= toDrop;
    }
  }
  _performWaypointActionDropAllBut(carrier, star, waypoint) {
    let difference = carrier.ships - waypoint.actionShips;
    if (difference > 0 && difference <= carrier.ships - 1) {
      star.shipsActual += difference;
      star.ships = Math.floor(star.shipsActual);
      carrier.ships -= difference;
    }
  }
  _performWaypointActionCollectPercentage(carrier, star, waypoint) {
    const toTransfer = Math.floor(star.ships * (waypoint.actionShips * 0.01));
    if (toTransfer >= 1 && star.ships - toTransfer >= 0) {
      star.shipsActual -= toTransfer;
      star.ships = Math.floor(star.shipsActual);
      carrier.ships += toTransfer;
    }
  }
  _performWaypointActionCollectAllBut(carrier, star, waypoint) {
    let difference = star.ships - waypoint.actionShips;
    if (difference > 0 && difference <= star.ships) {
      star.shipsActual -= difference;
      star.ships = Math.floor(star.shipsActual);
      carrier.ships += difference;
    }
  }
  _performWaypointActionGarrison(carrier, star, waypoint) {
    let difference = star.ships - waypoint.actionShips;
    if (difference > 0) {
      let allowed = Math.abs(Math.min(difference, star.ships));
      star.shipsActual -= allowed;
      carrier.ships += allowed;
    } else {
      let allowed = Math.min(Math.abs(difference), carrier.ships - 1);
      star.shipsActual += allowed;
      carrier.ships -= allowed;
    }
    star.ships = Math.floor(star.shipsActual);
  }
  performWaypointActionsGarrisons(game, waypoints) {
    this._performFilteredWaypointActions(game, waypoints, ["garrison"]);
  }
  _performFilteredWaypointActions(game, waypoints, waypointTypes) {
    let actionWaypoints = waypoints.filter(
      (w) => waypointTypes.indexOf(w.waypoint.action) > -1 && w.carrier.ownedByPlayerId.toString() === w.star.ownedByPlayerId.toString()
    );
    for (let actionWaypoint of actionWaypoints) {
      this.performWaypointAction(actionWaypoint.carrier, actionWaypoint.star, actionWaypoint.waypoint);
    }
  }
  sanitiseAllCarrierWaypointsByScanningRange(game) {
    const scanningRanges = game.galaxy.players.map((p) => {
      return {
        player: p,
        stars: this.starService.filterStarsByScanningRange(game, [p._id])
      };
    });
    game.galaxy.carriers.filter((c) => c.waypoints.length).map((c) => {
      let scanningRangePlayer = scanningRanges.find((s) => s.player._id.toString() === c.ownedByPlayerId.toString());
      return {
        carrier: c,
        owner: scanningRangePlayer.player,
        ownerScannedStars: scanningRangePlayer.stars
      };
    }).forEach((x) => this.sanitiseCarrierWaypointsByScanningRange(game, x.carrier, x.owner, x.ownerScannedStars));
  }
  sanitiseCarrierWaypointsByScanningRange(game, carrier, owner, ownerScannedStars) {
    if (!carrier.waypoints.length) {
      return;
    }
    let startIndex = this.carrierMovementService.isInTransit(carrier) ? 1 : 0;
    for (let i = startIndex; i < carrier.waypoints.length; i++) {
      let waypoint = carrier.waypoints[i];
      let inRange = ownerScannedStars.find((s) => s._id.toString() === waypoint.destination.toString()) != null;
      if (!inRange) {
        carrier.waypoints.splice(i);
        if (carrier.waypointsLooped) {
          carrier.waypointsLooped = this.canLoop(game, owner, carrier);
        }
        break;
      }
    }
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=waypoint.js.map
