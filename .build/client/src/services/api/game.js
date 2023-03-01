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
var game_exports = {};
__export(game_exports, {
  default: () => game_default
});
module.exports = __toCommonJS(game_exports);
var import_axios = __toESM(require("axios"));
var import_base = __toESM(require("./base"));
class GameService extends import_base.default {
  getPlayerUserInfo(gameId, playerId) {
    return import_axios.default.get(this.BASE_URL + "game/" + gameId + "/player/" + playerId, { withCredentials: true });
  }
  getDefaultGameSettings() {
    return import_axios.default.get(
      this.BASE_URL + "game/defaultSettings",
      { withCredentials: true }
    );
  }
  getCurrentFlux() {
    return import_axios.default.get(
      this.BASE_URL + "game/flux",
      { withCredentials: true }
    );
  }
  createGame(settings) {
    return import_axios.default.post(
      this.BASE_URL + "game",
      settings,
      { withCredentials: true }
    );
  }
  createTutorialGame() {
    return import_axios.default.post(
      this.BASE_URL + "game/tutorial",
      null,
      { withCredentials: true }
    );
  }
  getGameInfo(id) {
    return import_axios.default.get(
      this.BASE_URL + "game/" + id + "/info",
      { withCredentials: true }
    );
  }
  getGameState(id) {
    return import_axios.default.get(
      this.BASE_URL + "game/" + id + "/state",
      { withCredentials: true }
    );
  }
  getGameIntel(id, startTick, endTick) {
    let url = `${this.BASE_URL}game/${id}/intel?startTick=${startTick.toString()}&endTick=${endTick.toString()}`;
    return import_axios.default.get(url, { withCredentials: true });
  }
  getGameGalaxy(id, tick = null) {
    let path = "game/" + id + "/galaxy";
    if (tick) {
      path += "?tick=" + tick.toString();
    }
    return import_axios.default.get(
      this.BASE_URL + path,
      { withCredentials: true }
    );
  }
  listJoinGamesSummary() {
    return import_axios.default.get(
      this.BASE_URL + "game/list/summary",
      { withCredentials: true }
    );
  }
  listOfficialGames() {
    return import_axios.default.get(
      this.BASE_URL + "game/list/official",
      { withCredentials: true }
    );
  }
  listCustomGames() {
    return import_axios.default.get(
      this.BASE_URL + "game/list/custom",
      { withCredentials: true }
    );
  }
  listInProgressGames() {
    return import_axios.default.get(
      this.BASE_URL + "game/list/inprogress",
      { withCredentials: true }
    );
  }
  listActiveGames() {
    return import_axios.default.get(
      this.BASE_URL + "game/list/active",
      { withCredentials: true }
    );
  }
  listRecentlyCompletedGames() {
    return import_axios.default.get(
      this.BASE_URL + "game/list/completed",
      { withCredentials: true }
    );
  }
  listMyCompletedGames() {
    return import_axios.default.get(
      this.BASE_URL + "game/list/completed/user",
      { withCredentials: true }
    );
  }
  listSpectatingGames() {
    return import_axios.default.get(
      this.BASE_URL + "game/list/spectating",
      { withCredentials: true }
    );
  }
  joinGame(gameId, playerId, alias, avatar, password) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/join",
      {
        playerId,
        alias,
        avatar,
        password
      },
      { withCredentials: true }
    );
  }
  quitGame(gameId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/quit",
      null,
      { withCredentials: true }
    );
  }
  concedeDefeat(gameId, openSlot) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/concedeDefeat",
      {
        openSlot
      },
      { withCredentials: true }
    );
  }
  delete(gameId) {
    return import_axios.default.delete(
      this.BASE_URL + "game/" + gameId,
      { withCredentials: true }
    );
  }
  confirmReady(gameId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/ready",
      null,
      { withCredentials: true }
    );
  }
  confirmReadyToCycle(gameId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/readytocycle",
      null,
      { withCredentials: true }
    );
  }
  unconfirmReady(gameId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/notready",
      null,
      { withCredentials: true }
    );
  }
  confirmReadyToQuit(gameId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/readytoquit",
      null,
      { withCredentials: true }
    );
  }
  unconfirmReadyToQuit(gameId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/notreadytoquit",
      null,
      { withCredentials: true }
    );
  }
  getGameNotes(gameId) {
    return import_axios.default.get(
      this.BASE_URL + "game/" + gameId + "/notes",
      { withCredentials: true }
    );
  }
  updateGameNotes(gameId, notes) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/notes",
      { notes },
      { withCredentials: true }
    );
  }
  touchPlayer(gameId) {
    return import_axios.default.patch(
      this.BASE_URL + "game/" + gameId + "/player/touch",
      {},
      { withCredentials: true }
    );
  }
}
var game_default = new GameService();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=game.js.map
