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
var gameState_exports = {};
__export(gameState_exports, {
  default: () => GameStateService
});
module.exports = __toCommonJS(gameState_exports);
const moment = require("moment");
class GameStateService {
  isInProgress(game) {
    return game.state.startDate != null && game.state.endDate == null;
  }
  isStarted(game) {
    return game.state.startDate != null;
  }
  isFinished(game) {
    return game.state.endDate != null;
  }
  isLocked(game) {
    return game.state.locked;
  }
  updateStatePlayerCount(game) {
    if (game.settings.general.type === "tutorial") {
      game.state.players = game.galaxy.players.filter((p) => !p.defeated && !p.afk).length;
    } else {
      game.state.players = game.galaxy.players.filter((p) => p.userId && !p.defeated && !p.afk).length;
    }
  }
  finishGame(game, winnerPlayer) {
    game.state.paused = true;
    game.state.endDate = moment().utc();
    game.state.winner = winnerPlayer._id;
  }
  isCountingDownToEnd(game) {
    return game.state.ticksToEnd != null;
  }
  isCountingDownToEndInLastCycle(game) {
    return this.isCountingDownToEnd(game) && game.state.ticksToEnd < game.settings.galaxy.productionTicks;
  }
  countdownToEnd(game) {
    if (this.isCountingDownToEnd(game)) {
      game.state.ticksToEnd--;
    } else {
      game.state.ticksToEnd = game.settings.kingOfTheHill.productionCycles * game.settings.galaxy.productionTicks;
    }
  }
  setCountdownToEndToOneCycle(game) {
    game.state.ticksToEnd = game.settings.galaxy.productionTicks;
  }
  hasReachedCountdownEnd(game) {
    return game.state.ticksToEnd <= 0;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=gameState.js.map
