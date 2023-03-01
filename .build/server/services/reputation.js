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
var reputation_exports = {};
__export(reputation_exports, {
  default: () => ReputationService
});
module.exports = __toCommonJS(reputation_exports);
const EventEmitter = require("events");
const MAX_REPUTATION = 8;
const MIN_REPUTATION = -8;
const REPUTATION_INCREMENT = 1;
const ALLY_REPUTATION_THRESHOLD = 5;
const ENEMY_REPUTATION_THRESHOLD = -1;
class ReputationService extends EventEmitter {
  constructor(gameRepo, playerStatisticsService, diplomacyService, playerAfkService) {
    super();
    this.gameRepo = gameRepo;
    this.playerStatisticsService = playerStatisticsService;
    this.diplomacyService = diplomacyService;
    this.playerAfkService = playerAfkService;
  }
  getReputation(fromPlayer, toPlayer) {
    let rep = null;
    if (fromPlayer.reputations) {
      rep = fromPlayer.reputations.find((r) => r.playerId.toString() === toPlayer._id.toString());
    }
    let isNew = false;
    if (!rep) {
      rep = {
        playerId: toPlayer._id,
        score: 0
      };
      if (!fromPlayer.reputations) {
        fromPlayer.reputations = [];
      }
      fromPlayer.reputations.push(rep);
      isNew = true;
    }
    rep = fromPlayer.reputations.find((r) => r.playerId.toString() === toPlayer._id.toString());
    return {
      reputation: rep,
      isNew
    };
  }
  async increaseReputation(game, fromPlayer, toPlayer, amount = 1, updateDatabase) {
    let rep = this.getReputation(fromPlayer, toPlayer);
    if (rep.reputation.score < MAX_REPUTATION) {
      rep.reputation.score += amount;
      rep.reputation.score = Math.min(MAX_REPUTATION, rep.reputation.score);
    }
    if (updateDatabase) {
      await this._updateReputation(game, fromPlayer, toPlayer, rep.reputation, rep.isNew);
    }
    if (this.playerAfkService.isAIControlled(game, fromPlayer, true)) {
      await this.recalculateDiplomaticStatus(game, fromPlayer, toPlayer, rep.reputation, updateDatabase);
    }
    return rep;
  }
  async decreaseReputation(game, fromPlayer, toPlayer, updateDatabase) {
    let rep = this.getReputation(fromPlayer, toPlayer);
    if (rep.reputation.score > MIN_REPUTATION) {
      if (rep.reputation.score > 0) {
        rep.reputation.score = 0;
      } else {
        rep.reputation.score -= REPUTATION_INCREMENT;
        rep.reputation.score = Math.max(MIN_REPUTATION, rep.reputation.score);
      }
    }
    if (updateDatabase) {
      await this._updateReputation(game, fromPlayer, toPlayer, rep.reputation, rep.isNew);
    }
    if (this.playerAfkService.isAIControlled(game, fromPlayer, true)) {
      await this.recalculateDiplomaticStatus(game, fromPlayer, toPlayer, rep.reputation, updateDatabase);
    } else if (this.diplomacyService.isFormalAlliancesEnabled(game) && this.diplomacyService.getDiplomaticStatusToPlayer(game, fromPlayer._id, toPlayer._id).actualStatus === "neutral") {
      this.diplomacyService.declareEnemy(game, fromPlayer._id, toPlayer._id, false);
    }
    return rep;
  }
  async _updateReputation(game, fromPlayer, toPlayer, reputation, isNew) {
    if (isNew) {
      return await this.gameRepo.updateOne({
        _id: game._id,
        "galaxy.players._id": fromPlayer._id
      }, {
        $addToSet: {
          "galaxy.players.$.reputations": reputation
        }
      });
    } else {
      return await this.gameRepo.updateOne({
        _id: game._id
      }, {
        $set: {
          "galaxy.players.$[p].reputations.$[r].score": reputation.score
        }
      }, {
        arrayFilters: [
          {
            "p._id": fromPlayer._id
          },
          {
            "r.playerId": reputation.playerId
          }
        ]
      });
    }
  }
  async tryIncreaseReputationCredits(game, fromPlayer, toPlayer, amount) {
    let playerStats = this.playerStatisticsService.getStats(game, toPlayer);
    let creditsRequired = playerStats.totalEconomy * 10 / 2;
    let increased = amount >= creditsRequired;
    if (increased) {
      await this.increaseReputation(game, fromPlayer, toPlayer, REPUTATION_INCREMENT, true);
    }
    return {
      increased,
      rep: this.getReputation(fromPlayer, toPlayer)
    };
  }
  async tryIncreaseReputationCreditsSpecialists(game, fromPlayer, toPlayer, amount) {
    let creditsRequired = Math.round(toPlayer.research.specialists.level / 2);
    let increased = amount >= creditsRequired;
    if (increased) {
      await this.increaseReputation(game, fromPlayer, toPlayer, REPUTATION_INCREMENT, true);
    }
    return {
      increased,
      rep: this.getReputation(fromPlayer, toPlayer)
    };
  }
  async tryIncreaseReputationTechnology(game, fromPlayer, toPlayer, technology) {
    await this.increaseReputation(game, fromPlayer, toPlayer, technology.difference, true);
    return {
      increased: true,
      rep: this.getReputation(fromPlayer, toPlayer)
    };
  }
  async recalculateDiplomaticStatus(game, fromPlayer, toPlayer, reputation, updateDatabase) {
    if (!this.playerAfkService.isAIControlled(game, fromPlayer, true)) {
      throw new Error(`Automatic diplomatic statuses are reserved for AI players only.`);
    }
    const isFormalAlliancesEnabled = this.diplomacyService.isFormalAlliancesEnabled(game);
    if (!isFormalAlliancesEnabled) {
      return;
    }
    const status = this.diplomacyService.getDiplomaticStatusToPlayer(game, fromPlayer._id, toPlayer._id);
    if (reputation.score >= ALLY_REPUTATION_THRESHOLD && status.statusTo !== "allies") {
      this.diplomacyService.declareAlly(game, fromPlayer._id, toPlayer._id, updateDatabase);
    } else if (reputation.score <= ENEMY_REPUTATION_THRESHOLD && status.statusTo !== "enemies") {
      this.diplomacyService.declareEnemy(game, fromPlayer._id, toPlayer._id, updateDatabase);
    } else if (reputation.score > ENEMY_REPUTATION_THRESHOLD && reputation.score < ALLY_REPUTATION_THRESHOLD && status.statusTo !== "neutral") {
      this.diplomacyService.declareNeutral(game, fromPlayer._id, toPlayer._id, updateDatabase);
    }
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=reputation.js.map
