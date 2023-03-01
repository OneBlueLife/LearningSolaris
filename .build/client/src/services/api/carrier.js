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
var carrier_exports = {};
__export(carrier_exports, {
  default: () => carrier_default
});
module.exports = __toCommonJS(carrier_exports);
var import_axios = __toESM(require("axios"));
var import_base = __toESM(require("./base"));
class CarrierService extends import_base.default {
  renameCarrier(gameId, carrierId, name) {
    return import_axios.default.patch(this.BASE_URL + "game/" + gameId + "/carrier/" + carrierId + "/rename", {
      name
    }, { withCredentials: true });
  }
  saveWaypoints(gameId, carrierId, waypoints, looped) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/carrier/" + carrierId + "/waypoints",
      {
        waypoints,
        looped
      },
      { withCredentials: true }
    );
  }
  loopWaypoints(gameId, carrierId, loop) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/carrier/" + carrierId + "/waypoints/loop",
      {
        loop
      },
      { withCredentials: true }
    );
  }
  transferShips(gameId, carrierId, carrierShips, starId, starShips) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/carrier/" + carrierId + "/transfer",
      {
        carrierId,
        carrierShips,
        starId,
        starShips
      },
      { withCredentials: true }
    );
  }
  convertToGift(gameId, carrierId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/carrier/" + carrierId + "/gift",
      {
        carrierId
      },
      { withCredentials: true }
    );
  }
  calculateCombat(gameId, defender, attacker, isTurnBased) {
    return import_axios.default.post(
      this.BASE_URL + "game/" + gameId + "/carrier/calculateCombat",
      {
        defender,
        attacker,
        isTurnBased
      },
      { withCredentials: true }
    );
  }
  scuttle(gameId, carrierId) {
    return import_axios.default.delete(this.BASE_URL + "game/" + gameId + "/carrier/" + carrierId + "/scuttle", { withCredentials: true });
  }
}
var carrier_default = new CarrierService();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=carrier.js.map
