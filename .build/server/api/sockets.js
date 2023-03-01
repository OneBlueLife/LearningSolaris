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
var sockets_exports = {};
__export(sockets_exports, {
  default: () => sockets_default
});
module.exports = __toCommonJS(sockets_exports);
const socketio = require("socket.io");
var sockets_default = (server) => {
  const io = socketio(server);
  io.on("connection", (socket) => {
    socket.on("gameRoomJoined", (data) => {
      socket.join(data.gameId);
      socket.join(data.userId);
      if (data.playerId) {
        socket.join(data.playerId);
        socket.to(data.gameId).emit("gamePlayerRoomJoined", {
          playerId: data.playerId
        });
      }
    });
    socket.on("gameRoomLeft", (data) => {
      socket.leave(data.gameId);
      socket.leave(data.userId);
      if (data.playerId) {
        socket.leave(data.playerId);
        socket.to(data.gameId).emit("gamePlayerRoomLeft", {
          playerId: data.playerId
        });
      }
    });
  });
  console.log("Sockets initialized.");
  return io;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=sockets.js.map
