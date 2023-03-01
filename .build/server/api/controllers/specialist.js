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
var specialist_exports = {};
__export(specialist_exports, {
  default: () => specialist_default
});
module.exports = __toCommonJS(specialist_exports);
var specialist_default = (container) => {
  return {
    listBans: async (req, res, next) => {
      try {
        const amount = container.gameFluxService.getThisMonthSpecialistBanAmount();
        const specialistBans = container.specialistBanService.getCurrentMonthBans(amount);
        const specialStarBans = container.specialStarBanService.getCurrentMonthBans();
        const bans = {
          ...specialistBans,
          ...specialStarBans
        };
        return res.status(200).json(bans);
      } catch (err) {
        return next(err);
      }
    },
    listCarrier: async (req, res, next) => {
      try {
        let specialists = await container.specialistService.listCarrier(null);
        return res.status(200).json(specialists);
      } catch (err) {
        return next(err);
      }
    },
    listStar: async (req, res, next) => {
      try {
        let specialists = await container.specialistService.listStar(null);
        return res.status(200).json(specialists);
      } catch (err) {
        return next(err);
      }
    },
    listCarrierForGame: async (req, res, next) => {
      try {
        let specialists = await container.specialistService.listCarrier(req.game);
        return res.status(200).json(specialists);
      } catch (err) {
        return next(err);
      }
    },
    listStarForGame: async (req, res, next) => {
      try {
        let specialists = await container.specialistService.listStar(req.game);
        return res.status(200).json(specialists);
      } catch (err) {
        return next(err);
      }
    },
    hireCarrier: async (req, res, next) => {
      try {
        let result = await container.specialistHireService.hireCarrierSpecialist(
          req.game,
          req.player,
          req.params.carrierId,
          +req.params.specialistId
        );
        await container.eventService.createPlayerCarrierSpecialistHired(
          req.game._id,
          req.game.state.tick,
          req.player,
          result.carrier,
          result.specialist
        );
        return res.status(200).json({
          waypoints: result.waypoints,
          effectiveTechs: result.carrier.effectiveTechs
        });
      } catch (err) {
        return next(err);
      }
    },
    hireStar: async (req, res, next) => {
      try {
        let result = await container.specialistHireService.hireStarSpecialist(
          req.game,
          req.player,
          req.params.starId,
          +req.params.specialistId
        );
        await container.eventService.createPlayerStarSpecialistHired(
          req.game._id,
          req.game.state.tick,
          req.player,
          result.star,
          result.specialist
        );
        return res.status(200).json({
          effectiveTechs: result.star.effectiveTechs
        });
      } catch (err) {
        return next(err);
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=specialist.js.map
