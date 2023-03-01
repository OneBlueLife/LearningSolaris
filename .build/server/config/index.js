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
var config_exports = {};
__export(config_exports, {
  default: () => config_default
});
module.exports = __toCommonJS(config_exports);
require("dotenv").config({ path: __dirname + "/../.env" });
const config = {
  port: process.env.PORT,
  sessionSecret: process.env.SESSION_SECRET,
  sessionSecureCookies: process.env.SESSION_SECURE_COOKIES == "true",
  connectionString: process.env.CONNECTION_STRING,
  serverUrl: process.env.SERVER_URL,
  clientUrl: process.env.CLIENT_URL,
  cacheEnabled: process.env.CACHE_ENABLED == "true",
  smtp: {
    enabled: process.env.SMTP_ENABLED == "true",
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    from: process.env.SMTP_FROM
  },
  google: {
    recaptcha: {
      enabled: process.env.GOOGLE_RECAPTCHA_ENABLED == "true",
      siteKey: process.env.GOOGLE_RECAPTCHA_SITE_KEY,
      secretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY
    }
  },
  paypal: {
    environment: process.env.PAYPAL_ENVIRONMENT || "sandbox",
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET
  },
  discord: {
    serverId: process.env.DISCORD_SERVERID,
    clientId: process.env.DISCORD_CLIENTID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    oauthRedirectUri: process.env.DISCORD_OAUTH_REDIRECT_URI,
    botToken: process.env.DISCORD_BOT_TOKEN
  }
};
var config_default = config;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=index.js.map
