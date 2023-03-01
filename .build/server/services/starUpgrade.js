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
var starUpgrade_exports = {};
__export(starUpgrade_exports, {
  StarUpgradeServiceEvents: () => StarUpgradeServiceEvents,
  default: () => StarUpgradeService
});
module.exports = __toCommonJS(starUpgrade_exports);
var import_validation = __toESM(require("../errors/validation"));
const EventEmitter = require("events");
const Heap = require("qheap");
const StarUpgradeServiceEvents = {
  onPlayerInfrastructureBulkUpgraded: "onPlayerInfrastructureBulkUpgraded"
};
class StarUpgradeService extends EventEmitter {
  constructor(gameRepo, starService, carrierService, achievementService, researchService, technologyService, playerCreditsService, gameTypeService, shipService) {
    super();
    this.gameRepo = gameRepo;
    this.starService = starService;
    this.carrierService = carrierService;
    this.achievementService = achievementService;
    this.researchService = researchService;
    this.technologyService = technologyService;
    this.playerCreditsService = playerCreditsService;
    this.gameTypeService = gameTypeService;
    this.shipService = shipService;
  }
  async buildWarpGate(game, player, starId) {
    let star = this.starService.getById(game, starId);
    if (star.ownedByPlayerId == null || star.ownedByPlayerId.toString() !== player._id.toString()) {
      throw new import_validation.default(`Cannot upgrade, the star is not owned by the current player.`);
    }
    if (star.warpGate) {
      throw new import_validation.default(`The star already has a warp gate.`);
    }
    if (game.settings.specialGalaxy.warpgateCost === "none") {
      throw new import_validation.default("The game settings has disabled the building of warp gates.");
    }
    if (this.starService.isDeadStar(star)) {
      throw new import_validation.default("Cannot build a warp gate on a dead star.");
    }
    let effectiveTechs = this.technologyService.getStarEffectiveTechnologyLevels(game, star);
    const expenseConfig = game.constants.star.infrastructureExpenseMultipliers[game.settings.specialGalaxy.warpgateCost];
    const terraformedResources = this.starService.calculateTerraformedResources(star, effectiveTechs.terraforming);
    const averageTerraformedResources = this.calculateAverageTerraformedResources(terraformedResources);
    const cost = this.calculateWarpGateCost(game, expenseConfig, averageTerraformedResources);
    if (player.credits < cost) {
      throw new import_validation.default(`The player does not own enough credits to afford to upgrade.`);
    }
    star.warpGate = true;
    player.credits -= cost;
    await this.gameRepo.bulkWrite([
      await this._getDeductPlayerCreditsDBWrite(game, player, cost),
      this._getSetStarWarpGateDBWrite(game, star, true)
    ]);
    if (player.userId && !player.defeated && !this.gameTypeService.isTutorialGame(game)) {
      await this.achievementService.incrementWarpGatesBuilt(player.userId);
    }
    return {
      starId: star._id,
      cost
    };
  }
  async destroyWarpGate(game, player, starId) {
    let star = this.starService.getById(game, starId);
    if (star.ownedByPlayerId == null || star.ownedByPlayerId.toString() !== player._id.toString()) {
      throw new import_validation.default(`Cannot destroy warp gate, the star is not owned by the current player.`);
    }
    if (!star.warpGate) {
      throw new import_validation.default(`The star does not have a warp gate to destroy.`);
    }
    await this.gameRepo.bulkWrite([
      this._getSetStarWarpGateDBWrite(game, star, false)
    ]);
    if (player.userId && !player.defeated && !this.gameTypeService.isTutorialGame(game)) {
      await this.achievementService.incrementWarpGatesDestroyed(player.userId);
    }
  }
  async buildCarrier(game, player, starId, ships, writeToDB = true) {
    ships = ships || 1;
    if (ships < 1) {
      throw new import_validation.default(`Carrier must have 1 or more ships.`);
    }
    let star = this.starService.getById(game, starId);
    if (star.ownedByPlayerId == null || star.ownedByPlayerId.toString() !== player._id.toString()) {
      throw new import_validation.default(`Cannot build carrier, the star is not owned by the current player.`);
    }
    if (this.starService.isDeadStar(star)) {
      throw new import_validation.default("Cannot build a carrier on a dead star.");
    }
    const expenseConfig = game.constants.star.infrastructureExpenseMultipliers[game.settings.specialGalaxy.carrierCost];
    const cost = this.calculateCarrierCost(game, expenseConfig);
    if (player.credits < cost) {
      throw new import_validation.default(`The player does not own enough credits to afford to build a carrier.`);
    }
    if (Math.floor(star.shipsActual) < ships) {
      throw new import_validation.default(`The star does not have enough ships garrisoned (${ships}) to build the carrier.`);
    }
    let carrier = this.carrierService.createAtStar(star, game.galaxy.carriers, ships);
    game.galaxy.carriers.push(carrier);
    player.credits -= cost;
    if (writeToDB) {
      await this.gameRepo.bulkWrite([
        await this._getDeductPlayerCreditsDBWrite(game, player, cost),
        {
          updateOne: {
            filter: {
              _id: game._id,
              "galaxy.stars._id": star._id
            },
            update: {
              "galaxy.stars.$.shipsActual": star.shipsActual,
              "galaxy.stars.$.ships": star.ships
            }
          }
        },
        {
          updateOne: {
            filter: {
              _id: game._id
            },
            update: {
              $push: {
                "galaxy.carriers": carrier
              }
            }
          }
        }
      ]);
    }
    if (player.userId && !player.defeated && !this.gameTypeService.isTutorialGame(game)) {
      await this.achievementService.incrementCarriersBuilt(player.userId);
    }
    carrier.effectiveTechs = this.technologyService.getCarrierEffectiveTechnologyLevels(game, carrier, true);
    return {
      carrier,
      starShips: star.ships || 0
    };
  }
  _calculateUpgradeInfrastructureCost(game, star, expenseConfigKey, economyType, calculateCostCallback) {
    if (this.starService.isDeadStar(star)) {
      return null;
    }
    let effectiveTechs = this.technologyService.getStarEffectiveTechnologyLevels(game, star);
    const expenseConfig = game.constants.star.infrastructureExpenseMultipliers[expenseConfigKey];
    const terraformedResources = this.starService.calculateTerraformedResource(star.naturalResources[economyType], effectiveTechs.terraforming);
    const cost = calculateCostCallback(game, expenseConfig, star.infrastructure[economyType], terraformedResources);
    return cost;
  }
  async _upgradeInfrastructureUpdateDB(game, player, star, cost, economyType) {
    let dbWrites = [
      await this._getDeductPlayerCreditsDBWrite(game, player, cost)
    ];
    switch (economyType) {
      case "economy":
        dbWrites.push({
          updateOne: {
            filter: {
              _id: game._id,
              "galaxy.stars._id": star._id
            },
            update: {
              $inc: {
                "galaxy.stars.$.infrastructure.economy": 1
              }
            }
          }
        });
        break;
      case "industry":
        dbWrites.push({
          updateOne: {
            filter: {
              _id: game._id,
              "galaxy.stars._id": star._id
            },
            update: {
              $inc: {
                "galaxy.stars.$.infrastructure.industry": 1
              }
            }
          }
        });
        break;
      case "science":
        dbWrites.push({
          updateOne: {
            filter: {
              _id: game._id,
              "galaxy.stars._id": star._id
            },
            update: {
              $inc: {
                "galaxy.stars.$.infrastructure.science": 1
              }
            }
          }
        });
        break;
    }
    await this.gameRepo.bulkWrite(dbWrites);
    if (player.userId && !player.defeated && !this.gameTypeService.isTutorialGame(game)) {
      await this.achievementService.incrementInfrastructureBuilt(economyType, player.userId);
    }
  }
  async _upgradeInfrastructure(game, player, starId, expenseConfigKey, economyType, calculateCostCallback, writeToDB = true) {
    if (expenseConfigKey === "none") {
      throw new import_validation.default(`Cannot upgrade ${economyType} as it has been disabled.`);
    }
    let star = this.starService.getById(game, starId);
    if (star.ownedByPlayerId == null || star.ownedByPlayerId.toString() !== player._id.toString()) {
      throw new import_validation.default(`Cannot upgrade ${economyType}, the star is not owned by the current player.`);
    }
    if (this.starService.isDeadStar(star)) {
      throw new import_validation.default("Cannot build infrastructure on a dead star.");
    }
    let cost = this._calculateUpgradeInfrastructureCost(game, star, expenseConfigKey, economyType, calculateCostCallback);
    if (writeToDB && player.credits < cost) {
      throw new import_validation.default(`The player does not own enough credits to afford to upgrade.`);
    }
    star.infrastructure[economyType]++;
    if (writeToDB) {
      player.credits -= cost;
      await this._upgradeInfrastructureUpdateDB(game, player, star, cost, economyType);
    }
    let nextCost = this._calculateUpgradeInfrastructureCost(game, star, expenseConfigKey, economyType, calculateCostCallback);
    return {
      playerId: player._id,
      starId: star._id,
      starName: star.name,
      infrastructure: star.infrastructure[economyType],
      cost,
      nextCost
    };
  }
  async upgradeEconomy(game, player, starId, writeToDB = true) {
    return await this._upgradeInfrastructure(game, player, starId, game.settings.player.developmentCost.economy, "economy", this.calculateEconomyCost.bind(this), writeToDB);
  }
  async upgradeIndustry(game, player, starId, writeToDB = true) {
    let report = await this._upgradeInfrastructure(game, player, starId, game.settings.player.developmentCost.industry, "industry", this.calculateIndustryCost.bind(this), writeToDB);
    let star = this.starService.getById(game, starId);
    let effectiveTechs = this.technologyService.getStarEffectiveTechnologyLevels(game, star);
    report.manufacturing = this.shipService.calculateStarShipsByTicks(effectiveTechs.manufacturing, report.infrastructure, 1, game.settings.galaxy.productionTicks);
    return report;
  }
  async upgradeScience(game, player, starId, writeToDB = true) {
    let report = await this._upgradeInfrastructure(game, player, starId, game.settings.player.developmentCost.science, "science", this.calculateScienceCost.bind(this), writeToDB);
    report.currentResearchTicksEta = this.researchService.calculateCurrentResearchETAInTicks(game, player);
    report.nextResearchTicksEta = this.researchService.calculateNextResearchETAInTicks(game, player);
    return report;
  }
  _getStarsWithNextUpgradeCost(game, player, infrastructureType, includeIgnored = true) {
    let expenseConfig;
    let calculateCostFunction;
    let upgradeFunction;
    switch (infrastructureType) {
      case "economy":
        calculateCostFunction = this.calculateEconomyCost.bind(this);
        upgradeFunction = this.upgradeEconomy.bind(this);
        expenseConfig = game.constants.star.infrastructureExpenseMultipliers[game.settings.player.developmentCost.economy] || null;
        break;
      case "industry":
        calculateCostFunction = this.calculateIndustryCost.bind(this);
        upgradeFunction = this.upgradeIndustry.bind(this);
        expenseConfig = game.constants.star.infrastructureExpenseMultipliers[game.settings.player.developmentCost.industry] || null;
        break;
      case "science":
        calculateCostFunction = this.calculateScienceCost.bind(this);
        upgradeFunction = this.upgradeScience.bind(this);
        expenseConfig = game.constants.star.infrastructureExpenseMultipliers[game.settings.player.developmentCost.science] || null;
        break;
    }
    if (!calculateCostFunction) {
      throw new import_validation.default(`Unknown infrastructure type ${infrastructureType}`);
    }
    return this.starService.listStarsOwnedByPlayer(game.galaxy.stars, player._id).filter((s) => {
      if (this.starService.isDeadStar(s)) {
        return false;
      }
      if (includeIgnored) {
        return true;
      }
      return !s.ignoreBulkUpgrade[infrastructureType];
    }).map((s) => {
      const effectiveTechs = this.technologyService.getStarEffectiveTechnologyLevels(game, s);
      const terraformedResources = this.starService.calculateTerraformedResource(s.naturalResources[infrastructureType], effectiveTechs.terraforming);
      return {
        star: s,
        terraformedResources,
        infrastructureCost: calculateCostFunction(game, expenseConfig, s.infrastructure[infrastructureType], terraformedResources),
        upgrade: upgradeFunction
      };
    });
  }
  async upgradeBulk(game, player, upgradeStrategy, infrastructureType, amount, writeToDB = true) {
    if (!amount || amount <= 0) {
      throw new import_validation.default(`Invalid upgrade amount given`);
    }
    const upgradeSummary = await this.generateUpgradeBulkReport(game, player, upgradeStrategy, infrastructureType, amount);
    if (player.credits < upgradeSummary.cost) {
      throw new import_validation.default(`The player does not own enough credits to afford to bulk upgrade.`);
    }
    if (upgradeSummary.cost <= 0) {
      return upgradeSummary;
    }
    if (writeToDB) {
      let dbWrites = [
        await this._getDeductPlayerCreditsDBWrite(game, player, upgradeSummary.cost)
      ];
      for (let star of upgradeSummary.stars) {
        switch (infrastructureType) {
          case "economy":
            dbWrites.push({
              updateOne: {
                filter: {
                  _id: game._id,
                  "galaxy.stars._id": star.starId
                },
                update: {
                  $set: {
                    "galaxy.stars.$.infrastructure.economy": star.infrastructure
                  }
                }
              }
            });
            break;
          case "industry":
            dbWrites.push({
              updateOne: {
                filter: {
                  _id: game._id,
                  "galaxy.stars._id": star.starId
                },
                update: {
                  $set: {
                    "galaxy.stars.$.infrastructure.industry": star.infrastructure
                  }
                }
              }
            });
            break;
          case "science":
            dbWrites.push({
              updateOne: {
                filter: {
                  _id: game._id,
                  "galaxy.stars._id": star.starId
                },
                update: {
                  $set: {
                    "galaxy.stars.$.infrastructure.science": star.infrastructure
                  }
                }
              }
            });
            break;
        }
      }
      await this.gameRepo.bulkWrite(dbWrites);
    }
    if (player.userId && !player.defeated && !this.gameTypeService.isTutorialGame(game)) {
      await this.achievementService.incrementInfrastructureBuilt(infrastructureType, player.userId, upgradeSummary.upgraded);
    }
    player.credits -= upgradeSummary.cost;
    this.emit(StarUpgradeServiceEvents.onPlayerInfrastructureBulkUpgraded, {
      gameId: game._id,
      gameTick: game.state.tick,
      player,
      upgradeSummary
    });
    if (infrastructureType === "science") {
      upgradeSummary.currentResearchTicksEta = this.researchService.calculateCurrentResearchETAInTicks(game, player);
      upgradeSummary.nextResearchTicksEta = this.researchService.calculateNextResearchETAInTicks(game, player);
    }
    return upgradeSummary;
  }
  async generateUpgradeBulkReport(game, player, upgradeStrategy, infrastructureType, amount) {
    if (!amount || amount <= 0) {
      throw new import_validation.default(`Invalid upgrade amount given`);
    }
    if (upgradeStrategy === "totalCredits") {
      return await this.generateUpgradeBulkReportTotalCredits(game, player, infrastructureType, amount);
    } else if (upgradeStrategy === "infrastructureAmount") {
      return await this.generateUpgradeBulkReportInfrastructureAmount(game, player, infrastructureType, amount);
    } else if (upgradeStrategy === "belowPrice") {
      return await this.generateUpgradeBulkReportBelowPrice(game, player, infrastructureType, amount);
    }
    throw new Error(`Unsupported upgrade strategy: ${upgradeStrategy}`);
  }
  _createUpgradeQueue(size) {
    return new Heap({
      comparBefore: (s1, s2) => s1.infrastructureCost < s2.infrastructureCost,
      compar: (s1, s2) => s1.infrastructureCost - s2.infrastructureCost,
      freeSpace: false,
      size
    });
  }
  async _upgradeStarAndSummary(game, player, upgradeSummary, upgradeStar, infrastructureType) {
    let summaryStar = upgradeSummary.stars.find((x) => x.starId.toString() === upgradeStar.star._id.toString());
    if (!summaryStar) {
      summaryStar = {
        starId: upgradeStar.star._id,
        starName: upgradeStar.star.name,
        naturalResources: upgradeStar.star.naturalResources,
        infrastructureCurrent: upgradeStar.star.infrastructure[infrastructureType],
        infrastructureCostTotal: 0,
        infrastructure: infrastructureType
      };
      upgradeSummary.stars.push(summaryStar);
    }
    const upgradeReport = await upgradeStar.upgrade(game, player, upgradeStar.star._id, false);
    upgradeSummary.upgraded++;
    upgradeSummary.cost += upgradeReport.cost;
    summaryStar.infrastructureCostTotal += upgradeReport.cost;
    upgradeStar.infrastructureCost = upgradeReport.nextCost;
    summaryStar.infrastructureCost = upgradeReport.nextCost;
    if (upgradeReport.manufacturing != null) {
      summaryStar.manufacturing = upgradeReport.manufacturing;
    }
    summaryStar.infrastructure = upgradeStar.star.infrastructure[infrastructureType];
    return upgradeReport.cost;
  }
  async generateUpgradeBulkReportBelowPrice(game, player, infrastructureType, amount) {
    const ignoredCount = this.starService.listStarsOwnedByPlayerBulkIgnored(game.galaxy.stars, player._id, infrastructureType).length;
    const stars = this._getStarsWithNextUpgradeCost(game, player, infrastructureType, false);
    const upgradeSummary = {
      budget: amount,
      stars: [],
      cost: 0,
      upgraded: 0,
      infrastructureType,
      ignoredCount
    };
    const affordableStars = stars.filter((s) => s.infrastructureCost <= amount);
    const upgradeQueue = this._createUpgradeQueue(stars.length);
    affordableStars.forEach((star) => {
      upgradeQueue.insert(star);
    });
    while (upgradeSummary.upgraded <= 200) {
      const nextStar = upgradeQueue.dequeue();
      if (!nextStar) {
        break;
      }
      await this._upgradeStarAndSummary(game, player, upgradeSummary, nextStar, infrastructureType);
      if (nextStar.infrastructureCost <= amount) {
        upgradeQueue.insert(nextStar);
      }
    }
    return upgradeSummary;
  }
  async generateUpgradeBulkReportInfrastructureAmount(game, player, infrastructureType, amount) {
    amount = Math.min(amount, 200);
    const ignoredCount = this.starService.listStarsOwnedByPlayerBulkIgnored(game.galaxy.stars, player._id, infrastructureType).length;
    const stars = this._getStarsWithNextUpgradeCost(game, player, infrastructureType, false);
    const upgradeSummary = {
      budget: amount,
      stars: [],
      cost: 0,
      upgraded: 0,
      infrastructureType,
      ignoredCount
    };
    const upgradeQueue = this._createUpgradeQueue(stars.length);
    stars.forEach((star) => {
      upgradeQueue.insert(star);
    });
    for (let i = 0; i < amount; i++) {
      let upgradeStar = upgradeQueue.dequeue();
      if (!upgradeStar) {
        break;
      }
      await this._upgradeStarAndSummary(game, player, upgradeSummary, upgradeStar, infrastructureType);
      upgradeQueue.insert(upgradeStar);
    }
    return upgradeSummary;
  }
  async generateUpgradeBulkReportTotalCredits(game, player, infrastructureType, budget) {
    let ignoredCount = this.starService.listStarsOwnedByPlayerBulkIgnored(game.galaxy.stars, player._id, infrastructureType).length;
    let stars = this._getStarsWithNextUpgradeCost(game, player, infrastructureType, false);
    budget = Math.min(budget, player.credits + 1e4);
    let upgradeSummary = {
      budget,
      stars: [],
      cost: 0,
      upgraded: 0,
      infrastructureType,
      ignoredCount
    };
    const upgradeStars = this._createUpgradeQueue(stars.length);
    stars.forEach((star) => {
      upgradeStars.insert(star);
    });
    while (budget > 0) {
      let upgradeStar = upgradeStars.dequeue();
      if (!upgradeStar || upgradeStar.infrastructureCost > budget) {
        break;
      }
      budget -= await this._upgradeStarAndSummary(game, player, upgradeSummary, upgradeStar, infrastructureType);
      upgradeStars.insert(upgradeStar);
    }
    return upgradeSummary;
  }
  calculateAverageTerraformedResources(terraformedResources) {
    return Math.floor((terraformedResources.economy + terraformedResources.industry + terraformedResources.science) / 3);
  }
  calculateWarpGateCost(game, expenseConfig, terraformedResources) {
    return this._calculateInfrastructureCost(game.constants.star.infrastructureCostMultipliers.warpGate, expenseConfig, 0, terraformedResources);
  }
  calculateEconomyCost(game, expenseConfig, current, terraformedResources) {
    return this._calculateInfrastructureCost(game.constants.star.infrastructureCostMultipliers.economy, expenseConfig, current, terraformedResources);
  }
  calculateIndustryCost(game, expenseConfig, current, terraformedResources) {
    return this._calculateInfrastructureCost(game.constants.star.infrastructureCostMultipliers.industry, expenseConfig, current, terraformedResources);
  }
  calculateScienceCost(game, expenseConfig, current, terraformedResources) {
    return this._calculateInfrastructureCost(game.constants.star.infrastructureCostMultipliers.science, expenseConfig, current, terraformedResources);
  }
  _calculateInfrastructureCost(baseCost, expenseConfig, current, terraformedResources) {
    if (expenseConfig == null) {
      return null;
    }
    return Math.max(1, Math.floor(baseCost * expenseConfig * (current + 1) / (terraformedResources / 100)));
  }
  calculateCarrierCost(game, expenseConfig) {
    return expenseConfig * game.constants.star.infrastructureCostMultipliers.carrier + 5;
  }
  setUpgradeCosts(game, star, terraformedResources) {
    const economyExpenseConfig = game.constants.star.infrastructureExpenseMultipliers[game.settings.player.developmentCost.economy];
    const industryExpenseConfig = game.constants.star.infrastructureExpenseMultipliers[game.settings.player.developmentCost.industry];
    const scienceExpenseConfig = game.constants.star.infrastructureExpenseMultipliers[game.settings.player.developmentCost.science];
    const warpGateExpenseConfig = game.constants.star.infrastructureExpenseMultipliers[game.settings.specialGalaxy.warpgateCost];
    const carrierExpenseConfig = game.constants.star.infrastructureExpenseMultipliers[game.settings.specialGalaxy.carrierCost];
    const upgradeCosts = {
      economy: null,
      industry: null,
      science: null,
      warpGate: null,
      carriers: null
    };
    if (!this.starService.isDeadStar(star)) {
      let averageTerraformedResources = this.calculateAverageTerraformedResources(terraformedResources);
      upgradeCosts.economy = this.calculateEconomyCost(game, economyExpenseConfig, star.infrastructure.economy, terraformedResources.economy);
      upgradeCosts.industry = this.calculateIndustryCost(game, industryExpenseConfig, star.infrastructure.industry, terraformedResources.industry);
      upgradeCosts.science = this.calculateScienceCost(game, scienceExpenseConfig, star.infrastructure.science, terraformedResources.science);
      upgradeCosts.warpGate = this.calculateWarpGateCost(game, warpGateExpenseConfig, averageTerraformedResources);
      upgradeCosts.carriers = this.calculateCarrierCost(game, carrierExpenseConfig);
    }
    star.upgradeCosts = upgradeCosts;
    return upgradeCosts;
  }
  async _getDeductPlayerCreditsDBWrite(game, player, cost) {
    return await this.playerCreditsService.addCredits(game, player, -cost, false);
  }
  _getSetStarWarpGateDBWrite(game, star, warpGate) {
    return {
      updateOne: {
        filter: {
          _id: game._id,
          "galaxy.stars._id": star._id
        },
        update: {
          "galaxy.stars.$.warpGate": warpGate
        }
      }
    };
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StarUpgradeServiceEvents
});
//# sourceMappingURL=starUpgrade.js.map
