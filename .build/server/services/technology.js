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
var technology_exports = {};
__export(technology_exports, {
  default: () => TechnologyService
});
module.exports = __toCommonJS(technology_exports);
class TechnologyService {
  constructor(specialistService) {
    this.specialistService = specialistService;
  }
  getEnabledTechnologies(game) {
    let techs = Object.keys(game.settings.technology.researchCosts).filter((k) => {
      return k.match(/^[^_\$]/) != null;
    });
    return techs.filter((t) => this.isTechnologyEnabled(game, t));
  }
  isTechnologyEnabled(game, techKey) {
    return game.settings.technology.startingTechnologyLevel[techKey] > 0;
  }
  isTechnologyResearchable(game, technologyKey) {
    return game.settings.technology.researchCosts[technologyKey] !== "none";
  }
  _applyTechModifiers(techs, modifiers, sanitize = true) {
    techs.scanning += modifiers.scanning || 0;
    techs.hyperspace += modifiers.hyperspace || 0;
    techs.terraforming += modifiers.terraforming || 0;
    techs.experimentation += modifiers.experimentation || 0;
    techs.weapons += modifiers.weapons || 0;
    techs.banking += modifiers.banking || 0;
    techs.manufacturing += modifiers.manufacturing || 0;
    techs.specialists += modifiers.specialists || 0;
    if (sanitize) {
      techs.scanning = Math.max(1, techs.scanning);
      techs.hyperspace = Math.max(1, techs.hyperspace);
      techs.terraforming = Math.max(1, techs.terraforming);
      techs.experimentation = Math.max(1, techs.experimentation);
      techs.weapons = Math.max(1, techs.weapons);
      techs.banking = Math.max(1, techs.banking);
      techs.manufacturing = Math.max(1, techs.manufacturing);
      techs.specialists = Math.max(1, techs.specialists);
    }
    return techs;
  }
  getPlayerEffectiveTechnologyLevels(game, player, sanitize = true) {
    if (!player || !player.research) {
      return {
        scanning: 1,
        hyperspace: 1,
        terraforming: 1,
        experimentation: 1,
        weapons: 1,
        banking: 1,
        manufacturing: 1,
        specialists: 1
      };
    }
    let techs = {
      scanning: player.research.scanning.level,
      hyperspace: player.research.hyperspace.level,
      terraforming: player.research.terraforming.level,
      experimentation: player.research.experimentation.level,
      weapons: player.research.weapons.level,
      banking: player.research.banking.level,
      manufacturing: player.research.manufacturing.level,
      specialists: player.research.specialists.level
    };
    return techs;
  }
  getStarEffectiveTechnologyLevels(game, star, sanitize = true) {
    let player = star.ownedByPlayerId ? game.galaxy.players.find((x) => x._id.toString() === star.ownedByPlayerId.toString()) || null : null;
    let techs = this.getPlayerEffectiveTechnologyLevels(game, player, false);
    if (star.specialistId) {
      let specialist = this.specialistService.getByIdStar(star.specialistId);
      if (specialist && specialist.modifiers.local != null) {
        this._applyTechModifiers(techs, specialist.modifiers.local, sanitize);
      }
    }
    if (star.isBlackHole) {
      techs.scanning += 3;
    }
    return techs;
  }
  getCarrierEffectiveTechnologyLevels(game, carrier, sanitize = true) {
    let player = game.galaxy.players.find((x) => x._id.toString() === carrier.ownedByPlayerId.toString()) || null;
    let techs = this.getPlayerEffectiveTechnologyLevels(game, player, false);
    if (carrier.specialistId) {
      let specialist = this.specialistService.getByIdCarrier(carrier.specialistId);
      if (specialist && specialist.modifiers.local != null) {
        this._applyTechModifiers(techs, specialist.modifiers.local, sanitize);
      }
    }
    return techs;
  }
  getStarWeaponsBuff(star) {
    if (star.specialistId) {
      let specialist = this.specialistService.getByIdStar(star.specialistId);
      if (specialist && specialist.modifiers.local != null) {
        return specialist.modifiers.local.weapons || 0;
      }
    }
    return 0;
  }
  getCarrierWeaponsBuff(carrier, isCarrierToStarCombat, isAttacker, allyCount) {
    var _a, _b, _c, _d;
    const buffs = [];
    if (carrier.specialistId) {
      let specialist = this.specialistService.getByIdCarrier(carrier.specialistId);
      if (!specialist) {
        return 0;
      }
      if (specialist.modifiers.local) {
        if (isCarrierToStarCombat && specialist.modifiers.local.carrierToStarCombat) {
          if (isAttacker && ((_a = specialist.modifiers.local.carrierToStarCombat.attacker) == null ? void 0 : _a.weapons)) {
            buffs.push(specialist.modifiers.local.carrierToStarCombat.attacker.weapons);
          }
          if (!isAttacker && ((_b = specialist.modifiers.local.carrierToStarCombat.defender) == null ? void 0 : _b.weapons)) {
            buffs.push(specialist.modifiers.local.carrierToStarCombat.defender.weapons);
          }
          if (isAttacker && ((_c = specialist.modifiers.local.carrierToStarCombat.attacker) == null ? void 0 : _c.weaponsPerAlly)) {
            buffs.push(specialist.modifiers.local.carrierToStarCombat.attacker.weaponsPerAlly * allyCount);
          }
        }
        if (!isCarrierToStarCombat && ((_d = specialist.modifiers.local.carrierToCarrierCombat) == null ? void 0 : _d.weapons)) {
          buffs.push(specialist.modifiers.local.carrierToCarrierCombat.weapons);
        }
        if (specialist.modifiers.local.weapons) {
          buffs.push(specialist.modifiers.local.weapons);
        }
      }
    }
    if (!buffs.length) {
      return 0;
    }
    return buffs.sort((a, b) => b - a)[0];
  }
  getCarriersWeaponsDebuff(carriersToCheck) {
    let deduction = 0;
    if (!carriersToCheck.length) {
      return 0;
    }
    deduction = carriersToCheck.filter((c) => c.specialistId != null).map((c) => {
      let specialist = this.specialistService.getByIdCarrier(c.specialistId);
      if (specialist && specialist.modifiers.special && specialist.modifiers.special.deductEnemyWeapons) {
        return specialist.modifiers.special.deductEnemyWeapons;
      }
      return 0;
    }).sort((a, b) => b - a)[0];
    return deduction || 0;
  }
  getStarEffectiveWeaponsLevel(game, defenders, star, carriersInOrbit) {
    let weapons = defenders.sort((a, b) => b.research.weapons.level - a.research.weapons.level)[0].research.weapons.level;
    let defenderBonus = this.getDefenderBonus(game, star);
    let buffs = [];
    if (carriersInOrbit.length) {
      buffs = carriersInOrbit.map((c) => this.getCarrierWeaponsBuff(c, true, false, defenders.length));
    }
    buffs.push(this.getStarWeaponsBuff(star));
    return this._calculateActualWeaponsBuff(weapons, buffs, defenderBonus);
  }
  getCarriersEffectiveWeaponsLevel(game, players, carriers, isCarrierToStarCombat, isAttacker) {
    let weapons = players.sort((a, b) => b.research.weapons.level - a.research.weapons.level)[0].research.weapons.level;
    if (!carriers.length) {
      return weapons;
    }
    let buffs = carriers.map((c) => this.getCarrierWeaponsBuff(c, isCarrierToStarCombat, isAttacker, players.length));
    return this._calculateActualWeaponsBuff(weapons, buffs, 0);
  }
  _calculateActualWeaponsBuff(weapons, buffs, additionalBuff) {
    let buff = Math.max(0, buffs.sort((a, b) => b - a)[0]);
    let debuff = buffs.sort((a, b) => a - b)[0];
    let actualBuff = debuff < 0 ? debuff + buff : buff;
    return Math.max(1, weapons + actualBuff + additionalBuff);
  }
  getDefenderBonus(game, star) {
    var _a;
    let bonus = game.settings.specialGalaxy.defenderBonus === "enabled" ? 1 : 0;
    if (star.isAsteroidField) {
      bonus++;
    }
    if (star.specialistId) {
      let specialist = this.specialistService.getByIdStar(star.specialistId);
      if (specialist && ((_a = specialist.modifiers.special) == null ? void 0 : _a.defenderBonus)) {
        bonus += specialist.modifiers.special.defenderBonus;
      }
    }
    if (star.homeStar) {
      bonus *= game.constants.star.homeStarDefenderBonusMultiplier;
    }
    return bonus;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=technology.js.map
