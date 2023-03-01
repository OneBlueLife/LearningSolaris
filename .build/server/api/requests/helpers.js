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
var helpers_exports = {};
__export(helpers_exports, {
  keyExists: () => keyExists,
  keyHasArrayValue: () => keyHasArrayValue,
  keyHasBooleanValue: () => keyHasBooleanValue,
  keyHasNumberValue: () => keyHasNumberValue,
  keyHasObjectValue: () => keyHasObjectValue,
  keyHasStringValue: () => keyHasStringValue
});
module.exports = __toCommonJS(helpers_exports);
const keyExists = (obj, key) => {
  return obj[key] != null;
};
const keyHasStringValue = (obj, key, minLength = 1, maxLength = null) => {
  const value = obj[key];
  return value != null && (typeof value === "string" || value instanceof String) && value.length >= minLength && (maxLength == null || value.length <= maxLength);
};
const keyHasNumberValue = (obj, key) => {
  const value = obj[key].toString();
  return value != null && !isNaN(value) && !isNaN(parseFloat(value));
};
const keyHasBooleanValue = (obj, key) => {
  const value = obj[key];
  return value != null && typeof value === "boolean";
};
const keyHasObjectValue = (obj, key) => {
  const value = obj[key];
  return value != null && typeof value === "object" && !Array.isArray(value);
};
const keyHasArrayValue = (obj, key) => {
  const value = obj[key];
  return value != null && Array.isArray(value);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  keyExists,
  keyHasArrayValue,
  keyHasBooleanValue,
  keyHasNumberValue,
  keyHasObjectValue,
  keyHasStringValue
});
//# sourceMappingURL=helpers.js.map
