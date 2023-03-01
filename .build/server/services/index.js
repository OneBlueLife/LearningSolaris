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
var services_exports = {};
__export(services_exports, {
  default: () => services_default
});
module.exports = __toCommonJS(services_exports);
var import_Game = __toESM(require("../db/models/Game"));
var import_User = __toESM(require("../db/models/User"));
var import_History = __toESM(require("../db/models/History"));
var import_Event = __toESM(require("../db/models/Event"));
var import_Guild = __toESM(require("../db/models/Guild"));
var import_Payment = __toESM(require("../db/models/Payment"));
var import_Report = __toESM(require("../db/models/Report"));
var import_admin = __toESM(require("./admin"));
var import_password = __toESM(require("./password"));
var import_auth = __toESM(require("./auth"));
var import_broadcast = __toESM(require("./broadcast"));
var import_carrier = __toESM(require("./carrier"));
var import_combat = __toESM(require("./combat"));
var import_distance = __toESM(require("./distance"));
var import_email = __toESM(require("./email"));
var import_event = __toESM(require("./event"));
var import_leaderboard = __toESM(require("./leaderboard"));
var import_game = __toESM(require("./game"));
var import_gameJoin = __toESM(require("./gameJoin"));
var import_gameCreateValidation = __toESM(require("./gameCreateValidation"));
var import_gameCreate = __toESM(require("./gameCreate"));
var import_gameGalaxy = __toESM(require("./gameGalaxy"));
var import_gameList = __toESM(require("./gameList"));
var import_gameTick = __toESM(require("./gameTick"));
var import_gameType = __toESM(require("./gameType"));
var import_gameState = __toESM(require("./gameState"));
var import_battleRoyale = __toESM(require("./battleRoyale"));
var import_map = __toESM(require("./map"));
var import_player = __toESM(require("./player"));
var import_playerAfk = __toESM(require("./playerAfk"));
var import_userLevel = __toESM(require("./userLevel"));
var import_playerReady = __toESM(require("./playerReady"));
var import_random = __toESM(require("./random"));
var import_research = __toESM(require("./research"));
var import_star = __toESM(require("./star"));
var import_starDistance = __toESM(require("./starDistance"));
var import_name = __toESM(require("./name"));
var import_starUpgrade = __toESM(require("./starUpgrade"));
var import_technology = __toESM(require("./technology"));
var import_trade = __toESM(require("./trade"));
var import_waypoint = __toESM(require("./waypoint"));
var import_shipTransfer = __toESM(require("./shipTransfer"));
var import_user = __toESM(require("./user"));
var import_history = __toESM(require("./history"));
var import_ledger = __toESM(require("./ledger"));
var import_specialist = __toESM(require("./specialist"));
var import_specialistBan = __toESM(require("./specialistBan"));
var import_specialistHire = __toESM(require("./specialistHire"));
var import_specialStarBan = __toESM(require("./specialStarBan"));
var import_achievement = __toESM(require("./achievement"));
var import_conversation = __toESM(require("./conversation"));
var import_reputation = __toESM(require("./reputation"));
var import_ai = __toESM(require("./ai"));
var import_guild = __toESM(require("./guild"));
var import_guildUser = __toESM(require("./guildUser"));
var import_starMovement = __toESM(require("./starMovement"));
var import_cache = __toESM(require("./cache"));
var import_recaptcha = __toESM(require("./recaptcha"));
var import_rating = __toESM(require("./rating"));
var import_diplomacy = __toESM(require("./diplomacy"));
var import_avatar = __toESM(require("./avatar"));
var import_paypal = __toESM(require("./paypal"));
var import_badge = __toESM(require("./badge"));
var import_report = __toESM(require("./report"));
var import_resource = __toESM(require("./resource"));
var import_circular = __toESM(require("./maps/circular"));
var import_circularBalanced = __toESM(require("./maps/circularBalanced"));
var import_spiral = __toESM(require("./maps/spiral"));
var import_doughnut = __toESM(require("./maps/doughnut"));
var import_irregular = __toESM(require("./maps/irregular"));
var import_custom = __toESM(require("./maps/custom"));
var import_diplomacyUpkeep = __toESM(require("./diplomacyUpkeep"));
var import_playerCredits = __toESM(require("./playerCredits"));
var import_playerStatistics = __toESM(require("./playerStatistics"));
var import_carrierMovement = __toESM(require("./carrierMovement"));
var import_carrierGift = __toESM(require("./carrierGift"));
var import_playerCycleRewards = __toESM(require("./playerCycleRewards"));
var import_starContested = __toESM(require("./starContested"));
var import_gameFlux = __toESM(require("./gameFlux"));
var import_notification = __toESM(require("./notification"));
var import_discord = __toESM(require("./discord"));
var import_ship = __toESM(require("./ship"));
var import_spectator = __toESM(require("./spectator"));
var import_repository = __toESM(require("./repository"));
const bcrypt = require("bcrypt");
const gameNames = require("../config/game/gameNames");
const starNames = require("../config/game/starNames");
const gameRepository = new import_repository.default(import_Game.default);
const userRepository = new import_repository.default(import_User.default);
const historyRepository = new import_repository.default(import_History.default);
const eventRepository = new import_repository.default(import_Event.default);
const guildRepository = new import_repository.default(import_Guild.default);
const paymentRepository = new import_repository.default(import_Payment.default);
const reportRepository = new import_repository.default(import_Report.default);
var services_default = (config, io) => {
  const passwordService = new import_password.default(bcrypt);
  const userLevelService = new import_userLevel.default();
  const authService = new import_auth.default(userRepository, passwordService);
  const discordService = new import_discord.default(config, userRepository);
  const userService = new import_user.default(import_User.default, userRepository, passwordService);
  const adminService = new import_admin.default(userRepository, gameRepository);
  const recaptchaService = new import_recaptcha.default(config);
  const specialStarBanService = new import_specialStarBan.default();
  const guildService = new import_guild.default(import_Guild.default, guildRepository, userRepository, userService);
  const guildUserService = new import_guildUser.default(userRepository, guildService);
  const broadcastService = new import_broadcast.default(io);
  const distanceService = new import_distance.default();
  const randomService = new import_random.default();
  const cacheService = new import_cache.default(config);
  const paypalService = new import_paypal.default(import_Payment.default, config, paymentRepository, userService, cacheService);
  const gameTypeService = new import_gameType.default();
  const specialistService = new import_specialist.default(gameTypeService);
  const gameStateService = new import_gameState.default();
  const gameFluxService = new import_gameFlux.default();
  const playerCreditsService = new import_playerCredits.default(gameRepository);
  const avatarService = new import_avatar.default(userRepository, userService);
  const achievementService = new import_achievement.default(userRepository, guildService, userLevelService);
  const ratingService = new import_rating.default(userRepository, gameRepository, userService);
  const nameService = new import_name.default(gameNames, starNames, randomService);
  const starDistanceService = new import_starDistance.default(distanceService);
  const technologyService = new import_technology.default(specialistService);
  const starService = new import_star.default(gameRepository, randomService, nameService, distanceService, starDistanceService, technologyService, specialistService, userService, gameTypeService, gameStateService);
  const carrierService = new import_carrier.default(gameRepository, distanceService, starService, technologyService, specialistService);
  const shipService = new import_ship.default(starService, technologyService, carrierService);
  const playerStatisticsService = new import_playerStatistics.default(starService, carrierService, technologyService, specialistService, shipService);
  const playerCycleRewardsService = new import_playerCycleRewards.default(starService, technologyService, playerStatisticsService, specialistService);
  const diplomacyUpkeepService = new import_diplomacyUpkeep.default(playerCreditsService, playerCycleRewardsService);
  const diplomacyService = new import_diplomacy.default(gameRepository, eventRepository, diplomacyUpkeepService);
  const starContestedService = new import_starContested.default(diplomacyService);
  const carrierGiftService = new import_carrierGift.default(gameRepository, diplomacyService);
  const carrierMovementService = new import_carrierMovement.default(gameRepository, distanceService, starService, specialistService, diplomacyService, carrierGiftService);
  const resourceService = new import_resource.default(randomService, distanceService, starDistanceService, gameTypeService);
  const circularMapService = new import_circular.default(randomService, starService, starDistanceService, distanceService, resourceService, gameTypeService);
  const circularBalancedMapService = new import_circularBalanced.default(randomService, starService, starDistanceService, distanceService, resourceService, gameTypeService);
  const spiralMapService = new import_spiral.default(randomService, starService, starDistanceService, distanceService, resourceService, gameTypeService);
  const doughnutMapService = new import_doughnut.default(randomService, starService, starDistanceService, distanceService, resourceService, gameTypeService);
  const irregularMapService = new import_irregular.default(randomService, starService, starDistanceService, distanceService, resourceService, gameTypeService);
  const customMapService = new import_custom.default();
  const mapService = new import_map.default(randomService, starService, starDistanceService, nameService, circularMapService, spiralMapService, doughnutMapService, circularBalancedMapService, irregularMapService, gameTypeService, customMapService);
  const playerReadyService = new import_playerReady.default(gameRepository, gameTypeService);
  const playerService = new import_player.default(gameRepository, randomService, mapService, starService, carrierService, starDistanceService, technologyService, specialistService, gameTypeService, playerReadyService);
  const spectatorService = new import_spectator.default(gameRepository, playerService, userService);
  const playerAfkService = new import_playerAfk.default(gameRepository, playerService, starService, carrierService, gameTypeService, gameStateService);
  const badgeService = new import_badge.default(userRepository, userService, playerService);
  const reportService = new import_report.default(import_Report.default, reportRepository, playerService);
  const ledgerService = new import_ledger.default(gameRepository, playerService, playerCreditsService);
  const reputationService = new import_reputation.default(gameRepository, playerStatisticsService, diplomacyService, playerAfkService);
  const tradeService = new import_trade.default(gameRepository, eventRepository, userService, playerService, diplomacyService, ledgerService, achievementService, reputationService, gameTypeService, randomService, playerCreditsService, playerAfkService);
  const conversationService = new import_conversation.default(gameRepository, tradeService, diplomacyService);
  const gameService = new import_game.default(gameRepository, userService, starService, carrierService, playerService, passwordService, achievementService, avatarService, gameTypeService, gameStateService, conversationService, playerReadyService);
  const gameJoinService = new import_gameJoin.default(userService, starService, playerService, passwordService, achievementService, avatarService, gameTypeService, gameStateService, conversationService, randomService, spectatorService);
  const leaderboardService = new import_leaderboard.default(userRepository, userService, playerService, playerAfkService, userLevelService, guildUserService, ratingService, gameService, gameTypeService, gameStateService, badgeService, playerStatisticsService);
  const researchService = new import_research.default(gameRepository, technologyService, randomService, playerStatisticsService, starService, userService, gameTypeService);
  const combatService = new import_combat.default(technologyService, specialistService, playerService, starService, reputationService, diplomacyService, gameTypeService);
  const waypointService = new import_waypoint.default(gameRepository, carrierService, starService, distanceService, starDistanceService, technologyService, gameService, playerService, carrierMovementService);
  const specialistBanService = new import_specialistBan.default(specialistService);
  const specialistHireService = new import_specialistHire.default(gameRepository, specialistService, achievementService, waypointService, playerCreditsService, starService, gameTypeService, specialistBanService, technologyService);
  const starUpgradeService = new import_starUpgrade.default(gameRepository, starService, carrierService, achievementService, researchService, technologyService, playerCreditsService, gameTypeService, shipService);
  const shipTransferService = new import_shipTransfer.default(gameRepository, carrierService, starService);
  const aiService = new import_ai.default(starUpgradeService, carrierService, starService, distanceService, waypointService, combatService, shipTransferService, technologyService, playerService, playerAfkService, reputationService, diplomacyService, playerStatisticsService, shipService);
  const historyService = new import_history.default(historyRepository, playerService, gameService, playerStatisticsService);
  const battleRoyaleService = new import_battleRoyale.default(starService, carrierService, mapService, starDistanceService, waypointService, carrierMovementService);
  const starMovementService = new import_starMovement.default(mapService, starDistanceService, specialistService, waypointService);
  const gameGalaxyService = new import_gameGalaxy.default(cacheService, broadcastService, gameService, mapService, playerService, playerAfkService, starService, shipService, distanceService, starDistanceService, starUpgradeService, carrierService, waypointService, researchService, specialistService, technologyService, reputationService, guildUserService, historyService, battleRoyaleService, starMovementService, gameTypeService, gameStateService, diplomacyService, avatarService, playerStatisticsService, gameFluxService, spectatorService);
  const gameTickService = new import_gameTick.default(distanceService, starService, carrierService, researchService, playerService, playerAfkService, historyService, waypointService, combatService, leaderboardService, userService, gameService, technologyService, specialistService, starUpgradeService, reputationService, aiService, battleRoyaleService, starMovementService, diplomacyService, gameTypeService, gameStateService, playerCycleRewardsService, diplomacyUpkeepService, carrierMovementService, carrierGiftService, starContestedService, playerReadyService, shipService);
  const emailService = new import_email.default(config, gameService, gameJoinService, userService, leaderboardService, playerService, playerReadyService, gameTypeService, gameStateService, gameTickService);
  const eventService = new import_event.default(
    import_Event.default,
    eventRepository,
    broadcastService,
    gameService,
    gameJoinService,
    gameTickService,
    researchService,
    starService,
    starUpgradeService,
    tradeService,
    ledgerService,
    conversationService,
    combatService,
    specialistService,
    badgeService,
    carrierGiftService,
    diplomacyService
  );
  const gameListService = new import_gameList.default(gameRepository, gameService, conversationService, eventService, gameTypeService, leaderboardService);
  const gameCreateValidationService = new import_gameCreateValidation.default(playerService, starService, carrierService, specialistService, gameTypeService);
  const gameCreateService = new import_gameCreate.default(import_Game.default, gameJoinService, gameListService, nameService, mapService, playerService, passwordService, conversationService, historyService, achievementService, userService, gameCreateValidationService, gameFluxService, specialistBanService, specialStarBanService, gameTypeService, starService);
  const notificationService = new import_notification.default(config, userRepository, gameRepository, discordService, conversationService, gameService, gameJoinService, gameTickService, researchService, tradeService);
  console.log("Dependency container initialized.");
  return {
    config,
    adminService,
    passwordService,
    authService,
    discordService,
    broadcastService,
    carrierService,
    combatService,
    distanceService,
    emailService,
    eventService,
    leaderboardService,
    gameService,
    gameJoinService,
    gameCreateValidationService,
    gameCreateService,
    gameGalaxyService,
    gameListService,
    gameTickService,
    gameTypeService,
    gameStateService,
    guildService,
    guildUserService,
    mapService,
    playerService,
    playerAfkService,
    userLevelService,
    playerReadyService,
    randomService,
    researchService,
    starService,
    starDistanceService,
    nameService,
    starUpgradeService,
    technologyService,
    tradeService,
    userService,
    waypointService,
    shipTransferService,
    historyService,
    ledgerService,
    specialistService,
    specialistBanService,
    specialistHireService,
    specialStarBanService,
    achievementService,
    conversationService,
    reputationService,
    aiService,
    battleRoyaleService,
    starMovementService,
    cacheService,
    recaptchaService,
    ratingService,
    diplomacyService,
    avatarService,
    paypalService,
    badgeService,
    reportService,
    playerStatisticsService,
    playerCreditsService,
    diplomacyUpkeepService,
    carrierGiftService,
    carrierMovementService,
    playerCycleRewardsService,
    starContestedService,
    gameFluxService,
    notificationService,
    shipService,
    spectatorService
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=index.js.map
