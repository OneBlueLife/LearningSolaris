"use strict";
module.exports = {
  async migrate(db) {
    const games = db.collection("games");
    await games.updateMany({
      "spectators": { $eq: null }
    }, {
      $set: {
        "spectators": []
      }
    });
  }
};
//# sourceMappingURL=013-game-spectators.js.map
