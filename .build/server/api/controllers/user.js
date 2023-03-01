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
  default: () => user_default
});
module.exports = __toCommonJS(user_exports);
var import_validation = __toESM(require("../../errors/validation"));
var import_user = require("../requests/user");
var user_default = (container) => {
  return {
    listLeaderboard: async (req, res, next) => {
      try {
        const limit = +req.query.limit || null;
        const result = await container.leaderboardService.getUserLeaderboard(limit, req.query.sortingKey);
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    },
    create: async (req, res, next) => {
      let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      let recaptchaEnabled = container.recaptchaService.isEnabled();
      try {
        const reqObj = (0, import_user.mapToUserCreateUserRequest)(req.body, recaptchaEnabled);
        const email = reqObj.email.toLowerCase();
        const emailExists = await container.userService.userExists(email);
        if (emailExists) {
          throw new import_validation.default("An account with this email already exists");
        }
        const username = reqObj.username;
        const usernameExists = await container.userService.usernameExists(username);
        if (usernameExists) {
          throw new import_validation.default("An account with this username already exists");
        }
        if (recaptchaEnabled) {
          try {
            let ip2 = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
            await container.recaptchaService.verify(ip2, reqObj.recaptchaToken);
          } catch (err) {
            throw new import_validation.default(["Recaptcha is invalid"]);
          }
        }
        let userId = await container.userService.create(email, username, reqObj.password, ip);
        return res.status(201).json({ id: userId });
      } catch (err) {
        return next(err);
      }
    },
    getSettings: async (req, res, next) => {
      try {
        let settings = await container.userService.getGameSettings(req.session.userId);
        return res.status(200).json(settings);
      } catch (err) {
        return next(err);
      }
    },
    saveSettings: async (req, res, next) => {
      try {
        await container.userService.saveGameSettings(req.session.userId, req.body);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    getSubscriptions: async (req, res, next) => {
      try {
        let subscriptions = await container.userService.getSubscriptions(req.session.userId);
        return res.status(200).json(subscriptions);
      } catch (err) {
        return next(err);
      }
    },
    saveSubscriptions: async (req, res, next) => {
      try {
        await container.userService.saveSubscriptions(req.session.userId, req.body);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    getCredits: async (req, res, next) => {
      try {
        let credits = await container.userService.getCredits(req.session.userId);
        return res.status(200).json({
          credits
        });
      } catch (err) {
        return next(err);
      }
    },
    detailMe: async (req, res, next) => {
      try {
        let user = await container.userService.getMe(req.session.userId);
        return res.status(200).json(user);
      } catch (err) {
        return next(err);
      }
    },
    listMyAvatars: async (req, res, next) => {
      try {
        let avatars = await container.avatarService.listUserAvatars(req.session.userId);
        return res.status(200).json(avatars);
      } catch (err) {
        return next(err);
      }
    },
    purchaseAvatar: async (req, res, next) => {
      try {
        await container.avatarService.purchaseAvatar(req.session.userId, parseInt(req.params.avatarId));
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    detail: async (req, res, next) => {
      try {
        let user = await container.userService.getInfoByIdLean(req.params.id);
        return res.status(200).json(user);
      } catch (err) {
        return next(err);
      }
    },
    getAchievements: async (req, res, next) => {
      try {
        let achievements = await container.achievementService.getAchievements(req.params.id);
        return res.status(200).json(achievements);
      } catch (err) {
        return next(err);
      }
    },
    updateEmailPreference: async (req, res, next) => {
      try {
        const reqObj = (0, import_user.mapToUserUpdateEmailPreferenceRequest)(req.body);
        await container.userService.updateEmailPreference(req.session.userId, reqObj.enabled);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    updateEmailOtherPreference: async (req, res, next) => {
      try {
        const reqObj = (0, import_user.mapToUserUpdateEmailPreferenceRequest)(req.body);
        await container.userService.updateEmailOtherPreference(req.session.userId, reqObj.enabled);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    updateUsername: async (req, res, next) => {
      try {
        const reqObj = (0, import_user.mapToUserUpdateUsernameRequest)(req.body);
        await container.userService.updateUsername(req.session.userId, reqObj.username);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    updateEmailAddress: async (req, res, next) => {
      try {
        const reqObj = (0, import_user.mapToUserUpdateEmailRequest)(req.body);
        await container.userService.updateEmailAddress(req.session.userId, reqObj.email);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    updatePassword: async (req, res, next) => {
      try {
        const reqObj = (0, import_user.mapToUserUpdatePasswordRequest)(req.body);
        await container.userService.updatePassword(
          req.session.userId,
          reqObj.currentPassword,
          reqObj.newPassword
        );
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    requestPasswordReset: async (req, res, next) => {
      try {
        const reqObj = (0, import_user.mapToUserRequestPasswordResetRequest)(req.body);
        let token = await container.userService.requestResetPassword(reqObj.email);
        try {
          await container.emailService.sendTemplate(reqObj.email, container.emailService.TEMPLATES.RESET_PASSWORD, [token]);
        } catch (emailError) {
          console.error(emailError);
          return res.sendStatus(500);
        }
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    resetPassword: async (req, res, next) => {
      try {
        const reqObj = (0, import_user.mapToUserResetPasswordResetRequest)(req.body);
        await container.userService.resetPassword(reqObj.token, reqObj.newPassword);
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    requestUsername: async (req, res, next) => {
      try {
        const reqObj = (0, import_user.mapToUserRequestUsernameRequest)(req.body);
        let username = await container.userService.getUsernameByEmail(reqObj.email);
        try {
          await container.emailService.sendTemplate(reqObj.email, container.emailService.TEMPLATES.FORGOT_USERNAME, [username]);
        } catch (emailError) {
          console.error(emailError);
          return res.sendStatus(500);
        }
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    delete: async (req, res, next) => {
      try {
        await container.gameService.quitAllActiveGames(req.session.userId);
        await container.guildService.tryLeave(req.session.userId);
        await container.guildService.declineAllInvitations(req.session.userId);
        await container.userService.closeAccount(req.session.userId);
        req.session.destroy((err) => {
          if (err) {
            return next(err);
          }
          return res.sendStatus(200);
        });
      } catch (err) {
        return next(err);
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=user.js.map
