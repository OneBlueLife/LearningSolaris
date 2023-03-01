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
var star_exports = {};
__export(star_exports, {
  default: () => star_default
});
module.exports = __toCommonJS(star_exports);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Types = Schema.Types;
const schema = new Schema({
  ownedByPlayerId: { type: Types.ObjectId, required: false, default: null },
  name: { type: Types.String, required: true },
  naturalResources: {
    economy: { type: Types.Number, required: true },
    industry: { type: Types.Number, required: true },
    science: { type: Types.Number, required: true }
  },
  ships: { type: Types.Number, required: true, default: 0 },
  shipsActual: { type: Types.Number, required: true, default: 0 },
  specialistId: { type: Types.Number, required: false, default: null },
  specialistExpireTick: { type: Types.Number, required: false, default: null },
  homeStar: { type: Types.Boolean, required: false, default: false },
  warpGate: { type: Types.Boolean, required: true, default: false },
  isNebula: { type: Types.Boolean, required: true, default: false },
  isAsteroidField: { type: Types.Boolean, required: true, default: false },
  isBinaryStar: { type: Types.Boolean, required: true, default: false },
  isBlackHole: { type: Types.Boolean, required: true, default: false },
  isPulsar: { type: Types.Boolean, required: true, default: false },
  wormHoleToStarId: { type: Types.ObjectId, required: false, default: null },
  ignoreBulkUpgrade: {
    economy: { type: Types.Boolean, required: false, default: false },
    industry: { type: Types.Boolean, required: false, default: false },
    science: { type: Types.Boolean, required: false, default: false }
  },
  infrastructure: {
    economy: { type: Types.Number, required: true, default: 0 },
    industry: { type: Types.Number, required: true, default: 0 },
    science: { type: Types.Number, required: true, default: 0 }
  },
  location: {
    x: { type: Types.Number, required: true, default: 0 },
    y: { type: Types.Number, required: true, default: 0 }
  }
});
var star_default = schema;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=star.js.map
