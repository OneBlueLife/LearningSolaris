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
var playerCredits_exports = {};
__export(playerCredits_exports, {
  default: () => PlayerCreditsService
});
module.exports = __toCommonJS(playerCredits_exports);
class PlayerCreditsService {
  constructor(gameRepo) {
    this.gameRepo = gameRepo;
  }
  async addCredits(game, player, amount, commit = true) {
    player.credits += amount;
    let query = {
      updateOne: {
        filter: {
          _id: game._id,
          "galaxy.players._id": player._id
        },
        update: {
          $inc: {
            "galaxy.players.$.credits": amount
          }
        }
      }
    };
    if (commit) {
      await this.gameRepo.bulkWrite([query]);
    }
    return query;
  }
  async addCreditsSpecialists(game, player, amount, commit = true) {
    player.creditsSpecialists += amount;
    let query = {
      updateOne: {
        filter: {
          _id: game._id,
          "galaxy.players._id": player._id
        },
        update: {
          $inc: {
            "galaxy.players.$.creditsSpecialists": amount
          }
        }
      }
    };
    if (commit) {
      await this.gameRepo.bulkWrite([query]);
    }
    return query;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=playerCredits.js.map
