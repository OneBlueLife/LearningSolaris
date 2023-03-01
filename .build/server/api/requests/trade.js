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
var trade_exports = {};
__export(trade_exports, {
  mapToTradeSendTechnologyToPlayerRequest: () => mapToTradeSendTechnologyToPlayerRequest,
  mapToTradeSendToPlayerRequest: () => mapToTradeSendToPlayerRequest
});
module.exports = __toCommonJS(trade_exports);
var import_validation = __toESM(require("../../errors/validation"));
var import_helpers = require("./helpers");
;
const mapToTradeSendToPlayerRequest = (body, userId) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "toPlayerId")) {
    errors.push("To Player ID is required.");
  }
  if (body.toPlayerId && userId === body.toPlayerId) {
    errors.push("Cannot trade with yourself.");
  }
  if (!(0, import_helpers.keyHasNumberValue)(body, "amount")) {
    errors.push("amount is required.");
  }
  if (body.amount != null && +body.amount <= 0) {
    errors.push("amount must be greater than 0.");
  }
  if (body.amount != null && +body.amount % 1 != 0) {
    errors.push("amount must be an integer.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  body.amount = +body.amount;
  return {
    toPlayerId: body.toPlayerId,
    amount: body.amount
  };
};
;
const mapToTradeSendTechnologyToPlayerRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "toPlayerId")) {
    errors.push("To Player Id is required.");
  }
  if (!(0, import_helpers.keyHasStringValue)(body, "technology")) {
    errors.push("Technology is required.");
  }
  if (!(0, import_helpers.keyHasNumberValue)(body, "level")) {
    errors.push("Level is required.");
  }
  if (body.level != null && body.level <= 0) {
    errors.push("Level must be greater than 0.");
  }
  if (body.level != null && +body.level % 1 != 0) {
    errors.push("level must be an integer.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  body.level = +body.level;
  return {
    toPlayerId: body.toPlayerId,
    technology: body.technology,
    level: body.level
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mapToTradeSendTechnologyToPlayerRequest,
  mapToTradeSendToPlayerRequest
});
//# sourceMappingURL=trade.js.map
