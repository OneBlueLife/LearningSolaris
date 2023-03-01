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
var spectator_exports = {};
__export(spectator_exports, {
  default: () => spectator_default
});
module.exports = __toCommonJS(spectator_exports);
var import_spectator = __toESM(require("../controllers/spectator"));
var import_spectator2 = require("../requests/spectator");
var spectator_default = (router, mw, validator, container) => {
  const controller = (0, import_spectator.default)(container);
  router.get(
    "/api/game/:gameId/spectators",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      settings: true,
      state: true,
      galaxy: true,
      constants: false
    }),
    mw.game.validateGameState({
      isUnlocked: true,
      isNotFinished: true
    }),
    mw.player.loadPlayer,
    controller.list,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/spectators/invite",
    mw.auth.authenticate(),
    validator.body(import_spectator2.spectatorInviteSpectatorRequestSchema),
    mw.game.loadGame({
      lean: true,
      settings: true,
      state: true,
      galaxy: true,
      constants: false
    }),
    mw.game.validateGameState({
      isUnlocked: true,
      isNotFinished: true
    }),
    mw.player.loadPlayer,
    mw.player.validatePlayerState({ isPlayerUndefeated: true }),
    controller.invite,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/spectators/uninvite/:userId",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      settings: true,
      state: true,
      galaxy: true,
      constants: false
    }),
    mw.game.validateGameState({
      isUnlocked: true,
      isNotFinished: true
    }),
    mw.player.loadPlayer,
    mw.player.validatePlayerState({ isPlayerUndefeated: true }),
    controller.uninvite,
    mw.core.handleError
  );
  router.delete(
    "/api/game/:gameId/spectators",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      settings: true,
      state: true,
      galaxy: true,
      constants: false
    }),
    mw.game.validateGameState({
      isUnlocked: true,
      isNotFinished: true
    }),
    mw.player.loadPlayer,
    mw.player.validatePlayerState({ isPlayerUndefeated: true }),
    controller.clear,
    mw.core.handleError
  );
  return router;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=spectator.js.map
