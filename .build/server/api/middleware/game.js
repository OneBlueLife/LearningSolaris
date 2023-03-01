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
var game_exports = {};
__export(game_exports, {
  middleware: () => middleware
});
module.exports = __toCommonJS(game_exports);
var import_validation = __toESM(require("../../errors/validation"));
;
;
const middleware = (container) => {
  return {
    loadGame: (options) => {
      return async (req, res, next) => {
        try {
          if (req.params.gameId == null) {
            throw new import_validation.default(`Game ID is required.`);
          }
          let select = {};
          for (const [key, value] of Object.entries(options)) {
            if (value || value == null) {
              select[key] = 1;
            }
          }
          if (options.lean) {
            req.game = await container.gameService.getByIdLean(req.params.gameId, select);
          } else {
            req.game = await container.gameService.getById(req.params.gameId, select);
          }
          if (!req.game) {
            throw new import_validation.default("Game not found.", 404);
          }
          next();
        } catch (err) {
          next(err);
        }
      };
    },
    validateGameState: (options) => {
      return (req, res, next) => {
        try {
          if (options.isUnlocked && container.gameStateService.isLocked(req.game)) {
            throw new import_validation.default("You cannot perform this action, the game is locked by the system. Please try again.");
          }
          if (options.isInProgress && !container.gameStateService.isInProgress(req.game)) {
            throw new import_validation.default("You cannot perform this action, the game is not in progress.");
          }
          if (options.isStarted && !container.gameStateService.isStarted(req.game)) {
            throw new import_validation.default("You cannot perform this action, the game is not in progress.");
          }
          if (options.isNotFinished && container.gameStateService.isFinished(req.game)) {
            throw new import_validation.default("You cannot perform this action, the game is not in progress.");
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
//# sourceMappingURL=game.js.map
