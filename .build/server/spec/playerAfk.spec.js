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
var import_moment = __toESM(require("moment"));
var import_playerAfk = __toESM(require("../services/playerAfk"));
const mongoose = require("mongoose");
describe("Player AFK Service", () => {
  let service;
  let game;
  let player;
  let gameRepo;
  let playerService;
  let starService;
  let carrierService;
  let gameTypeService;
  let gameStateService;
  beforeEach(() => {
    gameStateService = {
      isStarted(game2) {
        return true;
      }
    };
    gameTypeService = {
      isTurnBasedGame(game2) {
        return false;
      }
    };
    game = {
      state: {
        startDate: (0, import_moment.default)().utc().toDate()
      },
      settings: {
        galaxy: {
          productionTicks: 20
        },
        gameTime: {
          speed: 1800,
          afk: {
            lastSeenTimeout: 2,
            turnTimeout: 3,
            cycleTimeout: 4
          }
        }
      }
    };
    player = {
      defeated: false,
      afk: false,
      userId: mongoose.Types.ObjectId(),
      lastSeen: null
    };
    service = new import_playerAfk.default(gameRepo, playerService, starService, carrierService, gameTypeService, gameStateService);
  });
  describe("Is AI Controlled", () => {
    it("should return true if the player is defeated", () => {
      player.defeated = true;
      player.userId = mongoose.Types.ObjectId();
      const result = service.isAIControlled(game, player, false);
      expect(result).toBeTrue();
    });
    it("should return true if the player is not controlled by a user", () => {
      player.defeated = false;
      player.userId = null;
      const result = service.isAIControlled(game, player, false);
      expect(result).toBeTrue();
    });
    it("should return false if the player is controlled by a user and is not defeated", () => {
      player.defeated = false;
      player.userId = mongoose.Types.ObjectId();
      const result = service.isAIControlled(game, player, false);
      expect(result).toBeFalse();
    });
  });
  describe("Pseudo AFK", () => {
    it("should return false if the game has not started yet", () => {
      gameStateService.isStarted = (game2) => {
        return false;
      };
      game.state.startDate = null;
      const result = service.isPsuedoAfk(game, player);
      expect(result).toBeFalse();
    });
    it("should return false if the game has not been playing for 12 hours", () => {
      const result = service.isPsuedoAfk(game, player);
      expect(result).toBeFalse();
    });
    it("should return true if the player has not been seen at all", () => {
      game.state.startDate = (0, import_moment.default)().utc().subtract(1, "day").toDate();
      player.lastSeen = null;
      const result = service.isPsuedoAfk(game, player);
      expect(result).toBeTrue();
    });
    it("should return true if the player has not been seen since the start of the game", () => {
      game.state.startDate = (0, import_moment.default)().utc().subtract(1, "day").toDate();
      player.lastSeen = game.state.startDate;
      const result = service.isPsuedoAfk(game, player);
      expect(result).toBeTrue();
    });
    it("should return true if the player has not been seen since before the start of the game", () => {
      game.state.startDate = (0, import_moment.default)().utc().subtract(1, "day").toDate();
      player.lastSeen = (0, import_moment.default)().utc().subtract(2, "days").toDate();
      const result = service.isPsuedoAfk(game, player);
      expect(result).toBeTrue();
    });
    it("should return false if the player has been seen since the start of the game", () => {
      game.state.startDate = (0, import_moment.default)().utc().subtract(1, "day").toDate();
      player.lastSeen = (0, import_moment.default)().utc().toDate();
      const result = service.isPsuedoAfk(game, player);
      expect(result).toBeFalse();
    });
  });
  describe("Is AFK", () => {
    it("should return true if the player is already afk", () => {
      player.afk = true;
      const result = service.isAfk(game, player);
      expect(result).toBeTrue();
    });
    it("should return true if the player has not been seen for the last seen timeout", () => {
      player.lastSeen = (0, import_moment.default)().utc().subtract(game.settings.gameTime.afk.lastSeenTimeout, "days").toDate();
      const result = service.isAfk(game, player);
      expect(result).toBeTrue();
    });
    it("should return true if the player has missed too many turns", () => {
      gameTypeService.isTurnBasedGame = (game2) => {
        return true;
      };
      player.lastSeen = (0, import_moment.default)().utc().toDate();
      player.missedTurns = game.settings.gameTime.afk.turnTimeout;
      const result = service.isAfk(game, player);
      expect(result).toBeTrue();
    });
    it("should return true if the player has missed too many cycles", () => {
      const seconds = game.settings.galaxy.productionTicks * game.settings.gameTime.speed * game.settings.gameTime.afk.cycleTimeout;
      player.lastSeen = (0, import_moment.default)().utc().subtract(seconds, "seconds").toDate();
      const result = service.isAfk(game, player);
      expect(result).toBeTrue();
    });
    it("should return false if the player has missed too many cycles but seen less than 12h ago", () => {
      game.settings.galaxy.productionTicks = 1;
      game.settings.gameTime.speed = 30;
      game.settings.gameTime.afk.cycleTimeout = 1;
      const seconds = game.settings.galaxy.productionTicks * game.settings.gameTime.speed * game.settings.gameTime.afk.cycleTimeout;
      player.lastSeen = (0, import_moment.default)().utc().subtract(seconds, "seconds").toDate();
      const result = service.isAfk(game, player);
      expect(result).toBeFalse();
    });
  });
});
//# sourceMappingURL=playerAfk.spec.js.map
