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
  mapToConversationCreateConversationRequest: () => mapToConversationCreateConversationRequest,
  mapToConversationSendMessageRequest: () => mapToConversationSendMessageRequest
});
module.exports = __toCommonJS(conversation_exports);
var import_validation = __toESM(require("../../errors/validation"));
var import_helpers = require("./helpers");
;
const mapToConversationCreateConversationRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "name")) {
    errors.push("Name is required.");
  }
  if (!(0, import_helpers.keyHasArrayValue)(body, "participants")) {
    errors.push("Participants is required.");
  }
  if (body.participants && !body.participants.length) {
    errors.push("At least 1 participant is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    name: body.name,
    participants: body.participants
  };
};
;
const mapToConversationSendMessageRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "message")) {
    errors.push("Message is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    message: body.message
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mapToConversationCreateConversationRequest,
  mapToConversationSendMessageRequest
});
//# sourceMappingURL=conversation.js.map
