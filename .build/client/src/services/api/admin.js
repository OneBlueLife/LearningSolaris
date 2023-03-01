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
var admin_exports = {};
__export(admin_exports, {
  default: () => admin_default
});
module.exports = __toCommonJS(admin_exports);
var import_axios = __toESM(require("axios"));
var import_base = __toESM(require("./base"));
class AdminService extends import_base.default {
  getUsers() {
    return import_axios.default.get(this.BASE_URL + "admin/user", { withCredentials: true });
  }
  getPasswordResets() {
    return import_axios.default.get(this.BASE_URL + "admin/passwordresets", { withCredentials: true });
  }
  getReports() {
    return import_axios.default.get(this.BASE_URL + "admin/reports", { withCredentials: true });
  }
  setRoleContributor(userId, enabled) {
    return import_axios.default.patch(
      this.BASE_URL + "admin/user/" + userId + "/contributor",
      {
        enabled
      },
      { withCredentials: true }
    );
  }
  setRoleDeveloper(userId, enabled) {
    return import_axios.default.patch(
      this.BASE_URL + "admin/user/" + userId + "/developer",
      {
        enabled
      },
      { withCredentials: true }
    );
  }
  setRoleCommunityManager(userId, enabled) {
    return import_axios.default.patch(
      this.BASE_URL + "admin/user/" + userId + "/communityManager",
      {
        enabled
      },
      { withCredentials: true }
    );
  }
  setRoleGameMaster(userId, enabled) {
    return import_axios.default.patch(
      this.BASE_URL + "admin/user/" + userId + "/gameMaster",
      {
        enabled
      },
      { withCredentials: true }
    );
  }
  setCredits(userId, credits) {
    return import_axios.default.patch(
      this.BASE_URL + "admin/user/" + userId + "/credits",
      {
        credits
      },
      { withCredentials: true }
    );
  }
  ban(userId) {
    return import_axios.default.patch(
      this.BASE_URL + "admin/user/" + userId + "/ban",
      {},
      { withCredentials: true }
    );
  }
  unban(userId) {
    return import_axios.default.patch(
      this.BASE_URL + "admin/user/" + userId + "/unban",
      {},
      { withCredentials: true }
    );
  }
  resetAchievements(userId) {
    return import_axios.default.patch(
      this.BASE_URL + "admin/user/" + userId + "/resetachievements",
      {},
      { withCredentials: true }
    );
  }
  promoteToEstablishedPlayer(userId) {
    return import_axios.default.patch(
      this.BASE_URL + "admin/user/" + userId + "/promoteToEstablishedPlayer",
      {},
      { withCredentials: true }
    );
  }
  impersonate(userId) {
    return import_axios.default.post(
      this.BASE_URL + "admin/user/" + userId + "/impersonate",
      {},
      { withCredentials: true }
    );
  }
  getGames() {
    return import_axios.default.get(this.BASE_URL + "admin/game", { withCredentials: true });
  }
  setGameFeatured(gameId, featured) {
    return import_axios.default.patch(
      this.BASE_URL + "admin/game/" + gameId + "/featured",
      {
        featured
      },
      { withCredentials: true }
    );
  }
  forceGameFinish(gameId) {
    return import_axios.default.patch(
      this.BASE_URL + "admin/game/" + gameId + "/finish",
      {},
      { withCredentials: true }
    );
  }
  setGameTimeMachine(gameId, timeMachine) {
    return import_axios.default.patch(
      this.BASE_URL + "admin/game/" + gameId + "/timeMachine",
      {
        timeMachine
      },
      { withCredentials: true }
    );
  }
  actionReport(reportId) {
    return import_axios.default.patch(
      this.BASE_URL + "admin/reports/" + reportId + "/action",
      {},
      { withCredentials: true }
    );
  }
  getInsights() {
    return import_axios.default.get(this.BASE_URL + "admin/insights", { withCredentials: true });
  }
}
var admin_default = new AdminService();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=admin.js.map
