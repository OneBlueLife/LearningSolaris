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
var import_admin = __toESM(require("../controllers/admin"));
var import_admin2 = require("../requests/admin");
var admin_default = (router, mw, validator, container) => {
  const controller = (0, import_admin.default)(container);
  router.get(
    "/api/admin/insights",
    mw.auth.authenticate({ admin: true }),
    controller.getInsights,
    mw.core.handleError
  );
  router.get(
    "/api/admin/user",
    mw.auth.authenticate({ communityManager: true }),
    controller.listUsers,
    mw.core.handleError
  );
  router.get(
    "/api/admin/passwordresets",
    mw.auth.authenticate({ admin: true }),
    controller.listPasswordResets,
    mw.core.handleError
  );
  router.get(
    "/api/admin/reports",
    mw.auth.authenticate({ admin: true }),
    controller.listReports,
    mw.core.handleError
  );
  router.patch(
    "/api/admin/reports/:reportId/action",
    mw.auth.authenticate({ admin: true }),
    controller.actionReport,
    mw.core.handleError
  );
  router.patch(
    "/api/admin/user/:userId/contributor",
    mw.auth.authenticate({ admin: true }),
    validator.body(import_admin2.adminSetUserRoleRequestSchema),
    controller.setRoleContributor,
    mw.core.handleError
  );
  router.patch(
    "/api/admin/user/:userId/developer",
    mw.auth.authenticate({ admin: true }),
    validator.body(import_admin2.adminSetUserRoleRequestSchema),
    controller.setRoleDeveloper,
    mw.core.handleError
  );
  router.patch(
    "/api/admin/user/:userId/communityManager",
    mw.auth.authenticate({ admin: true }),
    validator.body(import_admin2.adminSetUserRoleRequestSchema),
    controller.setRoleCommunityManager,
    mw.core.handleError
  );
  router.patch(
    "/api/admin/user/:userId/gameMaster",
    mw.auth.authenticate({ admin: true }),
    validator.body(import_admin2.adminSetUserRoleRequestSchema),
    controller.setRoleGameMaster,
    mw.core.handleError
  );
  router.patch(
    "/api/admin/user/:userId/credits",
    mw.auth.authenticate({ admin: true }),
    validator.body(import_admin2.adminSetUserCreditsRequestSchema),
    controller.setCredits,
    mw.core.handleError
  );
  router.patch(
    "/api/admin/user/:userId/ban",
    mw.auth.authenticate({ admin: true }),
    controller.banUser,
    mw.core.handleError
  );
  router.patch(
    "/api/admin/user/:userId/unban",
    mw.auth.authenticate({ admin: true }),
    controller.unbanUser,
    mw.core.handleError
  );
  router.patch(
    "/api/admin/user/:userId/resetAchievements",
    mw.auth.authenticate({ admin: true }),
    controller.resetAchievements,
    mw.core.handleError
  );
  router.patch(
    "/api/admin/user/:userId/promoteToEstablishedPlayer",
    mw.auth.authenticate({ communityManager: true }),
    controller.promoteToEstablishedPlayer,
    mw.core.handleError
  );
  router.post(
    "/api/admin/user/:userId/impersonate",
    mw.auth.authenticate({ admin: true }),
    controller.impersonate,
    mw.core.handleError
  );
  router.get(
    "/api/admin/game",
    mw.auth.authenticate({ subAdmin: true }),
    controller.listGames,
    mw.core.handleError
  );
  router.patch(
    "/api/admin/game/:gameId/featured",
    mw.auth.authenticate({ subAdmin: true }),
    validator.body(import_admin2.adminSetGameFeaturedRequestSchema),
    controller.setGameFeatured,
    mw.core.handleError
  );
  router.patch(
    "/api/admin/game/:gameId/timeMachine",
    mw.auth.authenticate({ admin: true }),
    validator.body(import_admin2.adminSetGameTimeMachineRequestSchema),
    controller.setGameTimeMachine,
    mw.core.handleError
  );
  router.patch(
    "/api/admin/game/:gameId/finish",
    mw.auth.authenticate({ admin: true }),
    mw.game.loadGame({
      lean: true,
      settings: true,
      state: true,
      "galaxy.players": true
    }),
    mw.game.validateGameState({
      isUnlocked: true,
      isInProgress: true
    }),
    controller.forceEndGame,
    mw.core.handleError
  );
  return router;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=admin.js.map
