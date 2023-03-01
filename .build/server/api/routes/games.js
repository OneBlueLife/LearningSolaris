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
var games_exports = {};
__export(games_exports, {
  default: () => games_default
});
module.exports = __toCommonJS(games_exports);
var import_game = __toESM(require("../controllers/game"));
var games_default = (router, mw, validator, container) => {
  const controller = (0, import_game.default)(container);
  router.get(
    "/api/game/defaultSettings",
    mw.auth.authenticate(),
    controller.getDefaultSettings,
    mw.core.handleError
  );
  router.get(
    "/api/game/flux",
    controller.getFlux,
    mw.core.handleError
  );
  router.post(
    "/api/game/",
    mw.auth.authenticate(),
    controller.create,
    mw.core.handleError
  );
  router.post(
    "/api/game/tutorial",
    mw.auth.authenticate(),
    controller.createTutorial,
    mw.core.handleError
  );
  router.get(
    "/api/game/:gameId/info",
    mw.game.loadGame({
      lean: true,
      settings: true,
      state: true,
      constants: true
    }),
    (req, res, next) => {
      var _a;
      try {
        if (req.game.settings.general.createdByUserId) {
          req.game.settings.general.isGameAdmin = req.game.settings.general.createdByUserId.toString() === ((_a = req.session.userId) == null ? void 0 : _a.toString());
        } else {
          req.game.settings.general.isGameAdmin = false;
        }
        delete req.game.settings.general.password;
        next();
      } catch (err) {
        next(err);
      }
    },
    controller.detailInfo,
    mw.core.handleError
  );
  router.get(
    "/api/game/:gameId/state",
    mw.game.loadGame({
      lean: true,
      state: true
    }),
    controller.detailState,
    mw.core.handleError
  );
  router.get(
    "/api/game/:gameId/galaxy",
    controller.detailGalaxy,
    mw.core.handleError
  );
  router.get(
    "/api/game/list/summary",
    controller.listSummary,
    mw.core.handleError
  );
  router.get(
    "/api/game/list/official",
    controller.listOfficial,
    mw.core.handleError
  );
  router.get(
    "/api/game/list/custom",
    controller.listCustom,
    mw.core.handleError
  );
  router.get(
    "/api/game/list/inprogress",
    controller.listInProgress,
    mw.core.handleError
  );
  router.get(
    "/api/game/list/completed",
    mw.auth.authenticate(),
    controller.listRecentlyCompleted,
    mw.core.handleError
  );
  router.get(
    "/api/game/list/completed/user",
    mw.auth.authenticate(),
    controller.listMyCompleted,
    mw.core.handleError
  );
  router.get(
    "/api/game/list/active",
    mw.auth.authenticate(),
    controller.listMyActiveGames,
    mw.core.handleError
  );
  router.get(
    "/api/game/list/spectating",
    mw.auth.authenticate(),
    controller.listSpectating,
    mw.core.handleError
  );
  router.get(
    "/api/game/:gameId/intel",
    mw.auth.authenticate(),
    controller.getIntel,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/join",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: false,
      settings: true,
      galaxy: true,
      conversations: true,
      state: true,
      constants: true,
      quitters: true,
      afkers: true
    }),
    mw.game.validateGameState({
      isUnlocked: true
    }),
    controller.join,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/quit",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: false,
      settings: true,
      galaxy: true,
      conversations: true,
      state: true,
      constants: true,
      quitters: true,
      afkers: true
    }),
    mw.game.validateGameState({
      isUnlocked: true
    }),
    mw.player.loadPlayer,
    mw.player.validatePlayerState({ isPlayerUndefeated: true }),
    controller.quit,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/concedeDefeat",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: false,
      settings: true,
      state: true,
      galaxy: true,
      constants: true,
      quitters: true
    }),
    mw.game.validateGameState({
      isUnlocked: true,
      isInProgress: true
    }),
    mw.player.loadPlayer,
    mw.player.validatePlayerState({ isPlayerUndefeated: true }),
    controller.concede,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/ready",
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
    controller.ready,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/readytocycle",
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
    controller.readyToCycle,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/notready",
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
    controller.unready,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/readyToQuit",
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
    controller.readyToQuit,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/notReadyToQuit",
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
    controller.unreadyToQuit,
    mw.core.handleError
  );
  router.get(
    "/api/game/:gameId/notes",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      settings: false,
      state: false,
      galaxy: true,
      constants: false
    }),
    mw.player.loadPlayer,
    controller.getNotes,
    mw.core.handleError
  );
  router.put(
    "/api/game/:gameId/notes",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      settings: false,
      state: true,
      galaxy: true,
      constants: false
    }),
    mw.game.validateGameState({
      isUnlocked: true
    }),
    mw.player.loadPlayer,
    controller.saveNotes,
    mw.core.handleError
  );
  router.delete(
    "/api/game/:gameId",
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
    controller.delete,
    mw.core.handleError
  );
  router.get(
    "/api/game/:gameId/player/:playerId",
    mw.game.loadGame({
      lean: true,
      settings: true,
      "galaxy.players": true
    }),
    controller.getPlayerUser,
    mw.core.handleError
  );
  router.patch(
    "/api/game/:gameId/player/touch",
    mw.auth.authenticate(),
    controller.touch,
    mw.core.handleError
  );
  return router;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=games.js.map
