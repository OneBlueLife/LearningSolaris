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
var gameCreate_exports = {};
__export(gameCreate_exports, {
  default: () => GameCreateService
});
module.exports = __toCommonJS(gameCreate_exports);
var import_validation = __toESM(require("../errors/validation"));
const RANDOM_NAME_STRING = "[[[RANDOM]]]";
class GameCreateService {
  constructor(gameModel, gameJoinService, gameListService, nameService, mapService, playerService, passwordService, conversationService, historyService, achievementService, userService, gameCreateValidationService, gameFluxService, specialistBanService, specialStarBanService, gameTypeService, starService) {
    this.gameModel = gameModel;
    this.gameJoinService = gameJoinService;
    this.gameListService = gameListService;
    this.nameService = nameService;
    this.mapService = mapService;
    this.playerService = playerService;
    this.passwordService = passwordService;
    this.conversationService = conversationService;
    this.historyService = historyService;
    this.achievementService = achievementService;
    this.userService = userService;
    this.gameCreateValidationService = gameCreateValidationService;
    this.gameFluxService = gameFluxService;
    this.specialistBanService = specialistBanService;
    this.specialStarBanService = specialStarBanService;
    this.gameTypeService = gameTypeService;
    this.starService = starService;
  }
  async create(settings) {
    const isTutorial = settings.general.type === "tutorial";
    const isNewPlayerGame = settings.general.type === "new_player_rt" || settings.general.type === "new_player_tb";
    const isOfficialGame = settings.general.createdByUserId == null;
    if (settings.general.createdByUserId && !isTutorial) {
      settings.general.type = "custom";
      settings.general.timeMachine = "disabled";
      settings.general.featured = false;
      let openGames = await this.gameListService.listOpenGamesCreatedByUser(settings.general.createdByUserId);
      let userIsGameMaster = await this.userService.getUserIsGameMaster(settings.general.createdByUserId);
      if (openGames.length && !userIsGameMaster) {
        throw new import_validation.default("Cannot create game, you already have another game waiting for players.");
      }
      if (userIsGameMaster && openGames.length > 5) {
        throw new import_validation.default("Game Masters are limited to 5 games waiting for players.");
      }
      if (settings.general.playerLimit > 16 && !userIsGameMaster) {
        throw new import_validation.default(`Games larger than 16 players are reserved for official games or can be created by GMs.`);
      }
      let isEstablishedPlayer = await this.userService.isEstablishedPlayer(settings.general.createdByUserId);
      if (!isEstablishedPlayer) {
        throw new import_validation.default(`You must complete at least one game in order to create a custom game.`);
      }
    }
    if (settings.general.name.trim().length < 3 || settings.general.name.trim().length > 24) {
      throw new import_validation.default("Game name must be between 3 and 24 characters.");
    }
    if (settings.general.password) {
      settings.general.password = await this.passwordService.hash(settings.general.password);
      settings.general.passwordRequired = true;
    }
    let game = new this.gameModel({
      settings
    });
    let desiredStarCount = game.settings.galaxy.starsPerPlayer * game.settings.general.playerLimit;
    let desiredPlayerStarCount = game.settings.player.startingStars * game.settings.general.playerLimit;
    if (desiredPlayerStarCount > desiredStarCount) {
      throw new import_validation.default(`Cannot create a galaxy of ${desiredStarCount} stars with ${game.settings.player.startingStars} stars per player.`);
    }
    if (game.settings.orbitalMechanics.enabled === "enabled" && game.settings.specialGalaxy.carrierToCarrierCombat === "enabled") {
      game.settings.specialGalaxy.carrierToCarrierCombat = "disabled";
    }
    if (game.settings.specialGalaxy.specialistsCurrency === "credits") {
      game.settings.player.startingCreditsSpecialists = 0;
      game.settings.player.tradeCreditsSpecialists = false;
      game.settings.technology.startingTechnologyLevel.specialists = 0;
      game.settings.technology.researchCosts.specialists = "none";
    }
    if (game.settings.specialGalaxy.specialistCost === "none") {
      game.settings.specialGalaxy.specialistBans = {
        star: [],
        carrier: []
      };
    }
    if (game.settings.gameTime.isTickLimited === "enabled") {
      game.state.ticksToEnd = game.settings.gameTime.tickLimit;
    } else {
      game.settings.gameTime.tickLimit = null;
      game.state.ticksToEnd = null;
    }
    if (game.settings.galaxy.galaxyType === "custom") {
      game.settings.specialGalaxy.randomWarpGates = 0;
      game.settings.specialGalaxy.randomWormHoles = 0;
      game.settings.specialGalaxy.randomNebulas = 0;
      game.settings.specialGalaxy.randomAsteroidFields = 0;
      game.settings.specialGalaxy.randomBinaryStars = 0;
      game.settings.specialGalaxy.randomBlackHoles = 0;
      game.settings.specialGalaxy.randomPulsars = 0;
    }
    game.settings.diplomacy.maxAlliances = Math.max(1, Math.min(game.settings.diplomacy.maxAlliances, game.settings.general.playerLimit - 1));
    if (game.settings.general.name.indexOf(RANDOM_NAME_STRING) > -1) {
      let randomGameName = this.nameService.getRandomGameName();
      game.settings.general.name = game.settings.general.name.replace(RANDOM_NAME_STRING, randomGameName);
    }
    if (this.gameTypeService.isFluxGame(game)) {
      this.gameFluxService.applyCurrentFlux(game);
    }
    const canApplyBans = isOfficialGame && !isNewPlayerGame && !isTutorial;
    if (canApplyBans) {
      if (game.settings.specialGalaxy.specialistCost !== "none") {
        const banAmount = game.constants.specialists.monthlyBanAmount;
        const starBans = this.specialistBanService.getCurrentMonthStarBans(banAmount).map((s) => s.id);
        const carrierBans = this.specialistBanService.getCurrentMonthCarrierBans(banAmount).map((s) => s.id);
        game.settings.specialGalaxy.specialistBans = {
          star: [...new Set(game.settings.specialGalaxy.specialistBans.star.concat(starBans))],
          carrier: [...new Set(game.settings.specialGalaxy.specialistBans.carrier.concat(carrierBans))]
        };
      }
      const specialStarBans = this.specialStarBanService.getCurrentMonthBans().specialStar;
      for (let specialStarBan of specialStarBans) {
        if (game.settings.specialGalaxy[specialStarBan.id] != null) {
          game.settings.specialGalaxy[specialStarBan.id] = 0;
        }
      }
    }
    game.galaxy.homeStars = [];
    game.galaxy.linkedStars = [];
    let starGeneration = this.mapService.generateStars(
      game,
      desiredStarCount,
      game.settings.general.playerLimit,
      settings.galaxy.customJSON
    );
    game.galaxy.stars = starGeneration.stars;
    game.galaxy.homeStars = starGeneration.homeStars;
    game.galaxy.linkedStars = starGeneration.linkedStars;
    this.starService.setupStarsForGameStart(game);
    game.galaxy.players = this.playerService.createEmptyPlayers(game);
    game.galaxy.carriers = this.playerService.createHomeStarCarriers(game);
    this.mapService.generateTerrain(game);
    game.state.stars = game.galaxy.stars.length;
    game.state.starsForVictory = this._calculateStarsForVictory(game);
    this._setGalaxyCenter(game);
    if (isTutorial) {
      this._setupTutorialPlayers(game);
    } else {
      this.conversationService.createConversationAllPlayers(game);
    }
    this.gameCreateValidationService.validate(game);
    let gameObject = await game.save();
    return gameObject;
  }
  _setGalaxyCenter(game) {
    const starLocations = game.galaxy.stars.map((s) => s.location);
    game.constants.distances.galaxyCenterLocation = this.mapService.getGalaxyCenter(starLocations);
  }
  _calculateStarsForVictory(game) {
    if (game.settings.general.mode === "conquest") {
      switch (game.settings.conquest.victoryCondition) {
        case "starPercentage":
          return Math.ceil(game.state.stars / 100 * game.settings.conquest.victoryPercentage);
        case "homeStarPercentage":
          return Math.max(2, Math.ceil(game.settings.general.playerLimit / 100 * game.settings.conquest.victoryPercentage));
        default:
          throw new Error(`Unsupported conquest victory condition: ${game.settings.conquest.victoryCondition}`);
      }
    }
    return game.galaxy.stars.length;
  }
  _setupTutorialPlayers(game) {
    this.gameJoinService.assignPlayerToUser(game, game.galaxy.players[0], game.settings.general.createdByUserId, `Player`, 0);
    this.gameJoinService.assignNonUserPlayersToAI(game);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=gameCreate.js.map
