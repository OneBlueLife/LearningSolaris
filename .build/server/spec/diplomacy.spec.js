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
var import_diplomacy = __toESM(require("../services/diplomacy"));
describe("diplomacy", () => {
  const fakeGameRepo = {};
  const fakeEventRepo = {};
  const fakeDiplomacyUpkeepService = {};
  let service;
  beforeEach(() => {
    service = new import_diplomacy.default(fakeGameRepo, fakeEventRepo, fakeDiplomacyUpkeepService);
  });
  it("should return true if formal alliances is enabled", () => {
    const game = {
      settings: {
        diplomacy: {
          enabled: "enabled"
        }
      }
    };
    let result = service.isFormalAlliancesEnabled(game);
    expect(result).toBeTrue();
  });
  it("should return false if formal alliances is disabled", () => {
    const game = {
      settings: {
        diplomacy: {
          enabled: "disabled"
        }
      }
    };
    let result = service.isFormalAlliancesEnabled(game);
    expect(result).toBeFalse();
  });
  it("should return true if trade restricted is enabled", () => {
    const game = {
      settings: {
        diplomacy: {
          tradeRestricted: "enabled"
        }
      }
    };
    let result = service.isTradeRestricted(game);
    expect(result).toBeTrue();
  });
  it("should return false if trade restricted is disabled", () => {
    const game = {
      settings: {
        diplomacy: {
          tradeRestricted: "disabled"
        }
      }
    };
    let result = service.isTradeRestricted(game);
    expect(result).toBeFalse();
  });
  it("should return true if max alliances is enabled", () => {
    const game = {
      settings: {
        general: {
          playerLimit: 8
        },
        diplomacy: {
          maxAlliances: 6
        }
      }
    };
    let result = service.isMaxAlliancesEnabled(game);
    expect(result).toBeTrue();
  });
  it("should return false if max alliances is disabled", () => {
    const game = {
      settings: {
        general: {
          playerLimit: 8
        },
        diplomacy: {
          maxAlliances: 7
        }
      }
    };
    let result = service.isMaxAlliancesEnabled(game);
    expect(result).toBeFalse();
  });
  it("should return true if global events is enabled", () => {
    const game = {
      settings: {
        diplomacy: {
          globalEvents: "enabled"
        }
      }
    };
    let result = service.isGlobalEventsEnabled(game);
    expect(result).toBeTrue();
  });
  it("should return false if global events is disabled", () => {
    const game = {
      settings: {
        diplomacy: {
          globalEvents: "disabled"
        }
      }
    };
    let result = service.isGlobalEventsEnabled(game);
    expect(result).toBeFalse();
  });
  const _playerIdA = 1;
  const _playerAliasA = "Player 1";
  const _playerIdB = 2;
  const _playerAliasB = "Player 2";
  const setupPlayerDiplomacyGame = (playerAStatusToB, playerBStatusToA) => {
    const game = {
      galaxy: {
        players: [
          {
            _id: _playerIdA,
            alias: _playerAliasA,
            diplomacy: [
              {
                playerId: _playerIdB,
                status: playerAStatusToB
              }
            ]
          },
          {
            _id: _playerIdB,
            alias: _playerAliasB,
            diplomacy: [
              {
                playerId: _playerIdA,
                status: playerBStatusToA
              }
            ]
          }
        ]
      }
    };
    return game;
  };
  const assertGetDiplomaticStatusToPlayer = (playerAStatusToB, playerBStatusToA, expectedStatus) => {
    const game = setupPlayerDiplomacyGame(playerAStatusToB, playerBStatusToA);
    let result = service.getDiplomaticStatusToPlayer(game, _playerIdA, _playerIdB);
    expect(result.playerIdFrom).toBe(_playerIdA);
    expect(result.playerIdTo).toBe(_playerIdB);
    expect(result.playerFromAlias).toBe(_playerAliasA);
    expect(result.playerToAlias).toBe(_playerAliasB);
    expect(result.statusFrom).toBe(playerBStatusToA);
    expect(result.statusTo).toBe(playerAStatusToB);
    expect(result.actualStatus).toBe(expectedStatus);
  };
  it("should return allies if players are allied", () => {
    assertGetDiplomaticStatusToPlayer("allies", "allies", "allies");
  });
  it("should return neutral if at least one or both players are neutral", () => {
    assertGetDiplomaticStatusToPlayer("allies", "neutral", "neutral");
    assertGetDiplomaticStatusToPlayer("neutral", "allies", "neutral");
    assertGetDiplomaticStatusToPlayer("neutral", "neutral", "neutral");
  });
  it("should return enemies if at least one player is enemies", () => {
    assertGetDiplomaticStatusToPlayer("allies", "enemies", "enemies");
    assertGetDiplomaticStatusToPlayer("neutral", "enemies", "enemies");
    assertGetDiplomaticStatusToPlayer("enemies", "allies", "enemies");
    assertGetDiplomaticStatusToPlayer("enemies", "neutral", "enemies");
    assertGetDiplomaticStatusToPlayer("enemies", "enemies", "enemies");
  });
  const assertGetDiplomaticStatusBetweenPlayers = (playerAStatusToB, playerBStatusToA, expectedStatus) => {
    const game = setupPlayerDiplomacyGame(playerAStatusToB, playerBStatusToA);
    let result = service.getDiplomaticStatusBetweenPlayers(game, [_playerIdA, _playerIdB]);
    expect(result).toBe(expectedStatus);
  };
  it("should return allies if all players are allied", () => {
    assertGetDiplomaticStatusBetweenPlayers("allies", "allies", "allies");
  });
  it("should return neutral if all players are neutral", () => {
    assertGetDiplomaticStatusBetweenPlayers("allies", "neutral", "neutral");
    assertGetDiplomaticStatusBetweenPlayers("neutral", "allies", "neutral");
    assertGetDiplomaticStatusBetweenPlayers("neutral", "neutral", "neutral");
  });
  it("should return enemies if at least one player is enemies", () => {
    assertGetDiplomaticStatusBetweenPlayers("allies", "enemies", "enemies");
    assertGetDiplomaticStatusBetweenPlayers("neutral", "enemies", "enemies");
    assertGetDiplomaticStatusBetweenPlayers("enemies", "allies", "enemies");
    assertGetDiplomaticStatusBetweenPlayers("enemies", "neutral", "enemies");
    assertGetDiplomaticStatusBetweenPlayers("enemies", "enemies", "enemies");
  });
});
//# sourceMappingURL=diplomacy.spec.js.map
