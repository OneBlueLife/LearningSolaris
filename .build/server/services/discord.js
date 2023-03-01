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
var discord_exports = {};
__export(discord_exports, {
  default: () => DiscordService
});
module.exports = __toCommonJS(discord_exports);
var import_validation = __toESM(require("../errors/validation"));
const Discord = require("discord.js");
class DiscordService {
  constructor(config, userRepo) {
    this.client = null;
    this.config = config;
    this.userRepo = userRepo;
  }
  async initialize() {
    if (this.config.discord.botToken) {
      this.client = new Discord.Client();
      await this.client.login(this.config.discord.botToken);
      console.log("Discord Initialized");
    }
  }
  isConnected() {
    return this.client != null;
  }
  async isServerMember(discordUserId) {
    let guild = await this.client.guilds.fetch(this.config.discord.serverId);
    let guildMember = await guild.members.resolveID(discordUserId);
    return guildMember != null;
  }
  async updateOAuth(userId, discordUserId, oauth) {
    if (!this.isConnected()) {
      throw new Error(`The Discord integration is not enabled.`);
    }
    const isServerMember = await this.isServerMember(discordUserId);
    if (!isServerMember) {
      throw new import_validation.default(`You must be a member of the official Solaris discord server to continue. Please join the server and try again.`);
    }
    await this.userRepo.updateOne({
      _id: userId
    }, {
      $set: {
        "oauth.discord": {
          userId: discordUserId,
          token: {
            access_token: oauth.access_token,
            token_type: oauth.token_type,
            expires_in: oauth.expires_in,
            refresh_token: oauth.refresh_token,
            scope: oauth.scope
          }
        }
      }
    });
    const user = await this.client.users.fetch(discordUserId);
    user.send(`Hello there, you've just connected your Solaris account to Discord!\r
\r
We'll start sending notifications to you for in-game events. To change your subscriptions, head over to your user account page.`);
  }
  async clearOAuth(userId) {
    await this.userRepo.updateOne({
      _id: userId
    }, {
      $set: {
        "oauth.discord": null
      }
    });
  }
  async sendMessageByUserId(discordUserId, messageTemplate) {
    const duser = await this.client.users.fetch(discordUserId);
    if (!duser) {
      return;
    }
    const isServerMember = await this.isServerMember(discordUserId);
    if (!isServerMember) {
      return;
    }
    try {
      await duser.send({
        embed: messageTemplate
      });
    } catch (err) {
      console.error(err);
    }
  }
  async sendMessageOAuth(user, messageTemplate) {
    if (!this.isConnected() || !user.oauth.discord || !user.oauth.discord.userId) {
      return;
    }
    await this.sendMessageByUserId(user.oauth.discord.userId, messageTemplate);
  }
  async sendMessageByChannel(channelId, messageTemplate) {
    const channel = await this.client.channels.fetch(channelId);
    if (!channel) {
      return;
    }
    try {
      await channel.send({
        embed: messageTemplate
      });
    } catch (err) {
      console.error(err);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=discord.js.map
