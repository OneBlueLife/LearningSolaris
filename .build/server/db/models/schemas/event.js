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
var event_exports = {};
__export(event_exports, {
  default: () => event_default
});
module.exports = __toCommonJS(event_exports);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Types = Schema.Types;
const schema = new Schema({
  gameId: { type: Types.ObjectId, required: true },
  playerId: { type: Types.ObjectId, required: false, default: null },
  tick: { type: Types.Number, required: true },
  type: { type: Types.String, required: true },
  data: { type: Types.Mixed, required: true },
  read: { type: Types.Boolean, required: false, default: false }
});
schema.index({ gameId: 1, tick: 1 }, { unique: false });
schema.index({ gameId: 1, playerId: 1 }, { unique: false });
var event_default = schema;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=event.js.map
