"use strict";
module.exports = {
  async migrate(db) {
    const users = db.collection("users");
    await users.updateMany({
      "emailOtherEnabled": { $eq: null }
    }, {
      $set: {
        "emailOtherEnabled": true
      }
    });
    await users.updateMany({
      "hasSentReviewReminder": { $eq: null }
    }, {
      $set: {
        "hasSentReviewReminder": false
      }
    });
  }
};
//# sourceMappingURL=011-user-email-other-preference.js.map
