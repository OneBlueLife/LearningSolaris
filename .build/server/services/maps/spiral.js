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
var spiral_exports = {};
__export(spiral_exports, {
  default: () => SpiralMapService
});
module.exports = __toCommonJS(spiral_exports);
const simplexNoise = require("simplex-noise");
class SpiralMapService {
  constructor(randomService, starService, starDistanceService, distanceService, resourceService, gameTypeService) {
    this.randomService = randomService;
    this.starService = starService;
    this.starDistanceService = starDistanceService;
    this.distanceService = distanceService;
    this.resourceService = resourceService;
    this.gameTypeService = gameTypeService;
  }
  generateLocations(game, count, resourceDistribution) {
    let branchCount = 4;
    if (game.settings.general.playerLimit === 2) {
      branchCount = 2;
    } else if (game.settings.general.playerLimit === 3) {
      branchCount = 3;
    }
    let locations = this.generateSpiral(game, count, branchCount);
    this.resourceService.distribute(game, locations, resourceDistribution);
    this.applyNoise(locations);
    this.applyPadding(locations);
    locations = this.scaleUp(game, locations);
    return locations;
  }
  generateSpiral(game, locationCount, branchCount) {
    const locations = [];
    if (this.gameTypeService.isKingOfTheHillMode(game)) {
      locations.push(this.starDistanceService.getGalacticCenter());
    }
    let BRANCHES = branchCount;
    let COPIES = 2;
    let DISTANCE_FACTOR = 0.15;
    let ANGLE_DELTA = 1;
    let i = 0;
    let c_i = 0;
    do {
      c_i++;
      if (c_i == COPIES) {
        i++;
        c_i = 0;
      }
      let current_branch = i % BRANCHES;
      let distance = i / BRANCHES * DISTANCE_FACTOR;
      let angle = current_branch / BRANCHES * 2 * Math.PI + distance * ANGLE_DELTA;
      let sin = Math.sin(angle);
      let cos = Math.cos(angle);
      let x = sin * distance;
      let y = cos * distance;
      locations.push({
        x,
        y
      });
    } while (locations.length < locationCount);
    return locations;
  }
  applyQuadraticStretch(locations) {
    let RADIUS = 3;
    let X_BASE = 2;
    let X_EXP = 1.2;
    let X_EXP2 = 2;
    let Y_BASE = 2;
    let Y_EXP = 0.1;
    let Y_EXP2 = 2;
    for (let i = 0; i < locations.length; i++) {
      let location = locations[i];
      let x_init = location.x;
      let y_init = location.y;
      let vector = Math.hypot(x_init, y_init);
      let vectorScale = (RADIUS - vector) / RADIUS;
      let x = x_init * Math.pow(X_BASE, X_EXP * Math.pow(vectorScale, X_EXP2));
      let y = y_init * Math.pow(Y_BASE, Y_EXP * Math.pow(vectorScale, Y_EXP2));
      location.x = x;
      location.y = y;
    }
  }
  applyNoise(locations) {
    let seed = Math.floor(Math.random() * 1e4);
    let simplex = new simplexNoise(seed);
    let DELTA_DISTANCE = 0.01;
    let DISTANCE_CHECKING_DIRECTIONS = 1;
    let ITERATION_COUNT = 10;
    let PERLIN_SCALE = 1;
    let PERLIN_GRAVITY = 0.01;
    let PERLIN_BROWNIAN_MOTION = 0.05;
    for (let i = 0; i < ITERATION_COUNT; i++) {
      for (var s_i = 0; s_i < locations.length; s_i++) {
        let location = locations[s_i];
        let d_x = 0;
        let d_y = 0;
        let s_x = location.x * PERLIN_SCALE;
        let s_y = location.y * PERLIN_SCALE;
        let val_at_loc = simplex.noise2D(s_x, s_y);
        for (let d_i = 0; d_i < DISTANCE_CHECKING_DIRECTIONS; d_i++) {
          let angle = d_i * Math.PI / DISTANCE_CHECKING_DIRECTIONS;
          let av_x = Math.sin(angle);
          let av_y = Math.cos(angle);
          let val_at_offset = simplex.noise2D(s_x + av_x * DELTA_DISTANCE, s_y + av_y * DELTA_DISTANCE);
          d_x += (val_at_loc - val_at_offset) * PERLIN_GRAVITY;
          d_y += (val_at_loc - val_at_offset) * PERLIN_GRAVITY;
        }
        location.x += d_x + PERLIN_BROWNIAN_MOTION * Math.random();
        location.y += d_y + PERLIN_BROWNIAN_MOTION * Math.random();
      }
    }
  }
  applyPadding(locations) {
    let MIN_D = 0.2, REPOS = 0.01, MAX_REPOS = 0.1, ITER = 5;
    while (ITER--) {
      for (let i1 = 0; i1 < locations.length; i1++) {
        let locationA = locations[i1];
        for (let i2 = i1 + 1; i2 < locations.length; i2++) {
          let locationB = locations[i2];
          let dx = locationA.x - locationB.x;
          let dy = locationA.y - locationB.y;
          let distance = Math.hypot(dx, dy);
          if (distance < MIN_D) {
            let sin = dy / distance;
            let cos = dx / distance;
            let x_repos = cos * Math.min(MAX_REPOS, REPOS / distance);
            let y_repos = sin * Math.min(MAX_REPOS, REPOS / distance);
            locationA.x = locationA.x + x_repos;
            locationA.y = locationA.y + y_repos;
            locationB.x = locationB.x - x_repos;
            locationB.y = locationB.y - y_repos;
          }
        }
      }
    }
  }
  scaleUp(game, locations) {
    let C_HEIGHT = game.constants.distances.minDistanceBetweenStars;
    let C_WIDTH = game.constants.distances.minDistanceBetweenStars;
    let C_STEP = game.constants.distances.minDistanceBetweenStars;
    let isValidGalaxy = false;
    let locs;
    do {
      locs = JSON.parse(JSON.stringify(locations));
      let galaxy = this.getGalaxyMinMax(locs);
      let x_init = galaxy.minX;
      let y_init = galaxy.minY;
      let x_delta = galaxy.maxX - galaxy.minX;
      let y_delta = galaxy.maxY - galaxy.minY;
      let scale = 0;
      if (x_delta < y_delta) {
        scale = C_HEIGHT / y_delta;
      } else {
        scale = C_WIDTH / x_delta;
      }
      for (let i = 0; i < locs.length; i++) {
        let location = locs[i];
        let size = (location.resources.economy + location.resources.industry + location.resources.science) / 3;
        let x_center = (location.x - x_init) * scale - size / 2;
        let y_center = (location.y - y_init) * scale - size / 2;
        location.x = x_center;
        location.y = y_center;
      }
      C_WIDTH += C_STEP;
      C_HEIGHT += C_STEP;
      isValidGalaxy = this.isValidGalaxyCheck(game, locs);
    } while (!isValidGalaxy);
    return locs;
  }
  isValidGalaxyCheck(game, locations) {
    let average = locations.reduce((sum, l) => sum + this.distanceService.getDistanceToClosestLocation(l, locations), 0) / locations.length;
    return average >= game.constants.distances.minDistanceBetweenStars * 2;
  }
  getGalaxyMinMax(locations) {
    let x_min = 0, y_min = 0, x_max = 0, y_max = 0;
    for (let i = 0; i < locations.length; i++) {
      let location = locations[i];
      x_min = Math.min(x_min, location.x);
      x_max = Math.max(x_max, location.x);
      y_min = Math.min(y_min, location.y);
      y_max = Math.max(x_max, location.y);
    }
    return {
      minX: x_min,
      minY: y_min,
      maxX: x_max,
      maxY: y_max
    };
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=spiral.js.map
