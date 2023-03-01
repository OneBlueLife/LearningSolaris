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
var player_exports = {};
__export(player_exports, {
  default: () => PlayerService
});
module.exports = __toCommonJS(player_exports);
var import_validation = __toESM(require("../errors/validation"));
const mongoose = require("mongoose");
const moment = require("moment");
const EventEmitter = require("events");
class PlayerService extends EventEmitter {
  constructor(gameRepo, randomService, mapService, starService, carrierService, starDistanceService, technologyService, specialistService, gameTypeService, playerReadyService) {
    super();
    this.gameRepo = gameRepo;
    this.randomService = randomService;
    this.mapService = mapService;
    this.starService = starService;
    this.carrierService = carrierService;
    this.starDistanceService = starDistanceService;
    this.technologyService = technologyService;
    this.specialistService = specialistService;
    this.gameTypeService = gameTypeService;
    this.playerReadyService = playerReadyService;
  }
  getById(game, playerId) {
    return game.galaxy.players.find((p) => p._id.toString() === playerId.toString());
  }
  getByUserId(game, userId) {
    return game.galaxy.players.find((p) => p.userId && p.userId.toString() === userId.toString());
  }
  getPlayersWithinScanningRangeOfPlayer(game, players, player) {
    let inRange = [player];
    let playerStars = this.starService.listStarsWithScanningRangeByPlayer(game, player._id);
    for (let otherPlayer of players) {
      if (inRange.indexOf(otherPlayer) > -1) {
        continue;
      }
      let otherPlayerStars = this.starService.listStarsOwnedByPlayer(game.galaxy.stars, otherPlayer._id);
      let isInRange = false;
      for (let s of otherPlayerStars) {
        if (this.starService.isStarWithinScanningRangeOfStars(game, s, playerStars)) {
          isInRange = true;
          break;
        }
      }
      if (isInRange) {
        inRange.push(otherPlayer);
      }
    }
    return inRange;
  }
  isInScanningRangeOfPlayer(game, sourcePlayer, targetPlayer) {
    return this.getPlayersWithinScanningRangeOfPlayer(game, [targetPlayer], sourcePlayer).find((p) => p._id.toString() === targetPlayer._id.toString()) != null;
  }
  createEmptyPlayer(game, colour, shape) {
    let researchingNow = "terraforming";
    let researchingNext = "terraforming";
    let player = {
      _id: mongoose.Types.ObjectId(),
      userId: null,
      homeStarId: null,
      alias: "Empty Slot",
      avatar: null,
      notes: null,
      colour,
      shape,
      lastSeen: null,
      lastSeenIP: null,
      researchingNow,
      researchingNext,
      credits: game.settings.player.startingCredits,
      creditsSpecialists: game.settings.player.startingCreditsSpecialists,
      isOpenSlot: true,
      defeated: false,
      defeatedDate: null,
      afk: false,
      renownToGive: game.settings.general.playerLimit,
      ready: false,
      readyToCycle: false,
      readyToQuit: false,
      missedTurns: 0,
      hasSentTurnReminder: false,
      hasFilledAfkSlot: false,
      research: {
        terraforming: { level: game.settings.technology.startingTechnologyLevel.terraforming },
        experimentation: { level: game.settings.technology.startingTechnologyLevel.experimentation },
        scanning: { level: game.settings.technology.startingTechnologyLevel.scanning },
        hyperspace: { level: game.settings.technology.startingTechnologyLevel.hyperspace },
        manufacturing: { level: game.settings.technology.startingTechnologyLevel.manufacturing },
        banking: { level: game.settings.technology.startingTechnologyLevel.banking },
        weapons: { level: game.settings.technology.startingTechnologyLevel.weapons },
        specialists: { level: game.settings.technology.startingTechnologyLevel.specialists }
      },
      ledger: {
        credits: [],
        creditsSpecialists: []
      },
      reputations: [],
      diplomacy: [],
      spectators: []
    };
    this._setDefaultResearchTechnology(game, player);
    return player;
  }
  createEmptyPlayers(game) {
    let players = [];
    let shapeColours = this._generatePlayerColourShapeList(game.settings.general.playerLimit);
    for (let i = 0; i < game.settings.general.playerLimit; i++) {
      let shapeColour = shapeColours[i];
      players.push(this.createEmptyPlayer(game, shapeColour.colour, shapeColour.shape));
    }
    if (game.galaxy.homeStars && game.galaxy.homeStars.length) {
      this._distributePlayerLinkedHomeStars(game, players);
    } else {
      this._distributePlayerHomeStars(game, players);
    }
    if (game.galaxy.linkedStars && game.galaxy.linkedStars.length) {
      this._distributePlayerLinkedStartingStars(game, players);
    } else {
      this._distributePlayerStartingStars(game, players);
    }
    return players;
  }
  _generatePlayerColourShapeList(playerCount) {
    let shapes = ["circle", "square", "diamond", "hexagon"];
    let colours = require("../config/game/colours").slice();
    let combinations = [];
    for (let shape of shapes) {
      for (let colour of colours) {
        combinations.push({
          shape,
          colour
        });
      }
    }
    let result = [];
    const maxAttempts = 2;
    let attempts = 0;
    while (result.length !== playerCount) {
      let shapeColourIndex = this.randomService.getRandomNumber(combinations.length - 1);
      let shapeColour = combinations[shapeColourIndex];
      let existingColour = result.find((r) => r.colour.alias === shapeColour.colour.alias);
      if (!existingColour || attempts >= maxAttempts) {
        combinations.splice(shapeColourIndex, 1);
        result.push(shapeColour);
        attempts = 0;
      } else {
        attempts++;
      }
    }
    return result;
  }
  _distributePlayerLinkedHomeStars(game, players) {
    for (let player of players) {
      let homeStarId = game.galaxy.homeStars.pop();
      let homeStar = this.starService.getById(game, homeStarId);
      this.starService.setupHomeStar(game, homeStar, player, game.settings);
    }
  }
  _distributePlayerHomeStars(game, players) {
    const starLocations = game.galaxy.stars.map((s) => s.location);
    let galaxyCenter = this.mapService.getGalaxyCenterOfMass(starLocations);
    const distanceFromCenter = this._getDesiredPlayerDistanceFromCenter(game);
    let radians = this._getPlayerStartingLocationRadians(game.settings.general.playerLimit);
    for (let player of players) {
      let homeStar = this._getNewPlayerHomeStar(game, starLocations, galaxyCenter, distanceFromCenter, radians);
      this.starService.setupHomeStar(game, homeStar, player, game.settings);
    }
  }
  _getDesiredPlayerDistanceFromCenter(game) {
    let distanceFromCenter;
    const locations = game.galaxy.stars.map((s) => s.location);
    if (game.settings.galaxy.galaxyType === "doughnut") {
      distanceFromCenter = this.starDistanceService.getMaxGalaxyDiameter(locations) / 2 * (3 / 4);
    } else if (game.settings.galaxy.galaxyType === "spiral") {
      distanceFromCenter = this.starDistanceService.getMaxGalaxyDiameter(locations) / 2 / 2;
    } else {
      distanceFromCenter = this.starDistanceService.getMaxGalaxyDiameter(locations) / 2 * (2 / 3);
    }
    return distanceFromCenter;
  }
  _distributePlayerLinkedStartingStars(game, players) {
    for (let player of players) {
      let linkedStars = game.galaxy.linkedStars.pop();
      for (let starId of linkedStars) {
        let star = this.starService.getById(game, starId);
        this.starService.setupPlayerStarForGameStart(game, star, player);
      }
    }
  }
  _distributePlayerStartingStars(game, players) {
    let starsToDistribute = game.settings.player.startingStars - 1;
    while (starsToDistribute--) {
      for (let player of players) {
        let homeStar = this.starService.getById(game, player.homeStarId);
        let s = this.starDistanceService.getClosestUnownedStar(homeStar, game.galaxy.stars);
        this.starService.setupPlayerStarForGameStart(game, s, player);
      }
    }
  }
  resetPlayerForGameStart(game, player) {
    player.userId = null;
    player.alias = "Empty Slot";
    player.avatar = null;
    player.credits = game.settings.player.startingCredits;
    player.creditsSpecialists = game.settings.player.startingCreditsSpecialists;
    player.ready = false;
    player.readyToCycle = false;
    player.readyToQuit = false;
    player.isOpenSlot = true;
    player.spectators = [];
    this._setDefaultResearchTechnology(game, player);
    let playerStars = this.starService.listStarsOwnedByPlayer(game.galaxy.stars, player._id);
    for (let star of playerStars) {
      this.starService.setupPlayerStarForGameStart(game, star, player);
    }
    this.carrierService.clearPlayerCarriers(game, player);
    let homeCarrier = this.createHomeStarCarrier(game, player);
    game.galaxy.carriers.push(homeCarrier);
  }
  _getNewPlayerHomeStar(game, starLocations, galaxyCenter, distanceFromCenter, radians) {
    switch (game.settings.specialGalaxy.playerDistribution) {
      case "circular":
        return this._getNewPlayerHomeStarCircular(game, starLocations, galaxyCenter, distanceFromCenter, radians);
      case "random":
        return this._getNewPlayerHomeStarRandom(game);
    }
    throw new Error(`Unsupported player distribution setting: ${game.settings.specialGalaxy.playerDistribution}`);
  }
  _getNewPlayerHomeStarCircular(game, starLocations, galaxyCenter, distanceFromCenter, radians) {
    let startingLocation = this._getPlayerStartingLocation(radians, galaxyCenter, distanceFromCenter);
    let homeStar = this.starDistanceService.getClosestUnownedStarFromLocation(startingLocation, game.galaxy.stars);
    return homeStar;
  }
  _getNewPlayerHomeStarRandom(game) {
    let unownedStars = game.galaxy.stars.filter((s) => s.ownedByPlayerId == null);
    let rnd = this.randomService.getRandomNumber(unownedStars.length);
    return unownedStars[rnd];
  }
  _getPlayerStartingLocationRadians(playerCount) {
    const increment = 360 / playerCount * Math.PI / 180;
    let current = 0;
    let radians = [];
    for (let i = 0; i < playerCount; i++) {
      radians.push(current);
      current += increment;
    }
    return radians;
  }
  _getPlayerStartingLocation(radians, galaxyCenter, distanceFromCenter) {
    let radianIndex = this.randomService.getRandomNumber(radians.length);
    let currentRadians = radians.splice(radianIndex, 1)[0];
    let startingLocation = {
      x: distanceFromCenter * Math.cos(currentRadians),
      y: distanceFromCenter * Math.sin(currentRadians)
    };
    startingLocation.x += galaxyCenter.x;
    startingLocation.y += galaxyCenter.y;
    return startingLocation;
  }
  _setDefaultResearchTechnology(game, player) {
    let enabledTechs = this.technologyService.getEnabledTechnologies(game);
    player.researchingNow = enabledTechs[0] || "weapons";
    player.researchingNext = player.researchingNow;
  }
  createHomeStarCarriers(game) {
    let carriers = [];
    for (let i = 0; i < game.galaxy.players.length; i++) {
      let player = game.galaxy.players[i];
      let homeCarrier = this.createHomeStarCarrier(game, player);
      carriers.push(homeCarrier);
    }
    return carriers;
  }
  createHomeStarCarrier(game, player) {
    let homeStar = this.starService.getPlayerHomeStar(game.galaxy.stars, player);
    if (!homeStar) {
      throw new Error("The player must have a home star in order to set up a carrier");
    }
    let homeCarrier = this.carrierService.createAtStar(homeStar, game.galaxy.carriers);
    return homeCarrier;
  }
  updateLastSeen(game, player, date) {
    player.lastSeen = date || moment().utc();
  }
  async updateLastSeenLean(gameId, userId, ipAddress) {
    await this.gameRepo.updateOne({
      _id: gameId,
      "galaxy.players.userId": userId
    }, {
      $set: {
        "galaxy.players.$.lastSeen": moment().utc(),
        "galaxy.players.$.lastSeenIP": ipAddress
      }
    });
  }
  deductCarrierUpkeepCost(game, player) {
    const upkeepCosts = {
      "none": 0,
      "cheap": 1,
      "standard": 3,
      "expensive": 6
    };
    let costPerCarrier = upkeepCosts[game.settings.specialGalaxy.carrierUpkeepCost];
    if (!costPerCarrier) {
      return null;
    }
    let carrierCount = this.carrierService.listCarriersOwnedByPlayer(game.galaxy.carriers, player._id).length;
    let totalCost = carrierCount * costPerCarrier;
    player.credits -= totalCost;
    return {
      carrierCount,
      totalCost
    };
  }
  async getGameNotes(game, player) {
    return player.notes;
  }
  async updateGameNotes(game, player, notes) {
    if (notes.length > 2e3) {
      throw new import_validation.default("Notes cannot exceed 2000 characters.");
    }
    player.notes = notes;
    await this.gameRepo.updateOne({
      _id: game._id,
      "galaxy.players._id": player._id
    }, {
      $set: {
        "galaxy.players.$.notes": notes
      }
    });
  }
  ownsOriginalHomeStar(game, player) {
    const stars = this.starService.listStarsOwnedByPlayer(game.galaxy.stars, player._id);
    return stars.find((s) => s._id.toString() === player.homeStarId.toString()) != null;
  }
  incrementMissedTurns(game) {
    for (let player of game.galaxy.players) {
      if (!player.ready && !player.defeated) {
        player.missedTurns++;
      } else {
        player.missedTurns = 0;
      }
    }
  }
  setPlayerAsDefeated(game, player, openSlot) {
    player.isOpenSlot = openSlot;
    player.defeated = true;
    player.defeatedDate = moment().utc();
    player.researchingNext = "random";
    if (game.settings.gameTime.gameType === "turnBased") {
      player.ready = true;
    }
    const playerStars = this.starService.listStarsOwnedByPlayer(game.galaxy.stars, player._id);
    for (let star of playerStars) {
      this.starService.resetIgnoreBulkUpgradeStatuses(star);
    }
    this.carrierService.clearPlayerCarrierWaypointsLooped(game, player);
  }
  setPlayerAsAfk(game, player) {
    this.setPlayerAsDefeated(game, player, true);
    player.isOpenSlot = true;
    player.afk = true;
  }
  hasDuplicateLastSeenIP(game, player) {
    if (!player.lastSeenIP) {
      return false;
    }
    return game.galaxy.players.find((p) => p.lastSeenIP && p._id.toString() !== player._id.toString() && p.lastSeenIP === player.lastSeenIP) != null;
  }
  getKingOfTheHillPlayer(game) {
    const star = this.starService.getKingOfTheHillStar(game);
    if (!star.ownedByPlayerId) {
      return null;
    }
    return this.getById(game, star.ownedByPlayerId);
  }
  async setHasSentTurnReminder(game, player, sent) {
    await this.gameRepo.updateOne({
      _id: game._id,
      "galaxy.players._id": player._id
    }, {
      $set: {
        "galaxy.players.$.hasSentTurnReminder": sent
      }
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=player.js.map
