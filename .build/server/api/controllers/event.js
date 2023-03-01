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
var event_exports = {};
__export(event_exports, {
  default: () => event_default
});
module.exports = __toCommonJS(event_exports);
var event_default = (container) => {
  return {
    list: async (req, res, next) => {
      let page = +req.query.page || 0;
      let pageSize = +req.query.pageSize;
      let category = req.query.category || "all";
      try {
        let events = await container.eventService.getPlayerEvents(
          req.game._id,
          req.player,
          page,
          pageSize,
          category
        );
        return res.status(200).json(events);
      } catch (err) {
        return next(err);
      }
    },
    markAllAsRead: async (req, res, next) => {
      if (req.session.isImpersonating) {
        return res.sendStatus(200);
      }
      try {
        await container.eventService.markAllEventsAsRead(
          req.game,
          req.player._id
        );
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    markAsRead: async (req, res, next) => {
      if (req.session.isImpersonating) {
        return res.sendStatus(200);
      }
      try {
        await container.eventService.markEventAsRead(
          req.game,
          req.player._id,
          req.params.eventId
        );
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    getUnreadCount: async (req, res, next) => {
      try {
        let result = await container.eventService.getUnreadCount(
          req.game,
          req.player._id
        );
        return res.status(200).json({
          unread: result
        });
      } catch (err) {
        return next(err);
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=event.js.map
