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
var star_exports = {};
__export(star_exports, {
  mapToStarAbandonStarRequest: () => mapToStarAbandonStarRequest,
  mapToStarBuildCarrierRequest: () => mapToStarBuildCarrierRequest,
  mapToStarDestroyInfrastructureRequest: () => mapToStarDestroyInfrastructureRequest,
  mapToStarSetBulkIgnoreAllStatusRequest: () => mapToStarSetBulkIgnoreAllStatusRequest,
  mapToStarToggleBulkIgnoreStatusRequest: () => mapToStarToggleBulkIgnoreStatusRequest,
  mapToStarUpgradeInfrastructureBulkRequest: () => mapToStarUpgradeInfrastructureBulkRequest,
  mapToStarUpgradeInfrastructureRequest: () => mapToStarUpgradeInfrastructureRequest
});
module.exports = __toCommonJS(star_exports);
var import_validation = __toESM(require("../../errors/validation"));
var import_helpers = require("./helpers");
;
const mapToStarUpgradeInfrastructureRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "starId")) {
    errors.push("Star ID is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    starId: body.starId
  };
};
;
const mapToStarUpgradeInfrastructureBulkRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "upgradeStrategy")) {
    errors.push("Upgrade Strategy is required.");
  }
  if (!(0, import_helpers.keyHasStringValue)(body, "infrastructure")) {
    errors.push("Infrastructure is required.");
  }
  if (!(0, import_helpers.keyHasNumberValue)(body, "amount")) {
    errors.push("Amount is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  body.amount = +body.amount;
  return {
    upgradeStrategy: body.upgradeStrategy,
    infrastructure: body.infrastructure,
    amount: body.amount
  };
};
;
const mapToStarDestroyInfrastructureRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "starId")) {
    errors.push("Star ID is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    starId: body.starId
  };
};
;
const mapToStarBuildCarrierRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "starId")) {
    errors.push("Star ID is required.");
  }
  if (!(0, import_helpers.keyHasNumberValue)(body, "ships")) {
    errors.push("Ships is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  let ships = 1;
  if (body.ships) {
    ships = +body.ships;
  }
  return {
    starId: body.starId,
    ships
  };
};
;
const mapToStarAbandonStarRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "starId")) {
    errors.push("Star ID is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    starId: body.starId
  };
};
;
const mapToStarToggleBulkIgnoreStatusRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "starId")) {
    errors.push("Star ID is required.");
  }
  if (!(0, import_helpers.keyHasStringValue)(body, "infrastructureType")) {
    errors.push("Infrastructure Type is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    starId: body.starId,
    infrastructureType: body.infrastructureType
  };
};
;
const mapToStarSetBulkIgnoreAllStatusRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "starId")) {
    errors.push("Star ID is required.");
  }
  if (!(0, import_helpers.keyHasBooleanValue)(body, "ignoreStatus")) {
    errors.push("Ignore Status is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    starId: body.starId,
    ignoreStatus: body.ignoreStatus
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mapToStarAbandonStarRequest,
  mapToStarBuildCarrierRequest,
  mapToStarDestroyInfrastructureRequest,
  mapToStarSetBulkIgnoreAllStatusRequest,
  mapToStarToggleBulkIgnoreStatusRequest,
  mapToStarUpgradeInfrastructureBulkRequest,
  mapToStarUpgradeInfrastructureRequest
});
//# sourceMappingURL=star.js.map
