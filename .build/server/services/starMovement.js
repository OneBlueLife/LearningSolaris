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
var starMovement_exports = {};
__export(starMovement_exports, {
  default: () => starMovementService
});
module.exports = __toCommonJS(starMovement_exports);
class starMovementService {
  constructor(mapService, starDistanceService, specialistService, waypointService) {
    this.mapService = mapService;
    this.starDistanceService = starDistanceService;
    this.specialistService = specialistService;
    this.waypointService = waypointService;
  }
  orbitGalaxy(game) {
    for (let star of game.galaxy.stars) {
      this.orbitStar(game, star);
    }
    for (let carrier of game.galaxy.carriers) {
      this.orbitCarrier(game, carrier);
    }
    for (let carrier of game.galaxy.carriers) {
      this.waypointService.cullWaypointsByHyperspaceRange(game, carrier);
    }
  }
  orbitStar(game, star) {
    this.orbitObject(game, star);
  }
  orbitCarrier(game, carrier) {
    this.orbitObject(game, carrier);
  }
  orbitObject(game, objectWithLocation) {
    objectWithLocation.location = this.getNextLocation(game, objectWithLocation);
  }
  getNextLocation(game, objectWithLocation) {
    if (game.settings.orbitalMechanics.enabled === "disabled") {
      throw new Error("Game settings disallow orbital mechanics.");
    }
    let galaxyCenter = game.constants.distances.galaxyCenterLocation;
    let speed = game.settings.orbitalMechanics.orbitSpeed;
    let direction = 1;
    let r = Math.sqrt(Math.pow(Math.abs(objectWithLocation.location.x), 2) + Math.pow(objectWithLocation.location.y, 2));
    let arcLength = 0;
    if (r !== 0) {
      arcLength = speed / r * 100;
    }
    return this.rotate(
      galaxyCenter.x,
      galaxyCenter.y,
      objectWithLocation.location.x,
      objectWithLocation.location.y,
      arcLength
    );
  }
  rotate(cx, cy, x, y, angle) {
    let radians = Math.PI / 180 * angle, cos = Math.cos(radians), sin = Math.sin(radians), nx = cos * (x - cx) + sin * (y - cy) + cx, ny = cos * (y - cy) - sin * (x - cx) + cy;
    return {
      x: nx,
      y: ny
    };
  }
  moveStellarEngines(game) {
    const beaconStars = game.galaxy.stars.filter((s) => this.specialistService.getStarAttract(s));
    if (beaconStars.length === 0) {
      return;
    }
    const engineStars = game.galaxy.stars.filter((s) => this.specialistService.getStarMovement(s));
    for (let star of engineStars) {
      let closestStar = this.starDistanceService.getClosestStar(star, beaconStars);
      let distanceToClosestStar = this.starDistanceService.getDistanceBetweenStars(star, closestStar);
      let starSpeed = this.specialistService.getStarMovementPerTick(star) * game.settings.specialGalaxy.carrierSpeed;
      starSpeed = distanceToClosestStar - starSpeed <= 0.5 * game.constants.distances.minDistanceBetweenStars ? distanceToClosestStar - 0.5 * game.constants.distances.minDistanceBetweenStars : starSpeed;
      this.moveStarTowardsLocation(game, star, closestStar.location, starSpeed);
    }
    const nonEngineStars = game.galaxy.stars.filter((s) => !this.specialistService.getStarMovement(s));
    this.maintainDistance(game, engineStars, nonEngineStars);
  }
  maintainDistance(game, movedStars, stars) {
    for (let star of movedStars) {
      let nearbyStars = this.starDistanceService.getStarsWithinRadiusOfStar(star, stars, game.constants.distances.minDistanceBetweenStars);
      let tooCloseStars = this.starDistanceService.getStarsWithinRadiusOfStar(star, stars, 0.49 * game.constants.distances.minDistanceBetweenStars);
      if (tooCloseStars.length === 0) {
        continue;
      }
      let k = 0;
      while (tooCloseStars.length !== 0 && k < 50) {
        let closestStar = this.starDistanceService.getClosestStar(star, tooCloseStars);
        this.shiftAway(game, star, closestStar, (0.501 - k * 0.01) * game.constants.distances.minDistanceBetweenStars);
        tooCloseStars = this.starDistanceService.getStarsWithinRadiusOfStar(star, nearbyStars, (0.49 - k * 0.01) * game.constants.distances.minDistanceBetweenStars);
        k++;
      }
    }
  }
  shiftAway(game, movingStar, stationaryStar, range) {
    let shift = this.starDistanceService.getDistanceBetweenStars(movingStar, stationaryStar) - range;
    this.moveStarTowardsLocation(game, movingStar, stationaryStar.location, shift);
  }
  moveStarTowardsLocation(game, star, location, speed) {
    if (star.location === location) {
      return;
    }
    let dx = location.x - star.location.x, dy = location.y - star.location.y;
    let mag = Math.hypot(dx, dy);
    let delta = {
      x: speed * dx / mag,
      y: speed * dy / mag
    };
    star.location.x += delta.x;
    star.location.y += delta.y;
    const carriersInOrbit = game.galaxy.carriers.filter((c) => c.orbiting && c.orbiting.toString() === star._id.toString());
    for (let carrier of carriersInOrbit) {
      carrier.location = star.location;
    }
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=starMovement.js.map
