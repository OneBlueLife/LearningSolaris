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
var badges_exports = {};
__export(badges_exports, {
  default: () => badges_default
});
module.exports = __toCommonJS(badges_exports);
var import_badges = __toESM(require("../controllers/badges"));
var import_badges2 = require("../requests/badges");
var badges_default = (router, mw, validator, container) => {
  const controller = (0, import_badges.default)(container);
  router.get(
    "/api/badges",
    mw.auth.authenticate(),
    controller.listAll,
    mw.core.handleError
  );
  router.get(
    "/api/badges/user/:userId",
    mw.auth.authenticate(),
    controller.listForUser,
    mw.core.handleError
  );
  router.post(
    "/api/badges/game/:gameId/player/:playerId",
    mw.auth.authenticate(),
    validator.body(import_badges2.badgesPurchaseBadgeRequestSchema),
    mw.game.loadGame({
      lean: true,
      state: true,
      "galaxy.players": true
    }),
    controller.purchaseForPlayer,
    mw.core.handleError
  );
  router.post(
    "/api/badges/user/:userId",
    mw.auth.authenticate(),
    validator.body(import_badges2.badgesPurchaseBadgeRequestSchema),
    controller.purchaseForUser,
    mw.core.handleError
  );
  router.get(
    "/api/badges/game/:gameId/player/:playerId",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      state: true,
      settings: true,
      "galaxy.players": true
    }),
    controller.listForPlayer,
    mw.core.handleError
  );
  return router;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=badges.js.map
