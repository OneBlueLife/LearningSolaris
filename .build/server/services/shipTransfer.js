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
var shipTransfer_exports = {};
__export(shipTransfer_exports, {
  default: () => ShipTransferService
});
module.exports = __toCommonJS(shipTransfer_exports);
var import_validation = __toESM(require("../errors/validation"));
class ShipTransferService {
  constructor(gameRepo, carrierService, starService) {
    this.gameRepo = gameRepo;
    this.carrierService = carrierService;
    this.starService = starService;
  }
  async garrisonAllShips(game, player, starId, writeToDB = true) {
    let star = this.starService.getById(game, starId);
    let carriersAtStar = this.carrierService.getCarriersAtStar(game, starId).filter((c) => c.ownedByPlayerId.toString() === player._id.toString());
    if (!star.ownedByPlayerId || star.ownedByPlayerId.toString() !== player._id.toString()) {
      throw new import_validation.default("The player does not own this star.");
    }
    if (!carriersAtStar.length) {
      throw new import_validation.default("The player does not own any carriers in orbit of this star.");
    }
    let shipsToTransfer = 0;
    for (let carrier of carriersAtStar) {
      if (carrier.ships > 1) {
        shipsToTransfer += carrier.ships - 1;
        carrier.ships = 1;
      }
    }
    star.shipsActual += shipsToTransfer;
    star.ships = Math.floor(star.shipsActual);
    if (writeToDB) {
      let dbWrites = carriersAtStar.map((c) => {
        return {
          updateOne: {
            filter: {
              _id: game._id,
              "galaxy.carriers._id": c._id
            },
            update: {
              "galaxy.carriers.$.ships": c.ships
            }
          }
        };
      });
      dbWrites.push({
        updateOne: {
          filter: {
            _id: game._id,
            "galaxy.stars._id": star._id
          },
          update: {
            "galaxy.stars.$.shipsActual": star.shipsActual,
            "galaxy.stars.$.ships": star.ships
          }
        }
      });
      await this.gameRepo.bulkWrite(dbWrites);
    }
    return {
      star: {
        _id: star._id,
        ships: star.ships
      },
      carriers: carriersAtStar.map((c) => {
        return {
          _id: c._id,
          ships: c.ships
        };
      })
    };
  }
  async distributeAllShips(game, player, starId, writeToDB = true) {
    let star = this.starService.getById(game, starId);
    let carriersAtStar = this.carrierService.getCarriersAtStar(game, starId).filter((c) => c.ownedByPlayerId.toString() === player._id.toString());
    if (!star.ownedByPlayerId || star.ownedByPlayerId.toString() !== player._id.toString()) {
      throw new import_validation.default("The player does not own this star.");
    }
    if (!carriersAtStar.length) {
      throw new import_validation.default("The player does not own any carriers in orbit of this star.");
    }
    let shipsToTransfer = 0;
    for (let carrier of carriersAtStar) {
      if (carrier.ships > 1) {
        shipsToTransfer += carrier.ships - 1;
        carrier.ships = 1;
      }
    }
    star.shipsActual += shipsToTransfer;
    star.ships = Math.floor(star.shipsActual);
    if (star.ships > 0) {
      let shipsPerCarrier = Math.floor(star.ships / carriersAtStar.length);
      for (let carrier of carriersAtStar) {
        carrier.ships += shipsPerCarrier;
        star.shipsActual -= shipsPerCarrier;
        star.ships = Math.floor(star.shipsActual);
      }
    }
    if (writeToDB) {
      let dbWrites = carriersAtStar.map((c) => {
        return {
          updateOne: {
            filter: {
              _id: game._id,
              "galaxy.carriers._id": c._id
            },
            update: {
              "galaxy.carriers.$.ships": c.ships
            }
          }
        };
      });
      dbWrites.push({
        updateOne: {
          filter: {
            _id: game._id,
            "galaxy.stars._id": star._id
          },
          update: {
            "galaxy.stars.$.shipsActual": star.shipsActual,
            "galaxy.stars.$.ships": star.ships
          }
        }
      });
      await this.gameRepo.bulkWrite(dbWrites);
    }
    return {
      star: {
        _id: star._id,
        ships: star.ships
      },
      carriers: carriersAtStar.map((c) => {
        return {
          _id: c._id,
          ships: c.ships
        };
      })
    };
  }
  async transfer(game, player, carrierId, carrierShips, starId, starShips, writeDB = true) {
    let carrier = this.carrierService.getById(game, carrierId);
    let star = this.starService.getById(game, starId);
    if (!carrier || carrier.ownedByPlayerId.toString() !== player._id.toString()) {
      throw new import_validation.default("The player does not own this carrier.");
    }
    if (!star || !star.ownedByPlayerId || star.ownedByPlayerId.toString() !== player._id.toString()) {
      throw new import_validation.default("The player does not own this star.");
    }
    if (!carrier.orbiting) {
      throw new import_validation.default("The carrier must be in orbit of a star to transfer ships.");
    }
    if (carrier.orbiting.toString() !== star._id.toString()) {
      throw new import_validation.default("The carrier must be in orbit of a the desired star to transfer ships.");
    }
    let totalTransferShips = carrierShips + starShips;
    let totalShips = carrier.ships + star.ships;
    if (totalTransferShips != totalShips) {
      throw new import_validation.default("The total number of ships in the transfer does not equal to the total number of ships garrisoned");
    }
    if (carrierShips <= 0) {
      throw new import_validation.default("The number of carrier ships in the transfer must be greater than 0. Carriers must have at least 1 ship.");
    }
    if (starShips < 0) {
      throw new import_validation.default("The number of carrier ships in the transfer must be 0 or greater.");
    }
    carrier.ships = carrierShips;
    let shipsFraction = star.shipsActual - star.ships;
    star.shipsActual = starShips + shipsFraction;
    star.ships = Math.floor(star.shipsActual);
    if (writeDB) {
      await this.gameRepo.bulkWrite([
        {
          updateOne: {
            filter: {
              _id: game._id,
              "galaxy.stars._id": star._id
            },
            update: {
              "galaxy.stars.$.shipsActual": star.shipsActual,
              "galaxy.stars.$.ships": star.ships
            }
          }
        },
        {
          updateOne: {
            filter: {
              _id: game._id,
              "galaxy.carriers._id": carrier._id
            },
            update: {
              "galaxy.carriers.$.ships": carrier.ships
            }
          }
        }
      ]);
    }
    return {
      player,
      star,
      carrier
    };
  }
}
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=shipTransfer.js.map
