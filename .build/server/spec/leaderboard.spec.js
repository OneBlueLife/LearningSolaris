"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_leaderboard = __toESM(require("../services/leaderboard"));
const mongoose = require("mongoose");
describe("Leaderboard - Last man standing", () => {
  let userRepo;
  let userService;
  let playerService;
  let playerAfkService;
  let userLevelService;
  let guildUserService;
  let ratingService;
  let gameService;
  let gameTypeService;
  let gameStateService;
  let badgeService;
  let playerStatisticsService;
  let service;
  let game;
  let leaderboard;
  beforeEach(() => {
    playerAfkService = {
      isAIControlled: (game2, player, includePseudoAfk) => {
        return false;
      }
    };
    gameTypeService = {
      isKingOfTheHillMode: (game2) => {
        return false;
      }
    };
    playerStatisticsService = {
      getStats: (game2, player) => {
        return {
          totalStars: 1,
          totalHomeStars: 1,
          totalCarriers: 1,
          totalShips: 1,
          totalEconomy: 1,
          totalIndustry: 1,
          totalScience: 1,
          newShips: 1,
          warpgates: 1,
          totalStarSpecialists: 1,
          totalCarrierSpecialists: 1,
          totalSpecialists: 2
        };
      }
    };
    service = new import_leaderboard.default(userRepo, userService, playerService, playerAfkService, userLevelService, guildUserService, ratingService, gameService, gameTypeService, gameStateService, badgeService, playerStatisticsService);
    game = {
      settings: {
        general: {
          playerLimit: 2
        }
      },
      galaxy: {
        players: [
          {
            _id: mongoose.Types.ObjectId(),
            userId: mongoose.Types.ObjectId(),
            defeated: false
          },
          {
            _id: mongoose.Types.ObjectId(),
            userId: mongoose.Types.ObjectId(),
            defeated: false
          },
          {
            _id: mongoose.Types.ObjectId(),
            userId: mongoose.Types.ObjectId(),
            defeated: false
          }
        ]
      }
    };
    leaderboard = game.galaxy.players.map((p) => {
      return {
        player: p,
        stats: playerStatisticsService.getStats(game, p),
        isKingOfTheHill: false
      };
    });
  });
  it("should return null if no players are defeated", () => {
    const result = service.getLastManStanding(game, leaderboard);
    expect(result).toBeNull();
  });
  it("should return the first player if all other players are defeated", () => {
    game.galaxy.players[1].defeated = true;
    game.galaxy.players[1].defeatedDate = new Date();
    game.galaxy.players[2].defeated = true;
    game.galaxy.players[2].defeatedDate = new Date();
    const result = service.getLastManStanding(game, leaderboard);
    expect(result).not.toBeNull();
    expect(result._id).toBe(game.galaxy.players[0]._id);
  });
  it("should return the first place player if all players are defeated", () => {
    game.galaxy.players[0].defeated = true;
    game.galaxy.players[0].defeatedDate = new Date();
    game.galaxy.players[1].defeated = true;
    game.galaxy.players[1].defeatedDate = new Date();
    game.galaxy.players[2].defeated = true;
    game.galaxy.players[2].defeatedDate = new Date();
    const result = service.getLastManStanding(game, leaderboard);
    expect(result).not.toBeNull();
    expect(result._id).toBe(game.galaxy.players[0]._id);
  });
  it("should return null if all other players are undefeated AI", () => {
    game.galaxy.players[1].userId = null;
    game.galaxy.players[2].userId = null;
    playerAfkService.isAIControlled = (game2, player, includePseudoAfk) => {
      return player._id.toString() !== game2.galaxy.players[0]._id.toString();
    };
    const result = service.getLastManStanding(game, leaderboard);
    expect(result).toBeNull();
  });
  it("should return the first place player all players are AI", () => {
    game.galaxy.players[0].userId = null;
    game.galaxy.players[1].userId = null;
    game.galaxy.players[2].userId = null;
    playerAfkService.isAIControlled = (game2, player, includePseudoAfk) => {
      return true;
    };
    const result = service.getLastManStanding(game, leaderboard);
    expect(result).not.toBeNull();
    expect(result._id).toBe(game.galaxy.players[0]._id);
  });
});
//# sourceMappingURL=leaderboard.spec.js.map
