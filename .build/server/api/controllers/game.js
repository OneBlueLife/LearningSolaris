"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var game_exports = {};
__export(game_exports, {
  default: () => game_default
});
module.exports = __toCommonJS(game_exports);
var import_validation = __toESM(require("../../errors/validation"));
var import_game = require("../requests/game");
var game_default = (container) => {
  return {
    getDefaultSettings: (req, res, next) => {
      return res.status(200).json({
        settings: require("../../config/game/settings/user/standard.json"),
        options: require("../../config/game/settings/options.json")
      });
    },
    getFlux: async (req, res, next) => {
      try {
        const flux = container.gameFluxService.getCurrentFlux();
        return res.status(200).json(flux);
      } catch (err) {
        return next(err);
      }
    },
    create: async (req, res, next) => {
      req.body.general.createdByUserId = req.session.userId;
      try {
        let game = await container.gameCreateService.create(req.body);
        return res.status(201).json(game._id);
      } catch (err) {
        return next(err);
      }
    },
    createTutorial: async (req, res, next) => {
      try {
        let tutorial = await container.gameListService.getUserTutorial(req.session.userId);
        if (!tutorial) {
          const settings = require("../../config/game/settings/user/tutorial.json");
          settings.general.createdByUserId = req.session.userId;
          tutorial = await container.gameCreateService.create(settings);
        }
        return res.status(201).json(tutorial._id);
      } catch (err) {
        return next(err);
      }
    },
    detailInfo: async (req, res, next) => {
      try {
        return res.status(200).json(req.game);
      } catch (err) {
        return next(err);
      }
    },
    detailState: async (req, res, next) => {
      try {
        return res.status(200).json(req.game);
      } catch (err) {
        return next(err);
      }
    },
    detailGalaxy: async (req, res, next) => {
      try {
        let tick = +req.query.tick || null;
        if (tick != null && tick < 0) {
          throw new import_validation.default(`Tick must be greater or equal to 0.`);
        }
        let game = await container.gameGalaxyService.getGalaxy(req.params.gameId, req.session.userId, tick);
        return res.status(200).json(game);
      } catch (err) {
        return next(err);
      }
    },
    listSummary: async (req, res, next) => {
      try {
        const games = await Promise.all([
          container.gameListService.listJoinableGames(),
          container.gameListService.listInProgressGames(),
          container.gameListService.listRecentlyCompletedGames()
        ]);
        let result = {
          official: games[0].official,
          user: games[0].custom,
          inProgress: games[1],
          completed: games[2]
        };
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    },
    listOfficial: async (req, res, next) => {
      try {
        let games = await container.gameListService.listOfficialGames();
        return res.status(200).json(games);
      } catch (err) {
        return next(err);
      }
    },
    listCustom: async (req, res, next) => {
      try {
        let games = await container.gameListService.listCustomGames();
        return res.status(200).json(games);
      } catch (err) {
        return next(err);
      }
    },
    listInProgress: async (req, res, next) => {
      try {
        let games = await container.gameListService.listInProgressGames();
        return res.status(200).json(games);
      } catch (err) {
        return next(err);
      }
    },
    listRecentlyCompleted: async (req, res, next) => {
      try {
        let games = await container.gameListService.listRecentlyCompletedGames();
        return res.status(200).json(games);
      } catch (err) {
        return next(err);
      }
    },
    listMyCompleted: async (req, res, next) => {
      try {
        let games = await container.gameListService.listUserCompletedGames(req.session.userId);
        return res.status(200).json(games);
      } catch (err) {
        return next(err);
      }
    },
    listMyActiveGames: async (req, res, next) => {
      try {
        let games = await container.gameListService.listActiveGames(req.session.userId);
        return res.status(200).json(games);
      } catch (err) {
        return next(err);
      }
    },
    listSpectating: async (req, res, next) => {
      try {
        let games = await container.gameListService.listSpectating(req.session.userId);
        return res.status(200).json(games);
      } catch (err) {
        return next(err);
      }
    },
    getIntel: async (req, res, next) => {
      try {
        let startTick = +req.query.startTick || 0;
        let endTick = +req.query.endTick || Number.MAX_VALUE;
        let result = await container.historyService.listIntel(req.params.gameId, startTick, endTick);
        return res.status(200).json(result);
      } catch (err) {
        return next(err);
      }
    },
    join: async (req, res, next) => {
      try {
        const reqObj = (0, import_game.mapToGameJoinGameRequest)(req.body);
        let gameIsFull = await container.gameJoinService.join(
          req.game,
          req.session.userId,
          reqObj.playerId,
          reqObj.alias,
          reqObj.avatar,
          reqObj.password
        );
        res.sendStatus(200);
        container.broadcastService.gamePlayerJoined(req.game, reqObj.playerId, reqObj.alias, reqObj.avatar);
        if (gameIsFull) {
          container.broadcastService.gameStarted(req.game);
        }
      } catch (err) {
        return next(err);
      }
    },
    quit: async (req, res, next) => {
      try {
        let player = await container.gameService.quit(
          req.game,
          req.player
        );
        res.sendStatus(200);
        if (player) {
          container.broadcastService.gamePlayerQuit(req.game, player);
        }
      } catch (err) {
        return next(err);
      }
    },
    concede: async (req, res, next) => {
      try {
        const reqObj = (0, import_game.mapToGameConcedeDefeatRequest)(req.body);
        await container.gameService.concedeDefeat(
          req.game,
          req.player,
          reqObj.openSlot
        );
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    ready: async (req, res, next) => {
      try {
        await container.playerReadyService.declareReady(
          req.game,
          req.player
        );
        res.sendStatus(200);
        container.broadcastService.gamePlayerReady(req.game, req.player);
      } catch (err) {
        return next(err);
      }
    },
    readyToCycle: async (req, res, next) => {
      try {
        await container.playerReadyService.declareReadyToCycle(
          req.game,
          req.player
        );
        res.sendStatus(200);
        container.broadcastService.gamePlayerReady(req.game, req.player);
      } catch (err) {
        return next(err);
      }
    },
    unready: async (req, res, next) => {
      try {
        await container.playerReadyService.undeclareReady(
          req.game,
          req.player
        );
        res.sendStatus(200);
        container.broadcastService.gamePlayerNotReady(req.game, req.player);
      } catch (err) {
        return next(err);
      }
    },
    readyToQuit: async (req, res, next) => {
      try {
        await container.playerReadyService.declareReadyToQuit(
          req.game,
          req.player
        );
        res.sendStatus(200);
        container.broadcastService.gamePlayerReadyToQuit(req.game, req.player);
      } catch (err) {
        return next(err);
      }
    },
    unreadyToQuit: async (req, res, next) => {
      try {
        await container.playerReadyService.undeclareReadyToQuit(
          req.game,
          req.player
        );
        res.sendStatus(200);
        container.broadcastService.gamePlayerNotReadyToQuit(req.game, req.player);
      } catch (err) {
        return next(err);
      }
    },
    getNotes: async (req, res, next) => {
      try {
        let notes = await container.playerService.getGameNotes(
          req.game,
          req.player
        );
        res.status(200).json({ notes });
      } catch (err) {
        return next(err);
      }
    },
    saveNotes: async (req, res, next) => {
      try {
        const reqObj = (0, import_game.mapToGameSaveNotesRequest)(req.body);
        await container.playerService.updateGameNotes(
          req.game,
          req.player,
          reqObj.notes
        );
        res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    delete: async (req, res, next) => {
      try {
        await container.gameService.delete(
          req.game,
          req.session.userId
        );
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    },
    getPlayerUser: async (req, res, next) => {
      try {
        let user = await container.gameService.getPlayerUser(
          req.game,
          req.params.playerId
        );
        return res.status(200).json(user);
      } catch (err) {
        return next(err);
      }
    },
    touch: async (req, res, next) => {
      try {
        let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        if (!req.session.isImpersonating) {
          await container.playerService.updateLastSeenLean(req.params.gameId, req.session.userId, ip);
        }
        return res.sendStatus(200);
      } catch (err) {
        return next(err);
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=game.js.map
