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
var specialistHire_exports = {};
__export(specialistHire_exports, {
  default: () => SpecialistHireService
});
module.exports = __toCommonJS(specialistHire_exports);
var import_validation = __toESM(require("../errors/validation"));
class SpecialistHireService {
  constructor(gameRepo, specialistService, achievementService, waypointService, playerCreditsService, starService, gameTypeService, specialistBanService, technologyService) {
    this.gameRepo = gameRepo;
    this.specialistService = specialistService;
    this.achievementService = achievementService;
    this.waypointService = waypointService;
    this.playerCreditsService = playerCreditsService;
    this.starService = starService;
    this.gameTypeService = gameTypeService;
    this.specialistBanService = specialistBanService;
    this.technologyService = technologyService;
  }
  async hireCarrierSpecialist(game, player, carrierId, specialistId) {
    if (game.settings.specialGalaxy.specialistCost === "none") {
      throw new import_validation.default("The game settings has disabled the hiring of specialists.");
    }
    if (this.specialistBanService.isCarrierSpecialistBanned(game, specialistId)) {
      throw new import_validation.default("This specialist has been banned from this game.");
    }
    let carrier = game.galaxy.carriers.find((x) => x.ownedByPlayerId && x.ownedByPlayerId.toString() === player._id.toString() && x._id.toString() === carrierId.toString());
    if (!carrier) {
      throw new import_validation.default(`Cannot assign a specialist to a carrier that you do not own.`);
    }
    if (!carrier.orbiting) {
      throw new import_validation.default(`Cannot assign a specialist to a carrier in transit.`);
    }
    let star = this.starService.getById(game, carrier.orbiting);
    if (this.starService.isDeadStar(star)) {
      throw new import_validation.default("Cannot hire a specialist while in orbit of a dead star.");
    }
    if (!this.starService.isOwnedByPlayer(star, player)) {
      throw new import_validation.default("Cannot hire a specialist while in orbit of a star that you do not own.");
    }
    const specialist = this.specialistService.getByIdCarrier(specialistId);
    if (!specialist) {
      throw new import_validation.default(`A specialist with ID ${specialistId} does not exist or is disabled.`);
    }
    if (carrier.specialistId && carrier.specialistId === specialist.id) {
      throw new import_validation.default(`The carrier already has the specialist assigned.`);
    }
    if (!this._canAffordSpecialist(game, player, specialist)) {
      throw new import_validation.default(`You cannot afford to buy this specialist.`);
    }
    let cost = this.specialistService.getSpecialistActualCost(game, specialist);
    if (carrier.specialistId) {
      let carrierSpecialist = this.specialistService.getByIdCarrier(carrier.specialistId);
      if (carrierSpecialist && carrierSpecialist.oneShot) {
        throw new import_validation.default(`The current specialist cannot be replaced.`);
      }
    }
    carrier.specialistId = specialist.id;
    carrier.specialistExpireTick = specialist.expireTicks ? game.state.tick + specialist.expireTicks : null;
    await this.gameRepo.bulkWrite([
      await this._deductSpecialistCost(game, player, specialist),
      {
        updateOne: {
          filter: {
            _id: game._id,
            "galaxy.carriers._id": carrier._id
          },
          update: {
            "galaxy.carriers.$.specialistId": carrier.specialistId,
            "galaxy.carriers.$.specialistExpireTick": carrier.specialistExpireTick
          }
        }
      }
    ]);
    if (player.userId && !player.defeated && !this.gameTypeService.isTutorialGame(game)) {
      await this.achievementService.incrementSpecialistsHired(player.userId);
    }
    carrier.effectiveTechs = this.technologyService.getCarrierEffectiveTechnologyLevels(game, carrier, true);
    let waypoints = await this.waypointService.cullWaypointsByHyperspaceRangeDB(game, carrier);
    let result = {
      game,
      carrier,
      specialist,
      cost,
      waypoints
    };
    return result;
  }
  async hireStarSpecialist(game, player, starId, specialistId) {
    var _a;
    if (game.settings.specialGalaxy.specialistCost === "none") {
      throw new import_validation.default("The game settings has disabled the hiring of specialists.");
    }
    if (this.specialistBanService.isStarSpecialistBanned(game, specialistId)) {
      throw new import_validation.default("This specialist has been banned from this game.");
    }
    let star = game.galaxy.stars.find((x) => x.ownedByPlayerId && x.ownedByPlayerId.toString() === player._id.toString() && x._id.toString() === starId.toString());
    if (!star) {
      throw new import_validation.default(`Cannot assign a specialist to a star that you do not own.`);
    }
    if (this.starService.isDeadStar(star)) {
      throw new import_validation.default("Cannot hire a specialist on a dead star.");
    }
    const specialist = this.specialistService.getByIdStar(specialistId);
    if (!specialist) {
      throw new import_validation.default(`A specialist with ID ${specialistId} does not exist or is disabled.`);
    }
    if (star.specialistId && star.specialistId === specialist.id) {
      throw new import_validation.default(`The star already has the specialist assigned.`);
    }
    if (!this._canAffordSpecialist(game, player, specialist)) {
      throw new import_validation.default(`You cannot afford to buy this specialist.`);
    }
    let cost = this.specialistService.getSpecialistActualCost(game, specialist);
    if (star.specialistId) {
      let starSpecialist = this.specialistService.getByIdStar(star.specialistId);
      if (starSpecialist && starSpecialist.oneShot) {
        throw new import_validation.default(`The current specialist cannot be replaced.`);
      }
    }
    if (star.wormHoleToStarId && ((_a = specialist.modifiers.special) == null ? void 0 : _a.wormHoleConstructor)) {
      throw new import_validation.default(`The star already has a worm hole connected to another star.`);
    }
    star.specialistId = specialist.id;
    star.specialistExpireTick = specialist.expireTicks ? game.state.tick + specialist.expireTicks : null;
    await this.gameRepo.bulkWrite([
      await this._deductSpecialistCost(game, player, specialist),
      {
        updateOne: {
          filter: {
            _id: game._id,
            "galaxy.stars._id": star._id
          },
          update: {
            "galaxy.stars.$.specialistId": star.specialistId,
            "galaxy.stars.$.specialistExpireTick": star.specialistExpireTick
          }
        }
      }
    ]);
    if (player.userId && !player.defeated && !this.gameTypeService.isTutorialGame(game)) {
      await this.achievementService.incrementSpecialistsHired(player.userId);
    }
    star.effectiveTechs = this.technologyService.getStarEffectiveTechnologyLevels(game, star, true);
    return {
      star,
      specialist,
      cost
    };
  }
  _canAffordSpecialist(game, player, specialist) {
    let cost = this.specialistService.getSpecialistActualCost(game, specialist);
    switch (game.settings.specialGalaxy.specialistsCurrency) {
      case "credits":
        return player.credits >= cost.credits;
      case "creditsSpecialists":
        return player.creditsSpecialists >= cost.creditsSpecialists;
      default:
        throw new Error(`Unsupported specialist currency type: ${game.settings.specialGalaxy.specialistsCurrency}`);
    }
  }
  async _deductSpecialistCost(game, player, specialist) {
    let cost = this.specialistService.getSpecialistActualCost(game, specialist);
    switch (game.settings.specialGalaxy.specialistsCurrency) {
      case "credits":
        player.credits -= cost.credits;
        return await this.playerCreditsService.addCredits(game, player, -cost.credits, false);
      case "creditsSpecialists":
        player.creditsSpecialists -= cost.creditsSpecialists;
        return await this.playerCreditsService.addCreditsSpecialists(game, player, -cost.creditsSpecialists, false);
      default:
        throw new Error(`Unsupported specialist currency type: ${game.settings.specialGalaxy.specialistsCurrency}`);
    }
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=specialistHire.js.map
