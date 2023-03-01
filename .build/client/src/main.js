"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_vue = __toESM(require("vue"));
var import_vue_socket = __toESM(require("vue-socket.io"));
var import_vue_gtag = __toESM(require("vue-gtag"));
var import_vue_toasted = __toESM(require("vue-toasted"));
var import_App = __toESM(require("./App.vue"));
var import_router = __toESM(require("./router"));
var import_store = __toESM(require("./store"));
var import_jquery = __toESM(require("jquery"));
var import_pixi = require("pixi.js-legacy");
var import_pixi_viewport = require("pixi-viewport");
window.bootstrap = require("bootstrap/dist/js/bootstrap.bundle.js");
require("../public/assets/js/app.min.js");
import_vue.default.config.productionTip = false;
window.$ = import_jquery.default;
import_vue.default.use(new import_vue_socket.default({
  debug: true,
  connection: `//${process.env.VUE_APP_SOCKETS_HOST}`,
  vuex: {
    store: import_store.default,
    actionPrefix: "SOCKET_",
    mutationPrefix: "SOCKET_"
  }
}));
let trackingCode = process.env.VUE_APP_GOOGLE_ANALYTICS_TRACKING_CODE;
if (trackingCode) {
  import_vue.default.use(import_vue_gtag.default, {
    config: { id: trackingCode }
  }, import_router.default);
}
import_vue.default.use(import_vue_toasted.default, {
  position: "bottom-right",
  duration: 2500
});
import_vue.default.prototype.$confirm = async function(title, text, confirmText = "Yes", cancelText = "No", hideCancelButton = false, cover = false) {
  return this.$store.dispatch("confirm", {
    titleText: title,
    text,
    confirmText,
    cancelText,
    hideCancelButton,
    cover
  });
};
import_vue.default.prototype.$isHistoricalMode = function() {
  return this.$store.state.tick !== this.$store.state.game.state.tick;
};
import_vue.default.prototype.$isMobile = function() {
  return window.matchMedia("only screen and (max-width: 576px)").matches;
};
import_vue.default.directive("tooltip", function(el, binding) {
  new bootstrap.Tooltip((0, import_jquery.default)(el), {
    title: binding.value,
    placement: binding.arg,
    trigger: "hover"
  });
});
new import_vue.default({
  router: import_router.default,
  store: import_store.default,
  render: (h) => h(import_App.default)
}).$mount("#app");
//# sourceMappingURL=main.js.map
