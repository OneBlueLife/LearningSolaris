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
  ConversationServiceEvents: () => ConversationServiceEvents,
  default: () => ConversationService
});
module.exports = __toCommonJS(conversation_exports);
var import_validation = __toESM(require("../errors/validation"));
const moment = require("moment");
const mongoose = require("mongoose");
const EventEmitter = require("events");
function arrayIsEqual(a, b) {
  if (a.length !== b.length)
    return false;
  const uniqueValues = /* @__PURE__ */ new Set([...a, ...b]);
  for (const v of uniqueValues) {
    const aCount = a.filter((e) => e === v).length;
    const bCount = b.filter((e) => e === v).length;
    if (aCount !== bCount)
      return false;
  }
  return true;
}
function getNewConversation(game, playerId, name, participantIds) {
  if (name == null || !name.length || name.length > 100) {
    throw new import_validation.default(`Name is required and must not exceed 100 characters.`);
  }
  if (playerId && !participantIds.find((x) => x.toString() === playerId.toString())) {
    participantIds.unshift(playerId);
  }
  if (participantIds.length < 2) {
    throw new import_validation.default(`There must be at least 2 participants including yourself.`);
  }
  let existingConvo = game.conversations.filter((c) => c.participants.length === participantIds.length).find((c) => arrayIsEqual(c.participants.map((p) => p.toString()), participantIds));
  if (existingConvo) {
    throw new import_validation.default(`A conversation already exists with the selected participants named [${existingConvo.name}].`);
  }
  let convoId = new mongoose.Types.ObjectId();
  let newConvo = {
    _id: convoId,
    name,
    createdBy: playerId,
    participants: participantIds,
    mutedBy: [],
    messages: []
  };
  return newConvo;
}
const ConversationServiceEvents = {
  onConversationCreated: "onConversationCreated",
  onConversationInvited: "onConversationInvited",
  onConversationMessageSent: "onConversationMessageSent",
  onConversationLeft: "onConversationLeft"
};
class ConversationService extends EventEmitter {
  constructor(gameRepo, tradeService, diplomacyService) {
    super();
    this.gameRepo = gameRepo;
    this.tradeService = tradeService;
    this.diplomacyService = diplomacyService;
  }
  async create(game, playerId, name, participantIds) {
    let newConvo = getNewConversation(game, playerId, name, participantIds);
    await this.gameRepo.updateOne({
      _id: game._id
    }, {
      $push: {
        conversations: newConvo
      }
    });
    this.emit(ConversationServiceEvents.onConversationCreated, {
      gameId: game._id,
      gameTick: game.state.tick,
      convo: newConvo,
      playerId
    });
    for (let i = 1; i < newConvo.participants.length; i++) {
      this.emit(ConversationServiceEvents.onConversationInvited, {
        gameId: game._id,
        gameTick: game.state.tick,
        convo: newConvo,
        playerId: newConvo.participants[i]
      });
    }
    return newConvo;
  }
  createConversationAllPlayers(game) {
    let name = game.settings.general.name;
    let participantIds = game.galaxy.players.map((p) => p._id);
    let newConvo = getNewConversation(game, null, name, participantIds);
    let newMessage = {
      fromPlayerId: null,
      fromPlayerAlias: "Solaris",
      message: "Welcome to " + name + "!\n\nThis is the global chat. Any messages sent here will be delivered to all players in the game!\n\nGood Luck, Commanders!",
      sentDate: moment().utc(),
      sentTick: game.state.tick,
      pinned: false,
      readBy: []
    };
    newConvo.messages.push(newMessage);
    game.conversations.push(newConvo);
  }
  async list(game, playerId) {
    let convos = game.conversations.filter((c) => c.participants.find((p) => p.toString() === playerId.toString()));
    return convos.map((c) => {
      const msgs = c.messages;
      const lastMessage = msgs.slice(-1)[0] || null;
      const unreadCount = msgs.filter((m) => m.readBy.find((r) => r.toString() === playerId.toString()) == null).length;
      const isMuted = c.mutedBy.find((m) => m.toString() === playerId.toString()) != null;
      return {
        _id: c._id,
        participants: c.participants,
        createdBy: c.createdBy,
        name: c.name,
        lastMessage,
        unreadCount,
        isMuted
      };
    });
  }
  async privateChatSummary(game, playerIdA, playerIdB) {
    let convos = await this.list(game, playerIdA);
    let convo = convos.filter((c) => c.participants.length === 2).find((c) => {
      return c.participants.find((a) => a.toString() === playerIdA.toString()) && c.participants.find((b) => b.toString() === playerIdB.toString());
    });
    return convo || null;
  }
  _getConversationForPlayer(game, conversationId, playerId) {
    let convo = game.conversations.find((c) => c._id.toString() === conversationId.toString());
    if (convo == null) {
      throw new import_validation.default(`The conversation requested does not exist.`);
    }
    if (convo.participants.find((p) => p.toString() === playerId.toString() == null)) {
      throw new import_validation.default(`You are not participating in this conversation.`);
    }
    return convo;
  }
  async detail(game, playerId, conversationId) {
    let convo = this._getConversationForPlayer(game, conversationId, playerId);
    convo.isMuted = convo.mutedBy.find((m) => m.toString() === playerId.toString()) != null;
    delete convo.mutedBy;
    convo.messages.forEach((m) => {
      m.type = "message";
    });
    if (convo.participants.length === 2) {
      const playerIdA = playerId;
      const playerIdB = convo.participants.filter((p) => p.toString() !== playerIdA.toString())[0];
      let tradeEvents = await this.tradeService.listTradeEventsBetweenPlayers(game, playerId, convo.participants);
      convo.messages = convo.messages.concat(tradeEvents);
      let diploEvents = await this.diplomacyService.listDiplomacyEventsBetweenPlayers(game, playerIdA, playerIdB);
      convo.messages = convo.messages.concat(diploEvents);
    }
    convo.messages = convo.messages.sort((a, b) => moment(a.sentDate).valueOf() - moment(b.sentDate).valueOf());
    return convo;
  }
  async send(game, player, conversationId, message) {
    message = message.trim();
    if (message === "") {
      throw new import_validation.default(`Message must not be empty.`);
    }
    let convo = game.conversations.find((c) => c._id.toString() === conversationId.toString());
    if (convo == null) {
      throw new import_validation.default(`The conversation requested does not exist.`);
    }
    if (convo.participants.find((p) => p.toString() === player._id.toString() == null)) {
      throw new import_validation.default(`You are not participating in this conversation.`);
    }
    let newMessage = {
      _id: mongoose.Types.ObjectId(),
      fromPlayerId: player._id,
      fromPlayerAlias: player.alias,
      message,
      sentDate: moment().utc(),
      sentTick: game.state.tick,
      pinned: false,
      readBy: convo.mutedBy
    };
    if (!newMessage.readBy.find((r) => r.toString() === player._id.toString())) {
      newMessage.readBy.push(player._id);
    }
    await this.gameRepo.updateOne({
      _id: game._id,
      "conversations._id": conversationId
    }, {
      $push: {
        "conversations.$.messages": newMessage
      }
    });
    const toPlayerIds = convo.participants.filter((p) => p.toString() !== player._id.toString());
    const sentMessageResult = {
      ...newMessage,
      conversationId,
      type: "message",
      toPlayerIds
    };
    let e = {
      gameId: game._id,
      gameTick: game.state.tick,
      conversation: convo,
      sentMessageResult
    };
    this.emit(ConversationServiceEvents.onConversationMessageSent, e);
    return sentMessageResult;
  }
  async markConversationAsRead(game, playerId, conversationId) {
    let convo = this._getConversationForPlayer(game, conversationId, playerId);
    let unreadMessages = convo.messages.filter((m) => m.readBy.find((r) => r.toString() === playerId.toString()) == null).map((m) => m._id);
    if (unreadMessages.length) {
      await this.gameRepo.updateOne(
        {
          _id: game._id,
          "conversations._id": conversationId,
          "conversations.messages._id": {
            $in: unreadMessages
          }
        },
        {
          $addToSet: {
            "conversations.$.messages.$[].readBy": playerId
          }
        }
      );
    }
    return convo;
  }
  async leave(game, playerId, conversationId) {
    let convo = this._getConversationForPlayer(game, conversationId, playerId);
    if (convo.createdBy == null) {
      throw new import_validation.default(`Cannot leave this conversation.`);
    }
    await this.gameRepo.updateOne({
      _id: game._id,
      "conversations._id": conversationId
    }, {
      $pull: {
        "conversations.$.participants": playerId
      }
    });
    this.emit(ConversationServiceEvents.onConversationLeft, {
      gameId: game._id,
      gameTick: game.state.tick,
      convo,
      playerId
    });
    return convo;
  }
  leaveAll(game, playerId) {
    let convos = game.conversations.filter((c) => c.createdBy && c.participants.indexOf(playerId) > -1);
    for (let convo of convos) {
      convo.participants.splice(
        convo.participants.indexOf(playerId),
        1
      );
    }
  }
  getUnreadCount(game, playerId) {
    return (game.conversations || []).filter((c) => c.participants.find((p) => p.toString() === playerId.toString())).reduce((sum, c) => {
      return sum + c.messages.filter((m) => m.readBy.find((r) => r.toString() === playerId.toString()) == null).length;
    }, 0);
  }
  async pinMessage(game, conversationId, messageId) {
    return await this.setPinnedMessage(game, conversationId, messageId, true);
  }
  async unpinMessage(game, conversationId, messageId) {
    return await this.setPinnedMessage(game, conversationId, messageId, false);
  }
  async setPinnedMessage(game, conversationId, messageId, isPinned) {
    return await this.gameRepo.updateOne({
      _id: game._id
    }, {
      $set: {
        "conversations.$[c].messages.$[m].pinned": isPinned
      }
    }, {
      arrayFilters: [
        {
          "c._id": conversationId,
          "c.createdBy": { $ne: null }
        },
        {
          "m._id": messageId
        }
      ]
    });
  }
  async mute(game, playerId, conversationId) {
    return await this.gameRepo.updateOne({
      _id: game._id,
      "conversations._id": conversationId
    }, {
      $addToSet: {
        "conversations.$.mutedBy": playerId
      }
    });
  }
  async unmute(game, playerId, conversationId) {
    return await this.gameRepo.updateOne({
      _id: game._id,
      "conversations._id": conversationId
    }, {
      $pull: {
        "conversations.$.mutedBy": playerId
      }
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ConversationServiceEvents
});
//# sourceMappingURL=conversation.js.map
