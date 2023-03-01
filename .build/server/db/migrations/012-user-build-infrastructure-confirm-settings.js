"use strict";
module.exports = {
  async migrate(db) {
    const users = db.collection("users");
    await users.updateMany({
      "gameSettings.star": { $eq: null }
    }, {
      $set: {
        "gameSettings.star": {
          confirmBuildEconomy: "disabled",
          confirmBuildIndustry: "disabled",
          confirmBuildScience: "disabled"
        }
      }
    });
  }
};
//# sourceMappingURL=012-user-build-infrastructure-confirm-settings.js.map
