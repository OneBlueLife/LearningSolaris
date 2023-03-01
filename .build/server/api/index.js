"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var api_exports = {};
module.exports = __toCommonJS(api_exports);
var import_config = __toESM(require("../config"));
var import_express = __toESM(require("./express"));
var import_db = __toESM(require("../db"));
var import_sockets = __toESM(require("./sockets"));
var import_services = __toESM(require("../services"));
const express = require("express");
const http = require("http");
let mongo;
console.log(`Node ${process.version}`);
async function startServer() {
  mongo = await (0, import_db.default)(import_config.default, {});
  const app = express();
  const server = http.createServer(app);
  const io = (0, import_sockets.default)(server);
  const container = (0, import_services.default)(import_config.default, io);
  await (0, import_express.default)(import_config.default, app, container);
  server.listen(import_config.default.port, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Server is running on port ${import_config.default.port}.`);
  });
  await container.discordService.initialize();
  container.notificationService.initialize();
}
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  console.log("Disconnecting from MongoDB...");
  await mongo.disconnect();
  console.log("MongoDB disconnected.");
  console.log("Shutdown complete.");
  process.exit();
});
startServer();
//# sourceMappingURL=index.js.map
