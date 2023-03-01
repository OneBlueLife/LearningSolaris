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
var sendReviewReminders_exports = {};
__export(sendReviewReminders_exports, {
  default: () => sendReviewReminders_default
});
module.exports = __toCommonJS(sendReviewReminders_exports);
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
var sendReviewReminders_default = (container) => {
  return {
    async handler(job, done) {
      if (!container.emailService.isEnabled()) {
        done();
        return;
      }
      const users = await container.userService.listUsersEligibleForReviewReminder(5);
      for (const user of users) {
        try {
          await container.emailService.sendReviewReminderEmail(user);
        } catch (e) {
          console.error(e);
        } finally {
          await container.userService.setReviewReminderEmailSent(user._id, true);
        }
        await sleep(1e3);
      }
      done();
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=sendReviewReminders.js.map
