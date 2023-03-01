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
  mapToGuildCreateGuildRequest: () => mapToGuildCreateGuildRequest,
  mapToGuildInviteUserRequest: () => mapToGuildInviteUserRequest,
  mapToGuildRenameGuildRequest: () => mapToGuildRenameGuildRequest
});
module.exports = __toCommonJS(guild_exports);
var import_validation = __toESM(require("../../errors/validation"));
var import_helpers = require("./helpers");
;
const mapToGuildCreateGuildRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "name")) {
    errors.push("Name is required.");
  }
  if (!(0, import_helpers.keyHasStringValue)(body, "tag")) {
    errors.push("Tag is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    name: body.name,
    tag: body.tag
  };
};
;
const mapToGuildRenameGuildRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "name")) {
    errors.push("Name is required.");
  }
  if (!(0, import_helpers.keyHasStringValue)(body, "tag")) {
    errors.push("Tag is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    name: body.name,
    tag: body.tag
  };
};
;
const mapToGuildInviteUserRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "username")) {
    errors.push("Username is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    username: body.username
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mapToGuildCreateGuildRequest,
  mapToGuildInviteUserRequest,
  mapToGuildRenameGuildRequest
});
//# sourceMappingURL=guild.js.map
