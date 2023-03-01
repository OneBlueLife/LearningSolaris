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
var import_distance = __toESM(require("../services/distance"));
var import_starDistance = __toESM(require("../services/starDistance"));
var import_map = __toESM(require("../services/map"));
var import_random = __toESM(require("../services/random"));
var import_star = __toESM(require("../services/star"));
var import_carrier = __toESM(require("../services/carrier"));
var import_player = __toESM(require("../services/player"));
var import_name = __toESM(require("../services/name"));
var import_technology = __toESM(require("../services/technology"));
const mongoose = require("mongoose");
const gameNames = require("../config/game/gameNames");
const starNames = require("../config/game/starNames");
const game = {
  settings: {
    general: {
      playerLimit: 4
    },
    player: {
      startingCredits: 500,
      startingShips: 10,
      startingStars: 3,
      startingInfrastructure: {
        economy: 5,
        industry: 5,
        science: 1
      },
      developmentCost: {
        economy: "standard",
        industry: "standard",
        science: "standard"
      }
    },
    technology: {
      startingTechnologyLevel: {
        terraforming: 1,
        experimentation: 1,
        scanning: 1,
        hyperspace: 1,
        manufacturing: 1,
        banking: 1,
        weapons: 1,
        specialists: 1
      },
      researchCosts: {
        terraforming: "standard",
        experimentation: "standard",
        scanning: "standard",
        hyperspace: "standard",
        manufacturing: "standard",
        banking: "standard",
        weapons: "standard",
        specialists: "standard"
      }
    },
    galaxy: {
      galaxyType: "circular"
    },
    specialGalaxy: {
      playerDistribution: "circular",
      carrierSpeed: 5
    }
  },
  constants: {
    distances: {
      lightYear: 30,
      minDistanceBetweenStars: 30,
      maxDistanceBetweenStars: 300
    },
    star: {
      resources: {
        minNaturalResources: 10,
        maxNaturalResources: 50
      }
    }
  },
  galaxy: {
    stars: []
  }
};
function generateStarGrid() {
  let stars = [];
  let i = 0;
  for (let x = 0; x < 100; x += 10) {
    for (let y = 0; y < 100; y += 10) {
      i++;
      stars.push({
        _id: new mongoose.Types.ObjectId(),
        name: `Star ${i}`,
        location: {
          x,
          y
        },
        infrastructure: {},
        naturalResources: {}
      });
    }
  }
  return stars;
}
function assertNewPlayer(newPlayer, colour) {
  colour = colour || newPlayer.colour;
  expect(newPlayer).not.toBe(null);
  expect(newPlayer._id).not.toBe(null);
  expect(newPlayer.userId).toBe(null);
  expect(newPlayer.alias).not.toBe(null);
  expect(newPlayer.credits).toEqual(game.settings.player.startingCredits);
  expect(newPlayer.colour).toBe(colour);
  for (var key in newPlayer.research) {
    const res1 = newPlayer.research[key].level;
    const res2 = game.settings.technology.startingTechnologyLevel[key];
    expect(res1).toEqual(res2);
  }
}
describe("player", () => {
  let randomService;
  let distanceService;
  let starDistanceService;
  let carrierService;
  let starService;
  let nameService;
  let mapService;
  let technologyService;
  let playerService;
  beforeEach(() => {
    randomService = new import_random.default();
    distanceService = new import_distance.default();
    starDistanceService = new import_starDistance.default(distanceService);
    carrierService = new import_carrier.default();
    starService = new import_star.default({}, randomService);
    nameService = new import_name.default(gameNames, starNames, randomService);
    mapService = new import_map.default(randomService, starService, distanceService, starDistanceService, nameService);
    technologyService = new import_technology.default();
    playerService = new import_player.default(null, randomService, mapService, starService, carrierService, starDistanceService, technologyService);
  });
  it("should create an empty player", () => {
    const yellow = { alias: "Yellow", value: "0xFFC000" };
    const newPlayer = playerService.createEmptyPlayer(game, yellow);
    assertNewPlayer(newPlayer, yellow);
  });
  it("should create a list of empty players", () => {
    const allStars = generateStarGrid();
    game.galaxy.stars = allStars;
    const players = playerService.createEmptyPlayers(game);
    expect(players.length).toEqual(game.settings.general.playerLimit);
    for (let i = 0; i < players.length; i++) {
      let newPlayer = players[i];
      assertNewPlayer(newPlayer, null);
      const starsOwned = allStars.filter((x) => x.ownedByPlayerId === newPlayer._id);
      expect(starsOwned.length).toEqual(game.settings.player.startingStars);
      starsOwned.filter((x) => !x.homeStar).forEach((s) => {
        expect(s.ships).toEqual(game.settings.player.startingShips);
      });
      const homeStar = allStars.find((x) => x._id === newPlayer.homeStarId);
      expect(homeStar.ships).toEqual(game.settings.player.startingShips);
    }
  });
});
//# sourceMappingURL=player.spec.js.map
