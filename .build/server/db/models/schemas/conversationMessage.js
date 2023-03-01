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
var conversationMessage_exports = {};
__export(conversationMessage_exports, {
  default: () => conversationMessage_default
});
module.exports = __toCommonJS(conversationMessage_exports);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Types = Schema.Types;
const schema = new Schema({
  fromPlayerId: { type: Types.ObjectId, required: false },
  fromPlayerAlias: { type: Types.String, required: true },
  message: { type: Types.String, required: true },
  sentDate: { type: Types.Date, required: true },
  sentTick: { type: Types.Number, required: false, default: null },
  pinned: { type: Types.Boolean, required: false, default: false },
  readBy: [{ type: Types.ObjectId, required: true }]
});
var conversationMessage_default = schema;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=conversationMessage.js.map
