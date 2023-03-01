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
var avatar_exports = {};
__export(avatar_exports, {
  default: () => AvatarService
});
module.exports = __toCommonJS(avatar_exports);
var import_validation = __toESM(require("../errors/validation"));
class AvatarService {
  constructor(userRepo, userService) {
    this.userRepo = userRepo;
    this.userService = userService;
  }
  listAllAvatars() {
    return require("../config/game/avatars").slice();
  }
  listAllSolarisAvatars() {
    return this.listAllAvatars().filter((a) => !a.isPatronAvatar);
  }
  listAllAliases() {
    return require("../config/game/aliases").slice();
  }
  async listUserAvatars(userId) {
    let avatars = require("../config/game/avatars").slice();
    let userAvatars = await this.userRepo.findById(userId, {
      avatars: 1
    });
    if (!userAvatars) {
      return [];
    }
    for (let avatar of avatars) {
      avatar.purchased = avatar.price == null || (userAvatars.avatars || []).indexOf(avatar.id) > -1;
    }
    return avatars;
  }
  async getUserAvatar(userId, avatarId) {
    return (await this.listUserAvatars(userId)).find((a) => a.id === avatarId);
  }
  async purchaseAvatar(userId, avatarId) {
    let userCredits = await this.userService.getCredits(userId);
    let avatar = await this.getUserAvatar(userId, avatarId);
    if (!avatar) {
      throw new import_validation.default(`Avatar ${avatarId} does not exist.`);
    }
    if (avatar.purchased) {
      throw new import_validation.default(`You have already purchased this avatar.`);
    }
    if (userCredits < avatar.price) {
      throw new import_validation.default(`You do not have enough credits to purchase this avatar. The cost is ${avatar.price} credits, you have ${userCredits}.`);
    }
    await this.userRepo.updateOne({
      _id: userId
    }, {
      $inc: {
        credits: -avatar.price
      },
      $addToSet: {
        avatars: avatarId
      }
    });
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=avatar.js.map
