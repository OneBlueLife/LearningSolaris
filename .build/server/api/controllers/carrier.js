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
var carrier_exports = {};
__export(carrier_exports, {
  default: () => carrier_default
});
module.exports = __toCommonJS(carrier_exports);
var import_carrier = require("../requests/carrier");
var carrier_default = (container) => {
  return {
    saveWaypoints: async (req, res, next) => {
      try {
        const reqObj = (0, import_carrier.mapToCarrierSaveWaypointsRequest)(req.body);
        let report = await container.waypointService.saveWaypoints(
          req.game,
          req.player,
          req.params.carrierId,
          reqObj.waypoints,
          reqObj.looped
        );
        return res.status(200).json(report);
      } catch (err) {
        return next(err);
      }
    },
    loopWaypoints: async (req, res, next) => {
      try {
        const reqObj = (0, import_carrier.mapToCarrierLoopWaypointsRequest)(req.body);
        await container.waypointService.loopWaypoints(
          req.game,
          req.player,
          req.params.carrierId,
          reqObj.loop
        );
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    transferShips: async (req, res, next) => {
      try {
        const reqObj = (0, import_carrier.mapToCarrierTransferShipsRequest)(req.body);
        await container.shipTransferService.transfer(
          req.game,
          req.player,
          req.params.carrierId,
          reqObj.carrierShips,
          reqObj.starId,
          reqObj.starShips
        );
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    gift: async (req, res, next) => {
      try {
        await container.carrierGiftService.convertToGift(
          req.game,
          req.player,
          req.params.carrierId
        );
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    rename: async (req, res, next) => {
      try {
        const reqObj = (0, import_carrier.mapToCarrierRenameCarrierRequest)(req.body);
        await container.carrierService.rename(
          req.game,
          req.player,
          req.params.carrierId,
          reqObj.name
        );
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    scuttle: async (req, res, next) => {
      try {
        await container.carrierService.scuttle(
          req.game,
          req.player,
          req.params.carrierId
        );
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    calculateCombat: (req, res, next) => {
      try {
        const reqObj = (0, import_carrier.mapToCarrierCalculateCombatRequest)(req.body);
        let result = container.combatService.calculate(
          reqObj.defender,
          reqObj.attacker,
          reqObj.isTurnBased,
          true
        );
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=carrier.js.map
