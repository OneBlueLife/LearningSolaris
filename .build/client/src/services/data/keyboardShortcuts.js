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
var keyboardShortcuts_exports = {};
__export(keyboardShortcuts_exports, {
  default: () => keyboardShortcuts_default
});
module.exports = __toCommonJS(keyboardShortcuts_exports);
var import_menuStates = __toESM(require("./menuStates"));
var keyboardShortcuts_default = {
  all: {
    "Escape": null,
    "q": import_menuStates.default.LEADERBOARD,
    "+": "ZOOM_IN",
    "-": "ZOOM_OUT",
    "z": "FIT_GALAXY"
  },
  user: {
    "c": import_menuStates.default.COMBAT_CALCULATOR,
    "v": import_menuStates.default.RULER,
    "i": import_menuStates.default.INTEL,
    "o": import_menuStates.default.OPTIONS,
    "a": `${import_menuStates.default.GALAXY}|empires`,
    "g": `${import_menuStates.default.GALAXY}|stars`,
    "f": `${import_menuStates.default.GALAXY}|carriers`,
    "s": `${import_menuStates.default.GALAXY}|ships`,
    "t": `${import_menuStates.default.GALAXY}|technology`
  },
  player: {
    "h": "HOME_STAR",
    " ": "HOME_STAR",
    "r": import_menuStates.default.RESEARCH,
    "m": import_menuStates.default.INBOX,
    "e": import_menuStates.default.EVENT_LOG,
    "n": import_menuStates.default.GAME_NOTES,
    "l": import_menuStates.default.LEDGER,
    "d": import_menuStates.default.DIPLOMACY,
    "b": import_menuStates.default.BULK_INFRASTRUCTURE_UPGRADE
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=keyboardShortcuts.js.map
