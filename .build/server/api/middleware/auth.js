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
  middleware: () => middleware
});
module.exports = __toCommonJS(auth_exports);
var import_validation = __toESM(require("../../errors/validation"));
;
const middleware = (container) => {
  return {
    authenticate: (options) => {
      return async (req, res, next) => {
        try {
          if (!req.session.userId) {
            return res.sendStatus(401);
          }
          let isBanned = await container.userService.getUserIsBanned(req.session.userId);
          if (isBanned && !req.session.isImpersonating) {
            throw new import_validation.default(`The account is banned.`, 401);
          }
          if (!req.session.isImpersonating) {
            await container.userService.updateLastSeen(req.session.userId, req.headers["x-forwarded-for"] || req.connection.remoteAddress);
          }
          if (options) {
            if (options.admin) {
              let isAdmin = await container.userService.getUserIsAdmin(req.session.userId);
              if (!isAdmin) {
                throw new import_validation.default(`The account is not an administrator.`, 401);
              }
            }
            if (options.subAdmin) {
              let isSubAdmin = await container.userService.getUserIsSubAdmin(req.session.userId);
              if (!isSubAdmin) {
                throw new import_validation.default(`The account is not a sub administrator.`, 401);
              }
            }
            if (options.communityManager) {
              let isCommunityManager = await container.userService.getUserIsCommunityManager(req.session.userId);
              if (!isCommunityManager) {
                throw new import_validation.default(`The account is not a community manager.`, 401);
              }
            }
          }
          next();
        } catch (err) {
          next(err);
        }
      };
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  middleware
});
//# sourceMappingURL=auth.js.map
