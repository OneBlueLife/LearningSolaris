"use strict";
module.exports = {
  async migrate(db) {
    const games = db.collection("games");
    await games.updateMany({
      "state.leaderboard": { $exists: false }
    }, {
      $set: {
        "state.leaderboard": null
      }
    });
  }
};
//# sourceMappingURL=016-game-leaderboard-state.js.map
