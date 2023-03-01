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
var research_exports = {};
__export(research_exports, {
  default: () => research_default
});
module.exports = __toCommonJS(research_exports);
var import_research = require("../requests/research");
var research_default = (container) => {
  return {
    updateNow: async (req, res, next) => {
      try {
        const reqObj = (0, import_research.mapToResearchUpdateNowRequest)(req.body);
        let eta = await container.researchService.updateResearchNow(req.game, req.player, reqObj.preference);
        return res.status(200).json(eta);
      } catch (err) {
        return next(err);
      }
    },
    updateNext: async (req, res, next) => {
      try {
        const reqObj = (0, import_research.mapToResearchUpdateNextRequest)(req.body);
        let eta = await container.researchService.updateResearchNext(req.game, req.player, reqObj.preference);
        return res.status(200).json(eta);
      } catch (err) {
        return next(err);
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=research.js.map
