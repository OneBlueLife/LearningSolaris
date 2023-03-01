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
var guild_exports = {};
__export(guild_exports, {
  default: () => guild_default
});
module.exports = __toCommonJS(guild_exports);
var import_guild = require("../requests/guild");
var guild_default = (container) => {
  return {
    list: async (req, res, next) => {
      try {
        let result = await container.guildService.list();
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    },
    detailMine: async (req, res, next) => {
      try {
        let result = await container.guildService.detailMyGuild(req.session.userId, true);
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    },
    listLeaderboard: async (req, res, next) => {
      try {
        let limit = +req.query.limit || null;
        let sortingKey = req.query.sortingKey || null;
        let result = await container.guildService.getLeaderboard(limit, sortingKey);
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    },
    listMyInvites: async (req, res, next) => {
      try {
        let result = await container.guildService.listInvitations(req.session.userId);
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    },
    listMyApplications: async (req, res, next) => {
      try {
        let result = await container.guildService.listApplications(req.session.userId);
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    },
    detail: async (req, res, next) => {
      try {
        const result = await container.guildService.detailWithUserInfo(req.params.guildId, false);
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    },
    create: async (req, res, next) => {
      try {
        const reqObj = (0, import_guild.mapToGuildCreateGuildRequest)(req.body);
        let result = await container.guildService.create(req.session.userId, reqObj.name, reqObj.tag);
        return res.status(201).json(result);
      } catch (err) {
        return next(err);
      }
    },
    rename: async (req, res, next) => {
      try {
        const reqObj = (0, import_guild.mapToGuildRenameGuildRequest)(req.body);
        await container.guildService.rename(req.session.userId, reqObj.name, reqObj.tag);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    delete: async (req, res, next) => {
      try {
        await container.guildService.delete(req.session.userId, req.params.guildId);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    invite: async (req, res, next) => {
      try {
        const reqObj = (0, import_guild.mapToGuildInviteUserRequest)(req.body);
        let result = await container.guildService.invite(reqObj.username, req.params.guildId, req.session.userId);
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    },
    uninvite: async (req, res, next) => {
      try {
        await container.guildService.uninvite(req.params.userId, req.params.guildId, req.session.userId);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    acceptInviteForApplicant: async (req, res, next) => {
      try {
        await container.guildService.accept(req.params.userId, req.params.guildId, req.session.userId);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    acceptInvite: async (req, res, next) => {
      try {
        await container.guildService.join(req.session.userId, req.params.guildId);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    declineInvite: async (req, res, next) => {
      try {
        await container.guildService.decline(req.session.userId, req.params.guildId);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    apply: async (req, res, next) => {
      try {
        await container.guildService.apply(req.session.userId, req.params.guildId);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    withdraw: async (req, res, next) => {
      try {
        await container.guildService.withdraw(req.session.userId, req.params.guildId);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    reject: async (req, res, next) => {
      try {
        await container.guildService.reject(req.params.userId, req.params.guildId, req.session.userId);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    leave: async (req, res, next) => {
      try {
        await container.guildService.leave(req.session.userId, req.params.guildId);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    promote: async (req, res, next) => {
      try {
        await container.guildService.promote(req.params.userId, req.params.guildId, req.session.userId);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    demote: async (req, res, next) => {
      try {
        await container.guildService.demote(req.params.userId, req.params.guildId, req.session.userId);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    kick: async (req, res, next) => {
      try {
        await container.guildService.kick(req.params.userId, req.params.guildId, req.session.userId);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=guild.js.map
