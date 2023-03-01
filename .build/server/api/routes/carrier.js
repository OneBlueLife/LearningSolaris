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
var carrier_exports = {};
__export(carrier_exports, {
  default: () => carrier_default
});
module.exports = __toCommonJS(carrier_exports);
var import_carrier = __toESM(require("../controllers/carrier"));
var carrier_default = (router, mw, validator, container) => {
  const controller = (0, import_carrier.default)(container);
  router.put(
    "/api/game/:gameId/carrier/:carrierId/waypoints",
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
    controller.saveWaypoints,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/carrier/:carrierId/waypoints/loop",
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
    controller.loopWaypoints,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/carrier/:carrierId/transfer",
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
    controller.transferShips,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/carrier/:carrierId/gift",
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
    controller.gift,
    mw.core.handleError
  );
  router.patch(
    "/api/game/:gameId/carrier/:carrierId/rename",
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
    controller.rename,
    mw.core.handleError
  );
  router.delete(
    "/api/game/:gameId/carrier/:carrierId/scuttle",
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
    controller.scuttle,
    mw.core.handleError
  );
  router.post(
    "/api/game/:gameId/carrier/calculateCombat",
    mw.auth.authenticate(),
    controller.calculateCombat,
    mw.core.handleError
  );
  return router;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=carrier.js.map
