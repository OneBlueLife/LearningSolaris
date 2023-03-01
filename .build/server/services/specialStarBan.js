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
var specialStarBan_exports = {};
__export(specialStarBan_exports, {
  default: () => SpecialStarBanService
});
module.exports = __toCommonJS(specialStarBan_exports);
const RNG = require("random-seed");
const moment = require("moment");
const specialStars = require("../config/game/specialStars.json");
class SpecialStarBanService {
  constructor() {
    this.BAN_AMOUNT = 2;
  }
  _getCurrentMonthBans(stars, amount) {
    if (amount <= 0) {
      throw new Error(`Amount cannot be less than or equal to 0.`);
    }
    if (amount >= stars.length) {
      return stars;
    }
    const now = moment().utc();
    const seed = now.format("YYYYMM");
    const rng = RNG.create(seed);
    const bans = [];
    while (bans.length < amount) {
      const i = rng(stars.length);
      const id = stars[i];
      bans.push(id);
      stars.splice(i, 1);
    }
    return bans;
  }
  getCurrentMonthBans() {
    const stars = specialStars.slice();
    const bans = this._getCurrentMonthBans(stars, this.BAN_AMOUNT);
    return {
      specialStar: bans
    };
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=specialStarBan.js.map
