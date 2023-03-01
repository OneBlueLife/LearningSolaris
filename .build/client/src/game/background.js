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
var background_exports = {};
__export(background_exports, {
  default: () => background_default
});
module.exports = __toCommonJS(background_exports);
var PIXI = __toESM(require("pixi.js-legacy"));
var import_texture = __toESM(require("./texture"));
var rng = __toESM(require("random-seed"));
var import_gameHelper = __toESM(require("../services/gameHelper"));
class Background {
  static MAX_PARALLAX = 0.333;
  static STAR_DENSITY = 10;
  static STAR_SCALE = 1 / 8;
  static NEBULA_SCALE = 1.5;
  static NEBULA_DELTA_SCALE = Background.NEBULA_SCALE * 0.25;
  static NEBULA_DELTA_ROTATION = Math.PI * 2 / 64;
  static zoomLevelDefinitions = {
    nebulas: 100,
    stars: 100
  };
  constructor() {
    this.container = new PIXI.Container();
    this.starContainer = new PIXI.Container();
    this.zoomPercent = 0;
    this.container.interactiveChildren = false;
    this.starContainer.interactiveChildren = false;
    this.time = 0;
  }
  setup(game, userSettings) {
    this.game = game;
    this.userSettings = userSettings;
    this.rng = rng.create(game._id);
    this.galaxyCenterX = import_gameHelper.default.calculateGalaxyCenterX(game);
    this.galaxyCenterY = import_gameHelper.default.calculateGalaxyCenterY(game);
    this.clear();
    Background.zoomLevelDefinitions = userSettings.map.zoomLevels.background;
    this.container.alpha = userSettings.map.background.nebulaOpacity;
    this.starContainer.alpha = userSettings.map.background.starsOpacity;
    this.moveNebulas = userSettings.map.background.moveNebulas == "enabled";
    this.timeScale = 1 / (2048 * 64) * userSettings.map.background.nebulaMovementSpeed;
    this.blendMode = userSettings.map.background.blendMode == "ADD" ? PIXI.BLEND_MODES.ADD : PIXI.BLEND_MODES.NORMAL;
  }
  clear() {
    this.container.removeChildren();
    this.starContainer.removeChildren();
  }
  draw() {
    this.clear();
    this.drawNebulas();
  }
  drawNebulas() {
    let NEBULA_FREQUENCY = this.userSettings.map.background.nebulaFrequency;
    let NEBULA_DENSITY = this.userSettings.map.background.nebulaDensity;
    const FALLBACK_NEBULA_COLOR = 16777215;
    let NEBULA_COLOUR1;
    let NEBULA_COLOUR2;
    let NEBULA_COLOUR3;
    try {
      NEBULA_COLOUR1 = this._getNumberFromHexString(this.userSettings.map.background.nebulaColour1);
      NEBULA_COLOUR2 = this._getNumberFromHexString(this.userSettings.map.background.nebulaColour2);
      NEBULA_COLOUR3 = this._getNumberFromHexString(this.userSettings.map.background.nebulaColour3);
    } catch (err) {
      NEBULA_COLOUR1 = FALLBACK_NEBULA_COLOR;
      NEBULA_COLOUR2 = FALLBACK_NEBULA_COLOR;
      NEBULA_COLOUR3 = FALLBACK_NEBULA_COLOR;
      console.error(err);
    }
    const CHUNK_SIZE = 512;
    const MINIMUM_STARS = 2;
    const NEBULA_MAX_OFFSET = CHUNK_SIZE / 4;
    let minX = import_gameHelper.default.calculateMinStarX(this.game);
    let minY = import_gameHelper.default.calculateMinStarY(this.game);
    let maxX = import_gameHelper.default.calculateMaxStarX(this.game);
    let maxY = import_gameHelper.default.calculateMaxStarY(this.game);
    let firstChunkX = Math.floor(minX / CHUNK_SIZE);
    let firstChunkY = Math.floor(minY / CHUNK_SIZE);
    let lastChunkX = Math.floor(maxX / CHUNK_SIZE);
    let lastChunkY = Math.floor(maxY / CHUNK_SIZE);
    let chunksXlen = lastChunkX - firstChunkX + 1;
    let chunksYlen = lastChunkY - firstChunkY + 1;
    let chunks = Array(chunksXlen);
    for (let x = 0; x < chunksXlen; x += 1) {
      chunks[x] = Array(chunksYlen);
      for (let y = 0; y < chunksYlen; y += 1) {
        chunks[x][y] = Array();
      }
    }
    for (let star of this.game.galaxy.stars) {
      let cx = Math.floor(star.location.x / CHUNK_SIZE) - firstChunkX;
      let cy = Math.floor(star.location.y / CHUNK_SIZE) - firstChunkY;
      chunks[cx][cy].push(star.location);
    }
    for (let x = 0; x < chunksXlen; x += 1) {
      for (let y = 0; y < chunksYlen; y += 1) {
        if (chunks[x][y].length > MINIMUM_STARS) {
          let i;
          let texture;
          let sprite;
          let nebulaTextureCount;
          let textures;
          nebulaTextureCount = import_texture.default.STARLESS_NEBULA_TEXTURES.length;
          textures = import_texture.default.STARLESS_NEBULA_TEXTURES;
          if (Math.round(this.rng.random() * 16) <= NEBULA_FREQUENCY) {
            let nebulaCount = 0;
            while (nebulaCount < NEBULA_DENSITY) {
              nebulaCount += 1;
              if (NEBULA_DENSITY > 2) {
                if (this.rng.random() < 0.5) {
                  continue;
                }
              }
              i = Math.round(this.rng.random() * (nebulaTextureCount - 1));
              texture = textures[i];
              sprite = new PIXI.Sprite(texture);
              sprite.x = x * CHUNK_SIZE + firstChunkX * CHUNK_SIZE + CHUNK_SIZE / 2;
              sprite.x += NEBULA_MAX_OFFSET * Math.round(this.rng.random() * 2 - 1);
              sprite.y = y * CHUNK_SIZE + firstChunkY * CHUNK_SIZE + CHUNK_SIZE / 2;
              sprite.y += NEBULA_MAX_OFFSET * Math.round(this.rng.random() * 2 - 1);
              sprite.anchor.set(0.5);
              sprite.parallax = this.rng.random() * Background.MAX_PARALLAX;
              sprite.blendMode = this.blendMode;
              sprite.originX = sprite.x;
              sprite.originY = sprite.y;
              sprite.baseRotation = this.rng.random() * Math.PI * 2;
              sprite.baseRotationTime = this.rng.random() * Math.PI * 2;
              sprite.baseScaleTime = this.rng.random() * Math.PI * 2;
              sprite.tint = NEBULA_COLOUR1;
              if (this.rng.random() > 1 / 3) {
                sprite.tint = NEBULA_COLOUR2;
              }
              if (this.rng.random() > 1 / 3 * 2) {
                sprite.tint = NEBULA_COLOUR3;
              }
              sprite.scale.x = Background.NEBULA_SCALE;
              sprite.scale.y = Background.NEBULA_SCALE;
              this.container.addChild(sprite);
              let starCount = 0;
              texture = import_texture.default.STAR_TEXTURE;
              while (starCount < Background.STAR_DENSITY) {
                starCount += 1;
                sprite = new PIXI.Sprite(texture);
                sprite.x = x * CHUNK_SIZE + firstChunkX * CHUNK_SIZE + CHUNK_SIZE * this.rng.random();
                sprite.x += NEBULA_MAX_OFFSET * Math.round(this.rng.random() * 2 - 1);
                sprite.y = y * CHUNK_SIZE + firstChunkY * CHUNK_SIZE + CHUNK_SIZE * this.rng.random();
                sprite.y += NEBULA_MAX_OFFSET * Math.round(this.rng.random() * 2 - 1);
                sprite.anchor.set(0.5);
                sprite.parallax = this.rng.random() * Background.MAX_PARALLAX;
                sprite.blendMode = this.blendMode;
                sprite.originX = sprite.x;
                sprite.originY = sprite.y;
                let inverseParallaxNormalized = 1 - sprite.parallax / Background.MAX_PARALLAX;
                sprite.scale.x = (Background.STAR_SCALE + inverseParallaxNormalized * Background.STAR_SCALE) / 2;
                sprite.scale.y = (Background.STAR_SCALE + inverseParallaxNormalized * Background.STAR_SCALE) / 2;
                this.starContainer.addChild(sprite);
              }
            }
          }
        }
      }
    }
  }
  refreshZoom(zoomPercent) {
    this.zoomPercent = zoomPercent;
    if (this.container) {
      this.container.visible = zoomPercent > Background.zoomLevelDefinitions.nebulas;
    }
    if (this.starContainer) {
      this.starContainer.visible = zoomPercent > Background.zoomLevelDefinitions.stars;
    }
  }
  onTick(deltaTime, viewportData) {
    this.time += deltaTime * 1e3;
    let compressedTime = this.time * this.timeScale;
    for (let i = 0; i < this.container.children.length; i++) {
      let child = this.container.children[i];
      let deltax = viewportData.center.x - child.originX;
      let deltay = viewportData.center.y - child.originY;
      child.x = child.originX + deltax * child.parallax;
      child.y = child.originY + deltay * child.parallax;
      if (this.moveNebulas) {
        child.scale.x = Background.NEBULA_SCALE + Math.sin(child.baseScaleTime + compressedTime) * Background.NEBULA_DELTA_SCALE;
        child.rotation = child.baseRotation + Math.sin(child.baseRotationTime + compressedTime) * Background.NEBULA_DELTA_ROTATION;
      }
    }
    for (let i = 0; i < this.starContainer.children.length; i++) {
      let child = this.starContainer.children[i];
      let deltax = viewportData.center.x - child.originX;
      let deltay = viewportData.center.y - child.originY;
      child.x = child.originX + deltax * child.parallax;
      child.y = child.originY + deltay * child.parallax;
    }
  }
  _getNumberFromHexString(colorString) {
    let hexString = colorString.replace(/^#/, "");
    if (!/^[0-9A-F]{6}$/i.test(hexString)) {
      throw new Error("Invalid Hex Color String");
    }
    let hex = parseInt(hexString, 16);
    return hex;
  }
}
var background_default = Background;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=background.js.map
