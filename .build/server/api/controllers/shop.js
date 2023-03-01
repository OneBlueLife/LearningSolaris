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
var shop_exports = {};
__export(shop_exports, {
  default: () => shop_default
});
module.exports = __toCommonJS(shop_exports);
var import_validation = __toESM(require("../../errors/validation"));
const COST_PER_TOKEN = 1;
var shop_default = (container) => {
  return {
    purchase: async (req, res, next) => {
      try {
        let errors = [];
        if (!req.query.amount) {
          errors.push("Amount is a required field");
        }
        if (errors.length) {
          throw new import_validation.default(errors);
        }
        const totalQuantity = parseInt(req.query.amount);
        let unitCost = COST_PER_TOKEN;
        if (totalQuantity === 10) {
          unitCost *= 0.9;
        } else if (totalQuantity === 25) {
          unitCost *= 0.8;
        } else if (totalQuantity === 50) {
          unitCost *= 0.7;
        } else if (totalQuantity === 100) {
          unitCost *= 0.5;
        }
        const totalCost = totalQuantity * unitCost;
        const returnUrl = `${container.config.serverUrl}/api/shop/galacticcredits/purchase/process`;
        const cancelUrl = `${container.config.clientUrl}/#/shop`;
        let approvalUrl = await container.paypalService.authorizePayment(req.session.userId, totalQuantity, totalCost, unitCost, returnUrl, cancelUrl);
        return res.status(200).json({
          approvalUrl
        });
      } catch (err) {
        return next(err);
      }
    },
    process: async (req, res, next) => {
      try {
        const result = await container.paypalService.processPayment(req.query.paymentId, req.query.PayerID);
        return res.redirect(`${container.config.clientUrl}/#/shop/paymentcomplete?credits=${result.galacticTokens}`);
      } catch (err) {
        console.error(err);
        return res.redirect(`${container.config.clientUrl}/#/shop/paymentfailed`);
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=shop.js.map
