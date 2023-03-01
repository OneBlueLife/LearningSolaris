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
var ai_exports = {};
__export(ai_exports, {
  default: () => AIService
});
module.exports = __toCommonJS(ai_exports);
var import_utils = require("./utils");
const Heap = require("qheap");
const mongoose = require("mongoose");
const FIRST_TICK_BULK_UPGRADE_SCI_PERCENTAGE = 20;
const FIRST_TICK_BULK_UPGRADE_IND_PERCENTAGE = 30;
const LAST_TICK_BULK_UPGRADE_ECO_PERCENTAGE = 100;
const EMPTY_STAR_SCORE_MULTIPLIER = 1;
const ENEMY_STAR_SCORE_MULTIPLIER = 5;
const REINFORCEMENT_MIN_CYCLES = 1.5;
const REINFORCEMENT_MIN_FACTOR = 1.4;
const INVASION_ATTACK_FACTOR = 1.5;
var AiAction = /* @__PURE__ */ ((AiAction2) => {
  AiAction2[AiAction2["DefendStar"] = 0] = "DefendStar";
  AiAction2[AiAction2["ClaimStar"] = 1] = "ClaimStar";
  AiAction2[AiAction2["ReinforceStar"] = 2] = "ReinforceStar";
  AiAction2[AiAction2["InvadeStar"] = 3] = "InvadeStar";
  return AiAction2;
})(AiAction || {});
;
;
;
;
;
;
;
;
class AIService {
  constructor(starUpgradeService, carrierService, starService, distanceService, waypointService, combatService, shipTransferService, technologyService, playerService, playerAfkService, reputationService, diplomacyService, playerStatisticsService, shipService) {
    this.starUpgradeService = starUpgradeService;
    this.carrierService = carrierService;
    this.starService = starService;
    this.distanceService = distanceService;
    this.waypointService = waypointService;
    this.combatService = combatService;
    this.shipTransferService = shipTransferService;
    this.technologyService = technologyService;
    this.playerService = playerService;
    this.playerAfkService = playerAfkService;
    this.reputationService = reputationService;
    this.diplomacyService = diplomacyService;
    this.playerStatisticsService = playerStatisticsService;
    this.shipService = shipService;
  }
  async play(game, player) {
    if (!this.playerAfkService.isAIControlled(game, player, true)) {
      throw new Error("The player is not under AI control.");
    }
    const isFirstTickOfCycle = game.state.tick % game.settings.galaxy.productionTicks === 1;
    const isLastTickOfCycle = game.state.tick % game.settings.galaxy.productionTicks === game.settings.galaxy.productionTicks - 1;
    try {
      if (game.settings.general.advancedAI === "enabled") {
        await this._doAdvancedLogic(game, player, isFirstTickOfCycle, isLastTickOfCycle);
      }
      await this._doBasicLogic(game, player, isFirstTickOfCycle, isLastTickOfCycle);
    } catch (e) {
      console.error(e);
    }
  }
  async _doBasicLogic(game, player, isFirstTickOfCycle, isLastTickOfCycle) {
    if (isFirstTickOfCycle) {
      await this._playFirstTick(game, player);
    } else if (isLastTickOfCycle) {
      await this._playLastTick(game, player);
    }
    player.credits = Math.max(0, player.credits);
  }
  async _doAdvancedLogic(game, player, isFirstTickOfCycle, isLastTickOfCycle) {
    const context = this._createContext(game, player);
    if (context == null) {
      this._clearState(player);
      return;
    }
    if (!player.aiState) {
      this._setInitialState(game, player);
    }
    this._sanitizeState(game, player, context);
    const orders = this._gatherOrders(game, player, context);
    const assignments = await this._gatherAssignments(game, player, context);
    await this._evaluateOrders(game, player, context, orders, assignments);
    player.markModified("aiState");
  }
  _setInitialState(game, player) {
    player.aiState = {
      knownAttacks: [],
      startedClaims: [],
      invasionsInProgress: []
    };
  }
  _sanitizeState(game, player, context) {
    if (!player.aiState) {
      return;
    }
    if (player.aiState.knownAttacks) {
      player.aiState.knownAttacks = player.aiState.knownAttacks.filter((attack) => attack.arrivalTick > game.state.tick);
    }
    if (player.aiState.invasionsInProgress) {
      player.aiState.invasionsInProgress = player.aiState.invasionsInProgress.filter((invasion) => invasion.arrivalTick > game.state.tick);
    }
  }
  _clearState(player) {
    if (player.aiState) {
      player.aiState = null;
      player.markModified("aiState");
    }
  }
  _createContext(game, player) {
    const playerStars = this.starService.listStarsOwnedByPlayer(game.galaxy.stars, player._id);
    if (!playerStars.length) {
      return null;
    }
    const playerId = player._id.toString();
    const starsById = /* @__PURE__ */ new Map();
    for (const star of game.galaxy.stars) {
      starsById.set(star._id.toString(), star);
    }
    const traversableStars = game.galaxy.stars.filter((star) => !star.ownedByPlayerId || star.ownedByPlayerId.toString() === playerId);
    const allReachableFromPlayerStars = this._computeStarGraph(starsById, game, player, playerStars, game.galaxy.stars, this._getHyperspaceRangeExternal(game, player));
    const allCanReachPlayerStars = this._computeStarGraph(starsById, game, player, game.galaxy.stars, playerStars, this._getHyperspaceRangeExternal(game, player));
    const freelyReachableFromPlayerStars = this._computeStarGraph(starsById, game, player, playerStars, traversableStars, this._getHyperspaceRangeExternal(game, player));
    const reachablePlayerStars = this._computeStarGraph(starsById, game, player, playerStars, playerStars, this._getHyperspaceRangeInternal(game, player));
    const freelyReachableStars = this._computeStarGraph(starsById, game, player, traversableStars, traversableStars, this._getHyperspaceRangeExternal(game, player));
    const starsInGlobalRange = this._computeStarGraph(starsById, game, player, playerStars, game.galaxy.stars, this._getGlobalHighestHyperspaceRange(game));
    const borderStars = /* @__PURE__ */ new Set();
    for (const [from, reachables] of starsInGlobalRange) {
      for (const reachableId of reachables) {
        const reachable = starsById.get(reachableId);
        if (!reachable.ownedByPlayerId || reachable.ownedByPlayerId.toString() !== playerId) {
          borderStars.add(from);
        }
      }
    }
    const playerCarriers = this.carrierService.listCarriersOwnedByPlayer(game.galaxy.carriers, player._id);
    const carriersOrbiting = /* @__PURE__ */ new Map();
    for (const carrier of game.galaxy.carriers) {
      if ((!carrier.waypoints || carrier.waypoints.length === 0) && carrier.orbiting) {
        const carriersInOrbit = (0, import_utils.getOrInsert)(carriersOrbiting, carrier.orbiting.toString(), () => []);
        carriersInOrbit.push(carrier);
      }
    }
    const carriersById = /* @__PURE__ */ new Map();
    for (const carrier of game.galaxy.carriers) {
      carriersById.set(carrier._id.toString(), carrier);
    }
    const incomingCarriers = game.galaxy.carriers.filter((carrier) => this._isEnemyPlayer(game, player, carrier.ownedByPlayerId) && carrier.orbiting == null).map((carrier) => {
      const waypoint = carrier.waypoints[0];
      const destinationId = waypoint.destination;
      const destinationStar = starsById.get(destinationId.toString());
      if (destinationStar.ownedByPlayerId && destinationStar.ownedByPlayerId.toString() === playerId) {
        return {
          carrier,
          waypoint
        };
      }
      return null;
    }).filter(import_utils.notNull);
    const attacksByStarId = /* @__PURE__ */ new Map();
    const attackedStarIds = /* @__PURE__ */ new Set();
    for (const { carrier: incomingCarrier, waypoint: incomingWaypoint } of incomingCarriers) {
      const targetStar = incomingWaypoint.destination.toString();
      const attacks = (0, import_utils.getOrInsert)(attacksByStarId, targetStar, () => /* @__PURE__ */ new Map());
      attackedStarIds.add(targetStar);
      const attackInTicks = this.waypointService.calculateWaypointTicksEta(game, incomingCarrier, incomingWaypoint);
      const simultaneousAttacks = (0, import_utils.getOrInsert)(attacks, attackInTicks, () => []);
      simultaneousAttacks.push(incomingCarrier);
    }
    const transitFromCarriers = /* @__PURE__ */ new Map();
    const arrivingAtCarriers = /* @__PURE__ */ new Map();
    for (const carrier of playerCarriers) {
      if (carrier.waypoints.length !== 0) {
        const fromId = carrier.waypoints[0].source.toString();
        const fromCarriers = (0, import_utils.getOrInsert)(transitFromCarriers, fromId, () => []);
        fromCarriers.push(carrier);
        if (carrier.waypoints.length === 1) {
          const toId = carrier.waypoints[0].destination.toString();
          const toCarriers = (0, import_utils.getOrInsert)(arrivingAtCarriers, toId, () => []);
          toCarriers.push(carrier);
        }
      }
    }
    return {
      playerStars,
      playerCarriers,
      starsById,
      allReachableFromPlayerStars,
      freelyReachableFromPlayerStars,
      allCanReachPlayerStars,
      freelyReachableStars,
      reachablePlayerStars,
      starsInGlobalRange,
      borderStars,
      carriersOrbiting,
      carriersById,
      attacksByStarId,
      attackedStarIds,
      playerEconomy: this.playerStatisticsService.calculateTotalEconomy(playerStars),
      playerIndustry: this.playerStatisticsService.calculateTotalIndustry(playerStars),
      playerScience: this.playerStatisticsService.calculateTotalScience(playerStars),
      transitFromCarriers,
      arrivingAtCarriers
    };
  }
  async _evaluateOrders(game, player, context, orders, assignments) {
    const sorter = (o1, o2) => {
      const categoryPriority = this.priorityFromOrderCategory(o1.type) - this.priorityFromOrderCategory(o2.type);
      if (categoryPriority !== 0) {
        return categoryPriority;
      } else {
        return o1.score - o2.score;
      }
    };
    orders.sort((0, import_utils.reverseSort)(sorter));
    for (const order of orders) {
      if (order.type === 0 /* DefendStar */) {
        assignments.delete(order.star);
      }
    }
    const newKnownAttacks = [];
    const newClaimedStars = new Set(player.aiState.startedClaims);
    for (const order of orders) {
      if (order.type === 0 /* DefendStar */) {
        const attackData = this._getAttackData(game, player, order.star, order.ticksUntil) || this._createDefaultAttackData(game, order.star, order.ticksUntil);
        const defendingStar = context.starsById.get(order.star);
        const requiredAdditionallyForDefense = this._calculateRequiredShipsForDefense(game, player, context, attackData, order.incomingCarriers, defendingStar);
        newKnownAttacks.push(attackData);
        const allPossibleAssignments = this._findAssignmentsWithTickLimit(game, player, context, context.reachablePlayerStars, assignments, order.star, order.ticksUntil, this._canAffordCarrier(context, game, player, true));
        let shipsNeeded = requiredAdditionallyForDefense;
        for (const { assignment, trace } of allPossibleAssignments) {
          if (shipsNeeded <= 0 || assignment.totalShips === 1) {
            break;
          }
          if ((!assignment.carriers || assignment.carriers.length === 0) && !this._canAffordCarrier(context, game, player, true)) {
            continue;
          }
          let shipsUsed;
          if (shipsNeeded <= assignment.totalShips) {
            shipsUsed = shipsNeeded;
            shipsNeeded = 0;
          } else {
            shipsUsed = assignment.totalShips;
            shipsNeeded -= assignment.totalShips;
          }
          const timeLeftUntilSchedule = order.ticksUntil - this._calculateTraceDuration(context, game, trace);
          if (timeLeftUntilSchedule > 0) {
            assignments.delete(assignment.star._id.toString());
          } else {
            await this._useAssignment(context, game, player, assignments, assignment, this._createWaypointsDropAndReturn(trace), shipsUsed, (carrier) => attackData.carriersOnTheWay.push(carrier._id.toString()));
          }
        }
      } else if (order.type === 3 /* InvadeStar */) {
        if (player.aiState && player.aiState.invasionsInProgress && player.aiState.invasionsInProgress.find((iv) => order.star === iv.star)) {
          continue;
        }
        const starToInvade = context.starsById.get(order.star);
        const ticksLimit = game.settings.galaxy.productionTicks * 2;
        const fittingAssignments = this._findAssignmentsWithTickLimit(game, player, context, context.allCanReachPlayerStars, assignments, order.star, ticksLimit, this._canAffordCarrier(context, game, player, false), false);
        if (!fittingAssignments || !fittingAssignments.length) {
          continue;
        }
        for (const { assignment, trace } of fittingAssignments) {
          const ticksUntilArrival = this._calculateTraceDuration(context, game, trace);
          const requiredShips = Math.floor(this._calculateRequiredShipsForAttack(game, player, context, starToInvade, ticksUntilArrival) * INVASION_ATTACK_FACTOR);
          if (assignment.totalShips >= requiredShips) {
            const carrierResult = await this._useAssignment(context, game, player, assignments, assignment, this._createWaypointsFromTrace(trace), requiredShips);
            player.aiState.invasionsInProgress.push({
              star: order.star,
              arrivalTick: game.state.tick + carrierResult.ticksEtaTotal
            });
            break;
          }
        }
      } else if (order.type === 1 /* ClaimStar */) {
        if (newClaimedStars.has(order.star)) {
          continue;
        }
        const ticksLimit = game.settings.galaxy.productionTicks * 2;
        const fittingAssignments = this._findAssignmentsWithTickLimit(game, player, context, context.freelyReachableStars, assignments, order.star, ticksLimit, this._canAffordCarrier(context, game, player, false), true);
        const found = fittingAssignments && fittingAssignments[0];
        if (!found) {
          continue;
        }
        const waypoints = this._createWaypointsFromTrace(found.trace);
        await this._useAssignment(context, game, player, assignments, found.assignment, waypoints, found.assignment.totalShips);
        for (const visitedStar of found.trace) {
          newClaimedStars.add(visitedStar.starId);
        }
      } else if (order.type === 2 /* ReinforceStar */) {
        const assignment = assignments.get(order.source);
        if (!assignment || assignment.totalShips <= 1) {
          continue;
        }
        const hasIdleCarrier = assignment.carriers && assignment.carriers.length > 0;
        const reinforce = async () => {
          const waypoints = [
            {
              _id: new mongoose.Types.ObjectId(),
              source: new mongoose.Types.ObjectId(order.source),
              destination: new mongoose.Types.ObjectId(order.star),
              action: "dropAll",
              actionShips: 0,
              delayTicks: 0
            },
            {
              _id: new mongoose.Types.ObjectId(),
              source: new mongoose.Types.ObjectId(order.star),
              destination: new mongoose.Types.ObjectId(order.source),
              action: "nothing",
              actionShips: 0,
              delayTicks: 0
            }
          ];
          await this._useAssignment(context, game, player, assignments, assignment, waypoints, assignment.totalShips);
        };
        if (hasIdleCarrier) {
          await reinforce();
        } else if (this._canAffordCarrier(context, game, player, false)) {
          const routeCarrier = this._logisticRouteExists(context, order.source, order.star);
          if (!routeCarrier) {
            const nextReturning = this._nextArrivingCarrierIn(context, game, order.source);
            if (!nextReturning) {
              await reinforce();
            }
          }
        }
      }
    }
    player.aiState.knownAttacks = newKnownAttacks;
    const claimsInProgress = [];
    for (const claim of newClaimedStars) {
      const star = context.starsById.get(claim);
      if (!star.ownedByPlayerId) {
        claimsInProgress.push(claim);
      }
    }
    player.aiState.startedClaims = claimsInProgress;
  }
  _nextArrivingCarrierIn(context, game, starId) {
    const carriers = context.arrivingAtCarriers.get(starId);
    return carriers && (0, import_utils.minBy)((c) => this.waypointService.calculateWaypointTicks(game, c, c.waypoints[0]), carriers);
  }
  async _useAssignment(context, game, player, assignments, assignment, waypoints, ships, onCarrierUsed = null) {
    let shipsToTransfer = ships;
    const starId = assignment.star._id;
    let carrier = assignment.carriers && assignment.carriers[0];
    if (carrier) {
      assignment.carriers.shift();
    } else {
      const buildResult = await this.starUpgradeService.buildCarrier(game, player, starId, 1, false);
      carrier = this.carrierService.getById(game, buildResult.carrier._id);
      shipsToTransfer -= 1;
      assignment.totalShips -= 1;
    }
    if (shipsToTransfer > 0) {
      const remaining = Math.max(assignment.star.ships - shipsToTransfer, 0);
      await this.shipTransferService.transfer(game, player, carrier._id, shipsToTransfer + 1, starId, remaining, false);
      assignment.totalShips = assignment.star.ships;
    }
    const carrierResult = await this.waypointService.saveWaypointsForCarrier(game, player, carrier, waypoints, false, false);
    const carrierRemaining = assignment.carriers && assignment.carriers.length > 0;
    if (!carrierRemaining && assignment.totalShips === 0) {
      assignments.delete(starId.toString());
    }
    if (onCarrierUsed) {
      onCarrierUsed(carrier);
    }
    return carrierResult;
  }
  _createWaypointsDropAndReturn(trace) {
    const newTrace = trace.slice(0, trace.length - 1);
    newTrace.push({
      starId: trace[trace.length - 1].starId,
      action: "dropAll"
    });
    const backTrace = trace.slice(0, trace.length - 1).reverse();
    return this._createWaypointsFromTrace(newTrace.concat(backTrace));
  }
  _createWaypointsFromTrace(trace) {
    const waypoints = [];
    let last = trace[0].starId;
    for (let i = 1; i < trace.length; i++) {
      const id = trace[i].starId;
      waypoints.push({
        _id: new mongoose.Types.ObjectId(),
        source: new mongoose.Types.ObjectId(last),
        destination: new mongoose.Types.ObjectId(id),
        action: trace[i].action || "nothing",
        actionShips: 0,
        delayTicks: 0
      });
      last = id;
    }
    return waypoints;
  }
  _logisticRouteExists(context, fromStarId, toStarId) {
    const movingFrom = context.transitFromCarriers.get(fromStarId) ?? [];
    const hasCarrierOutbound = movingFrom.find((c) => c.waypoints[0].destination.toString() === toStarId);
    if (hasCarrierOutbound) {
      return hasCarrierOutbound;
    }
    const movingTo = context.arrivingAtCarriers.get(fromStarId) ?? [];
    return movingTo.find((c) => c.waypoints[0].source.toString() === toStarId);
  }
  _canAffordCarrier(context, game, player, highPriority) {
    const leaveOver = highPriority ? 0 : context.playerEconomy * 5;
    const availableFunds = player.credits - leaveOver;
    const carrierExpenseConfig = game.constants.star.infrastructureExpenseMultipliers[game.settings.specialGalaxy.carrierCost];
    return availableFunds >= this.starUpgradeService.calculateCarrierCost(game, carrierExpenseConfig);
  }
  _searchAssignments(context, starGraph, assignments, nextFilter, onAssignment, startStarId) {
    const queue = new Heap({
      comparBefore: (b1, b2) => b1.totalDistance > b2.totalDistance,
      compar: (b1, b2) => b2.totalDistance - b1.totalDistance
    });
    const init = {
      trace: [{ starId: startStarId }],
      starId: startStarId,
      totalDistance: 0
    };
    queue.push(init);
    const visited = /* @__PURE__ */ new Set();
    while (queue.length > 0) {
      const { starId, trace, totalDistance } = queue.shift();
      visited.add(starId);
      const currentStarAssignment = assignments.get(starId);
      if (currentStarAssignment) {
        if (!onAssignment(currentStarAssignment, trace)) {
          return;
        }
      }
      const nextCandidates = starGraph.get(starId);
      if (nextCandidates) {
        const star = context.starsById.get(starId);
        const fittingCandidates = Array.from(nextCandidates).filter((candidate) => nextFilter(trace, candidate));
        for (const fittingCandidate of fittingCandidates) {
          if (!visited.has(fittingCandidate)) {
            visited.add(fittingCandidate);
            const distToNext = this._calculateTravelDistance(star, context.starsById.get(fittingCandidate));
            const newTotalDist = totalDistance + distToNext;
            queue.push({
              starId: fittingCandidate,
              trace: [{ starId: fittingCandidate }].concat(trace),
              totalDistance: newTotalDist
            });
          }
        }
      }
    }
  }
  _filterAssignmentByCarrierPurchase(assignment, allowCarrierPurchase) {
    const hasCarriers = assignment.carriers && assignment.carriers.length > 0;
    return allowCarrierPurchase || hasCarriers;
  }
  _calculateTravelDistance(star1, star2) {
    if (this.starService.isStarPairWormHole(star1, star2)) {
      return 0;
    } else {
      return this.distanceService.getDistanceBetweenLocations(star1.location, star2.location);
    }
  }
  _calculateTraceDistance(context, game, trace) {
    if (trace.length < 2) {
      return 0;
    }
    let last = trace[0];
    let distance = 0;
    for (let i = 1; i < trace.length; i++) {
      const lastStar = context.starsById.get(last.starId);
      const thisStar = context.starsById.get(trace[i].starId);
      distance += this._calculateTravelDistance(lastStar, thisStar);
      last = trace[i];
    }
    return distance;
  }
  _calculateTraceDuration(context, game, trace) {
    const distancePerTick = game.settings.specialGalaxy.carrierSpeed;
    const entireDistance = this._calculateTraceDistance(context, game, trace);
    return Math.ceil(entireDistance / distancePerTick);
  }
  _findAssignmentsWithTickLimit(game, player, context, starGraph, assignments, destinationId, ticksLimit, allowCarrierPurchase, onlyOne = false, filterNext = null) {
    const nextFilter = (trace, nextStarId) => {
      const entireTrace = trace.concat([{ starId: nextStarId }]);
      const ticksRequired = this._calculateTraceDuration(context, game, entireTrace);
      const withinLimit = ticksRequired <= ticksLimit;
      if (filterNext) {
        return withinLimit && filterNext(trace, nextStarId);
      }
      return withinLimit;
    };
    const fittingAssignments = [];
    const onAssignment = (assignment, trace) => {
      if (this._filterAssignmentByCarrierPurchase(assignment, allowCarrierPurchase)) {
        fittingAssignments.push({
          assignment,
          trace
        });
      }
      return !onlyOne;
    };
    this._searchAssignments(context, starGraph, assignments, nextFilter, onAssignment, destinationId);
    return fittingAssignments;
  }
  _createDefaultAttackData(game, starId, ticksUntil) {
    const arrivalTick = game.state.tick + ticksUntil;
    return {
      starId,
      arrivalTick,
      carriersOnTheWay: []
    };
  }
  _calculateRequiredShipsForAttack(game, player, context, starToInvade, ticksToArrival) {
    const invadedPlayer = starToInvade.ownedByPlayerId;
    const starId = starToInvade._id.toString();
    const defendingPlayer = this.playerService.getById(game, invadedPlayer);
    const defendingCarriers = context.carriersOrbiting.get(starId) || [];
    const techLevel = this.technologyService.getStarEffectiveTechnologyLevels(game, starToInvade, false);
    const shipsOnCarriers = defendingCarriers.reduce((sum, c) => sum + (c.ships || 0), 0);
    const shipsProduced = this.shipService.calculateStarShipsByTicks(techLevel.manufacturing, starToInvade.infrastructure.industry || 0, ticksToArrival, game.settings.galaxy.productionTicks);
    const shipsAtArrival = (starToInvade.shipsActual || 0) + shipsOnCarriers + shipsProduced;
    const defender = {
      ships: Math.ceil(shipsAtArrival),
      weaponsLevel: this.technologyService.getStarEffectiveWeaponsLevel(game, [defendingPlayer], starToInvade, defendingCarriers)
    };
    const attacker = {
      ships: 0,
      weaponsLevel: player.research.weapons.level
    };
    const result = this.combatService.calculate(defender, attacker, true, true);
    return result.needed.attacker;
  }
  _calculateRequiredShipsForDefense(game, player, context, attackData, attackingCarriers, defendingStar) {
    const attackerIds = /* @__PURE__ */ new Set();
    const attackers = [];
    for (const attackingCarrier of attackingCarriers) {
      const attacker = this.playerService.getById(game, attackingCarrier.ownedByPlayerId);
      const attackerId = attacker._id.toString();
      if (!attackerIds.has(attackerId)) {
        attackerIds.add(attackerId);
        attackers.push(attacker);
      }
    }
    const defenseCarriersAtStar = context.carriersOrbiting.get(defendingStar._id.toString()) || [];
    let defenseCarriersOnTheWay = [];
    if (attackData) {
      defenseCarriersOnTheWay = attackData.carriersOnTheWay.map((carrierId) => context.carriersById.get(carrierId.toString()));
    }
    const defenseCarriers = defenseCarriersAtStar.concat(defenseCarriersOnTheWay);
    const result = this.combatService.calculateStar(game, defendingStar, [player], attackers, defenseCarriers, attackingCarriers, true);
    if (result.after.defender <= 0) {
      return result.needed.defender - result.before.defender;
    }
    return 0;
  }
  priorityFromOrderCategory(category) {
    switch (category) {
      case 0 /* DefendStar */:
        return 4;
      case 3 /* InvadeStar */:
        return 3;
      case 1 /* ClaimStar */:
        return 2;
      case 2 /* ReinforceStar */:
        return 1;
      default:
        return 0;
    }
  }
  async _gatherAssignments(game, player, context) {
    const assignments = /* @__PURE__ */ new Map();
    for (const playerStar of context.playerStars) {
      const carriersHere = context.carriersOrbiting.get(playerStar._id.toString()) || [];
      const carriersOwned = carriersHere.filter((c) => c.ownedByPlayerId.toString() === player._id.toString());
      for (const carrier of carriersOwned) {
        if (carrier.ships > 1) {
          const newStarShips = playerStar.ships + carrier.ships - 1;
          await this.shipTransferService.transfer(game, player, carrier._id, 1, playerStar._id, newStarShips, false);
        }
      }
      if (playerStar.ships < 1 && carriersOwned.length === 0) {
        continue;
      }
      assignments.set(playerStar._id.toString(), {
        carriers: carriersOwned,
        star: playerStar,
        totalShips: playerStar.ships
      });
    }
    return assignments;
  }
  _gatherOrders(game, player, context) {
    const defenseOrders = this._gatherDefenseOrders(game, player, context);
    const invasionOrders = this._gatherInvasionOrders(game, player, context);
    const expansionOrders = this._gatherExpansionOrders(game, player, context);
    const movementOrders = this._gatherMovementOrders(game, player, context);
    return defenseOrders.concat(invasionOrders, expansionOrders, movementOrders);
  }
  _isEnemyPlayer(game, player, otherPlayerId) {
    return player._id !== otherPlayerId && this.diplomacyService.getDiplomaticStatusToPlayer(game, player._id, otherPlayerId).actualStatus !== "allies";
  }
  _isEnemyStar(game, player, context, star) {
    if (star.ownedByPlayerId) {
      return this._isEnemyPlayer(game, player, star.ownedByPlayerId);
    }
    return false;
  }
  _getStarScore(star) {
    return (star.infrastructure.economy || 0) + 2 * (star.infrastructure.industry || 0) + 3 * (star.infrastructure.science || 0);
  }
  _gatherInvasionOrders(game, player, context) {
    const orders = [];
    const visited = /* @__PURE__ */ new Set();
    for (const [fromId, reachables] of context.allReachableFromPlayerStars) {
      for (const reachable of reachables) {
        if (!visited.has(reachable)) {
          visited.add(reachable);
          const star = context.starsById.get(reachable);
          if (this._isEnemyStar(game, player, context, star)) {
            const score = this._getStarScore(star);
            orders.push({
              type: 3 /* InvadeStar */,
              star: reachable,
              score
            });
          }
        }
      }
    }
    return orders;
  }
  _claimInProgress(player, starId) {
    return Boolean(player.aiState.startedClaims && player.aiState.startedClaims.find((claim) => claim === starId));
  }
  _gatherExpansionOrders(game, player, context) {
    const orders = [];
    const used = /* @__PURE__ */ new Set();
    for (const [fromId, reachables] of context.freelyReachableFromPlayerStars) {
      const claimCandidates = Array.from(reachables).map((starId) => context.starsById.get(starId)).filter((star) => !star.ownedByPlayerId);
      for (const candidate of claimCandidates) {
        const candidateId = candidate._id.toString();
        if (!this._claimInProgress(player, candidateId) && !used.has(candidateId)) {
          used.add(candidateId);
          let score = 1;
          if (candidate.naturalResources) {
            score = candidate.naturalResources.economy + candidate.naturalResources.industry + candidate.naturalResources.science;
          }
          orders.push({
            type: 1 /* ClaimStar */,
            star: candidateId,
            score
          });
        }
      }
    }
    return orders;
  }
  _getAttackData(game, player, attackedStarId, attackInTicks) {
    const attackAbsoluteTick = game.state.tick + attackInTicks;
    return player.aiState.knownAttacks.find((attack) => attack.starId === attackedStarId.toString() && attack.arrivalTick === attackAbsoluteTick);
  }
  _gatherDefenseOrders(game, player, context) {
    const orders = [];
    for (const [attackedStarId, attacks] of context.attacksByStarId) {
      for (const [attackInTicks, incomingCarriers] of attacks) {
        const attackedStar = context.starsById.get(attackedStarId);
        const starScore = this._getStarScore(attackedStar);
        orders.push({
          type: 0 /* DefendStar */,
          score: starScore,
          star: attackedStarId,
          ticksUntil: attackInTicks,
          incomingCarriers
        });
      }
    }
    return orders;
  }
  _isUnderAttack(context, starId) {
    return context.attackedStarIds.has(starId);
  }
  _gatherMovementOrders(game, player, context) {
    const orders = [];
    const starPriorities = this._computeStarPriorities(game, player, context);
    for (const [starId, priority] of starPriorities) {
      const neighbors = context.reachablePlayerStars.get(starId);
      for (const neighbor of neighbors) {
        if (this._isUnderAttack(context, neighbor)) {
          continue;
        }
        const neighborPriority = starPriorities.get(neighbor);
        if (neighborPriority * REINFORCEMENT_MIN_FACTOR < priority) {
          orders.push({
            type: 2 /* ReinforceStar */,
            score: priority - neighborPriority,
            star: starId,
            source: neighbor
          });
        }
      }
    }
    return orders;
  }
  _computeStarPriorities(game, player, context) {
    const hyperspaceRange = this._getGlobalHighestHyperspaceRange(game);
    const borderStarPriorities = /* @__PURE__ */ new Map();
    for (const borderStarId of context.borderStars) {
      const borderStar = context.starsById.get(borderStarId);
      const reachables = context.starsInGlobalRange.get(borderStarId);
      let score = 0;
      for (const reachableId of reachables) {
        const reachableStar = context.starsById.get(reachableId);
        if (!reachableStar.ownedByPlayerId) {
          const distance = this.distanceService.getDistanceBetweenLocations(borderStar.location, reachableStar.location);
          const distanceScore = distance / hyperspaceRange * EMPTY_STAR_SCORE_MULTIPLIER;
          score += distanceScore;
        } else if (reachableStar.ownedByPlayerId.toString() !== player._id.toString()) {
          const distance = this.distanceService.getDistanceBetweenLocations(borderStar.location, reachableStar.location);
          const distanceScore = distance / hyperspaceRange * ENEMY_STAR_SCORE_MULTIPLIER;
          score += distanceScore;
        }
      }
      borderStarPriorities.set(borderStarId, score);
    }
    const visited = /* @__PURE__ */ new Set();
    const starPriorities = new Map(borderStarPriorities);
    while (true) {
      let changed = false;
      for (const [starId, priority] of starPriorities) {
        if (!visited.has(starId)) {
          visited.add(starId);
          const reachables = context.reachablePlayerStars.get(starId);
          for (const reachableId of reachables) {
            const oldPriority = starPriorities.get(reachableId) || 0;
            const transitivePriority = priority * 0.5;
            const newPriority = Math.max(oldPriority, transitivePriority);
            starPriorities.set(reachableId, newPriority);
            changed = true;
          }
        }
      }
      if (!changed) {
        break;
      }
    }
    return starPriorities;
  }
  _getGlobalHighestHyperspaceRange(game) {
    const highestLevel = (0, import_utils.maxBy)((p) => p.research.hyperspace.level, game.galaxy.players);
    return this.distanceService.getHyperspaceDistance(game, highestLevel);
  }
  _getHyperspaceRangeExternal(game, player) {
    const scanningRange = this.distanceService.getScanningDistance(game, player.research.scanning.level);
    const hyperspaceRange = this.distanceService.getHyperspaceDistance(game, player.research.hyperspace.level);
    return Math.min(scanningRange, hyperspaceRange);
  }
  _getHyperspaceRangeInternal(game, player) {
    return this.distanceService.getHyperspaceDistance(game, player.research.hyperspace.level);
  }
  _computeStarGraph(starsById, game, player, traverseStars, reachStars, hyperspaceRange) {
    const starGraph = /* @__PURE__ */ new Map();
    traverseStars.forEach((star) => {
      const reachableFromPlayerStars = /* @__PURE__ */ new Set();
      reachStars.forEach((otherStar) => {
        if (star._id !== otherStar._id && this._calculateTravelDistance(star, otherStar) <= hyperspaceRange) {
          reachableFromPlayerStars.add(otherStar._id.toString());
        }
      });
      starGraph.set(star._id.toString(), reachableFromPlayerStars);
    });
    return starGraph;
  }
  async _playFirstTick(game, player) {
    if (!player.credits || player.credits < 0) {
      return;
    }
    let creditsToSpendSci = Math.floor(player.credits / 100 * FIRST_TICK_BULK_UPGRADE_SCI_PERCENTAGE);
    let creditsToSpendInd = Math.floor(player.credits / 100 * FIRST_TICK_BULK_UPGRADE_IND_PERCENTAGE);
    if (creditsToSpendSci) {
      await this.starUpgradeService.upgradeBulk(game, player, "totalCredits", "science", creditsToSpendSci, false);
    }
    if (creditsToSpendInd) {
      await this.starUpgradeService.upgradeBulk(game, player, "totalCredits", "industry", creditsToSpendInd, false);
    }
  }
  async _playLastTick(game, player) {
    if (!player.credits || player.credits <= 0) {
      return;
    }
    let creditsToSpendEco = Math.floor(player.credits / 100 * LAST_TICK_BULK_UPGRADE_ECO_PERCENTAGE);
    if (creditsToSpendEco) {
      await this.starUpgradeService.upgradeBulk(game, player, "totalCredits", "economy", creditsToSpendEco, false);
    }
  }
  getStarName(context, starId) {
    return context.starsById.get(starId).name;
  }
  cleanupState(player) {
    player.aiState = null;
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=ai.js.map
