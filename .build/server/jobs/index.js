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
var jobs_exports = {};
module.exports = __toCommonJS(jobs_exports);
var import_config = __toESM(require("../config"));
var import_db = __toESM(require("../db"));
var import_services = __toESM(require("../services"));
var import_gameTick = __toESM(require("./gameTick"));
var import_officialGamesCheck = __toESM(require("./officialGamesCheck"));
var import_cleanupGamesTimedOut = __toESM(require("./cleanupGamesTimedOut"));
var import_cleanupOldGameHistory = __toESM(require("./cleanupOldGameHistory"));
var import_cleanupOldTutorials = __toESM(require("./cleanupOldTutorials"));
var import_sendReviewReminders = __toESM(require("./sendReviewReminders"));
const Agenda = require("agenda");
let mongo;
async function startup() {
  const container = (0, import_services.default)(import_config.default, null);
  mongo = await (0, import_db.default)(import_config.default, {
    unlockJobs: true,
    poolSize: 1
  });
  await container.discordService.initialize();
  container.notificationService.initialize();
  console.log("Unlock all games...");
  await container.gameService.lockAll(false);
  console.log("All games unlocked");
  const gameTickJob = (0, import_gameTick.default)(container);
  const officialGamesCheckJob = (0, import_officialGamesCheck.default)(container);
  const cleanupGamesTimedOutJob = (0, import_cleanupGamesTimedOut.default)(container);
  const cleanupOldGameHistory = (0, import_cleanupOldGameHistory.default)(container);
  const cleanupOldTutorials = (0, import_cleanupOldTutorials.default)(container);
  const sendReviewReminders = (0, import_sendReviewReminders.default)(container);
  const agendajs = new Agenda().database(import_config.default.connectionString).processEvery("10 seconds").maxConcurrency(20);
  await agendajs._ready;
  agendajs.define(
    "game-tick",
    {
      priority: "high",
      concurrency: 10
    },
    gameTickJob.handler
  );
  agendajs.define(
    "new-player-game-check",
    {
      priority: "high",
      concurrency: 1
    },
    officialGamesCheckJob.handler
  );
  agendajs.define(
    "cleanup-games-timed-out",
    {
      priority: "high",
      concurrency: 1
    },
    cleanupGamesTimedOutJob.handler
  );
  agendajs.define(
    "cleanup-old-game-history",
    {
      priority: "high",
      concurrency: 1
    },
    cleanupOldGameHistory.handler
  );
  agendajs.define(
    "cleanup-old-tutorials",
    {
      priority: "high",
      concurrency: 1
    },
    cleanupOldTutorials.handler
  );
  agendajs.define(
    "send-review-reminders",
    {
      priority: "high",
      concurrency: 1
    },
    sendReviewReminders.handler
  );
  agendajs.start();
  agendajs.every("10 seconds", "game-tick");
  agendajs.every("1 minute", "new-player-game-check");
  agendajs.every("1 hour", "cleanup-games-timed-out");
  agendajs.every("1 day", "cleanup-old-game-history");
  agendajs.every("1 day", "cleanup-old-tutorials");
  agendajs.every("10 seconds", "send-review-reminders");
}
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await mongo.disconnect();
  console.log("Shutdown complete.");
  process.exit();
});
startup().then(() => {
  console.log("Jobs started.");
});
//# sourceMappingURL=index.js.map
