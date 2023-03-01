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
var container_exports = {};
__export(container_exports, {
  default: () => container_default
});
module.exports = __toCommonJS(container_exports);
var PIXI = __toESM(require("pixi.js-legacy"));
var import_pixi_viewport = require("pixi-viewport");
var import_map = __toESM(require("./map"));
var import_gameHelper = __toESM(require("../services/gameHelper"));
var import_texture = __toESM(require("./texture"));
class GameContainer {
  constructor() {
    PIXI.settings.SORTABLE_CHILDREN = true;
    PIXI.GRAPHICS_CURVES.minSegments = 20;
    this.frames = 0;
    this.dtAccum = 33 * 16;
    this.lowest = 1e3;
    this.previousDTs = [33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33];
    this.ma32accum = 0;
  }
  calcFPS(deltaTime) {
    let elapsed = this.app.ticker.elapsedMS;
    this.frames += 1;
    this.previousDTs.pop();
    this.previousDTs.unshift(elapsed);
    this.dtAccum = this.previousDTs.reduce((total, current) => {
      return total + current;
    });
    this.ma32accum += elapsed;
    let movingAverageDT = this.dtAccum / 16;
    let movingAverageFPS = 1e3 / movingAverageDT;
    let ma32DT = this.ma32accum / 32;
    let fps = 1e3 / elapsed;
    if (fps < this.lowest) {
      this.lowest = fps;
    }
    if (this.fpsNowText) {
      this.fpsNowText.text = "fps: " + fps.toFixed(0);
    }
    if (this.frames == 31) {
      let ma32FPS = 1e3 / ma32DT;
      if (this.fpsMAText) {
        this.fpsMAText.text = "fpsMA: " + movingAverageFPS.toFixed(0);
      }
      if (this.fpsMA32Text) {
        this.fpsMA32Text.text = "fpsMA32: " + ma32FPS.toFixed(0);
      }
      if (this.jitterText) {
        this.jitterText.text = "jitter: " + (movingAverageFPS - this.lowest).toFixed(0);
      }
      if (this.lowestText) {
        this.lowestText.text = "lowest: " + this.lowest.toFixed(0);
      }
      if (this.zoomText) {
        this.zoomText.text = "zoom%: " + this.map.zoomPercent.toFixed(0);
      }
      this.frames = 0;
      this.lowest = 1e3;
      this.ma32accum = 0;
    }
  }
  setupApp(store, userSettings) {
    this.store = store;
    this.destroy();
    let antialiasing = userSettings.map.antiAliasing === "enabled";
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0,
      resolution: window.devicePixelRatio || 1,
      antialias: antialiasing,
      autoResize: true
    });
    this.app.ticker.add(this.onTick.bind(this));
    this.app.ticker.maxFPS = 0;
    if (process.env.NODE_ENV == "development") {
      this.app.ticker.add(this.calcFPS.bind(this));
    }
    this.viewport = new import_pixi_viewport.Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: Number.MAX_VALUE,
      worldHeight: Number.MAX_VALUE,
      divWheel: this.app.renderer.view,
      stopPropagation: true,
      passiveWheel: true,
      interaction: this.app.renderer.plugins.interaction,
      disableOnContextMenu: true
    });
    this.app.stage.addChild(this.viewport);
    this.map = new import_map.default(this.app, this.store, this);
    this.viewport.addChild(this.map.container);
  }
  destroy() {
    if (this.app) {
      this.app.destroy(false, {
        children: true
      });
      this.app = null;
    }
    if (this.viewport) {
      this.viewport.destroy();
      this.viewport = null;
    }
  }
  zoomIn() {
    this.viewport.zoomPercent(0.5, true);
  }
  zoomOut() {
    this.viewport.zoomPercent(-0.3, true);
  }
  setupViewport(game) {
    this.game = game;
    this.starFieldLeft = import_gameHelper.default.calculateMinStarX(game) - 1500;
    this.starFieldRight = import_gameHelper.default.calculateMaxStarX(game) + 1500;
    this.starFieldTop = import_gameHelper.default.calculateMinStarY(game) - 750;
    this.starFieldBottom = import_gameHelper.default.calculateMaxStarY(game) + 750;
    this.viewport.drag().pinch().wheel({
      smooth: 5
    }).decelerate({ friction: 0.9 }).clamp({
      left: this.starFieldLeft,
      right: this.starFieldRight,
      top: this.starFieldTop,
      bottom: this.starFieldBottom
    }).clampZoom({
      minWidth: 50,
      minHeight: 50,
      maxWidth: Math.abs(this.starFieldLeft) + Math.abs(this.starFieldRight),
      maxHeight: Math.abs(this.starFieldBottom) + Math.abs(this.starFieldTop)
    });
    this.viewport.on("zoomed-end", this.onViewportZoomed.bind(this));
    this.viewport.on("pointerdown", this.map.onViewportPointerDown.bind(this.map));
  }
  setup(game, userSettings) {
    this.userSettings = userSettings;
    import_texture.default.initialize();
    this.map.setup(this.game, userSettings);
  }
  draw() {
    this.map.draw();
    if (process.env.NODE_ENV == "development" && true) {
      let bitmapFont = { fontName: "chakrapetch", fontSize: 16 };
      let left = 64;
      let top = 32;
      this.fpsNowText = new PIXI.BitmapText("", bitmapFont);
      this.fpsMAText = new PIXI.BitmapText("", bitmapFont);
      this.fpsMA32Text = new PIXI.BitmapText("", bitmapFont);
      this.jitterText = new PIXI.BitmapText("", bitmapFont);
      this.lowestText = new PIXI.BitmapText("", bitmapFont);
      this.zoomText = new PIXI.BitmapText("", bitmapFont);
      this.fpsNowText.x = left;
      this.fpsNowText.y = 128 + 16;
      this.fpsMAText.x = left;
      this.fpsMAText.y = this.fpsNowText.y + top + 2;
      this.fpsMA32Text.x = left;
      this.fpsMA32Text.y = this.fpsMAText.y + top + 2;
      this.jitterText.x = left;
      this.jitterText.y = this.fpsMA32Text.y + top + 2;
      this.lowestText.x = left;
      this.lowestText.y = this.jitterText.y + top + 2;
      this.zoomText.x = left;
      this.zoomText.y = this.lowestText.y + top + 2;
      this.app.stage.addChild(this.fpsNowText);
      this.app.stage.addChild(this.jitterText);
      this.app.stage.addChild(this.lowestText);
      this.app.stage.addChild(this.fpsMAText);
      this.app.stage.addChild(this.fpsMA32Text);
      this.app.stage.addChild(this.zoomText);
    }
  }
  drawWaypoints() {
    this.map.drawWaypoints();
  }
  reloadGame(game, userSettings) {
    this.game = game;
    this.userSettings = userSettings;
    this.map.reloadGame(game, userSettings);
  }
  reloadTerritories() {
    this.map.drawTerritories(this.userSettings);
  }
  reloadStar(star) {
    let starObject = this.map.setupStar(this.game, this.userSettings, star);
    this.map.drawStar(starObject);
    this.map.addContainerToChunk(starObject, this.map.chunks, this.map.firstChunkX, this.map.firstChunkY);
  }
  reloadCarrier(carrier) {
    let carrierObject = this.map.setupCarrier(this.game, this.userSettings, carrier);
    this.map.drawCarrier(carrierObject);
    this.map.addContainerToChunk(carrierObject, this.map.chunks, this.map.firstChunkX, this.map.firstChunkY);
  }
  undrawCarrier(carrier) {
    this.map.undrawCarrier(carrier);
  }
  getViewportZoomPercentage() {
    let viewportWidth = this.viewport.right - this.viewport.left;
    let viewportPercent = this.viewport.screenWidth / viewportWidth * 100;
    return viewportPercent;
  }
  onTick(deltaTime) {
    this.map.onTick(deltaTime);
  }
  onViewportZoomed(e) {
    let zoomPercent = this.getViewportZoomPercentage();
    this.map.refreshZoom(zoomPercent);
  }
  setMode(mode, args) {
    this.map.setMode(mode, args);
  }
  resetMode() {
    this.map.resetMode();
  }
  resize() {
    this.app.renderer.resize(
      window.innerWidth,
      window.innerHeight
    );
    this.viewport.resize(
      window.innerWidth,
      window.innerHeight,
      Number.MAX_VALUE,
      Number.MAX_VALUE
    );
  }
}
var container_default = new GameContainer();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=container.js.map
