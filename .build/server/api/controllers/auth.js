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
var auth_exports = {};
__export(auth_exports, {
  default: () => auth_default
});
module.exports = __toCommonJS(auth_exports);
const axios = require("axios");
var auth_default = (container) => {
  return {
    login: async (req, res, next) => {
      try {
        let user = await container.authService.login(req.body.email, req.body.password);
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.roles = user.roles;
        req.session.userCredits = user.credits;
        req.session.isImpersonating = false;
        return res.status(200).json({
          _id: user._id,
          username: user.username,
          roles: user.roles,
          credits: user.credits
        });
      } catch (err) {
        next(err);
      }
    },
    logout: (req, res, next) => {
      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            return next(err);
          }
          return res.sendStatus(200);
        });
      } else {
        return res.sendStatus(200);
      }
    },
    verify: (req, res, next) => {
      const session = req.session;
      return res.status(200).json({
        _id: session.userId,
        username: session.username,
        roles: session.roles,
        credits: session.userCredits
      });
    },
    authoriseDiscord: async (req, res, next) => {
      const code = req.query.code;
      if (code) {
        try {
          await container.discordService.clearOAuth(req.session.userId);
          const params = new URLSearchParams({
            client_id: process.env.DISCORD_CLIENTID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: process.env.DISCORD_OAUTH_REDIRECT_URI,
            scope: "identify"
          });
          const oauthResult = await axios.post("https://discord.com/api/oauth2/token", params, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          });
          if (oauthResult.status === 200) {
            const userResult = await axios.get("https://discord.com/api/users/@me", {
              headers: {
                authorization: `${oauthResult.data.token_type} ${oauthResult.data.access_token}`
              }
            });
            if (userResult.status === 200) {
              await container.discordService.updateOAuth(req.session.userId, userResult.data.id, oauthResult.data);
              return res.redirect(`${process.env.CLIENT_URL_ACCOUNT_SETTINGS}?discordSuccess=true`);
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
      return res.redirect(`${process.env.CLIENT_URL_ACCOUNT_SETTINGS}?discordSuccess=false`);
    },
    unauthoriseDiscord: async (req, res, next) => {
      try {
        await container.discordService.clearOAuth(req.session.userId);
        return res.sendStatus(200);
      } catch (err) {
        next(err);
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=auth.js.map
