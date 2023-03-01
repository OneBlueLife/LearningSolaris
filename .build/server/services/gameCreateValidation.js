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
var gameCreateValidation_exports = {};
__export(gameCreateValidation_exports, {
  default: () => GameCreateValidationService
});
module.exports = __toCommonJS(gameCreateValidation_exports);
var import_validation = __toESM(require("../errors/validation"));
class GameCreateValidationService {
  constructor(playerService, starService, carrierService, specialistService, gameTypeService) {
    this.playerService = playerService;
    this.starService = starService;
    this.carrierService = carrierService;
    this.specialistService = specialistService;
    this.gameTypeService = gameTypeService;
  }
  validate(game) {
    if (game.galaxy.players.length !== game.settings.general.playerLimit) {
      throw new import_validation.default(`The game must have ${game.settings.general.playerLimit} players.`);
    }
    for (let player of game.galaxy.players) {
      let playerStars = this.starService.listStarsOwnedByPlayer(game.galaxy.stars, player._id);
      if (playerStars.length !== game.settings.player.startingStars) {
        throw new import_validation.default(`All players must have ${game.settings.player.startingStars} stars.`);
      }
      if (!player.homeStarId || !this.starService.getById(game, player.homeStarId)) {
        throw new import_validation.default(`All players must have a capital star.`);
      }
      let otherPlayer = game.galaxy.players.find((p) => p._id.toString() !== player._id.toString() && p.shape === player.shape && p.colour.value === player.colour.value);
      if (otherPlayer) {
        throw new import_validation.default(`All players must have a unique colour/shape combination.`);
      }
      if (player.credits !== game.settings.player.startingCredits) {
        throw new import_validation.default(`All players must start with ${game.settings.player.startingCredits} credits.`);
      }
      if (player.creditsSpecialists !== game.settings.player.startingCreditsSpecialists) {
        throw new import_validation.default(`All players must start with ${game.settings.player.startingCreditsSpecialists} specialist tokens.`);
      }
      let carriers = this.carrierService.listCarriersOwnedByPlayer(game.galaxy.carriers, player._id);
      if (carriers.length !== 1) {
        throw new import_validation.default(`All players must have 1 carrier.`);
      }
      if (player.research.terraforming.level !== game.settings.technology.startingTechnologyLevel.terraforming || player.research.experimentation.level !== game.settings.technology.startingTechnologyLevel.experimentation || player.research.scanning.level !== game.settings.technology.startingTechnologyLevel.scanning || player.research.hyperspace.level !== game.settings.technology.startingTechnologyLevel.hyperspace || player.research.manufacturing.level !== game.settings.technology.startingTechnologyLevel.manufacturing || player.research.banking.level !== game.settings.technology.startingTechnologyLevel.banking || player.research.weapons.level !== game.settings.technology.startingTechnologyLevel.weapons || player.research.specialists.level !== game.settings.technology.startingTechnologyLevel.specialists) {
        throw new import_validation.default(`All players must start with valid starting technology levels.`);
      }
    }
    const noOfStars = game.settings.galaxy.starsPerPlayer * game.settings.general.playerLimit;
    if (game.galaxy.stars.length !== noOfStars) {
      throw new import_validation.default(`The galaxy must have a total of ${noOfStars} stars.`);
    }
    if (game.galaxy.stars.filter((s) => s.homeStar).length !== game.settings.general.playerLimit) {
      throw new import_validation.default(`The galaxy must have a total of ${game.settings.general.playerLimit} capital stars.`);
    }
    if (this.gameTypeService.isKingOfTheHillMode(game) && !this.starService.getKingOfTheHillStar(game)) {
      throw new import_validation.default(`A center star must be present in king of the hill mode.`);
    }
    for (let star of game.galaxy.stars) {
      if (star.homeStar && (!star.ownedByPlayerId || !this.playerService.getById(game, star.ownedByPlayerId))) {
        throw new import_validation.default(`All capital stars must be owned by a player.`);
      }
      if (star.naturalResources.economy < 0 || star.naturalResources.industry < 0 || star.naturalResources.science < 0) {
        throw new import_validation.default(`All stars must have valid natural resources.`);
      }
      if (game.settings.specialGalaxy.splitResources === "disabled" && (star.naturalResources.economy !== star.naturalResources.industry || star.naturalResources.economy !== star.naturalResources.science)) {
        throw new import_validation.default(`All stars must have equal natural resources for non-split resources.`);
      }
      if (star.infrastructure.economy < 0 || star.infrastructure.industry < 0 || star.infrastructure.science < 0) {
        throw new import_validation.default(`All stars must have valid infrastructure.`);
      }
      if (star.homeStar && (star.infrastructure.economy !== game.settings.player.startingInfrastructure.economy || star.infrastructure.industry !== game.settings.player.startingInfrastructure.industry || star.infrastructure.science !== game.settings.player.startingInfrastructure.science)) {
        throw new import_validation.default(`All capital stars must start with valid starting infrastructure.`);
      }
      if (this.starService.isDeadStar(star) && (star.infrastructure.economy > 0 || star.infrastructure.industry > 0 || star.infrastructure.science > 0 || star.specialistId)) {
        throw new import_validation.default(`All dead stars must have 0 infrastructure, no specialists and no warp gates.`);
      }
      if (star.ships < 0 || star.shipsActual < 0) {
        throw new import_validation.default(`All stars must have 0 or greater ships.`);
      }
      if (!star.homeStar && star.ownedByPlayerId && (star.ships !== game.settings.player.startingShips || star.shipsActual !== game.settings.player.startingShips)) {
        throw new import_validation.default(`All non capital stars owned by players must have ${game.settings.player.startingShips} ships.`);
      }
      if (star.specialistId && !this.specialistService.getByIdStar(star.specialistId)) {
        throw new import_validation.default(`All stars with specialists must have a valid specialist.`);
      }
      if (star.homeStar && (star.ships !== game.settings.player.startingShips - 1 || star.shipsActual !== game.settings.player.startingShips - 1 || star.infrastructure.economy !== game.settings.player.startingInfrastructure.economy || star.infrastructure.industry !== game.settings.player.startingInfrastructure.industry || star.infrastructure.science !== game.settings.player.startingInfrastructure.science)) {
        throw new import_validation.default(`All capital stars must start with valid ships and infrastructure.`);
      }
      if (star.wormHoleToStarId && !this.starService.getById(game, star.wormHoleToStarId)) {
        throw new import_validation.default(`All worm holes must be paired with a valid star.`);
      }
    }
    for (let carrier of game.galaxy.carriers) {
      if (!carrier.ownedByPlayerId) {
        throw new import_validation.default(`All carriers must be owned by a player.`);
      }
      if (!carrier.orbiting) {
        throw new import_validation.default(`All carriers must be in orbit.`);
      }
      if (carrier.waypoints.length) {
        throw new import_validation.default(`All carriers must have 0 waypoints.`);
      }
      if (carrier.ships !== 1) {
        throw new import_validation.default(`All carriers must start with ${game.settings.player.startingShips} ships.`);
      }
      if (carrier.specialistId && !this.specialistService.getByIdCarrier(carrier.specialistId)) {
        throw new import_validation.default(`All carriers with specialists must have a valid specialist.`);
      }
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=gameCreateValidation.js.map
