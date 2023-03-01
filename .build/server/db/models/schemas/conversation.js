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
var conversation_exports = {};
__export(conversation_exports, {
  default: () => conversation_default
});
module.exports = __toCommonJS(conversation_exports);
var import_conversationMessage = __toESM(require("./conversationMessage"));
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Types = Schema.Types;
const schema = new Schema({
  participants: [{ type: Types.ObjectId, required: true }],
  createdBy: { type: Types.ObjectId, required: false, default: null },
  name: { type: Types.String, required: true },
  mutedBy: [{ type: Types.ObjectId, required: true }],
  messages: [import_conversationMessage.default]
});
var conversation_default = schema;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=conversation.js.map
