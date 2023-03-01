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
var repository_exports = {};
__export(repository_exports, {
  default: () => Repository
});
module.exports = __toCommonJS(repository_exports);
class Repository {
  constructor(model) {
    this.model = model;
  }
  async findById(id, select) {
    return await this.model.findById(id, select).lean({ defaults: true }).exec();
  }
  async findByIdAsModel(id, select) {
    return await this.model.findById(id, select).exec();
  }
  async find(query, select, sort, limit, skip) {
    return await this.model.find(query, select).sort(sort).skip(skip).limit(limit).lean({ defaults: true }).exec();
  }
  async findAsModels(query, select, sort, limit, skip) {
    return await this.model.find(query, select).sort(sort).skip(skip).limit(limit).exec();
  }
  async findOne(query, select) {
    return await this.model.findOne(query, select).lean({ defaults: true }).exec();
  }
  async findOneAsModel(query, select) {
    return await this.model.findOne(query, select).exec();
  }
  async count(query) {
    return await this.model.countDocuments(query).exec();
  }
  async countAll() {
    return this.model.estimatedDocumentCount();
  }
  async updateOne(query, update, options) {
    return await this.model.updateOne(query, update, options).exec();
  }
  async updateMany(query, update, options) {
    return await this.model.updateMany(query, update, options).exec();
  }
  async bulkWrite(updates) {
    return await this.model.bulkWrite(updates);
  }
  async deleteOne(query) {
    return await this.model.deleteOne(query).exec();
  }
  async deleteMany(query) {
    return await this.model.deleteMany(query).exec();
  }
  async insertOne(document) {
    return await this.bulkWrite([
      {
        insertOne: {
          document
        }
      }
    ]);
  }
  objectIdFromDate(date) {
    return Math.floor(date.getTime() / 1e3).toString(16) + "0000000000000000";
  }
  dateFromObjectId(objectId) {
    return new Date(parseInt(objectId.toString().substring(0, 8), 16) * 1e3);
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=repository.js.map
