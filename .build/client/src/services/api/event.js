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
var event_exports = {};
__export(event_exports, {
  default: () => event_default
});
module.exports = __toCommonJS(event_exports);
var import_axios = __toESM(require("axios"));
var import_base = __toESM(require("./base"));
class EventService extends import_base.default {
  getEvents(gameId, page, pageSize, category) {
    const url = `${this.BASE_URL}game/${gameId}/events?page=${page}&pageSize=${pageSize}&category=${category}`;
    return import_axios.default.get(
      url,
      { withCredentials: true }
    );
  }
  markEventAsRead(gameId, eventId) {
    return import_axios.default.patch(
      this.BASE_URL + "game/" + gameId + "/events/" + eventId + "/markAsRead",
      {},
      { withCredentials: true }
    );
  }
  markAllEventsAsRead(gameId) {
    return import_axios.default.patch(
      this.BASE_URL + "game/" + gameId + "/events/markAsRead",
      {},
      { withCredentials: true }
    );
  }
  getUnreadCount(gameId) {
    return import_axios.default.get(
      this.BASE_URL + "game/" + gameId + "/events/unread",
      { withCredentials: true }
    );
  }
}
var event_default = new EventService();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=event.js.map
