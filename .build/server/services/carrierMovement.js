"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var carrierMovement_exports = {};
__export(carrierMovement_exports, {
  default: () => CarrierMovementService
});
module.exports = __toCommonJS(carrierMovement_exports);
class CarrierMovementService {
  constructor(gameRepo, distanceService, starService, specialistService, diplomacyService, carrierGiftService) {
    this.gameRepo = gameRepo;
    this.distanceService = distanceService;
    this.starService = starService;
    this.specialistService = specialistService;
    this.diplomacyService = diplomacyService;
    this.carrierGiftService = carrierGiftService;
  }
  getCarrierDistancePerTick(game, carrier, warpSpeed = false, instantSpeed = false) {
    if (instantSpeed) {
      return null;
    }
    let distanceModifier = warpSpeed ? game.constants.distances.warpSpeedMultiplier : 1;
    if (carrier.specialistId) {
      let specialist = this.specialistService.getByIdCarrier(carrier.specialistId);
      if (specialist && specialist.modifiers.local) {
        distanceModifier *= specialist.modifiers.local.speed || 1;
      }
    }
    return game.settings.specialGalaxy.carrierSpeed * distanceModifier;
  }
  moveCarrierToCurrentWaypoint(carrier, destinationStar, distancePerTick) {
    let nextLocation = this.distanceService.getNextLocationTowardsLocation(carrier.location, destinationStar.location, distancePerTick);
    carrier.location = nextLocation;
  }
  async arriveAtStar(game, gameUsers, carrier, destinationStar) {
    let currentWaypoint = carrier.waypoints.splice(0, 1)[0];
    let report = {
      waypoint: currentWaypoint,
      combatRequiredStar: false
    };
    carrier.orbiting = destinationStar._id;
    carrier.location = destinationStar.location;
    if (carrier.waypointsLooped) {
      carrier.waypoints.push(currentWaypoint);
    }
    if (destinationStar.ownedByPlayerId == null) {
      await this.starService.claimUnownedStar(game, gameUsers, destinationStar, carrier);
    }
    if (!carrier.isGift && this.starService.isDeadStar(destinationStar) && this.specialistService.getReigniteDeadStar(carrier)) {
      let reigniteSpecialistNaturalResources = this.specialistService.getReigniteDeadStarNaturalResources(carrier);
      let modifier = destinationStar.isBinaryStar ? 2 : 1;
      let reigniteNaturalResources = {
        economy: reigniteSpecialistNaturalResources.economy * modifier,
        industry: reigniteSpecialistNaturalResources.industry * modifier,
        science: reigniteSpecialistNaturalResources.science * modifier
      };
      this.starService.reigniteDeadStar(game, destinationStar, reigniteNaturalResources);
      carrier.specialistId = null;
    }
    if (destinationStar.ownedByPlayerId.toString() !== carrier.ownedByPlayerId.toString()) {
      if (carrier.isGift) {
        await this.carrierGiftService.transferGift(game, gameUsers, destinationStar, carrier);
      } else if (this.diplomacyService.isFormalAlliancesEnabled(game)) {
        let isAllied = this.diplomacyService.isDiplomaticStatusBetweenPlayersAllied(game, [carrier.ownedByPlayerId, destinationStar.ownedByPlayerId]);
        report.combatRequiredStar = !isAllied;
      } else {
        report.combatRequiredStar = true;
      }
    } else {
      carrier.isGift = false;
    }
    return report;
  }
  async moveCarrier(game, gameUsers, carrierInTransit) {
    let waypoint = carrierInTransit.waypoints[0];
    if (waypoint.delayTicks) {
      throw new Error(`Cannot move carrier, the waypoint has a delay.`);
    }
    if (this.isLaunching(carrierInTransit)) {
      waypoint.source = carrierInTransit.orbiting;
      if (carrierInTransit.orbiting.toString() !== waypoint.destination.toString()) {
        carrierInTransit.orbiting = null;
      }
    }
    let sourceStar = game.galaxy.stars.find((s) => s._id.toString() === waypoint.source.toString());
    let destinationStar = game.galaxy.stars.find((s) => s._id.toString() === waypoint.destination.toString());
    let carrierOwner = game.galaxy.players.find((p) => p._id.toString() === carrierInTransit.ownedByPlayerId.toString());
    let warpSpeed = this.canTravelAtWarpSpeed(game, carrierOwner, carrierInTransit, sourceStar, destinationStar);
    let instantSpeed = this.starService.isStarPairWormHole(sourceStar, destinationStar);
    let distancePerTick = this.getCarrierDistancePerTick(game, carrierInTransit, warpSpeed, instantSpeed);
    let carrierMovementReport = {
      carrier: carrierInTransit,
      sourceStar,
      destinationStar,
      carrierOwner,
      warpSpeed,
      instantSpeed,
      distancePerTick,
      waypoint,
      combatRequiredStar: false,
      arrivedAtStar: false
    };
    if (instantSpeed || distancePerTick && (carrierInTransit.distanceToDestination || 0) <= distancePerTick) {
      let starArrivalReport = await this.arriveAtStar(game, gameUsers, carrierInTransit, destinationStar);
      carrierMovementReport.waypoint = starArrivalReport.waypoint;
      carrierMovementReport.combatRequiredStar = starArrivalReport.combatRequiredStar;
      carrierMovementReport.arrivedAtStar = true;
    } else {
      this.moveCarrierToCurrentWaypoint(carrierInTransit, destinationStar, distancePerTick);
    }
    return carrierMovementReport;
  }
  getNextLocationToWaypoint(game, carrier) {
    let waypoint = carrier.waypoints[0];
    let sourceStar = game.galaxy.stars.find((s) => s._id.toString() === waypoint.source.toString());
    let destinationStar = game.galaxy.stars.find((s) => s._id.toString() === waypoint.destination.toString());
    let carrierOwner = game.galaxy.players.find((p) => p._id.toString() === carrier.ownedByPlayerId.toString());
    let warpSpeed = false;
    let instantSpeed = false;
    if (sourceStar) {
      warpSpeed = this.canTravelAtWarpSpeed(game, carrierOwner, carrier, sourceStar, destinationStar);
      instantSpeed = this.starService.isStarPairWormHole(sourceStar, destinationStar);
    }
    let nextLocation;
    let distancePerTick;
    let distanceToDestination = this.distanceService.getDistanceBetweenLocations(carrier.location, destinationStar.location);
    if (instantSpeed) {
      distancePerTick = distanceToDestination;
      nextLocation = destinationStar.location;
    } else {
      distancePerTick = this.getCarrierDistancePerTick(game, carrier, warpSpeed, instantSpeed);
      if (distancePerTick >= distanceToDestination) {
        distancePerTick = distanceToDestination;
        nextLocation = destinationStar.location;
      } else {
        nextLocation = this.distanceService.getNextLocationTowardsLocation(carrier.location, destinationStar.location, distancePerTick);
      }
    }
    return {
      location: nextLocation,
      distance: distancePerTick,
      warpSpeed,
      instantSpeed,
      sourceStar,
      destinationStar
    };
  }
  canTravelAtWarpSpeed(game, player, carrier, sourceStar, destinationStar) {
    if (sourceStar == null || destinationStar == null) {
      return false;
    }
    if (sourceStar.warpGate && destinationStar.warpGate && sourceStar.ownedByPlayerId && destinationStar.ownedByPlayerId) {
      let sourceAllied = sourceStar.ownedByPlayerId.toString() === carrier.ownedByPlayerId.toString() || this.diplomacyService.isFormalAlliancesEnabled(game) && this.diplomacyService.isDiplomaticStatusToPlayersAllied(game, sourceStar.ownedByPlayerId, [carrier.ownedByPlayerId]);
      let desinationAllied = destinationStar.ownedByPlayerId.toString() === carrier.ownedByPlayerId.toString() || this.diplomacyService.isFormalAlliancesEnabled(game) && this.diplomacyService.isDiplomaticStatusToPlayersAllied(game, destinationStar.ownedByPlayerId, [carrier.ownedByPlayerId]);
      if (sourceAllied && desinationAllied) {
        return true;
      }
      if (carrier.specialistId) {
        let carrierSpecialist = this.specialistService.getByIdCarrier(carrier.specialistId);
        if (carrierSpecialist && carrierSpecialist.modifiers.special && carrierSpecialist.modifiers.special.unlockWarpGates) {
          return true;
        }
      }
      if (!sourceAllied && sourceStar.specialistId) {
        let specialist = this.specialistService.getByIdStar(sourceStar.specialistId);
        if (specialist && specialist.modifiers.special && specialist.modifiers.special.lockWarpGates) {
          return false;
        }
      }
      if (!desinationAllied && destinationStar.specialistId) {
        let specialist = this.specialistService.getByIdStar(destinationStar.specialistId);
        if (specialist && specialist.modifiers.special && specialist.modifiers.special.lockWarpGates) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
  isInTransit(carrier) {
    return !carrier.orbiting;
  }
  isInTransitTo(carrier, star) {
    return this.isInTransit(carrier) && carrier.waypoints[0].destination.toString() === star._id.toString();
  }
  isLaunching(carrier) {
    return carrier.orbiting && carrier.waypoints.length && carrier.waypoints[0].delayTicks === 0;
  }
  getCarriersEnRouteToStar(game, star) {
    return game.galaxy.carriers.filter(
      (c) => c.waypoints && c.waypoints.length && c.waypoints.find((w) => w.destination.toString() === star._id.toString()) != null
    );
  }
  isLostInSpace(game, carrier) {
    if (!this.isInTransit(carrier)) {
      return false;
    }
    if (carrier.waypoints.length) {
      return game.galaxy.stars.find((s) => s._id.toString() === carrier.waypoints[0].destination.toString()) == null;
    }
    return carrier.waypoints.length === 0;
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=carrierMovement.js.map
