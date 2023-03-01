"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var paypal_exports = {};
__export(paypal_exports, {
  default: () => PaypalService
});
module.exports = __toCommonJS(paypal_exports);
const axios = require("axios");
const CURRENCY = "GBP";
const CACHE_KEY_TOKEN = "paypalToken";
class PaypalService {
  constructor(PaymentModel, config, paymentRepo, userService, cacheService) {
    this.API = {
      sandbox: {
        auth: "https://api-m.sandbox.paypal.com/v1/oauth2/token",
        payment: "https://api-m.sandbox.paypal.com/v1/payments/payment",
        execute: (paymentId) => `https://api-m.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`,
        capture: (authorizationId) => `https://api-m.sandbox.paypal.com/v1/payments/authorization/${authorizationId}/capture`
      },
      production: {
        auth: "https://api-m.paypal.com/v1/oauth2/token",
        payment: "https://api-m.paypal.com/v1/payments/payment",
        execute: (paymentId) => `https://api-m.paypal.com/v1/payments/payment/${paymentId}/execute`,
        capture: (authorizationId) => `https://api-m.paypal.com/v1/payments/authorization/${authorizationId}/capture`
      }
    };
    this.PaymentModel = PaymentModel;
    this.config = config;
    this.paymentRepo = paymentRepo;
    this.userService = userService;
    this.cacheService = cacheService;
  }
  async authorize() {
    let cached = this.cacheService.get(CACHE_KEY_TOKEN);
    if (cached) {
      return cached;
    }
    const environment = this.config.paypal.environment;
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    let authResponse = await axios.post(this.API[environment].auth, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      auth: {
        username: this.config.paypal.clientId,
        password: this.config.paypal.clientSecret
      }
    });
    let token = authResponse.data.access_token;
    this.cacheService.put(CACHE_KEY_TOKEN, token, 36e5);
    return token;
  }
  async authorizePayment(userId, totalQuantity, totalCost, unitCost, returnUrl, cancelUrl) {
    const environment = this.config.paypal.environment;
    let token = await this.authorize();
    const requestOptions = {
      headers: {
        "Authorization": "Bearer " + token
      }
    };
    let paymentResponse = await axios.post(this.API[environment].payment, {
      intent: "authorize",
      payer: {
        payment_method: "paypal"
      },
      transactions: [
        {
          amount: {
            total: totalCost.toFixed(2),
            currency: CURRENCY
          },
          description: `${totalQuantity} Galactic Tokens on Solaris`,
          item_list: {
            items: [
              {
                name: "Galactic Tokens",
                quantity: totalQuantity,
                price: unitCost.toFixed(2),
                currency: CURRENCY
              }
            ]
          }
        }
      ],
      note_to_payer: "Contact us for any questions on your order.",
      redirect_urls: {
        return_url: returnUrl,
        cancel_url: cancelUrl
      }
    }, requestOptions);
    let payment = new this.PaymentModel({
      userId,
      paymentId: paymentResponse.data.id,
      totalCost,
      totalQuantity,
      unitCost
    });
    await payment.save();
    let approvalUrl = paymentResponse.data.links.find((l) => l.rel === "approval_url").href;
    return approvalUrl;
  }
  async processPayment(paymentId, payerId) {
    const environment = this.config.paypal.environment;
    const payment = await this.paymentRepo.findOne({
      paymentId
    });
    if (!payment) {
      throw new Error(`Payment not found with id: ${paymentId}`);
    }
    let token = await this.authorize();
    const requestOptions = {
      headers: {
        "Authorization": "Bearer " + token
      }
    };
    let executeResponse = await axios.post(this.API[environment].execute(paymentId), {
      payer_id: payerId
    }, requestOptions);
    if (executeResponse.status !== 200) {
      throw new Error(`Execute payment request failed: ${paymentId}`);
    }
    for (let transaction of executeResponse.data.transactions) {
      const authorizationId = transaction.related_resources.find((r) => r.authorization != null).authorization.id;
      const authResponse = await axios.post(this.API[environment].capture(authorizationId), {
        amount: {
          total: parseFloat(transaction.amount.total).toFixed(2),
          currency: transaction.amount.currency
        }
      }, requestOptions);
      if (authResponse.status !== 201) {
        throw new Error(`Authorize payment request failed: ${authorizationId}`);
      }
    }
    await this.userService.incrementCreditsByPurchase(payment.userId, payment.totalQuantity);
    return {
      galacticTokens: payment.totalQuantity
    };
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=paypal.js.map
