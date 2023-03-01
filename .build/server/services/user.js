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
var user_exports = {};
__export(user_exports, {
  UserServiceEvents: () => UserServiceEvents,
  default: () => UserService
});
module.exports = __toCommonJS(user_exports);
var import_validation = __toESM(require("../errors/validation"));
const EventEmitter = require("events");
const moment = require("moment");
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
const UserServiceEvents = {
  onUserCreated: "onUserCreated"
};
class UserService extends EventEmitter {
  constructor(userModel, userRepo, passwordService) {
    super();
    this.userModel = userModel;
    this.userRepo = userRepo;
    this.passwordService = passwordService;
  }
  async getMe(id) {
    return await this.userRepo.findById(id, {
      password: 0,
      resetPasswordToken: 0,
      premiumEndDate: 0,
      banned: 0,
      lastSeen: 0,
      lastSeenIP: 0,
      "oauth.discord.token": 0
    });
  }
  async getById(id, select = null) {
    return await this.userRepo.findById(id, select);
  }
  async getByUsername(username, select = null) {
    return await this.userRepo.findOne({
      username
    }, select);
  }
  async getByUsernameAchievementsLean(username) {
    return await this.userRepo.findOne({
      username
    }, {
      username: 1,
      achievements: 1
    });
  }
  async getUserCount() {
    return this.userRepo.countAll();
  }
  async getGameUsers(game) {
    return await this.userRepo.findAsModels({
      _id: {
        $in: game.galaxy.players.map((p) => p.userId)
      }
    });
  }
  async getInfoById(id) {
    return await this.userRepo.findByIdAsModel(id, {
      password: 0,
      resetPasswordToken: 0,
      premiumEndDate: 0,
      banned: 0,
      credits: 0,
      email: 0,
      emailEnabled: 0,
      username: 0,
      gameSettings: 0,
      lastSeen: 0,
      lastSeenIP: 0,
      oauth: 0
    });
  }
  async getInfoByIdLean(id, select) {
    select = select || {
      password: 0,
      resetPasswordToken: 0,
      premiumEndDate: 0,
      banned: 0,
      credits: 0,
      email: 0,
      emailEnabled: 0,
      username: 0,
      gameSettings: 0,
      lastSeen: 0,
      lastSeenIP: 0,
      oauth: 0
    };
    return await this.userRepo.findById(id, select);
  }
  async getEmailById(id) {
    return await this.userRepo.findById(id, {
      email: 1,
      emailEnabled: 1
    });
  }
  async getUsernameByEmail(email) {
    email = email.trim();
    email = email.toLowerCase();
    let user = await this.userRepo.findOne({
      email
    }, {
      username: 1
    });
    if (!user) {
      throw new import_validation.default(`An account with the email ${email} does not exist.`);
    }
    return user.username;
  }
  async getUserIsBanned(userId) {
    let user = await this.userRepo.findOne({
      _id: userId
    }, {
      banned: 1
    });
    if (user) {
      return user.banned;
    }
    return null;
  }
  async getUserIsAdmin(userId) {
    let user = await this.userRepo.findOne({
      _id: userId
    }, {
      "roles.administrator": 1
    });
    return user.roles.administrator;
  }
  async getUserIsSubAdmin(userId) {
    let user = await this.userRepo.findOne({
      _id: userId
    }, {
      "roles.administrator": 1,
      "roles.gameMaster": 1,
      "roles.communityManager": 1
    });
    return user.roles.administrator || user.roles.gameMaster || user.roles.communityManager;
  }
  async getUserIsGameMaster(userId) {
    let user = await this.userRepo.findOne({
      _id: userId,
      $or: [
        { "roles.administrator": 1 },
        { "roles.gameMaster": 1 }
      ]
    }, {
      _id: 1
    });
    return user != null;
  }
  async getUserIsCommunityManager(userId) {
    let user = await this.userRepo.findOne({
      _id: userId,
      $or: [
        { "roles.administrator": 1 },
        { "roles.communityManager": 1 }
      ]
    }, {
      _id: 1
    });
    return user != null;
  }
  async create(email, username, password, ipAddress) {
    let user = {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      lastSeen: moment().utc(),
      lastSeenIP: ipAddress
    };
    if (user.username.length < 3 || user.username.length > 24) {
      throw new import_validation.default("Username must be between 3 and 24 characters.");
    }
    const newUser = new this.userModel(user);
    newUser.password = await this.passwordService.hash(password);
    let doc = await newUser.save();
    this.emit(UserServiceEvents.onUserCreated, doc);
    return doc._id;
  }
  async userExists(email) {
    email = email.trim();
    email = email.toLowerCase();
    let user = await this.userRepo.findOne({
      email
    }, {
      _id: 1
    });
    return user != null;
  }
  async userIdExists(id) {
    let user = await this.userRepo.findOne({
      _id: id
    }, {
      _id: 1
    });
    return user != null;
  }
  async usernameExists(username) {
    username = username.trim();
    let user = await this.userRepo.findOne({
      username
    }, {
      _id: 1
    });
    return user != null;
  }
  async otherUsernameExists(username, ignoreUserId) {
    username = username.trim();
    let user = await this.userRepo.findOne({
      _id: { $ne: ignoreUserId },
      username
    }, {
      _id: 1
    });
    return user != null;
  }
  async updateEmailPreference(id, preference) {
    await this.userRepo.updateOne({
      _id: id
    }, {
      emailEnabled: preference
    });
  }
  async updateEmailOtherPreference(id, preference) {
    await this.userRepo.updateOne({
      _id: id
    }, {
      emailOtherEnabled: preference
    });
  }
  async updateEmailAddress(id, email) {
    email = email.trim();
    email = email.toLowerCase();
    if (await this.userExists(email)) {
      throw new import_validation.default("Cannot change your email address, the new email address is already in use by another account.");
    }
    await this.userRepo.updateOne({
      _id: id
    }, {
      email
    });
  }
  async updateUsername(id, username) {
    username = username.trim();
    if (username.length < 3 || username.length > 24) {
      throw new import_validation.default("Username must be between 3 and 24 characters.");
    }
    if (await this.usernameExists(username)) {
      throw new import_validation.default("Cannot change your username, the new username is already in use by another account.");
    }
    await this.userRepo.updateOne({
      _id: id
    }, {
      username
    });
  }
  async updatePassword(id, currentPassword, newPassword) {
    let user = await this.userRepo.findById(id);
    if (!user) {
      throw new import_validation.default(`Could not find user`, 404);
    }
    let result = await this.passwordService.compare(currentPassword, user.password);
    if (result) {
      let hash = await this.passwordService.hash(newPassword, 10);
      await this.userRepo.updateOne({
        _id: user._id
      }, {
        password: hash
      });
    } else {
      throw new import_validation.default("The current password is incorrect.");
    }
  }
  async requestResetPassword(email) {
    email = email.trim();
    email = email.toLowerCase();
    let user = await this.userRepo.findOne({
      email
    });
    if (user == null) {
      throw new import_validation.default(`An account does not exist with the email address: ${email}`);
    }
    let resetPasswordToken = uuidv4();
    await this.userRepo.updateOne({
      _id: user._id
    }, {
      resetPasswordToken
    });
    return resetPasswordToken;
  }
  async resetPassword(resetPasswordToken, newPassword) {
    if (resetPasswordToken == null || !resetPasswordToken.length) {
      throw new import_validation.default(`The token is required`);
    }
    let user = await this.userRepo.findOne({
      resetPasswordToken
    });
    if (user == null) {
      throw new import_validation.default(`The token is invalid.`);
    }
    let hash = await this.passwordService.hash(newPassword, 10);
    await this.userRepo.updateOne({
      _id: user._id
    }, {
      password: hash,
      resetPasswordToken: null
    });
  }
  async closeAccount(id) {
    await this.userRepo.deleteOne({
      _id: id
    });
  }
  async getGameSettings(userId) {
    if (!userId) {
      return new this.userModel().gameSettings;
    }
    let user = await this.getMe(userId);
    return user.gameSettings;
  }
  async saveGameSettings(userId, settings) {
    if (+settings.carrier.defaultAmount < 0) {
      throw new import_validation.default(`Carrier default amount must be greater than 0.`);
    }
    await this.userRepo.updateOne({
      _id: userId
    }, {
      gameSettings: settings
    });
  }
  async getSubscriptions(userId) {
    let user = await this.getMe(userId);
    return user.subscriptions;
  }
  async saveSubscriptions(userId, subscriptions) {
    var _a;
    let obj = {
      settings: {
        notifyActiveGamesOnly: ((_a = subscriptions.settings) == null ? void 0 : _a.notifyActiveGamesOnly) || false
      }
    };
    if (subscriptions.discord) {
      obj.discord = {
        gameEnded: subscriptions.discord.gameEnded || false,
        gameStarted: subscriptions.discord.gameStarted || false,
        gameTurnEnded: subscriptions.discord.gameTurnEnded || false,
        playerCreditsReceived: subscriptions.discord.playerCreditsReceived || false,
        playerCreditsSpecialistsReceived: subscriptions.discord.playerCreditsSpecialistsReceived || false,
        playerGalacticCycleComplete: subscriptions.discord.playerGalacticCycleComplete || false,
        playerRenownReceived: subscriptions.discord.playerRenownReceived || false,
        playerResearchComplete: subscriptions.discord.playerResearchComplete || false,
        playerTechnologyReceived: subscriptions.discord.playerTechnologyReceived || false,
        conversationMessageSent: subscriptions.discord.conversationMessageSent || false
      };
    }
    await this.userRepo.updateOne({
      _id: userId
    }, {
      subscriptions: obj
    });
  }
  async updateLastSeen(userId, ipAddress) {
    await this.userRepo.updateOne({
      _id: userId
    }, {
      $set: {
        "lastSeen": moment().utc(),
        "lastSeenIP": ipAddress
      }
    });
  }
  async listUserEloRatingsByIds(userIds) {
    return await this.userRepo.find({
      _id: { $in: userIds }
    }, {
      "achievements.eloRating": 1
    });
  }
  async listUsersInGuilds() {
    return await this.userRepo.find({
      guildId: { $ne: null }
    }, {
      "achievements.rank": 1
    });
  }
  async listUsersInGuild(guildId, select = null) {
    return await this.userRepo.find({
      guildId
    }, select);
  }
  async listUsers(userIds, select = null) {
    return await this.userRepo.find({
      _id: {
        $in: userIds
      }
    }, select);
  }
  async getCredits(userId) {
    let userCredits = await this.userRepo.findById(userId, {
      credits: 1
    });
    return (userCredits == null ? void 0 : userCredits.credits) || 0;
  }
  async setCredits(userId, credits) {
    credits = Math.max(credits, 0);
    await this.userRepo.updateOne({
      _id: userId
    }, {
      credits
    });
  }
  async incrementCredits(userId, credits) {
    await this.userRepo.updateOne({
      _id: userId
    }, {
      $inc: {
        credits
      }
    });
  }
  async incrementCreditsByPurchase(userId, credits) {
    await this.userRepo.updateOne({
      _id: userId
    }, {
      $set: {
        "roles.contributor": true
      },
      $inc: {
        credits
      }
    });
  }
  async isEstablishedPlayer(userId) {
    let user = await this.userRepo.findById(userId, {
      isEstablishedPlayer: 1
    });
    return (user == null ? void 0 : user.isEstablishedPlayer) || false;
  }
  async listUsersEligibleForReviewReminder(limit) {
    const date = moment().utc().add(-30, "days").toDate();
    const ltId = this.userRepo.objectIdFromDate(date);
    return await this.userRepo.find(
      {
        _id: { $lte: ltId },
        emailOtherEnabled: true,
        hasSentReviewReminder: false
      },
      {
        _id: 1,
        username: 1,
        email: 1,
        emailOtherEnabled: 1
      },
      {
        _id: 1
      },
      limit
    );
  }
  async setReviewReminderEmailSent(userId, sent) {
    await this.userRepo.updateOne({
      _id: userId
    }, {
      $set: {
        hasSentReviewReminder: sent
      }
    });
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UserServiceEvents
});
//# sourceMappingURL=user.js.map
