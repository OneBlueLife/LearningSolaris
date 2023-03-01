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
var recaptcha_exports = {};
__export(recaptcha_exports, {
  default: () => RecaptchaService
});
module.exports = __toCommonJS(recaptcha_exports);
const Recaptcha = require("recaptcha-v2").Recaptcha;
class RecaptchaService {
  constructor(config) {
    this.config = config;
  }
  isEnabled() {
    return this.config.google.recaptcha.enabled;
  }
  verify(ipAddress, token) {
    let siteKey = this.config.google.recaptcha.siteKey;
    let secretKey = this.config.google.recaptcha.secretKey;
    return new Promise((resolve, reject) => {
      if (!this.isEnabled()) {
        resolve();
      }
      let data = {
        remoteip: ipAddress,
        response: token,
        secret: secretKey
      };
      let recaptcha = new Recaptcha(siteKey, secretKey, data);
      recaptcha.verify((success, error_code) => {
        if (success) {
          resolve();
        } else {
          reject(error_code);
        }
      });
    });
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=recaptcha.js.map
