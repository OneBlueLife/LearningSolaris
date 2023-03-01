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
var guildUser_exports = {};
__export(guildUser_exports, {
  default: () => UserGuildService
});
module.exports = __toCommonJS(guildUser_exports);
class UserGuildService {
  constructor(userRepo, guildService) {
    this.userRepo = userRepo;
    this.guildService = guildService;
  }
  async listUsersWithGuildTags(userIds) {
    let users = await this.userRepo.find({
      _id: {
        $in: userIds
      }
    }, {
      username: 1,
      guildId: 1,
      "gameSettings.guild.displayGuildTag": 1
    });
    let guildIds = users.filter((x) => x.guildId).map((x) => x.guildId);
    let guilds = await this.guildService.listInfoByIds(guildIds);
    return users.map((u) => {
      return {
        _id: u._id,
        username: u.username,
        displayGuildTag: u.gameSettings.guild.displayGuildTag,
        guild: guilds.find((g) => u.guildId && g._id.toString() === u.guildId.toString()) || null
      };
    });
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=guildUser.js.map
