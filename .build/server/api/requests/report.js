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
var report_exports = {};
__export(report_exports, {
  mapToReportCreateReportRequest: () => mapToReportCreateReportRequest
});
module.exports = __toCommonJS(report_exports);
var import_validation = __toESM(require("../../errors/validation"));
var import_helpers = require("./helpers");
;
const mapToReportCreateReportRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "playerId")) {
    errors.push("Player ID is required.");
  }
  if (!(0, import_helpers.keyHasObjectValue)(body, "reasons")) {
    errors.push("Reasons is required.");
  }
  if (body.reasons) {
    if (!(0, import_helpers.keyHasBooleanValue)(body.reasons, "abuse")) {
      errors.push("Abuse reason is required.");
    }
    if (!(0, import_helpers.keyHasBooleanValue)(body.reasons, "spamming")) {
      errors.push("Spamming reason is required.");
    }
    if (!(0, import_helpers.keyHasBooleanValue)(body.reasons, "multiboxing")) {
      errors.push("Multiboxing reason is required.");
    }
    if (!(0, import_helpers.keyHasBooleanValue)(body.reasons, "inappropriateAlias")) {
      errors.push("Inappropriate reason is required.");
    }
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    playerId: body.playerId,
    reasons: body.reasons
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mapToReportCreateReportRequest
});
//# sourceMappingURL=report.js.map
