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
var spectator_exports = {};
__export(spectator_exports, {
  default: () => spectator_default
});
module.exports = __toCommonJS(spectator_exports);
var import_axios = __toESM(require("axios"));
var import_base = __toESM(require("./base"));
class SpectatorService extends import_base.default {
  list(gameId) {
    return import_axios.default.get(
      `${this.BASE_URL}game/${gameId}/spectators`,
      { withCredentials: true }
    );
  }
  invite(gameId, username) {
    return import_axios.default.put(
      `${this.BASE_URL}game/${gameId}/spectators/invite`,
      {
        username
      },
      { withCredentials: true }
    );
  }
  uninvite(gameId, userId) {
    return import_axios.default.put(
      `${this.BASE_URL}game/${gameId}/spectators/uninvite/${userId}`,
      {},
      { withCredentials: true }
    );
  }
  clear(gameId, userId) {
    return import_axios.default.delete(
      `${this.BASE_URL}game/${gameId}/spectators`,
      {},
      { withCredentials: true }
    );
  }
}
var spectator_default = new SpectatorService();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=spectator.js.map
