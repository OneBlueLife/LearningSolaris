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
var diplomacy_exports = {};
__export(diplomacy_exports, {
  default: () => diplomacy_default
});
module.exports = __toCommonJS(diplomacy_exports);
const mongoose = require("mongoose");
var diplomacy_default = (container) => {
  return {
    list: async (req, res, next) => {
      try {
        let diplomaticStatuses = await container.diplomacyService.getDiplomaticStatusToAllPlayers(
          req.game,
          req.player
        );
        return res.status(200).json(diplomaticStatuses);
      } catch (err) {
        return next(err);
      }
    },
    detail: async (req, res, next) => {
      try {
        let diplomaticStatus = await container.diplomacyService.getDiplomaticStatusToPlayer(
          req.game,
          req.player._id,
          req.params.toPlayerId
        );
        return res.status(200).json(diplomaticStatus);
      } catch (err) {
        return next(err);
      }
    },
    declareAlly: async (req, res, next) => {
      try {
        let newStatus = await container.diplomacyService.declareAlly(
          req.game,
          req.player._id,
          new mongoose.Types.ObjectId(req.params.playerId)
        );
        await container.broadcastService.gamePlayerDiplomaticStatusChanged(req.player._id, req.params.playerId, newStatus);
        return res.status(200).json(newStatus);
      } catch (err) {
        return next(err);
      }
    },
    declareEnemy: async (req, res, next) => {
      try {
        let newStatus = await container.diplomacyService.declareEnemy(
          req.game,
          req.player._id,
          new mongoose.Types.ObjectId(req.params.playerId)
        );
        await container.broadcastService.gamePlayerDiplomaticStatusChanged(req.player._id, req.params.playerId, newStatus);
        return res.status(200).json(newStatus);
      } catch (err) {
        return next(err);
      }
    },
    declareNeutral: async (req, res, next) => {
      try {
        let newStatus = await container.diplomacyService.declareNeutral(
          req.game,
          req.player._id,
          new mongoose.Types.ObjectId(req.params.playerId)
        );
        await container.broadcastService.gamePlayerDiplomaticStatusChanged(req.player._id, req.params.playerId, newStatus);
        return res.status(200).json(newStatus);
      } catch (err) {
        return next(err);
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=diplomacy.js.map
