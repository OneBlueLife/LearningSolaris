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
var game_exports = {};
__export(game_exports, {
  mapToGameConcedeDefeatRequest: () => mapToGameConcedeDefeatRequest,
  mapToGameJoinGameRequest: () => mapToGameJoinGameRequest,
  mapToGameSaveNotesRequest: () => mapToGameSaveNotesRequest
});
module.exports = __toCommonJS(game_exports);
var import_validation = __toESM(require("../../errors/validation"));
var import_helpers = require("./helpers");
;
;
const mapToGameJoinGameRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "playerId")) {
    errors.push("Player ID is required.");
  }
  if (!(0, import_helpers.keyHasStringValue)(body, "alias")) {
    errors.push("Alias is required.");
  }
  if (!(0, import_helpers.keyHasNumberValue)(body, "avatar")) {
    errors.push("Avatar is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  body.avatar = +body.avatar;
  return {
    playerId: body.playerId,
    alias: body.alias,
    avatar: body.avatar,
    password: body.password
  };
};
;
const mapToGameSaveNotesRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "notes", 0, 2e3)) {
    errors.push("Notes is required and must not be greater than 2000 characters.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    notes: body.notes
  };
};
const mapToGameConcedeDefeatRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasBooleanValue)(body, "openSlot")) {
    errors.push("Open Slot is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    openSlot: body.openSlot
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mapToGameConcedeDefeatRequest,
  mapToGameJoinGameRequest,
  mapToGameSaveNotesRequest
});
//# sourceMappingURL=game.js.map
