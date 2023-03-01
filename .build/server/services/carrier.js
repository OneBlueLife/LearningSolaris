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
  default: () => CarrierService
});
module.exports = __toCommonJS(carrier_exports);
var import_validation = __toESM(require("../errors/validation"));
const mongoose = require("mongoose");
const EventEmitter = require("events");
class CarrierService extends EventEmitter {
  constructor(gameRepo, distanceService, starService, technologyService, specialistService) {
    super();
    this.gameRepo = gameRepo;
    this.distanceService = distanceService;
    this.starService = starService;
    this.technologyService = technologyService;
    this.specialistService = specialistService;
  }
  getById(game, id) {
    return this.getByIdBS(game, id);
  }
  getByIdBS(game, id) {
    let start = 0;
    let end = game.galaxy.carriers.length - 1;
    while (start <= end) {
      let middle = Math.floor((start + end) / 2);
      let carrier = game.galaxy.carriers[middle];
      if (carrier._id.toString() === id.toString()) {
        return carrier;
      } else if (carrier._id.toString() < id.toString()) {
        start = middle + 1;
      } else {
        end = middle - 1;
      }
    }
    return game.galaxy.carriers.find((s) => s._id.toString() === id.toString());
  }
  getCarriersAtStar(game, starId) {
    return game.galaxy.carriers.filter((carrier) => carrier.orbiting && carrier.orbiting.toString() === starId.toString());
  }
  createAtStar(star, carriers, ships = 1) {
    var _a;
    if (!Math.floor(star.shipsActual)) {
      throw new import_validation.default("Star must have at least 1 ship to build a carrier.");
    }
    let name = this.generateCarrierName(star, carriers);
    let carrier = {
      _id: mongoose.Types.ObjectId(),
      ownedByPlayerId: star.ownedByPlayerId,
      ships,
      orbiting: star._id,
      location: star.location,
      name,
      waypoints: [],
      waypointsLooped: false,
      specialistId: null,
      specialistExpireTick: null,
      specialist: null,
      isGift: false,
      locationNext: null,
      toObject() {
        return this;
      }
    };
    star.shipsActual -= ships;
    star.ships -= ships;
    if (star.specialistId) {
      let starSpecialist = this.specialistService.getByIdStar(star.specialistId);
      if ((_a = starSpecialist == null ? void 0 : starSpecialist.modifiers.special) == null ? void 0 : _a.autoCarrierSpecialistAssign) {
        carrier.specialistId = starSpecialist.modifiers.special.autoCarrierSpecialistAssign;
        carrier.specialist = this.specialistService.getByIdCarrier(carrier.specialistId);
      }
    }
    return carrier;
  }
  listCarriersOwnedByPlayer(carriers, playerId) {
    return carriers.filter((s) => s.ownedByPlayerId && s.ownedByPlayerId.toString() === playerId.toString());
  }
  listCarriersOwnedByPlayers(carriers, playerIds) {
    const ids = playerIds.map((p) => p.toString());
    return carriers.filter((s) => s.ownedByPlayerId && ids.includes(s.ownedByPlayerId.toString()));
  }
  listCarriersOwnedByPlayerInOrbit(carriers, playerId) {
    return this.listCarriersOwnedByPlayer(carriers, playerId).filter((c) => c.orbiting);
  }
  listCarriersOwnedByPlayersInOrbit(carriers, playerIds) {
    return this.listCarriersOwnedByPlayers(carriers, playerIds).filter((c) => c.orbiting);
  }
  generateCarrierName(star, carriers) {
    let i = 1;
    let name = `${star.name} ${i++}`;
    while (carriers.find((c) => c.name == name)) {
      name = `${star.name} ${i++}`;
    }
    return name;
  }
  getCarriersWithinScanningRangeOfStarByCarrierIds(game, star, carriers) {
    if (star.ownedByPlayerId == null) {
      return [];
    }
    let effectiveTechs = this.technologyService.getStarEffectiveTechnologyLevels(game, star);
    let scanningRangeDistance = this.distanceService.getScanningDistance(game, effectiveTechs.scanning);
    let carriersInRange = carriers.filter((c) => {
      return this.distanceService.getDistanceBetweenLocations(c.location, star.location) <= scanningRangeDistance;
    });
    return carriersInRange;
  }
  filterCarriersByScanningRange(game, playerIds) {
    const ids = playerIds.map((p) => p.toString());
    let playerStars = this.starService.listStarsWithScanningRangeByPlayers(game, playerIds);
    let carriersInRange = game.galaxy.carriers.filter((c) => ids.includes(c.ownedByPlayerId.toString())).map((c) => c._id);
    let carriersToCheck = game.galaxy.carriers.filter((c) => !ids.includes(c.ownedByPlayerId.toString())).map((c) => {
      return {
        _id: c._id,
        ownedByPlayerId: c.ownedByPlayerId,
        location: c.location
      };
    });
    for (let star of playerStars) {
      let carrierIds = this.getCarriersWithinScanningRangeOfStarByCarrierIds(game, star, carriersToCheck);
      for (let carrierId of carrierIds) {
        if (carriersInRange.indexOf(carrierId._id) === -1) {
          carriersInRange.push(carrierId._id);
          carriersToCheck.splice(carriersToCheck.indexOf(carrierId), 1);
        }
      }
      if (!carriersToCheck.length) {
        break;
      }
    }
    return carriersInRange.map((c) => this.getById(game, c));
  }
  sanitizeCarriersByPlayers(game, playerIds) {
    const ids = playerIds.map((p) => p.toString());
    return game.galaxy.carriers.map((c) => {
      if (ids.includes(c.ownedByPlayerId.toString())) {
        return c;
      }
      let carrierData = {
        _id: c._id,
        ownedByPlayerId: c.ownedByPlayerId,
        orbiting: c.orbiting,
        name: c.name,
        ships: c.ships,
        location: c.location,
        waypoints: c.waypoints,
        isGift: c.isGift,
        specialistId: c.specialistId,
        specialistExpireTick: c.specialistExpireTick,
        specialist: null
      };
      carrierData.waypoints = this.clearCarrierWaypointsNonTransit(c, true);
      return carrierData;
    });
  }
  clearCarrierWaypointsNonTransit(carrier, obfuscateFirstWaypoint = false) {
    let waypoints = [];
    if (!carrier.orbiting) {
      waypoints = carrier.waypoints.slice(0, 1);
      if (obfuscateFirstWaypoint) {
        let wp = waypoints[0];
        if (wp) {
          wp.action = "nothing";
          wp.actionShips = 0;
          wp.delayTicks = 0;
        }
        carrier.waypointsLooped = false;
      }
    }
    return waypoints;
  }
  clearPlayerCarrierWaypointsNonTransit(game, player) {
    let carriers = this.listCarriersOwnedByPlayer(game.galaxy.carriers, player._id);
    for (let carrier of carriers) {
      carrier.waypoints = this.clearCarrierWaypointsNonTransit(carrier);
    }
  }
  clearPlayerCarrierWaypointsLooped(game, player) {
    let carriers = this.listCarriersOwnedByPlayer(game.galaxy.carriers, player._id);
    for (let carrier of carriers) {
      carrier.waypointsLooped = false;
    }
  }
  clearPlayerCarriers(game, player) {
    game.galaxy.carriers = game.galaxy.carriers.filter((c) => !c.ownedByPlayerId || c.ownedByPlayerId.toString() !== player._id.toString());
  }
  async rename(game, player, carrierId, name) {
    let carrier = this.getById(game, carrierId);
    if (!carrier) {
      throw new import_validation.default("Carrier does not exist");
    }
    if (!name) {
      throw new import_validation.default("Name is required.");
    }
    if (name.length < 4 || name.length > 30) {
      throw new import_validation.default("Name must be between greater than 3 and less than or equal to 30 characters long.");
    }
    if (carrier.ownedByPlayerId.toString() !== player._id.toString()) {
      throw new import_validation.default(`Cannot rename carrier, you are not its owner.`);
    }
    let carrierName = name.trim().replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    await this.gameRepo.updateOne({
      _id: game._id,
      "galaxy.carriers._id": carrierId
    }, {
      $set: {
        "galaxy.carriers.$.name": carrierName
      }
    });
  }
  async scuttle(game, player, carrierId) {
    let carrier = this.getById(game, carrierId);
    if (!carrier) {
      throw new import_validation.default("Carrier does not exist");
    }
    if (carrier.ownedByPlayerId.toString() !== player._id.toString()) {
      throw new import_validation.default(`Cannot scuttle carrier, you are not its owner.`);
    }
    if (carrier.isGift) {
      throw new import_validation.default(`Cannot scuttle a gift.`);
    }
    await this.gameRepo.updateOne({
      _id: game._id
    }, {
      $pull: {
        "galaxy.carriers": {
          _id: carrierId
        }
      }
    });
  }
  canPlayersSeeCarrierShips(game, playerIds, carrier) {
    const ids = playerIds.map((p) => p.toString());
    const isOwnedByPlayer = ids.includes(carrier.ownedByPlayerId.toString());
    if (isOwnedByPlayer) {
      return true;
    }
    if (this.isInOrbitOfNebula(game, carrier)) {
      return false;
    }
    if (carrier.specialistId) {
      let specialist = this.specialistService.getByIdCarrier(carrier.specialistId);
      if (specialist && specialist.modifiers.special && specialist.modifiers.special.hideShips) {
        return false;
      }
    }
    return true;
  }
  isInOrbitOfNebula(game, carrier) {
    if (carrier.orbiting) {
      const orbitStar = this.starService.getById(game, carrier.orbiting);
      return orbitStar.isNebula;
    }
    return false;
  }
  destroyCarrier(game, carrier) {
    game.galaxy.carriers.splice(game.galaxy.carriers.indexOf(carrier), 1);
  }
  listGiftCarriersInOrbit(game) {
    return game.galaxy.carriers.filter((c) => c.isGift && c.orbiting);
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=carrier.js.map
