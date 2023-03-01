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
var starContested_exports = {};
__export(starContested_exports, {
  default: () => StarContestedService
});
module.exports = __toCommonJS(starContested_exports);
class StarContestedService {
  constructor(diplomacyService) {
    this.diplomacyService = diplomacyService;
  }
  listContestedStars(game) {
    return game.galaxy.stars.filter((s) => s.ownedByPlayerId).map((s) => {
      let carriersInOrbit = game.galaxy.carriers.filter((c) => c.orbiting && c.orbiting.toString() === s._id.toString());
      let otherPlayerIdsInOrbit = [...new Set(carriersInOrbit.map((c) => c.ownedByPlayerId))];
      if (otherPlayerIdsInOrbit.indexOf(s.ownedByPlayerId) > -1) {
        otherPlayerIdsInOrbit.splice(otherPlayerIdsInOrbit.indexOf(s.ownedByPlayerId), 1);
      }
      return {
        star: s,
        carriersInOrbit,
        otherPlayerIdsInOrbit
      };
    }).filter((x) => {
      return x.otherPlayerIdsInOrbit.length && !this.diplomacyService.isDiplomaticStatusToPlayersAllied(game, x.star.ownedByPlayerId, x.otherPlayerIdsInOrbit);
    });
  }
  listContestedUnownedStars(game) {
    return game.galaxy.stars.filter((s) => s.ownedByPlayerId == null).map((s) => {
      let carriersInOrbit = game.galaxy.carriers.filter((c) => c.orbiting && c.orbiting.toString() === s._id.toString());
      return {
        star: s,
        carriersInOrbit
      };
    }).filter((x) => x.carriersInOrbit.length);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=starContested.js.map
