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
var gameTick_exports = {};
__export(gameTick_exports, {
  default: () => gameTick_default
});
module.exports = __toCommonJS(gameTick_exports);
var gameTick_default = (container) => {
  return {
    async handler(job, done) {
      let games = await container.gameListService.listInProgressGamesGameTick();
      for (let i = 0; i < games.length; i++) {
        let game = games[i];
        if (container.gameTickService.canTick(game)) {
          try {
            await container.gameService.lock(game._id, true);
            await container.gameTickService.tick(game._id);
          } catch (e) {
            console.error(e);
          } finally {
            await container.gameService.lock(game._id, false);
          }
        }
      }
      done();
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=gameTick.js.map
