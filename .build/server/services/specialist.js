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
var specialist_exports = {};
__export(specialist_exports, {
  default: () => SpecialistService
});
module.exports = __toCommonJS(specialist_exports);
var import_validation = __toESM(require("../errors/validation"));
const specialists = require("../config/game/specialists.json");
class SpecialistService {
  constructor(gameTypeService) {
    this.gameTypeService = gameTypeService;
  }
  getById(id, type) {
    return specialists[type].find((x) => x.id === id);
  }
  getByIdCarrier(id) {
    if (!id) {
      return null;
    }
    return this.getById(id, "carrier");
  }
  getByIdCarrierTrim(id) {
    let spec = this.getByIdCarrier(id);
    if (spec) {
      spec = {
        id: spec.id,
        key: spec.key,
        name: spec.name,
        description: spec.description
      };
    }
    return spec;
  }
  getByIdStar(id) {
    if (!id) {
      return null;
    }
    return this.getById(id, "star");
  }
  getByIdStarTrim(id) {
    let spec = this.getByIdStar(id);
    if (spec) {
      spec = {
        id: spec.id,
        key: spec.key,
        name: spec.name,
        description: spec.description
      };
    }
    return spec;
  }
  list(game, type) {
    if (game && game.settings.specialGalaxy.specialistCost === "none") {
      throw new import_validation.default("The game settings has disabled the hiring of specialists.");
    }
    let specialistsList = JSON.parse(JSON.stringify(specialists));
    let specs = specialistsList[type].filter((s) => s.active.official || s.active.custom);
    if (game) {
      const isOfficialGame = this.gameTypeService.isOfficialGame(game);
      const isCustomGame = this.gameTypeService.isCustomGame(game);
      specs = specs.filter((s) => s.active.official && isOfficialGame || s.active.custom && isCustomGame);
    }
    if (game) {
      for (let spec of specs) {
        spec.cost = this.getSpecialistActualCost(game, spec);
      }
      let currency = game.settings.specialGalaxy.specialistsCurrency;
      return specs.sort((a, b) => a.cost[currency] - b.cost[currency]);
    }
    return specs.sort((a, b) => a.name - b.name);
  }
  listCarrier(game) {
    return this.list(game, "carrier");
  }
  listStar(game) {
    return this.list(game, "star");
  }
  getSpecialistActualCost(game, specialist) {
    let result = {
      credits: 0,
      creditsSpecialists: 0
    };
    const expenseConfig = game.constants.star.specialistsExpenseMultipliers[game.settings.specialGalaxy.specialistCost];
    result.credits = specialist.baseCostCredits * expenseConfig;
    result.creditsSpecialists = specialist.baseCostCreditsSpecialists * expenseConfig;
    return result;
  }
  _getCarrierSpecialValue(carrier, name, defaultValue) {
    if (!carrier.specialistId) {
      return defaultValue;
    }
    let specialist = this.getByIdCarrier(carrier.specialistId);
    if (specialist == null || !specialist.modifiers.special) {
      return defaultValue;
    }
    let val = specialist.modifiers.special[name];
    return val == null ? defaultValue : val;
  }
  _getStarSpecialValue(star, name, defaultValue) {
    if (!star.specialistId) {
      return defaultValue;
    }
    let specialist = this.getByIdStar(star.specialistId);
    if (specialist == null || !specialist.modifiers.special) {
      return defaultValue;
    }
    let val = specialist.modifiers.special[name];
    return val == null ? defaultValue : val;
  }
  getStarCaptureRewardMultiplier(carrier) {
    return this._getCarrierSpecialValue(carrier, "starCaptureRewardMultiplier", 1);
  }
  hasAwardDoubleCaptureRewardSpecialist(carriers) {
    return carriers.map((c) => this.getStarCaptureRewardMultiplier(c)).sort((a, b) => b - a)[0];
  }
  getEconomyInfrastructureMultiplier(star) {
    return this._getStarSpecialValue(star, "economyInfrastructureMultiplier", 1);
  }
  getScienceInfrastructureMultiplier(star) {
    return this._getStarSpecialValue(star, "scienceInfrastructureMultiplier", 1);
  }
  getCreditsPerTickByScience(star) {
    return this._getStarSpecialValue(star, "creditsPerTickByScience", 0);
  }
  getReigniteDeadStar(carrier) {
    return this._getCarrierSpecialValue(carrier, "reigniteDeadStar", false);
  }
  getReigniteDeadStarNaturalResources(carrier) {
    return this._getCarrierSpecialValue(carrier, "reigniteDeadStarNaturalResources", {
      economy: 25,
      industry: 25,
      science: 25
    });
  }
  getStarHideShips(star) {
    return this._getStarSpecialValue(star, "hideShips", false);
  }
  getCarrierHideShips(carrier) {
    return this._getCarrierSpecialValue(carrier, "hideShips", false);
  }
  getStarMovement(star) {
    return this._getStarSpecialValue(star, "moveStar", false);
  }
  getStarMovementPerTick(star) {
    return this._getStarSpecialValue(star, "starMovementPerTick", 0.2);
  }
  getStarAttract(star) {
    return this._getStarSpecialValue(star, "attractStar", false);
  }
  clearExpiredSpecialists(game) {
    const stars = game.galaxy.stars.filter((s) => s.specialistId && s.specialistExpireTick != null && s.specialistExpireTick < game.state.tick);
    for (const star of stars) {
      star.specialistId = null;
      star.specialistExpireTick = null;
    }
    const carriers = game.galaxy.carriers.filter((c) => c.specialistId && c.specialistExpireTick != null && c.specialistExpireTick < game.state.tick);
    for (const carrier of carriers) {
      carrier.specialistId = null;
      carrier.specialistExpireTick = null;
    }
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=specialist.js.map
