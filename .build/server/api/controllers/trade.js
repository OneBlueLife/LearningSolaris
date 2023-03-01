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
var trade_exports = {};
__export(trade_exports, {
  default: () => trade_default
});
module.exports = __toCommonJS(trade_exports);
var import_trade = require("../requests/trade");
const mongoose = require("mongoose");
var trade_default = (container) => {
  return {
    sendCredits: async (req, res, next) => {
      try {
        const reqObj = (0, import_trade.mapToTradeSendToPlayerRequest)(req.body, req.session.userId);
        let trade = await container.tradeService.sendCredits(
          req.game,
          req.player,
          reqObj.toPlayerId,
          reqObj.amount
        );
        res.status(200).json({
          reputation: trade.reputation
        });
        container.broadcastService.gamePlayerCreditsReceived(req.game, trade.fromPlayer._id, trade.toPlayer._id, trade.amount, trade.date);
      } catch (err) {
        return next(err);
      }
    },
    sendCreditsSpecialists: async (req, res, next) => {
      try {
        const reqObj = (0, import_trade.mapToTradeSendToPlayerRequest)(req.body, req.session.userId);
        let trade = await container.tradeService.sendCreditsSpecialists(
          req.game,
          req.player,
          reqObj.toPlayerId,
          reqObj.amount
        );
        res.status(200).json({
          reputation: trade.reputation
        });
        container.broadcastService.gamePlayerCreditsSpecialistsReceived(req.game, trade.fromPlayer._id, trade.toPlayer._id, trade.amount, trade.date);
      } catch (err) {
        return next(err);
      }
    },
    sendRenown: async (req, res, next) => {
      try {
        const reqObj = (0, import_trade.mapToTradeSendToPlayerRequest)(req.body, req.session.userId);
        let trade = await container.tradeService.sendRenown(
          req.game,
          req.player,
          reqObj.toPlayerId,
          reqObj.amount
        );
        res.sendStatus(200);
        container.broadcastService.gamePlayerRenownReceived(req.game, trade.fromPlayer._id, trade.toPlayer._id, trade.amount, trade.date);
      } catch (err) {
        return next(err);
      }
    },
    sendTechnology: async (req, res, next) => {
      try {
        const reqObj = (0, import_trade.mapToTradeSendTechnologyToPlayerRequest)(req.body);
        let trade = await container.tradeService.sendTechnology(
          req.game,
          req.player,
          reqObj.toPlayerId,
          reqObj.technology,
          reqObj.level
        );
        res.status(200).json({
          reputation: trade.reputation
        });
        container.broadcastService.gamePlayerTechnologyReceived(req.game, trade.fromPlayer._id, trade.toPlayer._id, trade.technology, trade.date);
      } catch (err) {
        return next(err);
      }
    },
    listTradeableTechnologies: async (req, res, next) => {
      try {
        let techs = await container.tradeService.listTradeableTechnologies(
          req.game,
          req.player,
          req.params.toPlayerId
        );
        return res.status(200).json(techs);
      } catch (err) {
        return next(err);
      }
    },
    listTradeEvents: async (req, res, next) => {
      try {
        let events = await container.tradeService.listTradeEventsBetweenPlayers(
          req.game,
          req.player._id,
          [
            req.player._id,
            mongoose.Types.ObjectId(req.params.toPlayerId)
          ]
        );
        return res.status(200).json(events);
      } catch (err) {
        return next(err);
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=trade.js.map
