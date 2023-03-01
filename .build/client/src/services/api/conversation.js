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
var conversation_exports = {};
__export(conversation_exports, {
  default: () => conversation_default
});
module.exports = __toCommonJS(conversation_exports);
var import_axios = __toESM(require("axios"));
var import_base = __toESM(require("./base"));
class ConversationService extends import_base.default {
  list(gameId) {
    return import_axios.default.get(
      this.BASE_URL + "game/" + gameId + "/conversations",
      { withCredentials: true }
    );
  }
  privateChatSummary(gameId, withPlayerId) {
    return import_axios.default.get(
      this.BASE_URL + "game/" + gameId + "/conversations/private/" + withPlayerId,
      { withCredentials: true }
    );
  }
  detail(gameId, conversationId) {
    return import_axios.default.get(
      this.BASE_URL + "game/" + gameId + "/conversations/" + conversationId,
      { withCredentials: true }
    );
  }
  create(gameId, name, participants) {
    return import_axios.default.post(
      this.BASE_URL + "game/" + gameId + "/conversations",
      {
        name,
        participants
      },
      { withCredentials: true }
    );
  }
  send(gameId, conversationId, message) {
    return import_axios.default.patch(
      this.BASE_URL + "game/" + gameId + "/conversations/" + conversationId + "/send",
      {
        message
      },
      { withCredentials: true }
    );
  }
  markAsRead(gameId, conversationId) {
    return import_axios.default.patch(
      this.BASE_URL + "game/" + gameId + "/conversations/" + conversationId + "/markAsRead",
      {},
      { withCredentials: true }
    );
  }
  leave(gameId, conversationId) {
    return import_axios.default.patch(
      this.BASE_URL + "game/" + gameId + "/conversations/" + conversationId + "/leave",
      {},
      { withCredentials: true }
    );
  }
  getUnreadCount(gameId) {
    return import_axios.default.get(
      this.BASE_URL + "game/" + gameId + "/conversations/unread",
      { withCredentials: true }
    );
  }
  pinMessage(gameId, conversationId, messageId) {
    return import_axios.default.patch(
      this.BASE_URL + "game/" + gameId + "/conversations/" + conversationId + "/pin/" + messageId,
      {},
      { withCredentials: true }
    );
  }
  unpinMessage(gameId, conversationId, messageId) {
    return import_axios.default.patch(
      this.BASE_URL + "game/" + gameId + "/conversations/" + conversationId + "/unpin/" + messageId,
      {},
      { withCredentials: true }
    );
  }
  mute(gameId, conversationId) {
    return import_axios.default.patch(
      this.BASE_URL + "game/" + gameId + "/conversations/" + conversationId + "/mute",
      {},
      { withCredentials: true }
    );
  }
  unmute(gameId, conversationId) {
    return import_axios.default.patch(
      this.BASE_URL + "game/" + gameId + "/conversations/" + conversationId + "/unmute",
      {},
      { withCredentials: true }
    );
  }
}
var conversation_default = new ConversationService();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=conversation.js.map
