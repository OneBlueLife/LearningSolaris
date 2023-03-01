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
var report_exports = {};
__export(report_exports, {
  default: () => ReportService
});
module.exports = __toCommonJS(report_exports);
var import_validation = __toESM(require("../errors/validation"));
class ReportService {
  constructor(reportModel, reportRepo, playerService) {
    this.reportRepo = reportRepo;
    this.reportModel = reportModel;
    this.playerService = playerService;
  }
  async reportPlayer(game, playerId, reportedByUserId, reasons) {
    let reportedPlayer = this.playerService.getById(game, playerId);
    let reportedByPlayer = this.playerService.getByUserId(game, reportedByUserId);
    if (!reportedPlayer.userId) {
      throw new import_validation.default(`The reported player is not a valid user.`);
    }
    let report = new this.reportModel({
      gameId: game._id,
      reportedPlayerId: reportedPlayer._id,
      reportedUserId: reportedPlayer.userId,
      reportedPlayerAlias: reportedPlayer.alias,
      reportedByPlayerId: reportedByPlayer._id,
      reportedByUserId: reportedByPlayer.userId,
      reportedByPlayerAlias: reportedByPlayer.alias,
      reasons: {
        abuse: reasons.abuse || false,
        spamming: reasons.spamming || false,
        multiboxing: reasons.multiboxing || false,
        inappropriateAlias: reasons.inappropriateAlias || false
      },
      actioned: false
    });
    await report.save();
  }
  async listReports() {
    return await this.reportRepo.find({}, {}, {
      actioned: 1,
      _id: -1
    });
  }
  async actionReport(reportId) {
    return await this.reportRepo.updateOne({
      _id: reportId
    }, {
      actioned: true
    });
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=report.js.map
