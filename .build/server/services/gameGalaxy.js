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
var gameGalaxy_exports = {};
__export(gameGalaxy_exports, {
  default: () => GameGalaxyService
});
module.exports = __toCommonJS(gameGalaxy_exports);
var import_validation = __toESM(require("../errors/validation"));
class GameGalaxyService {
  constructor(cacheService, broadcastService, gameService, mapService, playerService, playerAfkService, starService, shipService, distanceService, starDistanceService, starUpgradeService, carrierService, waypointService, researchService, specialistService, technologyService, reputationService, guildUserService, historyService, battleRoyaleService, starMovementService, gameTypeService, gameStateService, diplomacyService, avatarService, playerStatisticsService, gameFluxService, spectatorService) {
    this.cacheService = cacheService;
    this.broadcastService = broadcastService;
    this.gameService = gameService;
    this.mapService = mapService;
    this.playerService = playerService;
    this.playerAfkService = playerAfkService;
    this.starService = starService;
    this.shipService = shipService;
    this.distanceService = distanceService;
    this.starDistanceService = starDistanceService;
    this.starUpgradeService = starUpgradeService;
    this.carrierService = carrierService;
    this.waypointService = waypointService;
    this.researchService = researchService;
    this.specialistService = specialistService;
    this.technologyService = technologyService;
    this.reputationService = reputationService;
    this.guildUserService = guildUserService;
    this.historyService = historyService;
    this.battleRoyaleService = battleRoyaleService;
    this.starMovementService = starMovementService;
    this.gameTypeService = gameTypeService;
    this.gameStateService = gameStateService;
    this.diplomacyService = diplomacyService;
    this.avatarService = avatarService;
    this.playerStatisticsService = playerStatisticsService;
    this.gameFluxService = gameFluxService;
    this.spectatorService = spectatorService;
  }
  async getGalaxy(gameId, userId, tick) {
    let gameStateTick = await this.gameService.getGameStateTick(gameId);
    if (gameStateTick == null) {
      throw new import_validation.default("Game not found.", 404);
    }
    let isHistorical = tick != null && tick !== gameStateTick;
    let cached;
    if (!isHistorical) {
      tick = gameStateTick;
    } else {
      cached = this._getCachedGalaxy(gameId, userId, tick, gameStateTick);
      if (cached && cached.galaxy) {
        return cached.galaxy;
      }
    }
    let game = await this.gameService.getByIdGalaxyLean(gameId);
    if (!game) {
      throw new import_validation.default(`Game not found`, 404);
    }
    if (isHistorical && game.settings.general.timeMachine === "disabled") {
      throw new import_validation.default(`The time machine is disabled in this game.`);
    }
    let userPlayer = this._getUserPlayer(game, userId);
    delete game.settings.general.createdByUserId;
    delete game.settings.general.password;
    await this._maskGalaxy(game, userPlayer, isHistorical, tick);
    this._setPlayerStats(game);
    if (this.gameTypeService.isBattleRoyaleMode(game) && !this.gameStateService.isFinished(game)) {
      this._appendStarsPendingDestructionFlag(game);
    }
    const perspectives = this._getPlayerPerspectives(game, userId);
    if (!perspectives && !this.gameStateService.isFinished(game)) {
      this._setStarInfoBasic(game);
      this._clearPlayerCarriers(game);
    } else {
      this._setCarrierInfoDetailed(game, perspectives);
      this._setStarInfoDetailed(game, userPlayer, perspectives);
    }
    await this._setPlayerInfoBasic(game, userPlayer, perspectives);
    if (this.gameTypeService.isDarkModeExtra(game)) {
      this._setPlayerStats(game);
    }
    if (this.gameTypeService.isDarkMode(game)) {
      delete game.constants.distances.galaxyCenterLocation;
    }
    game.settings.general.flux = this.gameFluxService.getFluxById(game.settings.general.fluxId);
    if (isHistorical && cached) {
      this.cacheService.put(cached.cacheKey, game, 12e5);
    }
    return game;
  }
  _getCachedGalaxy(gameId, userId, requestedTick, currentTick) {
    if (requestedTick && currentTick - requestedTick > 24) {
      return {
        cacheKey: null,
        galaxy: null
      };
    }
    if (!userId) {
      return null;
    }
    let cacheKey = `galaxy_${gameId}_${userId}_${requestedTick}`;
    let galaxy = null;
    let cached = this.cacheService.get(cacheKey);
    if (cached) {
      galaxy = cached;
    }
    return {
      cacheKey,
      galaxy
    };
  }
  _getUserPlayer(doc, userId) {
    if (!userId) {
      return null;
    }
    return doc.galaxy.players.find((x) => x.userId && x.userId.toString() === userId.toString()) || null;
  }
  _setPlayerStats(doc) {
    const isKingOfTheHillMode = this.gameTypeService.isKingOfTheHillMode(doc);
    let kingOfTheHillPlayer = null;
    if (isKingOfTheHillMode) {
      kingOfTheHillPlayer = this.playerService.getKingOfTheHillPlayer(doc);
    }
    doc.galaxy.players.forEach((p) => {
      p.stats = this.playerStatisticsService.getStats(doc, p);
      if (isKingOfTheHillMode) {
        p.isKingOfTheHill = kingOfTheHillPlayer != null && kingOfTheHillPlayer._id.toString() === p._id.toString();
      }
    });
  }
  _setStarInfoBasic(doc) {
    const isDarkStart = this.gameTypeService.isDarkStart(doc);
    const isDarkMode = this.gameTypeService.isDarkMode(doc);
    const isDarkFogged = this.gameTypeService.isDarkFogged(doc);
    const isKingOfTheHillMode = this.gameTypeService.isKingOfTheHillMode(doc);
    let kingOfTheHillStar = null;
    if (isKingOfTheHillMode) {
      kingOfTheHillStar = this.starService.getKingOfTheHillStar(doc);
    }
    if (isDarkMode || isDarkFogged || isDarkStart && !doc.state.startDate) {
      doc.galaxy.stars = [];
    }
    doc.galaxy.stars = doc.galaxy.stars.map((s) => {
      let star = {
        _id: s._id,
        name: s.name,
        ownedByPlayerId: s.ownedByPlayerId,
        location: s.location,
        warpGate: false,
        isNebula: false,
        isAsteroidField: false,
        isBinaryStar: false,
        isBlackHole: false,
        isPulsar: false,
        wormHoleToStarId: null
      };
      star.effectiveTechs = this.technologyService.getStarEffectiveTechnologyLevels(doc, star);
      if (isKingOfTheHillMode) {
        star.isKingOfTheHillStar = kingOfTheHillStar != null && kingOfTheHillStar._id.toString() === s._id.toString();
      }
      return star;
    });
  }
  _setStarInfoDetailed(doc, userPlayer, perspectivePlayerIds) {
    const isFinished = this.gameStateService.isFinished(doc);
    const isDarkStart = this.gameTypeService.isDarkStart(doc);
    const isDarkMode = this.gameTypeService.isDarkMode(doc);
    const isDarkFogged = this.gameTypeService.isDarkFogged(doc);
    const isOrbital = this.gameTypeService.isOrbitalMode(doc);
    const isKingOfTheHillMode = this.gameTypeService.isKingOfTheHillMode(doc);
    let kingOfTheHillStar = null;
    if (isKingOfTheHillMode) {
      kingOfTheHillStar = this.starService.getKingOfTheHillStar(doc);
    }
    if (!isFinished && (isDarkMode || isDarkStart && !doc.state.startDate)) {
      if (isDarkMode) {
        doc.galaxy.stars = this.starService.filterStarsByScanningRangeAndWaypointDestinations(doc, perspectivePlayerIds);
      } else {
        doc.galaxy.stars = this.starService.filterStarsByScanningRange(doc, perspectivePlayerIds);
      }
    }
    let playerStars = [];
    let playerScanningStars = [];
    let playerCarriersInOrbit = [];
    if (perspectivePlayerIds == null ? void 0 : perspectivePlayerIds.length) {
      playerStars = this.starService.listStarsOwnedByPlayers(doc.galaxy.stars, perspectivePlayerIds);
      playerScanningStars = this.starService.listStarsWithScanningRangeByPlayers(doc, perspectivePlayerIds);
      playerCarriersInOrbit = this.carrierService.listCarriersOwnedByPlayersInOrbit(doc.galaxy.carriers, perspectivePlayerIds);
    }
    doc.galaxy.stars = doc.galaxy.stars.map((s) => {
      delete s.shipsActual;
      s.effectiveTechs = this.technologyService.getStarEffectiveTechnologyLevels(doc, s);
      if (s.ownedByPlayerId) {
        s.terraformedResources = this.starService.calculateTerraformedResources(s, s.effectiveTechs.terraforming);
      }
      s.naturalResources = this.starService.calculateActualNaturalResources(s);
      s.manufacturing = this.shipService.calculateStarManufacturing(doc, s);
      if (isOrbital) {
        s.locationNext = this.starMovementService.getNextLocation(doc, s);
      }
      if (this.starService.isDeadStar(s)) {
        delete s.infrastructure;
      }
      if (isKingOfTheHillMode) {
        s.isKingOfTheHillStar = kingOfTheHillStar != null && kingOfTheHillStar._id.toString() === s._id.toString();
      }
      let isOwnedByCurrentPlayer = playerStars.find((y) => y._id.toString() === s._id.toString());
      if (isOwnedByCurrentPlayer) {
        this.starUpgradeService.setUpgradeCosts(doc, s, s.terraformedResources);
        if (s.specialistId) {
          s.specialist = this.specialistService.getByIdStar(s.specialistId);
        }
        if (userPlayer) {
          s.ignoreBulkUpgrade = s.ignoreBulkUpgrade || null || this.starService.resetIgnoreBulkUpgradeStatuses(s);
        } else {
          delete s.ignoreBulkUpgrade;
        }
        s.isInScanningRange = true;
        return s;
      } else {
        delete s.ignoreBulkUpgrade;
      }
      s.isInScanningRange = isFinished || this.starService.isStarWithinScanningRangeOfStars(doc, s, playerScanningStars) || playerCarriersInOrbit.find((c) => c.orbiting.toString() === s._id.toString()) != null;
      if (s.isInScanningRange) {
        if (s.specialistId) {
          s.specialist = this.specialistService.getByIdStar(s.specialistId);
        }
        if (isFinished) {
          return s;
        }
        if (s.isNebula) {
          delete s.infrastructure;
          delete s.naturalResources;
          delete s.terraformedResources;
          delete s.manufacturing;
        }
        let canSeeStarShips = (perspectivePlayerIds == null ? void 0 : perspectivePlayerIds.length) && this.starService.canPlayersSeeStarShips(s, perspectivePlayerIds);
        if (!canSeeStarShips) {
          s.ships = null;
        }
        return s;
      } else {
        const mappedStar = {
          _id: s._id,
          name: s.name,
          ownedByPlayerId: s.ownedByPlayerId,
          location: s.location,
          locationNext: s.locationNext,
          warpGate: false,
          isNebula: false,
          isAsteroidField: false,
          isBinaryStar: false,
          isBlackHole: false,
          isPulsar: s.isPulsar,
          wormHoleToStarId: s.wormHoleToStarId,
          isKingOfTheHillStar: s.isKingOfTheHillStar,
          isInScanningRange: s.isInScanningRange,
          effectiveTechs: null
        };
        mappedStar.effectiveTechs = this.technologyService.getStarEffectiveTechnologyLevels(doc, mappedStar);
        if (isDarkFogged && !s.isInScanningRange) {
          mappedStar.ownedByPlayerId = null;
        }
        return mappedStar;
      }
      ;
    });
  }
  _setCarrierInfoDetailed(doc, perspectivePlayerIds) {
    const isFinished = this.gameStateService.isFinished(doc);
    const isOrbital = this.gameTypeService.isOrbitalMode(doc);
    if (!this.gameStateService.isFinished(doc)) {
      doc.galaxy.carriers = this.carrierService.filterCarriersByScanningRange(doc, perspectivePlayerIds);
      doc.galaxy.carriers = this.carrierService.sanitizeCarriersByPlayers(doc, perspectivePlayerIds);
    }
    doc.galaxy.carriers.forEach((c) => {
      c.effectiveTechs = this.technologyService.getCarrierEffectiveTechnologyLevels(doc, c);
      this.waypointService.populateCarrierWaypointEta(doc, c);
      if (c.specialistId) {
        c.specialist = this.specialistService.getByIdCarrier(c.specialistId);
      }
      let canSeeCarrierShips = isFinished || (perspectivePlayerIds == null ? void 0 : perspectivePlayerIds.length) && this.carrierService.canPlayersSeeCarrierShips(doc, perspectivePlayerIds, c);
      if (!canSeeCarrierShips) {
        c.ships = null;
      }
      if (isOrbital) {
        c.locationNext = this.starMovementService.getNextLocation(doc, c);
      }
    });
  }
  async _setPlayerInfoBasic(doc, userPlayer, perspectivePlayerIds) {
    const avatars = this.avatarService.listAllAvatars();
    const isFinished = this.gameStateService.isFinished(doc);
    const isDarkModeExtra = this.gameTypeService.isDarkModeExtra(doc);
    let onlinePlayers = this.broadcastService.getOnlinePlayers(doc);
    let guildUsers = [];
    if (!this.gameTypeService.isAnonymousGame(doc)) {
      let userIds = doc.galaxy.players.filter((x) => x.userId).map((x) => x.userId);
      guildUsers = await this.guildUserService.listUsersWithGuildTags(userIds);
    }
    let playersInRange = [];
    if (userPlayer) {
      playersInRange = this.playerService.getPlayersWithinScanningRangeOfPlayer(doc, doc.galaxy.players, userPlayer);
    }
    let displayOnlineStatus = doc.settings.general.playerOnlineStatus === "visible";
    this._populatePlayerHasDuplicateIPs(doc);
    doc.galaxy.players = doc.galaxy.players.map((p) => {
      var _a;
      let isCurrentUserPlayer = userPlayer && p._id.toString() === userPlayer._id.toString();
      p.hasPerspective = (perspectivePlayerIds == null ? void 0 : perspectivePlayerIds.find((i) => i.toString() === p._id.toString())) != null;
      let playerGuild = null;
      if (p.userId) {
        let guildUser = guildUsers.find((u) => p.userId && u._id.toString() === p.userId.toString());
        if (guildUser && guildUser.displayGuildTag === "visible") {
          playerGuild = guildUser.guild;
          if (playerGuild) {
            p.alias += `[${playerGuild.tag}]`;
          }
        }
      }
      p.isAIControlled = this.playerAfkService.isAIControlled(doc, p, !isCurrentUserPlayer);
      p.isInScanningRange = playersInRange.find((x) => x._id.toString() === p._id.toString()) != null;
      p.shape = p.shape || "circle";
      p.avatar = p.avatar ? avatars.find((a) => a.id.toString() === p.avatar.toString()).file : null;
      if (isCurrentUserPlayer) {
        userPlayer.currentResearchTicksEta = this.researchService.calculateCurrentResearchETAInTicks(doc, userPlayer);
        userPlayer.nextResearchTicksEta = this.researchService.calculateNextResearchETAInTicks(doc, userPlayer);
        delete p.notes;
        delete p.lastSeenIP;
        p.isRealUser = true;
        return p;
      }
      if (!displayOnlineStatus) {
        p.lastSeen = null;
        p.isOnline = null;
      } else {
        p.isOnline = isCurrentUserPlayer || onlinePlayers.find((op) => op._id.toString() === p._id.toString()) != null;
      }
      let reputation = null;
      if (userPlayer) {
        reputation = (_a = this.reputationService.getReputation(p, userPlayer)) == null ? void 0 : _a.reputation;
      }
      let research = {
        scanning: {
          level: p.research.scanning.level
        },
        hyperspace: {
          level: p.research.hyperspace.level
        },
        terraforming: {
          level: p.research.terraforming.level
        },
        experimentation: {
          level: p.research.experimentation.level
        },
        weapons: {
          level: p.research.weapons.level
        },
        banking: {
          level: p.research.banking.level
        },
        manufacturing: {
          level: p.research.manufacturing.level
        },
        specialists: {
          level: p.research.specialists.level
        }
      };
      if (!isFinished && isDarkModeExtra && !p.isInScanningRange) {
        research = null;
      }
      let diplomacy = [];
      if (userPlayer) {
        diplomacy = this.diplomacyService.getFilteredDiplomacy(p, userPlayer);
      }
      return {
        _id: p._id,
        isRealUser: p.userId != null,
        isAIControlled: p.isAIControlled,
        homeStarId: p.homeStarId,
        colour: p.colour,
        shape: p.shape,
        research,
        isOpenSlot: p.isOpenSlot,
        isInScanningRange: p.isInScanningRange,
        defeated: p.defeated,
        defeatedDate: p.defeatedDate,
        afk: p.afk,
        ready: p.ready,
        readyToQuit: p.readyToQuit,
        missedTurns: p.missedTurns,
        alias: p.alias,
        avatar: p.avatar,
        stats: p.stats,
        reputation,
        lastSeen: p.lastSeen,
        isOnline: p.isOnline,
        guild: playerGuild,
        hasDuplicateIP: p.hasDuplicateIP,
        hasFilledAfkSlot: p.hasFilledAfkSlot,
        isKingOfTheHill: p.isKingOfTheHill,
        hasPerspective: p.hasPerspective,
        diplomacy
      };
    });
  }
  _getPlayerPerspectives(game, userId) {
    let userPlayer = this._getUserPlayer(game, userId);
    if (userPlayer) {
      return [userPlayer._id];
    }
    if (userId && this.spectatorService.isSpectatingEnabled(game)) {
      let spectating = this.spectatorService.listSpectatingPlayers(game, userId);
      if (spectating.length) {
        return spectating.map((p) => p._id);
      }
    }
    return null;
  }
  _populatePlayerHasDuplicateIPs(game) {
    for (let player of game.galaxy.players) {
      player.hasDuplicateIP = this.playerService.hasDuplicateLastSeenIP(game, player);
    }
  }
  _hasGameStarted(doc) {
    return doc.state.startDate != null;
  }
  _clearPlayerCarriers(doc) {
    doc.galaxy.carriers = [];
  }
  async _maskGalaxy(game, userPlayer, isHistorical, tick) {
    if (!this.gameStateService.isStarted(game) || tick === 0) {
      return;
    }
    let history = await this.historyService.getHistoryByTick(game._id, tick);
    if (!history) {
      return;
    }
    if (!history.players.length || !history.stars.length || !history.carriers.length) {
      return;
    }
    if (isHistorical) {
      for (let i = 0; i < game.galaxy.players.length; i++) {
        let gamePlayer = game.galaxy.players[i];
        let historyPlayer = history.players.find((x) => x.playerId.toString() === gamePlayer._id.toString());
        if (historyPlayer) {
          gamePlayer.userId = historyPlayer.userId;
          gamePlayer.alias = historyPlayer.alias;
          gamePlayer.avatar = historyPlayer.avatar;
          gamePlayer.researchingNow = historyPlayer.researchingNow;
          gamePlayer.researchingNext = historyPlayer.researchingNext;
          gamePlayer.credits = historyPlayer.credits;
          gamePlayer.creditsSpecialists = historyPlayer.creditsSpecialists;
          gamePlayer.isOpenSlot = historyPlayer.isOpenSlot;
          gamePlayer.defeated = historyPlayer.defeated;
          gamePlayer.defeatedDate = historyPlayer.defeatedDate;
          gamePlayer.afk = historyPlayer.afk;
          gamePlayer.research = historyPlayer.research;
          gamePlayer.ready = historyPlayer.ready;
          gamePlayer.readyToQuit = historyPlayer.readyToQuit;
        }
      }
    }
    for (let i = 0; i < game.galaxy.stars.length; i++) {
      let gameStar = game.galaxy.stars[i];
      if (!isHistorical && userPlayer && gameStar.ownedByPlayerId && gameStar.ownedByPlayerId.toString() === userPlayer._id.toString()) {
        continue;
      }
      let historyStar = history.stars.find((x) => x.starId.toString() === gameStar._id.toString());
      if (historyStar) {
        if (!isHistorical && userPlayer && historyStar.ownedByPlayerId && gameStar.ownedByPlayerId == null && historyStar.ownedByPlayerId.toString() === userPlayer._id.toString()) {
          continue;
        }
        gameStar.ownedByPlayerId = historyStar.ownedByPlayerId;
        gameStar.naturalResources = historyStar.naturalResources;
        gameStar.ships = historyStar.ships;
        gameStar.shipsActual = historyStar.shipsActual;
        gameStar.specialistId = historyStar.specialistId;
        gameStar.homeStar = historyStar.homeStar;
        gameStar.warpGate = historyStar.warpGate;
        gameStar.ignoreBulkUpgrade = historyStar.ignoreBulkUpgrade;
        gameStar.infrastructure = historyStar.infrastructure;
        gameStar.location = historyStar.location == null || (historyStar.location.x == null || historyStar.location.y == null) ? gameStar.location : historyStar.location;
      }
    }
    for (let i = 0; i < game.galaxy.carriers.length; i++) {
      let gameCarrier = game.galaxy.carriers[i];
      if (!isHistorical && userPlayer && gameCarrier.ownedByPlayerId.toString() === userPlayer._id.toString()) {
        continue;
      }
      let historyCarrier = history.carriers.find((x) => x.carrierId.toString() === gameCarrier._id.toString());
      if (!historyCarrier) {
        game.galaxy.carriers.splice(i, 1);
        i--;
        continue;
      }
      gameCarrier.ownedByPlayerId = historyCarrier.ownedByPlayerId;
      gameCarrier.name = historyCarrier.name;
      gameCarrier.orbiting = historyCarrier.orbiting;
      gameCarrier.ships = historyCarrier.ships;
      gameCarrier.specialistId = historyCarrier.specialistId;
      gameCarrier.isGift = historyCarrier.isGift;
      gameCarrier.location = historyCarrier.location;
      gameCarrier.waypoints = historyCarrier.waypoints;
    }
    if (isHistorical) {
      for (let historyCarrier of history.carriers) {
        let gameCarrier = game.galaxy.carriers.find((x) => x._id.toString() === historyCarrier.carrierId.toString());
        if (!gameCarrier) {
          game.galaxy.carriers.push(historyCarrier);
        }
      }
    }
    if (!isHistorical) {
      const carrierInOrbitToAdd = history.carriers.filter((c) => c.orbiting && (!userPlayer || c.ownedByPlayerId.toString() !== userPlayer._id.toString()));
      for (let historyCarrier of carrierInOrbitToAdd) {
        let gameCarrier = game.galaxy.carriers.find((x) => x._id.toString() === historyCarrier.carrierId.toString());
        if (!gameCarrier) {
          game.galaxy.carriers.push(historyCarrier);
        }
      }
    }
    if (isHistorical) {
      game.state.tick = history.tick;
      game.state.productionTick = history.productionTick;
    }
  }
  _appendStarsPendingDestructionFlag(game) {
    let pendingStars = this.battleRoyaleService.getStarsToDestroy(game);
    for (let pendingStar of pendingStars) {
      pendingStar.targeted = true;
    }
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=gameGalaxy.js.map
