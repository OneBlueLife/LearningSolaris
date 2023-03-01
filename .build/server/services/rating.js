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
var rating_exports = {};
__export(rating_exports, {
  default: () => RatingService
});
module.exports = __toCommonJS(rating_exports);
const EloRating = require("elo-rating");
class RatingService {
  constructor(userRepo, gameRepo, userService) {
    this.userRepo = userRepo;
    this.gameRepo = gameRepo;
    this.userService = userService;
  }
  recalculateEloRating(userA, userB, userAIsWinner) {
    let userARating = userA == null ? userB.achievements.eloRating : userA.achievements.eloRating;
    let userBRating = userB == null ? userA.achievements.eloRating : userB.achievements.eloRating;
    let eloResult = EloRating.calculate(
      userARating == null ? 1200 : userARating,
      userBRating == null ? 1200 : userBRating,
      userAIsWinner
    );
    if (userA) {
      userA.achievements.eloRating = eloResult.playerRating;
    }
    if (userB) {
      userB.achievements.eloRating = eloResult.opponentRating;
    }
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=rating.js.map
