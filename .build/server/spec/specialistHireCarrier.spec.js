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
describe("specialistHire - Carrier", () => {
  function setup() {
    let obj = {
      service: {},
      gameRepo: {
        bulkWrite: () => {
        }
      },
      specialistService: {},
      technologyService: {
        getCarrierEffectiveTechnologyLevels: () => {
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
      starService: {
        isOwnedByPlayer: () => {
          return true;
        },
        getById: () => {
          return {};
        },
        isDeadStar: () => {
          return false;
        }
      },
      gameTypeService: {
        isTutorialGame: () => {
          return false;
        }
      },
      specialistBanService: {
        isCarrierSpecialistBanned: () => {
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
      carrierId: new mongoose.Types.ObjectId(),
      starId: new mongoose.Types.ObjectId(),
      specialistId: 1
    };
    obj.player._id = obj.playerId;
    obj.service = new import_specialistHire.default(obj.gameRepo, obj.specialistService, obj.achievementService, obj.waypointService, obj.playerCreditsService, obj.starService, obj.gameTypeService, obj.specialistBanService, obj.technologyService);
    return obj;
  }
  function carrierUnowned(testObj) {
    return {
      _id: testObj.carrierId,
      ownedByPlayerId: new mongoose.Types.ObjectId(),
      orbiting: testObj.starId,
      specialistId: null
    };
  }
  function carrierInTransit(testObj) {
    return {
      _id: testObj.carrierId,
      ownedByPlayerId: testObj.playerId,
      orbiting: null,
      specialistId: null
    };
  }
  function carrierInOrbit(testObj) {
    return {
      _id: testObj.carrierId,
      ownedByPlayerId: testObj.playerId,
      orbiting: testObj.starId,
      specialistId: null
    };
  }
  function starBasic(testObj) {
    return {
      _id: testObj.starId,
      ownedByPlayerId: testObj.playerId
    };
  }
  function carrierInOrbitWithSpec(testObj, specId) {
    return {
      _id: testObj.carrierId,
      ownedByPlayerId: testObj.playerId,
      orbiting: testObj.starId,
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
      await testObj.service.hireCarrierSpecialist(testObj.game, testObj.player, testObj.carrierId, testObj.specialistId);
    } catch (err) {
      hasError = true;
      expect(err.message).toContain("disabled the hiring of specialists");
    }
    expect(hasError).toBeTruthy();
  });
  it("should throw an error if the specialist is banned", async () => {
    let testObj = setup();
    let hasError = false;
    testObj.specialistBanService.isCarrierSpecialistBanned = () => true;
    try {
      await testObj.service.hireCarrierSpecialist(testObj.game, testObj.player, testObj.carrierId, testObj.specialistId);
    } catch (err) {
      hasError = true;
      expect(err.message).toContain("banned");
    }
    expect(hasError).toBeTruthy();
  });
  it("should throw an error if the carrier does not exist", async () => {
    let testObj = setup();
    let hasError = false;
    testObj.game.galaxy.carriers.push(carrierUnowned(testObj));
    try {
      await testObj.service.hireCarrierSpecialist(testObj.game, testObj.player, testObj.carrierId, testObj.specialistId);
    } catch (err) {
      hasError = true;
      expect(err.message).toContain("you do not own");
    }
    expect(hasError).toBeTruthy();
  });
  it("should throw an error if the carrier is not in orbit", async () => {
    let testObj = setup();
    let hasError = false;
    testObj.game.galaxy.carriers.push(carrierInTransit(testObj));
    try {
      await testObj.service.hireCarrierSpecialist(testObj.game, testObj.player, testObj.carrierId, testObj.specialistId);
    } catch (err) {
      hasError = true;
      expect(err.message).toContain("in transit");
    }
    expect(hasError).toBeTruthy();
  });
  it("should throw an error trying to hire the specialist on a dead star", async () => {
    let testObj = setup();
    let hasError = false;
    let star = starBasic(testObj);
    testObj.game.galaxy.carriers.push(carrierInOrbit(testObj));
    testObj.game.galaxy.stars.push(star);
    testObj.specialistService.getByIdCarrier = (id) => {
      return null;
    };
    testObj.starService.getById = () => {
      return star;
    };
    testObj.starService.isDeadStar = () => {
      return true;
    };
    try {
      await testObj.service.hireCarrierSpecialist(testObj.game, testObj.player, testObj.carrierId, testObj.specialistId);
    } catch (err) {
      hasError = true;
      expect(err.message).toContain("dead star");
    }
    expect(hasError).toBeTruthy();
  });
  it("should throw an error if the specialist does not exist", async () => {
    let testObj = setup();
    let hasError = false;
    let star = starBasic(testObj);
    testObj.game.galaxy.carriers.push(carrierInOrbit(testObj));
    testObj.game.galaxy.stars.push(star);
    testObj.specialistService.getByIdCarrier = (id) => {
      return null;
    };
    testObj.starService.getById = () => {
      return star;
    };
    testObj.starService.isDeadStar = () => {
      return false;
    };
    try {
      await testObj.service.hireCarrierSpecialist(testObj.game, testObj.player, testObj.carrierId, testObj.specialistId);
    } catch (err) {
      hasError = true;
      expect(err.message).toContain("does not exist");
    }
    expect(hasError).toBeTruthy();
  });
  it("should throw an error if the specialist is already on the carrier", async () => {
    let testObj = setup();
    let hasError = false;
    let star = starBasic(testObj);
    testObj.game.galaxy.carriers.push(carrierInOrbitWithSpec(testObj, testObj.specialistId));
    testObj.game.galaxy.stars.push(star);
    testObj.specialistService.getByIdCarrier = (id) => {
      return specialistBasic(testObj);
    };
    testObj.starService.getById = () => {
      return star;
    };
    testObj.starService.isDeadStar = () => {
      return false;
    };
    try {
      await testObj.service.hireCarrierSpecialist(testObj.game, testObj.player, testObj.carrierId, testObj.specialistId);
    } catch (err) {
      hasError = true;
      expect(err.message).toContain("already has the specialist assigned");
    }
    expect(hasError).toBeTruthy();
  });
  it("should throw an error if the player cannot afford the specialist by credits", async () => {
    let testObj = setup();
    let hasError = false;
    let star = starBasic(testObj);
    testObj.game.galaxy.carriers.push(carrierInOrbitWithSpec(testObj, null));
    testObj.game.galaxy.stars.push(star);
    testObj.specialistService.getByIdCarrier = (id) => {
      return specialistBasic(testObj);
    };
    testObj.starService.getById = () => {
      return star;
    };
    testObj.starService.isDeadStar = () => {
      return false;
    };
    testObj.specialistService.getSpecialistActualCost = () => {
      return {
        credits: 1e3
      };
    };
    testObj.game.settings.specialGalaxy.specialistsCurrency = "credits";
    testObj.player.credits = 1;
    try {
      await testObj.service.hireCarrierSpecialist(testObj.game, testObj.player, testObj.carrierId, testObj.specialistId);
    } catch (err) {
      hasError = true;
      expect(err.message).toContain("cannot afford");
    }
    expect(hasError).toBeTruthy();
  });
  it("should throw an error if the player cannot afford the specialist by specialist credits", async () => {
    let testObj = setup();
    let hasError = false;
    let star = starBasic(testObj);
    testObj.game.galaxy.carriers.push(carrierInOrbitWithSpec(testObj, null));
    testObj.game.galaxy.stars.push(star);
    testObj.specialistService.getByIdCarrier = (id) => {
      return specialistBasic(testObj);
    };
    testObj.starService.getById = () => {
      return star;
    };
    testObj.starService.isDeadStar = () => {
      return false;
    };
    testObj.specialistService.getSpecialistActualCost = () => {
      return {
        creditsSpecialists: 1e3
      };
    };
    testObj.game.settings.specialGalaxy.specialistsCurrency = "creditsSpecialists";
    testObj.player.creditsSpecialists = 1;
    try {
      await testObj.service.hireCarrierSpecialist(testObj.game, testObj.player, testObj.carrierId, testObj.specialistId);
    } catch (err) {
      hasError = true;
      expect(err.message).toContain("cannot afford");
    }
    expect(hasError).toBeTruthy();
  });
  it("should assign the specialist to the carrier", async () => {
    let testObj = setup();
    let hasError = false;
    let carrier = carrierInOrbitWithSpec(testObj, null);
    let star = starBasic(testObj);
    testObj.game.galaxy.carriers.push(carrier);
    testObj.game.galaxy.stars.push(star);
    testObj.specialistService.getByIdCarrier = (id) => {
      return specialistBasic(testObj);
    };
    testObj.starService.getById = () => {
      return star;
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
      await testObj.service.hireCarrierSpecialist(testObj.game, testObj.player, testObj.carrierId, testObj.specialistId);
    } catch (err) {
      hasError = true;
    }
    expect(hasError).toBeFalsy();
    expect(carrier.specialistId).toBe(testObj.specialistId);
    expect(testObj.player.credits).toBe(0);
  });
});
//# sourceMappingURL=specialistHireCarrier.spec.js.map
