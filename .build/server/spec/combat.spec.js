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
const fakeTechnologyService = {
  getStarEffectiveWeaponsLevel(game, defenders, star, defenderCarriers) {
    return 1;
  },
  getCarriersEffectiveWeaponsLevel(game, attackers, attackerCarriers, isCarrierToStarCombat) {
    return 1;
  },
  getCarriersWeaponsDebuff(carriers) {
    return 0;
  }
};
const fakeSpecialistService = {};
const fakePlayerService = {};
const fakeStarService = {};
const fakeReputationService = {};
const fakeDiplomacyService = {};
describe("combat", () => {
  const service = new import_combat.default(fakeTechnologyService, fakeSpecialistService, fakePlayerService, fakeStarService, fakeReputationService, fakeDiplomacyService);
  it("should calculate basic combat", async () => {
    const defender = {
      ships: 10,
      weaponsLevel: 1
    };
    const attacker = {
      ships: 20,
      weaponsLevel: 1
    };
    const isTurnBased = false;
    const calculatedNeeded = false;
    const combatResult = service.calculate(defender, attacker, isTurnBased, calculatedNeeded);
    expect(combatResult.weapons.defender).toBe(defender.weaponsLevel);
    expect(combatResult.weapons.attacker).toBe(attacker.weaponsLevel);
    expect(combatResult.weapons.defenderBase).toBe(defender.weaponsLevel);
    expect(combatResult.weapons.attackerBase).toBe(attacker.weaponsLevel);
    expect(combatResult.before.defender).toBe(defender.ships);
    expect(combatResult.before.attacker).toBe(attacker.ships);
    expect(combatResult.after.defender).toBe(0);
    expect(combatResult.after.attacker).toBe(10);
    expect(combatResult.lost.defender).toBe(10);
    expect(combatResult.lost.attacker).toBe(10);
  });
  it("should calculate basic turn based combat - attacker wins", async () => {
    const defender = {
      ships: 10,
      weaponsLevel: 1
    };
    const attacker = {
      ships: 20,
      weaponsLevel: 1
    };
    const isTurnBased = true;
    const calculatedNeeded = false;
    const combatResult = service.calculate(defender, attacker, isTurnBased, calculatedNeeded);
    expect(combatResult.weapons.defender).toBe(defender.weaponsLevel);
    expect(combatResult.weapons.attacker).toBe(attacker.weaponsLevel);
    expect(combatResult.weapons.defenderBase).toBe(defender.weaponsLevel);
    expect(combatResult.weapons.attackerBase).toBe(attacker.weaponsLevel);
    expect(combatResult.before.defender).toBe(defender.ships);
    expect(combatResult.before.attacker).toBe(attacker.ships);
    expect(combatResult.after.defender).toBe(0);
    expect(combatResult.after.attacker).toBe(10);
    expect(combatResult.lost.defender).toBe(10);
    expect(combatResult.lost.attacker).toBe(10);
  });
  it("should calculate basic turn based combat - defender wins", async () => {
    const defender = {
      ships: 20,
      weaponsLevel: 1
    };
    const attacker = {
      ships: 10,
      weaponsLevel: 1
    };
    const isTurnBased = true;
    const calculatedNeeded = false;
    const combatResult = service.calculate(defender, attacker, isTurnBased, calculatedNeeded);
    expect(combatResult.weapons.defender).toBe(defender.weaponsLevel);
    expect(combatResult.weapons.attacker).toBe(attacker.weaponsLevel);
    expect(combatResult.weapons.defenderBase).toBe(defender.weaponsLevel);
    expect(combatResult.weapons.attackerBase).toBe(attacker.weaponsLevel);
    expect(combatResult.before.defender).toBe(defender.ships);
    expect(combatResult.before.attacker).toBe(attacker.ships);
    expect(combatResult.after.defender).toBe(11);
    expect(combatResult.after.attacker).toBe(0);
    expect(combatResult.lost.defender).toBe(9);
    expect(combatResult.lost.attacker).toBe(10);
  });
  it("should calculate carrier to star combat - carriers vs. star garrison - defender wins", async () => {
    const game = {};
    const star = {
      shipsActual: 10
    };
    const defenders = [];
    const attackers = [];
    const defenderCarriers = [];
    const attackerCarriers = [
      {
        ships: 3
      },
      {
        ships: 7
      }
    ];
    const combatResult = service.calculateStar(game, star, defenders, attackers, defenderCarriers, attackerCarriers);
    expect(combatResult.weapons.defender).toBe(1);
    expect(combatResult.weapons.attacker).toBe(1);
    expect(combatResult.weapons.defenderBase).toBe(1);
    expect(combatResult.weapons.attackerBase).toBe(1);
    expect(combatResult.before.defender).toBe(10);
    expect(combatResult.before.attacker).toBe(10);
    expect(combatResult.after.defender).toBe(1);
    expect(combatResult.after.attacker).toBe(0);
    expect(combatResult.lost.defender).toBe(9);
    expect(combatResult.lost.attacker).toBe(10);
  });
  it("should calculate carrier to star combat - carriers vs. star garrison - attacker wins", async () => {
    const game = {};
    const star = {
      shipsActual: 10
    };
    const defenders = [];
    const attackers = [];
    const defenderCarriers = [];
    const attackerCarriers = [
      {
        ships: 30
      },
      {
        ships: 70
      }
    ];
    const combatResult = service.calculateStar(game, star, defenders, attackers, defenderCarriers, attackerCarriers);
    expect(combatResult.weapons.defender).toBe(1);
    expect(combatResult.weapons.attacker).toBe(1);
    expect(combatResult.weapons.defenderBase).toBe(1);
    expect(combatResult.weapons.attackerBase).toBe(1);
    expect(combatResult.before.defender).toBe(10);
    expect(combatResult.before.attacker).toBe(100);
    expect(combatResult.after.defender).toBe(0);
    expect(combatResult.after.attacker).toBe(90);
    expect(combatResult.lost.defender).toBe(10);
    expect(combatResult.lost.attacker).toBe(10);
  });
  it("should calculate carrier to star combat - carriers vs. carriers - defender wins", async () => {
    const game = {};
    const star = {
      shipsActual: 0
    };
    const defenders = [];
    const attackers = [];
    const defenderCarriers = [
      {
        ships: 10
      }
    ];
    const attackerCarriers = [
      {
        ships: 3
      },
      {
        ships: 7
      }
    ];
    const combatResult = service.calculateStar(game, star, defenders, attackers, defenderCarriers, attackerCarriers);
    expect(combatResult.weapons.defender).toBe(1);
    expect(combatResult.weapons.attacker).toBe(1);
    expect(combatResult.weapons.defenderBase).toBe(1);
    expect(combatResult.weapons.attackerBase).toBe(1);
    expect(combatResult.before.defender).toBe(10);
    expect(combatResult.before.attacker).toBe(10);
    expect(combatResult.after.defender).toBe(1);
    expect(combatResult.after.attacker).toBe(0);
    expect(combatResult.lost.defender).toBe(9);
    expect(combatResult.lost.attacker).toBe(10);
  });
  it("should calculate carrier to star combat - carriers vs. carriers - attacker wins", async () => {
    const game = {};
    const star = {
      shipsActual: 0
    };
    const defenders = [];
    const attackers = [];
    const defenderCarriers = [
      {
        ships: 10
      }
    ];
    const attackerCarriers = [
      {
        ships: 30
      },
      {
        ships: 70
      }
    ];
    const combatResult = service.calculateStar(game, star, defenders, attackers, defenderCarriers, attackerCarriers);
    expect(combatResult.weapons.defender).toBe(1);
    expect(combatResult.weapons.attacker).toBe(1);
    expect(combatResult.weapons.defenderBase).toBe(1);
    expect(combatResult.weapons.attackerBase).toBe(1);
    expect(combatResult.before.defender).toBe(10);
    expect(combatResult.before.attacker).toBe(100);
    expect(combatResult.after.defender).toBe(0);
    expect(combatResult.after.attacker).toBe(90);
    expect(combatResult.lost.defender).toBe(10);
    expect(combatResult.lost.attacker).toBe(10);
  });
  it("should calculate carrier to carrier combat - mutual destruction", async () => {
    const game = {};
    const defenders = [];
    const attackers = [];
    const defenderCarriers = [
      {
        ships: 10
      }
    ];
    const attackerCarriers = [
      {
        ships: 3
      },
      {
        ships: 7
      }
    ];
    const combatResult = service.calculateCarrier(game, defenders, attackers, defenderCarriers, attackerCarriers);
    expect(combatResult.weapons.defender).toBe(1);
    expect(combatResult.weapons.attacker).toBe(1);
    expect(combatResult.weapons.defenderBase).toBe(1);
    expect(combatResult.weapons.attackerBase).toBe(1);
    expect(combatResult.before.defender).toBe(10);
    expect(combatResult.before.attacker).toBe(10);
    expect(combatResult.after.defender).toBe(0);
    expect(combatResult.after.attacker).toBe(0);
    expect(combatResult.lost.defender).toBe(10);
    expect(combatResult.lost.attacker).toBe(10);
  });
  it("should calculate carrier to carrier combat - defender wins", async () => {
    const game = {};
    const defenders = [];
    const attackers = [];
    const defenderCarriers = [
      {
        ships: 100
      }
    ];
    const attackerCarriers = [
      {
        ships: 3
      },
      {
        ships: 7
      }
    ];
    const combatResult = service.calculateCarrier(game, defenders, attackers, defenderCarriers, attackerCarriers);
    expect(combatResult.weapons.defender).toBe(1);
    expect(combatResult.weapons.attacker).toBe(1);
    expect(combatResult.weapons.defenderBase).toBe(1);
    expect(combatResult.weapons.attackerBase).toBe(1);
    expect(combatResult.before.defender).toBe(100);
    expect(combatResult.before.attacker).toBe(10);
    expect(combatResult.after.defender).toBe(90);
    expect(combatResult.after.attacker).toBe(0);
    expect(combatResult.lost.defender).toBe(10);
    expect(combatResult.lost.attacker).toBe(10);
  });
  it("should calculate carrier to carrier combat - attacker wins", async () => {
    const game = {};
    const defenders = [];
    const attackers = [];
    const defenderCarriers = [
      {
        ships: 10
      }
    ];
    const attackerCarriers = [
      {
        ships: 30
      },
      {
        ships: 70
      }
    ];
    const combatResult = service.calculateCarrier(game, defenders, attackers, defenderCarriers, attackerCarriers);
    expect(combatResult.weapons.defender).toBe(1);
    expect(combatResult.weapons.attacker).toBe(1);
    expect(combatResult.weapons.defenderBase).toBe(1);
    expect(combatResult.weapons.attackerBase).toBe(1);
    expect(combatResult.before.defender).toBe(10);
    expect(combatResult.before.attacker).toBe(100);
    expect(combatResult.after.defender).toBe(0);
    expect(combatResult.after.attacker).toBe(90);
    expect(combatResult.lost.defender).toBe(10);
    expect(combatResult.lost.attacker).toBe(10);
  });
  it("should destroy carriers in carrier to carrier combat if they cannot withstand a single blow - defender wins", async () => {
    const game = {};
    const defenders = [];
    const attackers = [];
    const defenderCarriers = [
      {
        ships: 10
      }
    ];
    const attackerCarriers = [
      {
        ships: 1
      }
    ];
    const combatResult = service.calculateCarrier(game, defenders, attackers, defenderCarriers, attackerCarriers);
    expect(combatResult.weapons.defender).toBe(1);
    expect(combatResult.weapons.attacker).toBe(1);
    expect(combatResult.weapons.defenderBase).toBe(1);
    expect(combatResult.weapons.attackerBase).toBe(1);
    expect(combatResult.before.defender).toBe(10);
    expect(combatResult.before.attacker).toBe(1);
    expect(combatResult.after.defender).toBe(9);
    expect(combatResult.after.attacker).toBe(0);
    expect(combatResult.lost.defender).toBe(1);
    expect(combatResult.lost.attacker).toBe(1);
  });
  it("should destroy carriers in carrier to carrier combat if they cannot withstand a single blow - attacker wins", async () => {
    const game = {};
    const defenders = [];
    const attackers = [];
    const defenderCarriers = [
      {
        ships: 1
      }
    ];
    const attackerCarriers = [
      {
        ships: 10
      }
    ];
    const combatResult = service.calculateCarrier(game, defenders, attackers, defenderCarriers, attackerCarriers);
    expect(combatResult.weapons.defender).toBe(1);
    expect(combatResult.weapons.attacker).toBe(1);
    expect(combatResult.weapons.defenderBase).toBe(1);
    expect(combatResult.weapons.attackerBase).toBe(1);
    expect(combatResult.before.defender).toBe(1);
    expect(combatResult.before.attacker).toBe(10);
    expect(combatResult.after.defender).toBe(0);
    expect(combatResult.after.attacker).toBe(9);
    expect(combatResult.lost.defender).toBe(1);
    expect(combatResult.lost.attacker).toBe(1);
  });
});
//# sourceMappingURL=combat.spec.js.map
