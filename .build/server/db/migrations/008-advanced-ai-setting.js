"use strict";
module.exports = {
  async migrate(db) {
    const games = db.collection("games");
    await games.updateMany({
      "settings.general.advancedAI": { $eq: null }
    }, {
      $set: {
        "settings.general.advancedAI": "disabled"
      }
    });
  }
};
//# sourceMappingURL=008-advanced-ai-setting.js.map
