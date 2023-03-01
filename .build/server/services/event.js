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
var event_exports = {};
__export(event_exports, {
  default: () => EventService
});
module.exports = __toCommonJS(event_exports);
var import_badge = require("./badge");
var import_combat = require("./combat");
var import_conversation = require("./conversation");
var import_game = require("./game");
var import_gameTick = require("./gameTick");
var import_ledger = require("./ledger");
var import_research = require("./research");
var import_star = require("./star");
var import_starUpgrade = require("./starUpgrade");
var import_trade = require("./trade");
var import_diplomacy = require("./diplomacy");
var import_carrierGift = require("./carrierGift");
var import_validation = __toESM(require("../errors/validation"));
var import_gameJoin = require("./gameJoin");
const moment = require("moment");
class EventService {
  constructor(eventModel, eventRepo, broadcastService, gameService, gameJoinService, gameTickService, researchService, starService, starUpgradeService, tradeService, ledgerService, conversationService, combatService, specialistService, badgeService, carrierGiftService, diplomacyService) {
    this.EVENT_TYPES = {
      GAME_PLAYER_JOINED: "gamePlayerJoined",
      GAME_PLAYER_QUIT: "gamePlayerQuit",
      GAME_PLAYER_DEFEATED: "gamePlayerDefeated",
      GAME_PLAYER_AFK: "gamePlayerAFK",
      GAME_STARTED: "gameStarted",
      GAME_ENDED: "gameEnded",
      GAME_PLAYER_BADGE_PURCHASED: "gamePlayerBadgePurchased",
      GAME_DIPLOMACY_PEACE_DECLARED: "gameDiplomacyPeaceDeclared",
      GAME_DIPLOMACY_WAR_DECLARED: "gameDiplomacyWarDeclared",
      PLAYER_GALACTIC_CYCLE_COMPLETE: "playerGalacticCycleComplete",
      PLAYER_COMBAT_STAR: "playerCombatStar",
      PLAYER_COMBAT_CARRIER: "playerCombatCarrier",
      PLAYER_RESEARCH_COMPLETE: "playerResearchComplete",
      PLAYER_TECHNOLOGY_RECEIVED: "playerTechnologyReceived",
      PLAYER_TECHNOLOGY_SENT: "playerTechnologySent",
      PLAYER_CREDITS_RECEIVED: "playerCreditsReceived",
      PLAYER_CREDITS_SENT: "playerCreditsSent",
      PLAYER_CREDITS_SPECIALISTS_RECEIVED: "playerCreditsSpecialistsReceived",
      PLAYER_CREDITS_SPECIALISTS_SENT: "playerCreditsSpecialistsSent",
      PLAYER_RENOWN_RECEIVED: "playerRenownReceived",
      PLAYER_RENOWN_SENT: "playerRenownSent",
      PLAYER_GIFT_RECEIVED: "playerGiftReceived",
      PLAYER_GIFT_SENT: "playerGiftSent",
      PLAYER_STAR_ABANDONED: "playerStarAbandoned",
      PLAYER_STAR_DIED: "playerStarDied",
      PLAYER_STAR_REIGNITED: "playerStarReignited",
      PLAYER_BULK_INFRASTRUCTURE_UPGRADED: "playerBulkInfrastructureUpgraded",
      PLAYER_DEBT_SETTLED: "playerDebtSettled",
      PLAYER_DEBT_FORGIVEN: "playerDebtForgiven",
      PLAYER_STAR_SPECIALIST_HIRED: "playerStarSpecialistHired",
      PLAYER_CARRIER_SPECIALIST_HIRED: "playerCarrierSpecialistHired",
      PLAYER_CONVERSATION_CREATED: "playerConversationCreated",
      PLAYER_CONVERSATION_INVITED: "playerConversationInvited",
      PLAYER_CONVERSATION_LEFT: "playerConversationLeft",
      PLAYER_DIPLOMACY_STATUS_CHANGED: "playerDiplomacyStatusChanged"
    };
    this.eventModel = eventModel;
    this.eventRepo = eventRepo;
    this.broadcastService = broadcastService;
    this.gameService = gameService;
    this.gameJoinService = gameJoinService;
    this.gameTickService = gameTickService;
    this.researchService = researchService;
    this.starService = starService;
    this.starUpgradeService = starUpgradeService;
    this.tradeService = tradeService;
    this.ledgerService = ledgerService;
    this.conversationService = conversationService;
    this.combatService = combatService;
    this.specialistService = specialistService;
    this.badgeService = badgeService;
    this.carrierGiftService = carrierGiftService;
    this.diplomacyService = diplomacyService;
    this.gameJoinService.on(import_gameJoin.GameJoinServiceEvents.onPlayerJoined, (args) => this.createPlayerJoinedEvent(args));
    this.gameJoinService.on(import_gameJoin.GameJoinServiceEvents.onGameStarted, (args) => this.createGameStartedEvent(args));
    this.gameService.on(import_game.GameServiceEvents.onGameDeleted, (args) => this.deleteByGameId(args.gameId));
    this.gameService.on(import_game.GameServiceEvents.onPlayerQuit, (args) => this.createPlayerQuitEvent(args));
    this.gameService.on(import_game.GameServiceEvents.onPlayerDefeated, (args) => this.createPlayerDefeatedEvent(args));
    this.combatService.on(import_combat.CombatServiceEvents.onPlayerCombatStar, (args) => this.createPlayerCombatStarEvent(
      args.gameId,
      args.gameTick,
      args.owner,
      args.defenders,
      args.attackers,
      args.star,
      args.combatResult,
      args.captureResult
    ));
    this.combatService.on(import_combat.CombatServiceEvents.onPlayerCombatCarrier, (args) => this.createPlayerCombatCarrierEvent(
      args.gameId,
      args.gameTick,
      args.defenders,
      args.attackers,
      args.combatResult
    ));
    this.gameTickService.on(import_gameTick.GameTickServiceEvents.onPlayerGalacticCycleCompleted, (args) => this.createPlayerGalacticCycleCompleteEvent(args));
    this.gameTickService.on(import_gameTick.GameTickServiceEvents.onPlayerAfk, (args) => this.createPlayerAfkEvent(args));
    this.gameTickService.on(import_gameTick.GameTickServiceEvents.onPlayerDefeated, (args) => this.createPlayerDefeatedEvent(args));
    this.gameTickService.on(import_gameTick.GameTickServiceEvents.onGameEnded, (args) => this.createGameEndedEvent(args));
    this.researchService.on(import_research.ResearchServiceEvents.onPlayerResearchCompleted, (args) => this.createResearchCompleteEvent(args.gameId, args.gameTick, args.playerId, args.technologyKey, args.technologyLevel, args.technologyKeyNext, args.technologyLevelNext));
    this.starService.on(import_star.StarServiceEvents.onPlayerStarAbandoned, (args) => this.createStarAbandonedEvent(args.gameId, args.gameTick, args.player, args.star));
    this.starService.on(import_star.StarServiceEvents.onPlayerStarDied, (args) => this.createStarDiedEvent(args.gameId, args.gameTick, args.playerId, args.starId, args.starName));
    this.starService.on(import_star.StarServiceEvents.onPlayerStarReignited, (args) => this.createStarReignitedEvent(args.gameId, args.gameTick, args.playerId, args.starId, args.starName));
    this.starUpgradeService.on(import_starUpgrade.StarUpgradeServiceEvents.onPlayerInfrastructureBulkUpgraded, (args) => this.createInfrastructureBulkUpgraded(args.gameId, args.gameTick, args.player, args.upgradeSummary));
    this.tradeService.on(import_trade.TradeServiceEvents.onPlayerCreditsReceived, (args) => this.createCreditsReceivedEvent(args.gameId, args.gameTick, args.fromPlayer, args.toPlayer, args.amount));
    this.tradeService.on(import_trade.TradeServiceEvents.onPlayerCreditsSent, (args) => this.createCreditsSentEvent(args.gameId, args.gameTick, args.fromPlayer, args.toPlayer, args.amount));
    this.tradeService.on(import_trade.TradeServiceEvents.onPlayerCreditsSpecialistsReceived, (args) => this.createCreditsSpecialistsReceivedEvent(args.gameId, args.gameTick, args.fromPlayer, args.toPlayer, args.amount));
    this.tradeService.on(import_trade.TradeServiceEvents.onPlayerCreditsSpecialistsSent, (args) => this.createCreditsSpecialistsSentEvent(args.gameId, args.gameTick, args.fromPlayer, args.toPlayer, args.amount));
    this.tradeService.on(import_trade.TradeServiceEvents.onPlayerRenownReceived, (args) => this.createRenownReceivedEvent(args.gameId, args.gameTick, args.fromPlayer, args.toPlayer, args.amount));
    this.tradeService.on(import_trade.TradeServiceEvents.onPlayerRenownSent, (args) => this.createRenownSentEvent(args.gameId, args.gameTick, args.fromPlayer, args.toPlayer, args.amount));
    this.tradeService.on(import_trade.TradeServiceEvents.onPlayerTechnologyReceived, (args) => this.createTechnologyReceivedEvent(args.gameId, args.gameTick, args.fromPlayer, args.toPlayer, args.technology));
    this.tradeService.on(import_trade.TradeServiceEvents.onPlayerTechnologySent, (args) => this.createTechnologySentEvent(args.gameId, args.gameTick, args.fromPlayer, args.toPlayer, args.technology));
    this.carrierGiftService.on(import_carrierGift.CarrierGiftServiceEvents.onPlayerGiftReceived, (args) => this.createGiftReceivedEvent(args.gameId, args.gameTick, args.fromPlayer, args.toPlayer, args.carrier, args.star));
    this.carrierGiftService.on(import_carrierGift.CarrierGiftServiceEvents.onPlayerGiftSent, (args) => this.createGiftSentEvent(args.gameId, args.gameTick, args.fromPlayer, args.toPlayer, args.carrier, args.star));
    this.ledgerService.on(import_ledger.LedgerServiceEvents.onDebtAdded, (args) => this.createDebtAddedEvent(args.gameId, args.gameTick, args.debtor, args.creditor, args.amount, args.ledgerType));
    this.ledgerService.on(import_ledger.LedgerServiceEvents.onDebtSettled, (args) => this.createDebtSettledEvent(args.gameId, args.gameTick, args.debtor, args.creditor, args.amount, args.ledgerType));
    this.ledgerService.on(import_ledger.LedgerServiceEvents.onDebtForgiven, (args) => this.createDebtForgivenEvent(args.gameId, args.gameTick, args.debtor, args.creditor, args.amount, args.ledgerType));
    this.conversationService.on(import_conversation.ConversationServiceEvents.onConversationCreated, (args) => this.createPlayerConversationCreated(args.gameId, args.gameTick, args.convo));
    this.conversationService.on(import_conversation.ConversationServiceEvents.onConversationInvited, (args) => this.createPlayerConversationInvited(args.gameId, args.gameTick, args.convo, args.playerId));
    this.conversationService.on(import_conversation.ConversationServiceEvents.onConversationLeft, (args) => this.createPlayerConversationLeft(args.gameId, args.gameTick, args.convo, args.playerId));
    this.badgeService.on(import_badge.BadgeServiceEvents.onGamePlayerBadgePurchased, (args) => this.createGamePlayerBadgePurchased(args));
    this.diplomacyService.on(import_diplomacy.DiplomacyServiceEvents.onDiplomacyPeaceDeclared, (args) => this.createGameDiplomacyPeaceDeclared(args));
    this.diplomacyService.on(import_diplomacy.DiplomacyServiceEvents.onDiplomacyWarDeclared, (args) => this.createGameDiplomacyWarDeclared(args));
    this.diplomacyService.on(import_diplomacy.DiplomacyServiceEvents.onDiplomacyStatusChanged, (args) => this.createPlayerDiplomacyStatusChanged(args.gameId, args.gameTick, args.status));
  }
  async deleteByGameId(gameId) {
    await this.eventRepo.deleteMany({
      gameId
    });
  }
  async deleteByEventType(gameId, gameTick, type) {
    await this.eventRepo.deleteMany({
      gameId,
      tick: gameTick,
      type
    });
  }
  async createGameEvent(gameId, gameTick, type, data) {
    let event = new this.eventModel({
      gameId,
      playerId: null,
      tick: gameTick,
      type,
      data,
      read: null
    });
    await event.save();
  }
  async createPlayerEvent(gameId, gameTick, playerId, type, data, isRead = false) {
    let event = new this.eventModel({
      gameId,
      playerId,
      tick: gameTick,
      type,
      data,
      read: isRead
    });
    await event.save();
  }
  async getPlayerEvents(gameId, player, page, pageSize, category) {
    const query = {
      gameId,
      playerId: {
        $in: [
          player._id,
          null
        ]
      }
    };
    if (category != null && category !== "all") {
      const categories = {
        gameEvents: [
          "gamePlayerJoined",
          "gamePlayerQuit",
          "gamePlayerDefeated",
          "gamePlayerAFK",
          "gameStarted",
          "gameEnded",
          "gamePaused",
          "gamePlayerBadgePurchased",
          "playerRenownReceived",
          "playerRenownSent"
        ],
        trade: [
          "playerTechnologyReceived",
          "playerTechnologySent",
          "playerCreditsReceived",
          "playerCreditsSent",
          "playerCreditsSpecialistsReceived",
          "playerCreditsSpecialistsSent",
          "playerGiftReceived",
          "playerGiftSent",
          "playerDebtSettled",
          "playerDebtForgiven"
        ],
        combat: [
          "playerCombatStar",
          "playerCombatCarrier",
          "playerStarAbandoned"
        ],
        galacticCycles: [
          "playerGalacticCycleComplete"
        ],
        research: [
          "playerResearchComplete"
        ],
        specialists: [
          "playerStarSpecialistHired",
          "playerCarrierSpecialistHired"
        ],
        conversations: [
          "playerConversationCreated",
          "playerConversationInvited",
          "playerConversationLeft"
        ],
        diplomacy: [
          "playerDiplomacyStatusChanged",
          "gameDiplomacyPeaceDeclared",
          "gameDiplomacyWarDeclared",
          "gameDiplomacyAllianceDeclared"
        ]
      };
      const categoryFilter = categories[category];
      if (!categoryFilter) {
        throw new import_validation.default(`Unsupported category: ${category}`);
      }
      query["type"] = {
        $in: categoryFilter
      };
    }
    const count = await this.eventRepo.count(query);
    const events = await this.eventRepo.find(
      query,
      null,
      {
        tick: -1,
        _id: -1
      },
      pageSize,
      page * pageSize
    );
    return {
      count,
      events
    };
  }
  async markAllEventsAsRead(game, playerId) {
    await this.eventRepo.updateMany({
      gameId: game._id,
      playerId,
      read: false
    }, {
      $set: {
        read: true
      }
    });
    this.broadcastService.playerAllEventsRead(game, playerId);
  }
  async markEventAsRead(game, playerId, eventId) {
    await this.eventRepo.updateOne({
      _id: eventId,
      gameId: game._id,
      playerId,
      read: false
    }, {
      $set: {
        read: true
      }
    });
    this.broadcastService.playerEventRead(game, playerId, eventId);
  }
  async getUnreadCount(game, playerId) {
    return await this.eventRepo.count({
      gameId: game._id,
      playerId,
      read: false
    });
  }
  async createPlayerJoinedEvent(args) {
    let data = {
      playerId: args.playerId,
      alias: args.playerAlias
    };
    return await this.createGameEvent(args.gameId, args.gameTick, this.EVENT_TYPES.GAME_PLAYER_JOINED, data);
  }
  async createPlayerQuitEvent(args) {
    let data = {
      playerId: args.playerId,
      alias: args.playerAlias
    };
    return await this.createGameEvent(args.gameId, args.gameTick, this.EVENT_TYPES.GAME_PLAYER_QUIT, data);
  }
  async createPlayerDefeatedEvent(args) {
    let data = {
      playerId: args.playerId,
      alias: args.playerAlias,
      openSlot: args.openSlot
    };
    return await this.createGameEvent(args.gameId, args.gameTick, this.EVENT_TYPES.GAME_PLAYER_DEFEATED, data);
  }
  async createPlayerAfkEvent(args) {
    let data = {
      playerId: args.playerId,
      alias: args.playerAlias
    };
    return await this.createGameEvent(args.gameId, args.gameTick, this.EVENT_TYPES.GAME_PLAYER_AFK, data);
  }
  async createGameStartedEvent(args) {
    let data = {};
    return await this.createGameEvent(args.gameId, args.gameTick, this.EVENT_TYPES.GAME_STARTED, data);
  }
  async createGameEndedEvent(args) {
    let data = {
      rankingResult: args.rankingResult
    };
    return await this.createGameEvent(args.gameId, args.gameTick, this.EVENT_TYPES.GAME_ENDED, data);
  }
  async createPlayerGalacticCycleCompleteEvent(data) {
    return await this.createPlayerEvent(data.gameId, data.gameTick, data.playerId, this.EVENT_TYPES.PLAYER_GALACTIC_CYCLE_COMPLETE, data);
  }
  async createPlayerCombatStarEvent(gameId, gameTick, owner, defenders, attackers, star, combatResult, captureResult) {
    let data = {
      playerIdOwner: owner._id,
      playerIdDefenders: defenders.map((p) => p._id),
      playerIdAttackers: attackers.map((p) => p._id),
      starId: star._id,
      starName: star.name,
      captureResult
    };
    for (let defender of defenders) {
      let defenderCombatResult = this.combatService.sanitiseCombatResult(combatResult, defender);
      await this.createPlayerEvent(gameId, gameTick, defender._id, this.EVENT_TYPES.PLAYER_COMBAT_STAR, { ...data, combatResult: defenderCombatResult });
    }
    for (let attacker of attackers) {
      let attackerCombatResult = this.combatService.sanitiseCombatResult(combatResult, attacker);
      await this.createPlayerEvent(gameId, gameTick, attacker._id, this.EVENT_TYPES.PLAYER_COMBAT_STAR, { ...data, combatResult: attackerCombatResult });
    }
  }
  async createPlayerCombatCarrierEvent(gameId, gameTick, defenders, attackers, combatResult) {
    let data = {
      playerIdDefenders: defenders.map((p) => p._id),
      playerIdAttackers: attackers.map((p) => p._id),
      combatResult
    };
    for (let defender of defenders) {
      let defenderCombatResult = this.combatService.sanitiseCombatResult(combatResult, defender);
      await this.createPlayerEvent(gameId, gameTick, defender._id, this.EVENT_TYPES.PLAYER_COMBAT_CARRIER, { ...data, combatResult: defenderCombatResult });
    }
    for (let attacker of attackers) {
      let attackerCombatResult = this.combatService.sanitiseCombatResult(combatResult, attacker);
      await this.createPlayerEvent(gameId, gameTick, attacker._id, this.EVENT_TYPES.PLAYER_COMBAT_CARRIER, { ...data, combatResult: attackerCombatResult });
    }
  }
  async createResearchCompleteEvent(gameId, gameTick, playerId, technologyKey, technologyLevel, technologyKeyNext, technologyLevelNext) {
    let data = {
      technologyKey,
      technologyLevel,
      technologyKeyNext,
      technologyLevelNext
    };
    return await this.createPlayerEvent(gameId, gameTick, playerId, this.EVENT_TYPES.PLAYER_RESEARCH_COMPLETE, data);
  }
  async createTechnologyReceivedEvent(gameId, gameTick, fromPlayer, toPlayer, technology) {
    let data = {
      fromPlayerId: fromPlayer._id,
      technology
    };
    return await this.createPlayerEvent(gameId, gameTick, toPlayer._id, this.EVENT_TYPES.PLAYER_TECHNOLOGY_RECEIVED, data);
  }
  async createTechnologySentEvent(gameId, gameTick, fromPlayer, toPlayer, technology) {
    let data = {
      toPlayerId: toPlayer._id,
      technology
    };
    return await this.createPlayerEvent(gameId, gameTick, fromPlayer._id, this.EVENT_TYPES.PLAYER_TECHNOLOGY_SENT, data, true);
  }
  async createCreditsReceivedEvent(gameId, gameTick, fromPlayer, toPlayer, credits) {
    let data = {
      fromPlayerId: fromPlayer._id,
      credits
    };
    return await this.createPlayerEvent(gameId, gameTick, toPlayer._id, this.EVENT_TYPES.PLAYER_CREDITS_RECEIVED, data);
  }
  async createCreditsSentEvent(gameId, gameTick, fromPlayer, toPlayer, credits) {
    let data = {
      toPlayerId: toPlayer._id,
      credits
    };
    return await this.createPlayerEvent(gameId, gameTick, fromPlayer._id, this.EVENT_TYPES.PLAYER_CREDITS_SENT, data, true);
  }
  async createCreditsSpecialistsReceivedEvent(gameId, gameTick, fromPlayer, toPlayer, creditsSpecialists) {
    let data = {
      fromPlayerId: fromPlayer._id,
      creditsSpecialists
    };
    return await this.createPlayerEvent(gameId, gameTick, toPlayer._id, this.EVENT_TYPES.PLAYER_CREDITS_SPECIALISTS_RECEIVED, data);
  }
  async createCreditsSpecialistsSentEvent(gameId, gameTick, fromPlayer, toPlayer, creditsSpecialists) {
    let data = {
      toPlayerId: toPlayer._id,
      creditsSpecialists
    };
    return await this.createPlayerEvent(gameId, gameTick, fromPlayer._id, this.EVENT_TYPES.PLAYER_CREDITS_SPECIALISTS_SENT, data, true);
  }
  async createRenownReceivedEvent(gameId, gameTick, fromPlayer, toPlayer, renown) {
    let data = {
      fromPlayerId: fromPlayer._id,
      renown
    };
    return await this.createPlayerEvent(gameId, gameTick, toPlayer._id, this.EVENT_TYPES.PLAYER_RENOWN_RECEIVED, data);
  }
  async createRenownSentEvent(gameId, gameTick, fromPlayer, toPlayer, renown) {
    let data = {
      toPlayerId: toPlayer._id,
      renown
    };
    return await this.createPlayerEvent(gameId, gameTick, fromPlayer._id, this.EVENT_TYPES.PLAYER_RENOWN_SENT, data, true);
  }
  async createGiftReceivedEvent(gameId, gameTick, fromPlayer, toPlayer, carrier, star) {
    let data = {
      fromPlayerId: fromPlayer._id,
      carrierId: carrier._id,
      carrierName: carrier.name,
      carrierShips: carrier.ships,
      starId: star._id,
      starName: star.name
    };
    return await this.createPlayerEvent(gameId, gameTick, toPlayer._id, this.EVENT_TYPES.PLAYER_GIFT_RECEIVED, data);
  }
  async createGiftSentEvent(gameId, gameTick, fromPlayer, toPlayer, carrier, star) {
    let data = {
      toPlayerId: toPlayer._id,
      carrierId: carrier._id,
      carrierName: carrier.name,
      carrierShips: carrier.ships,
      starId: star._id,
      starName: star.name
    };
    return await this.createPlayerEvent(gameId, gameTick, fromPlayer._id, this.EVENT_TYPES.PLAYER_GIFT_SENT, data, true);
  }
  async createStarAbandonedEvent(gameId, gameTick, player, star) {
    let data = {
      starId: star._id,
      starName: star.name
    };
    return await this.createPlayerEvent(gameId, gameTick, player._id, this.EVENT_TYPES.PLAYER_STAR_ABANDONED, data, true);
  }
  async createStarDiedEvent(gameId, gameTick, playerId, starId, starName) {
    let data = {
      starId,
      starName
    };
    await this.createPlayerEvent(gameId, gameTick, playerId, this.EVENT_TYPES.PLAYER_STAR_DIED, data);
  }
  async createStarReignitedEvent(gameId, gameTick, playerId, starId, starName) {
    let data = {
      starId,
      starName
    };
    await this.createPlayerEvent(gameId, gameTick, playerId, this.EVENT_TYPES.PLAYER_STAR_REIGNITED, data);
  }
  async createInfrastructureBulkUpgraded(gameId, gameTick, player, upgradeReport) {
    let data = {
      upgradeReport
    };
    return await this.createPlayerEvent(gameId, gameTick, player._id, this.EVENT_TYPES.PLAYER_BULK_INFRASTRUCTURE_UPGRADED, data, true);
  }
  async createDebtAddedEvent(gameId, gameTick, debtorPlayerId, creditorPlayerId, amount, ledgerType) {
    this.broadcastService.gamePlayerDebtAdded(debtorPlayerId, creditorPlayerId, amount, ledgerType);
  }
  async createDebtSettledEvent(gameId, gameTick, debtorPlayerId, creditorPlayerId, amount, ledgerType) {
    let data = {
      debtorPlayerId,
      creditorPlayerId,
      amount,
      ledgerType
    };
    await this.createPlayerEvent(gameId, gameTick, debtorPlayerId, this.EVENT_TYPES.PLAYER_DEBT_SETTLED, data, true);
    await this.createPlayerEvent(gameId, gameTick, creditorPlayerId, this.EVENT_TYPES.PLAYER_DEBT_SETTLED, data, false);
    this.broadcastService.gamePlayerDebtSettled(debtorPlayerId, creditorPlayerId, amount, ledgerType);
  }
  async createDebtForgivenEvent(gameId, gameTick, debtorPlayerId, creditorPlayerId, amount, ledgerType) {
    let data = {
      debtorPlayerId,
      creditorPlayerId,
      amount,
      ledgerType
    };
    await this.createPlayerEvent(gameId, gameTick, debtorPlayerId, this.EVENT_TYPES.PLAYER_DEBT_FORGIVEN, data, false);
    await this.createPlayerEvent(gameId, gameTick, creditorPlayerId, this.EVENT_TYPES.PLAYER_DEBT_FORGIVEN, data, true);
    this.broadcastService.gamePlayerDebtForgiven(debtorPlayerId, creditorPlayerId, amount, ledgerType);
  }
  async createPlayerStarSpecialistHired(gameId, gameTick, player, star, specialist) {
    let data = {
      starId: star._id,
      starName: star.name,
      specialistId: specialist.id,
      specialistName: specialist.name,
      specialistDescription: specialist.description
    };
    await this.createPlayerEvent(gameId, gameTick, player._id, this.EVENT_TYPES.PLAYER_STAR_SPECIALIST_HIRED, data, true);
  }
  async createPlayerCarrierSpecialistHired(gameId, gameTick, player, carrier, specialist) {
    let data = {
      carrierId: carrier._id,
      carrierName: carrier.name,
      specialistId: specialist.id,
      specialistName: specialist.name,
      specialistDescription: specialist.description
    };
    await this.createPlayerEvent(gameId, gameTick, player._id, this.EVENT_TYPES.PLAYER_CARRIER_SPECIALIST_HIRED, data, true);
  }
  async createPlayerConversationCreated(gameId, gameTick, convo) {
    let data = {
      conversationId: convo._id,
      createdBy: convo.createdBy,
      name: convo.name,
      participants: convo.participants
    };
    await this.createPlayerEvent(gameId, gameTick, convo.createdBy, this.EVENT_TYPES.PLAYER_CONVERSATION_CREATED, data, true);
  }
  async createPlayerConversationInvited(gameId, gameTick, convo, playerId) {
    let data = {
      conversationId: convo._id,
      name: convo.name,
      playerId
    };
    await this.createPlayerEvent(gameId, gameTick, playerId, this.EVENT_TYPES.PLAYER_CONVERSATION_INVITED, data);
  }
  async createPlayerConversationLeft(gameId, gameTick, convo, playerId) {
    let data = {
      conversationId: convo._id,
      name: convo.name,
      playerId
    };
    await this.createPlayerEvent(gameId, gameTick, playerId, this.EVENT_TYPES.PLAYER_CONVERSATION_LEFT, data, true);
  }
  async createGamePlayerBadgePurchased(args) {
    let data = {
      purchasedByPlayerId: args.purchasedByPlayerId,
      purchasedByPlayerAlias: args.purchasedByPlayerAlias,
      purchasedForPlayerId: args.purchasedForPlayerId,
      purchasedForPlayerAlias: args.purchasedForPlayerAlias,
      badgeKey: args.badgeKey,
      badgeName: args.badgeName
    };
    return await this.createGameEvent(args.gameId, args.gameTick, this.EVENT_TYPES.GAME_PLAYER_BADGE_PURCHASED, data);
  }
  async _deleteGameDiplomacyDeclarationsInTick(gameId, gameTick, status) {
    await this.eventRepo.deleteMany({
      gameId,
      tick: gameTick,
      type: {
        $in: [
          this.EVENT_TYPES.GAME_DIPLOMACY_PEACE_DECLARED,
          this.EVENT_TYPES.GAME_DIPLOMACY_WAR_DECLARED
        ]
      },
      $or: [
        {
          "data.playerIdFrom": status.playerIdFrom,
          "data.playerIdTo": status.playerIdTo
        },
        {
          "data.playerIdFrom": status.playerIdTo,
          "data.playerIdTo": status.playerIdFrom
        }
      ]
    });
  }
  async createGameDiplomacyPeaceDeclared(args) {
    let data = args.status;
    await this._deleteGameDiplomacyDeclarationsInTick(args.gameId, args.gameTick, args.status);
    return await this.createGameEvent(args.gameId, args.gameTick, this.EVENT_TYPES.GAME_DIPLOMACY_PEACE_DECLARED, data);
  }
  async createGameDiplomacyWarDeclared(args) {
    let data = args.status;
    await this._deleteGameDiplomacyDeclarationsInTick(args.gameId, args.gameTick, args.status);
    return await this.createGameEvent(args.gameId, args.gameTick, this.EVENT_TYPES.GAME_DIPLOMACY_WAR_DECLARED, data);
  }
  async createPlayerDiplomacyStatusChanged(gameId, gameTick, status) {
    let data = status;
    await this.deleteByEventType(gameId, gameTick, this.EVENT_TYPES.PLAYER_DIPLOMACY_STATUS_CHANGED);
    await this.createPlayerEvent(gameId, gameTick, status.playerIdFrom, this.EVENT_TYPES.PLAYER_DIPLOMACY_STATUS_CHANGED, data);
    await this.createPlayerEvent(gameId, gameTick, status.playerIdTo, this.EVENT_TYPES.PLAYER_DIPLOMACY_STATUS_CHANGED, data);
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=event.js.map
