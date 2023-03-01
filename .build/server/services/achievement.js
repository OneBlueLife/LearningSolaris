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
var achievement_exports = {};
__export(achievement_exports, {
  default: () => AchievementService
});
module.exports = __toCommonJS(achievement_exports);
class AchievementService {
  constructor(userRepo, guildService, userLevelService) {
    this.userRepo = userRepo;
    this.guildService = guildService;
    this.userLevelService = userLevelService;
  }
  async getAchievements(id) {
    const user = await this.userRepo.findById(id, {
      achievements: 1,
      guildId: 1,
      username: 1,
      "roles.contributor": 1,
      "roles.developer": 1,
      "roles.communityManager": 1,
      "roles.gameMaster": 1
    });
    if (user) {
      user.level = this.userLevelService.getByRankPoints(user.achievements.rank);
    }
    if (user && user.guildId) {
      return {
        ...user,
        guild: await this.guildService.getInfoById(user.guildId)
      };
    }
    return user;
  }
  async incrementAchievement(userId, achievement, amount = 1) {
    let updateQuery = {
      $inc: {}
    };
    updateQuery.$inc[achievement] = amount;
    await this.userRepo.updateOne({
      _id: userId
    }, updateQuery);
  }
  async incrementSpecialistsHired(userId, amount = 1) {
    return await this.incrementAchievement(userId, "achievements.infrastructure.specialistsHired", amount);
  }
  async incrementWarpGatesBuilt(userId, amount = 1) {
    return await this.incrementAchievement(userId, "achievements.infrastructure.warpGates", amount);
  }
  async incrementWarpGatesDestroyed(userId, amount = 1) {
    return await this.incrementAchievement(userId, "achievements.infrastructure.warpGatesDestroyed", amount);
  }
  async incrementCarriersBuilt(userId, amount = 1) {
    return await this.incrementAchievement(userId, "achievements.infrastructure.carriers", amount);
  }
  async incrementInfrastructureBuilt(type, userId, amount = 1) {
    switch (type) {
      case "economy":
        await this.incrementEconomyBuilt(userId, amount);
        break;
      case "industry":
        await this.incrementIndustryBuilt(userId, amount);
        break;
      case "science":
        await this.incrementScienceBuilt(userId, amount);
        break;
    }
  }
  async incrementEconomyBuilt(userId, amount = 1) {
    return await this.incrementAchievement(userId, "achievements.infrastructure.economy", amount);
  }
  async incrementIndustryBuilt(userId, amount = 1) {
    return await this.incrementAchievement(userId, "achievements.infrastructure.industry", amount);
  }
  async incrementScienceBuilt(userId, amount = 1) {
    return await this.incrementAchievement(userId, "achievements.infrastructure.science", amount);
  }
  async incrementTradeCreditsSent(userId, amount = 0) {
    return await this.incrementAchievement(userId, "achievements.trade.creditsSent", amount);
  }
  async incrementTradeCreditsReceived(userId, amount = 0) {
    return await this.incrementAchievement(userId, "achievements.trade.creditsReceived", amount);
  }
  async incrementTradeCreditsSpecialistsSent(userId, amount = 0) {
    return await this.incrementAchievement(userId, "achievements.trade.creditsSpecialistsSent", amount);
  }
  async incrementTradeCreditsSpecialistsReceived(userId, amount = 0) {
    return await this.incrementAchievement(userId, "achievements.trade.creditsSpecialistsReceived", amount);
  }
  async incrementTradeTechnologySent(userId, amount = 1) {
    return await this.incrementAchievement(userId, "achievements.trade.technologySent", amount);
  }
  async incrementTradeTechnologyReceived(userId, amount = 1) {
    return await this.incrementAchievement(userId, "achievements.trade.technologyReceived", amount);
  }
  async incrementRenownSent(userId, amount = 1) {
    return await this.incrementAchievement(userId, "achievements.trade.renownSent", amount);
  }
  async incrementRenownReceived(userId, amount = 1) {
    return await this.incrementAchievement(userId, "achievements.renown", amount);
  }
  async incrementDefeated(userId, amount = 1) {
    return await this.incrementAchievement(userId, "achievements.defeated", amount);
  }
  async incrementJoined(userId, amount = 1) {
    return await this.incrementAchievement(userId, "achievements.joined", amount);
  }
  async incrementQuit(userId, amount = 1) {
    return await this.incrementAchievement(userId, "achievements.quit", amount);
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=achievement.js.map
