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
var star_exports = {};
__export(star_exports, {
  default: () => star_default
});
module.exports = __toCommonJS(star_exports);
var import_star = require("../requests/star");
var star_default = (container) => {
  return {
    upgradeEconomy: async (req, res, next) => {
      try {
        const reqObj = (0, import_star.mapToStarUpgradeInfrastructureRequest)(req.body);
        let report = await container.starUpgradeService.upgradeEconomy(
          req.game,
          req.player,
          reqObj.starId
        );
        return res.status(200).json(report);
      } catch (err) {
        return next(err);
      }
    },
    upgradeIndustry: async (req, res, next) => {
      try {
        const reqObj = (0, import_star.mapToStarUpgradeInfrastructureRequest)(req.body);
        let report = await container.starUpgradeService.upgradeIndustry(
          req.game,
          req.player,
          reqObj.starId
        );
        return res.status(200).json(report);
      } catch (err) {
        return next(err);
      }
    },
    upgradeScience: async (req, res, next) => {
      try {
        const reqObj = (0, import_star.mapToStarUpgradeInfrastructureRequest)(req.body);
        let report = await container.starUpgradeService.upgradeScience(
          req.game,
          req.player,
          reqObj.starId
        );
        return res.status(200).json(report);
      } catch (err) {
        return next(err);
      }
    },
    upgradeBulk: async (req, res, next) => {
      try {
        const reqObj = (0, import_star.mapToStarUpgradeInfrastructureBulkRequest)(req.body);
        let summary = await container.starUpgradeService.upgradeBulk(
          req.game,
          req.player,
          reqObj.upgradeStrategy,
          reqObj.infrastructure,
          +reqObj.amount
        );
        return res.status(200).json(summary);
      } catch (err) {
        return next(err);
      }
    },
    upgradeBulkCheck: async (req, res, next) => {
      try {
        const reqObj = (0, import_star.mapToStarUpgradeInfrastructureBulkRequest)(req.body);
        let summary = await container.starUpgradeService.generateUpgradeBulkReport(
          req.game,
          req.player,
          reqObj.upgradeStrategy,
          reqObj.infrastructure,
          +reqObj.amount
        );
        return res.status(200).json(summary);
      } catch (err) {
        return next(err);
      }
    },
    buildWarpGate: async (req, res, next) => {
      try {
        const reqObj = req.body;
        let report = await container.starUpgradeService.buildWarpGate(
          req.game,
          req.player,
          reqObj.starId
        );
        return res.status(200).json(report);
      } catch (err) {
        return next(err);
      }
    },
    destroyWarpGate: async (req, res, next) => {
      try {
        const reqObj = (0, import_star.mapToStarDestroyInfrastructureRequest)(req.body);
        await container.starUpgradeService.destroyWarpGate(
          req.game,
          req.player,
          reqObj.starId
        );
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    buildCarrier: async (req, res, next) => {
      try {
        const reqObj = (0, import_star.mapToStarBuildCarrierRequest)(req.body);
        let report = await container.starUpgradeService.buildCarrier(
          req.game,
          req.player,
          reqObj.starId,
          reqObj.ships
        );
        return res.status(200).json(report);
      } catch (err) {
        return next(err);
      }
    },
    garrisonAllShips: async (req, res, next) => {
      try {
        let report = await container.shipTransferService.garrisonAllShips(
          req.game,
          req.player,
          req.params.starId
        );
        return res.status(200).json(report);
      } catch (err) {
        return next(err);
      }
    },
    distributeAllShips: async (req, res, next) => {
      try {
        let report = await container.shipTransferService.distributeAllShips(
          req.game,
          req.player,
          req.params.starId
        );
        return res.status(200).json(report);
      } catch (err) {
        return next(err);
      }
    },
    abandon: async (req, res, next) => {
      try {
        const reqObj = (0, import_star.mapToStarAbandonStarRequest)(req.body);
        await container.starService.abandonStar(
          req.game,
          req.player,
          reqObj.starId
        );
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    toggleBulkIgnore: async (req, res, next) => {
      try {
        const reqObj = (0, import_star.mapToStarToggleBulkIgnoreStatusRequest)(req.body);
        await container.starService.toggleIgnoreBulkUpgrade(
          req.game,
          req.player,
          reqObj.starId,
          reqObj.infrastructureType
        );
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    toggleBulkIgnoreAll: async (req, res, next) => {
      try {
        const reqObj = (0, import_star.mapToStarSetBulkIgnoreAllStatusRequest)(req.body);
        await container.starService.toggleIgnoreBulkUpgradeAll(
          req.game,
          req.player,
          reqObj.starId,
          reqObj.ignoreStatus
        );
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=star.js.map
