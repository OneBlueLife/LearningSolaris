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
var audio_exports = {};
__export(audio_exports, {
  default: () => audio_default
});
module.exports = __toCommonJS(audio_exports);
var import_backspace = __toESM(require("../assets/audio/backspace.mp3"));
var import_click = __toESM(require("../assets/audio/click.mp3"));
var import_close = __toESM(require("../assets/audio/close.mp3"));
var import_dialog_open = __toESM(require("../assets/audio/dialog_open.mp3"));
var import_download = __toESM(require("../assets/audio/download.mp3"));
var import_hover = __toESM(require("../assets/audio/hover.mp3"));
var import_join = __toESM(require("../assets/audio/join.mp3"));
var import_leave = __toESM(require("../assets/audio/leave.mp3"));
var import_loading = __toESM(require("../assets/audio/loading.mp3"));
var import_open = __toESM(require("../assets/audio/open.mp3"));
var import_quit = __toESM(require("../assets/audio/quit.mp3"));
var import_type = __toESM(require("../assets/audio/type.mp3"));
class AudioService {
  _play(audio) {
    if (this.store && this.store.state.settings.interface.audio === "disabled") {
      return;
    }
    audio.volume = 0.5;
    audio.play();
  }
  preload() {
    this.backspaceAudio = new Audio(import_backspace.default);
    this.clickAudio = new Audio(import_click.default);
    this.closeAudio = new Audio(import_close.default);
    this.dialogOpenAudio = new Audio(import_dialog_open.default);
    this.downloadAudio = new Audio(import_download.default);
    this.hoverAudio = new Audio(import_hover.default);
    this.joinAudio = new Audio(import_join.default);
    this.leaveAudio = new Audio(import_leave.default);
    this.loadingAudio = new Audio(import_loading.default);
    this.openAudio = new Audio(import_open.default);
    this.quitAudio = new Audio(import_quit.default);
    this.typeAudio = new Audio(import_type.default);
  }
  loadStore(store) {
    this.store = store;
    this.preload();
  }
  backspace() {
    this._play(this.backspaceAudio);
  }
  click() {
    this._play(this.clickAudio);
  }
  close() {
    this._play(this.closeAudio);
  }
  dialogOpen() {
    this._play(this.dialogOpenAudio);
  }
  download() {
    this._play(this.downloadAudio);
  }
  hover() {
    this._play(this.hoverAudio);
  }
  join() {
    this._play(this.joinAudio);
  }
  leave() {
    this._play(this.leaveAudio);
  }
  loading() {
    this._play(this.loadingAudio);
  }
  open() {
    this._play(this.openAudio);
  }
  quit() {
    this._play(this.quitAudio);
  }
  type() {
    this._play(this.typeAudio);
  }
}
var audio_default = new AudioService();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=audio.js.map
