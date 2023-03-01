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
var waypoint_exports = {};
__export(waypoint_exports, {
  default: () => waypoint_default
});
module.exports = __toCommonJS(waypoint_exports);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Types = Schema.Types;
const schema = new Schema({
  source: { type: Types.ObjectId, required: true },
  destination: { type: Types.ObjectId, required: true },
  action: { type: Types.String, required: true, enum: ["nothing", "collectAll", "dropAll", "collect", "drop", "collectAllBut", "dropAllBut", "dropPercentage", "collectPercentage", "garrison"], default: "nothing" },
  actionShips: { type: Types.Number, required: true, default: 0 },
  delayTicks: { type: Types.Number, required: true, default: 0 }
});
var waypoint_default = schema;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=waypoint.js.map
