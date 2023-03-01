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
var waypointHelper_exports = {};
__export(waypointHelper_exports, {
  default: () => waypointHelper_default
});
module.exports = __toCommonJS(waypointHelper_exports);
var import_gameHelper = __toESM(require("./gameHelper"));
class WaypointHelper {
  calculateShortestRoute(game, carrier, sourceStarId, destinStarId) {
    const player = import_gameHelper.default.getUserPlayer(game);
    const hyperspaceDistance = import_gameHelper.default.getHyperspaceDistance(game, player, carrier);
    let graph = game.galaxy.stars.map((s) => {
      return {
        ...s,
        cost: 0,
        costFromStart: 0,
        neighbors: null,
        parent: null
      };
    });
    const getNeighbors = (node) => graph.filter((s) => s._id !== node._id).filter((s) => import_gameHelper.default.getDistanceBetweenLocations(s.location, node.location) <= hyperspaceDistance || import_gameHelper.default.isStarPairWormHole(s, node));
    let start = graph.find((s) => s._id === sourceStarId);
    let end = graph.find((s) => s._id === destinStarId);
    let openSet = [start];
    let closedSet = [];
    while (openSet.length) {
      openSet.sort((a, b) => a.costFromStart - b.costFromStart);
      const current = openSet.shift();
      closedSet.push(current);
      if (current._id === end._id) {
        let temp = current;
        const path = [];
        path.push(temp);
        while (temp.parent) {
          path.push(temp.parent);
          temp = temp.parent;
        }
        return path.reverse();
      }
      if (!current.neighbors) {
        current.neighbors = getNeighbors(current);
      }
      for (let neighbor of current.neighbors) {
        const isClosed = closedSet.find((n) => n._id === neighbor._id) != null;
        if (!isClosed) {
          neighbor.cost = import_gameHelper.default.getActualTicksBetweenLocations(game, player, carrier, current, neighbor, hyperspaceDistance);
          let nextCost = current.costFromStart + neighbor.cost;
          const isOpen = openSet.find((n) => n._id === neighbor._id) != null;
          if (!isOpen) {
            openSet.push(neighbor);
          } else if (nextCost >= neighbor.costFromStart) {
            continue;
          }
          neighbor.costFromStart = nextCost;
          neighbor.parent = current;
        }
      }
    }
    return [];
  }
}
var waypointHelper_default = new WaypointHelper();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=waypointHelper.js.map
