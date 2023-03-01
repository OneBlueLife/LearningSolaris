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
var research_exports = {};
__export(research_exports, {
  ResearchServiceEvents: () => ResearchServiceEvents,
  default: () => ResearchService
});
module.exports = __toCommonJS(research_exports);
var import_validation = __toESM(require("../errors/validation"));
const EventEmitter = require("events");
const ResearchServiceEvents = {
  onPlayerResearchCompleted: "onPlayerResearchCompleted"
};
class ResearchService extends EventEmitter {
  constructor(gameRepo, technologyService, randomService, playerStatisticsService, starService, userService, gameTypeService) {
    super();
    this.gameRepo = gameRepo;
    this.technologyService = technologyService;
    this.randomService = randomService;
    this.playerStatisticsService = playerStatisticsService;
    this.starService = starService;
    this.userService = userService;
    this.gameTypeService = gameTypeService;
  }
  async updateResearchNow(game, player, preference) {
    if (!this.technologyService.isTechnologyEnabled(game, preference) || !this.technologyService.isTechnologyResearchable(game, preference)) {
      throw new import_validation.default(`Cannot change technology, the chosen tech is not researchable.`);
    }
    player.researchingNow = preference;
    await this.gameRepo.updateOne({
      _id: game._id,
      "galaxy.players._id": player._id
    }, {
      $set: {
        "galaxy.players.$.researchingNow": preference
      }
    });
    let ticksEta = this.calculateCurrentResearchETAInTicks(game, player);
    let ticksNextEta = this.calculateNextResearchETAInTicks(game, player);
    return {
      ticksEta,
      ticksNextEta
    };
  }
  async updateResearchNext(game, player, preference) {
    if (preference !== "random" && (!this.technologyService.isTechnologyEnabled(game, preference) || !this.technologyService.isTechnologyResearchable(game, preference))) {
      throw new import_validation.default(`Cannot change technology, the chosen tech is not researchable.`);
    }
    player.researchingNext = preference;
    await this.gameRepo.updateOne({
      _id: game._id,
      "galaxy.players._id": player._id
    }, {
      $set: {
        "galaxy.players.$.researchingNext": preference
      }
    });
    let ticksEta = this.calculateCurrentResearchETAInTicks(game, player);
    let ticksNextEta = this.calculateNextResearchETAInTicks(game, player);
    return {
      ticksEta,
      ticksNextEta
    };
  }
  async conductResearch(game, user, player) {
    let techKey = player.researchingNow;
    let tech = player.research[techKey];
    if (!this.technologyService.isTechnologyEnabled(game, techKey) || !this.technologyService.isTechnologyResearchable(game, techKey)) {
      return null;
    }
    let playerStars = this.starService.listStarsOwnedByPlayer(game.galaxy.stars, player._id);
    let totalScience = this.playerStatisticsService.calculateTotalScience(playerStars);
    let multiplier = game.constants.research.sciencePointMultiplier;
    let progressIncrease = Math.floor(totalScience * multiplier);
    tech.progress += progressIncrease;
    if (user && !player.defeated && !this.gameTypeService.isTutorialGame(game)) {
      user.achievements.research[techKey] += progressIncrease;
    }
    let requiredProgress = this.getRequiredResearchProgress(game, techKey, tech.level);
    let levelUp = false;
    while (tech.progress >= requiredProgress) {
      tech.level++;
      tech.progress -= requiredProgress;
      requiredProgress = this.getRequiredResearchProgress(game, techKey, tech.level);
      levelUp = true;
    }
    if (levelUp) {
      this._setNextResearch(game, player);
      this.emit(ResearchServiceEvents.onPlayerResearchCompleted, {
        gameId: game._id,
        gameTick: game.state.tick,
        playerId: player._id,
        technologyKey: techKey,
        technologyLevel: tech.level,
        technologyKeyNext: player.researchingNow,
        technologyLevelNext: player.research[player.researchingNow].level + 1
      });
    }
    let currentResearchTicksEta = this.calculateCurrentResearchETAInTicks(game, player);
    let nextResearchTicksEta = this.calculateNextResearchETAInTicks(game, player);
    let report = {
      name: techKey,
      level: tech.level,
      progress: tech.progress,
      levelUp,
      currentResearchTicksEta,
      nextResearchTicksEta
    };
    return report;
  }
  async conductResearchAll(game, gameUsers) {
    for (let i = 0; i < game.galaxy.players.length; i++) {
      let player = game.galaxy.players[i];
      let user = gameUsers.find((u) => player.userId && u._id.toString() === player.userId.toString()) || null;
      await this.conductResearch(game, user, player);
    }
  }
  getRequiredResearchProgress(game, technologyKey, technologyLevel) {
    const researchCostConfig = game.settings.technology.researchCosts[technologyKey];
    const expenseCostConfig = game.constants.star.infrastructureExpenseMultipliers[researchCostConfig];
    const progressMultiplierConfig = expenseCostConfig * game.constants.research.progressMultiplier;
    return technologyLevel * progressMultiplierConfig;
  }
  conductExperiments(game, player) {
    let isExperimentationEnabled = this.technologyService.isTechnologyEnabled(game, "experimentation");
    const noExperimentation = {
      technology: null,
      level: null,
      amount: null,
      levelUp: null,
      researchingNext: null
    };
    if (!isExperimentationEnabled) {
      return noExperimentation;
    }
    let playerStars = this.starService.listStarsOwnedByPlayer(game.galaxy.stars, player._id);
    if (!playerStars.length) {
      return noExperimentation;
    }
    let tech = this._getRandomTechnology(game, player);
    if (!tech) {
      return noExperimentation;
    }
    let techLevel = player.research.experimentation.level;
    let progressMultiplier = game.constants.research.progressMultiplier;
    let experimentationMultiplier = game.constants.research.experimentationMultiplier;
    let researchAmount;
    switch (game.settings.technology.experimentationReward) {
      case "standard":
        researchAmount = Math.floor(techLevel * (progressMultiplier * experimentationMultiplier));
        break;
      case "experimental":
        let totalScience = this.playerStatisticsService.calculateTotalScience(playerStars);
        researchAmount = Math.floor(techLevel * (progressMultiplier * experimentationMultiplier) + 0.15 * techLevel * totalScience);
        break;
      default:
        throw new Error(`Unsupported experimentation reward ${game.settings.technology.experimentationReward}`);
    }
    tech.technology.progress += researchAmount;
    let requiredProgress = this.getRequiredResearchProgress(game, tech.key, tech.technology.level);
    let levelUp = false;
    let researchingNext;
    while (tech.technology.progress >= requiredProgress) {
      tech.technology.level++;
      tech.technology.progress -= requiredProgress;
      requiredProgress = this.getRequiredResearchProgress(game, tech.key, tech.technology.level);
      levelUp = true;
    }
    if (levelUp && tech.key === player.researchingNow) {
      this._setNextResearch(game, player);
      researchingNext = player.researchingNext;
    }
    return {
      technology: tech.key,
      level: tech.technology.level,
      amount: researchAmount,
      levelUp,
      researchingNext
    };
  }
  _setNextResearch(game, player) {
    if (player.researchingNext === player.researchingNow) {
      return;
    }
    if (player.researchingNext === "random") {
      let randomTech = this._getRandomTechnology(game, player);
      if (randomTech) {
        player.researchingNow = randomTech.key;
      }
    } else {
      player.researchingNow = player.researchingNext;
    }
    return player.researchingNow;
  }
  _getRandomTechnology(game, player) {
    let techs = Object.keys(player.research).filter((k) => {
      return k.match(/^[^_\$]/) != null;
    });
    techs = techs.filter((t) => this.technologyService.isTechnologyEnabled(game, t) && this.technologyService.isTechnologyResearchable(game, t));
    if (!techs.length) {
      return null;
    }
    let researchTechsCount = techs.length;
    let techKey = techs[this.randomService.getRandomNumber(researchTechsCount - 1)];
    let tech = player.research[techKey];
    return {
      key: techKey,
      technology: tech
    };
  }
  calculateCurrentResearchETAInTicks(game, player) {
    return this._calculateResearchETAInTicks(game, player, player.researchingNow);
  }
  calculateNextResearchETAInTicks(game, player) {
    if (player.researchingNext === "random") {
      return null;
    }
    if (player.researchingNow !== player.researchingNext) {
      let currentResearchTicksEta = this.calculateCurrentResearchETAInTicks(game, player);
      let nextResearchTicksEta = this._calculateResearchETAInTicks(game, player, player.researchingNext);
      if (currentResearchTicksEta == null || nextResearchTicksEta == null) {
        return null;
      }
      return currentResearchTicksEta + nextResearchTicksEta;
    }
    return this.calculateDoubleIdenticalResearchETAInTicks(game, player);
  }
  _calculateResearchETAInTicks(game, player, researchKey) {
    if (researchKey === "random") {
      return null;
    }
    let tech = player.research[researchKey];
    let requiredProgress = this.getRequiredResearchProgress(game, researchKey, tech.level);
    let remainingPoints = requiredProgress - tech.progress;
    return this._calculateResearchETAInTicksByRemainingPoints(game, player, remainingPoints);
  }
  calculateDoubleIdenticalResearchETAInTicks(game, player) {
    let tech = player.research[player.researchingNow];
    let requiredProgress = this.getRequiredResearchProgress(game, player.researchingNow, tech.level) + this.getRequiredResearchProgress(game, player.researchingNow, tech.level + 1);
    let remainingPoints = requiredProgress - tech.progress;
    return this._calculateResearchETAInTicksByRemainingPoints(game, player, remainingPoints);
  }
  _calculateResearchETAInTicksByRemainingPoints(game, player, remainingPoints) {
    let playerStars = this.starService.listStarsOwnedByPlayer(game.galaxy.stars, player._id);
    let totalScience = this.playerStatisticsService.calculateTotalScience(playerStars);
    if (totalScience === 0) {
      return null;
    }
    return Math.ceil(remainingPoints / totalScience);
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ResearchServiceEvents
});
//# sourceMappingURL=research.js.map
