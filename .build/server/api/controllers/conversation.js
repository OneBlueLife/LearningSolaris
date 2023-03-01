"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var conversation_exports = {};
__export(conversation_exports, {
  default: () => conversation_default
});
module.exports = __toCommonJS(conversation_exports);
var import_conversation = require("../requests/conversation");
var conversation_default = (container) => {
  return {
    list: async (req, res, next) => {
      try {
        let result = await container.conversationService.list(
          req.game,
          req.player._id
        );
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    },
    listPrivate: async (req, res, next) => {
      try {
        let result = await container.conversationService.privateChatSummary(
          req.game,
          req.player._id,
          req.params.withPlayerId
        );
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    },
    getUnreadCount: async (req, res, next) => {
      try {
        let result = container.conversationService.getUnreadCount(
          req.game,
          req.player._id
        );
        return res.status(200).json({
          unread: result
        });
      } catch (err) {
        return next(err);
      }
    },
    detail: async (req, res, next) => {
      try {
        let result = await container.conversationService.detail(
          req.game,
          req.player._id,
          req.params.conversationId
        );
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    },
    create: async (req, res, next) => {
      try {
        const reqObj = (0, import_conversation.mapToConversationCreateConversationRequest)(req.body);
        let convo = await container.conversationService.create(
          req.game,
          req.player._id,
          reqObj.name,
          reqObj.participants
        );
        return res.status(200).json(convo);
      } catch (err) {
        return next(err);
      }
    },
    sendMessage: async (req, res, next) => {
      try {
        const reqObj = (0, import_conversation.mapToConversationSendMessageRequest)(req.body);
        let message = await container.conversationService.send(
          req.game,
          req.player,
          req.params.conversationId,
          reqObj.message
        );
        container.broadcastService.gameMessageSent(req.game, message);
        return res.status(200).send(message);
      } catch (err) {
        return next(err);
      }
    },
    markAsRead: async (req, res, next) => {
      if (req.session.isImpersonating) {
        return res.sendStatus(200);
      }
      try {
        let convo = await container.conversationService.markConversationAsRead(
          req.game,
          req.player._id,
          req.params.conversationId
        );
        container.broadcastService.gameConversationRead(req.game, convo, req.player._id);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    mute: async (req, res, next) => {
      try {
        await container.conversationService.mute(
          req.game,
          req.player._id,
          req.params.conversationId
        );
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    unmute: async (req, res, next) => {
      try {
        await container.conversationService.unmute(
          req.game,
          req.player._id,
          req.params.conversationId
        );
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    leave: async (req, res, next) => {
      try {
        let convo = await container.conversationService.leave(
          req.game,
          req.player._id,
          req.params.conversationId
        );
        container.broadcastService.gameConversationLeft(req.game, convo, req.player._id);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    pinMessage: async (req, res, next) => {
      try {
        await container.conversationService.pinMessage(
          req.game,
          req.params.conversationId,
          req.params.messageId
        );
        let convo = await container.conversationService.detail(
          req.game,
          req.player._id,
          req.params.conversationId
        );
        container.broadcastService.gameConversationMessagePinned(req.game, convo, req.params.messageId);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    unpinMessage: async (req, res, next) => {
      try {
        await container.conversationService.unpinMessage(
          req.game,
          req.params.conversationId,
          req.params.messageId
        );
        let convo = await container.conversationService.detail(
          req.game,
          req.player._id,
          req.params.conversationId
        );
        container.broadcastService.gameConversationMessageUnpinned(req.game, convo, req.params.messageId);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=conversation.js.map
