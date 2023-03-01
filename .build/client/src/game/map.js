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
var map_exports = {};
__export(map_exports, {
  default: () => map_default
});
module.exports = __toCommonJS(map_exports);
var PIXI = __toESM(require("pixi.js-legacy"));
var import_background = __toESM(require("./background"));
var import_star = __toESM(require("./star"));
var import_carrier = __toESM(require("./carrier"));
var import_waypoints = __toESM(require("./waypoints"));
var import_rulerPoints = __toESM(require("./rulerPoints"));
var import_territories = __toESM(require("./territories"));
var import_playerNames = __toESM(require("./playerNames"));
var import_events = __toESM(require("events"));
var import_gameHelper = __toESM(require("../services/gameHelper"));
var import_animation = __toESM(require("./animation"));
var import_PathManager = __toESM(require("./PathManager"));
var import_orbital = __toESM(require("./orbital"));
var import_wormHole = __toESM(require("./wormHole"));
var import_tooltip = __toESM(require("./tooltip"));
class Map extends import_events.default {
  static chunkSize = 256;
  mode = "galaxy";
  constructor(app, store, gameContainer) {
    super();
    this.app = app;
    this.store = store;
    this.gameContainer = gameContainer;
    this.container = new PIXI.Container();
    this.container.sortableChildren = true;
    this.stars = [];
    this.carriers = [];
    this.zoomPercent = 0;
    this.minMouseChunkX = 0;
    this.maxMouseChunkX = 0;
    this.minMouseChunkY = 0;
    this.maxMouseChunkY = 0;
    this.zoomPercent = 100;
    this.lastZoomPercent = 100;
  }
  _setupContainers() {
    this.chunksContainer = new PIXI.Container();
    this.backgroundContainer = new PIXI.Container();
    this.territoryContainer = new PIXI.Container();
    this.playerNamesContainer = new PIXI.Container();
    this.orbitalContainer = new PIXI.Container();
    this.wormHoleContainer = new PIXI.Container();
    this.starContainer = new PIXI.Container();
    this.carrierContainer = new PIXI.Container();
    this.waypointContainer = new PIXI.Container();
    this.rulerPointContainer = new PIXI.Container();
    this.highlightLocationsContainer = new PIXI.Container();
    this.tooltipContainer = new PIXI.Container();
    this.container.addChild(this.backgroundContainer);
    this.container.addChild(this.territoryContainer);
    this.container.addChild(this.wormHoleContainer);
    this.container.addChild(this.pathManager.container);
    this.container.addChild(this.rulerPointContainer);
    this.container.addChild(this.waypointContainer);
    this.container.addChild(this.chunksContainer);
    this.container.addChild(this.orbitalContainer);
    this.container.addChild(this.starContainer);
    this.container.addChild(this.carrierContainer);
    this.container.addChild(this.highlightLocationsContainer);
    this.container.addChild(this.playerNamesContainer);
    this.container.addChild(this.tooltipContainer);
  }
  setup(game, userSettings) {
    this.userSettings = userSettings;
    this.game = game;
    this.pathManager = new import_PathManager.default(game, userSettings, this);
    this.stars.forEach((s) => s.removeAllListeners());
    this.carriers.forEach((s) => s.removeAllListeners());
    this.container.removeChildren();
    this._setupContainers();
    this.stars = [];
    this.carriers = [];
    for (let i = 0; i < game.galaxy.stars.length; i++) {
      this.setupStar(game, userSettings, game.galaxy.stars[i]);
    }
    for (let i = 0; i < game.galaxy.carriers.length; i++) {
      this.setupCarrier(game, userSettings, game.galaxy.carriers[i]);
    }
    if (this.waypoints) {
      this.waypoints.removeAllListeners();
    }
    this.waypoints = new import_waypoints.default();
    this.waypoints.setup(game);
    this.waypoints.onWaypointCreatedHandler = this.waypoints.on("onWaypointCreated", this.onWaypointCreated.bind(this));
    this.waypoints.onWaypointOutOfRangeHandler = this.waypoints.on("onWaypointOutOfRange", this.onWaypointOutOfRange.bind(this));
    this.waypointContainer.addChild(this.waypoints.container);
    if (this.rulerPoints) {
      this.rulerPoints.removeAllListeners();
    }
    this.rulerPoints = new import_rulerPoints.default();
    this.rulerPoints.setup(game);
    this.rulerPoints.onRulerPointCreatedHandler = this.rulerPoints.on("onRulerPointCreated", this.onRulerPointCreated.bind(this));
    this.rulerPoints.onRulerPointsClearedHandler = this.rulerPoints.on("onRulerPointsCleared", this.onRulerPointsCleared.bind(this));
    this.rulerPoints.onRulerPointRemovedHandler = this.rulerPoints.on("onRulerPointRemoved", this.onRulerPointRemoved.bind(this));
    this.rulerPointContainer.addChild(this.rulerPoints.container);
    this.territories = new import_territories.default();
    this.territories.setup(game, userSettings);
    this.territoryContainer.addChild(this.territories.container);
    this.territories.draw(userSettings);
    this.playerNames = new import_playerNames.default();
    this.playerNames.setup(game, userSettings);
    this.playerNamesContainer.addChild(this.playerNames.container);
    this.playerNames.draw();
    this.background = new import_background.default();
    this.background.setup(game, userSettings);
    this.backgroundContainer.addChild(this.background.container);
    this.backgroundContainer.addChild(this.background.starContainer);
    this.background.draw();
    if (this._isWormHolesEnabled()) {
      this.wormHoleLayer = new import_wormHole.default();
      this.drawWormHoles();
      this.wormHoleContainer.addChild(this.wormHoleLayer.container);
    }
    if (this._isOrbitalMapEnabled()) {
      this.orbitalLayer = new import_orbital.default();
      this.orbitalLayer.setup(game);
      this.orbitalContainer.addChild(this.orbitalLayer.container);
    }
    this._setupChunks();
    this.tooltipLayer = new import_tooltip.default();
    this.tooltipLayer.setup(this.game);
    this.tooltipContainer.addChild(this.tooltipLayer.container);
  }
  setupStar(game, userSettings, starData) {
    let star = this.stars.find((x) => x.data._id === starData._id);
    if (!star) {
      star = new import_star.default(this.app);
      this.stars.push(star);
      this.starContainer.addChild(star.fixedContainer);
      star.on("onStarClicked", this.onStarClicked.bind(this));
      star.on("onStarRightClicked", this.onStarRightClicked.bind(this));
      star.on("onStarMouseOver", this.onStarMouseOver.bind(this));
      star.on("onStarMouseOut", this.onStarMouseOut.bind(this));
      star.on("onSelected", this.onStarSelected.bind(this));
      star.on("onUnselected", this.onStarUnselected.bind(this));
    }
    star.setup(this.game, starData, userSettings, game.galaxy.players, game.galaxy.carriers, game.constants.distances.lightYear);
    return star;
  }
  setupCarrier(game, userSettings, carrierData) {
    let carrier = this.carriers.find((x) => x.data._id === carrierData._id);
    if (!carrier) {
      carrier = new import_carrier.default(this.pathManager);
      this.carriers.push(carrier);
      this.carrierContainer.addChild(carrier.fixedContainer);
      carrier.on("onCarrierClicked", this.onCarrierClicked.bind(this));
      carrier.on("onCarrierRightClicked", this.onCarrierRightClicked.bind(this));
      carrier.on("onCarrierMouseOver", this.onCarrierMouseOver.bind(this));
      carrier.on("onCarrierMouseOut", this.onCarrierMouseOut.bind(this));
      carrier.on("onSelected", this.onCarrierSelected.bind(this));
      carrier.on("onUnselected", this.onCarrierUnselected.bind(this));
    }
    let player = import_gameHelper.default.getPlayerById(game, carrierData.ownedByPlayerId);
    carrier.setup(carrierData, userSettings, this.stars, player, game.constants.distances.lightYear);
    return carrier;
  }
  draw() {
    this.drawGalaxyCenter();
    if (this.mode === "waypoints") {
      this.drawWaypoints();
    } else {
      this.drawStars();
      this.drawCarriers();
      this.clearWaypoints();
    }
    if (this.mode === "ruler") {
      this.drawRulerPoints();
    } else {
      this.clearRulerPoints();
    }
  }
  drawGalaxyCenter() {
    if (this._isOrbitalMapEnabled() && this.game.constants.distances.galaxyCenterLocation) {
      let galaxyCenterGraphics = new PIXI.Graphics();
      let location = this.game.constants.distances.galaxyCenterLocation;
      let size = 10;
      galaxyCenterGraphics.lineStyle(2, 16777215, 1);
      galaxyCenterGraphics.moveTo(location.x, location.y - size);
      galaxyCenterGraphics.lineTo(location.x, location.y + size);
      galaxyCenterGraphics.moveTo(location.x - size, location.y);
      galaxyCenterGraphics.lineTo(location.x + size, location.y);
      galaxyCenterGraphics.alpha = 0.75;
      this.starContainer.addChild(galaxyCenterGraphics);
    }
  }
  _isOrbitalMapEnabled() {
    return this.game.constants.distances.galaxyCenterLocation && this.game.settings.orbitalMechanics.enabled === "enabled";
  }
  _isWormHolesEnabled() {
    return this.game.settings.specialGalaxy.randomWormHoles || this.game.galaxy.stars.find((s) => s.wormHoleToStarId);
  }
  _setupChunks() {
    if (this.chunksContainer) {
      this.chunksContainer.removeChildren();
    }
    let carrierMinX = import_gameHelper.default.calculateMinCarrierX(this.game);
    let carrierMinY = import_gameHelper.default.calculateMinCarrierY(this.game);
    let carrierMaxX = import_gameHelper.default.calculateMaxCarrierX(this.game);
    let carrierMaxY = import_gameHelper.default.calculateMaxCarrierY(this.game);
    let starMinX = import_gameHelper.default.calculateMinStarX(this.game);
    let starMinY = import_gameHelper.default.calculateMinStarY(this.game);
    let starMaxX = import_gameHelper.default.calculateMaxStarX(this.game);
    let starMaxY = import_gameHelper.default.calculateMaxStarY(this.game);
    let minX = Math.min(carrierMinX, starMinX);
    let minY = Math.min(carrierMinY, starMinY);
    let maxX = Math.max(carrierMaxX, starMaxX);
    let maxY = Math.max(carrierMaxY, starMaxY);
    this.firstChunkX = Math.floor(minX / Map.chunkSize);
    this.firstChunkY = Math.floor(minY / Map.chunkSize);
    this.lastChunkX = Math.floor(maxX / Map.chunkSize);
    this.lastChunkY = Math.floor(maxY / Map.chunkSize);
    this.numof_chunkX = this.lastChunkX - this.firstChunkX + 1;
    this.numof_chunkY = this.lastChunkY - this.firstChunkY + 1;
    let chunkColumns = Array(this.numof_chunkX);
    for (let i = 0; i < this.numof_chunkX; i++) {
      chunkColumns[i] = Array(this.numof_chunkY);
    }
    this.chunks = chunkColumns;
    for (let ix = 0; ix < this.numof_chunkX; ix++) {
      for (let iy = 0; iy < this.numof_chunkY; iy++) {
        this.chunks[ix][iy] = new PIXI.Container();
        this.chunksContainer.addChild(this.chunks[ix][iy]);
        this.chunks[ix][iy].mapObjects = Array();
        if (false) {
          let chunkVisualizer = new PIXI.Graphics();
          chunkVisualizer.alpha = 0.5;
          chunkVisualizer.lineStyle(4, 16711680, 1);
          chunkVisualizer.beginFill(14561865);
          chunkVisualizer.drawRect(
            (this.firstChunkX + ix) * Map.chunkSize,
            (this.firstChunkY + iy) * Map.chunkSize,
            Map.chunkSize,
            Map.chunkSize
          );
          chunkVisualizer.endFill();
          this.chunks[ix][iy].addChild(chunkVisualizer);
          this.chunks[ix][iy].visualizer = chunkVisualizer;
        }
      }
    }
    this.stars.forEach((s) => this.addContainerToChunk(s, this.chunks, this.firstChunkX, this.firstChunkY));
    this.carriers.forEach((c) => this.addContainerToChunk(c, this.chunks, this.firstChunkX, this.firstChunkY));
  }
  addContainerToChunk(mapObject, chunks, firstX, firstY) {
    let chunkX = Math.floor(mapObject.data.location.x / Map.chunkSize);
    let chunkY = Math.floor(mapObject.data.location.y / Map.chunkSize);
    let ix = chunkX - firstX;
    let iy = chunkY - firstY;
    chunks[ix][iy].addChild(mapObject.container);
    chunks[ix][iy].mapObjects.push(mapObject);
  }
  removeContainerFromChunk(mapObject, chunks, firstX, firstY) {
    let chunkX = Math.floor(mapObject.data.location.x / Map.chunkSize);
    let chunkY = Math.floor(mapObject.data.location.y / Map.chunkSize);
    let ix = chunkX - firstX;
    let iy = chunkY - firstY;
    chunks[ix][iy].removeChild(mapObject.container);
    let index = chunks[ix][iy].mapObjects.indexOf(mapObject);
    if (index > -1) {
      chunks[ix][iy].mapObjects.splice(index, 1);
    }
  }
  removeMapObjectFromChunks(mapObject, chunks) {
    for (let chunkX of chunks) {
      for (let chunkY of chunkX) {
        if (chunkY.mapObjects.indexOf(mapObject) > -1) {
          chunkY.mapObjects.splice(chunkY.mapObjects.indexOf(mapObject), 1);
          chunkY.removeChild(mapObject.container);
        }
      }
    }
  }
  reloadGame(game, userSettings) {
    this.game = game;
    this.pathManager.setup(game, userSettings);
    for (let i = 0; i < this.stars.length; i++) {
      let star = this.stars[i];
      let gameStar = import_gameHelper.default.getStarById(game, star.data._id);
      if (!gameStar) {
        this._undrawStar(star);
        i--;
      }
    }
    for (let i = 0; i < this.carriers.length; i++) {
      let carrier = this.carriers[i];
      let gameCarrier = import_gameHelper.default.getCarrierById(game, carrier.data._id);
      if (!gameCarrier) {
        this._undrawCarrier(carrier);
        i--;
      }
    }
    for (let i = 0; i < game.galaxy.stars.length; i++) {
      let starData = game.galaxy.stars[i];
      let existing = this.stars.find((x) => x.data._id === starData._id);
      if (existing) {
        existing.setup(this.game, starData, userSettings, game.galaxy.players, game.galaxy.carriers, game.constants.distances.lightYear);
      } else {
        existing = this.setupStar(game, userSettings, starData);
      }
      this.drawStar(existing);
    }
    for (let i = 0; i < game.galaxy.carriers.length; i++) {
      let carrierData = game.galaxy.carriers[i];
      let existing = this.carriers.find((x) => x.data._id === carrierData._id);
      if (existing) {
        let player = import_gameHelper.default.getPlayerById(game, carrierData.ownedByPlayerId);
        existing.setup(carrierData, userSettings, this.stars, player, game.constants.distances.lightYear);
      } else {
        existing = this.setupCarrier(game, userSettings, carrierData);
      }
      this.drawCarrier(existing);
    }
    this.drawTerritories(userSettings);
    this.drawWormHoles();
    this.drawPlayerNames();
    this.background.setup(game, userSettings);
    this.background.draw(game, userSettings);
    this.waypoints.setup(game);
    this.tooltipLayer.setup(game);
    this._setupChunks();
  }
  _disableCarriersInteractivity() {
    for (let i = 0; i < this.carriers.length; i++) {
      let c = this.carriers[i];
      c.disableInteractivity();
    }
  }
  _enableCarriersInteractivity() {
    for (let i = 0; i < this.carriers.length; i++) {
      let c = this.carriers[i];
      c.enableInteractivity();
    }
  }
  setMode(mode, args) {
    let wasWaypoints = this.mode === "waypoints";
    this.mode = mode;
    this.modeArgs = args;
    this.unselectAllCarriers();
    this.unselectAllStars();
    this.clearWaypoints();
    this.clearRulerPoints();
    if (this.mode === "waypoints") {
      this._disableCarriersInteractivity();
      this.drawWaypoints();
    }
    if (wasWaypoints) {
      this._enableCarriersInteractivity();
    }
    if (this.mode === "ruler") {
      this.drawRulerPoints();
    }
  }
  resetMode() {
    this.setMode("galaxy", this.modeArgs);
  }
  removeLastRulerPoint() {
    this.rulerPoints.removeLastRulerPoint();
  }
  drawStars() {
    for (let i = 0; i < this.stars.length; i++) {
      let star = this.stars[i];
      this.drawStar(star);
    }
  }
  drawStar(star) {
    star.draw();
    star.onZoomChanging(this.zoomPercent);
  }
  _undrawStar(star) {
    star.off("onStarClicked", this.onStarClicked.bind(this));
    star.off("onStarRightClicked", this.onStarRightClicked.bind(this));
    this.starContainer.removeChild(star.fixedContainer);
    this.removeMapObjectFromChunks(star, this.chunks);
    this.stars.splice(this.stars.indexOf(star), 1);
    star.destroy();
  }
  drawCarriers() {
    for (let i = 0; i < this.carriers.length; i++) {
      let carrier = this.carriers[i];
      this.drawCarrier(carrier);
    }
  }
  drawCarrier(carrier) {
    carrier.draw();
    carrier.onZoomChanging(this.zoomPercent);
  }
  _undrawCarrier(carrier) {
    carrier.removeAllListeners();
    carrier.cleanupEventHandlers();
    carrier.clearPaths();
    this.carrierContainer.removeChild(carrier.fixedContainer);
    this.removeMapObjectFromChunks(carrier, this.chunks);
    this.carriers.splice(this.carriers.indexOf(carrier), 1);
    carrier.destroy();
  }
  undrawCarrier(carrierData) {
    let existing = this.carriers.find((x) => x.data._id === carrierData._id);
    if (existing) {
      this._undrawCarrier(existing);
    }
  }
  drawWaypoints() {
    this.waypoints.draw(this.modeArgs);
    for (let i = 0; i < this.carriers.length; i++) {
      let c = this.carriers[i];
      c.drawCarrierWaypoints();
    }
  }
  clearWaypoints() {
    this.waypoints.clear();
  }
  drawRulerPoints() {
    this.rulerPoints.draw(this.modeArgs);
  }
  clearRulerPoints() {
    this.rulerPoints.setup(this.game);
  }
  drawTerritories(userSettings) {
    this.territories.setup(this.game, userSettings);
    this.territories.draw(userSettings);
  }
  drawWormHoles() {
    if (this._isWormHolesEnabled()) {
      this.wormHoleLayer.setup(this.game);
      this.wormHoleLayer.draw();
    }
  }
  drawPlayerNames() {
    this.playerNames.setup(this.game, this.userSettings);
    this.playerNames.draw(this.userSettings);
  }
  panToPlayer(game, player) {
    let empireCenter = import_gameHelper.default.getPlayerEmpireCenter(game, player);
    if (!empireCenter) {
      return;
    }
    this.gameContainer.viewport.moveCenter(empireCenter.x, empireCenter.y);
    let zoomPercent = this.gameContainer.getViewportZoomPercentage();
    this.refreshZoom(zoomPercent);
  }
  panToUser(game) {
    let player = import_gameHelper.default.getUserPlayer(game);
    if (!player) {
      this.panToLocation({ x: 0, y: 0 });
      return;
    }
    this.panToPlayer(game, player);
  }
  panToStar(star) {
    this.panToLocation(star.location);
  }
  panToCarrier(carrier) {
    this.panToLocation(carrier.location);
  }
  panToLocation(location) {
    this.gameContainer.viewport.moveCenter(location.x, location.y);
  }
  clickStar(starId) {
    let star = this.stars.find((s) => s.data._id === starId);
    star.onClicked();
    star.select();
  }
  clickCarrier(carrierId) {
    let carrier = this.carriers.find((s) => s.data._id === carrierId);
    carrier.onClicked();
    carrier.select();
  }
  unselectAllStars() {
    for (let i = 0; i < this.stars.length; i++) {
      let s = this.stars[i];
      s.unselect();
    }
  }
  unselectAllCarriers() {
    for (let i = 0; i < this.carriers.length; i++) {
      let c = this.carriers[i];
      c.unselect();
    }
  }
  unselectAllStarsExcept(star) {
    this.stars.filter((s) => s.isSelected || s.data._id === star.data._id).forEach((s) => {
      if (s.data._id !== star.data._id) {
        s.unselect();
      }
    });
  }
  unselectAllCarriersExcept(carrier) {
    this.carriers.filter((c) => c.isSelected || c.data._id === carrier.data._id).forEach((c) => {
      if (c.data._id !== carrier.data._id) {
        c.unselect();
      }
    });
  }
  onTick(deltaTime) {
    let viewportWidth = this.gameContainer.viewport.right - this.gameContainer.viewport.left;
    let viewportHeight = this.gameContainer.viewport.bottom - this.gameContainer.viewport.top;
    let viewportXRadius = viewportWidth / 2;
    let viewportYRadius = viewportHeight / 2;
    let viewportCenter = this.gameContainer.viewport.center;
    this.lastViewportCenter = this.currentViewportCenter || null;
    this.currentViewportCenter = this.gameContainer.viewport.center;
    this.zoomPercent = this.gameContainer.viewport.screenWidth / viewportWidth * 100;
    let viewportData = {
      center: viewportCenter,
      xradius: viewportXRadius,
      yradius: viewportYRadius
    };
    let firstX = Math.floor(this.gameContainer.viewport.left / Map.chunkSize);
    let firstY = Math.floor(this.gameContainer.viewport.top / Map.chunkSize);
    let lastX = Math.floor(this.gameContainer.viewport.right / Map.chunkSize);
    let lastY = Math.floor(this.gameContainer.viewport.bottom / Map.chunkSize);
    let positionChanging = this.lastViewportCenter == null || this.currentViewportCenter.x !== this.lastViewportCenter.x || this.currentViewportCenter.y !== this.lastViewportCenter.y;
    let zoomChanging = Math.abs(this.zoomPercent - this.lastZoomPercent) > 1 / 128;
    if (!positionChanging && !zoomChanging) {
      return;
    }
    for (let ix = 0; ix < this.numof_chunkX; ix++) {
      for (let iy = 0; iy < this.numof_chunkY; iy++) {
        if (ix >= firstX - this.firstChunkX && ix <= lastX - this.firstChunkX && iy >= firstY - this.firstChunkY && iy <= lastY - this.firstChunkY) {
          if (!this.chunks[ix][iy].visible) {
            this.chunks[ix][iy].visible = true;
            this.chunks[ix][iy].interactiveChildren = true;
            for (let mapObject of this.chunks[ix][iy].mapObjects) {
              mapObject.onZoomChanging(this.zoomPercent);
            }
          } else {
            if (zoomChanging) {
              for (let mapObject of this.chunks[ix][iy].mapObjects) {
                mapObject.onZoomChanging(this.zoomPercent);
              }
            }
          }
        } else {
          this.chunks[ix][iy].visible = false;
          this.chunks[ix][iy].interactiveChildren = false;
        }
      }
    }
    this.pathManager.onTick(this.zoomPercent, this.gameContainer.viewport, zoomChanging);
    this.background.onTick(deltaTime, viewportData);
    this.playerNames.onTick(this.zoomPercent, zoomChanging);
    this.lastZoomPercent = this.zoomPercent;
  }
  onViewportPointerDown(e) {
    this.lastPointerDownPosition = Object.assign({}, e.data.global);
  }
  isDragMotion(position) {
    let DRAG_THRESHOLD = 8;
    let dxSquared = Math.pow(Math.abs(this.lastPointerDownPosition.x - position.x), 2);
    let dySquared = Math.pow(Math.abs(this.lastPointerDownPosition.y - position.y), 2);
    let distance = Math.sqrt(dxSquared + dySquared);
    return distance > DRAG_THRESHOLD;
  }
  onStarClicked(dic) {
    let e = dic.starData;
    if (dic.eventData && this.isDragMotion(dic.eventData.global)) {
      return;
    }
    this.store.commit("starClicked", {
      star: dic.starData,
      permitCallback: () => {
        dic.permitCallback && dic.permitCallback();
        if (this.mode === "galaxy") {
          let selectedStar = this.stars.find((x) => x.data._id === e._id);
          this.unselectAllCarriers();
          this.unselectAllStarsExcept(selectedStar);
          if (!this.tryMultiSelect(e.location)) {
            selectedStar.toggleSelected();
            this.emit("onStarClicked", e);
          }
        } else if (this.mode === "waypoints") {
          this.waypoints.onStarClicked(e);
        } else if (this.mode === "ruler") {
          this.rulerPoints.onStarClicked(e);
        }
        import_animation.default.drawSelectedCircle(this.app, this.container, e.location);
      }
    });
  }
  onStarRightClicked(dic) {
    let e = dic.starData;
    if (dic.eventData && this.isDragMotion(dic.eventData.global)) {
      return;
    }
    let owningPlayer = import_gameHelper.default.getStarOwningPlayer(this.game, dic.starData);
    this.store.commit("starRightClicked", {
      star: dic.starData,
      player: owningPlayer,
      permitCallback: () => {
        dic.permitCallback && dic.permitCallback();
        if (this.mode === "galaxy") {
          this.emit("onStarRightClicked", e);
        }
      }
    });
  }
  onCarrierClicked(dic) {
    if (dic.eventData && this.isDragMotion(dic.eventData.global)) {
      return;
    }
    let e = dic.carrierData;
    if (this.mode === "galaxy") {
      if (e.orbiting) {
        let star = this.stars.find((x) => x.data._id === e.orbiting);
        let eventData = dic ? dic.eventData : null;
        return this.onStarClicked({ starData: star.data, eventData });
      }
      let selectedCarrier = this.carriers.find((x) => x.data._id === e._id);
      this.unselectAllStars();
      this.unselectAllCarriersExcept(selectedCarrier);
      selectedCarrier.toggleSelected();
      if (!this.tryMultiSelect(e.location)) {
        this.emit("onCarrierClicked", e);
      } else {
        selectedCarrier.unselect();
      }
    } else if (this.mode === "ruler") {
      this.rulerPoints.onCarrierClicked(e);
    }
    import_animation.default.drawSelectedCircle(this.app, this.container, e.location);
  }
  onCarrierRightClicked(e) {
    if (this.mode === "galaxy") {
      this.emit("onCarrierRightClicked", e);
    }
  }
  onCarrierMouseOver(e) {
    if (e.data.orbiting) {
      let star = this.stars.find((s) => s.data._id === e.data.orbiting);
      star.onMouseOver();
    }
    this.tooltipLayer.drawTooltipCarrier(e.data);
  }
  onCarrierMouseOut(e) {
    if (e.data.orbiting) {
      let star = this.stars.find((s) => s.data._id === e.data.orbiting);
      star.onMouseOut();
    }
    this.tooltipLayer.clear();
  }
  onStarMouseOver(e) {
    this.tooltipLayer.drawTooltipStar(e.data);
  }
  onStarMouseOut(e) {
    this.tooltipLayer.clear();
  }
  onWaypointCreated(e) {
    this.emit("onWaypointCreated", e);
  }
  onWaypointOutOfRange(e) {
    this.emit("onWaypointOutOfRange", e);
  }
  onRulerPointCreated(e) {
    this.emit("onRulerPointCreated", e);
  }
  onRulerPointRemoved(e) {
    this.emit("onRulerPointRemoved", e);
  }
  onRulerPointsCleared(e) {
    this.emit("onRulerPointsCleared", e);
  }
  tryMultiSelect(location) {
    const distance = 10;
    let closeStars = this.stars.map((s) => {
      return {
        ref: s,
        type: "star",
        distance: import_gameHelper.default.getDistanceBetweenLocations(location, s.data.location),
        data: s.data
      };
    }).filter((s) => s.distance <= distance);
    let closeCarriers = this.carriers.map((s) => {
      return {
        ref: s,
        type: "carrier",
        distance: import_gameHelper.default.getDistanceBetweenLocations(location, s.data.location),
        data: s.data
      };
    }).filter((s) => s.distance <= distance);
    let closeObjects = closeStars.concat(closeCarriers).sort((a, b) => {
      if (a.type.localeCompare(b.type)) {
        return 1;
      }
      return a.distance < b.distance;
    });
    if (closeObjects.length > 1) {
      let star = closeObjects.find((co) => co.type === "star");
      if (star) {
        star.ref.toggleSelected();
      }
      let eventObj = closeObjects.map((co) => {
        return {
          type: co.type,
          data: co.data,
          distance: co.distance
        };
      });
      this.emit("onObjectsClicked", eventObj);
      return true;
    }
    return false;
  }
  refreshZoom(zoomPercent) {
    this.zoomPercent = zoomPercent;
    this.stars.forEach((s) => s.refreshZoom(zoomPercent));
    this.carriers.forEach((c) => c.refreshZoom(zoomPercent));
    if (this.territories)
      this.territories.refreshZoom(zoomPercent);
    if (this.playerNames)
      this.playerNames.refreshZoom(zoomPercent);
    if (this.background)
      this.background.refreshZoom(zoomPercent);
  }
  highlightLocation(location, opacity = 1) {
    let graphics = new PIXI.Graphics();
    let radius = 12;
    graphics.lineStyle(1, 16777215, opacity);
    graphics.drawStar(location.x, location.y, radius, radius, radius - 3);
    this.highlightLocationsContainer.addChild(graphics);
  }
  clearHighlightedLocations() {
    this.highlightLocationsContainer.removeChildren();
  }
  showIgnoreBulkUpgrade() {
    for (let star of this.stars) {
      star.showIgnoreBulkUpgrade();
    }
  }
  hideIgnoreBulkUpgrade() {
    for (let star of this.stars) {
      star.hideIgnoreBulkUpgrade();
    }
  }
  onStarSelected(e) {
    if (this._isOrbitalMapEnabled()) {
      this.orbitalLayer.drawStar(e);
    }
  }
  onStarUnselected(e) {
    if (this._isOrbitalMapEnabled()) {
      this.orbitalLayer.clear();
    }
  }
  onCarrierSelected(e) {
    if (this._isOrbitalMapEnabled()) {
      this.orbitalLayer.drawCarrier(e);
    }
  }
  onCarrierUnselected(e) {
    if (this._isOrbitalMapEnabled()) {
      this.orbitalLayer.clear();
    }
  }
}
var map_default = Map;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=map.js.map
