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
var playerCycleRewards_exports = {};
__export(playerCycleRewards_exports, {
  default: () => PlayerCycleRewardsService
});
module.exports = __toCommonJS(playerCycleRewards_exports);
class PlayerCycleRewardsService {
  constructor(starService, technologyService, playerStatisticsService, specialistService) {
    this.starService = starService;
    this.technologyService = technologyService;
    this.playerStatisticsService = playerStatisticsService;
    this.specialistService = specialistService;
  }
  calculatePlayerCreditsEndOfCycleRewards(game, player) {
    let playerStars = this.starService.listStarsOwnedByPlayer(game.galaxy.stars, player._id);
    let totalEco = this.playerStatisticsService.calculateTotalEconomy(playerStars);
    let creditsFromEconomy = totalEco * 10;
    let creditsFromBanking = this._getBankingReward(game, player, playerStars, totalEco);
    let creditsTotal = creditsFromEconomy + creditsFromBanking;
    let creditsFromSpecialistsTechnology = this._getCreditsSpecialistsReward(game, player, playerStars);
    return {
      creditsFromEconomy,
      creditsFromBanking,
      creditsTotal,
      creditsFromSpecialistsTechnology
    };
  }
  givePlayerCreditsEndOfCycleRewards(game, player) {
    let rewards = this.calculatePlayerCreditsEndOfCycleRewards(game, player);
    player.credits += rewards.creditsTotal;
    player.creditsSpecialists += rewards.creditsFromSpecialistsTechnology;
    return rewards;
  }
  _getBankingReward(game, player, playerStars, totalEco) {
    let isBankingEnabled = this.technologyService.isTechnologyEnabled(game, "banking");
    if (!isBankingEnabled || !playerStars.length) {
      return 0;
    }
    let banking = player.research.banking.level;
    let multiplier = game.constants.player.bankingCycleRewardMultiplier;
    switch (game.settings.technology.bankingReward) {
      case "standard":
        return Math.round(banking * multiplier + 0.15 * banking * totalEco);
      case "legacy":
        return banking * multiplier;
    }
    throw new Error(`Unsupported banking reward type: ${game.settings.technology.bankingReward}.`);
  }
  _getCreditsSpecialistsReward(game, player, playerStars) {
    if (!playerStars.length) {
      return 0;
    }
    let isSpecialistsCreditsEnabled = this.technologyService.isTechnologyEnabled(game, "specialists");
    let isCreditsSpecialistsCurrency = game.settings.specialGalaxy.specialistsCurrency === "creditsSpecialists";
    if (!isSpecialistsCreditsEnabled || !isCreditsSpecialistsCurrency) {
      return 0;
    }
    let starCount = playerStars.length;
    let specialists = player.research.specialists.level;
    switch (game.settings.technology.specialistTokenReward) {
      case "standard":
        return specialists;
      case "experimental":
        return Math.ceil(Math.min(starCount * specialists * 0.1, specialists));
    }
    throw new Error(`Unsupported specialist reward type: ${game.settings.technology.specialistTokenReward}.`);
  }
  giveFinancialAnalystCredits(game) {
    for (let player of game.galaxy.players) {
      let playerStars = this.starService.listStarsOwnedByPlayer(game.galaxy.stars, player._id).filter((s) => !this.starService.isDeadStar(s));
      for (let star of playerStars) {
        let creditsByScience = this.specialistService.getCreditsPerTickByScience(star);
        player.credits += creditsByScience * star.infrastructure.science;
      }
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=playerCycleRewards.js.map
