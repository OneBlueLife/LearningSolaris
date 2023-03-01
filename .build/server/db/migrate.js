"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var migrate_exports = {};
module.exports = __toCommonJS(migrate_exports);
var import_config = __toESM(require("../config"));
var import__ = __toESM(require("."));
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
let mongo;
async function startup() {
  mongo = await (0, import__.default)(import_config.default, {
    syncIndexes: true,
    poolSize: 1
  });
  console.log("Running migrations...");
  const dirPath = import_path.default.join(__dirname, "migrations");
  let files = import_fs.default.readdirSync(dirPath).filter((a) => !a.endsWith("js.map")).sort((a, b) => a.localeCompare(b));
  for (let file of files) {
    console.log(file);
    const filePath = import_path.default.join(dirPath, file);
    const script = require(filePath);
    try {
      await script.migrate(mongo.connection.db);
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    }
  }
  return Promise.resolve();
}
process.on("SIGINT", async () => {
  await shutdown();
});
async function shutdown() {
  console.log("Shutting down...");
  await mongo.disconnect();
  console.log("Shutdown complete.");
  process.exit();
}
startup().then(async () => {
  console.log("Database migrated.");
  await shutdown();
}).catch(async (err) => {
  await shutdown();
});
//# sourceMappingURL=migrate.js.map
