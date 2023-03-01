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
var guild_exports = {};
__export(guild_exports, {
  default: () => guild_default
});
module.exports = __toCommonJS(guild_exports);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Types = Schema.Types;
const schema = new Schema({
  name: { type: Types.String, required: true, minlength: 4, maxlength: 31 },
  tag: { type: Types.String, required: true, minlength: 2, maxlength: 4 },
  leader: { type: Types.ObjectId, required: true },
  officers: [{ type: Types.ObjectId }],
  members: [{ type: Types.ObjectId }],
  invitees: [{ type: Types.ObjectId }],
  applicants: [{ type: Types.ObjectId }]
});
var guild_default = schema;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=guild.js.map
