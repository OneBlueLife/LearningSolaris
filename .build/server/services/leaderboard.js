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
var leaderboard_exports = {};
__export(leaderboard_exports, {
  default: () => LeaderboardService
});
module.exports = __toCommonJS(leaderboard_exports);
const moment = require("moment");
const _LeaderboardService = class {
  constructor(userRepo, userService, playerService, playerAfkService, userLevelService, guildUserService, ratingService, gameService, gameTypeService, gameStateService, badgeService, playerStatisticsService) {
    this.userRepo = userRepo;
    this.userService = userService;
    this.playerService = playerService;
    this.playerAfkService = playerAfkService;
    this.userLevelService = userLevelService;
    this.guildUserService = guildUserService;
    this.ratingService = ratingService;
    this.gameService = gameService;
    this.gameTypeService = gameTypeService;
    this.gameStateService = gameStateService;
    this.badgeService = badgeService;
    this.playerStatisticsService = playerStatisticsService;
  }
  async getUserLeaderboard(limit, sortingKey, skip = 0) {
    var _a;
    const sorter = _LeaderboardService.GLOBALSORTERS[sortingKey] || _LeaderboardService.GLOBALSORTERS["rank"];
    let leaderboard = await this.userRepo.find(
      sorter.query || {},
      sorter.select,
      sorter.sort,
      limit,
      skip
    );
    let userIds = leaderboard.map((x) => x._id);
    let guildUsers = await this.guildUserService.listUsersWithGuildTags(userIds);
    let guildUserPositions = [];
    for (let i = 0; i < leaderboard.length; i++) {
      let user = leaderboard[i];
      let position = i + 1;
      let guild = ((_a = guildUsers.find((x) => x._id.toString() === user._id.toString())) == null ? void 0 : _a.guild) || null;
      guildUserPositions.push({
        ...user,
        position,
        guild
      });
    }
    let totalPlayers = await this.userRepo.countAll();
    return {
      totalPlayers,
      leaderboard: guildUserPositions,
      sorter
    };
  }
  getGameLeaderboard(game, sortingKey) {
    let SORTERS = _LeaderboardService.LOCALSORTERS;
    let kingOfTheHillPlayer = null;
    if (this.gameTypeService.isKingOfTheHillMode(game)) {
      kingOfTheHillPlayer = this.playerService.getKingOfTheHillPlayer(game);
    }
    let playerStats = game.galaxy.players.map((p) => {
      let isKingOfTheHill = kingOfTheHillPlayer != null && p._id.toString() === kingOfTheHillPlayer._id.toString();
      let stats = p.stats ?? this.playerStatisticsService.getStats(game, p);
      return {
        player: p,
        isKingOfTheHill,
        stats
      };
    });
    const getNestedObject = (nestedObj, pathArr) => {
      return pathArr.reduce((obj, key) => obj && obj[key] !== "undefined" ? obj[key] : -1, nestedObj);
    };
    function sortPlayers(a, b) {
      if (sortingKey) {
        if (getNestedObject(a, SORTERS[sortingKey].split(".")) > getNestedObject(b, SORTERS[sortingKey].split(".")))
          return -1;
        if (getNestedObject(a, SORTERS[sortingKey].split(".")) < getNestedObject(b, SORTERS[sortingKey].split(".")))
          return 1;
      }
      const isHomeStarVictory = game.settings.general.mode === "conquest" && game.settings.conquest.victoryCondition === "homeStarPercentage";
      if (isHomeStarVictory) {
        if (a.stats.totalHomeStars > b.stats.totalHomeStars)
          return -1;
        if (a.stats.totalHomeStars < b.stats.totalHomeStars)
          return 1;
      }
      if (game.settings.general.mode === "kingOfTheHill" && a.isKingOfTheHill !== b.isKingOfTheHill) {
        if (a.isKingOfTheHill)
          return -1;
        if (b.isKingOfTheHill)
          return 1;
      }
      if (a.stats.totalStars > b.stats.totalStars)
        return -1;
      if (a.stats.totalStars < b.stats.totalStars)
        return 1;
      if (a.stats.totalShips > b.stats.totalShips)
        return -1;
      if (a.stats.totalShips < b.stats.totalShips)
        return 1;
      if (a.stats.totalCarriers > b.stats.totalCarriers)
        return -1;
      if (a.stats.totalCarriers < b.stats.totalCarriers)
        return 1;
      if (a.player.defeated && b.player.defeated) {
        if (moment(a.player.defeatedDate) > moment(b.player.defeatedDate))
          return -1;
        if (moment(a.player.defeatedDate) < moment(b.player.defeatedDate))
          return 1;
      }
      return a.player.defeated === b.player.defeated ? 0 : a.player.defeated ? 1 : -1;
    }
    let undefeatedLeaderboard = playerStats.filter((x) => !x.player.defeated).sort(sortPlayers);
    let defeatedLeaderboard = playerStats.filter((x) => x.player.defeated).sort(sortPlayers);
    let leaderboard = undefeatedLeaderboard.concat(defeatedLeaderboard);
    return {
      leaderboard,
      fullKey: sortingKey ? SORTERS[sortingKey] : null
    };
  }
  getGameLeaderboardPosition(game, player) {
    if (game.state.leaderboard == null) {
      return null;
    }
    return game.state.leaderboard.findIndex((l) => l.toString() === player._id.toString()) + 1;
  }
  addGameRankings(game, gameUsers, leaderboard) {
    let result = {
      ranks: [],
      eloRating: null
    };
    let leaderboardPlayers = leaderboard.map((x) => x.player);
    for (let i = 0; i < leaderboardPlayers.length; i++) {
      let player = leaderboardPlayers[i];
      let user = gameUsers.find((u) => player.userId && u._id.toString() === player.userId.toString());
      if (!user) {
        continue;
      }
      let rankIncrease = 0;
      if (i == 0) {
        rankIncrease = leaderboard.length;
      } else if (game.settings.general.awardRankTo === "all") {
        rankIncrease = Math.round(leaderboard.length / 2 - i);
      }
      if (player.afk) {
        rankIncrease = Math.min(rankIncrease, -1);
      } else if (player.hasFilledAfkSlot) {
        rankIncrease = Math.max(Math.round(rankIncrease * 1.5), 0);
      }
      if (rankIncrease > 0 && this.gameTypeService.isSpecialGameMode(game)) {
        rankIncrease *= 2;
      }
      rankIncrease *= game.constants.player.rankRewardMultiplier;
      let currentRank = user.achievements.rank;
      let newRank = Math.max(user.achievements.rank + rankIncrease, 0);
      user.achievements.rank = newRank;
      user.achievements.level = this.userLevelService.getByRankPoints(newRank).id;
      result.ranks.push({
        playerId: player._id,
        current: currentRank,
        new: newRank
      });
    }
    result.eloRating = this.addUserRatingCheck(game, gameUsers);
    return result;
  }
  incrementGameWinnerAchievements(game, gameUsers, winner, awardCredits) {
    let user = gameUsers.find((u) => winner.userId && u._id.toString() === winner.userId.toString());
    if (!user) {
      return;
    }
    user.achievements.victories++;
    if (this.gameTypeService.is32PlayerGame(game)) {
      this.badgeService.awardBadgeForUserVictor32PlayerGame(user);
    }
    if (this.gameTypeService.isSpecialGameMode(game)) {
      this.badgeService.awardBadgeForUserVictorySpecialGame(user, game);
    }
    if (!this.gameTypeService.is1v1Game(game) && awardCredits) {
      user.credits++;
    }
  }
  addUserRatingCheck(game, gameUsers) {
    if (!this.gameTypeService.is1v1Game(game)) {
      return null;
    }
    let winningPlayer = game.galaxy.players.find((p) => p._id.toString() === game.state.winner.toString());
    let losingPlayer = game.galaxy.players.find((p) => p._id.toString() !== game.state.winner.toString());
    let winningUser = gameUsers.find((u) => winningPlayer.userId && u._id.toString() === winningPlayer.userId.toString());
    let losingUser = gameUsers.find((u) => losingPlayer.userId && u._id.toString() === losingPlayer.userId.toString());
    let winningUserOldRating = 1200;
    let losingUserOldRating = 1200;
    if (winningUser) {
      winningUserOldRating = winningUser.achievements.eloRating || 1200;
      winningUser.achievements.victories1v1++;
    }
    if (losingUser) {
      losingUserOldRating = losingUser.achievements.eloRating || 1200;
      losingUser.achievements.defeated1v1++;
    }
    this.ratingService.recalculateEloRating(winningUser, losingUser, true);
    return {
      winner: {
        _id: winningPlayer._id,
        newRating: winningUser ? winningUser.achievements.eloRating : 1200,
        oldRating: winningUserOldRating
      },
      loser: {
        _id: losingPlayer._id,
        newRating: losingUser ? losingUser.achievements.eloRating : 1200,
        oldRating: losingUserOldRating
      }
    };
  }
  getGameWinner(game, leaderboard) {
    let isKingOfTheHillMode = this.gameTypeService.isKingOfTheHillMode(game);
    let isAllUndefeatedPlayersReadyToQuit = this.gameService.isAllUndefeatedPlayersReadyToQuit(game);
    if (isAllUndefeatedPlayersReadyToQuit) {
      if (isKingOfTheHillMode) {
        return this.playerService.getKingOfTheHillPlayer(game) || this.getFirstPlacePlayer(leaderboard);
      }
      return this.getFirstPlacePlayer(leaderboard);
    }
    if (this.gameTypeService.isConquestMode(game)) {
      let starWinner = this.getStarCountWinner(game, leaderboard);
      if (starWinner) {
        return starWinner;
      }
    }
    if (this.gameStateService.isCountingDownToEnd(game) && this.gameStateService.hasReachedCountdownEnd(game)) {
      if (isKingOfTheHillMode) {
        return this.playerService.getKingOfTheHillPlayer(game) || this.getFirstPlacePlayer(leaderboard);
      }
      return this.getFirstPlacePlayer(leaderboard);
    }
    let lastManStanding = this.getLastManStanding(game, leaderboard);
    if (lastManStanding) {
      return lastManStanding;
    }
    return null;
  }
  getStarCountWinner(game, leaderboard) {
    let totalStarsKey = this.gameTypeService.isConquestMode(game) && game.settings.conquest.victoryCondition === "homeStarPercentage" ? "totalHomeStars" : "totalStars";
    let starWinners = leaderboard.filter((p) => p.stats[totalStarsKey] >= game.state.starsForVictory);
    if (starWinners.length) {
      return leaderboard.filter((p) => !p.player.defeated).map((p) => p.player)[0];
    }
    return null;
  }
  getLastManStanding(game, leaderboard) {
    let undefeatedPlayers = game.galaxy.players.filter((p) => !p.defeated);
    if (undefeatedPlayers.length === 1) {
      return undefeatedPlayers[0];
    }
    let defeatedPlayers = game.galaxy.players.filter((p) => p.defeated);
    if (defeatedPlayers.length === game.settings.general.playerLimit) {
      return this.getFirstPlacePlayer(leaderboard);
    }
    let undefeatedAI = undefeatedPlayers.filter((p) => this.playerAfkService.isAIControlled(game, p, false));
    if (undefeatedAI.length === undefeatedPlayers.length) {
      return this.getFirstPlacePlayer(leaderboard);
    }
    return null;
  }
  getFirstPlacePlayer(leaderboard) {
    return leaderboard[0].player;
  }
  markNonAFKPlayersAsEstablishedPlayers(game, gameUsers) {
    for (let player of game.galaxy.players) {
      let user = gameUsers.find((u) => player.userId && u._id.toString() === player.userId.toString());
      if (!user) {
        continue;
      }
      if (!player.afk) {
        user.isEstablishedPlayer = true;
      }
    }
  }
  incrementPlayersCompletedAchievement(game, gameUsers) {
    for (let player of game.galaxy.players.filter((p) => !p.defeated && !p.afk)) {
      let user = gameUsers.find((u) => player.userId && u._id.toString() === player.userId.toString());
      if (!user) {
        continue;
      }
      user.achievements.completed++;
    }
  }
};
let LeaderboardService = _LeaderboardService;
LeaderboardService.GLOBALSORTERS = {
  rank: {
    fullKey: "achievements.rank",
    sort: {
      "achievements.rank": -1,
      "achievements.victories": -1,
      "achievements.renown": -1
    },
    select: {
      username: 1,
      guildId: 1,
      "roles.contributor": 1,
      "roles.developer": 1,
      "roles.communityManager": 1,
      "roles.gameMaster": 1,
      "achievements.level": 1,
      "achievements.rank": 1,
      "achievements.victories": 1,
      "achievements.renown": 1,
      "achievements.eloRating": 1
    }
  },
  victories: {
    fullKey: "achievements.victories",
    sort: {
      "achievements.victories": -1,
      "achievements.rank": -1,
      "achievements.renown": -1
    },
    select: {
      username: 1,
      guildId: 1,
      "roles.contributor": 1,
      "roles.developer": 1,
      "roles.communityManager": 1,
      "roles.gameMaster": 1,
      "achievements.level": 1,
      "achievements.rank": 1,
      "achievements.victories": 1,
      "achievements.renown": 1,
      "achievements.eloRating": 1
    }
  },
  renown: {
    fullKey: "achievements.renown",
    sort: {
      "achievements.renown": -1,
      "achievements.rank": -1,
      "achievements.victories": -1
    },
    select: {
      username: 1,
      guildId: 1,
      "roles.contributor": 1,
      "roles.developer": 1,
      "roles.communityManager": 1,
      "roles.gameMaster": 1,
      "achievements.level": 1,
      "achievements.rank": 1,
      "achievements.victories": 1,
      "achievements.renown": 1,
      "achievements.eloRating": 1
    }
  },
  joined: {
    fullKey: "achievements.joined",
    sort: {
      "achievements.joined": -1
    },
    select: {
      username: 1,
      "achievements.joined": 1
    }
  },
  completed: {
    fullKey: "achievements.completed",
    sort: {
      "achievements.completed": -1
    },
    select: {
      username: 1,
      "achievements.completed": 1
    }
  },
  quit: {
    fullKey: "achievements.quit",
    sort: {
      "achievements.quit": -1
    },
    select: {
      username: 1,
      "achievements.quit": 1
    }
  },
  defeated: {
    fullKey: "achievements.defeated",
    sort: {
      "achievements.defeated": -1
    },
    select: {
      username: 1,
      "achievements.defeated": 1
    }
  },
  afk: {
    fullKey: "achievements.afk",
    sort: {
      "achievements.afk": -1
    },
    select: {
      username: 1,
      "achievements.afk": 1
    }
  },
  "ships-killed": {
    fullKey: "achievements.combat.kills.ships",
    sort: {
      "achievements.combat.kills.ships": -1
    },
    select: {
      username: 1,
      "achievements.combat.kills.ships": 1
    }
  },
  "carriers-killed": {
    fullKey: "achievements.combat.kills.carriers",
    sort: {
      "achievements.combat.kills.carriers": -1
    },
    select: {
      username: 1,
      "achievements.combat.kills.carriers": 1
    }
  },
  "specialists-killed": {
    fullKey: "achievements.combat.kills.specialists",
    sort: {
      "achievements.combat.kills.specialists": -1
    },
    select: {
      username: 1,
      "achievements.combat.kills.specialists": 1
    }
  },
  "ships-lost": {
    fullKey: "achievements.combat.losses.ships",
    sort: {
      "achievements.combat.losses.ships": -1
    },
    select: {
      username: 1,
      "achievements.combat.losses.ships": 1
    }
  },
  "carriers-lost": {
    fullKey: "achievements.combat.losses.carriers",
    sort: {
      "achievements.combat.losses.carriers": -1
    },
    select: {
      username: 1,
      "achievements.combat.losses.carriers": 1
    }
  },
  "specialists-lost": {
    fullKey: "achievements.combat.losses.specialists",
    sort: {
      "achievements.combat.losses.specialists": -1
    },
    select: {
      username: 1,
      "achievements.combat.losses.specialists": 1
    }
  },
  "stars-captured": {
    fullKey: "achievements.combat.stars.captured",
    sort: {
      "achievements.combat.stars.captured": -1
    },
    select: {
      username: 1,
      "achievements.combat.stars.captured": 1
    }
  },
  "stars-lost": {
    fullKey: "achievements.combat.stars.lost",
    sort: {
      "achievements.combat.stars.lost": -1
    },
    select: {
      username: 1,
      "achievements.combat.stars.lost": 1
    }
  },
  "home-stars-captured": {
    fullKey: "achievements.combat.homeStars.captured",
    sort: {
      "achievements.combat.homeStars.captured": -1
    },
    select: {
      username: 1,
      "achievements.combat.homeStars.captured": 1
    }
  },
  "home-stars-lost": {
    fullKey: "achievements.combat.homeStars.lost",
    sort: {
      "achievements.combat.homeStars.lost": -1
    },
    select: {
      username: 1,
      "achievements.combat.homeStars.lost": 1
    }
  },
  "economy": {
    fullKey: "achievements.infrastructure.economy",
    sort: {
      "achievements.infrastructure.economy": -1
    },
    select: {
      username: 1,
      "achievements.infrastructure.economy": 1
    }
  },
  "industry": {
    fullKey: "achievements.infrastructure.industry",
    sort: {
      "achievements.infrastructure.industry": -1
    },
    select: {
      username: 1,
      "achievements.infrastructure.industry": 1
    }
  },
  "science": {
    fullKey: "achievements.infrastructure.science",
    sort: {
      "achievements.infrastructure.science": -1
    },
    select: {
      username: 1,
      "achievements.infrastructure.science": 1
    }
  },
  "warpgates-built": {
    fullKey: "achievements.infrastructure.warpGates",
    sort: {
      "achievements.infrastructure.warpGates": -1
    },
    select: {
      username: 1,
      "achievements.infrastructure.warpGates": 1
    }
  },
  "warpgates-destroyed": {
    fullKey: "achievements.infrastructure.warpGatesDestroyed",
    sort: {
      "achievements.infrastructure.warpGatesDestroyed": -1
    },
    select: {
      username: 1,
      "achievements.infrastructure.warpGatesDestroyed": 1
    }
  },
  "carriers-built": {
    fullKey: "achievements.infrastructure.carriers",
    sort: {
      "achievements.infrastructure.carriers": -1
    },
    select: {
      username: 1,
      "achievements.infrastructure.carriers": 1
    }
  },
  "specialists-hired": {
    fullKey: "achievements.infrastructure.specialistsHired",
    sort: {
      "achievements.infrastructure.specialistsHired": -1
    },
    select: {
      username: 1,
      "achievements.infrastructure.specialistsHired": 1
    }
  },
  "scanning": {
    fullKey: "achievements.research.scanning",
    sort: {
      "achievements.research.scanning": -1
    },
    select: {
      username: 1,
      "achievements.research.scanning": 1
    }
  },
  "hyperspace": {
    fullKey: "achievements.research.hyperspace",
    sort: {
      "achievements.research.hyperspace": -1
    },
    select: {
      username: 1,
      "achievements.research.hyperspace": 1
    }
  },
  "terraforming": {
    fullKey: "achievements.research.terraforming",
    sort: {
      "achievements.research.terraforming": -1
    },
    select: {
      username: 1,
      "achievements.research.terraforming": 1
    }
  },
  "experimentation": {
    fullKey: "achievements.research.experimentation",
    sort: {
      "achievements.research.experimentation": -1
    },
    select: {
      username: 1,
      "achievements.research.experimentation": 1
    }
  },
  "weapons": {
    fullKey: "achievements.research.weapons",
    sort: {
      "achievements.research.weapons": -1
    },
    select: {
      username: 1,
      "achievements.research.weapons": 1
    }
  },
  "banking": {
    fullKey: "achievements.research.banking",
    sort: {
      "achievements.research.banking": -1
    },
    select: {
      username: 1,
      "achievements.research.banking": 1
    }
  },
  "manufacturing": {
    fullKey: "achievements.research.manufacturing",
    sort: {
      "achievements.research.manufacturing": -1
    },
    select: {
      username: 1,
      "achievements.research.manufacturing": 1
    }
  },
  "specialists": {
    fullKey: "achievements.research.specialists",
    sort: {
      "achievements.research.specialists": -1
    },
    select: {
      username: 1,
      "achievements.research.specialists": 1
    }
  },
  "credits-sent": {
    fullKey: "achievements.trade.creditsSent",
    sort: {
      "achievements.trade.creditsSent": -1
    },
    select: {
      username: 1,
      "achievements.trade.creditsSent": 1
    }
  },
  "credits-received": {
    fullKey: "achievements.trade.creditsReceived",
    sort: {
      "achievements.trade.creditsReceived": -1
    },
    select: {
      username: 1,
      "achievements.trade.creditsReceived": 1
    }
  },
  "technologies-sent": {
    fullKey: "achievements.trade.technologySent",
    sort: {
      "achievements.trade.technologySent": -1
    },
    select: {
      username: 1,
      "achievements.trade.technologySent": 1
    }
  },
  "technologies-received": {
    fullKey: "achievements.trade.technologyReceived",
    sort: {
      "achievements.trade.technologyReceived": -1
    },
    select: {
      username: 1,
      "achievements.trade.technologyReceived": 1
    }
  },
  "ships-gifted": {
    fullKey: "achievements.trade.giftsSent",
    sort: {
      "achievements.trade.giftsSent": -1
    },
    select: {
      username: 1,
      "achievements.trade.giftsSent": 1
    }
  },
  "ships-received": {
    fullKey: "achievements.trade.giftsReceived",
    sort: {
      "achievements.trade.giftsReceived": -1
    },
    select: {
      username: 1,
      "achievements.trade.giftsReceived": 1
    }
  },
  "renown-sent": {
    fullKey: "achievements.trade.renownSent",
    sort: {
      "achievements.trade.renownSent": -1
    },
    select: {
      username: 1,
      "achievements.trade.renownSent": 1
    }
  },
  "elo-rating": {
    fullKey: "achievements.eloRating",
    query: {
      "achievements.eloRating": { $ne: null }
    },
    sort: {
      "achievements.eloRating": -1,
      "achievements.rank": -1,
      "achievements.victories1v1": -1,
      "achievements.renown": -1
    },
    select: {
      username: 1,
      guildId: 1,
      "roles.contributor": 1,
      "roles.developer": 1,
      "roles.communityManager": 1,
      "roles.gameMaster": 1,
      "achievements.level": 1,
      "achievements.rank": 1,
      "achievements.victories": 1,
      "achievements.victories1v1": 1,
      "achievements.defeated1v1": 1,
      "achievements.renown": 1,
      "achievements.eloRating": 1
    }
  }
};
LeaderboardService.LOCALSORTERS = {
  stars: "stats.totalStars",
  carriers: "stats.totalCarriers",
  ships: "stats.totalShips",
  economy: "stats.totalEconomy",
  industry: "stats.totalIndustry",
  science: "stats.totalScience",
  newShips: "stats.newShips",
  warpgates: "stats.warpgates",
  starSpecialists: "stats.totalStarSpecialists",
  carrierSpecialists: "stats.totalCarrierSpecialists",
  totalSpecialists: "stats.totalSpecialists",
  scanning: "player.research.scanning.level",
  hyperspace: "player.research.hyperspace.level",
  terraforming: "player.research.terraforming.level",
  experimentation: "player.research.experimentation.level",
  weapons: "player.research.weapons.level",
  banking: "player.research.banking.level",
  manufacturing: "player.research.manufacturing.level",
  specialists: "player.research.specialists.level"
};
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=leaderboard.js.map
