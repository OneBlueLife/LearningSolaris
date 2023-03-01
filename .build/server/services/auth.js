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
  default: () => AuthService
});
module.exports = __toCommonJS(auth_exports);
var import_events = __toESM(require("events"));
var import_validation = __toESM(require("../errors/validation"));
class AuthService extends import_events.default {
  constructor(userRepo, passwordService) {
    super();
    this.userRepo = userRepo;
    this.passwordService = passwordService;
  }
  async login(email, password) {
    email = email.trim();
    email = email.toLowerCase();
    let user = await this.userRepo.findOne({
      email
    }, {
      username: 1,
      password: 1,
      banned: 1,
      roles: 1,
      credits: 1
    });
    if (!user) {
      throw new import_validation.default("The email address or password is incorrect.");
    }
    if (user.banned) {
      throw new import_validation.default("The account has been banned.");
    }
    if (user.password == null) {
      return user;
    }
    let result = await this.passwordService.compare(password, user.password);
    if (result) {
      return user;
    } else {
      throw new import_validation.default("The email address or password is incorrect.");
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=auth.js.map
