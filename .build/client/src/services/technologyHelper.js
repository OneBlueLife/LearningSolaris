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
var technologyHelper_exports = {};
__export(technologyHelper_exports, {
  default: () => technologyHelper_default
});
module.exports = __toCommonJS(technologyHelper_exports);
class TechnologyHelper {
  FRIENDLY_NAMES = {
    scanning: "Scanning",
    hyperspace: "Hyperspace Range",
    terraforming: "Terraforming",
    experimentation: "Experimentation",
    weapons: "Weapons",
    banking: "Banking",
    manufacturing: "Manufacturing",
    specialists: "Specialists"
  };
  getFriendlyName(technologyKey) {
    return this.FRIENDLY_NAMES[technologyKey];
  }
  isTechnologyEnabled(game, technologyKey) {
    return game.settings.technology.startingTechnologyLevel[technologyKey] > 0;
  }
  isTechnologyResearchable(game, technologyKey) {
    return game.settings.technology.researchCosts[technologyKey] !== "none";
  }
  getRequiredResearchProgress(game, technologyKey, technologyLevel) {
    const researchCostConfig = game.settings.technology.researchCosts[technologyKey];
    const expenseCostConfig = game.constants.star.infrastructureExpenseMultipliers[researchCostConfig];
    const progressMultiplierConfig = expenseCostConfig * game.constants.research.progressMultiplier;
    return technologyLevel * progressMultiplierConfig;
  }
  getIcon(technologyKey) {
    switch (technologyKey) {
      case "scanning":
        return "binoculars";
      case "hyperspace":
        return "gas-pump";
      case "terraforming":
        return "globe-europe";
      case "experimentation":
        return "microscope";
      case "weapons":
        return "gun";
      case "banking":
        return "money-bill-alt";
      case "manufacturing":
        return "industry";
      case "specialists":
        return "user-astronaut";
    }
    return "question";
  }
}
var technologyHelper_default = new TechnologyHelper();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=technologyHelper.js.map
