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
var PolarAreaChart_exports = {};
__export(PolarAreaChart_exports, {
  default: () => PolarAreaChart_default
});
module.exports = __toCommonJS(PolarAreaChart_exports);
var import_vue_chartjs = require("vue-chartjs");
const { reactiveProp } = import_vue_chartjs.mixins;
var PolarAreaChart_default = {
  extends: import_vue_chartjs.PolarArea,
  mixins: [reactiveProp],
  props: ["options"],
  mounted() {
    Chart.defaults.global.defaultFontColor = "#fff";
    this.renderChart(this.chartData, this.options);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=PolarAreaChart.js.map
