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
var specialist_exports = {};
__export(specialist_exports, {
  default: () => specialist_default
});
module.exports = __toCommonJS(specialist_exports);
var import_specialist = __toESM(require("../controllers/specialist"));
var specialist_default = (router, mw, validator, container) => {
  const controller = (0, import_specialist.default)(container);
  router.get(
    "/api/game/specialists/bans",
    controller.listBans,
    mw.core.handleError
  );
  router.get(
    "/api/game/specialists/carrier",
    controller.listCarrier,
    mw.core.handleError
  );
  router.get(
    "/api/game/specialists/star",
    controller.listStar,
    mw.core.handleError
  );
  router.get(
    "/api/game/:gameId/specialists/carrier",
    mw.game.loadGame({
      lean: true,
      settings: true,
      state: true,
      galaxy: true,
      constants: true
    }),
    controller.listCarrierForGame,
    mw.core.handleError
  );
  router.get(
    "/api/game/:gameId/specialists/star",
    mw.game.loadGame({
      lean: true,
      settings: true,
      state: true,
      galaxy: true,
      constants: true
    }),
    controller.listStarForGame,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/carrier/:carrierId/hire/:specialistId",
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
    controller.hireCarrier,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/star/:starId/hire/:specialistId",
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
    controller.hireStar,
    mw.core.handleError
  );
  return router;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=specialist.js.map
