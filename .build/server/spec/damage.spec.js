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
var import_combat = __toESM(require("../services/combat"));
const mongoose = require("mongoose");
describe("damage distribution", () => {
  const service = new import_combat.default();
  it("should distribute damage evenly between star and carrier", async () => {
    let star = {
      _id: new mongoose.Types.ObjectId(),
      ships: 5,
      shipsActual: 5,
      specialistId: null
    };
    let carrier = {
      _id: new mongoose.Types.ObjectId(),
      ships: 10,
      specialistId: null
    };
    const combatResult = {
      star,
      carriers: [carrier]
    };
    const damageObjects = [
      star,
      carrier
    ];
    let shipsToKill = 10;
    let remaining = service._distributeDamage(combatResult, damageObjects, shipsToKill, true);
    expect(remaining).toBe(0);
    expect(star.ships).toBe(0);
    expect(star.shipsActual).toBe(0);
    expect(carrier.ships).toBe(5);
  });
  it("should distribute damage evenly between star and multiple carriers", async () => {
    let star = {
      _id: new mongoose.Types.ObjectId(),
      ships: 6,
      shipsActual: 6,
      specialistId: null
    };
    let carrierA = {
      _id: new mongoose.Types.ObjectId(),
      ships: 6,
      specialistId: null
    };
    let carrierB = {
      _id: new mongoose.Types.ObjectId(),
      ships: 6,
      specialistId: null
    };
    const combatResult = {
      star,
      carriers: [carrierA, carrierB]
    };
    const damageObjects = [
      star,
      carrierA,
      carrierB
    ];
    let shipsToKill = 6;
    let remaining = service._distributeDamage(combatResult, damageObjects, shipsToKill, true);
    expect(remaining).toBe(0);
    expect(star.ships).toBe(4);
    expect(star.shipsActual).toBe(4);
    expect(carrierA.ships).toBe(4);
    expect(carrierB.ships).toBe(4);
  });
  it("should distribute damage evenly between multiple carriers - Destroy carriers", async () => {
    let star = null;
    let carrierA = {
      _id: new mongoose.Types.ObjectId(),
      ships: 1,
      specialistId: null
    };
    let carrierB = {
      _id: new mongoose.Types.ObjectId(),
      ships: 10,
      specialistId: null
    };
    const combatResult = {
      star,
      carriers: [carrierA, carrierB]
    };
    const damageObjects = [
      carrierA,
      carrierB
    ];
    let shipsToKill = 5;
    let remaining = service._distributeDamage(combatResult, damageObjects, shipsToKill, true);
    expect(remaining).toBe(0);
    expect(carrierA.ships).toBe(0);
    expect(carrierB.ships).toBe(6);
  });
  it("should distribute damage evenly between multiple carriers - Do not destroy carriers", async () => {
    let star = null;
    let carrierA = {
      _id: new mongoose.Types.ObjectId(),
      ships: 1,
      specialistId: null
    };
    let carrierB = {
      _id: new mongoose.Types.ObjectId(),
      ships: 10,
      specialistId: null
    };
    const combatResult = {
      star,
      carriers: [carrierA, carrierB]
    };
    const damageObjects = [
      carrierA,
      carrierB
    ];
    let shipsToKill = 5;
    let remaining = service._distributeDamage(combatResult, damageObjects, shipsToKill, false);
    expect(remaining).toBe(0);
    expect(carrierA.ships).toBe(1);
    expect(carrierB.ships).toBe(5);
  });
  it("should ignore fleets with 0 ships - star", async () => {
    let star = {
      _id: new mongoose.Types.ObjectId(),
      ships: 0,
      shipsActual: 0,
      specialistId: null
    };
    let carrierA = {
      _id: new mongoose.Types.ObjectId(),
      ships: 10,
      specialistId: null
    };
    let carrierB = {
      _id: new mongoose.Types.ObjectId(),
      ships: 10,
      specialistId: null
    };
    const combatResult = {
      star,
      carriers: [carrierA, carrierB]
    };
    const damageObjects = [
      star,
      carrierA,
      carrierB
    ];
    let shipsToKill = 20;
    let remaining = service._distributeDamage(combatResult, damageObjects, shipsToKill, true);
    expect(remaining).toBe(0);
    expect(star.ships).toBe(0);
    expect(star.shipsActual).toBe(0);
    expect(carrierA.ships).toBe(0);
    expect(carrierB.ships).toBe(0);
  });
  it("should ignore fleets with 0 ships - carrier", async () => {
    let star = {
      _id: new mongoose.Types.ObjectId(),
      ships: 10,
      shipsActual: 10,
      specialistId: null
    };
    let carrierA = {
      _id: new mongoose.Types.ObjectId(),
      ships: 0,
      specialistId: null
    };
    let carrierB = {
      _id: new mongoose.Types.ObjectId(),
      ships: 10,
      specialistId: null
    };
    const combatResult = {
      star,
      carriers: [carrierA, carrierB]
    };
    const damageObjects = [
      star,
      carrierA,
      carrierB
    ];
    let shipsToKill = 20;
    let remaining = service._distributeDamage(combatResult, damageObjects, shipsToKill, true);
    expect(remaining).toBe(0);
    expect(star.ships).toBe(0);
    expect(star.shipsActual).toBe(0);
    expect(carrierA.ships).toBe(0);
    expect(carrierB.ships).toBe(0);
  });
  it("should distribute damage evenly between star and carrier but keep carriers alive", async () => {
    let star = {
      _id: new mongoose.Types.ObjectId(),
      ships: 5,
      shipsActual: 5,
      specialistId: null
    };
    let carrier = {
      _id: new mongoose.Types.ObjectId(),
      ships: 10,
      specialistId: null
    };
    const combatResult = {
      star,
      carriers: [carrier]
    };
    const damageObjects = [
      star,
      carrier
    ];
    let shipsToKill = 15;
    let remaining = service._distributeDamage(combatResult, damageObjects, shipsToKill, false);
    expect(remaining).toBe(1);
    expect(star.ships).toBe(0);
    expect(star.shipsActual).toBe(0);
    expect(carrier.ships).toBe(1);
  });
  it("should distribute damage to largest fleets first - star", async () => {
    let star = {
      _id: new mongoose.Types.ObjectId(),
      ships: 100,
      shipsActual: 100,
      specialistId: null
    };
    let carrierA = {
      _id: new mongoose.Types.ObjectId(),
      ships: 10,
      specialistId: null
    };
    let carrierB = {
      _id: new mongoose.Types.ObjectId(),
      ships: 5,
      specialistId: null
    };
    const combatResult = {
      star,
      carriers: [carrierA, carrierB]
    };
    const damageObjects = [
      star,
      carrierA,
      carrierB
    ];
    let shipsToKill = 114;
    let remaining = service._distributeDamage(combatResult, damageObjects, shipsToKill, true);
    expect(remaining).toBe(0);
    expect(star.ships).toBe(1);
    expect(star.shipsActual).toBe(1);
    expect(carrierA.ships).toBe(0);
    expect(carrierB.ships).toBe(0);
  });
  it("should distribute damage to largest fleets first - carrier", async () => {
    let star = {
      _id: new mongoose.Types.ObjectId(),
      ships: 10,
      shipsActual: 10,
      specialistId: null
    };
    let carrierA = {
      _id: new mongoose.Types.ObjectId(),
      ships: 100,
      specialistId: null
    };
    let carrierB = {
      _id: new mongoose.Types.ObjectId(),
      ships: 5,
      specialistId: null
    };
    const combatResult = {
      star,
      carriers: [carrierA, carrierB]
    };
    const damageObjects = [
      star,
      carrierA,
      carrierB
    ];
    let shipsToKill = 114;
    let remaining = service._distributeDamage(combatResult, damageObjects, shipsToKill, true);
    expect(remaining).toBe(0);
    expect(star.ships).toBe(0);
    expect(star.shipsActual).toBe(0);
    expect(carrierA.ships).toBe(1);
    expect(carrierB.ships).toBe(0);
  });
  it("should distribute damage to non-specialists first - star specialist", async () => {
    let star = {
      _id: new mongoose.Types.ObjectId(),
      ships: 1,
      shipsActual: 1,
      specialistId: 1
    };
    let carrierA = {
      _id: new mongoose.Types.ObjectId(),
      ships: 1,
      specialistId: null
    };
    let carrierB = {
      _id: new mongoose.Types.ObjectId(),
      ships: 1,
      specialistId: null
    };
    const combatResult = {
      star,
      carriers: [carrierA, carrierB]
    };
    const damageObjects = [
      star,
      carrierA,
      carrierB
    ];
    let shipsToKill = 2;
    let remaining = service._distributeDamage(combatResult, damageObjects, shipsToKill, true);
    expect(remaining).toBe(0);
    expect(star.ships).toBe(1);
    expect(star.shipsActual).toBe(1);
    expect(carrierA.ships).toBe(0);
    expect(carrierB.ships).toBe(0);
  });
  it("should distribute damage to non-specialists first - star specialist", async () => {
    let star = {
      _id: new mongoose.Types.ObjectId(),
      ships: 1,
      shipsActual: 1,
      specialistId: null
    };
    let carrierA = {
      _id: new mongoose.Types.ObjectId(),
      ships: 1,
      specialistId: 1
    };
    let carrierB = {
      _id: new mongoose.Types.ObjectId(),
      ships: 1,
      specialistId: null
    };
    const combatResult = {
      star,
      carriers: [carrierA, carrierB]
    };
    const damageObjects = [
      star,
      carrierA,
      carrierB
    ];
    let shipsToKill = 2;
    let remaining = service._distributeDamage(combatResult, damageObjects, shipsToKill, true);
    expect(remaining).toBe(0);
    expect(star.ships).toBe(0);
    expect(star.shipsActual).toBe(0);
    expect(carrierA.ships).toBe(1);
    expect(carrierB.ships).toBe(0);
  });
});
//# sourceMappingURL=damage.spec.js.map
