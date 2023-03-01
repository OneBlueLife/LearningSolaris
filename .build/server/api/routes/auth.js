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
var import_auth = __toESM(require("../controllers/auth"));
var import_auth2 = require("../requests/auth");
var auth_default = (router, mw, validator, container) => {
  const controller = (0, import_auth.default)(container);
  router.post(
    "/api/auth/login",
    validator.body(import_auth2.authLoginRequestSchema),
    controller.login,
    mw.core.handleError
  );
  router.post(
    "/api/auth/logout",
    controller.logout,
    mw.core.handleError
  );
  router.post(
    "/api/auth/verify",
    controller.verify
  );
  router.get(
    "/api/auth/discord",
    controller.authoriseDiscord
  );
  router.delete(
    "/api/auth/discord",
    mw.auth.authenticate(),
    controller.unauthoriseDiscord,
    mw.core.handleError
  );
  return router;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=auth.js.map
