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
var routes_exports = {};
__export(routes_exports, {
  default: () => routes_default
});
module.exports = __toCommonJS(routes_exports);
var import_express_joi_validation = require("express-joi-validation");
var import_middleware = __toESM(require("../middleware"));
var import_admin = __toESM(require("./admin"));
var import_auth = __toESM(require("./auth"));
var import_badges = __toESM(require("./badges"));
var import_carrier = __toESM(require("./carrier"));
var import_conversations = __toESM(require("./conversations"));
var import_diplomacy = __toESM(require("./diplomacy"));
var import_events = __toESM(require("./events"));
var import_games = __toESM(require("./games"));
var import_guilds = __toESM(require("./guilds"));
var import_ledger = __toESM(require("./ledger"));
var import_report = __toESM(require("./report"));
var import_research = __toESM(require("./research"));
var import_shop = __toESM(require("./shop"));
var import_specialist = __toESM(require("./specialist"));
var import_star = __toESM(require("./star"));
var import_trade = __toESM(require("./trade"));
var import_user = __toESM(require("./user"));
var import_spectator = __toESM(require("./spectator"));
var routes_default = (router, container) => {
  const middleware = (0, import_middleware.default)(container);
  const validator = (0, import_express_joi_validation.createValidator)({ passError: true });
  (0, import_admin.default)(router, middleware, validator, container);
  (0, import_auth.default)(router, middleware, validator, container);
  (0, import_badges.default)(router, middleware, validator, container);
  (0, import_carrier.default)(router, middleware, validator, container);
  (0, import_conversations.default)(router, middleware, validator, container);
  (0, import_diplomacy.default)(router, middleware, validator, container);
  (0, import_events.default)(router, middleware, validator, container);
  (0, import_games.default)(router, middleware, validator, container);
  (0, import_guilds.default)(router, middleware, validator, container);
  (0, import_ledger.default)(router, middleware, validator, container);
  (0, import_report.default)(router, middleware, validator, container);
  (0, import_research.default)(router, middleware, validator, container);
  (0, import_shop.default)(router, middleware, validator, container);
  (0, import_specialist.default)(router, middleware, validator, container);
  (0, import_star.default)(router, middleware, validator, container);
  (0, import_trade.default)(router, middleware, validator, container);
  (0, import_user.default)(router, middleware, validator, container);
  (0, import_spectator.default)(router, middleware, validator, container);
  return router;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=index.js.map
