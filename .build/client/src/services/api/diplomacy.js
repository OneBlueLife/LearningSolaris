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
var diplomacy_exports = {};
__export(diplomacy_exports, {
  default: () => diplomacy_default
});
module.exports = __toCommonJS(diplomacy_exports);
var import_axios = __toESM(require("axios"));
var import_base = __toESM(require("./base"));
class DiplomacyService extends import_base.default {
  getDiplomaticStatus(gameId) {
    return import_axios.default.get(
      this.BASE_URL + "game/" + gameId + "/diplomacy",
      { withCredentials: true }
    );
  }
  getDiplomaticStatusToPlayer(gameId, toPlayerId) {
    return import_axios.default.get(
      this.BASE_URL + "game/" + gameId + "/diplomacy/" + toPlayerId,
      { withCredentials: true }
    );
  }
  declareAlly(gameId, playerId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/diplomacy/ally/" + playerId,
      {},
      { withCredentials: true }
    );
  }
  declareEnemy(gameId, playerId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/diplomacy/enemy/" + playerId,
      {},
      { withCredentials: true }
    );
  }
  declareNeutral(gameId, playerId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/diplomacy/neutral/" + playerId,
      {},
      { withCredentials: true }
    );
  }
}
var diplomacy_default = new DiplomacyService();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=diplomacy.js.map
