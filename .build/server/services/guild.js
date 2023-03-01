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
var guild_exports = {};
__export(guild_exports, {
  default: () => GuildService
});
module.exports = __toCommonJS(guild_exports);
var import_validation = __toESM(require("../errors/validation"));
const mongoose = require("mongoose");
function toProperCase(string) {
  return string.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
;
const _GuildService = class {
  constructor(guildModel, guildRepo, userRepo, userService) {
    this.MAX_MEMBER_COUNT = 100;
    this.MAX_INVITE_COUNT = 100;
    this.CREATE_GUILD_CREDITS_COST = 3;
    this.RENAME_GUILD_CREDITS_COST = 1;
    this.guildModel = guildModel;
    this.guildRepo = guildRepo;
    this.userRepo = userRepo;
    this.userService = userService;
  }
  async list() {
    let users = await this.userService.listUsersInGuilds();
    let guilds = await this.guildRepo.find({}, {
      name: 1,
      tag: 1
    });
    let guildsWithRank = guilds.map((guild) => {
      let usersInGuild = users.filter((x) => x.guildId && x.guildId.toString() === guild._id.toString());
      let totalRank = usersInGuild.reduce((sum, i) => sum + i.achievements.rank, 0);
      return {
        ...guild,
        totalRank
      };
    });
    return guildsWithRank.sort((a, b) => b.totalRank - a.totalRank);
  }
  async listInfoByIds(guildIds) {
    return await this.guildRepo.find({
      _id: {
        $in: guildIds
      }
    }, {
      name: 1,
      tag: 1
    });
  }
  async getInfoById(guildId) {
    return await this.guildRepo.findOne({
      _id: guildId
    }, {
      name: 1,
      tag: 1
    });
  }
  async listInvitations(userId) {
    let guilds = await this.guildRepo.find({
      invitees: {
        $in: [mongoose.Types.ObjectId(userId)]
      }
    }, {
      name: 1,
      tag: 1
    });
    return guilds;
  }
  async listApplications(userId) {
    let guilds = await this.guildRepo.find({}, {
      _id: 1,
      name: 1,
      tag: 1,
      applicants: 1
    });
    return guilds.map((g) => {
      let hasApplied = this._isApplicant(g, userId);
      return {
        _id: g._id,
        name: g.name,
        tag: g.tag,
        hasApplied
      };
    });
  }
  async detailWithUserInfo(guildId, withInvitationsAndApplications = false) {
    if (guildId == null) {
      throw new import_validation.default("Guild ID is required.");
    }
    let guild = await this.guildRepo.findOne({
      _id: guildId
    });
    if (!guild) {
      throw new import_validation.default("Guild not found.");
    }
    let guildWithUsers = {
      _id: guild._id,
      name: guild.name,
      tag: guild.tag
    };
    let userSelectObject = {
      username: 1,
      "achievements.level": 1,
      "achievements.rank": 1,
      "achievements.victories": 1,
      "achievements.renown": 1
    };
    let usersInGuild = await this.userService.listUsersInGuild(guildId, userSelectObject);
    guildWithUsers.leader = usersInGuild.find((x) => x._id.toString() === guild.leader.toString());
    guildWithUsers.officers = usersInGuild.filter((x) => this._isOfficer(guild, x._id));
    guildWithUsers.members = usersInGuild.filter((x) => this._isMember(guild, x._id));
    if (withInvitationsAndApplications) {
      guildWithUsers.invitees = await this.userService.listUsers(guild.invitees, userSelectObject);
      guildWithUsers.applicants = await this.userService.listUsers(guild.applicants, userSelectObject);
    } else {
      delete guildWithUsers.invitees;
      delete guildWithUsers.applicants;
    }
    guildWithUsers.totalRank = usersInGuild.reduce((sum, i) => sum + i.achievements.rank, 0);
    return guildWithUsers;
  }
  async detail(guildId) {
    if (guildId == null) {
      throw new import_validation.default("Guild ID is required.");
    }
    let guild = await this.guildRepo.findOne({
      _id: guildId
    });
    if (!guild) {
      throw new import_validation.default("Guild not found.");
    }
    return guild;
  }
  async detailMyGuild(userId, withUserInfo = false) {
    let user = await this.userService.getById(userId, {
      guildId: 1
    });
    if (!user || !user.guildId) {
      return null;
    }
    return await this.detailWithUserInfo(user.guildId, true);
  }
  async create(userId, name, tag) {
    let isUserInAGuild = await this._isUserInAGuild(userId);
    if (isUserInAGuild) {
      throw new import_validation.default(`Cannot create a guild if you are already a member in another guild.`);
    }
    let userCredits = await this.userService.getCredits(userId);
    if (userCredits < this.CREATE_GUILD_CREDITS_COST) {
      throw new import_validation.default(`You do not have enough credits to found a guild. The cost is ${this.CREATE_GUILD_CREDITS_COST} credits, you have ${userCredits}.`);
    }
    name = toProperCase(name.trim());
    tag = tag.trim().replace(/\s/g, "");
    let existing = await this.guildRepo.findOne({
      $or: [
        { name },
        { tag }
      ]
    });
    if (existing) {
      throw new import_validation.default(`A guild with the same name or tag already exists.`);
    }
    await this.declineAllInvitations(userId);
    await this.withdrawAllApplications(userId);
    let guild = new this.guildModel();
    guild.leader = userId;
    guild.name = name;
    guild.tag = tag;
    await guild.save();
    await this.userRepo.updateOne({
      _id: userId
    }, {
      $set: {
        guildId: guild._id
      },
      $inc: {
        credits: -this.CREATE_GUILD_CREDITS_COST
      }
    });
    return guild;
  }
  async rename(userId, newName, newTag) {
    let user = await this.userService.getById(userId, {
      guildId: 1
    });
    if (!user.guildId) {
      throw new import_validation.default("You are not a member of a guild.");
    }
    let guild = await this.detail(user.guildId);
    let isLeader = this._isLeader(guild, userId);
    if (!isLeader) {
      throw new import_validation.default("Only guild leaders can rename their guild.");
    }
    let userCredits = await this.userService.getCredits(userId);
    if (userCredits < this.RENAME_GUILD_CREDITS_COST) {
      throw new import_validation.default(`You do not have enough credits to rename your guild. The cost is ${this.RENAME_GUILD_CREDITS_COST} credits, you have ${userCredits}.`);
    }
    newName = toProperCase(newName.trim());
    newTag = newTag.trim().replace(/\s/g, "");
    await this.guildRepo.updateOne({
      _id: guild._id
    }, {
      $set: {
        name: newName,
        tag: newTag
      }
    });
    await this.userRepo.updateOne({
      _id: userId
    }, {
      $inc: {
        credits: -this.RENAME_GUILD_CREDITS_COST
      }
    });
  }
  async delete(userId, guildId) {
    let guild = await this.detail(guildId);
    if (!this._isLeader(guild, userId)) {
      throw new import_validation.default(`You do not have the authority to disband the guild.`);
    }
    await this.userRepo.updateMany({
      guildId
    }, {
      $unset: {
        guildId: void 0
      }
    });
    await this.guildRepo.deleteOne({
      _id: guildId
    });
  }
  async invite(username, guildId, invitedByUserId) {
    let user = await this.userService.getByUsername(username, {
      username: 1,
      "achievements.level": 1,
      "achievements.rank": 1,
      "achievements.victories": 1,
      "achievements.renown": 1
    });
    if (!user) {
      throw new import_validation.default(`A player with the username does not exist.`);
    }
    let userId = user._id;
    let isUserInAGuild = await this._isUserInAGuild(userId);
    if (isUserInAGuild) {
      throw new import_validation.default(`Cannot invite this user, the user is already a member of a guild.`);
    }
    let guild = await this.detail(guildId);
    let hasPermission = this._isLeader(guild, invitedByUserId) || this._isOfficer(guild, invitedByUserId);
    if (!hasPermission) {
      throw new import_validation.default(`You do not have the authority to invite new members to the guild.`);
    }
    if (this._isInvitee(guild, userId)) {
      throw new import_validation.default(`The user has already been invited to the guild.`);
    }
    if (this._isApplicant(guild, userId)) {
      return this.accept(userId, guildId, invitedByUserId);
    }
    if (guild.invitees.length >= this.MAX_INVITE_COUNT) {
      throw new import_validation.default(`There is a maximum of ${this.MAX_INVITE_COUNT} invitees at one time.`);
    }
    await this.guildRepo.updateOne({
      _id: guildId
    }, {
      $push: {
        invitees: userId
      }
    });
    return user;
  }
  async uninvite(userId, guildId, uninvitedByUserId) {
    let guild = await this.detail(guildId);
    let hasPermission = this._isLeader(guild, uninvitedByUserId) || this._isOfficer(guild, uninvitedByUserId);
    if (!hasPermission) {
      throw new import_validation.default(`You do not have the authority to uninvite users from the guild.`);
    }
    if (!this._isInvitee(guild, userId)) {
      throw new import_validation.default(`The user has not been invited to the guild.`);
    }
    await this.guildRepo.updateOne({
      _id: guildId
    }, {
      $pull: {
        invitees: userId
      }
    });
  }
  async decline(userId, guildId) {
    let guild = await this.detail(guildId);
    if (!this._isInvitee(guild, userId)) {
      throw new import_validation.default(`The user is not an invitee of this guild.`);
    }
    await this.guildRepo.updateOne({
      _id: guildId
    }, {
      $pull: {
        invitees: userId
      }
    });
  }
  async declineAllInvitations(userId) {
    await this.guildRepo.updateMany({
      invitees: {
        $in: [userId]
      }
    }, {
      $pull: {
        invitees: userId
      }
    });
  }
  async withdrawAllApplications(userId) {
    await this.guildRepo.updateMany({
      applicants: {
        $in: [userId]
      }
    }, {
      $pull: {
        applicants: userId
      }
    });
  }
  async apply(userId, guildId) {
    let isUserInAGuild = await this._isUserInAGuild(userId);
    if (isUserInAGuild) {
      throw new import_validation.default(`Cannot apply to this guild, you are already a member of a guild.`);
    }
    let guild = await this.detail(guildId);
    if (this._isApplicant(guild, userId)) {
      throw new import_validation.default(`You have already applied to become a member of this guild.`);
    }
    await this.guildRepo.updateOne({
      _id: guildId
    }, {
      $push: {
        applicants: userId
      }
    });
  }
  async withdraw(userId, guildId) {
    let guild = await this.detail(guildId);
    if (!this._isApplicant(guild, userId)) {
      throw new import_validation.default(`You have not applied to become a member of this guild.`);
    }
    await this.guildRepo.updateOne({
      _id: guildId
    }, {
      $pull: {
        applicants: userId
      }
    });
  }
  async accept(userId, guildId, acceptedByUserId) {
    let guild = await this.detail(guildId);
    let hasPermission = this._isLeader(guild, acceptedByUserId) || this._isOfficer(guild, acceptedByUserId);
    if (!hasPermission) {
      throw new import_validation.default(`You do not have the authority to accept applications to the guild.`);
    }
    await this.join(userId, guildId);
  }
  async reject(userId, guildId, rejectedByUserId) {
    let guild = await this.detail(guildId);
    let hasPermission = this._isLeader(guild, rejectedByUserId) || this._isOfficer(guild, rejectedByUserId);
    if (!hasPermission) {
      throw new import_validation.default(`You do not have the authority to reject applications to the guild.`);
    }
    if (!this._isApplicant(guild, userId)) {
      throw new import_validation.default(`The user has not applied to become a member of the guild.`);
    }
    await this.guildRepo.updateOne({
      _id: guildId
    }, {
      $pull: {
        applicants: userId
      }
    });
  }
  async join(userId, guildId) {
    let guild = await this.detail(guildId);
    if (!this._isApplicant(guild, userId) && !this._isInvitee(guild, userId)) {
      throw new import_validation.default(`The user is not an invitee or applicant of this guild.`);
    }
    await this.declineAllInvitations(userId);
    await this.withdrawAllApplications(userId);
    await this.guildRepo.updateOne({
      _id: guildId
    }, {
      $push: {
        members: userId
      }
    });
    await this.userRepo.updateOne({
      _id: userId
    }, {
      $set: {
        guildId
      }
    });
    guild.members.push(userId);
    if (this._totalMemberCount(guild) >= this.MAX_MEMBER_COUNT) {
      await this.guildRepo.updateOne({
        _id: guildId
      }, {
        $set: {
          invitees: [],
          applicants: []
        }
      });
    }
  }
  async tryLeave(userId) {
    let guild = await this.detailMyGuild(userId, false);
    if (guild) {
      await this.leave(userId, guild._id);
    }
  }
  async leave(userId, guildId) {
    let guild = await this.detail(guildId);
    if (this._isLeader(guild, userId)) {
      throw new import_validation.default(`Cannot leave your guild if you are the leader, promote a new guild leader first.`);
    }
    await this._removeUser(guild, userId);
  }
  async promote(userId, guildId, promotedByUserId) {
    let guild = await this.detail(guildId);
    let hasPermission = this._isLeader(guild, promotedByUserId) || this._isOfficer(guild, promotedByUserId) && this._isMember(guild, userId);
    if (!hasPermission) {
      throw new import_validation.default(`You do not have the authority to promote this member.`);
    }
    if (this._isOfficer(guild, userId)) {
      await this.guildRepo.updateOne({
        _id: guildId,
        "officers": userId
      }, {
        $set: {
          leader: userId,
          "officers.$": promotedByUserId
        }
      });
    } else if (this._isMember(guild, userId)) {
      await this.guildRepo.updateOne({
        _id: guildId
      }, {
        $pull: {
          members: userId
        },
        $push: {
          officers: userId
        }
      });
    } else {
      throw new import_validation.default(`The user is not a member of this guild.`);
    }
  }
  async demote(userId, guildId, demotedByUserId) {
    let guild = await this.detail(guildId);
    let hasPermission = this._isLeader(guild, demotedByUserId);
    if (!hasPermission) {
      throw new import_validation.default(`You do not have the authority to demote this member.`);
    }
    let updateObject = null;
    if (this._isOfficer(guild, userId)) {
      updateObject = {
        $pull: {
          officers: userId
        },
        $push: {
          members: userId
        }
      };
    } else if (this._isMember(guild, userId)) {
      throw new import_validation.default(`Members cannot be demoted.`);
    } else {
      throw new import_validation.default(`The user is not a member of this guild.`);
    }
    await this.guildRepo.updateOne({
      _id: guildId
    }, updateObject);
  }
  async kick(userId, guildId, kickedByUserId) {
    let guild = await this.detail(guildId);
    if (this._isLeader(guild, userId)) {
      throw new import_validation.default(`Cannot kick the guild leader.`);
    }
    let hasPermission = this._isLeader(guild, kickedByUserId) || this._isOfficer(guild, kickedByUserId) && this._isMember(guild, userId);
    if (!hasPermission) {
      throw new import_validation.default(`You do not have the authority to kick this member.`);
    }
    await this._removeUser(guild, userId);
  }
  async _removeUser(guild, userId) {
    let updateObject = null;
    if (this._isOfficer(guild, userId)) {
      updateObject = {
        $pull: {
          officers: userId
        }
      };
    } else if (this._isMember(guild, userId)) {
      updateObject = {
        $pull: {
          members: userId
        }
      };
    } else {
      throw new import_validation.default(`The user is not a member of this guild.`);
    }
    await this.guildRepo.updateOne({
      _id: guild._id
    }, updateObject);
    await this.userRepo.updateOne({
      _id: userId
    }, {
      $set: {
        guildId: null
      }
    });
  }
  _isLeader(guild, userId) {
    return guild.leader.toString() === userId.toString();
  }
  _isOfficer(guild, userId) {
    return guild.officers.find((x) => x.toString() === userId.toString()) != null;
  }
  _isMember(guild, userId) {
    return guild.members.find((x) => x.toString() === userId.toString()) != null;
  }
  _isInvitee(guild, userId) {
    return guild.invitees.find((x) => x.toString() === userId.toString()) != null;
  }
  _isApplicant(guild, userId) {
    return guild.applicants.find((x) => x.toString() === userId.toString()) != null;
  }
  _totalMemberCount(guild) {
    return 1 + guild.officers.length + guild.members.length;
  }
  async _isUserInAGuild(userId) {
    return await this.userRepo.count({
      _id: userId,
      guildId: { $ne: null }
    }) > 0;
  }
  async listUserRanksInGuilds() {
    return await this.userRepo.find({
      guildId: { $ne: null }
    }, {
      guildId: 1,
      "achievements.rank": 1
    });
  }
  async getLeaderboard(limit, sortingKey) {
    limit = limit || 100;
    sortingKey = _GuildService.SORTERS.includes(sortingKey) ? sortingKey : "totalRank";
    let guilds = await this.guildRepo.find({}, {
      name: 1,
      tag: 1,
      leader: 1,
      officers: 1,
      members: 1
    });
    let users = await this.listUserRanksInGuilds();
    let guildsWithRank = guilds.map((guild) => {
      let usersInGuild = users.filter((x) => x.guildId.toString() === guild._id.toString());
      let totalRank = usersInGuild.reduce((sum, i) => sum + i.achievements.rank, 0);
      let memberCount = usersInGuild.length;
      return {
        ...guild,
        totalRank,
        memberCount
      };
    });
    let leaderboard = guildsWithRank.sort((a, b) => b[sortingKey] - a[sortingKey]).slice(0, limit);
    for (let i = 0; i < leaderboard.length; i++) {
      leaderboard[i].position = i + 1;
    }
    return {
      leaderboard,
      totalGuilds: guildsWithRank.length
    };
  }
};
let GuildService = _GuildService;
GuildService.SORTERS = ["totalRank", "memberCount"];
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=guild.js.map
