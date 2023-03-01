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
var user_exports = {};
__export(user_exports, {
  default: () => user_default
});
module.exports = __toCommonJS(user_exports);
var import_axios = __toESM(require("axios"));
var import_base = __toESM(require("./base"));
class UserService extends import_base.default {
  getMyUserInfo() {
    return import_axios.default.get(this.BASE_URL + "user", { withCredentials: true });
  }
  getUserCredits() {
    return import_axios.default.get(this.BASE_URL + "user/credits", { withCredentials: true });
  }
  getUserAchievements(userId) {
    return import_axios.default.get(this.BASE_URL + "user/achievements/" + userId, { withCredentials: true });
  }
  getUserAvatars() {
    return import_axios.default.get(this.BASE_URL + "user/avatars", { withCredentials: true });
  }
  purchaseAvatar(avatarId) {
    return import_axios.default.post(this.BASE_URL + "user/avatars/" + avatarId + "/purchase", {}, { withCredentials: true });
  }
  getGameSettings() {
    return import_axios.default.get(this.BASE_URL + "user/settings", { withCredentials: true });
  }
  saveGameSettings(settings) {
    return import_axios.default.put(this.BASE_URL + "user/settings", settings, { withCredentials: true });
  }
  getSubscriptions() {
    return import_axios.default.get(this.BASE_URL + "user/subscriptions", { withCredentials: true });
  }
  saveSubscriptions(subscriptions) {
    return import_axios.default.put(this.BASE_URL + "user/subscriptions", subscriptions, { withCredentials: true });
  }
  createUser(email, username, password, recaptchaToken) {
    return import_axios.default.post(this.BASE_URL + "user", {
      email,
      username,
      password,
      recaptchaToken
    });
  }
  toggleEmailNotifications(enabled) {
    return import_axios.default.put(
      this.BASE_URL + "user/changeEmailPreference",
      {
        enabled
      },
      { withCredentials: true }
    );
  }
  toggleEmailOtherNotifications(enabled) {
    return import_axios.default.put(
      this.BASE_URL + "user/changeEmailOtherPreference",
      {
        enabled
      },
      { withCredentials: true }
    );
  }
  updateEmailAddress(email) {
    return import_axios.default.put(
      this.BASE_URL + "user/changeEmailAddress",
      {
        email
      },
      { withCredentials: true }
    );
  }
  updateUsername(username) {
    return import_axios.default.put(
      this.BASE_URL + "user/changeUsername",
      {
        username
      },
      { withCredentials: true }
    );
  }
  updatePassword(currentPassword, newPassword) {
    return import_axios.default.put(
      this.BASE_URL + "user/changePassword",
      {
        currentPassword,
        newPassword
      },
      { withCredentials: true }
    );
  }
  requestResetPassword(email) {
    return import_axios.default.post(this.BASE_URL + "user/requestResetPassword", {
      email
    });
  }
  resetPassword(token, newPassword) {
    return import_axios.default.post(this.BASE_URL + "user/resetPassword", {
      token,
      newPassword
    });
  }
  requestUsername(email) {
    return import_axios.default.post(this.BASE_URL + "user/requestUsername", {
      email
    });
  }
  getLeaderboard(limit, sortingKey, skip) {
    return import_axios.default.get(
      this.BASE_URL + "user/leaderboard",
      {
        withCredentials: true,
        params: {
          limit,
          sortingKey,
          skip
        }
      }
    );
  }
  closeAccount() {
    return import_axios.default.delete(
      this.BASE_URL + "user/closeAccount",
      { withCredentials: true }
    );
  }
}
var user_default = new UserService();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=user.js.map
