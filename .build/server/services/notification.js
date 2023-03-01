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
var notification_exports = {};
__export(notification_exports, {
  default: () => NotificationService
});
module.exports = __toCommonJS(notification_exports);
var import_conversation = require("./conversation");
var import_gameTick = require("./gameTick");
var import_research = require("./research");
var import_trade = require("./trade");
var import_gameJoin = require("./gameJoin");
class NotificationService {
  constructor(config, userRepo, gameRepo, discordService, conversationService, gameService, gameJoinService, gameTickService, researchService, tradeService) {
    this.config = config;
    this.userRepo = userRepo;
    this.gameRepo = gameRepo;
    this.discordService = discordService;
    this.conversationService = conversationService;
    this.gameService = gameService;
    this.gameJoinService = gameJoinService;
    this.gameTickService = gameTickService;
    this.researchService = researchService;
    this.tradeService = tradeService;
  }
  initialize() {
    if (this.discordService.isConnected()) {
      this.conversationService.on(import_conversation.ConversationServiceEvents.onConversationMessageSent, (args) => this.onConversationMessageSent(args));
      this.gameJoinService.on(import_gameJoin.GameJoinServiceEvents.onGameStarted, (args) => this.onGameStarted(args));
      this.gameTickService.on(import_gameTick.GameTickServiceEvents.onGameEnded, (args) => this.onGameEnded(args));
      this.gameTickService.on(import_gameTick.GameTickServiceEvents.onGameTurnEnded, (args) => this.onGameTurnEnded(args));
      this.gameTickService.on(import_gameTick.GameTickServiceEvents.onPlayerGalacticCycleCompleted, (args) => this.onPlayerGalacticCycleCompleted(args));
      this.researchService.on(import_research.ResearchServiceEvents.onPlayerResearchCompleted, (args) => this.onPlayerResearchCompleted(args.gameId, args.playerId, args.technologyKey, args.technologyLevel, args.technologyKeyNext, args.technologyLevelNext));
      this.tradeService.on(import_trade.TradeServiceEvents.onPlayerCreditsReceived, (args) => this.onPlayerCreditsReceived(args.gameId, args.fromPlayer, args.toPlayer, args.amount));
      this.tradeService.on(import_trade.TradeServiceEvents.onPlayerCreditsSpecialistsReceived, (args) => this.onPlayerCreditsSpecialistsReceived(args.gameId, args.fromPlayer, args.toPlayer, args.amount));
      this.tradeService.on(import_trade.TradeServiceEvents.onPlayerRenownReceived, (args) => this.onPlayerRenownReceived(args.gameId, args.fromPlayer, args.toPlayer, args.amount));
      this.tradeService.on(import_trade.TradeServiceEvents.onPlayerTechnologyReceived, (args) => this.onPlayerTechnologyReceived(args.gameId, args.fromPlayer, args.toPlayer, args.technology));
      console.log("Notifications initialized.");
    }
  }
  async _getNotificationContext(gameId, playerIds) {
    const game = await this.gameRepo.findOne({
      _id: gameId
    }, {
      "_id": 1,
      "settings.general.name": 1,
      "galaxy.players._id": 1,
      "galaxy.players.userId": 1,
      "galaxy.players.defeated": 1
    });
    const players = game.galaxy.players.filter((p) => !playerIds || playerIds.includes(p._id.toString()));
    const userIds = players.map((p) => p.userId);
    const users = await this.userRepo.find({
      $and: [
        { _id: { $in: userIds } },
        { "oauth": { $ne: null } },
        { "subscriptions": { $ne: null } }
      ]
    }, {
      _id: 1,
      "oauth": 1,
      "subscriptions": 1
    });
    return {
      game,
      players,
      users
    };
  }
  async _trySendNotifications(gameId, playerIds, type, event, sendNotificationCallback) {
    const context = await this._getNotificationContext(gameId, playerIds);
    for (let user of context.users) {
      if (!user.subscriptions[type] || !user.subscriptions[type][event]) {
        continue;
      }
      if (user.subscriptions.settings.notifyActiveGamesOnly && context.players.find((p) => p.userId.toString() === user._id.toString()).defeated) {
        continue;
      }
      await sendNotificationCallback(context.game, user);
    }
  }
  _generateBaseDiscordMessageTemplate(game, title, description) {
    return {
      title,
      url: `${this.config.clientUrl}/#/game/?id=${game._id}`,
      author: {
        name: game.settings.general.name
      },
      description,
      fields: [],
      timestamp: new Date(),
      footer: {
        text: `Solaris`
      }
    };
  }
  async onGameStarted(args) {
    await this._trySendNotifications(
      args.gameId,
      null,
      "discord",
      "gameStarted",
      async (game, user) => {
        const template = this._generateBaseDiscordMessageTemplate(game, "Game Started", "The game has started. Good luck and have fun!");
        await this.discordService.sendMessageOAuth(user, template);
      }
    );
  }
  async onGameEnded(args) {
    await this._trySendNotifications(
      args.gameId,
      null,
      "discord",
      "gameEnded",
      async (game, user) => {
        const template = this._generateBaseDiscordMessageTemplate(game, "Game Ended", "The game has ended.");
        await this.discordService.sendMessageOAuth(user, template);
      }
    );
  }
  async onGameTurnEnded(args) {
    await this._trySendNotifications(
      args.gameId,
      null,
      "discord",
      "gameTurnEnded",
      async (game, user) => {
        const template = this._generateBaseDiscordMessageTemplate(game, "Game Turn Ended", "A turn has finished, it's your turn to play!");
        await this.discordService.sendMessageOAuth(user, template);
      }
    );
  }
  async onPlayerGalacticCycleCompleted(args) {
    await this._trySendNotifications(
      args.gameId,
      [args.playerId.toString()],
      "discord",
      "playerGalacticCycleComplete",
      async (game, user) => {
        const template = this._generateBaseDiscordMessageTemplate(game, "Galactic Cycle Complete", "A galactic cycle has finished! You have received new funds to spend upgrading your empire.");
        if (args.creditsEconomy) {
          template.fields.push({
            name: "Credits from Economy",
            value: args.creditsEconomy,
            inline: true
          });
        }
        if (args.creditsBanking) {
          template.fields.push({
            name: "Credits from Banking",
            value: args.creditsBanking,
            inline: true
          });
        }
        if (args.creditsSpecialists) {
          template.fields.push({
            name: "Specialist Tokens",
            value: args.creditsSpecialists,
            inline: true
          });
        }
        if (args.experimentTechnology) {
          template.fields.push({
            name: "Experimentation",
            value: `${args.experimentTechnology} (${args.experimentAmount} points)`,
            inline: true
          });
        }
        if (args.experimentLevelUp) {
          template.fields.push({
            name: "Now Researching",
            value: `${args.experimentResearchingNext}`,
            inline: true
          });
        }
        if (args.carrierUpkeep && (args.carrierUpkeep.carrierCount || args.carrierUpkeep.totalCost)) {
          template.fields.push({
            name: "Carrier Upkeep",
            value: `$${args.carrierUpkeep.totalCost} (${args.carrierUpkeep.carrierCount} carriers)`,
            inline: true
          });
        }
        if (args.allianceUpkeep && (args.allianceUpkeep.allianceCount || args.allianceUpkeep.totalCost)) {
          template.fields.push({
            name: "Alliance Upkeep",
            value: `$${args.allianceUpkeep.totalCost} (${args.allianceUpkeep.allianceCount} alliances)`,
            inline: true
          });
        }
        await this.discordService.sendMessageOAuth(user, template);
      }
    );
  }
  async onPlayerResearchCompleted(gameId, playerId, technologyKey, technologyLevel, technologyKeyNext, technologyLevelNext) {
    await this._trySendNotifications(
      gameId,
      [playerId.toString()],
      "discord",
      "playerResearchComplete",
      async (game, user) => {
        const template = this._generateBaseDiscordMessageTemplate(game, "Research Complete", "You have finished researching a technology.");
        template.fields.push({
          name: "Technology",
          value: `${technologyKey} level ${technologyLevel}`,
          inline: false
        });
        template.fields.push({
          name: "Now Researching",
          value: `${technologyKeyNext} level ${technologyLevelNext}`,
          inline: false
        });
        await this.discordService.sendMessageOAuth(user, template);
      }
    );
  }
  async onPlayerCreditsReceived(gameId, fromPlayer, toPlayer, amount) {
    await this._trySendNotifications(
      gameId,
      [toPlayer._id.toString()],
      "discord",
      "playerCreditsReceived",
      async (game, user) => {
        const template = this._generateBaseDiscordMessageTemplate(game, "Credits Received", `You have received **$${amount}** credits from **${fromPlayer.alias}**.`);
        await this.discordService.sendMessageOAuth(user, template);
      }
    );
  }
  async onPlayerCreditsSpecialistsReceived(gameId, fromPlayer, toPlayer, amount) {
    await this._trySendNotifications(
      gameId,
      [toPlayer._id.toString()],
      "discord",
      "playerCreditsSpecialistsReceived",
      async (game, user) => {
        const template = this._generateBaseDiscordMessageTemplate(game, "Specialist Tokens Received", `You have received **${amount}** specialist token(s) from **${fromPlayer.alias}**.`);
        await this.discordService.sendMessageOAuth(user, template);
      }
    );
  }
  async onPlayerTechnologyReceived(gameId, fromPlayer, toPlayer, technology) {
    await this._trySendNotifications(
      gameId,
      [toPlayer._id.toString()],
      "discord",
      "playerTechnologyReceived",
      async (game, user) => {
        const template = this._generateBaseDiscordMessageTemplate(game, "Technology Received", `You have received **Level ${technology.level} ${technology.name}** from **${fromPlayer.alias}**.`);
        await this.discordService.sendMessageOAuth(user, template);
      }
    );
  }
  async onPlayerRenownReceived(gameId, fromPlayer, toPlayer, amount) {
    await this._trySendNotifications(
      gameId,
      [toPlayer._id.toString()],
      "discord",
      "playerRenownReceived",
      async (game, user) => {
        const template = this._generateBaseDiscordMessageTemplate(game, "Renown Received", `You have received **${amount}** renown from **${fromPlayer.alias}**.`);
        await this.discordService.sendMessageOAuth(user, template);
      }
    );
  }
  async onConversationMessageSent(args) {
    const toPlayerIds = args.sentMessageResult.toPlayerIds.map((id) => id.toString());
    const readBy = args.sentMessageResult.readBy.map((id) => id.toString());
    const playerIdsToCheck = toPlayerIds.filter((pid) => !readBy.includes(pid));
    await this._trySendNotifications(
      args.gameId,
      playerIdsToCheck,
      "discord",
      "conversationMessageSent",
      async (game, user) => {
        const formattedMessage = args.sentMessageResult.message.replace(/{{(\w)\/(\w+?)\/(.+?)}}/g, (match, type, id, name) => `{${name}}`);
        const template = this._generateBaseDiscordMessageTemplate(game, "New Message Received", formattedMessage);
        template.author.name = args.sentMessageResult.fromPlayerAlias;
        await this.discordService.sendMessageOAuth(user, template);
      }
    );
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=notification.js.map
