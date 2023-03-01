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
var payment_exports = {};
__export(payment_exports, {
  default: () => payment_default
});
module.exports = __toCommonJS(payment_exports);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Types = Schema.Types;
const schema = new Schema({
  userId: { type: Types.ObjectId, required: true },
  paymentId: { type: Types.String, required: true },
  totalCost: { type: Types.Number, required: true },
  totalQuantity: { type: Types.Number, required: true },
  unitCost: { type: Types.Number, required: true }
});
schema.index({ paymentId: 1 }, { unique: false });
var payment_default = schema;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=payment.js.map
