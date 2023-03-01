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
var import_user = __toESM(require("../controllers/user"));
var user_default = (router, mw, validator, container) => {
  const controller = (0, import_user.default)(container);
  router.get(
    "/api/user/leaderboard",
    controller.listLeaderboard,
    mw.core.handleError
  );
  router.post(
    "/api/user/",
    controller.create,
    mw.core.handleError
  );
  router.get(
    "/api/user/settings",
    controller.getSettings,
    mw.core.handleError
  );
  router.put(
    "/api/user/settings",
    mw.auth.authenticate(),
    controller.saveSettings,
    mw.core.handleError
  );
  router.get(
    "/api/user/subscriptions",
    mw.auth.authenticate(),
    controller.getSubscriptions,
    mw.core.handleError
  );
  router.put(
    "/api/user/subscriptions",
    mw.auth.authenticate(),
    controller.saveSubscriptions,
    mw.core.handleError
  );
  router.get(
    "/api/user/credits",
    mw.auth.authenticate(),
    controller.getCredits,
    mw.core.handleError
  );
  router.get(
    "/api/user/",
    mw.auth.authenticate(),
    controller.detailMe,
    mw.core.handleError
  );
  router.get(
    "/api/user/avatars",
    mw.auth.authenticate(),
    controller.listMyAvatars,
    mw.core.handleError
  );
  router.post(
    "/api/user/avatars/:avatarId/purchase",
    mw.auth.authenticate(),
    controller.purchaseAvatar,
    mw.core.handleError
  );
  router.get(
    "/api/user/:id",
    controller.detail,
    mw.core.handleError
  );
  router.get(
    "/api/user/achievements/:id",
    controller.getAchievements,
    mw.core.handleError
  );
  router.put(
    "/api/user/changeEmailPreference",
    mw.auth.authenticate(),
    controller.updateEmailPreference,
    mw.core.handleError
  );
  router.put(
    "/api/user/changeEmailOtherPreference",
    mw.auth.authenticate(),
    controller.updateEmailOtherPreference,
    mw.core.handleError
  );
  router.put(
    "/api/user/changeUsername",
    mw.auth.authenticate(),
    controller.updateUsername,
    mw.core.handleError
  );
  router.put(
    "/api/user/changeEmailAddress",
    mw.auth.authenticate(),
    controller.updateEmailAddress,
    mw.core.handleError
  );
  router.put(
    "/api/user/changePassword",
    mw.auth.authenticate(),
    controller.updatePassword,
    mw.core.handleError
  );
  router.post(
    "/api/user/requestResetPassword",
    controller.requestPasswordReset,
    mw.core.handleError
  );
  router.post(
    "/api/user/resetPassword",
    controller.resetPassword,
    mw.core.handleError
  );
  router.post(
    "/api/user/requestUsername",
    controller.requestUsername,
    mw.core.handleError
  );
  router.delete(
    "/api/user/closeaccount",
    mw.auth.authenticate(),
    controller.delete,
    mw.core.handleError
  );
  return router;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=user.js.map
