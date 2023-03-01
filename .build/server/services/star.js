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
var star_exports = {};
__export(star_exports, {
  StarServiceEvents: () => StarServiceEvents,
  default: () => StarService
});
module.exports = __toCommonJS(star_exports);
var import_validation = __toESM(require("../errors/validation"));
const EventEmitter = require("events");
const mongoose = require("mongoose");
const RNG = require("random-seed");
const StarServiceEvents = {
  onPlayerStarAbandoned: "onPlayerStarAbandoned",
  onPlayerStarDied: "onPlayerStarDied",
  onPlayerStarReignited: "onPlayerStarReignited"
};
class StarService extends EventEmitter {
  constructor(gameRepo, randomService, nameService, distanceService, starDistanceService, technologyService, specialistService, userService, gameTypeService, gameStateService) {
    super();
    this.gameRepo = gameRepo;
    this.randomService = randomService;
    this.nameService = nameService;
    this.distanceService = distanceService;
    this.starDistanceService = starDistanceService;
    this.technologyService = technologyService;
    this.specialistService = specialistService;
    this.userService = userService;
    this.gameTypeService = gameTypeService;
    this.gameStateService = gameStateService;
  }
  generateUnownedStar(name, location, naturalResources) {
    naturalResources = naturalResources || {
      economy: 0,
      industry: 0,
      science: 0
    };
    return {
      _id: mongoose.Types.ObjectId(),
      name,
      location,
      naturalResources,
      infrastructure: {
        economy: 0,
        industry: 0,
        science: 0
      }
    };
  }
  generateCustomGalaxyStar(name, star) {
    return {
      _id: star._id,
      name,
      naturalResources: star.naturalResources,
      location: star.location,
      infrastructure: star.infrastructure,
      homeStar: star.homeStar,
      warpGate: star.warpGate,
      isNebula: star.isNebula,
      isAsteroidField: star.isAsteroidField,
      isBinaryStar: star.isBinaryStar,
      isBlackHole: star.isBlackHole,
      isPulsar: star.isPulsar,
      wormHoleToStarId: star.wormHoleToStarId,
      specialistId: star.specialistId
    };
  }
  generateStarPosition(game, originX, originY, radius) {
    if (radius == null) {
      radius = game.constants.distances.maxDistanceBetweenStars;
    }
    return this.randomService.getRandomPositionInCircleFromOrigin(originX, originY, radius);
  }
  getById(game, id) {
    return this.getByIdBS(game, id);
  }
  getByIdBS(game, id) {
    let start = 0;
    let end = game.galaxy.stars.length - 1;
    while (start <= end) {
      let middle = Math.floor((start + end) / 2);
      let star = game.galaxy.stars[middle];
      if (star._id.toString() === id.toString()) {
        return star;
      } else if (star._id.toString() < id.toString()) {
        start = middle + 1;
      } else {
        end = middle - 1;
      }
    }
    return game.galaxy.stars.find((s) => s._id.toString() === id.toString());
  }
  setupHomeStar(game, homeStar, player, gameSettings) {
    player.homeStarId = homeStar._id;
    homeStar.ownedByPlayerId = player._id;
    homeStar.shipsActual = Math.max(gameSettings.player.startingShips, 1);
    homeStar.ships = homeStar.shipsActual;
    homeStar.homeStar = true;
    homeStar.warpGate = false;
    homeStar.specialistId = null;
    this.resetIgnoreBulkUpgradeStatuses(homeStar);
    if (gameSettings.galaxy.galaxyType !== "custom") {
      homeStar.naturalResources.economy = game.constants.star.resources.maxNaturalResources;
      homeStar.naturalResources.industry = game.constants.star.resources.maxNaturalResources;
      homeStar.naturalResources.science = game.constants.star.resources.maxNaturalResources;
    }
    homeStar.infrastructure.economy = gameSettings.player.startingInfrastructure.economy;
    homeStar.infrastructure.industry = gameSettings.player.startingInfrastructure.industry;
    homeStar.infrastructure.science = gameSettings.player.startingInfrastructure.science;
  }
  getPlayerHomeStar(stars, player) {
    return this.listStarsOwnedByPlayer(stars, player._id).find((s) => s._id.toString() === player.homeStarId.toString());
  }
  listStarsOwnedByPlayer(stars, playerId) {
    return stars.filter((s) => s.ownedByPlayerId && s.ownedByPlayerId.toString() === playerId.toString());
  }
  listStarsOwnedByPlayers(stars, playerIds) {
    const ids = playerIds.map((p) => p.toString());
    return stars.filter((s) => s.ownedByPlayerId && ids.includes(s.ownedByPlayerId.toString()));
  }
  isOwnedByPlayer(star, player) {
    return star.ownedByPlayerId && star.ownedByPlayerId.toString() === player._id.toString();
  }
  listStarsAliveOwnedByPlayer(stars, playerId) {
    return this.listStarsOwnedByPlayer(stars, playerId).filter((s) => !this.isDeadStar(s));
  }
  listStarIdsWithPlayerCarriersInOrbit(game, playerId) {
    return game.galaxy.carriers.filter((c) => c.orbiting).filter((c) => c.ownedByPlayerId.toString() === playerId.toString()).map((c) => c.orbiting.toString());
  }
  listStarIdsWithPlayersCarriersInOrbit(game, playerIds) {
    const ids = playerIds.map((p) => p.toString());
    return game.galaxy.carriers.filter((c) => c.orbiting).filter((c) => ids.includes(c.ownedByPlayerId.toString())).map((c) => c.orbiting.toString());
  }
  listStarsWithScanningRangeByPlayer(game, playerId) {
    let starIds = this.listStarsOwnedByPlayer(game.galaxy.stars, playerId).map((s) => s._id.toString());
    if (game.settings.diplomacy.enabled === "enabled") {
      starIds = starIds.concat(this.listStarIdsWithPlayerCarriersInOrbit(game, playerId));
    }
    starIds = [...new Set(starIds)];
    return starIds.map((id) => this.getById(game, id)).filter((s) => !this.isDeadStar(s));
  }
  listStarsWithScanningRangeByPlayers(game, playerIds) {
    let starIds = this.listStarsOwnedByPlayers(game.galaxy.stars, playerIds).map((s) => s._id.toString());
    if (game.settings.diplomacy.enabled === "enabled") {
      starIds = starIds.concat(this.listStarIdsWithPlayersCarriersInOrbit(game, playerIds));
    }
    starIds = [...new Set(starIds)];
    return starIds.map((id) => this.getById(game, id)).filter((s) => !this.isDeadStar(s));
  }
  listStarsOwnedOrInOrbitByPlayers(game, playerIds) {
    let starIds = this.listStarsOwnedByPlayers(game.galaxy.stars, playerIds).map((s) => s._id.toString());
    if (game.settings.diplomacy.enabled === "enabled") {
      starIds = starIds.concat(this.listStarIdsWithPlayersCarriersInOrbit(game, playerIds));
    }
    starIds = [...new Set(starIds)];
    return starIds.map((id) => this.getById(game, id));
  }
  listStarsOwnedByPlayerBulkIgnored(stars, playerId, infrastructureType) {
    return this.listStarsOwnedByPlayer(stars, playerId).filter((s) => s.ignoreBulkUpgrade[infrastructureType]);
  }
  isStarWithinScanningRangeOfStars(game, star, stars) {
    if (star.isPulsar && this.gameStateService.isStarted(game)) {
      return true;
    }
    for (let otherStar of stars) {
      if (otherStar.ownedByPlayerId == null) {
        continue;
      }
      let effectiveTechs = this.technologyService.getStarEffectiveTechnologyLevels(game, otherStar);
      let scanningRangeDistance = this.distanceService.getScanningDistance(game, effectiveTechs.scanning);
      let distance = this.starDistanceService.getDistanceBetweenStars(star, otherStar);
      if (distance <= scanningRangeDistance) {
        return true;
      }
    }
    return false;
  }
  filterStarsByScanningRange(game, playerIds) {
    let starsOwnedOrInOrbit = this.listStarsOwnedOrInOrbitByPlayers(game, playerIds);
    let starsWithScanning = starsOwnedOrInOrbit.filter((s) => !this.isDeadStar(s));
    let starsInRange = starsOwnedOrInOrbit.map((s) => {
      return {
        _id: s._id,
        location: s.location,
        ownedByPlayerId: s.ownedByPlayerId
      };
    });
    let starsToCheck = game.galaxy.stars.filter((s) => starsInRange.find((r) => r._id.toString() === s._id.toString()) == null).map((s) => {
      return {
        _id: s._id,
        location: s.location,
        ownedByPlayerId: s.ownedByPlayerId,
        isAlwaysVisible: s.isPulsar
      };
    });
    for (let star of starsWithScanning) {
      let starIds = this.getStarsWithinScanningRangeOfStarByStarIds(game, star, starsToCheck);
      for (let starId of starIds) {
        if (starsInRange.find((x) => x._id.toString() === starId._id.toString()) == null) {
          starsInRange.push(starId);
          starsToCheck.splice(starsToCheck.indexOf(starId), 1);
        }
      }
      if (!starsToCheck.length) {
        break;
      }
    }
    if (game.settings.specialGalaxy.randomWormHoles) {
      let wormHoleStars = starsOwnedOrInOrbit.filter((s) => s.wormHoleToStarId).map((s) => {
        return {
          source: s,
          destination: this.getById(game, s.wormHoleToStarId)
        };
      });
      for (let wormHoleStar of wormHoleStars) {
        if (starsInRange.find((s) => s._id.toString() === wormHoleStar.destination._id.toString()) == null) {
          starsInRange.push({
            _id: wormHoleStar.destination._id,
            location: wormHoleStar.destination.location,
            ownedByPlayerId: wormHoleStar.destination.ownedByPlayerId
          });
        }
      }
    }
    return starsInRange.map((s) => this.getById(game, s._id));
  }
  filterStarsByScanningRangeAndWaypointDestinations(game, playerIds) {
    let starsInScanningRange = this.filterStarsByScanningRange(game, playerIds);
    const ids = playerIds.map((p) => p.toString());
    let inTransitStars = game.galaxy.carriers.filter((c) => !c.orbiting).filter((c) => ids.includes(c.ownedByPlayerId.toString())).map((c) => c.waypoints[0].destination).map((d) => this.getById(game, d));
    for (let transitStar of inTransitStars) {
      if (starsInScanningRange.indexOf(transitStar) < 0) {
        starsInScanningRange.push(transitStar);
      }
    }
    return starsInScanningRange;
  }
  getStarsWithinScanningRangeOfStarByStarIds(game, star, stars) {
    if (star.ownedByPlayerId == null) {
      return [];
    }
    let effectiveTechs = this.technologyService.getStarEffectiveTechnologyLevels(game, star, true);
    let scanningRangeDistance = this.distanceService.getScanningDistance(game, effectiveTechs.scanning);
    let starsInRange = stars.filter((s) => {
      return s.isAlwaysVisible || this.starDistanceService.getDistanceBetweenStars(s, star) <= scanningRangeDistance;
    });
    return starsInRange;
  }
  calculateActualNaturalResources(star) {
    return {
      economy: Math.max(Math.floor(star.naturalResources.economy), 0),
      industry: Math.max(Math.floor(star.naturalResources.industry), 0),
      science: Math.max(Math.floor(star.naturalResources.science), 0)
    };
  }
  calculateTerraformedResources(star, terraforming) {
    return {
      economy: this.calculateTerraformedResource(star.naturalResources.economy, terraforming),
      industry: this.calculateTerraformedResource(star.naturalResources.industry, terraforming),
      science: this.calculateTerraformedResource(star.naturalResources.science, terraforming)
    };
  }
  calculateTerraformedResource(naturalResource, terraforming) {
    return Math.floor(naturalResource + 5 * terraforming);
  }
  async abandonStar(game, player, starId) {
    let star = game.galaxy.stars.find((x) => x._id.toString() === starId.toString());
    if ((star.ownedByPlayerId || "").toString() !== player._id.toString()) {
      throw new import_validation.default(`Cannot abandon a star that is not owned by the player.`);
    }
    this.resetIgnoreBulkUpgradeStatuses(star);
    let playerCarriers = game.galaxy.carriers.filter(
      (x) => x.orbiting && x.orbiting.toString() === star._id.toString() && x.ownedByPlayerId.toString() === player._id.toString()
    );
    for (let playerCarrier of playerCarriers) {
      game.galaxy.carriers.splice(game.galaxy.carriers.indexOf(playerCarrier), 1);
    }
    star.ownedByPlayerId = null;
    star.shipsActual = 0;
    star.ships = star.shipsActual;
    await game.save();
    this.emit(StarServiceEvents.onPlayerStarAbandoned, {
      gameId: game._id,
      gameTick: game.state.tick,
      player,
      star
    });
  }
  isStarPairWormHole(sourceStar, destinationStar) {
    return sourceStar && destinationStar && sourceStar.wormHoleToStarId && destinationStar.wormHoleToStarId && sourceStar.wormHoleToStarId.toString() === destinationStar._id.toString() && destinationStar.wormHoleToStarId.toString() === sourceStar._id.toString();
  }
  canPlayersSeeStarShips(star, playerIds) {
    const ids = playerIds.map((p) => p.toString());
    const isOwnedByPlayer = ids.includes((star.ownedByPlayerId || "").toString());
    if (isOwnedByPlayer) {
      return true;
    }
    if (star.isNebula) {
      return false;
    }
    if (star.specialistId) {
      let specialist = this.specialistService.getByIdStar(star.specialistId);
      if (specialist && specialist.modifiers.special && specialist.modifiers.special.hideShips) {
        return false;
      }
    }
    return true;
  }
  async claimUnownedStar(game, gameUsers, star, carrier) {
    if (star.ownedByPlayerId) {
      throw new import_validation.default(`Cannot claim an owned star`);
    }
    star.ownedByPlayerId = carrier.ownedByPlayerId;
    this.resetIgnoreBulkUpgradeStatuses(star);
    if (carrier.isGift) {
      carrier.isGift = false;
    }
    let carrierPlayer = game.galaxy.players.find((p) => p._id.toString() === carrier.ownedByPlayerId.toString());
    let carrierUser = gameUsers.find((u) => carrierPlayer.userId && u._id.toString() === carrierPlayer.userId.toString()) || null;
    if (carrierUser && !carrierPlayer.defeated && !this.gameTypeService.isTutorialGame(game)) {
      carrierUser.achievements.combat.stars.captured++;
      if (star.homeStar) {
        carrierUser.achievements.combat.homeStars.captured++;
      }
    }
  }
  applyStarSpecialistSpecialModifiers(game) {
    for (let i = 0; i < game.galaxy.stars.length; i++) {
      let star = game.galaxy.stars[i];
      if (star.ownedByPlayerId) {
        if (star.specialistId) {
          let specialist = this.specialistService.getByIdStar(star.specialistId);
          if (specialist && specialist.modifiers.special) {
            if (specialist.modifiers.special.addNaturalResourcesOnTick) {
              this.addNaturalResources(game, star, specialist.modifiers.special.addNaturalResourcesOnTick);
            }
          }
        }
      }
    }
  }
  isDeadStar(star) {
    if (!star.naturalResources) {
      return true;
    }
    return star.naturalResources.economy <= 0 && star.naturalResources.industry <= 0 && star.naturalResources.science <= 0;
  }
  addNaturalResources(game, star, amount) {
    let wasDeadStar = this.isDeadStar(star);
    if (this.gameTypeService.isSplitResources(game)) {
      let total = star.naturalResources.economy + star.naturalResources.industry + star.naturalResources.science;
      star.naturalResources.economy += 3 * amount * (star.naturalResources.economy / total);
      star.naturalResources.industry += 3 * amount * (star.naturalResources.industry / total);
      star.naturalResources.science += 3 * amount * (star.naturalResources.science / total);
    } else {
      star.naturalResources.economy += amount;
      star.naturalResources.industry += amount;
      star.naturalResources.science += amount;
    }
    if (Math.floor(star.naturalResources.economy) <= 0) {
      star.naturalResources.economy = 0;
    }
    if (Math.floor(star.naturalResources.industry) <= 0) {
      star.naturalResources.industry = 0;
    }
    if (Math.floor(star.naturalResources.science) <= 0) {
      star.naturalResources.science = 0;
    }
    if (this.isDeadStar(star)) {
      star.specialistId = null;
      star.warpGate = false;
      star.infrastructure.economy = 0;
      star.infrastructure.industry = 0;
      star.infrastructure.science = 0;
      if (star.ownedByPlayerId) {
        this.emit(StarServiceEvents.onPlayerStarDied, {
          gameId: game._id,
          gameTick: game.state.tick,
          playerId: star.ownedByPlayerId,
          starId: star._id,
          starName: star.name
        });
      }
    } else if (wasDeadStar && star.ownedByPlayerId) {
      this.emit(StarServiceEvents.onPlayerStarReignited, {
        gameId: game._id,
        gameTick: game.state.tick,
        playerId: star.ownedByPlayerId,
        starId: star._id,
        starName: star.name
      });
    }
  }
  reigniteDeadStar(game, star, naturalResources) {
    if (!this.isDeadStar(star)) {
      throw new Error("The star cannot be reignited, it is not dead.");
    }
    star.naturalResources = naturalResources;
    if (star.ownedByPlayerId) {
      this.emit(StarServiceEvents.onPlayerStarReignited, {
        gameId: game._id,
        gameTick: game.state.tick,
        playerId: star.ownedByPlayerId,
        starId: star._id,
        starName: star.name
      });
    }
  }
  destroyStar(game, star) {
    game.galaxy.stars.splice(game.galaxy.stars.indexOf(star), 1);
    game.state.stars--;
    if (star.wormHoleToStarId) {
      const wormHolePairStar = this.getById(game, star.wormHoleToStarId);
      if (wormHolePairStar) {
        wormHolePairStar.wormHoleToStarId = null;
      }
    }
    if (game.settings.general.mode === "conquest") {
      switch (game.settings.conquest.victoryCondition) {
        case "starPercentage":
          game.state.starsForVictory = Math.ceil(game.state.stars / 100 * game.settings.conquest.victoryPercentage);
          break;
        case "homeStarPercentage":
          game.state.starsForVictory = Math.ceil(game.settings.general.playerLimit / 100 * game.settings.conquest.victoryPercentage);
          break;
        default:
          throw new Error(`Unsupported conquest victory condition: ${game.settings.conquest.victoryCondition}`);
      }
    }
  }
  async toggleIgnoreBulkUpgrade(game, player, starId, infrastructureType) {
    let star = this.getById(game, starId);
    if (!star.ownedByPlayerId || star.ownedByPlayerId.toString() !== player._id.toString()) {
      throw new import_validation.default(`You do not own this star.`);
    }
    let newValue = star.ignoreBulkUpgrade[infrastructureType] ? false : true;
    let updateObject = {
      $set: {}
    };
    updateObject["$set"][`galaxy.stars.$.ignoreBulkUpgrade.${infrastructureType}`] = newValue;
    await this.gameRepo.updateOne({
      _id: game._id,
      "galaxy.stars._id": starId
    }, updateObject);
  }
  async toggleIgnoreBulkUpgradeAll(game, player, starId, ignoreStatus) {
    let star = this.getById(game, starId);
    if (!star.ownedByPlayerId || star.ownedByPlayerId.toString() !== player._id.toString()) {
      throw new import_validation.default(`You do not own this star.`);
    }
    await this.gameRepo.updateOne({
      _id: game._id,
      "galaxy.stars._id": starId
    }, {
      $set: {
        "galaxy.stars.$.ignoreBulkUpgrade.economy": ignoreStatus,
        "galaxy.stars.$.ignoreBulkUpgrade.industry": ignoreStatus,
        "galaxy.stars.$.ignoreBulkUpgrade.science": ignoreStatus
      }
    });
  }
  captureStar(game, star, owner, defenders, defenderUsers, attackers, attackerUsers, attackerCarriers) {
    const isTutorialGame = this.gameTypeService.isTutorialGame(game);
    let specialist = this.specialistService.getByIdStar(star.specialistId);
    if (specialist && specialist.modifiers.special && specialist.modifiers.special.destroyInfrastructureOnLoss) {
      star.specialistId = null;
      star.infrastructure.economy = 0;
      star.infrastructure.industry = 0;
      star.infrastructure.science = 0;
      star.warpGate = false;
    }
    let capturePlayerId = attackerCarriers.sort((a, b) => {
      if (a.ships > b.ships)
        return -1;
      if (a.ships < b.ships)
        return 1;
      return (a.distanceToDestination || 0) - (b.distanceToDestination || 0);
    })[0].ownedByPlayerId;
    let newStarPlayer = attackers.find((p) => p._id.toString() === capturePlayerId.toString());
    let newStarUser = attackerUsers.find((u) => newStarPlayer.userId && u._id.toString() === newStarPlayer.userId.toString());
    let newStarPlayerCarriers = attackerCarriers.filter((c) => c.ownedByPlayerId.toString() === newStarPlayer._id.toString());
    star.ownedByPlayerId = newStarPlayer._id;
    star.shipsActual = 0;
    star.ships = 0;
    let captureReward = 0;
    if (game.settings.specialGalaxy.starCaptureReward === "enabled") {
      captureReward = star.infrastructure.economy * game.constants.star.captureRewardMultiplier;
      let captureRewardMultiplier = this.specialistService.hasAwardDoubleCaptureRewardSpecialist(newStarPlayerCarriers);
      captureReward = Math.floor(captureReward * captureRewardMultiplier);
      newStarPlayer.credits += captureReward;
      star.infrastructure.economy = 0;
    }
    this.resetIgnoreBulkUpgradeStatuses(star);
    const oldStarUser = defenderUsers.find((u) => owner.userId && u._id.toString() === owner.userId.toString()) || null;
    if (!isTutorialGame) {
      if (oldStarUser && !owner.defeated) {
        oldStarUser.achievements.combat.stars.lost++;
        if (star.homeStar) {
          oldStarUser.achievements.combat.homeStars.lost++;
        }
      }
      if (newStarUser && !newStarPlayer.defeated) {
        newStarUser.achievements.combat.stars.captured++;
        if (star.homeStar) {
          newStarUser.achievements.combat.homeStars.captured++;
        }
      }
    }
    if (this.gameTypeService.isKingOfTheHillMode(game) && this.gameStateService.isCountingDownToEndInLastCycle(game) && this.isKingOfTheHillStar(star)) {
      this.gameStateService.setCountdownToEndToOneCycle(game);
    }
    return {
      capturedById: newStarPlayer._id,
      capturedByAlias: newStarPlayer.alias,
      captureReward
    };
  }
  resetIgnoreBulkUpgradeStatuses(star) {
    star.ignoreBulkUpgrade = {
      economy: false,
      industry: false,
      science: false
    };
    return star.ignoreBulkUpgrade;
  }
  listHomeStars(game) {
    return game.galaxy.stars.filter((s) => s.homeStar);
  }
  getKingOfTheHillStar(game) {
    const center = this.starDistanceService.getGalacticCenter();
    return game.galaxy.stars.find((s) => s.location.x === center.x && s.location.y === center.y);
  }
  isKingOfTheHillStar(star) {
    const center = this.starDistanceService.getGalacticCenter();
    return star.location.x === center.x && star.location.y === center.y;
  }
  setupPlayerStarForGameStart(game, star, player) {
    if (player.homeStarId.toString() === star._id.toString()) {
      this.setupHomeStar(game, star, player, game.settings);
    } else {
      star.ownedByPlayerId = player._id;
      star.shipsActual = game.settings.player.startingShips;
      star.ships = star.shipsActual;
      star.warpGate = false;
      star.specialistId = null;
      if (game.settings.player.developmentCost.economy !== "none") {
        star.infrastructure.economy = 0;
      }
      if (game.settings.player.developmentCost.industry !== "none") {
        star.infrastructure.industry = 0;
      }
      if (game.settings.player.developmentCost.science !== "none") {
        star.infrastructure.science = 0;
      }
      this.resetIgnoreBulkUpgradeStatuses(star);
    }
  }
  setupStarsForGameStart(game) {
    if (game.settings.player.developmentCost.economy !== "none" && game.settings.player.developmentCost.industry !== "none" && game.settings.player.developmentCost.science !== "none") {
      return;
    }
    const types = [
      game.settings.player.developmentCost.economy === "none" ? "economy" : null,
      game.settings.player.developmentCost.industry === "none" ? "industry" : null,
      game.settings.player.developmentCost.science === "none" ? "science" : null
    ];
    const rng = RNG.create(game._id.toString());
    for (let star of game.galaxy.stars) {
      const i = rng(types.length);
      const type = types[i];
      if (type == null) {
        continue;
      }
      star.infrastructure[type] = game.settings.player.startingInfrastructure[type];
    }
  }
  pairWormHoleConstructors(game) {
    const constructors = game.galaxy.stars.filter((s) => {
      var _a, _b;
      return s.specialistId && ((_b = (_a = this.specialistService.getByIdStar(s.specialistId)) == null ? void 0 : _a.modifiers.special) == null ? void 0 : _b.wormHoleConstructor);
    });
    let pairs = Math.floor(constructors.length / 2);
    if (pairs < 1) {
      return;
    }
    while (pairs--) {
      const starA = constructors[this.randomService.getRandomNumber(constructors.length)];
      const starB = constructors[this.randomService.getRandomNumber(constructors.length)];
      if (starA._id.toString() === starB._id.toString() || starA.wormHoleToStarId || starB.wormHoleToStarId) {
        pairs++;
        continue;
      }
      starA.wormHoleToStarId = starB._id;
      starB.wormHoleToStarId = starA._id;
      starA.specialistId = null;
      starB.specialistId = null;
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StarServiceEvents
});
//# sourceMappingURL=star.js.map
