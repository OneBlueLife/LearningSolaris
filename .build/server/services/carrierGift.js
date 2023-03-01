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
var carrierGift_exports = {};
__export(carrierGift_exports, {
  CarrierGiftServiceEvents: () => CarrierGiftServiceEvents,
  default: () => CarrierGiftService
});
module.exports = __toCommonJS(carrierGift_exports);
var import_validation = __toESM(require("../errors/validation"));
const mongoose = require("mongoose");
const EventEmitter = require("events");
const CarrierGiftServiceEvents = {
  onPlayerGiftReceived: "onPlayerGiftReceived",
  onPlayerGiftSent: "onPlayerGiftSent"
};
class CarrierGiftService extends EventEmitter {
  constructor(gameRepo, diplomacyService) {
    super();
    this.gameRepo = gameRepo;
    this.diplomacyService = diplomacyService;
  }
  async convertToGift(game, player, carrierId) {
    let carrier = game.galaxy.carriers.find((c) => c._id.toString() === carrierId.toString());
    if (game.settings.specialGalaxy.giftCarriers === "disabled") {
      throw new import_validation.default(`Gifting carriers has been disabled in this game.`);
    }
    if (carrier.ownedByPlayerId.toString() !== player._id.toString()) {
      throw new import_validation.default(`Cannot convert carrier into a gift, you do not own this carrier.`);
    }
    if (carrier.isGift) {
      throw new import_validation.default(`The carrier has already been converted into a gift.`);
    }
    carrier.isGift = true;
    carrier.waypointsLooped = false;
    await this.gameRepo.updateOne({
      _id: game._id,
      "galaxy.carriers._id": carrier._id
    }, {
      $set: {
        "galaxy.carriers.$.isGift": true,
        "galaxy.carriers.$.waypointsLooped": false
      }
    });
  }
  async transferGift(game, gameUsers, star, carrier) {
    if (!star.ownedByPlayerId) {
      throw new import_validation.default(`Cannot transfer ownership of a gifted carrier to this star, no player owns the star.`);
    }
    let starPlayer = game.galaxy.players.find((p) => star.ownedByPlayerId && p._id.toString() === star.ownedByPlayerId.toString());
    let starUser = gameUsers.find((u) => starPlayer.userId && u._id.toString() === starPlayer.userId.toString());
    let carrierPlayer = game.galaxy.players.find((p) => p._id.toString() === carrier.ownedByPlayerId.toString());
    let carrierUser = gameUsers.find((u) => carrierPlayer.userId && u._id.toString() === carrierPlayer.userId.toString());
    const isSamePlayer = starPlayer._id.toString() === carrierPlayer._id.toString();
    if (!isSamePlayer) {
      if (starUser && !starPlayer.defeated) {
        starUser.achievements.trade.giftsReceived += carrier.ships;
      }
      if (carrierUser && !carrierPlayer.defeated) {
        carrierUser.achievements.trade.giftsSent += carrier.ships;
      }
      carrier.ownedByPlayerId = star.ownedByPlayerId;
      if (!this.diplomacyService.isFormalAlliancesEnabled(game) || !this.diplomacyService.isDiplomaticStatusBetweenPlayersAllied(game, [carrierPlayer._id, starPlayer._id])) {
        carrier.specialistId = null;
      }
      let eventObject = {
        gameId: game._id,
        gameTick: game.state.tick,
        fromPlayer: carrierPlayer,
        toPlayer: starPlayer,
        carrier,
        star
      };
      this.emit(CarrierGiftServiceEvents.onPlayerGiftReceived, eventObject);
      this.emit(CarrierGiftServiceEvents.onPlayerGiftSent, eventObject);
      carrier.isGift = false;
    } else if (!carrier.waypoints.length) {
      carrier.isGift = false;
    }
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CarrierGiftServiceEvents
});
//# sourceMappingURL=carrierGift.js.map
