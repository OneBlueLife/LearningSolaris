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
var admin_exports = {};
__export(admin_exports, {
  default: () => AdminService
});
module.exports = __toCommonJS(admin_exports);
const moment = require("moment");
class AdminService {
  constructor(userRepo, gameRepo) {
    this.userRepo = userRepo;
    this.gameRepo = gameRepo;
  }
  async listUsers(isAdmin, limit) {
    let select = isAdmin ? {
      username: 1,
      email: 1,
      credits: 1,
      banned: 1,
      roles: 1,
      emailEnabled: 1,
      lastSeen: 1,
      lastSeenIP: 1,
      isEstablishedPlayer: 1
    } : {
      username: 1,
      isEstablishedPlayer: 1
    };
    return await this.userRepo.find(
      {},
      select,
      {
        lastSeen: -1
      },
      limit
    );
  }
  async listPasswordResets() {
    return await this.userRepo.find({
      resetPasswordToken: { $ne: null }
    }, {
      username: 1,
      email: 1,
      resetPasswordToken: 1
    }, {
      lastSeen: -1
    });
  }
  async listGames(limit) {
    return await this.gameRepo.find(
      {
        "settings.general.type": { $ne: "tutorial" }
      },
      {
        "settings.general": 1,
        "state": 1
      },
      {
        _id: -1
      },
      limit
    );
  }
  async setRoleContributor(userId, enabled = true) {
    await this.userRepo.updateOne({
      _id: userId
    }, {
      "roles.contributor": enabled
    });
  }
  async setRoleDeveloper(userId, enabled = true) {
    await this.userRepo.updateOne({
      _id: userId
    }, {
      "roles.developer": enabled
    });
  }
  async setRoleCommunityManager(userId, enabled = true) {
    await this.userRepo.updateOne({
      _id: userId
    }, {
      "roles.communityManager": enabled
    });
  }
  async setRoleGameMaster(userId, enabled = true) {
    await this.userRepo.updateOne({
      _id: userId
    }, {
      "roles.gameMaster": enabled
    });
  }
  async ban(userId) {
    await this.userRepo.updateOne({
      _id: userId
    }, {
      "banned": true
    });
  }
  async unban(userId) {
    await this.userRepo.updateOne({
      _id: userId
    }, {
      "banned": false
    });
  }
  async resetAchievements(userId) {
    await this.userRepo.updateOne({
      _id: userId
    }, {
      "achievements.victories": 0,
      "achievements.victories1v1": 0,
      "achievements.level": 0,
      "achievements.rank": 0,
      "achievements.eloRating": null,
      "achievements.renown": 0,
      "achievements.joined": 0,
      "achievements.completed": 0,
      "achievements.quit": 0,
      "achievements.defeated": 0,
      "achievements.defeated1v1": 0,
      "achievements.afk": 0,
      "achievements.combat.kills.ships": 0,
      "achievements.combat.kills.carriers": 0,
      "achievements.combat.kills.specialists": 0,
      "achievements.combat.losses.ships": 0,
      "achievements.combat.losses.carriers": 0,
      "achievements.combat.losses.specialists": 0,
      "achievements.combat.stars.captured": 0,
      "achievements.combat.stars.lost": 0,
      "achievements.combat.homeStars.captured": 0,
      "achievements.combat.homeStars.lost": 0,
      "achievements.infrastructure.economy": 0,
      "achievements.infrastructure.industry": 0,
      "achievements.infrastructure.science": 0,
      "achievements.infrastructure.warpGates": 0,
      "achievements.infrastructure.warpGatesDestroyed": 0,
      "achievements.infrastructure.carriers": 0,
      "achievements.infrastructure.specialistsHired": 0,
      "achievements.research.scanning": 0,
      "achievements.research.hyperspace": 0,
      "achievements.research.terraforming": 0,
      "achievements.research.experimentation": 0,
      "achievements.research.weapons": 0,
      "achievements.research.banking": 0,
      "achievements.research.manufacturing": 0,
      "achievements.research.specialists": 0,
      "achievements.trade.creditsSent": 0,
      "achievements.trade.creditsReceived": 0,
      "achievements.trade.creditsSpecialistsSent": 0,
      "achievements.trade.creditsSpecialistsReceived": 0,
      "achievements.trade.technologySent": 0,
      "achievements.trade.technologyReceived": 0,
      "achievements.trade.giftsSent": 0,
      "achievements.trade.giftsReceived": 0,
      "achievements.trade.renownSent": 0
    });
  }
  async promoteToEstablishedPlayer(userId) {
    await this.userRepo.updateOne({
      _id: userId
    }, {
      $set: {
        isEstablishedPlayer: true
      }
    });
  }
  async setGameFeatured(gameId, featured) {
    await this.gameRepo.updateOne({
      _id: gameId
    }, {
      "settings.general.featured": featured
    });
  }
  async setGameTimeMachine(gameId, enabled) {
    await this.gameRepo.updateOne({
      _id: gameId
    }, {
      "settings.general.timeMachine": enabled
    });
  }
  async getInsights() {
    const oneDayAgo = moment().utc().add(-1, "days").toDate();
    const twoDaysAgo = moment().utc().add(-2, "days").toDate();
    const oneWeekAgo = moment().utc().add(-7, "days").toDate();
    const twoWeeksAgo = moment().utc().add(-14, "days").toDate();
    const oneDayAgoId = this.userRepo.objectIdFromDate(oneDayAgo);
    const twoDaysAgoId = this.userRepo.objectIdFromDate(twoDaysAgo);
    const oneWeekAgoId = this.userRepo.objectIdFromDate(oneWeekAgo);
    const twoWeeksAgoId = this.userRepo.objectIdFromDate(twoWeeksAgo);
    const registrations1d = await this.userRepo.count({
      _id: { $gt: oneDayAgoId }
    });
    const registrations2d = await this.userRepo.count({
      _id: { $gt: twoDaysAgoId }
    });
    const registrations7d = await this.userRepo.count({
      _id: { $gt: oneWeekAgoId }
    });
    const registrations14d = await this.userRepo.count({
      _id: { $gt: twoWeeksAgoId }
    });
    const lastSeen1d = await this.userRepo.count({
      lastSeen: { $gt: oneDayAgo }
    });
    const lastSeen2d = await this.userRepo.count({
      lastSeen: { $gt: twoDaysAgo }
    });
    const lastSeen7d = await this.userRepo.count({
      lastSeen: { $gt: oneWeekAgo }
    });
    const lastSeen14d = await this.userRepo.count({
      lastSeen: { $gt: twoWeeksAgo }
    });
    return [
      {
        name: "Registrations",
        d1: registrations1d,
        d2: registrations2d,
        d7: registrations7d,
        d14: registrations14d
      },
      {
        name: "Last Seen",
        d1: lastSeen1d,
        d2: lastSeen2d,
        d7: lastSeen7d,
        d14: lastSeen14d
      }
    ];
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=admin.js.map
