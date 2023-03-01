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
var ledger_exports = {};
__export(ledger_exports, {
  default: () => ledger_default
});
module.exports = __toCommonJS(ledger_exports);
var import_axios = __toESM(require("axios"));
var import_base = __toESM(require("./base"));
class LedgerService extends import_base.default {
  getLedgerCredits(gameId) {
    return import_axios.default.get(
      this.BASE_URL + "game/" + gameId + "/ledger/credits",
      { withCredentials: true }
    );
  }
  forgiveDebtCredits(gameId, playerId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/ledger/credits/forgive/" + playerId,
      {},
      { withCredentials: true }
    );
  }
  settleDebtCredits(gameId, playerId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/ledger/credits/settle/" + playerId,
      {},
      { withCredentials: true }
    );
  }
  getLedgerCreditsSpecialists(gameId) {
    return import_axios.default.get(
      this.BASE_URL + "game/" + gameId + "/ledger/creditsSpecialists",
      { withCredentials: true }
    );
  }
  forgiveDebtCreditsSpecialists(gameId, playerId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/ledger/creditsSpecialists/forgive/" + playerId,
      {},
      { withCredentials: true }
    );
  }
  settleDebtCreditsSpecialists(gameId, playerId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/ledger/creditsSpecialists/settle/" + playerId,
      {},
      { withCredentials: true }
    );
  }
}
var ledger_default = new LedgerService();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=ledger.js.map
