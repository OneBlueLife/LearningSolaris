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
var core_exports = {};
__export(core_exports, {
  middleware: () => middleware
});
module.exports = __toCommonJS(core_exports);
var import_validation = __toESM(require("../../errors/validation"));
;
const middleware = () => {
  return {
    handleError(err, req, res, next) {
      if (err instanceof import_validation.default) {
        let errors = err.message;
        if (!Array.isArray(errors)) {
          errors = [errors];
        }
        return res.status(err.statusCode).json({
          errors
        });
      }
      if (err.type && ["body", "query", "headers", "fields", "params"].includes(err.type)) {
        const jerr = err;
        return res.status(400).json({
          errors: jerr.error.details.map((d) => d.message)
        });
      }
      console.error(err.stack);
      return res.status(500).json({
        errors: ["Something broke. If the problem persists, please contact a developer."]
      });
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  middleware
});
//# sourceMappingURL=core.js.map
