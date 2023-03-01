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
var userLevel_exports = {};
__export(userLevel_exports, {
  default: () => UserLevelService
});
module.exports = __toCommonJS(userLevel_exports);
const ranks = require("../config/game/levels.json");
class UserLevelService {
  getByRankPoints(rankPoints) {
    const sortedRanks = ranks.sort((a, b) => a.rankPoints - b.rankPoints);
    for (let i = sortedRanks.length - 1; i > 0; i--) {
      let rank = sortedRanks[i];
      if (rankPoints >= rank.rankPoints) {
        let next = sortedRanks[i + 1] || null;
        let rankPointsNext = (next == null ? void 0 : next.rankPoints) || null;
        let rankPointsProgress = null;
        if (rankPointsNext != null) {
          rankPointsProgress = rankPointsNext - rankPoints - rank.rankPoints;
        }
        return {
          ...rank,
          rankPointsNext,
          rankPointsProgress
        };
      }
    }
    return sortedRanks[0];
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=userLevel.js.map
