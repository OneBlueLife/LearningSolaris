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
var guilds_exports = {};
__export(guilds_exports, {
  default: () => guilds_default
});
module.exports = __toCommonJS(guilds_exports);
var import_guild = __toESM(require("../controllers/guild"));
var guilds_default = (router, mw, validator, container) => {
  const controller = (0, import_guild.default)(container);
  router.get(
    "/api/guild/list",
    mw.auth.authenticate(),
    controller.list,
    mw.core.handleError
  );
  router.get(
    "/api/guild",
    mw.auth.authenticate(),
    controller.detailMine,
    mw.core.handleError
  );
  router.get(
    "/api/guild/leaderboard",
    controller.listLeaderboard,
    mw.core.handleError
  );
  router.get(
    "/api/guild/invites",
    mw.auth.authenticate(),
    controller.listMyInvites,
    mw.core.handleError
  );
  router.get(
    "/api/guild/applications",
    mw.auth.authenticate(),
    controller.listMyApplications,
    mw.core.handleError
  );
  router.get(
    "/api/guild/:guildId",
    mw.auth.authenticate(),
    controller.detail,
    mw.core.handleError
  );
  router.post(
    "/api/guild",
    mw.auth.authenticate(),
    controller.create,
    mw.core.handleError
  );
  router.patch(
    "/api/guild",
    mw.auth.authenticate(),
    controller.rename,
    mw.core.handleError
  );
  router.delete(
    "/api/guild/:guildId",
    mw.auth.authenticate(),
    controller.delete,
    mw.core.handleError
  );
  router.put(
    "/api/guild/:guildId/invite",
    mw.auth.authenticate(),
    controller.invite,
    mw.core.handleError
  );
  router.patch(
    "/api/guild/:guildId/uninvite/:userId",
    mw.auth.authenticate(),
    controller.uninvite,
    mw.core.handleError
  );
  router.patch(
    "/api/guild/:guildId/accept/:userId",
    mw.auth.authenticate(),
    controller.acceptInviteForApplicant,
    mw.core.handleError
  );
  router.patch(
    "/api/guild/:guildId/accept",
    mw.auth.authenticate(),
    controller.acceptInvite,
    mw.core.handleError
  );
  router.patch(
    "/api/guild/:guildId/decline",
    mw.auth.authenticate(),
    controller.declineInvite,
    mw.core.handleError
  );
  router.put(
    "/api/guild/:guildId/apply",
    mw.auth.authenticate(),
    controller.apply,
    mw.core.handleError
  );
  router.patch(
    "/api/guild/:guildId/withdraw",
    mw.auth.authenticate(),
    controller.withdraw,
    mw.core.handleError
  );
  router.patch(
    "/api/guild/:guildId/reject/:userId",
    mw.auth.authenticate(),
    controller.reject,
    mw.core.handleError
  );
  router.patch(
    "/api/guild/:guildId/leave",
    mw.auth.authenticate(),
    controller.leave,
    mw.core.handleError
  );
  router.patch(
    "/api/guild/:guildId/promote/:userId",
    mw.auth.authenticate(),
    controller.promote,
    mw.core.handleError
  );
  router.patch(
    "/api/guild/:guildId/demote/:userId",
    mw.auth.authenticate(),
    controller.demote,
    mw.core.handleError
  );
  router.patch(
    "/api/guild/:guildId/kick/:userId",
    mw.auth.authenticate(),
    controller.kick,
    mw.core.handleError
  );
  return router;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=guilds.js.map
