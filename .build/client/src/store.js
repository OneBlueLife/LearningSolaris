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
var store_exports = {};
__export(store_exports, {
  default: () => store_default
});
module.exports = __toCommonJS(store_exports);
var import_vue = __toESM(require("vue"));
var import_vuex = __toESM(require("vuex"));
var import_vuex_persist = __toESM(require("vuex-persist"));
var import_eventBus = __toESM(require("./eventBus"));
var import_gameHelper = __toESM(require("./services/gameHelper"));
var import_mentionHelper = __toESM(require("./services/mentionHelper"));
var import_container = __toESM(require("./game/container"));
var import_specialist = __toESM(require("./services/api/specialist"));
import_vue.default.use(import_vuex.default);
const vuexPersist = new import_vuex_persist.default({
  key: "solaris",
  storage: localStorage
});
var store_default = new import_vuex.default.Store({
  state: {
    userId: null,
    game: null,
    tick: 0,
    cachedConversationComposeMessages: {},
    currentConversation: null,
    starSpecialists: null,
    carrierSpecialists: null,
    settings: null,
    confirmationDialog: {}
  },
  mutations: {
    setMenuState(state, menuState) {
      menuState.state = menuState.state || null;
      menuState.args = menuState.args || null;
      if (menuState.state === state.menuState && menuState.args === state.menuArguments) {
        state.menuArguments = null;
        state.menuState = null;
      } else {
        state.menuArguments = menuState.args;
        state.menuState = menuState.state;
      }
      import_eventBus.default.$emit("onMenuRequested", menuState);
    },
    clearMenuState(state) {
      state.menuState = null;
      state.menuArguments = null;
      import_eventBus.default.$emit("onMenuRequested", {
        state: null,
        args: null
      });
    },
    setMenuStateChat(state, menuState) {
      menuState.state = menuState.state || null;
      menuState.args = menuState.args || null;
      state.menuArgumentsChat = menuState.args;
      state.menuStateChat = menuState.state;
    },
    clearMenuStateChat(state) {
      state.menuStateChat = null;
      state.menuArgumentsChat = null;
    },
    setTutorialPage(state, page) {
      state.tutorialPage = page || 0;
    },
    clearTutorialPage(state) {
      state.tutorialPage = 0;
    },
    setCarrierSpecialists(state, carrierSpecialists) {
      state.carrierSpecialists = carrierSpecialists;
    },
    setStarSpecialists(state, starSpecialists) {
      state.starSpecialists = starSpecialists;
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
    clearUserId(state) {
      state.userId = null;
    },
    setUsername(state, username) {
      state.username = username;
    },
    clearUsername(state) {
      state.username = null;
    },
    setRoles(state, roles) {
      state.roles = roles;
    },
    clearRoles(state) {
      state.roles = null;
    },
    setUserCredits(state, credits) {
      state.userCredits = credits;
    },
    clearUserCredits(state) {
      state.userCredits = null;
    },
    setUserIsEstablishedPlayer(state, isEstablishedPlayer) {
      state.userIsEstablishedPlayer = isEstablishedPlayer;
    },
    clearUserIsEstablishedPlayer(state) {
      state.userIsEstablishedPlayer = null;
    },
    setTick(state, tick) {
      state.tick = tick;
    },
    setProductionTick(state, tick) {
      state.productionTick = tick;
    },
    setGame(state, game) {
      state.game = game;
    },
    clearGame(state) {
      state.game = null;
      state.cachedConversationComposeMessages = {};
      state.currentConversation = null;
    },
    setSettings(state, settings) {
      state.settings = settings;
    },
    clearSettings(state) {
      state.settings = null;
    },
    setConfirmationDialogSettings(state, settings) {
      state.confirmationDialog = settings;
    },
    setUnreadMessages(state, count) {
      state.unreadMessages = count;
    },
    clearUnreadMessages(state) {
      state.unreadMessages = null;
    },
    openConversation(state, data) {
      state.currentConversation = {
        id: data,
        element: null,
        text: state.cachedConversationComposeMessages[data]
      };
    },
    closeConversation(state) {
      if (state.currentConversation) {
        const id = state.currentConversation.id;
        state.cachedConversationComposeMessages[id] = state.currentConversation.text;
        state.currentConversation = null;
      }
    },
    updateCurrentConversationText(state, data) {
      state.currentConversation.text = data;
    },
    resetCurrentConversationText(state, data) {
      state.currentConversation.text = "";
    },
    setConversationElement(state, data) {
      state.currentConversation.element = data;
    },
    playerClicked(state, data) {
      if (state.currentConversation) {
        import_mentionHelper.default.addMention(state.currentConversation, "player", data.player.alias);
      } else {
        data.permitCallback(data.player);
      }
    },
    starClicked(state, data) {
      if (state.currentConversation) {
        import_mentionHelper.default.addMention(state.currentConversation, "star", data.star.name);
      } else {
        data.permitCallback(data.star);
      }
    },
    starRightClicked(state, data) {
      if (state.currentConversation && data.player) {
        import_mentionHelper.default.addMention(state.currentConversation, "player", data.player.alias);
      } else {
        data.permitCallback(data.star);
      }
    },
    replaceInConversationText(state, data) {
      import_mentionHelper.default.useSuggestion(state.currentConversation, data);
    },
    gameStarted(state, data) {
      state.game.state = data.state;
    },
    gamePlayerJoined(state, data) {
      let player = import_gameHelper.default.getPlayerById(state.game, data.playerId);
      player.isOpenSlot = false;
      player.alias = data.alias;
      player.avatar = data.avatar;
      player.defeated = false;
      player.defeatedDate = null;
      player.afk = false;
    },
    gamePlayerQuit(state, data) {
      let player = import_gameHelper.default.getPlayerById(state.game, data.playerId);
      player.isOpenSlot = true;
      player.alias = "Empty Slot";
      player.avatar = null;
    },
    gamePlayerReady(state, data) {
      let player = import_gameHelper.default.getPlayerById(state.game, data.playerId);
      player.ready = true;
    },
    gamePlayerNotReady(state, data) {
      let player = import_gameHelper.default.getPlayerById(state.game, data.playerId);
      player.ready = false;
    },
    gamePlayerReadyToQuit(state, data) {
      let player = import_gameHelper.default.getPlayerById(state.game, data.playerId);
      player.readyToQuit = true;
    },
    gamePlayerNotReadyToQuit(state, data) {
      let player = import_gameHelper.default.getPlayerById(state.game, data.playerId);
      player.readyToQuit = false;
    },
    gameStarBulkUpgraded(state, data) {
      let player = import_gameHelper.default.getUserPlayer(state.game);
      data.stars.forEach((s) => {
        let star = import_gameHelper.default.getStarById(state.game, s.starId);
        star.infrastructure[data.infrastructureType] = s.infrastructure;
        if (star.upgradeCosts && s.infrastructureCost) {
          star.upgradeCosts[data.infrastructureType] = s.infrastructureCost;
        }
        if (s.manufacturing != null) {
          player.stats.newShips -= star.manufacturing;
          star.manufacturing = s.manufacturing;
          player.stats.newShips += s.manufacturing;
        }
        import_container.default.reloadStar(star);
      });
      player.credits -= data.cost;
      player.stats.newShips = Math.round((player.stats.newShips + Number.EPSILON) * 100) / 100;
      if (data.currentResearchTicksEta) {
        player.currentResearchTicksEta = data.currentResearchTicksEta;
      }
      if (data.nextResearchTicksEta) {
        player.nextResearchTicksEta = data.nextResearchTicksEta;
      }
      switch (data.infrastructureType) {
        case "economy":
          player.stats.totalEconomy += data.upgraded;
          break;
        case "industry":
          player.stats.totalIndustry += data.upgraded;
          break;
        case "science":
          player.stats.totalScience += data.upgraded;
          break;
      }
    },
    gameStarWarpGateBuilt(state, data) {
      let star = import_gameHelper.default.getStarById(state.game, data.starId);
      star.warpGate = true;
      import_gameHelper.default.getUserPlayer(state.game).credits -= data.cost;
      import_container.default.reloadStar(star);
    },
    gameStarWarpGateDestroyed(state, data) {
      let star = import_gameHelper.default.getStarById(state.game, data.starId);
      star.warpGate = false;
      import_container.default.reloadStar(star);
    },
    gameStarCarrierBuilt(state, data) {
      let carrier = import_gameHelper.default.getCarrierById(state.game, data.carrier._id);
      if (!carrier) {
        state.game.galaxy.carriers.push(data.carrier);
      }
      let star = import_gameHelper.default.getStarById(state.game, data.carrier.orbiting);
      star.ships = data.starShips;
      let userPlayer = import_gameHelper.default.getUserPlayer(state.game);
      userPlayer.credits -= star.upgradeCosts.carriers;
      userPlayer.stats.totalCarriers++;
      import_container.default.reloadStar(star);
      import_container.default.reloadCarrier(data.carrier);
    },
    gameStarCarrierShipTransferred(state, data) {
      let star = import_gameHelper.default.getStarById(state.game, data.starId);
      let carrier = import_gameHelper.default.getCarrierById(state.game, data.carrierId);
      star.ships = data.starShips;
      carrier.ships = data.carrierShips;
      import_container.default.reloadStar(star);
      import_container.default.reloadCarrier(carrier);
    },
    gameStarAllShipsTransferred(state, data) {
      let star = import_gameHelper.default.getStarById(state.game, data.star._id);
      star.ships = data.star.ships;
      data.carriers.forEach((carrier) => {
        let mapObjectCarrier = import_gameHelper.default.getCarrierById(state.game, carrier._id);
        mapObjectCarrier.ships = carrier.ships;
      });
    },
    gameStarAbandoned(state, data) {
      let star = import_gameHelper.default.getStarById(state.game, data.starId);
      let player = import_gameHelper.default.getPlayerById(state.game, star.ownedByPlayerId);
      player.stats.totalStars--;
      star.ownedByPlayerId = null;
      star.ships = 0;
      let carriers = state.game.galaxy.carriers.filter((x) => x.orbiting && x.orbiting === star._id && x.ownedByPlayerId === player._id);
      carriers.forEach((c) => {
        import_container.default.undrawCarrier(c);
        state.game.galaxy.carriers.splice(state.game.galaxy.carriers.indexOf(c), 1);
      });
      import_container.default.reloadStar(star);
    },
    gameCarrierScuttled(state, data) {
      let carrier = import_gameHelper.default.getCarrierById(state.game, data.carrierId);
      let star = import_gameHelper.default.getStarById(state.game, carrier.orbiting);
      let player = import_gameHelper.default.getPlayerById(state.game, carrier.ownedByPlayerId);
      player.stats.totalCarriers--;
      if (carrier.specialistId) {
        player.stats.totalSpecialists--;
      }
      import_container.default.undrawCarrier(carrier);
      state.game.galaxy.carriers.splice(state.game.galaxy.carriers.indexOf(carrier), 1);
      if (star) {
        import_container.default.reloadStar(star);
      }
    },
    playerDebtSettled(state, data) {
      let player = import_gameHelper.default.getUserPlayer(state.game);
      if (data.creditorPlayerId === player._id) {
        if (data.ledgerType === "credits") {
          player.credits += data.amount;
        } else {
          player.creditsSpecialists += data.amount;
        }
      }
    },
    starSpecialistHired(state, data) {
      let star = import_gameHelper.default.getStarById(state.game, data.starId);
      star.specialistId = data.specialist.id;
      star.specialist = data.specialist;
      import_container.default.reloadStar(star);
    },
    carrierSpecialistHired(state, data) {
      let carrier = import_gameHelper.default.getCarrierById(state.game, data.carrierId);
      carrier.specialistId = data.specialist.id;
      carrier.specialist = data.specialist;
      import_container.default.reloadCarrier(carrier);
    },
    gameStarEconomyUpgraded(state, data) {
      data.type = "economy";
      let star = import_gameHelper.default.starInfrastructureUpgraded(state.game, data);
      import_container.default.reloadStar(star);
    },
    gameStarIndustryUpgraded(state, data) {
      data.type = "industry";
      let star = import_gameHelper.default.starInfrastructureUpgraded(state.game, data);
      import_container.default.reloadStar(star);
    },
    gameStarScienceUpgraded(state, data) {
      data.type = "science";
      let star = import_gameHelper.default.starInfrastructureUpgraded(state.game, data);
      import_container.default.reloadStar(star);
    }
  },
  actions: {
    async loadSpecialistData({ commit, state }) {
      const gameId = state.game._id;
      let requests = [
        import_specialist.default.getCarrierSpecialists(gameId),
        import_specialist.default.getStarSpecialists(gameId)
      ];
      const responses = await Promise.all(requests);
      commit("setCarrierSpecialists", responses[0].data);
      commit("setStarSpecialists", responses[1].data);
    },
    async confirm({ commit, state }, data) {
      const modal = new bootstrap.Modal(window.$("#confirmModal"), {});
      const close = async () => {
        modal.toggle();
        await new Promise((resolve, reject) => setTimeout(resolve, 400));
      };
      return new Promise((resolve, reject) => {
        const settings = {
          confirmText: data.confirmText || "Yes",
          cancelText: data.cancelText || "No",
          hideCancelButton: Boolean(data.hideCancelButton),
          cover: Boolean(data.cover),
          titleText: data.titleText,
          text: data.text,
          onConfirm: async () => {
            await close();
            resolve(true);
          },
          onCancel: async () => {
            await close();
            resolve(false);
          }
        };
        commit("setConfirmationDialogSettings", settings);
        modal.toggle();
      });
    }
  },
  getters: {
    getConversationMessage: (state) => (conversationId) => {
      return state.cachedConversationComposeMessages[conversationId] || "";
    }
  },
  plugins: [vuexPersist.plugin]
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=store.js.map
