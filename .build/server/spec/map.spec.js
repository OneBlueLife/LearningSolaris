"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_random = __toESM(require("../services/random"));
var import_map = __toESM(require("../services/map"));
var import_circular = __toESM(require("../services/maps/circular"));
const game = {
  settings: {
    galaxy: {
      galaxyType: "circular"
    },
    specialGalaxy: {
      resourceDistribution: "random"
    }
  },
  constants: {
    distances: {
      maxDistanceBetweenStars: 300
    },
    star: {
      resources: {
        minNaturalResources: 10,
        maxNaturalResources: 50
      }
    }
  }
};
const fakeStarService = {
  generateUnownedStar(name, location) {
    return {
      name,
      location
    };
  },
  generateStarPosition(game2, x, y) {
    return {
      x: 10,
      y: 10
    };
  }
};
const fakeStarDistanceService = {
  isStarTooClose(game2, star1, star2) {
    return false;
  },
  isDuplicateStarPosition(location, stars) {
    return false;
  },
  isStarLocationTooClose(game2, location, stars) {
    return false;
  },
  isLocationTooClose(game2, location, locations) {
    return false;
  }
};
const fakeDistanceService = {
  getFurthestLocation() {
    return 1;
  },
  getDistanceBetweenLocations() {
    return 2;
  }
};
const fakeStarNameService = {
  getRandomStarNames(count) {
    let names = [];
    for (let i = 0; i < count; i++) {
      names.push(`Star ${i}`);
    }
    return names;
  }
};
const fakeResourceService = {
  distribute() {
  }
};
const fakeGameTypeService = {
  isKingOfTheHillMode() {
    return false;
  }
};
describe("map", () => {
  const starCount = 10;
  const playerCount = 2;
  let randomService;
  let mapService;
  let starMapService;
  beforeEach(() => {
    randomService = new import_random.default();
    starMapService = new import_circular.default(randomService, fakeStarService, fakeStarDistanceService, fakeDistanceService, fakeResourceService, fakeGameTypeService);
    mapService = new import_map.default(randomService, fakeStarService, fakeStarDistanceService, fakeStarNameService, starMapService);
  });
  it("should generate a given number of stars", () => {
    const stars = mapService.generateStars(game, starCount, playerCount).stars;
    expect(stars).toBeTruthy();
    expect(stars.length).toEqual(starCount);
  });
  it("should generate stars with no duplicate names.", () => {
    const stars = mapService.generateStars(game, starCount, playerCount);
    for (let i = 0; i < stars.length; i++) {
      let star = stars[i];
      let duplicates = stars.filter((s) => s.name === star.name);
      expect(duplicates.length).toEqual(1);
    }
  });
});
//# sourceMappingURL=map.spec.js.map
