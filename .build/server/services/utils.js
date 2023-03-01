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
var utils_exports = {};
__export(utils_exports, {
  getOrInsert: () => getOrInsert,
  intersectionOfSets: () => intersectionOfSets,
  maxBy: () => maxBy,
  minBy: () => minBy,
  notNull: () => notNull,
  reverseSort: () => reverseSort
});
module.exports = __toCommonJS(utils_exports);
function getOrInsert(map, key, defaultFunc) {
  let value = map.get(key);
  if (!value) {
    value = defaultFunc(key);
    map.set(key, value);
  }
  return value;
}
function intersectionOfSets(a, b) {
  return new Set(Array.from(a).filter((x) => b.has(x)));
}
function maxBy(max, list) {
  let lastScore = Number.MIN_SAFE_INTEGER;
  for (let el of list) {
    const elScore = max(el);
    if (elScore > lastScore) {
      lastScore = elScore;
    }
  }
  return lastScore;
}
function minBy(min, list) {
  let lastScore = Number.MAX_SAFE_INTEGER;
  for (let el of list) {
    const elScore = min(el);
    if (elScore < lastScore) {
      lastScore = elScore;
    }
  }
  return lastScore;
}
function reverseSort(sorter) {
  return (a, b) => sorter(b, a);
}
function notNull(val) {
  return val !== null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getOrInsert,
  intersectionOfSets,
  maxBy,
  minBy,
  notNull,
  reverseSort
});
//# sourceMappingURL=utils.js.map
