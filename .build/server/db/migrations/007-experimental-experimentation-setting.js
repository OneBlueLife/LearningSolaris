"use strict";
module.exports = {
  async migrate(db) {
    const games = db.collection("games");
    await games.updateMany({
      "settings.technology.experimentationReward": { $eq: null }
    }, {
      $set: {
        "settings.technology.experimentationReward": "standard"
      }
    });
  }
};
//# sourceMappingURL=007-experimental-experimentation-setting.js.map
