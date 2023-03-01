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
var player_exports = {};
__export(player_exports, {
  middleware: () => middleware
});
module.exports = __toCommonJS(player_exports);
var import_validation = __toESM(require("../../errors/validation"));
const middleware = (container) => {
  return {
    loadPlayer: (req, res, next) => {
      try {
        if (!req.game) {
          throw new Error(`The game has not been loaded.`);
        }
        req.player = container.playerService.getByUserId(req.game, req.session.userId);
        if (!req.player) {
          throw new import_validation.default("You are not participating in this game.");
        }
        next();
      } catch (err) {
        next(err);
      }
    },
    validatePlayerState: (options) => {
      return (req, res, next) => {
        if (options.isPlayerUndefeated && req.player.defeated) {
          throw new import_validation.default("You cannot participate in this game, you have been defeated.");
        }
        next();
      };
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  middleware
});
//# sourceMappingURL=player.js.map
