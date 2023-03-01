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
var broadcast_exports = {};
__export(broadcast_exports, {
  default: () => BroadcastService
});
module.exports = __toCommonJS(broadcast_exports);
class BroadcastService {
  constructor(io) {
    this.io = io;
  }
  roomExists(socketId) {
    return this.io && this.io.sockets.adapter.rooms[socketId.toString()] != null;
  }
  playerRoomExists(player) {
    return this.io && this.io.sockets.adapter.rooms[player._id.toString()] != null;
  }
  getOnlinePlayers(game) {
    return game.galaxy.players.filter((p) => this.playerRoomExists(p));
  }
  gameStarted(game) {
    this.io.to(game._id).emit("gameStarted", {
      state: game.state
    });
  }
  gamePlayerJoined(game, playerId, alias, avatar) {
    this.io.to(game._id).emit("gamePlayerJoined", {
      playerId,
      alias,
      avatar
    });
  }
  gamePlayerQuit(game, player) {
    this.io.to(game._id).emit("gamePlayerQuit", {
      playerId: player._id
    });
  }
  gamePlayerReady(game, player) {
    this.io.to(game._id).emit("gamePlayerReady", {
      playerId: player._id
    });
  }
  gamePlayerNotReady(game, player) {
    this.io.to(game._id).emit("gamePlayerNotReady", {
      playerId: player._id
    });
  }
  gamePlayerReadyToQuit(game, player) {
    this.io.to(game._id).emit("gamePlayerReadyToQuit", {
      playerId: player._id
    });
  }
  gamePlayerNotReadyToQuit(game, player) {
    this.io.to(game._id).emit("gamePlayerNotReadyToQuit", {
      playerId: player._id
    });
  }
  gameMessageSent(game, message) {
    message.toPlayerIds.forEach((p) => this.io.to(p).emit("gameMessageSent", message));
  }
  gameConversationRead(game, conversation, readByPlayerId) {
    conversation.participants.forEach((p) => this.io.to(p).emit("gameConversationRead", {
      conversationId: conversation._id,
      readByPlayerId
    }));
  }
  gameConversationLeft(game, conversation, playerId) {
    conversation.participants.forEach((p) => this.io.to(p).emit("gameConversationLeft", {
      conversationId: conversation._id,
      playerId
    }));
  }
  gameConversationMessagePinned(game, conversation, messageId) {
    conversation.participants.forEach((p) => this.io.to(p).emit("gameConversationMessagePinned", {
      conversationId: conversation._id,
      messageId
    }));
  }
  gameConversationMessageUnpinned(game, conversation, messageId) {
    conversation.participants.forEach((p) => this.io.to(p).emit("gameConversationMessageUnpinned", {
      conversationId: conversation._id,
      messageId
    }));
  }
  playerEventRead(game, playerId, eventId) {
    this.io.to(playerId).emit("playerEventRead", {
      eventId
    });
  }
  playerAllEventsRead(game, playerId) {
    this.io.to(playerId).emit("playerAllEventsRead", {});
  }
  gamePlayerCreditsReceived(game, fromPlayerId, toPlayerId, credits, date) {
    this.io.to(toPlayerId).emit("playerCreditsReceived", {
      playerId: toPlayerId,
      type: "playerCreditsReceived",
      date,
      data: {
        fromPlayerId,
        toPlayerId,
        credits
      }
    });
  }
  gamePlayerCreditsSpecialistsReceived(game, fromPlayerId, toPlayerId, creditsSpecialists, date) {
    this.io.to(toPlayerId).emit("playerCreditsSpecialistsReceived", {
      playerId: toPlayerId,
      type: "playerCreditsSpecialistsReceived",
      date,
      data: {
        fromPlayerId,
        toPlayerId,
        creditsSpecialists
      }
    });
  }
  gamePlayerRenownReceived(game, fromPlayerId, toPlayerId, renown, date) {
    this.io.to(toPlayerId).emit("playerRenownReceived", {
      playerId: toPlayerId,
      type: "playerRenownReceived",
      date,
      data: {
        fromPlayerId,
        toPlayerId,
        renown
      }
    });
  }
  gamePlayerTechnologyReceived(game, fromPlayerId, toPlayerId, technology, date) {
    this.io.to(toPlayerId).emit("playerTechnologyReceived", {
      playerId: toPlayerId,
      type: "playerTechnologyReceived",
      date,
      data: {
        fromPlayerId,
        toPlayerId,
        technology
      }
    });
  }
  gamePlayerDebtAdded(debtorPlayerId, creditorPlayerId, amount, ledgerType) {
    let data = {
      debtorPlayerId,
      creditorPlayerId,
      amount,
      ledgerType
    };
    this.io.to(debtorPlayerId).emit("playerDebtAdded", data);
    this.io.to(creditorPlayerId).emit("playerDebtAdded", data);
  }
  gamePlayerDebtForgiven(debtorPlayerId, creditorPlayerId, amount, ledgerType) {
    let data = {
      debtorPlayerId,
      creditorPlayerId,
      amount,
      ledgerType
    };
    this.io.to(debtorPlayerId).emit("playerDebtForgiven", data);
    this.io.to(creditorPlayerId).emit("playerDebtForgiven", data);
  }
  gamePlayerDebtSettled(debtorPlayerId, creditorPlayerId, amount, ledgerType) {
    let data = {
      debtorPlayerId,
      creditorPlayerId,
      amount,
      ledgerType
    };
    this.io.to(debtorPlayerId).emit("playerDebtSettled", data);
    this.io.to(creditorPlayerId).emit("playerDebtSettled", data);
  }
  gamePlayerDiplomaticStatusChanged(playerIdFrom, playerIdTo, diplomaticStatus) {
    let data = {
      diplomaticStatus
    };
    this.io.to(playerIdFrom).emit("playerDiplomaticStatusChanged", data);
    this.io.to(playerIdTo).emit("playerDiplomaticStatusChanged", data);
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=broadcast.js.map
