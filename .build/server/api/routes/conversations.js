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
var conversations_exports = {};
__export(conversations_exports, {
  default: () => conversations_default
});
module.exports = __toCommonJS(conversations_exports);
var import_conversation = __toESM(require("../controllers/conversation"));
var conversations_default = (router, mw, validator, container) => {
  const controller = (0, import_conversation.default)(container);
  router.get(
    "/api/game/:gameId/conversations",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      state: true,
      conversations: true,
      "galaxy.players": true
    }),
    mw.player.loadPlayer,
    controller.list,
    mw.core.handleError
  );
  router.get(
    "/api/game/:gameId/conversations/private/:withPlayerId",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      state: true,
      conversations: true,
      "galaxy.players": true
    }),
    mw.player.loadPlayer,
    controller.listPrivate,
    mw.core.handleError
  );
  router.get(
    "/api/game/:gameId/conversations/unread",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      state: true,
      conversations: true,
      "galaxy.players": true
    }),
    mw.player.loadPlayer,
    controller.getUnreadCount,
    mw.core.handleError
  );
  router.get(
    "/api/game/:gameId/conversations/:conversationId",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      state: true,
      conversations: true,
      "galaxy.players": true
    }),
    mw.player.loadPlayer,
    controller.detail,
    mw.core.handleError
  );
  router.post(
    "/api/game/:gameId/conversations",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      state: true,
      conversations: true,
      "galaxy.players": true
    }),
    mw.game.validateGameState({
      isUnlocked: true
    }),
    mw.player.loadPlayer,
    controller.create,
    mw.core.handleError
  );
  router.patch(
    "/api/game/:gameId/conversations/:conversationId/send",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      state: true,
      conversations: true,
      "galaxy.players": true
    }),
    mw.game.validateGameState({
      isUnlocked: true
    }),
    mw.player.loadPlayer,
    controller.sendMessage,
    mw.core.handleError
  );
  router.patch(
    "/api/game/:gameId/conversations/:conversationId/markAsRead",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      state: true,
      conversations: true,
      "galaxy.players": true
    }),
    mw.game.validateGameState({
      isUnlocked: true
    }),
    mw.player.loadPlayer,
    controller.markAsRead,
    mw.core.handleError
  );
  router.patch(
    "/api/game/:gameId/conversations/:conversationId/mute",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      state: true,
      conversations: true,
      "galaxy.players": true
    }),
    mw.game.validateGameState({
      isUnlocked: true
    }),
    mw.player.loadPlayer,
    controller.mute,
    mw.core.handleError
  );
  router.patch(
    "/api/game/:gameId/conversations/:conversationId/unmute",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      state: true,
      conversations: true,
      "galaxy.players": true
    }),
    mw.game.validateGameState({
      isUnlocked: true
    }),
    mw.player.loadPlayer,
    controller.unmute,
    mw.core.handleError
  );
  router.patch(
    "/api/game/:gameId/conversations/:conversationId/leave",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      state: true,
      conversations: true,
      "galaxy.players": true
    }),
    mw.game.validateGameState({
      isUnlocked: true
    }),
    mw.player.loadPlayer,
    controller.leave,
    mw.core.handleError
  );
  router.patch(
    "/api/game/:gameId/conversations/:conversationId/pin/:messageId",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      state: true,
      conversations: true,
      "galaxy.players": true
    }),
    mw.game.validateGameState({
      isUnlocked: true
    }),
    mw.player.loadPlayer,
    controller.pinMessage,
    mw.core.handleError
  );
  router.patch(
    "/api/game/:gameId/conversations/:conversationId/unpin/:messageId",
    mw.auth.authenticate(),
    mw.game.loadGame({
      lean: true,
      state: true,
      conversations: true,
      "galaxy.players": true
    }),
    mw.game.validateGameState({
      isUnlocked: true
    }),
    mw.player.loadPlayer,
    controller.unpinMessage,
    mw.core.handleError
  );
  return router;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=conversations.js.map
