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
var import_specialistHire = __toESM(require("../services/specialistHire"));
const mongoose = require("mongoose");
describe("specialistHire - Star", () => {
  function setup() {
    let obj = {
      service: {},
      gameRepo: {
        bulkWrite: () => {
        }
      },
      specialistService: {},
      technologyService: {
        getStarEffectiveTechnologyLevels: () => {
        }
      },
      achievementService: {
        incrementSpecialistsHired: () => {
        }
      },
      waypointService: {
        cullWaypointsByHyperspaceRangeDB: () => {
        }
      },
      playerService: {},
      playerCreditsService: {},
      starService: {},
      gameTypeService: {
        isTutorialGame: () => {
          return false;
        }
      },
      specialistBanService: {
        isStarSpecialistBanned: () => {
          return false;
        }
      },
      game: {
        settings: {
          specialGalaxy: {
            specialistCost: "standard",
            specialistsCurrency: "credits",
            specialistBans: {
              star: [],
              carrier: []
            }
          }
        },
        galaxy: {
          carriers: [],
          stars: []
        }
      },
      playerId: new mongoose.Types.ObjectId(),
      player: {
        _id: null,
        credits: 0,
        creditsSpecialists: 0
      },
      starId: new mongoose.Types.ObjectId(),
      specialistId: 1
    };
    obj.player._id = obj.playerId;
    obj.service = new import_specialistHire.default(obj.gameRepo, obj.specialistService, obj.achievementService, obj.waypointService, obj.playerCreditsService, obj.starService, obj.gameTypeService, obj.specialistBanService, obj.technologyService);
    return obj;
  }
  function starWithSpecialist(testObj, specId) {
    return {
      _id: testObj.starId,
      ownedByPlayerId: testObj.playerId,
      specialistId: specId || null
    };
  }
  function specialistBasic(testObj) {
    return {
      id: testObj.specialistId
    };
  }
  it("should throw an error if specialists are disabled", async () => {
    let testObj = setup();
    let hasError = false;
    testObj.game.settings.specialGalaxy.specialistCost = "none";
    try {
      await testObj.service.hireStarSpecialist(testObj.game, testObj.player, testObj.starId, testObj.specialistId);
    } catch (err) {
      hasError = true;
      expect(err.message).toContain("disabled the hiring of specialists");
    }
    expect(hasError).toBeTruthy();
  });
  it("should throw an error if the specialist is banned", async () => {
    let testObj = setup();
    let hasError = false;
    testObj.specialistBanService.isStarSpecialistBanned = () => true;
    try {
      await testObj.service.hireStarSpecialist(testObj.game, testObj.player, testObj.starId, testObj.specialistId);
    } catch (err) {
      hasError = true;
      expect(err.message).toContain("banned");
    }
    expect(hasError).toBeTruthy();
  });
  it("should throw an error if the star does not exist", async () => {
    let testObj = setup();
    let hasError = false;
    try {
      await testObj.service.hireStarSpecialist(testObj.game, testObj.player, testObj.starId, testObj.specialistId);
    } catch (err) {
      hasError = true;
      expect(err.message).toContain("you do not own");
    }
    expect(hasError).toBeTruthy();
  });
  it("should throw an error if the star is dead", async () => {
    let testObj = setup();
    let hasError = false;
    testObj.game.galaxy.stars.push(starWithSpecialist(testObj, null));
    testObj.starService.isDeadStar = () => {
      return true;
    };
    try {
      await testObj.service.hireStarSpecialist(testObj.game, testObj.player, testObj.starId, testObj.specialistId);
    } catch (err) {
      hasError = true;
      expect(err.message).toContain("dead star");
    }
    expect(hasError).toBeTruthy();
  });
  it("should throw an error if the specialist does not exist", async () => {
    let testObj = setup();
    let hasError = false;
    testObj.game.galaxy.stars.push(starWithSpecialist(testObj, null));
    testObj.starService.isDeadStar = () => {
      return false;
    };
    testObj.specialistService.getByIdStar = () => {
      return null;
    };
    try {
      await testObj.service.hireStarSpecialist(testObj.game, testObj.player, testObj.starId, testObj.specialistId);
    } catch (err) {
      hasError = true;
      expect(err.message).toContain("does not exist");
    }
    expect(hasError).toBeTruthy();
  });
  it("should throw an error if the specialist is already on the star", async () => {
    let testObj = setup();
    let hasError = false;
    testObj.game.galaxy.stars.push(starWithSpecialist(testObj, testObj.specialistId));
    testObj.starService.isDeadStar = () => {
      return false;
    };
    testObj.specialistService.getByIdStar = () => {
      return specialistBasic(testObj);
    };
    try {
      await testObj.service.hireStarSpecialist(testObj.game, testObj.player, testObj.starId, testObj.specialistId);
    } catch (err) {
      hasError = true;
      expect(err.message).toContain("already has the specialist assigned");
    }
    expect(hasError).toBeTruthy();
  });
  it("should throw an error if the player cannot afford the specialist by credits", async () => {
    let testObj = setup();
    let hasError = false;
    testObj.game.galaxy.stars.push(starWithSpecialist(testObj, null));
    testObj.starService.isDeadStar = () => {
      return false;
    };
    testObj.specialistService.getByIdStar = () => {
      return specialistBasic(testObj);
    };
    testObj.specialistService.getSpecialistActualCost = () => {
      return {
        credits: 1e3
      };
    };
    testObj.game.settings.specialGalaxy.specialistsCurrency = "credits";
    testObj.player.credits = 1;
    try {
      await testObj.service.hireStarSpecialist(testObj.game, testObj.player, testObj.starId, testObj.specialistId);
    } catch (err) {
      hasError = true;
      expect(err.message).toContain("cannot afford");
    }
    expect(hasError).toBeTruthy();
  });
  it("should throw an error if the player cannot afford the specialist by specialist credits", async () => {
    let testObj = setup();
    let hasError = false;
    testObj.game.galaxy.stars.push(starWithSpecialist(testObj, null));
    testObj.starService.isDeadStar = () => {
      return false;
    };
    testObj.specialistService.getByIdStar = () => {
      return specialistBasic(testObj);
    };
    testObj.specialistService.getSpecialistActualCost = () => {
      return {
        creditsSpecialists: 1e3
      };
    };
    testObj.game.settings.specialGalaxy.specialistsCurrency = "creditsSpecialists";
    testObj.player.creditsSpecialists = 1;
    try {
      await testObj.service.hireStarSpecialist(testObj.game, testObj.player, testObj.starId, testObj.specialistId);
    } catch (err) {
      hasError = true;
      expect(err.message).toContain("cannot afford");
    }
    expect(hasError).toBeTruthy();
  });
  it("should assign the specialist to the star", async () => {
    let testObj = setup();
    let hasError = false;
    let star = starWithSpecialist(testObj, null);
    testObj.game.galaxy.stars.push(star);
    testObj.specialistService.getByIdStar = (id) => {
      return specialistBasic(testObj);
    };
    testObj.starService.isDeadStar = () => {
      return false;
    };
    testObj.specialistService.getSpecialistActualCost = () => {
      return {
        credits: 100
      };
    };
    testObj.playerCreditsService.addCredits = (game, player, amount) => {
      expect(amount).toBe(-100);
    };
    testObj.game.settings.specialGalaxy.specialistsCurrency = "credits";
    testObj.player.credits = 100;
    try {
      await testObj.service.hireStarSpecialist(testObj.game, testObj.player, testObj.starId, testObj.specialistId);
    } catch (err) {
      hasError = true;
    }
    expect(hasError).toBeFalsy();
    expect(star.specialistId).toBe(testObj.specialistId);
    expect(testObj.player.credits).toBe(0);
  });
});
//# sourceMappingURL=specialistHireStar.spec.js.map
