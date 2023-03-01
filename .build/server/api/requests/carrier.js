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
var carrier_exports = {};
__export(carrier_exports, {
  mapToCarrierCalculateCombatRequest: () => mapToCarrierCalculateCombatRequest,
  mapToCarrierLoopWaypointsRequest: () => mapToCarrierLoopWaypointsRequest,
  mapToCarrierRenameCarrierRequest: () => mapToCarrierRenameCarrierRequest,
  mapToCarrierSaveWaypointsRequest: () => mapToCarrierSaveWaypointsRequest,
  mapToCarrierTransferShipsRequest: () => mapToCarrierTransferShipsRequest
});
module.exports = __toCommonJS(carrier_exports);
var import_validation = __toESM(require("../../errors/validation"));
var import_helpers = require("./helpers");
;
const mapToCarrierSaveWaypointsRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasBooleanValue)(body, "looped")) {
    errors.push("Looped is required.");
  }
  if (!(0, import_helpers.keyHasArrayValue)(body, "waypoints")) {
    errors.push("Waypoints is required.");
  }
  if (body.waypoints) {
    for (let waypoint of body.waypoints) {
      if (!(0, import_helpers.keyHasStringValue)(waypoint, "source")) {
        errors.push("Source is required.");
      }
      if (!(0, import_helpers.keyHasStringValue)(waypoint, "destination")) {
        errors.push("Destination is required.");
      }
      if (!(0, import_helpers.keyHasStringValue)(waypoint, "action")) {
        errors.push("Action is required.");
      }
      if (waypoint.actionShips == null)
        waypoint.actionShips = 0;
      if (waypoint.delayTicks == null)
        waypoint.delayTicks = 0;
      if (!(0, import_helpers.keyHasNumberValue)(waypoint, "actionShips")) {
        errors.push("Action Ships is required.");
      }
      if (!(0, import_helpers.keyHasNumberValue)(waypoint, "delayTicks")) {
        errors.push("Delay Ticks is required.");
      }
      waypoint.actionShips = +waypoint.actionShips;
      waypoint.delayTicks = +waypoint.delayTicks;
    }
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    waypoints: body.waypoints,
    looped: body.looped
  };
};
;
const mapToCarrierLoopWaypointsRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasBooleanValue)(body, "loop")) {
    errors.push("Loop is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    loop: body.loop
  };
};
;
const mapToCarrierTransferShipsRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasNumberValue)(body, "carrierShips")) {
    errors.push("Carrier Ships is required.");
  }
  if (!(0, import_helpers.keyHasNumberValue)(body, "starShips")) {
    errors.push("Star Ships is required.");
  }
  if (!(0, import_helpers.keyHasStringValue)(body, "starId")) {
    errors.push("Star ID is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  body.starShips = +body.starShips;
  return {
    carrierShips: body.carrierShips,
    starShips: body.starShips,
    starId: body.starId
  };
};
;
const mapToCarrierRenameCarrierRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasStringValue)(body, "name")) {
    errors.push("Name is required.");
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    name: body.name
  };
};
;
const mapToCarrierCalculateCombatRequest = (body) => {
  let errors = [];
  if (!(0, import_helpers.keyHasBooleanValue)(body, "isTurnBased")) {
    errors.push("Is Turn Based is required.");
  }
  if (!(0, import_helpers.keyHasObjectValue)(body, "defender")) {
    errors.push("Defender is required.");
  }
  if (body.defender) {
    if (!(0, import_helpers.keyHasNumberValue)(body.defender, "ships")) {
      errors.push("Defender Ships is required.");
    }
    if (body.defender.ships != null && +body.defender.ships < 0) {
      errors.push("Defender Ships must be greater than or equal to 0.");
    }
    if (body.defender.ships != null && +body.defender.ships % 1 != 0) {
      errors.push("Defender Ships must be an integer.");
    }
    if (!(0, import_helpers.keyHasNumberValue)(body.defender, "weaponsLevel")) {
      errors.push("Defender Weapons Level is required.");
    }
    if (body.defender.weaponsLevel != null && +body.defender.weaponsLevel <= 0) {
      errors.push("Defender Weapons Level must be greater than 0.");
    }
    if (body.defender.weaponsLevel != null && +body.defender.weaponsLevel % 1 != 0) {
      errors.push("Defender Weapons Level must be an integer.");
    }
    body.defender.ships = +body.defender.ships;
    body.defender.weaponsLevel = +body.defender.weaponsLevel;
  }
  if (!(0, import_helpers.keyHasObjectValue)(body, "attacker")) {
    errors.push("Attacker is required.");
  }
  if (body.attacker) {
    if (!(0, import_helpers.keyHasNumberValue)(body.attacker, "ships")) {
      errors.push("Attacker Ships is required.");
    }
    if (body.attacker.ships != null && +body.attacker.ships < 0) {
      errors.push("Attacker Ships must be greater than or equal to 0.");
    }
    if (body.attacker.ships != null && +body.attacker.ships % 1 != 0) {
      errors.push("Attacker Ships must be an integer.");
    }
    if (!(0, import_helpers.keyHasNumberValue)(body.attacker, "weaponsLevel")) {
      errors.push("Attacker Weapons Level is required.");
    }
    if (body.attacker.weaponsLevel != null && +body.attacker.weaponsLevel <= 0) {
      errors.push("Attacker Weapons Level must be greater than 0.");
    }
    if (body.attacker.weaponsLevel != null && +body.attacker.weaponsLevel % 1 != 0) {
      errors.push("Attacker Weapons Level must be an integer.");
    }
    body.attacker.ships = +body.attacker.ships;
    body.attacker.weaponsLevel = +body.attacker.weaponsLevel;
  }
  if (errors.length) {
    throw new import_validation.default(errors);
  }
  return {
    defender: body.defender,
    attacker: body.attacker,
    isTurnBased: body.isTurnBased
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mapToCarrierCalculateCombatRequest,
  mapToCarrierLoopWaypointsRequest,
  mapToCarrierRenameCarrierRequest,
  mapToCarrierSaveWaypointsRequest,
  mapToCarrierTransferShipsRequest
});
//# sourceMappingURL=carrier.js.map
