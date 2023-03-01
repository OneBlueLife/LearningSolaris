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
var import_carrier = __toESM(require("../services/carrier"));
describe("carrier", () => {
  let carrierService;
  beforeAll(() => {
    carrierService = new import_carrier.default();
  });
  it("should create a carrier at a star", () => {
    const star = {
      _id: "123",
      location: {
        x: 10,
        y: 15
      },
      name: "Super star",
      ships: 10,
      shipsActual: 10
    };
    const ships = 1;
    const newCarrier = carrierService.createAtStar(star, [], ships);
    expect(newCarrier).not.toBe(null);
    expect(newCarrier.ships).toEqual(ships);
    expect(newCarrier.orbiting).toBe(star._id);
    expect(newCarrier.location).toEqual(star.location);
    expect(newCarrier.name).toContain(star.name);
  });
  it("should deduct the ships from the garrisoning star", () => {
    const star = {
      _id: "123",
      location: {
        x: 10,
        y: 15
      },
      name: "Super star",
      ships: 10,
      shipsActual: 10
    };
    const ships = 5;
    const newCarrier = carrierService.createAtStar(star, [], ships);
    expect(newCarrier.ships).toEqual(ships);
    expect(star.ships).toEqual(5);
  });
});
//# sourceMappingURL=carrier.spec.js.map
