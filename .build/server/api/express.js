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
var express_exports = {};
__export(express_exports, {
  default: () => express_default
});
module.exports = __toCommonJS(express_exports);
var import_routes = __toESM(require("./routes"));
const express = require("express");
const router = express.Router();
const session = require("express-session");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const MongoDBStore = require("connect-mongodb-session")(session);
var express_default = async (config, app, container) => {
  app.use(require("body-parser").json({
    limit: "1000kb"
  }));
  let store = new MongoDBStore({
    uri: config.connectionString,
    collection: "sessions"
  });
  store.on("error", function(err) {
    console.error(err);
  });
  app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.sessionSecureCookies,
      maxAge: 1e3 * 60 * 60 * 24 * 365
    },
    store
  }));
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", config.clientUrl);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, PUT, PATCH, GET, DELETE, OPTIONS");
    next();
  });
  app.set("trust proxy", 1);
  const limiter = rateLimit({
    windowMs: 1e3,
    max: 10
  });
  app.use(limiter);
  app.use(compression({
    threshold: 0,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    }
  }));
  (0, import_routes.default)(router, container);
  app.use(router);
  console.log("Express intialized.");
  return app;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=express.js.map
