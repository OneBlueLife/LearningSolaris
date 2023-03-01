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
var star_exports = {};
__export(star_exports, {
  default: () => star_default
});
module.exports = __toCommonJS(star_exports);
var import_axios = __toESM(require("axios"));
var import_base = __toESM(require("./base"));
class StarService extends import_base.default {
  upgradeEconomy(gameId, starId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/star/upgrade/economy",
      {
        starId
      },
      { withCredentials: true }
    );
  }
  upgradeIndustry(gameId, starId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/star/upgrade/industry",
      {
        starId
      },
      { withCredentials: true }
    );
  }
  upgradeScience(gameId, starId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/star/upgrade/science",
      {
        starId
      },
      { withCredentials: true }
    );
  }
  bulkInfrastructureUpgrade(gameId, upgradeStrategy, infrastructure, amount) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/star/upgrade/bulk",
      {
        upgradeStrategy,
        infrastructure,
        amount
      },
      { withCredentials: true }
    );
  }
  checkBulkUpgradedAmount(gameId, upgradeStrategy, infrastructure, amount) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/star/upgrade/bulkCheck",
      {
        upgradeStrategy,
        infrastructure,
        amount
      },
      { withCredentials: true }
    );
  }
  buildWarpGate(gameId, starId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/star/build/warpgate",
      {
        starId
      },
      { withCredentials: true }
    );
  }
  destroyWarpGate(gameId, starId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/star/destroy/warpgate",
      {
        starId
      },
      { withCredentials: true }
    );
  }
  abandonStar(gameId, starId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/star/abandon",
      {
        starId
      },
      { withCredentials: true }
    );
  }
  buildCarrier(gameId, starId, ships = 1) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/star/build/carrier",
      {
        starId,
        ships
      },
      { withCredentials: true }
    );
  }
  transferAllToStar(gameId, starId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/star/" + starId + "/transferall",
      {},
      { withCredentials: true }
    );
  }
  distributeAllShips(gameId, starId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/star/" + starId + "/distributeall",
      {},
      { withCredentials: true }
    );
  }
  toggleIgnoreBulkUpgrade(gameId, starId, infrastructureType) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/star/toggleignorebulkupgrade",
      {
        starId,
        infrastructureType
      },
      { withCredentials: true }
    );
  }
  toggleIgnoreBulkUpgradeAll(gameId, starId, ignoreStatus) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/star/toggleignorebulkupgradeall",
      {
        starId,
        ignoreStatus
      },
      { withCredentials: true }
    );
  }
}
var star_default = new StarService();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=star.js.map
