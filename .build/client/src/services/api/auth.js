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
var auth_exports = {};
__export(auth_exports, {
  default: () => auth_default
});
module.exports = __toCommonJS(auth_exports);
var import_axios = __toESM(require("axios"));
var import_base = __toESM(require("./base"));
class AuthService extends import_base.default {
  login(email, password) {
    return import_axios.default.post(
      this.BASE_URL + "auth/login",
      {
        email,
        password
      },
      {
        withCredentials: true
      }
    );
  }
  logout() {
    return import_axios.default.post(this.BASE_URL + "auth/logout", {}, { withCredentials: true });
  }
  verify() {
    return import_axios.default.post(this.BASE_URL + "auth/verify", {}, { withCredentials: true });
  }
  clearOauthDiscord() {
    return import_axios.default.delete(this.BASE_URL + "auth/discord", { withCredentials: true });
  }
}
var auth_default = new AuthService();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=auth.js.map
