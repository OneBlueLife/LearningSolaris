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
var ledger_exports = {};
__export(ledger_exports, {
  default: () => ledger_default
});
module.exports = __toCommonJS(ledger_exports);
var import_ledger = require("../../services/ledger");
var ledger_default = (container) => {
  return {
    detailCredits: async (req, res, next) => {
      try {
        let ledger = await container.ledgerService.getLedger(req.player, import_ledger.LedgerType.Credits);
        return res.status(200).json(ledger);
      } catch (err) {
        return next(err);
      }
    },
    forgiveCredits: async (req, res, next) => {
      try {
        let newLedger = await container.ledgerService.forgiveDebt(
          req.game,
          req.player,
          req.params.playerId,
          import_ledger.LedgerType.Credits
        );
        return res.status(200).json(newLedger);
      } catch (err) {
        return next(err);
      }
    },
    settleCredits: async (req, res, next) => {
      try {
        let newLedger = await container.ledgerService.settleDebt(
          req.game,
          req.player,
          req.params.playerId,
          import_ledger.LedgerType.Credits
        );
        return res.status(200).json(newLedger);
      } catch (err) {
        return next(err);
      }
    },
    detailCreditsSpecialists: async (req, res, next) => {
      try {
        let ledger = await container.ledgerService.getLedger(req.player, import_ledger.LedgerType.CreditsSpecialists);
        return res.status(200).json(ledger);
      } catch (err) {
        return next(err);
      }
    },
    forgiveCreditsSpecialists: async (req, res, next) => {
      try {
        let newLedger = await container.ledgerService.forgiveDebt(
          req.game,
          req.player,
          req.params.playerId,
          import_ledger.LedgerType.CreditsSpecialists
        );
        return res.status(200).json(newLedger);
      } catch (err) {
        return next(err);
      }
    },
    settleCreditsSpecialists: async (req, res, next) => {
      try {
        let newLedger = await container.ledgerService.settleDebt(
          req.game,
          req.player,
          req.params.playerId,
          import_ledger.LedgerType.CreditsSpecialists
        );
        return res.status(200).json(newLedger);
      } catch (err) {
        return next(err);
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=ledger.js.map
