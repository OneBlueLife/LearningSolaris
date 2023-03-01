"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var custom_exports = {};
__export(custom_exports, {
  default: () => CustomMapService
});
module.exports = __toCommonJS(custom_exports);
var import_validation = __toESM(require("../../errors/validation"));
const mongoose = require("mongoose");
class CustomMapService {
  generateLocations(customJSON, playerLimit) {
    var _a;
    let json;
    try {
      json = JSON.parse(customJSON);
    } catch (e) {
      throw new import_validation.default("The custom map JSON is malformed.");
    }
    const locations = [];
    let playerIds = [];
    const homeStars = [];
    for (const star of json.stars) {
      star.id = star.id == null ? null : +star.id;
      star.homeStar = star.homeStar == null ? false : star.homeStar;
      star.playerId = star.playerId == null ? null : +star.playerId;
      star.warpGate = star.warpGate == null ? false : star.warpGate;
      star.isNebula = star.isNebula == null ? false : star.isNebula;
      star.isAsteroidField = star.isAsteroidField == null ? false : star.isAsteroidField;
      star.isBinaryStar = star.isBinaryStar == null ? false : star.isBinaryStar;
      star.isBlackHole = star.isBlackHole == null ? false : star.isBlackHole;
      star.isPulsar = star.isPulsar == null ? false : star.isPulsar;
      star.wormHoleToStarId = star.wormHoleToStarId == null ? null : +star.wormHoleToStarId;
      star.specialistId = star.specialistId == null ? null : +star.specialistId;
      this._checkStarProperty(star, "id", "number", false);
      this._checkStarProperty(star, "playerId", "number", true);
      this._checkStarProperty(star == null ? void 0 : star.location, "x", "number", false);
      this._checkStarProperty(star == null ? void 0 : star.location, "y", "number", false);
      this._checkStarProperty(star == null ? void 0 : star.naturalResources, "economy", "number", false);
      this._checkStarProperty(star == null ? void 0 : star.naturalResources, "industry", "number", false);
      this._checkStarProperty(star == null ? void 0 : star.naturalResources, "science", "number", false);
      this._checkStarProperty(star, "warpGate", "boolean", true);
      this._checkStarProperty(star, "isNebula", "boolean", true);
      this._checkStarProperty(star, "isAsteroidField", "boolean", true);
      this._checkStarProperty(star, "isBinaryStar", "boolean", true);
      this._checkStarProperty(star, "isBlackHole", "boolean", true);
      this._checkStarProperty(star, "isPulsar", "boolean", true);
      this._checkStarProperty(star, "wormHoleToStarId", "number", true);
      this._checkStarProperty(star, "homeStar", "boolean", true);
      this._checkStarProperty(star, "specialistId", "number", true);
      let mappedStar = {
        id: star.id,
        homeStar: star.homeStar,
        playerId: star.playerId,
        linkedLocations: [],
        warpGate: star.warpGate,
        isNebula: star.isNebula,
        isAsteroidField: star.isAsteroidField,
        isBinaryStar: star.isBinaryStar,
        isBlackHole: star.isBlackHole,
        isPulsar: star.isPulsar,
        wormHoleToStarId: star.wormHoleToStarId,
        specialistId: star.specialistId,
        location: {
          x: star.location.x,
          y: star.location.y
        },
        naturalResources: {
          economy: star.naturalResources.economy,
          industry: star.naturalResources.industry,
          science: star.naturalResources.science
        }
      };
      if (star == null ? void 0 : star.homeStar) {
        homeStars.push(mappedStar);
        if (mappedStar.playerId != null) {
          playerIds.push(mappedStar.playerId);
        }
      }
      locations.push(mappedStar);
    }
    playerIds = [...new Set(playerIds)];
    if (homeStars.length !== playerLimit) {
      throw new import_validation.default(`Must have ${playerLimit} capital stars in the custom map.`);
    }
    if (homeStars.length === playerIds.length) {
      this._linkStars(homeStars, locations);
    } else if (playerIds.length !== 0) {
      throw new import_validation.default("Unequal amount of home stars and players, or repeated player IDs");
    }
    for (let loc of locations) {
      loc._id = mongoose.Types.ObjectId();
    }
    for (let loc of locations.filter((l) => l.wormHoleToStarId != null)) {
      loc.wormHoleToStarId = (_a = locations.find((l) => l.id === loc.wormHoleToStarId)) == null ? void 0 : _a._id;
      if (!loc.wormHoleToStarId || loc.wormHoleToStarId.toString() === loc._id.toString()) {
        throw new import_validation.default(`Worm hole to star id is invalid for ${JSON.stringify(loc)}`);
      }
    }
    return locations;
  }
  _checkStarProperty(star, property, type, allowNull) {
    if (star === void 0)
      throw new import_validation.default(`Missing property of star ${star}`);
    if ((star == null ? void 0 : star[property]) === void 0)
      throw new import_validation.default(`Missing property ${property} of star ${JSON.stringify(star)}`);
    if (allowNull && star[property] === null) {
      return true;
    }
    if (typeof star[property] !== type)
      throw new import_validation.default(`Invalid type property ${property} of star ${JSON.stringify(star)}`);
    return true;
  }
  _linkStars(homeStars, stars) {
    let commonStars = stars.filter((star) => !star.homeStar);
    for (let homeStar of homeStars) {
      homeStar.linkedLocations = [];
      for (let commonStar of commonStars) {
        if (commonStar.playerId === homeStar.playerId) {
          homeStar.linkedLocations.push(commonStar);
          commonStar.linked = true;
        }
      }
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=custom.js.map
