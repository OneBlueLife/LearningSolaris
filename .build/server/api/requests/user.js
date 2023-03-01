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
  mapToUserCreateUserRequest: () => mapToUserCreateUserRequest,
  mapToUserRequestPasswordResetRequest: () => mapToUserRequestPasswordResetRequest,
  mapToUserRequestUsernameRequest: () => mapToUserRequestUsernameRequest,
  mapToUserResetPasswordResetRequest: () => mapToUserResetPasswordResetRequest,
  mapToUserUpdateEmailPreferenceRequest: () => mapToUserUpdateEmailPreferenceRequest,
  mapToUserUpdateEmailRequest: () => mapToUserUpdateEmailRequest,
  mapToUserUpdatePasswordRequest: () => mapToUserUpdatePasswordRequest,
  mapToUserUpdateUsernameRequest: () => mapToUserUpdateUsernameRequest
});
module.exports = __toCommonJS(user_exports);
var import_validation = __toESM(require("../../errors/validation"));
var import_helpers = require("./helpers");
;
const mapToUserCreateUserRequest = (body, recaptchaEnabled) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "email")) {
    errors.push("Email is required.");
  }
  if (!(0, import_helpers.keyHasStringValue)(body, "username")) {
    errors.push("Username is required.");
  }
  if (!(0, import_helpers.keyHasStringValue)(body, "password")) {
    errors.push("Password is required.");
  }
  if (recaptchaEnabled && !(0, import_helpers.keyHasStringValue)(body, "recaptchaToken")) {
    errors.push("Recaptcha Token is required");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    email: body.email,
    username: body.username,
    password: body.password,
    recaptchaToken: body.recaptchaToken
  };
};
;
const mapToUserUpdateEmailPreferenceRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasBooleanValue)(body, "enabled")) {
    errors.push("Enabled is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    enabled: body.enabled
  };
};
;
const mapToUserUpdateUsernameRequest = (body) => {
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
;
const mapToUserUpdateEmailRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "email")) {
    errors.push("Email is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    email: body.email
  };
};
;
const mapToUserUpdatePasswordRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "currentPassword")) {
    errors.push("Current Password is required.");
  }
  if (!(0, import_helpers.keyHasStringValue)(body, "newPassword")) {
    errors.push("New Password is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    currentPassword: body.currentPassword,
    newPassword: body.newPassword
  };
};
;
const mapToUserRequestPasswordResetRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "email")) {
    errors.push("Email is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    email: body.email
  };
};
;
const mapToUserResetPasswordResetRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "token")) {
    errors.push("Token is required.");
  }
  if (!(0, import_helpers.keyHasStringValue)(body, "newPassword")) {
    errors.push("New Password is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    token: body.token,
    newPassword: body.newPassword
  };
};
;
const mapToUserRequestUsernameRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "email")) {
    errors.push("Email is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    email: body.email
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mapToUserCreateUserRequest,
  mapToUserRequestPasswordResetRequest,
  mapToUserRequestUsernameRequest,
  mapToUserResetPasswordResetRequest,
  mapToUserUpdateEmailPreferenceRequest,
  mapToUserUpdateEmailRequest,
  mapToUserUpdatePasswordRequest,
  mapToUserUpdateUsernameRequest
});
//# sourceMappingURL=user.js.map
