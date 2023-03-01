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
var PathManager_exports = {};
__export(PathManager_exports, {
  default: () => PathManager_default
});
module.exports = __toCommonJS(PathManager_exports);
var PIXI = __toESM(require("pixi.js-legacy"));
var import_gameHelper = __toESM(require("../services/gameHelper"));
var import_helpers = __toESM(require("./helpers"));
class PathManager {
  constructor(game, userSettings, map) {
    this.map = map;
    this.zoomPercent = 100;
    this.container = new PIXI.Container();
    this.chunkSize = 512;
    this.setup(game, userSettings);
  }
  setup(game, userSettings) {
    this.game = game;
    this.userSettings = userSettings;
    this._loadSettings();
    this.paths = Array();
    if (this.chunklessContainer) {
      this.container.removeChild(this.chunklessContainer);
    }
    if (this.chunksContainer) {
      this.container.removeChild(this.chunksContainer);
    }
    this.chunksContainer = new PIXI.Container();
    this.chunklessContainer = new PIXI.Container();
    this.container.addChild(this.chunklessContainer);
    this.container.addChild(this.chunksContainer);
    let minX = import_gameHelper.default.calculateMinStarX(this.game);
    let minY = import_gameHelper.default.calculateMinStarY(this.game);
    let maxX = import_gameHelper.default.calculateMaxStarX(this.game);
    let maxY = import_gameHelper.default.calculateMaxStarY(this.game);
    this.firstChunkX = Math.floor(minX / this.chunkSize);
    this.firstChunkY = Math.floor(minY / this.chunkSize);
    this.lastChunkX = Math.floor(maxX / this.chunkSize);
    this.lastChunkY = Math.floor(maxY / this.chunkSize);
    this.chunksXlen = this.lastChunkX - this.firstChunkX + 1;
    this.chunksYlen = this.lastChunkY - this.firstChunkY + 1;
    this.chunks = Array(this.chunksXlen);
    for (let x = 0; x < this.chunksXlen; x += 1) {
      this.chunks[x] = Array(this.chunksYlen);
      for (let y = 0; y < this.chunksYlen; y += 1) {
        this.chunks[x][y] = new PIXI.Container();
        this.chunksContainer.addChild(this.chunks[x][y]);
        if (false) {
          let chunkVisualizer = new PIXI.Graphics();
          chunkVisualizer.alpha = 0.5;
          chunkVisualizer.lineStyle(4, 16711680, 1);
          chunkVisualizer.beginFill(14561865);
          chunkVisualizer.drawRect(
            (this.firstChunkX + x) * this.chunkSize,
            (this.firstChunkY + y) * this.chunkSize,
            this.chunkSize,
            this.chunkSize
          );
          chunkVisualizer.endFill();
          this.chunksContainer.addChild(chunkVisualizer);
          this.chunks[x][y].visualizer = chunkVisualizer;
        }
      }
    }
  }
  _loadSettings() {
    this.clampedScaling = this.userSettings.map.objectsScaling == "clamped";
    this.baseScale = 1;
    this.minScale = this.userSettings.map.objectsMinimumScale / 4;
    this.maxScale = this.userSettings.map.objectsMaximumScale / 4;
  }
  addSharedPath(objectA, objectB, carrierMapObject) {
    let mapObjects = [objectA, objectB];
    let objectAlpha = import_helpers.default.calculateDepthModifiers(this.userSettings, [objectA._id, objectB._id]) / 2;
    this._orderObjects(mapObjects);
    let pathID = mapObjects[0].data._id + mapObjects[1].data._id;
    let path = this._findPath(pathID);
    if (!path) {
      path = {
        id: pathID,
        carriers: Array(),
        graphics: this._createLoopedPathGraphics(mapObjects[0], mapObjects[1], carrierMapObject.colour)
      };
      this.paths.push(path);
    }
    if (!this._pathContainsCarrier(carrierMapObject, path)) {
      path.carriers.push(carrierMapObject);
    }
    path.graphics.alpha = objectAlpha + path.carriers.length * 0.1;
    return pathID;
  }
  removeSharedPath(pathID, carrier) {
    let path = this._findPath(pathID);
    if (path) {
      let pathGraphics = path.graphics;
      let carrierIndex = path.carriers.indexOf(carrier);
      if (carrierIndex >= 0) {
        path.carriers.splice(path.carriers.indexOf(carrier), 1);
      }
      path.graphics.alpha = import_helpers.default.calculateDepthModifier(this.userSettings, carrier._id) / 2 + path.carriers.length * 0.1;
      if (path.carriers.length === 0) {
        if (pathGraphics.chunk) {
          pathGraphics.chunk.removeChild(pathGraphics);
        } else {
          this.chunklessContainer.removeChild(pathGraphics);
        }
        this.paths.splice(this.paths.indexOf(path), 1);
      }
    }
  }
  addUniquePath(mapObject, star, looped, colour) {
    const PATH_WIDTH = 0.5 * this.userSettings.map.carrierPathWidth;
    let objectAlpha = import_helpers.default.calculateDepthModifier(this.userSettings, mapObject._id) / 2;
    let lineAlpha = looped ? objectAlpha / 2 : objectAlpha;
    let lineWidth = PATH_WIDTH;
    let path;
    if (looped) {
      path = this._createLoopedPathGraphics(mapObject, star, colour);
    } else {
      path = this._createSolidPathGraphics(lineAlpha, lineWidth, mapObject, star, colour);
    }
    path.alpha = lineAlpha;
    return path;
  }
  removeUniquePath(path) {
    if (path.chunk) {
      path.chunk.removeChild(path);
    } else {
      this.chunklessContainer.removeChild(path);
    }
  }
  addPathToChunk(pathGraphics, locA, locB) {
    let chunkXA = Math.floor(locA.x / this.chunkSize);
    let chunkYA = Math.floor(locA.y / this.chunkSize);
    let chunkXB = Math.floor(locB.x / this.chunkSize);
    let chunkYB = Math.floor(locB.y / this.chunkSize);
    if (chunkXA === chunkXB && chunkYA === chunkYB) {
      let ix = chunkXA - this.firstChunkX;
      let iy = chunkYA - this.firstChunkY;
      this.chunks[ix][iy].addChild(pathGraphics);
      pathGraphics.chunk = this.chunks[ix][iy];
    } else {
      this.chunklessContainer.addChild(pathGraphics);
    }
    this._updatePathScale(pathGraphics);
  }
  onTick(zoomPercent, viewport, zoomChanging) {
    this.setScale(zoomPercent, viewport, zoomChanging);
    this.zoomPercent = zoomPercent;
  }
  setScale(zoomPercent, viewport, zoomChanging) {
    let yscale = this.baseScale;
    if (this.clampedScaling) {
      let currentScale = zoomPercent / 100;
      if (currentScale < this.minScale) {
        yscale = 1 / currentScale * this.minScale;
      } else if (currentScale > this.maxScale) {
        yscale = 1 / currentScale * this.maxScale;
      }
    }
    if (zoomChanging) {
      for (let path of this.chunklessContainer.children) {
        path.scale.y = yscale;
      }
    }
    let firstX = Math.floor(viewport.left / this.chunkSize);
    let firstY = Math.floor(viewport.top / this.chunkSize);
    let lastX = Math.floor(viewport.right / this.chunkSize);
    let lastY = Math.floor(viewport.bottom / this.chunkSize);
    for (let ix = 0; ix < this.chunksXlen; ix += 1) {
      for (let iy = 0; iy < this.chunksYlen; iy += 1) {
        if (ix >= firstX - this.firstChunkX && ix <= lastX - this.firstChunkX && iy >= firstY - this.firstChunkY && iy <= lastY - this.firstChunkY) {
          if (!this.chunks[ix][iy].visible) {
            this.chunks[ix][iy].visible = true;
            for (let path of this.chunks[ix][iy].children) {
              path.scale.y = yscale;
            }
          } else {
            if (zoomChanging) {
              for (let path of this.chunks[ix][iy].children) {
                path.scale.y = yscale;
              }
            }
          }
        } else {
          this.chunks[ix][iy].visible = false;
        }
      }
    }
  }
  _updatePathScale(path) {
    let yscale = this.baseScale;
    if (this.clampedScaling) {
      let currentScale = this.zoomPercent / 100;
      if (currentScale < this.minScale) {
        yscale = 1 / currentScale * this.minScale;
      } else if (currentScale > this.maxScale) {
        yscale = 1 / currentScale * this.maxScale;
      }
    }
    path.scale.y = yscale;
  }
  _createLoopedPathGraphics(objectA, objectB, pathColour) {
    const PATH_WIDTH = 0.5 * this.userSettings.map.carrierPathWidth;
    let lineAlpha = 0.3;
    let lineWidth = PATH_WIDTH;
    let pathGraphics;
    if (this.userSettings.map.carrierLoopStyle == "solid") {
      pathGraphics = this._createSolidPathGraphics(lineAlpha, lineWidth / 3, objectA, objectB, pathColour);
    } else {
      pathGraphics = this._createDashedPathGraphics(lineAlpha, lineWidth, objectA, objectB, pathColour);
    }
    return pathGraphics;
  }
  _createDashedPathGraphics(lineAlpha, lineWidth, objectA, objectB, pathColour) {
    let pointA = objectA.data.location;
    let pointB = objectB.data.location;
    const DASH_LENGTH = Math.min(Math.max(1, this.userSettings.map.carrierPathDashLength), 16);
    const VOID_LENGTH = DASH_LENGTH / 2;
    const COMBINED_LENGTH = DASH_LENGTH + VOID_LENGTH;
    let pathLength = import_gameHelper.default.getDistanceBetweenLocations(pointA, pointB);
    let dashCount = Math.floor(pathLength / (DASH_LENGTH + VOID_LENGTH));
    let endpointsLength = pathLength - dashCount * (DASH_LENGTH + VOID_LENGTH);
    let initialX = endpointsLength / 2 + VOID_LENGTH / 2;
    let path = new PIXI.Graphics();
    path.moveTo(0, lineWidth);
    path.beginFill(pathColour);
    path.lineTo(0, -lineWidth);
    path.lineTo(Math.max(initialX - VOID_LENGTH, 0), -lineWidth);
    path.lineTo(Math.max(initialX - VOID_LENGTH, 0), lineWidth);
    path.endFill();
    for (let i = 0; i < dashCount; i++) {
      path.moveTo(initialX + i * COMBINED_LENGTH, lineWidth);
      path.beginFill(pathColour);
      path.lineTo(initialX + i * COMBINED_LENGTH, -lineWidth);
      path.lineTo(initialX + i * COMBINED_LENGTH + DASH_LENGTH, -lineWidth);
      path.lineTo(initialX + i * COMBINED_LENGTH + DASH_LENGTH, lineWidth);
      path.endFill();
    }
    path.moveTo(Math.min(initialX + dashCount * COMBINED_LENGTH, pathLength), lineWidth);
    path.beginFill(pathColour);
    path.lineTo(Math.min(initialX + dashCount * COMBINED_LENGTH, pathLength), -lineWidth);
    path.lineTo(pathLength, -lineWidth);
    path.lineTo(pathLength, lineWidth);
    path.endFill();
    path.rotation = Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);
    path.position = pointA;
    this.addPathToChunk(path, pointA, pointB);
    return path;
  }
  _createSolidPathGraphics(lineAlpha, lineWidth, objectA, objectB, pathColour) {
    let pointA = objectA.data.location;
    let pointB = objectB.data.location;
    let pathLength = import_gameHelper.default.getDistanceBetweenLocations(pointA, pointB);
    let path = new PIXI.Graphics();
    path.beginFill(pathColour);
    path.moveTo(0, lineWidth);
    path.lineTo(0, -lineWidth);
    path.lineTo(pathLength, -lineWidth);
    path.lineTo(pathLength, lineWidth);
    path.endFill();
    path.rotation = Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);
    path.position = pointA;
    this.addPathToChunk(path, pointA, pointB);
    return path;
  }
  _orderObjects(mapObjects) {
    if (mapObjects[1].data._id > mapObjects[0].data._id) {
      let firstMapObject = mapObjects[0];
      mapObjects[0] = mapObjects[1];
      mapObjects[1] = firstMapObject;
    }
  }
  _pathContainsCarrier(carrierMapObject, path) {
    let carrier = path.carriers.find((c) => c.data._id === carrierMapObject.data._id);
    return carrier;
  }
  _findPath(pathID) {
    let path = this.paths.find((p) => p.id === pathID);
    return path;
  }
}
var PathManager_default = PathManager;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=PathManager.js.map
