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
var trade_exports = {};
__export(trade_exports, {
  default: () => trade_default
});
module.exports = __toCommonJS(trade_exports);
var import_axios = __toESM(require("axios"));
var import_base = __toESM(require("./base"));
class TradeService extends import_base.default {
  sendCredits(gameId, toPlayerId, amount) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/trade/credits",
      {
        toPlayerId,
        amount
      },
      { withCredentials: true }
    );
  }
  sendCreditsSpecialists(gameId, toPlayerId, amount) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/trade/creditsSpecialists",
      {
        toPlayerId,
        amount
      },
      { withCredentials: true }
    );
  }
  sendRenown(gameId, toPlayerId, amount = 1) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/trade/renown",
      {
        toPlayerId,
        amount
      },
      { withCredentials: true }
    );
  }
  sendTechnology(gameId, toPlayerId, technology, level) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/trade/tech",
      {
        toPlayerId,
        technology,
        level
      },
      { withCredentials: true }
    );
  }
  getTradeableTechnologies(gameId, toPlayerId) {
    return import_axios.default.get(
      this.BASE_URL + "game/" + gameId + "/trade/tech/" + toPlayerId,
      { withCredentials: true }
    );
  }
  listTradeEventsBetweenPlayers(gameId, toPlayerId) {
    return import_axios.default.get(
      this.BASE_URL + "game/" + gameId + "/trade/" + toPlayerId + "/events",
      { withCredentials: true }
    );
  }
}
var trade_default = new TradeService();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=trade.js.map
