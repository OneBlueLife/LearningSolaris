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
var menuStates_exports = {};
__export(menuStates_exports, {
  default: () => menuStates_default
});
module.exports = __toCommonJS(menuStates_exports);
var menuStates_default = {
  NONE: null,
  WELCOME: "welcome",
  TUTORIAL: "tutorial",
  LEADERBOARD: "leaderboard",
  RESEARCH: "research",
  GALAXY: "galaxy",
  INTEL: "intel",
  OPTIONS: "options",
  SETTINGS: "settings",
  HELP: "help",
  INBOX: "inbox",
  EVENT_LOG: "eventLog",
  CONVERSATION: "conversation",
  COMBAT_CALCULATOR: "combatCalculator",
  NEW_MESSAGE: "newMessage",
  MESSAGE: "message",
  PLAYER: "player",
  TRADE: "trade",
  SEND_TECHNOLOGY: "sendTechnology",
  SEND_MONEY: "sendMoney",
  STAR: "star",
  STAR_DETAIL: "starDetail",
  STAR_RENAME: "starRename",
  BUILD_CARRIER: "buildCarrier",
  CARRIER: "carrier",
  CARRIER_DETAIL: "carrierDetail",
  CARRIER_WAYPOINTS: "carrierWaypoints",
  CARRIER_WAYPOINT_DETAIL: "carrierWaypointDetail",
  CARRIER_RENAME: "carrierRename",
  SHIP_TRANSFER: "shipTransfer",
  BULK_INFRASTRUCTURE_UPGRADE: "bulkInfrastructureUpgrade",
  MAP_OBJECT_SELECTOR: "mapObjectSelector",
  RULER: "ruler",
  LEDGER: "ledger",
  DIPLOMACY: "diplomacy",
  HIRE_SPECIALIST_CARRIER: "hireSpecialistCarrier",
  HIRE_SPECIALIST_STAR: "hireSpecialistStar",
  GAME_NOTES: "gameNotes",
  CREATE_CONVERSATION: "createConversation",
  CONVERSATION: "conversation",
  PLAYER_BADGE_SHOP: "playerBadgeShop",
  REPORT_PLAYER: "reportPlayer",
  SPECTATORS: "spectators"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=menuStates.js.map
