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
  default: () => carrier_default
});
module.exports = __toCommonJS(carrier_exports);
var import_waypoint = __toESM(require("./waypoint"));
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Types = Schema.Types;
const schema = new Schema({
  ownedByPlayerId: { type: Types.ObjectId, required: true },
  orbiting: { type: Types.ObjectId, required: false, default: null },
  waypointsLooped: { type: Types.Boolean, required: true, default: false },
  name: { type: Types.String, required: true },
  ships: { type: Types.Number, required: true },
  specialistId: { type: Types.Number, required: false, default: null },
  specialistExpireTick: { type: Types.Number, required: false, default: null },
  isGift: { type: Types.Boolean, required: false, default: false },
  location: {
    x: { type: Types.Number, required: true },
    y: { type: Types.Number, required: true }
  },
  waypoints: [import_waypoint.default]
});
var carrier_default = schema;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=carrier.js.map
