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
var player_exports = {};
__export(player_exports, {
  default: () => player_default
});
module.exports = __toCommonJS(player_exports);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Types = Schema.Types;
const schema = new Schema({
  userId: { type: Types.ObjectId, required: false, default: null },
  homeStarId: { type: Types.ObjectId, required: true },
  alias: { type: Types.String, required: true },
  avatar: { type: Types.String, required: false, default: null },
  notes: { type: Types.String, required: false, default: null },
  colour: {
    alias: { type: Types.String, required: true },
    value: { type: Types.String, required: true }
  },
  shape: { type: Types.String, required: true, enum: ["circle", "square", "diamond", "hexagon"], default: "circle" },
  lastSeen: { type: Types.Date, required: false, default: null },
  lastSeenIP: { type: Types.String, required: false, default: null },
  researchingNow: { type: Types.String, required: true, default: "weapons" },
  researchingNext: { type: Types.String, required: true, default: "weapons" },
  credits: { type: Types.Number, required: true },
  creditsSpecialists: { type: Types.Number, required: true },
  isOpenSlot: { type: Types.Boolean, required: true, default: true },
  defeated: { type: Types.Boolean, required: false, default: false },
  defeatedDate: { type: Types.Date, required: false, default: null },
  afk: { type: Types.Boolean, required: false, default: false },
  aiState: { type: Types.Mixed, required: false, default: null },
  renownToGive: { type: Types.Number, required: true, default: 8 },
  ready: { type: Types.Boolean, required: false, default: false },
  readyToCycle: { type: Types.Boolean, required: false, default: false },
  readyToQuit: { type: Types.Boolean, required: false, default: false },
  missedTurns: { type: Types.Number, required: false, default: 0 },
  hasSentTurnReminder: { type: Types.Boolean, required: false, default: false },
  hasFilledAfkSlot: { type: Types.Boolean, required: false, default: false },
  spectators: [{ type: Types.ObjectId, required: false, default: [] }],
  research: {
    scanning: {
      level: { type: Types.Number, required: true, default: 1 },
      progress: { type: Types.Number, required: true, default: 0 }
    },
    hyperspace: {
      level: { type: Types.Number, required: true, default: 1 },
      progress: { type: Types.Number, required: true, default: 0 }
    },
    terraforming: {
      level: { type: Types.Number, required: true, default: 1 },
      progress: { type: Types.Number, required: true, default: 0 }
    },
    experimentation: {
      level: { type: Types.Number, required: true, default: 1 },
      progress: { type: Types.Number, required: true, default: 0 }
    },
    weapons: {
      level: { type: Types.Number, required: true, default: 1 },
      progress: { type: Types.Number, required: true, default: 0 }
    },
    banking: {
      level: { type: Types.Number, required: true, default: 1 },
      progress: { type: Types.Number, required: true, default: 0 }
    },
    manufacturing: {
      level: { type: Types.Number, required: true, default: 1 },
      progress: { type: Types.Number, required: true, default: 0 }
    },
    specialists: {
      level: { type: Types.Number, required: true, default: 1 },
      progress: { type: Types.Number, required: true, default: 0 }
    }
  },
  ledger: {
    credits: [
      {
        playerId: { type: Types.ObjectId, required: true },
        debt: { type: Types.Number, required: true, default: 0 }
      }
    ],
    creditsSpecialists: [
      {
        playerId: { type: Types.ObjectId, required: true },
        debt: { type: Types.Number, required: true, default: 0 }
      }
    ]
  },
  reputations: [
    {
      playerId: { type: Types.ObjectId, required: true },
      score: { type: Types.Number, required: true, default: 0 }
    }
  ],
  diplomacy: [
    {
      playerId: { type: Types.ObjectId, required: true },
      status: { type: Types.String, required: true }
    }
  ]
});
var player_default = schema;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=player.js.map
