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
var gameTick_exports = {};
__export(gameTick_exports, {
  GameTickServiceEvents: () => GameTickServiceEvents,
  default: () => GameTickService
});
module.exports = __toCommonJS(gameTick_exports);
const EventEmitter = require("events");
const moment = require("moment");
const GameTickServiceEvents = {
  onPlayerGalacticCycleCompleted: "onPlayerGalacticCycleCompleted",
  onGameCycleEnded: "onGameCycleEnded",
  onPlayerAfk: "onPlayerAfk",
  onPlayerDefeated: "onPlayerDefeated",
  onGameEnded: "onGameEnded",
  onGameTurnEnded: "onGameTurnEnded"
};
class GameTickService extends EventEmitter {
  constructor(distanceService, starService, carrierService, researchService, playerService, playerAfkService, historyService, waypointService, combatService, leaderboardService, userService, gameService, technologyService, specialistService, starUpgradeService, reputationService, aiService, battleRoyaleService, starMovementService, diplomacyService, gameTypeService, gameStateService, playerCycleRewardsService, diplomacyUpkeepService, carrierMovementService, carrierGiftService, starContestedService, playerReadyService, shipService) {
    super();
    this.distanceService = distanceService;
    this.starService = starService;
    this.carrierService = carrierService;
    this.researchService = researchService;
    this.playerService = playerService;
    this.playerAfkService = playerAfkService;
    this.historyService = historyService;
    this.waypointService = waypointService;
    this.combatService = combatService;
    this.leaderboardService = leaderboardService;
    this.userService = userService;
    this.gameService = gameService;
    this.technologyService = technologyService;
    this.specialistService = specialistService;
    this.starUpgradeService = starUpgradeService;
    this.reputationService = reputationService;
    this.aiService = aiService;
    this.battleRoyaleService = battleRoyaleService;
    this.starMovementService = starMovementService;
    this.diplomacyService = diplomacyService;
    this.gameTypeService = gameTypeService;
    this.gameStateService = gameStateService;
    this.playerCycleRewardsService = playerCycleRewardsService;
    this.diplomacyUpkeepService = diplomacyUpkeepService;
    this.carrierMovementService = carrierMovementService;
    this.carrierGiftService = carrierGiftService;
    this.starContestedService = starContestedService;
    this.playerReadyService = playerReadyService;
    this.shipService = shipService;
  }
  async tick(gameId) {
    let game = await this.gameService.getByIdAll(gameId);
    if (!this.gameStateService.isLocked(game)) {
      throw new Error(`The game is not locked.`);
    }
    let startTime = process.hrtime();
    console.log(`[${game.settings.general.name}] - Game tick started at ${new Date().toISOString()}`);
    game.state.lastTickDate = moment().utc();
    let taskTime = process.hrtime();
    let taskTimeEnd = null;
    let logTime = (taskName) => {
      taskTimeEnd = process.hrtime(taskTime);
      taskTime = process.hrtime();
      console.log(`[${game.settings.general.name}] - ${taskName}: %ds %dms'`, taskTimeEnd[0], taskTimeEnd[1] / 1e6);
    };
    let gameUsers = await this.userService.getGameUsers(game);
    logTime("Loaded game users");
    let iterations = 1;
    if (this.gameTypeService.isTurnBasedGame(game)) {
      iterations = game.settings.gameTime.turnJumps;
      this.playerService.incrementMissedTurns(game);
    }
    let hasProductionTicked = false;
    while (iterations--) {
      game.state.tick++;
      logTime(`Tick ${game.state.tick}`);
      await this._captureAbandonedStars(game, gameUsers);
      logTime("Capture abandoned stars");
      await this._transferGiftsInOrbit(game, gameUsers);
      logTime("Transfer gifts in orbit");
      await this._combatCarriers(game, gameUsers);
      logTime("Combat carriers");
      await this._moveCarriers(game, gameUsers);
      logTime("Move carriers and produce ships");
      await this._combatContestedStars(game, gameUsers);
      logTime("Combat at contested stars");
      let ticked = await this._endOfGalacticCycleCheck(game);
      logTime("Galactic cycle check");
      if (ticked && !hasProductionTicked) {
        hasProductionTicked = true;
      }
      await this._gameLoseCheck(game, gameUsers);
      logTime("Game lose check");
      await this._playAI(game);
      logTime("AI controlled players turn");
      await this.researchService.conductResearchAll(game, gameUsers);
      logTime("Conduct research");
      this._orbitGalaxy(game);
      logTime("Orbital mechanics");
      this.waypointService.cullAllWaypointsByHyperspaceRange(game);
      logTime("Sanitise all carrier waypoints");
      this._oneTickSpecialists(game);
      logTime("Apply effects of onetick specialists");
      this._clearExpiredSpecialists(game);
      logTime("Clear expired specialists");
      this._countdownToEndCheck(game);
      logTime("Countdown to end check");
      let hasWinner = await this._gameWinCheck(game, gameUsers);
      logTime("Game win check");
      await this._logHistory(game);
      logTime("Log history");
      if (hasWinner) {
        break;
      }
    }
    this.playerReadyService.resetReadyStatuses(game, hasProductionTicked);
    await game.save();
    logTime("Save game");
    for (let user of gameUsers) {
      await user.save();
    }
    logTime("Save users");
    this._emitEvents(game);
    let endTime = process.hrtime(startTime);
    console.log(`[${game.settings.general.name}] - Game tick ended: %ds %dms'`, endTime[0], endTime[1] / 1e6);
  }
  canTick(game) {
    if (game.state.locked || game.state.paused || game.state.endDate) {
      return false;
    }
    if (moment(game.state.startDate).utc().diff(moment().utc()) > 0) {
      return false;
    }
    if (this.gameService.isAllUndefeatedPlayersReadyToQuit(game)) {
      return true;
    }
    let lastTick = moment(game.state.lastTickDate).utc();
    let nextTick;
    if (this.gameTypeService.isRealTimeGame(game)) {
      nextTick = moment(lastTick).utc().add(game.settings.gameTime.speed, "seconds");
    } else if (this.gameTypeService.isTurnBasedGame(game)) {
      let isAllPlayersReady = this.gameService.isAllUndefeatedPlayersReady(game);
      if (isAllPlayersReady) {
        return true;
      }
      nextTick = moment(lastTick).utc().add(game.settings.gameTime.maxTurnWait, "minutes");
    } else {
      throw new Error(`Unsupported game type.`);
    }
    return nextTick.diff(moment().utc(), "seconds") <= 0;
  }
  async _combatCarriers(game, gameUsers) {
    if (game.settings.specialGalaxy.carrierToCarrierCombat !== "enabled") {
      return;
    }
    let isAlliancesEnabled = this.diplomacyService.isFormalAlliancesEnabled(game);
    let carrierPositions = game.galaxy.carriers.filter(
      (x) => this.carrierMovementService.isInTransit(x) || this.carrierMovementService.isLaunching(x)
    ).map((c) => {
      let waypoint = c.waypoints[0];
      let locationNext = this.carrierMovementService.getNextLocationToWaypoint(game, c);
      let sourceStar = this.starService.getById(game, waypoint.source);
      let destinationStar = this.starService.getById(game, waypoint.destination);
      let distanceToDestinationCurrent = this.distanceService.getDistanceBetweenLocations(c.location, destinationStar.location);
      let distanceToDestinationNext = this.distanceService.getDistanceBetweenLocations(locationNext.location, destinationStar.location);
      let distanceToSourceCurrent, distanceToSourceNext;
      if (sourceStar) {
        distanceToSourceCurrent = this.distanceService.getDistanceBetweenLocations(c.location, sourceStar.location);
        distanceToSourceNext = this.distanceService.getDistanceBetweenLocations(locationNext.location, sourceStar.location);
      } else {
        distanceToSourceCurrent = 0;
        distanceToSourceNext = distanceToSourceCurrent + locationNext.distance;
      }
      return {
        carrier: c,
        source: waypoint.source,
        destination: waypoint.destination,
        locationCurrent: c.location,
        locationNext: locationNext.location,
        distanceToSourceCurrent,
        distanceToDestinationCurrent,
        distanceToSourceNext,
        distanceToDestinationNext
      };
    });
    const graph = this._getCarrierPositionGraph(carrierPositions);
    for (let carrierPath in graph) {
      let positions = graph[carrierPath];
      if (positions.length <= 1) {
        continue;
      }
      for (let i = 0; i < positions.length; i++) {
        let friendlyCarrier = positions[i];
        if (friendlyCarrier.carrier.ships <= 0) {
          continue;
        }
        let collisionCarriers = positions.filter((c) => {
          return c.carrier.ships > 0 && !c.carrier.isGift && (c.destination.toString() === friendlyCarrier.source.toString() && c.distanceToSourceCurrent <= friendlyCarrier.distanceToDestinationCurrent && c.distanceToSourceNext >= friendlyCarrier.distanceToDestinationNext || c.destination.toString() === friendlyCarrier.destination.toString() && c.distanceToDestinationCurrent <= friendlyCarrier.distanceToDestinationCurrent && c.distanceToDestinationNext >= friendlyCarrier.distanceToDestinationNext);
        });
        collisionCarriers = this._filterAvoidCarrierToCarrierCombatCarriers(collisionCarriers);
        if (!collisionCarriers.length) {
          continue;
        }
        let friendlyCarriers = collisionCarriers.filter((c) => c.carrier.ships > 0 && c.carrier.ownedByPlayerId.toString() === friendlyCarrier.carrier.ownedByPlayerId.toString());
        if (friendlyCarriers.length === collisionCarriers.length) {
          continue;
        }
        let friendlyPlayer = this.playerService.getById(game, friendlyCarrier.carrier.ownedByPlayerId);
        let combatCarriers = collisionCarriers.map((c) => c.carrier).filter((c) => c.ships > 0);
        if (!combatCarriers.length) {
          continue;
        }
        if (isAlliancesEnabled) {
          const playerIds = [...new Set(combatCarriers.map((x) => x.ownedByPlayerId))];
          const isAllPlayersAllied = this.diplomacyService.isDiplomaticStatusBetweenPlayersAllied(game, playerIds);
          if (isAllPlayersAllied) {
            continue;
          }
        }
        await this.combatService.performCombat(game, gameUsers, friendlyPlayer, null, combatCarriers);
      }
    }
  }
  _getCarrierPositionGraph(carrierPositions) {
    const graph = {};
    for (let carrierPosition of carrierPositions) {
      const graphKeyA = carrierPosition.destination.toString() + carrierPosition.source.toString();
      const graphKeyB = carrierPosition.source.toString() + carrierPosition.destination.toString();
      if (graphKeyA === graphKeyB) {
        continue;
      }
      const graphObj = graph[graphKeyA] || graph[graphKeyB];
      if (graphObj) {
        graphObj.push(carrierPosition);
      } else {
        graph[graphKeyA] = [carrierPosition];
      }
    }
    return graph;
  }
  _filterAvoidCarrierToCarrierCombatCarriers(carrierPositions) {
    return carrierPositions.filter((c) => {
      let specialist = this.specialistService.getByIdCarrier(c.carrier.specialistId);
      if (specialist && specialist.modifiers && specialist.modifiers.special && specialist.modifiers.special.avoidCombatCarrierToCarrier) {
        return false;
      }
      return true;
    });
  }
  async _moveCarriers(game, gameUsers) {
    let carriersInTransit = [];
    let carriersWithWaypoints = game.galaxy.carriers.filter((c) => c.waypoints.length);
    for (let i = 0; i < carriersWithWaypoints.length; i++) {
      let carrier = carriersWithWaypoints[i];
      let waypoint = carrier.waypoints[0];
      if (waypoint.delayTicks && carrier.orbiting) {
        waypoint.delayTicks--;
        continue;
      }
      let destinationStar = game.galaxy.stars.find((s) => s._id.toString() === waypoint.destination.toString());
      carrier.distanceToDestination = this.distanceService.getDistanceBetweenLocations(carrier.location, destinationStar.location);
      carriersInTransit.push(carrier);
    }
    carriersInTransit = carriersInTransit.sort((a, b) => {
      if (a.ships > b.ships)
        return -1;
      if (a.ships < b.ships)
        return 1;
      return (a.distanceToDestination || 0) - (b.distanceToDestination || 0);
    });
    let combatStars = [];
    let actionWaypoints = [];
    for (let i = 0; i < carriersInTransit.length; i++) {
      let carrierInTransit = carriersInTransit[i];
      let carrierMovementReport = await this.carrierMovementService.moveCarrier(game, gameUsers, carrierInTransit);
      if (carrierMovementReport.arrivedAtStar) {
        actionWaypoints.push({
          carrier: carrierInTransit,
          star: carrierMovementReport.destinationStar,
          waypoint: carrierMovementReport.waypoint
        });
      }
      if (carrierMovementReport.combatRequiredStar && combatStars.indexOf(carrierMovementReport.destinationStar) < 0) {
        combatStars.push(carrierMovementReport.destinationStar);
      }
    }
    for (let i = 0; i < combatStars.length; i++) {
      let combatStar = combatStars[i];
      let carriersAtStar = game.galaxy.carriers.filter((c) => c.orbiting && c.orbiting.toString() === combatStar._id.toString());
      let starOwningPlayer = this.playerService.getById(game, combatStar.ownedByPlayerId);
      await this.combatService.performCombat(game, gameUsers, starOwningPlayer, combatStar, carriersAtStar);
    }
    actionWaypoints = actionWaypoints.filter((x) => x.carrier.orbiting && x.carrier.ships > 0);
    this.waypointService.performWaypointActionsDrops(game, actionWaypoints);
    this.starService.applyStarSpecialistSpecialModifiers(game);
    this.shipService.produceShips(game);
    this.waypointService.performWaypointActionsCollects(game, actionWaypoints);
    this.waypointService.performWaypointActionsGarrisons(game, actionWaypoints);
    this._sanitiseDarkModeCarrierWaypoints(game);
  }
  async _combatContestedStars(game, gameUsers) {
    if (!this.diplomacyService.isFormalAlliancesEnabled(game)) {
      return;
    }
    let contestedStars = this.starContestedService.listContestedStars(game);
    for (let i = 0; i < contestedStars.length; i++) {
      let contestedStar = contestedStars[i];
      let starOwningPlayer = this.playerService.getById(game, contestedStar.star.ownedByPlayerId);
      await this.combatService.performCombat(game, gameUsers, starOwningPlayer, contestedStar.star, contestedStar.carriersInOrbit);
    }
  }
  async _captureAbandonedStars(game, gameUsers) {
    if (!this.diplomacyService.isFormalAlliancesEnabled(game)) {
      return;
    }
    let contestedAbandonedStars = this.starContestedService.listContestedUnownedStars(game);
    for (let i = 0; i < contestedAbandonedStars.length; i++) {
      let contestedStar = contestedAbandonedStars[i];
      let carrier = contestedStar.carriersInOrbit.sort((a, b) => b.ships - a.ships)[0];
      this.starService.claimUnownedStar(game, gameUsers, contestedStar.star, carrier);
    }
  }
  _sanitiseDarkModeCarrierWaypoints(game) {
    if (this.gameTypeService.isDarkMode(game)) {
      this.waypointService.sanitiseAllCarrierWaypointsByScanningRange(game);
    }
  }
  async _endOfGalacticCycleCheck(game) {
    let hasProductionTicked = game.state.tick % game.settings.galaxy.productionTicks === 0;
    if (hasProductionTicked) {
      game.state.productionTick++;
      for (let i = 0; i < game.galaxy.players.length; i++) {
        let player = game.galaxy.players[i];
        let creditsResult = this.playerCycleRewardsService.givePlayerCreditsEndOfCycleRewards(game, player);
        let experimentResult = this.researchService.conductExperiments(game, player);
        let carrierUpkeepResult = this.playerService.deductCarrierUpkeepCost(game, player);
        let allianceUpkeepResult = null;
        if (this.diplomacyUpkeepService.isAllianceUpkeepEnabled(game)) {
          let allianceCount = this.diplomacyService.getAlliesOfPlayer(game, player).length;
          allianceUpkeepResult = this.diplomacyUpkeepService.deductTotalUpkeep(game, player, creditsResult.creditsTotal, allianceCount);
        }
        if (!player.defeated) {
          let e = {
            gameId: game._id,
            gameTick: game.state.tick,
            playerId: player._id,
            creditsEconomy: creditsResult.creditsFromEconomy,
            creditsBanking: creditsResult.creditsFromBanking,
            creditsSpecialists: creditsResult.creditsFromSpecialistsTechnology,
            experimentTechnology: experimentResult.technology,
            experimentTechnologyLevel: experimentResult.level,
            experimentAmount: experimentResult.amount,
            experimentLevelUp: experimentResult.levelUp,
            experimentResearchingNext: experimentResult.researchingNext,
            carrierUpkeep: carrierUpkeepResult,
            allianceUpkeep: allianceUpkeepResult
          };
          this.emit(GameTickServiceEvents.onPlayerGalacticCycleCompleted, e);
        }
      }
      if (game.settings.general.mode === "battleRoyale") {
        this.battleRoyaleService.performBattleRoyaleTick(game);
      }
      this.emit(GameTickServiceEvents.onGameCycleEnded, {
        gameId: game._id
      });
    }
    return hasProductionTicked;
  }
  async _logHistory(game) {
    await this.historyService.log(game);
  }
  async _gameLoseCheck(game, gameUsers) {
    let isTutorialGame = this.gameTypeService.isTutorialGame(game);
    let isTurnBasedGame = this.gameTypeService.isTurnBasedGame(game);
    let undefeatedPlayers = game.galaxy.players.filter((p) => !p.defeated);
    for (let i = 0; i < undefeatedPlayers.length; i++) {
      let player = undefeatedPlayers[i];
      this.playerAfkService.performDefeatedOrAfkCheck(game, player);
      if (player.defeated) {
        game.state.players--;
        let user = gameUsers.find((u) => player.userId && u._id.toString() === player.userId.toString());
        if (player.afk) {
          if (player.userId) {
            game.afkers.push(player.userId);
          }
          if (user && !isTutorialGame) {
            user.achievements.afk++;
          }
          let e = {
            gameId: game._id,
            gameTick: game.state.tick,
            playerId: player._id,
            playerAlias: player.alias
          };
          this.emit(GameTickServiceEvents.onPlayerAfk, e);
        } else {
          if (user && !isTutorialGame) {
            user.achievements.defeated++;
            if (this.gameTypeService.is1v1Game(game)) {
              user.achievements.defeated1v1++;
            }
          }
          let e = {
            gameId: game._id,
            gameTick: game.state.tick,
            playerId: player._id,
            playerAlias: player.alias,
            openSlot: false
          };
          this.emit(GameTickServiceEvents.onPlayerDefeated, e);
        }
      }
    }
    this.gameStateService.updateStatePlayerCount(game);
  }
  async _gameWinCheck(game, gameUsers) {
    const isTutorialGame = this.gameTypeService.isTutorialGame(game);
    let leaderboard = this.leaderboardService.getGameLeaderboard(game).leaderboard;
    game.state.leaderboard = leaderboard.map((l) => l.player._id);
    let winner = this.leaderboardService.getGameWinner(game, leaderboard);
    if (winner) {
      this.gameStateService.finishGame(game, winner);
      for (const player of game.galaxy.players) {
        if (this.playerAfkService.isAIControlled(game, player, true)) {
          this.aiService.cleanupState(player);
        }
      }
      if (!isTutorialGame) {
        let rankingResult = null;
        if (this.gameTypeService.isRankedGame(game)) {
          rankingResult = this._awardEndGameRank(game, gameUsers, true);
        }
        this.leaderboardService.markNonAFKPlayersAsEstablishedPlayers(game, gameUsers);
        this.leaderboardService.incrementPlayersCompletedAchievement(game, gameUsers);
        let e = {
          gameId: game._id,
          gameTick: game.state.tick,
          rankingResult
        };
        this.emit(GameTickServiceEvents.onGameEnded, e);
      }
      return true;
    }
    return false;
  }
  _awardEndGameRank(game, gameUsers, awardCredits) {
    let rankingResult = null;
    let productionTickCap = this.gameTypeService.is1v1Game(game) ? 1 : 2;
    let canAwardRank = this.gameTypeService.isRankedGame(game) && game.state.productionTick > productionTickCap;
    if (canAwardRank) {
      let leaderboard = this.leaderboardService.getGameLeaderboard(game).leaderboard;
      rankingResult = this.leaderboardService.addGameRankings(game, gameUsers, leaderboard);
      this.leaderboardService.incrementGameWinnerAchievements(game, gameUsers, leaderboard[0].player, awardCredits);
    }
    if (this.gameTypeService.isAnonymousGame(game)) {
      rankingResult = null;
    }
    return rankingResult;
  }
  async _playAI(game) {
    for (let player of game.galaxy.players.filter((p) => this.playerAfkService.isAIControlled(game, p, true))) {
      await this.aiService.play(game, player);
    }
  }
  _oneTickSpecialists(game) {
    this.playerCycleRewardsService.giveFinancialAnalystCredits(game);
    this.starMovementService.moveStellarEngines(game);
    this.starService.pairWormHoleConstructors(game);
  }
  _clearExpiredSpecialists(game) {
    this.specialistService.clearExpiredSpecialists(game);
  }
  _orbitGalaxy(game) {
    if (this.gameTypeService.isOrbitalMode(game)) {
      this.starMovementService.orbitGalaxy(game);
    }
  }
  _countdownToEndCheck(game) {
    if (this.gameStateService.isCountingDownToEnd(game) || this.gameTypeService.isKingOfTheHillMode(game) && this.playerService.getKingOfTheHillPlayer(game)) {
      this.gameStateService.countdownToEnd(game);
    }
  }
  _transferGiftsInOrbit(game, gameUsers) {
    const carriers = this.carrierService.listGiftCarriersInOrbit(game);
    for (let carrier of carriers) {
      const star = this.starService.getById(game, carrier.orbiting);
      this.carrierGiftService.transferGift(game, gameUsers, star, carrier);
    }
  }
  _emitEvents(game) {
    if (this.gameTypeService.isTurnBasedGame(game)) {
      this.emit(GameTickServiceEvents.onGameTurnEnded, {
        gameId: game._id
      });
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GameTickServiceEvents
});
//# sourceMappingURL=gameTick.js.map
