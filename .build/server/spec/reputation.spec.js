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
var import_reputation = __toESM(require("../services/reputation"));
describe("reputation", () => {
  const fakeGameRepo = {};
  const fakePlayerStatisticsService = {};
  const fakeDiplomacyService = {
    isFormalAlliancesEnabled() {
      return false;
    },
    getDiplomaticStatusToPlayer() {
    },
    declareEnemy() {
    }
  };
  const fakePlayerAfkService = {
    isAIControlled() {
      return true;
    }
  };
  let service;
  beforeEach(() => {
    service = new import_reputation.default(fakeGameRepo, fakePlayerStatisticsService, fakeDiplomacyService, fakePlayerAfkService);
  });
  const _playerIdA = 1;
  const _playerIdB = 2;
  const setupGame = (repAToB, repBToA) => {
    const game = {
      galaxy: {
        players: [
          {
            _id: _playerIdA,
            defeated: false,
            reputations: [
              {
                playerId: _playerIdB,
                score: repAToB
              }
            ]
          },
          {
            _id: _playerIdB,
            defeated: false,
            reputations: [
              {
                playerId: _playerIdA,
                score: repBToA
              }
            ]
          }
        ]
      }
    };
    return game;
  };
  it("should get the reputation from player A to B", () => {
    const game = setupGame(1, 2);
    const playerA = game.galaxy.players[0];
    const playerB = game.galaxy.players[1];
    let result = service.getReputation(playerA, playerB);
    expect(result.reputation.playerId).toEqual(playerB._id);
    expect(result.reputation.score).toEqual(1);
  });
  it("should get the reputation from player B to A", () => {
    const game = setupGame(1, 2);
    const playerA = game.galaxy.players[0];
    const playerB = game.galaxy.players[1];
    let result = service.getReputation(playerB, playerA);
    expect(result.reputation.playerId).toEqual(playerA._id);
    expect(result.reputation.score).toEqual(2);
  });
  it("should increase the reputation", async () => {
    const game = setupGame(0, 0);
    const playerA = game.galaxy.players[0];
    const playerB = game.galaxy.players[1];
    let result = await service.increaseReputation(game, playerA, playerB, 1, false);
    expect(result.reputation.playerId).toEqual(playerB._id);
    expect(result.reputation.score).toEqual(1);
  });
  it("should not increase the reputation if max reputation has been reached", async () => {
    const game = setupGame(8, 0);
    const playerA = game.galaxy.players[0];
    const playerB = game.galaxy.players[1];
    let result = await service.increaseReputation(game, playerA, playerB, 1, false);
    expect(result.reputation.playerId).toEqual(playerB._id);
    expect(result.reputation.score).toEqual(8);
  });
  it("should decrease the reputation", async () => {
    const game = setupGame(0, 0);
    const playerA = game.galaxy.players[0];
    const playerB = game.galaxy.players[1];
    let result = await service.decreaseReputation(game, playerA, playerB, false);
    expect(result.reputation.playerId).toEqual(playerB._id);
    expect(result.reputation.score).toEqual(-1);
  });
  it("should not decrease the reputation if max reputation has been reached", async () => {
    const game = setupGame(-8, 0);
    const playerA = game.galaxy.players[0];
    const playerB = game.galaxy.players[1];
    let result = await service.decreaseReputation(game, playerA, playerB, false);
    expect(result.reputation.playerId).toEqual(playerB._id);
    expect(result.reputation.score).toEqual(-8);
  });
  it("should reset the reputation to 0 if greater than 0", async () => {
    const game = setupGame(8, 0);
    const playerA = game.galaxy.players[0];
    const playerB = game.galaxy.players[1];
    let result = await service.decreaseReputation(game, playerA, playerB, false);
    expect(result.reputation.playerId).toEqual(playerB._id);
    expect(result.reputation.score).toEqual(0);
  });
  it("should decrease the reputation by 1 if less than 0", async () => {
    const game = setupGame(-1, 0);
    const playerA = game.galaxy.players[0];
    const playerB = game.galaxy.players[1];
    let result = await service.decreaseReputation(game, playerA, playerB, false);
    expect(result.reputation.playerId).toEqual(playerB._id);
    expect(result.reputation.score).toEqual(-2);
  });
  it("should declare allies if above the reputation threshold", async () => {
    let declaredAlly = false;
    fakeDiplomacyService.isFormalAlliancesEnabled = () => true;
    fakeDiplomacyService.declareAlly = () => {
      declaredAlly = true;
    };
    fakeDiplomacyService.getDiplomaticStatusToPlayer = () => {
      return {
        statusTo: "neutral",
        actualStatus: "neutral"
      };
    };
    const game = setupGame(4, 0);
    const playerA = game.galaxy.players[0];
    const playerB = game.galaxy.players[1];
    playerA.defeated = true;
    let result = await service.increaseReputation(game, playerA, playerB, 1, false);
    expect(declaredAlly).toBeTrue();
  });
  it("should not declare allies already allied", async () => {
    let declaredAlly = false;
    fakeDiplomacyService.isFormalAlliancesEnabled = () => true;
    fakeDiplomacyService.declareAlly = () => {
      declaredAlly = true;
    };
    fakeDiplomacyService.getDiplomaticStatusToPlayer = () => {
      return {
        statusTo: "allies",
        actualStatus: "allies"
      };
    };
    const game = setupGame(4, 0);
    const playerA = game.galaxy.players[0];
    const playerB = game.galaxy.players[1];
    playerA.defeated = true;
    let result = await service.increaseReputation(game, playerA, playerB, 1, false);
    expect(declaredAlly).toBeFalse();
  });
  it("should declare enemies if below the reputation threshold", async () => {
    let declaredEnemy = false;
    fakeDiplomacyService.isFormalAlliancesEnabled = () => true;
    fakeDiplomacyService.declareEnemy = () => {
      declaredEnemy = true;
    };
    fakeDiplomacyService.getDiplomaticStatusToPlayer = () => {
      return {
        statusTo: "neutral",
        actualStatus: "neutral"
      };
    };
    const game = setupGame(0, 0);
    const playerA = game.galaxy.players[0];
    const playerB = game.galaxy.players[1];
    playerA.defeated = true;
    let result = await service.decreaseReputation(game, playerA, playerB, false);
    expect(declaredEnemy).toBeTrue();
  });
  it("should not declare enemies already enemies", async () => {
    let declaredEnemy = false;
    fakeDiplomacyService.isFormalAlliancesEnabled = () => true;
    fakeDiplomacyService.declareEnemy = () => {
      declaredEnemy = true;
    };
    fakeDiplomacyService.getDiplomaticStatusToPlayer = () => {
      return {
        statusTo: "enemies",
        actualStatus: "enemies"
      };
    };
    const game = setupGame(0, 0);
    const playerA = game.galaxy.players[0];
    const playerB = game.galaxy.players[1];
    playerA.defeated = true;
    let result = await service.decreaseReputation(game, playerA, playerB, false);
    expect(declaredEnemy).toBeFalse();
  });
  it("should declare neutral if above the enemy threshold", async () => {
    let declaredNeutral = false;
    fakeDiplomacyService.isFormalAlliancesEnabled = () => true;
    fakeDiplomacyService.declareNeutral = () => {
      declaredNeutral = true;
    };
    fakeDiplomacyService.getDiplomaticStatusToPlayer = () => {
      return {
        statusTo: "enemies",
        actualStatus: "enemies"
      };
    };
    const game = setupGame(-1, 0);
    const playerA = game.galaxy.players[0];
    const playerB = game.galaxy.players[1];
    playerA.defeated = true;
    let result = await service.increaseReputation(game, playerA, playerB, 1, false);
    expect(declaredNeutral).toBeTrue();
  });
  it("should not declare neutral if above the enemy threshold and already neutral", async () => {
    let declaredNeutral = false;
    fakeDiplomacyService.isFormalAlliancesEnabled = () => true;
    fakeDiplomacyService.declareNeutral = () => {
      declaredNeutral = true;
    };
    fakeDiplomacyService.getDiplomaticStatusToPlayer = () => {
      return {
        statusTo: "neutral",
        actualStatus: "neutral"
      };
    };
    const game = setupGame(0, 0);
    const playerA = game.galaxy.players[0];
    const playerB = game.galaxy.players[1];
    playerA.defeated = true;
    let result = await service.increaseReputation(game, playerA, playerB, 1, false);
    expect(declaredNeutral).toBeFalse();
  });
  it("should declare neutral if below the allies threshold", async () => {
    let declaredNeutral = false;
    fakeDiplomacyService.isFormalAlliancesEnabled = () => true;
    fakeDiplomacyService.declareNeutral = () => {
      declaredNeutral = true;
    };
    fakeDiplomacyService.getDiplomaticStatusToPlayer = () => {
      return {
        statusTo: "allies",
        actualStatus: "allies"
      };
    };
    const game = setupGame(5, 0);
    const playerA = game.galaxy.players[0];
    const playerB = game.galaxy.players[1];
    playerA.defeated = true;
    let result = await service.decreaseReputation(game, playerA, playerB, false);
    expect(declaredNeutral).toBeTrue();
  });
  it("should not declare neutral if below the allies threshold and already neutral", async () => {
    let declaredNeutral = false;
    fakeDiplomacyService.isFormalAlliancesEnabled = () => true;
    fakeDiplomacyService.declareNeutral = () => {
      declaredNeutral = true;
    };
    fakeDiplomacyService.getDiplomaticStatusToPlayer = () => {
      return {
        statusTo: "neutral",
        actualStatus: "neutral"
      };
    };
    const game = setupGame(4, 0);
    const playerA = game.galaxy.players[0];
    const playerB = game.galaxy.players[1];
    playerA.defeated = true;
    let result = await service.decreaseReputation(game, playerA, playerB, false);
    expect(declaredNeutral).toBeFalse();
  });
});
//# sourceMappingURL=reputation.spec.js.map
