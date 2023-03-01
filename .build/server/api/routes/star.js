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
var star_exports = {};
__export(star_exports, {
  default: () => star_default
});
module.exports = __toCommonJS(star_exports);
var import_star = __toESM(require("../controllers/star"));
var star_default = (router, mw, validator, container) => {
  const controller = (0, import_star.default)(container);
  router.put(
    "/api/game/:gameId/star/upgrade/economy",
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
    controller.upgradeEconomy,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/star/upgrade/industry",
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
    controller.upgradeIndustry,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/star/upgrade/science",
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
    controller.upgradeScience,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/star/upgrade/bulk",
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
    controller.upgradeBulk,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/star/upgrade/bulkCheck",
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
    controller.upgradeBulkCheck,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/star/build/warpgate",
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
    controller.buildWarpGate,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/star/destroy/warpgate",
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
      isNotFinished: true,
      isStarted: true
    }),
    mw.player.loadPlayer,
    mw.player.validatePlayerState({ isPlayerUndefeated: true }),
    controller.destroyWarpGate,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/star/build/carrier",
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
    controller.buildCarrier,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/star/:starId/transferall",
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
    controller.garrisonAllShips,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/star/:starId/distributeall",
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
    controller.distributeAllShips,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/star/abandon",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: false,
      settings: true,
      state: true,
      galaxy: true,
      constants: true
    }),
    mw.game.validateGameState({
      isUnlocked: true,
      isInProgress: true
    }),
    mw.player.loadPlayer,
    mw.player.validatePlayerState({ isPlayerUndefeated: true }),
    controller.abandon,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/star/toggleignorebulkupgrade",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      settings: true,
      state: true,
      galaxy: true,
      constants: true
    }),
    mw.game.validateGameState({
      isUnlocked: true
    }),
    mw.player.loadPlayer,
    mw.player.validatePlayerState({ isPlayerUndefeated: true }),
    controller.toggleBulkIgnore,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/star/toggleignorebulkupgradeall",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      settings: true,
      state: true,
      galaxy: true,
      constants: true
    }),
    mw.game.validateGameState({
      isUnlocked: true
    }),
    mw.player.loadPlayer,
    mw.player.validatePlayerState({ isPlayerUndefeated: true }),
    controller.toggleBulkIgnoreAll,
    mw.core.handleError
  );
  return router;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=star.js.map
