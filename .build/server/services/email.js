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
var email_exports = {};
__export(email_exports, {
  default: () => EmailService
});
module.exports = __toCommonJS(email_exports);
var import_gameTick = require("./gameTick");
var import_user = require("./user");
var import_gameJoin = require("./gameJoin");
var import_playerReady = require("./playerReady");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
function getFakeTransport() {
  return {
    async sendMail(message) {
      console.log(`SMTP DISABLED`);
    }
  };
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
class EmailService {
  constructor(config, gameService, gameJoinService, userService, leaderboardService, playerService, playerReadyService, gameTypeService, gameStateService, gameTickService) {
    this.TEMPLATES = {
      WELCOME: {
        fileName: "welcomeEmail.html",
        subject: "Welcome to Solaris"
      },
      RESET_PASSWORD: {
        fileName: "resetPassword.html",
        subject: "Reset your Solaris password"
      },
      FORGOT_USERNAME: {
        fileName: "forgotUsername.html",
        subject: "Your Solaris username"
      },
      GAME_WELCOME: {
        fileName: "gameWelcome.html",
        subject: "Your Solaris game starts soon!"
      },
      GAME_FINISHED: {
        fileName: "gameFinished.html",
        subject: "Your Solaris game has ended!"
      },
      GAME_CYCLE_SUMMARY: {
        fileName: "gameCycleSummary.html",
        subject: "A galactic cycle has ended - Upgrade your empire!"
      },
      YOUR_TURN_REMINDER: {
        fileName: "yourTurnReminder.html",
        subject: "Solaris - It's your turn to play!"
      },
      NEXT_TURN_REMINDER: {
        fileName: "nextTurnReminder.html",
        subject: "Solaris - Turn finished, it's your turn to play!"
      },
      GAME_TIMED_OUT: {
        fileName: "gameTimedOut.html",
        subject: "Solaris - Your game did not start"
      },
      GAME_PLAYER_AFK: {
        fileName: "gamePlayerAfk.html",
        subject: "Solaris - You've gone AFK"
      },
      REVIEW_REMINDER_30_DAYS: {
        fileName: "reviewReminder.html",
        subject: "Solaris - How did we do?"
      }
    };
    this.config = config;
    this.gameService = gameService;
    this.gameJoinService = gameJoinService;
    this.userService = userService;
    this.leaderboardService = leaderboardService;
    this.playerService = playerService;
    this.playerReadyService = playerReadyService;
    this.gameTypeService = gameTypeService;
    this.gameStateService = gameStateService;
    this.gameTickService = gameTickService;
    this.gameJoinService.on(import_gameJoin.GameJoinServiceEvents.onGameStarted, (args) => this.sendGameStartedEmail(args));
    this.userService.on(import_user.UserServiceEvents.onUserCreated, (user) => this.sendWelcomeEmail(user));
    this.playerReadyService.on(import_playerReady.PlayerReadyServiceEvents.onGamePlayerReady, (data) => this.trySendLastPlayerTurnReminder(data.gameId));
    this.gameTickService.on(import_gameTick.GameTickServiceEvents.onGameTurnEnded, (args) => this.trySendNextTurnReminder(args.gameId));
    this.gameTickService.on(import_gameTick.GameTickServiceEvents.onPlayerAfk, (args) => this.sendGamePlayerAfkEmail(args));
    this.gameTickService.on(import_gameTick.GameTickServiceEvents.onGameEnded, (args) => this.sendGameFinishedEmail(args.gameId));
    this.gameTickService.on(import_gameTick.GameTickServiceEvents.onGameCycleEnded, (args) => this.sendGameCycleSummaryEmail(args.gameId));
  }
  isEnabled() {
    return this.config.smtp.enabled;
  }
  _getTransport() {
    if (this.isEnabled()) {
      return nodemailer.createTransport({
        host: this.config.smtp.host,
        port: this.config.smtp.port,
        tls: {
          rejectUnauthorized: false
        }
      });
    } else {
      return getFakeTransport();
    }
  }
  async send(toEmail, subject, text) {
    const transport = this._getTransport();
    const message = {
      from: this.config.smtp.from,
      to: toEmail,
      subject,
      text
    };
    console.log(`EMAIL: [${message.to}] - ${subject}`);
    return await transport.sendMail(message);
  }
  async sendHtml(toEmail, subject, html) {
    const transport = this._getTransport();
    const message = {
      from: this.config.smtp.from,
      to: toEmail,
      subject,
      html
    };
    console.log(`EMAIL HTML: [${message.to}] - ${subject}`);
    return await transport.sendMail(message);
  }
  async sendTemplate(toEmail, template, parameters) {
    parameters = parameters || [];
    const filePath = path.join(__dirname, "./emailTemplates/", template.fileName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Could not find email template with path: ${filePath}`);
    }
    let html = fs.readFileSync(filePath, { encoding: "UTF8" });
    html = html.replace("[{solaris_url}]", this.config.clientUrl);
    html = html.replace("[{solaris_url_gamelist}]", `${this.config.clientUrl}/#/game/list`);
    html = html.replace("[{solaris_url_resetpassword}]", `${this.config.clientUrl}/#/account/reset-password-external`);
    html = html.replace("[{source_code_url}]", "https://github.com/solaris-games/solaris");
    for (let i = 0; i < parameters.length; i++) {
      let parameterString = `[{${i.toString()}}]`;
      html = html.split(parameterString).join(parameters[i].toString());
    }
    return await this.sendHtml(toEmail, template.subject, html);
  }
  async sendWelcomeEmail(user) {
    try {
      await this.sendTemplate(user.email, this.TEMPLATES.WELCOME, [user.username]);
    } catch (err) {
      console.error(err);
    }
  }
  async sendReviewReminderEmail(user) {
    if (!user.emailOtherEnabled) {
      throw new Error(`The user is not subscribed to review reminder emails.`);
    }
    await this.sendTemplate(user.email, this.TEMPLATES.REVIEW_REMINDER_30_DAYS, [
      user.username
    ]);
  }
  async sendGameStartedEmail(args) {
    let game = await this.gameService.getById(args.gameId);
    let gameUrl = `${this.config.clientUrl}/#/game?id=${game._id}`;
    let gameName = game.settings.general.name;
    for (let player of game.galaxy.players.filter((p) => p.userId)) {
      await this._trySendEmailToPlayer(player, this.TEMPLATES.GAME_WELCOME, [
        gameName,
        gameUrl
      ]);
    }
  }
  async sendGameFinishedEmail(gameId) {
    let game = await this.gameService.getById(gameId);
    let gameUrl = `${this.config.clientUrl}/#/game?id=${game._id}`;
    let gameName = game.settings.general.name;
    for (let player of game.galaxy.players.filter((p) => p.userId)) {
      await this._trySendEmailToPlayer(player, this.TEMPLATES.GAME_FINISHED, [
        gameName,
        gameUrl
      ]);
    }
  }
  async sendGameCycleSummaryEmail(gameId) {
    let game = await this.gameService.getById(gameId);
    let leaderboard = this.leaderboardService.getGameLeaderboard(game).leaderboard;
    let leaderboardHtml = "";
    if (!this.gameTypeService.isDarkModeExtra(game)) {
      leaderboardHtml = leaderboard.map((l) => {
        return `
                    <tr>
                        <td><span style="color:#F39C12">${l.player.alias}</span></td>
                        <td>${l.stats.totalStars} Stars</td>
                        <td>${l.stats.totalShips} Ships in ${l.stats.totalCarriers} Carriers</td>
                    </tr>
                `;
      }).join("");
    }
    let gameUrl = `${this.config.clientUrl}/#/game?id=${game._id}`;
    let gameName = game.settings.general.name;
    let undefeatedPlayers = game.galaxy.players.filter((p) => !p.defeated && p.userId);
    let winConditionText = "";
    switch (game.settings.general.mode) {
      case "conquest":
        switch (game.settings.conquest.victoryCondition) {
          case "starPercentage":
            winConditionText = `Winner will be the first to <span style="color:#3498DB;">capture ${game.state.starsForVictory} of ${game.state.stars} stars</span>.`;
            break;
          case "homeStarPercentage":
            winConditionText = `Winner will be the first to <span style="color:#3498DB;">capture ${game.state.starsForVictory} capital stars of ${game.settings.general.playerLimit} stars</span>.`;
            break;
          default:
            throw new Error(`Unsupported conquest victory condition: ${game.settings.conquest.victoryCondition}`);
        }
        break;
      case "battleRoyale":
        winConditionText = 'Winner will be the <span style="color:#3498DB;">last man standing</span>.';
        break;
      case "kingOfTheHill":
        winConditionText = 'Winner will be the player who <span style="color:#3498DB;">captures and holds</span> the center star.';
        break;
    }
    for (let player of undefeatedPlayers) {
      await this._trySendEmailToPlayer(player, this.TEMPLATES.GAME_CYCLE_SUMMARY, [
        gameName,
        gameUrl,
        winConditionText,
        leaderboardHtml
      ]);
    }
  }
  async trySendLastPlayerTurnReminder(gameId) {
    let game = await this.gameService.getById(gameId);
    if (!this.gameTypeService.isTurnBasedGame(game)) {
      throw new Error("Cannot send a last turn reminder for non turn based games.");
    }
    if (!this.gameStateService.isInProgress(game)) {
      return;
    }
    let undefeatedPlayers = game.galaxy.players.filter((p) => !p.defeated && !p.ready && p.userId);
    if (undefeatedPlayers.length === 1) {
      let player = undefeatedPlayers[0];
      if (player.hasSentTurnReminder) {
        return;
      }
      await this.playerService.setHasSentTurnReminder(game, player, true);
      let gameUrl = `${this.config.clientUrl}/#/game?id=${game._id}`;
      let gameName = game.settings.general.name;
      await this._trySendEmailToPlayer(player, this.TEMPLATES.YOUR_TURN_REMINDER, [
        gameName,
        gameUrl
      ]);
    }
  }
  async trySendNextTurnReminder(gameId) {
    let game = await this.gameService.getById(gameId);
    if (!this.gameTypeService.isTurnBasedGame(game) || !this.gameStateService.isInProgress(game) || this.gameTypeService.isTutorialGame(game)) {
      return;
    }
    let undefeatedPlayers = game.galaxy.players.filter((p) => !p.defeated && !p.ready && p.userId);
    let gameUrl = `${this.config.clientUrl}/#/game?id=${game._id}`;
    let gameName = game.settings.general.name;
    for (let player of undefeatedPlayers) {
      await this._trySendEmailToPlayer(player, this.TEMPLATES.NEXT_TURN_REMINDER, [
        gameName,
        gameUrl
      ]);
    }
  }
  async sendGameTimedOutEmail(gameId) {
    let game = await this.gameService.getById(gameId);
    let gameName = game.settings.general.name;
    for (let player of game.galaxy.players.filter((p) => p.userId)) {
      await this._trySendEmailToPlayer(player, this.TEMPLATES.GAME_TIMED_OUT, [
        gameName
      ]);
    }
  }
  async sendGamePlayerAfkEmail(args) {
    let game = await this.gameService.getById(args.gameId);
    if (this.gameTypeService.isTutorialGame(game)) {
      return;
    }
    let player = this.playerService.getById(game, args.playerId);
    if (player && player.userId) {
      let gameUrl = `${this.config.clientUrl}/#/game?id=${game._id}`;
      let gameName = game.settings.general.name;
      await this._trySendEmailToPlayer(player, this.TEMPLATES.GAME_PLAYER_AFK, [
        gameName,
        gameUrl
      ]);
    }
  }
  async _trySendEmailToPlayer(player, template, args) {
    if (!player.userId) {
      throw new Error(`Cannot send an email to an unknown player.`);
    }
    let user = await this.userService.getEmailById(player.userId);
    if (user && user.emailEnabled) {
      try {
        await this.sendTemplate(user.email, template, args);
      } catch (err) {
        console.error(err);
      }
    }
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=email.js.map
