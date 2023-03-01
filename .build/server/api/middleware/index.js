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
var middleware_exports = {};
__export(middleware_exports, {
  default: () => middleware_default
});
module.exports = __toCommonJS(middleware_exports);
var import_core = require("./core");
var import_auth = require("./auth");
var import_game = require("./game");
var import_player = require("./player");
;
var middleware_default = (container) => {
  return {
    core: (0, import_core.middleware)(),
    auth: (0, import_auth.middleware)(container),
    game: (0, import_game.middleware)(container),
    player: (0, import_player.middleware)(container)
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=index.js.map
