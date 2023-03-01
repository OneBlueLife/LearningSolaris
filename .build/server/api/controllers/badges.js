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
var badges_exports = {};
__export(badges_exports, {
  default: () => badges_default
});
module.exports = __toCommonJS(badges_exports);
var badges_default = (container) => {
  return {
    listAll: async (req, res, next) => {
      try {
        const result = container.badgeService.listPurchasableBadges();
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    },
    listForUser: async (req, res, next) => {
      try {
        const result = await container.badgeService.listBadgesByUser(req.params.userId);
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    },
    listForPlayer: async (req, res, next) => {
      try {
        const result = await container.badgeService.listBadgesByPlayer(req.game, req.params.playerId);
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    },
    purchaseForUser: async (req, res, next) => {
      try {
        await container.badgeService.purchaseBadgeForUser(req.session.userId, req.params.userId, req.body.badgeKey);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    purchaseForPlayer: async (req, res, next) => {
      try {
        await container.badgeService.purchaseBadgeForPlayer(req.game, req.session.userId, req.params.playerId, req.body.badgeKey);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=badges.js.map
