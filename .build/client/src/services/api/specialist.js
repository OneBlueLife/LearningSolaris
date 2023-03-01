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
var specialist_exports = {};
__export(specialist_exports, {
  default: () => specialist_default
});
module.exports = __toCommonJS(specialist_exports);
var import_axios = __toESM(require("axios"));
var import_base = __toESM(require("./base"));
class SpecialistService extends import_base.default {
  listBans() {
    return import_axios.default.get(
      this.BASE_URL + "game/specialists/bans",
      { withCredentials: true }
    );
  }
  getCarrierSpecialists(gameId) {
    if (gameId) {
      return import_axios.default.get(
        this.BASE_URL + "game/" + gameId + "/specialists/carrier",
        { withCredentials: true }
      );
    }
    return import_axios.default.get(
      this.BASE_URL + "game/specialists/carrier",
      { withCredentials: true }
    );
  }
  getStarSpecialists(gameId) {
    if (gameId) {
      return import_axios.default.get(
        this.BASE_URL + "game/" + gameId + "/specialists/star",
        { withCredentials: true }
      );
    }
    return import_axios.default.get(
      this.BASE_URL + "game/specialists/star",
      { withCredentials: true }
    );
  }
  hireCarrierSpecialist(gameId, carrierId, specialistId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/carrier/" + carrierId + "/hire/" + specialistId,
      {},
      { withCredentials: true }
    );
  }
  hireStarSpecialist(gameId, starId, specialistId) {
    return import_axios.default.put(
      this.BASE_URL + "game/" + gameId + "/star/" + starId + "/hire/" + specialistId,
      {},
      { withCredentials: true }
    );
  }
}
var specialist_default = new SpecialistService();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=specialist.js.map
