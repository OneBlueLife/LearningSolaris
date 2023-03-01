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
var guild_exports = {};
__export(guild_exports, {
  default: () => guild_default
});
module.exports = __toCommonJS(guild_exports);
var import_axios = __toESM(require("axios"));
var import_base = __toESM(require("./base"));
class GuildService extends import_base.default {
  list() {
    return import_axios.default.get(this.BASE_URL + "guild/list", { withCredentials: true });
  }
  getLeaderboard(limit, sortingKey) {
    return import_axios.default.get(
      this.BASE_URL + "guild/leaderboard",
      {
        withCredentials: true,
        params: {
          limit,
          sortingKey
        }
      }
    );
  }
  listInvitations() {
    return import_axios.default.get(this.BASE_URL + "guild/invites", { withCredentials: true });
  }
  listApplications() {
    return import_axios.default.get(this.BASE_URL + "guild/applications", { withCredentials: true });
  }
  details(guildId) {
    return import_axios.default.get(this.BASE_URL + "guild/" + guildId, {
      withCredentials: true
    });
  }
  detailMyGuild() {
    return import_axios.default.get(this.BASE_URL + "guild", { withCredentials: true });
  }
  create(name, tag) {
    return import_axios.default.post(this.BASE_URL + "guild", {
      name,
      tag
    }, { withCredentials: true });
  }
  rename(name, tag) {
    return import_axios.default.patch(this.BASE_URL + "guild", {
      name,
      tag
    }, { withCredentials: true });
  }
  delete(guildId) {
    return import_axios.default.delete(this.BASE_URL + "guild/" + guildId, { withCredentials: true });
  }
  invite(guildId, username) {
    return import_axios.default.put(
      this.BASE_URL + "guild/" + guildId + "/invite",
      {
        username
      },
      { withCredentials: true }
    );
  }
  uninvite(guildId, userId) {
    return import_axios.default.patch(
      this.BASE_URL + "guild/" + guildId + "/uninvite/" + userId,
      {},
      { withCredentials: true }
    );
  }
  accept(guildId, userId = null) {
    return import_axios.default.patch(
      this.BASE_URL + "guild/" + guildId + "/accept/" + (userId || ""),
      {},
      { withCredentials: true }
    );
  }
  withdraw(guildId) {
    return import_axios.default.patch(
      this.BASE_URL + "guild/" + guildId + "/withdraw",
      {},
      { withCredentials: true }
    );
  }
  decline(guildId) {
    return import_axios.default.patch(
      this.BASE_URL + "guild/" + guildId + "/decline",
      {},
      { withCredentials: true }
    );
  }
  apply(guildId) {
    return import_axios.default.put(
      this.BASE_URL + "guild/" + guildId + "/apply",
      {},
      { withCredentials: true }
    );
  }
  withdraw(guildId) {
    return import_axios.default.patch(
      this.BASE_URL + "guild/" + guildId + "/withdraw",
      {},
      { withCredentials: true }
    );
  }
  reject(guildId, userId) {
    return import_axios.default.patch(
      this.BASE_URL + "guild/" + guildId + "/reject/" + userId,
      {},
      { withCredentials: true }
    );
  }
  leave(guildId) {
    return import_axios.default.patch(
      this.BASE_URL + "guild/" + guildId + "/leave",
      {},
      { withCredentials: true }
    );
  }
  promote(guildId, userId) {
    return import_axios.default.patch(
      this.BASE_URL + "guild/" + guildId + "/promote/" + userId,
      {},
      { withCredentials: true }
    );
  }
  demote(guildId, userId) {
    return import_axios.default.patch(
      this.BASE_URL + "guild/" + guildId + "/demote/" + userId,
      {},
      { withCredentials: true }
    );
  }
  kick(guildId, userId) {
    return import_axios.default.patch(
      this.BASE_URL + "guild/" + guildId + "/kick/" + userId,
      {},
      { withCredentials: true }
    );
  }
}
var guild_default = new GuildService();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=guild.js.map
