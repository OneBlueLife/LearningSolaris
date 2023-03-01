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
var admin_exports = {};
__export(admin_exports, {
  default: () => admin_default
});
module.exports = __toCommonJS(admin_exports);
var import_validation = __toESM(require("../../errors/validation"));
var admin_default = (container) => {
  return {
    getInsights: async (req, res, next) => {
      try {
        let result = await container.adminService.getInsights();
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    },
    listUsers: async (req, res, next) => {
      try {
        let result = await container.adminService.listUsers(req.session.roles.administrator, 300);
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    },
    listPasswordResets: async (req, res, next) => {
      try {
        let result = await container.adminService.listPasswordResets();
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    },
    listReports: async (req, res, next) => {
      try {
        let result = await container.reportService.listReports();
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    },
    actionReport: async (req, res, next) => {
      try {
        await container.reportService.actionReport(req.params.reportId);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    setRoleContributor: async (req, res, next) => {
      try {
        await container.adminService.setRoleContributor(req.params.userId, req.body.enabled);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    setRoleDeveloper: async (req, res, next) => {
      try {
        await container.adminService.setRoleDeveloper(req.params.userId, req.body.enabled);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    setRoleGameMaster: async (req, res, next) => {
      try {
        await container.adminService.setRoleGameMaster(req.params.userId, req.body.enabled);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    setRoleCommunityManager: async (req, res, next) => {
      try {
        await container.adminService.setRoleCommunityManager(req.params.userId, req.body.enabled);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    setCredits: async (req, res, next) => {
      try {
        await container.userService.setCredits(req.params.userId, req.body.credits);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    banUser: async (req, res, next) => {
      try {
        await container.adminService.ban(req.params.userId);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    unbanUser: async (req, res, next) => {
      try {
        await container.adminService.unban(req.params.userId);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    resetAchievements: async (req, res, next) => {
      try {
        await container.adminService.resetAchievements(req.params.userId);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    promoteToEstablishedPlayer: async (req, res, next) => {
      try {
        await container.adminService.promoteToEstablishedPlayer(req.params.userId);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    impersonate: async (req, res, next) => {
      try {
        const user = await container.userService.getById(req.params.userId);
        if (!user) {
          throw new import_validation.default(`User does not exist.`);
        }
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.roles = user.roles;
        req.session.userCredits = user.credits;
        req.session.isImpersonating = true;
        return res.status(200).json({
          _id: user._id,
          username: user.username,
          roles: user.roles,
          credits: user.credits
        });
      } catch (err) {
        return next(err);
      }
    },
    listGames: async (req, res, next) => {
      try {
        let result = await container.adminService.listGames(100);
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    },
    setGameFeatured: async (req, res, next) => {
      try {
        await container.adminService.setGameFeatured(req.params.gameId, req.body.featured);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    setGameTimeMachine: async (req, res, next) => {
      try {
        await container.adminService.setGameTimeMachine(req.params.gameId, req.body.timeMachine);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    forceEndGame: async (req, res, next) => {
      try {
        await container.gameService.forceEndGame(req.game);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=admin.js.map
