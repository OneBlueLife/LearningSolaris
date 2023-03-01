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
var db_exports = {};
__export(db_exports, {
  default: () => db_default
});
module.exports = __toCommonJS(db_exports);
var import_Event = __toESM(require("./models/Event"));
var import_Game = __toESM(require("./models/Game"));
var import_Guild = __toESM(require("./models/Guild"));
var import_History = __toESM(require("./models/History"));
var import_User = __toESM(require("./models/User"));
var import_Payment = __toESM(require("./models/Payment"));
const mongoose = require("mongoose");
var db_default = async (config, options) => {
  async function unlockAgendaJobs(db2) {
    try {
      const collection = await db2.connection.db.collection("agendaJobs");
      const numUnlocked = await collection.updateMany({
        lockedAt: { $exists: true }
      }, {
        $unset: {
          lockedAt: void 0,
          lastModifiedBy: void 0,
          lastRunAt: void 0
        },
        $set: { nextRunAt: new Date() }
      });
      console.log(`Unlocked #${numUnlocked.modifiedCount} jobs.`);
    } catch (e) {
      console.error(e);
    }
  }
  async function syncIndexes() {
    console.log("Syncing indexes...");
    await import_Event.default.syncIndexes();
    await import_Game.default.syncIndexes();
    await import_Guild.default.syncIndexes();
    await import_History.default.syncIndexes();
    await import_User.default.syncIndexes();
    await import_Payment.default.syncIndexes();
    console.log("Indexes synced.");
  }
  const dbConnection = mongoose.connection;
  dbConnection.on("error", console.error.bind(console, "connection error:"));
  options = options || {};
  options.connectionString = options.connectionString || config.connectionString;
  options.syncIndexes = options.syncIndexes == null ? false : options.syncIndexes;
  options.unlockJobs = options.unlockJobs == null ? false : options.unlockJobs;
  options.poolSize = options.poolSize || 5;
  console.log(`Connecting to database: ${options.connectionString}`);
  const db = await mongoose.connect(options.connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    keepAlive: true,
    poolSize: options.poolSize
  });
  if (options.syncIndexes) {
    await syncIndexes();
  }
  if (options.unlockJobs) {
    await unlockAgendaJobs(db);
  }
  console.log("MongoDB intialized.");
  return db;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=index.js.map
