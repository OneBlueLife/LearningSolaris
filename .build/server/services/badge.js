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
var badge_exports = {};
__export(badge_exports, {
  BadgeServiceEvents: () => BadgeServiceEvents,
  default: () => BadgeService
});
module.exports = __toCommonJS(badge_exports);
var import_validation = __toESM(require("../errors/validation"));
const EventEmitter = require("events");
const BadgeServiceEvents = {
  onGamePlayerBadgePurchased: "onGamePlayerBadgePurchased"
};
class BadgeService extends EventEmitter {
  constructor(userRepo, userService, playerService) {
    super();
    this.userRepo = userRepo;
    this.userService = userService;
    this.playerService = playerService;
  }
  listBadges() {
    return require("../config/game/badges").slice();
  }
  listPurchasableBadges() {
    return this.listBadges().filter((b) => b.price);
  }
  async listBadgesByUser(userId) {
    const badges = this.listBadges();
    const user = await this.userService.getById(userId, {
      "achievements.badges": 1
    });
    if (!user) {
      return [];
    }
    const userBadges = [];
    for (let badge of badges) {
      userBadges.push({
        ...badge,
        awarded: user.achievements.badges[badge.key] || 0
      });
    }
    return userBadges.filter((b) => b.awarded);
  }
  async listBadgesByPlayer(game, playerId) {
    let player = this.playerService.getById(game, playerId);
    if (!player) {
      throw new import_validation.default(`Could not find the player in this game.`);
    }
    if (!player.userId) {
      return null;
    }
    if (game.settings.general.anonymity === "extra") {
      return [];
    }
    return await this.listBadgesByUser(player.userId);
  }
  async purchaseBadgeForUser(purchasedByUserId, purchasedForUserId, badgeKey) {
    if (purchasedByUserId.toString() === purchasedForUserId.toString()) {
      throw new import_validation.default(`Cannot purchased a badge for yourself.`);
    }
    const badge = this.listPurchasableBadges().find((b) => b.key === badgeKey);
    if (!badge) {
      throw new import_validation.default(`Badge ${badgeKey} does not exist.`);
    }
    const recipient = await this.userService.getById(purchasedForUserId, { _id: 1 });
    if (!recipient) {
      throw new import_validation.default(`Recipient user ${purchasedForUserId} does not exist.`);
    }
    const creditsOwned = await this.userService.getCredits(purchasedByUserId);
    if (!creditsOwned || creditsOwned < badge.price) {
      throw new import_validation.default(`You cannot afford to purchase this badge.`);
    }
    await this.userService.incrementCredits(purchasedByUserId, -1);
    let updateQuery = {
      $inc: {}
    };
    updateQuery.$inc["achievements.badges." + badgeKey] = 1;
    await this.userRepo.updateOne({
      _id: purchasedForUserId
    }, updateQuery);
    return badge;
  }
  async purchaseBadgeForPlayer(game, purchasedByUserId, purchasedForPlayerId, badgeKey) {
    let buyer = this.playerService.getByUserId(game, purchasedByUserId);
    let recipient = this.playerService.getById(game, purchasedForPlayerId);
    if (!recipient) {
      throw new import_validation.default(`Could not find the player in this game.`);
    }
    if (!recipient.userId) {
      throw new import_validation.default(`The player slot has not been filled by a user.`);
    }
    const badge = await this.purchaseBadgeForUser(purchasedByUserId, recipient.userId, badgeKey);
    let e = {
      gameId: game._id,
      gameTick: game.state.tick,
      purchasedByPlayerId: buyer._id,
      purchasedByPlayerAlias: buyer.alias,
      purchasedForPlayerId: recipient._id,
      purchasedForPlayerAlias: recipient.alias,
      badgeKey,
      badgeName: badge.name
    };
    this.emit(BadgeServiceEvents.onGamePlayerBadgePurchased, e);
  }
  awardBadgeForUser(user, badgeKey) {
    const badge = this.listBadges().find((b) => b.key === badgeKey);
    if (!badge) {
      throw new import_validation.default(`Badge ${badgeKey} does not exist.`);
    }
    user.achievements.badges[badgeKey]++;
  }
  awardBadgeForUserVictor32PlayerGame(user) {
    this.awardBadgeForUser(user, "victor32");
  }
  awardBadgeForUserVictorySpecialGame(user, game) {
    this.awardBadgeForUser(user, game.settings.general.type);
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BadgeServiceEvents
});
//# sourceMappingURL=badge.js.map
