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
var report_exports = {};
__export(report_exports, {
  default: () => report_default
});
module.exports = __toCommonJS(report_exports);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Types = Schema.Types;
const schema = new Schema({
  gameId: { type: Types.ObjectId, required: true },
  reportedPlayerId: { type: Types.ObjectId, required: true },
  reportedUserId: { type: Types.ObjectId, required: true },
  reportedPlayerAlias: { type: Types.String, required: true },
  reportedByPlayerId: { type: Types.ObjectId, required: true },
  reportedByUserId: { type: Types.ObjectId, required: true },
  reportedByPlayerAlias: { type: Types.String, required: true },
  reasons: {
    abuse: { type: Types.Boolean, required: true },
    spamming: { type: Types.Boolean, required: true },
    multiboxing: { type: Types.Boolean, required: true },
    inappropriateAlias: { type: Types.Boolean, required: true }
  },
  actioned: { type: Types.Boolean, required: false, default: false }
});
var report_default = schema;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=report.js.map
