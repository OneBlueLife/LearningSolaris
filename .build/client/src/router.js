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
var router_exports = {};
__export(router_exports, {
  default: () => router_default
});
module.exports = __toCommonJS(router_exports);
var import_vue = __toESM(require("vue"));
var import_vue_router = __toESM(require("vue-router"));
var import_Home = __toESM(require("./views/Home.vue"));
var import_MainMenu = __toESM(require("./views/MainMenu.vue"));
var import_PrivacyPolicy = __toESM(require("./views/PrivacyPolicy.vue"));
var import_Achievements = __toESM(require("./views/account/Achievements.vue"));
var import_Creation = __toESM(require("./views/account/Creation.vue"));
var import_ForgotPassword = __toESM(require("./views/account/ForgotPassword.vue"));
var import_ForgotUsername = __toESM(require("./views/account/ForgotUsername.vue"));
var import_ResetEmail = __toESM(require("./views/account/ResetEmail.vue"));
var import_ResetUsername = __toESM(require("./views/account/ResetUsername.vue"));
var import_ResetPassword = __toESM(require("./views/account/ResetPassword.vue"));
var import_ExternalResetPassword = __toESM(require("./views/account/ExternalResetPassword.vue"));
var import_Settings = __toESM(require("./views/account/Settings.vue"));
var import_Game = __toESM(require("./views/game/Game.vue"));
var import_ActiveGames = __toESM(require("./views/game/ActiveGames.vue"));
var import_Create = __toESM(require("./views/game/Create.vue"));
var import_Detail = __toESM(require("./views/game/Detail.vue"));
var import_List = __toESM(require("./views/game/List.vue"));
var import_Leaderboard = __toESM(require("./views/game/Leaderboard.vue"));
var import_MyGuild = __toESM(require("./views/guild/MyGuild.vue"));
var import_Create2 = __toESM(require("./views/guild/Create.vue"));
var import_Rename = __toESM(require("./views/guild/Rename.vue"));
var import_Detail2 = __toESM(require("./views/guild/Detail.vue"));
var import_Administration = __toESM(require("./views/admin/Administration.vue"));
var import_Avatars = __toESM(require("./views/shop/Avatars.vue"));
var import_GalacticCredits = __toESM(require("./views/shop/GalacticCredits.vue"));
var import_PurchaseComplete = __toESM(require("./views/shop/PurchaseComplete.vue"));
var import_PurchaseFailed = __toESM(require("./views/shop/PurchaseFailed.vue"));
import_vue.default.use(import_vue_router.default);
var router_default = new import_vue_router.default({
  routes: [
    {
      path: "/account/achievements/:userId",
      name: "account-achievements",
      component: import_Achievements.default
    },
    {
      path: "/account/create",
      name: "account-creation",
      component: import_Creation.default
    },
    {
      path: "/account/forgot-password",
      name: "account-forgot-password",
      component: import_ForgotPassword.default
    },
    {
      path: "/account/forgot-username",
      name: "account-forgot-username",
      component: import_ForgotUsername.default
    },
    {
      path: "/account/reset-email",
      name: "account-reset-email",
      component: import_ResetEmail.default
    },
    {
      path: "/account/reset-username",
      name: "account-reset-username",
      component: import_ResetUsername.default
    },
    {
      path: "/account/reset-password",
      name: "account-reset-password",
      component: import_ResetPassword.default
    },
    {
      path: "/account/reset-password-external",
      name: "account-reset-password-external",
      component: import_ExternalResetPassword.default
    },
    {
      path: "/account/settings",
      name: "account-settings",
      component: import_Settings.default
    },
    {
      path: "/game",
      name: "game",
      component: import_Game.default
    },
    {
      path: "/game/active-games",
      name: "game-active-games",
      component: import_ActiveGames.default
    },
    {
      path: "/game/create",
      name: "game-creation",
      component: import_Create.default
    },
    {
      path: "/game/detail",
      name: "game-detail",
      component: import_Detail.default
    },
    {
      path: "/game/list",
      name: "game-list",
      component: import_List.default
    },
    {
      path: "/",
      name: "home",
      component: import_Home.default
    },
    {
      path: "/main-menu",
      name: "main-menu",
      component: import_MainMenu.default
    },
    {
      path: "/leaderboard",
      name: "leaderboard",
      component: import_Leaderboard.default
    },
    {
      path: "/guild/create",
      name: "guild-create",
      component: import_Create2.default
    },
    {
      path: "/guild/rename",
      name: "guild-rename",
      component: import_Rename.default
    },
    {
      path: "/guild",
      name: "guild",
      component: import_MyGuild.default
    },
    {
      path: "/guild/details/:guildId",
      name: "guild-details",
      component: import_Detail2.default
    },
    {
      path: "/administration",
      name: "administration",
      component: import_Administration.default
    },
    {
      path: "/avatars",
      name: "avatars",
      component: import_Avatars.default
    },
    {
      path: "/shop",
      name: "galactic-credits-shop",
      component: import_GalacticCredits.default
    },
    {
      path: "/shop/paymentcomplete",
      name: "galactic-credits-shop-payment-complete",
      component: import_PurchaseComplete.default
    },
    {
      path: "/shop/paymentfailed",
      name: "galactic-credits-shop-payment-failed",
      component: import_PurchaseFailed.default
    },
    {
      path: "/privacypolicy",
      name: "privacy-policy",
      component: import_PrivacyPolicy.default
    }
  ]
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=router.js.map
