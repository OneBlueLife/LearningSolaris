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
var spectator_exports = {};
__export(spectator_exports, {
  default: () => spectator_default
});
module.exports = __toCommonJS(spectator_exports);
var spectator_default = (container) => {
  return {
    invite: async (req, res, next) => {
      try {
        await container.spectatorService.invite(
          req.game,
          req.player,
          req.body.username
        );
        res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    uninvite: async (req, res, next) => {
      try {
        await container.spectatorService.uninvite(
          req.game,
          req.player,
          req.params.userId
        );
        res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    clear: async (req, res, next) => {
      try {
        await container.spectatorService.clearSpectators(
          req.game,
          req.player
        );
        res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    list: async (req, res, next) => {
      try {
        const spectators = await container.spectatorService.listSpectators(req.game);
        res.status(200).json(spectators);
      } catch (err) {
        return next(err);
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=spectator.js.map
