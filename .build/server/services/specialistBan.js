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
var specialistBan_exports = {};
__export(specialistBan_exports, {
  default: () => SpecialistBanService
});
module.exports = __toCommonJS(specialistBan_exports);
const RNG = require("random-seed");
const moment = require("moment");
class SpecialistBanService {
  constructor(specialistService) {
    this.specialistService = specialistService;
  }
  isStarSpecialistBanned(game, specialistId) {
    return game.settings.specialGalaxy.specialistBans.star.indexOf(specialistId) > -1;
  }
  isCarrierSpecialistBanned(game, specialistId) {
    return game.settings.specialGalaxy.specialistBans.carrier.indexOf(specialistId) > -1;
  }
  _getCurrentMonthBans(specialistIds, amount) {
    if (amount <= 0) {
      throw new Error(`Amount cannot be less than or equal to 0.`);
    }
    if (amount >= specialistIds.length) {
      return specialistIds;
    }
    const now = moment().utc();
    const seed = now.format("YYYYMM");
    const rng = RNG.create(seed);
    const bans = [];
    while (bans.length < amount) {
      const i = rng(specialistIds.length);
      const id = specialistIds[i];
      bans.push(id);
      specialistIds.splice(i, 1);
    }
    return bans;
  }
  getCurrentMonthStarBans(amount) {
    const specs = this.specialistService.listStar(null).filter((s) => s.active.official);
    const ids = specs.map((s) => s.id);
    const bans = this._getCurrentMonthBans(ids, amount);
    return specs.filter((s) => bans.includes(s.id));
  }
  getCurrentMonthCarrierBans(amount) {
    const specs = this.specialistService.listCarrier(null).filter((s) => s.active.official);
    const ids = specs.map((s) => s.id);
    const bans = this._getCurrentMonthBans(ids, amount);
    return specs.filter((s) => bans.includes(s.id));
  }
  getCurrentMonthBans(amount) {
    const carrierBans = this.getCurrentMonthCarrierBans(amount);
    const starBans = this.getCurrentMonthStarBans(amount);
    return {
      carrier: carrierBans,
      star: starBans
    };
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=specialistBan.js.map
