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
var trade_exports = {};
__export(trade_exports, {
  default: () => trade_default
});
module.exports = __toCommonJS(trade_exports);
var import_trade = __toESM(require("../controllers/trade"));
var trade_default = (router, mw, validator, container) => {
  const controller = (0, import_trade.default)(container);
  router.put(
    "/api/game/:gameId/trade/credits",
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
      isInProgress: true
    }),
    mw.player.loadPlayer,
    mw.player.validatePlayerState({ isPlayerUndefeated: true }),
    controller.sendCredits,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/trade/creditsSpecialists",
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
      isInProgress: true
    }),
    mw.player.loadPlayer,
    mw.player.validatePlayerState({ isPlayerUndefeated: true }),
    controller.sendCreditsSpecialists,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/trade/renown",
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
      isStarted: true
    }),
    mw.player.loadPlayer,
    controller.sendRenown,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/trade/tech",
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
      isInProgress: true
    }),
    mw.player.loadPlayer,
    mw.player.validatePlayerState({ isPlayerUndefeated: true }),
    controller.sendTechnology,
    mw.core.handleError
  );
  router.get(
    "/api/game/:gameId/trade/tech/:toPlayerId",
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
      isInProgress: true
    }),
    mw.player.loadPlayer,
    mw.player.validatePlayerState({ isPlayerUndefeated: true }),
    controller.listTradeableTechnologies,
    mw.core.handleError
  );
  router.get(
    "/api/game/:gameId/trade/:toPlayerId/events",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      state: true,
      "galaxy.players": true
    }),
    mw.player.loadPlayer,
    controller.listTradeEvents,
    mw.core.handleError
  );
  return router;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=trade.js.map
