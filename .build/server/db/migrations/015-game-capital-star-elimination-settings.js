"use strict";
module.exports = {
  async migrate(db) {
    const games = db.collection("games");
    await games.updateMany({
      "settings.conquest.capitalStarElimination": { $eq: null }
    }, {
      $set: {
        "settings.conquest.capitalStarElimination": "disabled"
      }
    });
  }
};
//# sourceMappingURL=015-game-capital-star-elimination-settings.js.map
