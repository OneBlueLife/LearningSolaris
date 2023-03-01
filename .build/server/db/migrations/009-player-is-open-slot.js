"use strict";
module.exports = {
  async migrate(db) {
    const games = db.collection("games");
    await games.updateMany({
      "state.endDate": { $ne: null },
      "galaxy.players.isOpenSlot": { $eq: null }
    }, {
      $set: {
        "galaxy.players.$[].isOpenSlot": false
      }
    });
    await games.updateMany({
      "state.endDate": { $eq: null },
      "settings.general.type": { $ne: "tutorial" },
      "galaxy.players.isOpenSlot": { $eq: null }
    }, {
      $set: {
        "galaxy.players.$[p].isOpenSlot": true
      }
    }, {
      arrayFilters: [
        {
          "p.isOpenSlot": { $eq: null },
          "p.userId": { $eq: null }
        }
      ]
    });
    await games.updateMany({
      "state.endDate": { $eq: null },
      "settings.general.type": { $ne: "tutorial" },
      "galaxy.players.isOpenSlot": { $eq: null }
    }, {
      $set: {
        "galaxy.players.$[p].isOpenSlot": true
      }
    }, {
      arrayFilters: [
        {
          "p.isOpenSlot": { $eq: null },
          "p.userId": { $ne: null },
          "p.defeated": true,
          "p.afk": true
        }
      ]
    });
  }
};
//# sourceMappingURL=009-player-is-open-slot.js.map
