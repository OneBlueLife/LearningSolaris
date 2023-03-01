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
var cleanupOldGameHistory_exports = {};
__export(cleanupOldGameHistory_exports, {
  default: () => cleanupOldGameHistory_default
});
module.exports = __toCommonJS(cleanupOldGameHistory_exports);
var cleanupOldGameHistory_default = (container) => {
  const months = 1;
  return {
    async handler(job, done) {
      let games = await container.gameListService.listOldCompletedGamesNotCleaned(months);
      for (let i = 0; i < games.length; i++) {
        let game = games[i];
        console.log(`Deleting history for old game: ${game._id}`);
        try {
          await container.historyService.deleteByGameId(game._id);
          await container.eventService.deleteByGameId(game._id);
          await container.gameService.markAsCleaned(game._id);
        } catch (e) {
          console.error(e);
        }
      }
      console.log("Cleanup completed.");
      done();
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=cleanupOldGameHistory.js.map
