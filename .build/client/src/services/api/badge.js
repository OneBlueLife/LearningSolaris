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
var badge_exports = {};
__export(badge_exports, {
  default: () => badge_default
});
module.exports = __toCommonJS(badge_exports);
var import_axios = __toESM(require("axios"));
var import_base = __toESM(require("./base"));
class BadgeApiService extends import_base.default {
  listBadges() {
    return import_axios.default.get(
      this.BASE_URL + "badges",
      { withCredentials: true }
    );
  }
  listBadgesByUser(userId) {
    return import_axios.default.get(
      this.BASE_URL + "badges/user/" + userId,
      { withCredentials: true }
    );
  }
  listBadgesByPlayer(gameId, playerId) {
    return import_axios.default.get(
      this.BASE_URL + "badges/game/" + gameId + "/player/" + playerId,
      { withCredentials: true }
    );
  }
  purchaseBadgeForUser(userId, badgeKey) {
    return import_axios.default.post(
      this.BASE_URL + "badges/user/" + userId,
      { badgeKey },
      { withCredentials: true }
    );
  }
  purchaseBadgeForPlayer(gameId, playerId, badgeKey) {
    return import_axios.default.post(
      this.BASE_URL + "badges/game/" + gameId + "/player/" + playerId,
      { badgeKey },
      { withCredentials: true }
    );
  }
}
var badge_default = new BadgeApiService();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=badge.js.map
