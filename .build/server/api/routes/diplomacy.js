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
var diplomacy_exports = {};
__export(diplomacy_exports, {
  default: () => diplomacy_default
});
module.exports = __toCommonJS(diplomacy_exports);
var import_diplomacy = __toESM(require("../controllers/diplomacy"));
var diplomacy_default = (router, mw, validator, container) => {
  const controller = (0, import_diplomacy.default)(container);
  router.get(
    "/api/game/:gameId/diplomacy",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      "galaxy.players": true
    }),
    mw.player.loadPlayer,
    controller.list,
    mw.core.handleError
  );
  router.get(
    "/api/game/:gameId/diplomacy/:toPlayerId",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      "galaxy.players": true
    }),
    mw.player.loadPlayer,
    controller.detail,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/diplomacy/ally/:playerId",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      settings: true,
      state: true,
      galaxy: true,
      constants: true
    }),
    mw.game.validateGameState({
      isUnlocked: true,
      isNotFinished: true
    }),
    mw.player.loadPlayer,
    mw.player.validatePlayerState({ isPlayerUndefeated: true }),
    controller.declareAlly,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/diplomacy/enemy/:playerId",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      settings: true,
      state: true,
      galaxy: true,
      constants: true
    }),
    mw.game.validateGameState({
      isUnlocked: true,
      isNotFinished: true
    }),
    mw.player.loadPlayer,
    mw.player.validatePlayerState({ isPlayerUndefeated: true }),
    controller.declareEnemy,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/diplomacy/neutral/:playerId",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      settings: true,
      state: true,
      galaxy: true,
      constants: true
    }),
    mw.game.validateGameState({
      isUnlocked: true,
      isNotFinished: true
    }),
    mw.player.loadPlayer,
    mw.player.validatePlayerState({ isPlayerUndefeated: true }),
    controller.declareNeutral,
    mw.core.handleError
  );
  return router;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=diplomacy.js.map
