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
var combat_exports = {};
__export(combat_exports, {
  CombatServiceEvents: () => CombatServiceEvents,
  default: () => CombatService
});
module.exports = __toCommonJS(combat_exports);
const EventEmitter = require("events");
const CombatServiceEvents = {
  onPlayerCombatStar: "onPlayerCombatStar",
  onPlayerCombatCarrier: "onPlayerCombatCarrier"
};
class CombatService extends EventEmitter {
  constructor(technologyService, specialistService, playerService, starService, reputationService, diplomacyService, gameTypeService) {
    super();
    this.technologyService = technologyService;
    this.specialistService = specialistService;
    this.playerService = playerService;
    this.starService = starService;
    this.reputationService = reputationService;
    this.diplomacyService = diplomacyService;
    this.gameTypeService = gameTypeService;
  }
  calculate(defender, attacker, isTurnBased = true, calculateNeeded = false) {
    let defenderShipsRemaining = defender.ships;
    let attackerShipsRemaining = attacker.ships;
    let defendPowerBase = defender.weaponsLevel;
    let attackPowerBase = attacker.weaponsLevel;
    let defendPower = defender.weaponsLevel;
    let attackPower = attacker.weaponsLevel;
    if (!isTurnBased) {
      if (defender.ships <= attacker.weaponsLevel) {
        defendPower = 1;
      }
      if (attacker.ships <= defender.weaponsLevel) {
        attackPower = 1;
      }
    }
    const defenderAdditionalTurns = isTurnBased ? 1 : 0;
    const defenderTurns = Math.ceil(attacker.ships / defendPower);
    const attackerTurns = Math.ceil(defender.ships / attackPower);
    let needed = null;
    if (defenderTurns <= attackerTurns) {
      attackerShipsRemaining = 0;
      defenderShipsRemaining = defender.ships - (defenderTurns - defenderAdditionalTurns) * attackPower;
      if (calculateNeeded) {
        needed = {
          defender: 0,
          attacker: attackerTurns * defendPower + 1
        };
      }
    } else {
      defenderShipsRemaining = 0;
      attackerShipsRemaining = attacker.ships - attackerTurns * defendPower;
      if (calculateNeeded) {
        needed = {
          attacker: 0,
          defender: (defenderTurns - defenderAdditionalTurns) * attackPower + defenderAdditionalTurns
        };
      }
    }
    attackerShipsRemaining = Math.max(0, attackerShipsRemaining);
    defenderShipsRemaining = Math.max(0, defenderShipsRemaining);
    let result = {
      weapons: {
        defender: defendPower,
        defenderBase: defendPowerBase,
        attacker: attackPower,
        attackerBase: attackPowerBase
      },
      before: {
        defender: defender.ships,
        attacker: attacker.ships
      },
      after: {
        defender: defenderShipsRemaining,
        attacker: attackerShipsRemaining
      },
      lost: {
        defender: defender.ships - defenderShipsRemaining,
        attacker: attacker.ships - attackerShipsRemaining
      }
    };
    if (calculateNeeded) {
      result.needed = needed;
    }
    return result;
  }
  calculateStar(game, star, defenders, attackers, defenderCarriers, attackerCarriers, calculateNeeded = false) {
    let combatWeapons = this._calculateEffectiveWeaponsLevels(game, star, defenders, attackers, defenderCarriers, attackerCarriers);
    let combatResult = this.calculate({
      weaponsLevel: combatWeapons.defenderWeaponsTechLevel,
      ships: combatWeapons.totalDefenders
    }, {
      weaponsLevel: combatWeapons.attackerWeaponsTechLevel,
      ships: combatWeapons.totalAttackers
    }, true, calculateNeeded);
    return combatResult;
  }
  calculateCarrier(game, defenders, attackers, defenderCarriers, attackerCarriers) {
    let combatWeapons = this._calculateEffectiveWeaponsLevels(game, null, defenders, attackers, defenderCarriers, attackerCarriers);
    let combatResult = this.calculate({
      weaponsLevel: combatWeapons.defenderWeaponsTechLevel,
      ships: combatWeapons.totalDefenders
    }, {
      weaponsLevel: combatWeapons.attackerWeaponsTechLevel,
      ships: combatWeapons.totalAttackers
    }, false);
    return combatResult;
  }
  _calculateEffectiveWeaponsLevels(game, star, defenders, attackers, defenderCarriers, attackerCarriers) {
    let isCarrierToStarCombat = star != null;
    let totalDefenders = defenderCarriers.reduce((sum, c) => sum + c.ships, 0);
    if (isCarrierToStarCombat) {
      totalDefenders += Math.floor(star.shipsActual);
    }
    let totalAttackers = attackerCarriers.reduce((sum, c) => sum + c.ships, 0);
    let defenderWeaponsTechLevel;
    if (isCarrierToStarCombat) {
      defenderWeaponsTechLevel = this.technologyService.getStarEffectiveWeaponsLevel(game, defenders, star, defenderCarriers);
    } else {
      defenderWeaponsTechLevel = this.technologyService.getCarriersEffectiveWeaponsLevel(game, defenders, defenderCarriers, isCarrierToStarCombat, false);
    }
    let attackerWeaponsTechLevel = this.technologyService.getCarriersEffectiveWeaponsLevel(game, attackers, attackerCarriers, isCarrierToStarCombat, true);
    let defenderWeaponsDeduction = this.technologyService.getCarriersWeaponsDebuff(attackerCarriers);
    let attackerWeaponsDeduction = this.technologyService.getCarriersWeaponsDebuff(defenderCarriers);
    defenderWeaponsTechLevel = Math.max(defenderWeaponsTechLevel - defenderWeaponsDeduction, 1);
    attackerWeaponsTechLevel = Math.max(attackerWeaponsTechLevel - attackerWeaponsDeduction, 1);
    let defenderSwapWeapons = this._shouldSwapWeaponsTech(defenderCarriers);
    let attackerSwapWeapons = this._shouldSwapWeaponsTech(attackerCarriers);
    let shouldSwapWeaponsTech = isCarrierToStarCombat && attackerSwapWeapons && !defenderSwapWeapons || !isCarrierToStarCombat && attackerSwapWeapons !== defenderSwapWeapons;
    if (shouldSwapWeaponsTech) {
      let oldDefenderWeaponsTechLevel = defenderWeaponsTechLevel;
      let oldAttackerWeaponsTechLevel = attackerWeaponsTechLevel;
      defenderWeaponsTechLevel = oldAttackerWeaponsTechLevel;
      attackerWeaponsTechLevel = oldDefenderWeaponsTechLevel;
    }
    return {
      totalDefenders,
      totalAttackers,
      defenderWeaponsTechLevel,
      attackerWeaponsTechLevel
    };
  }
  async performCombat(game, gameUsers, defender, star, carriers) {
    const isFormalAlliancesEnabled = this.diplomacyService.isFormalAlliancesEnabled(game);
    let defenderAllies = [];
    if (isFormalAlliancesEnabled) {
      defenderAllies = this.diplomacyService.getAlliesOfPlayer(game, defender);
    }
    let defenderCarriers = carriers.filter(
      (c) => c.ships > 0 && !c.isGift && c.ownedByPlayerId.toString() === defender._id.toString() || defenderAllies.find((a) => a._id.toString() === c.ownedByPlayerId.toString())
    ).sort((a, b) => b.ships - a.ships);
    if (!star && !defenderCarriers.length) {
      return;
    }
    let attackerCarriers = carriers.filter(
      (c) => c.ships > 0 && !c.isGift && c.ownedByPlayerId.toString() !== defender._id.toString() && !defenderAllies.find((a) => a._id.toString() === c.ownedByPlayerId.toString())
    ).sort((a, b) => b.ships - a.ships);
    if (!attackerCarriers.length) {
      return;
    }
    let defenderPlayerIds = defenderCarriers.map((c) => c.ownedByPlayerId.toString());
    defenderPlayerIds.push(defender._id.toString());
    defenderPlayerIds = [...new Set(defenderPlayerIds)];
    let attackerPlayerIds = [...new Set(attackerCarriers.map((c) => c.ownedByPlayerId.toString()))];
    let defenders = defenderPlayerIds.map((playerId) => this.playerService.getById(game, playerId));
    let attackers = attackerPlayerIds.map((playerId) => this.playerService.getById(game, playerId));
    let defenderUsers = [];
    let attackerUsers = [];
    for (let defender2 of defenders) {
      let user = gameUsers.find((u) => defender2.userId && u._id.toString() === defender2.userId.toString());
      if (user) {
        defenderUsers.push(user);
      }
    }
    for (let attacker of attackers) {
      let user = gameUsers.find((u) => attacker.userId && u._id.toString() === attacker.userId.toString());
      if (user) {
        attackerUsers.push(user);
      }
    }
    let combatResultShips;
    if (star) {
      combatResultShips = this.calculateStar(game, star, defenders, attackers, defenderCarriers, attackerCarriers);
    } else {
      combatResultShips = this.calculateCarrier(game, defenders, attackers, defenderCarriers, attackerCarriers);
    }
    let combatResult = {
      ...combatResultShips,
      star: null,
      carriers: []
    };
    combatResult.carriers = carriers.map((c) => {
      let specialist = this.specialistService.getByIdCarrierTrim(c.specialistId);
      let scrambled = star && star.isNebula && defenderPlayerIds.includes(c.ownedByPlayerId.toString()) || this.specialistService.getCarrierHideShips(c);
      return {
        _id: c._id,
        name: c.name,
        ownedByPlayerId: c.ownedByPlayerId,
        specialist,
        before: c.ships,
        lost: 0,
        after: c.ships,
        scrambled
      };
    });
    if (star) {
      let specialist = this.specialistService.getByIdStarTrim(star.specialistId);
      let scrambled = star.isNebula || this.specialistService.getStarHideShips(star);
      combatResult.star = {
        _id: star._id,
        ownedByPlayerId: star.ownedByPlayerId,
        specialist,
        before: Math.floor(star.shipsActual),
        lost: 0,
        after: Math.floor(star.shipsActual),
        scrambled
      };
    }
    let defenderObjects = [...defenderCarriers];
    if (star) {
      defenderObjects.push(star);
    }
    this._distributeDamage(combatResult, attackerCarriers, combatResult.lost.attacker, true);
    this._distributeDamage(combatResult, defenderObjects, combatResult.lost.defender, true);
    if (!this.gameTypeService.isTutorialGame(game)) {
      this._updatePlayersCombatAchievements(combatResult, defenders, defenderUsers, defenderCarriers, attackers, attackerUsers, attackerCarriers);
    }
    let destroyedCarriers = game.galaxy.carriers.filter((c) => !c.ships);
    for (let carrier of destroyedCarriers) {
      game.galaxy.carriers.splice(game.galaxy.carriers.indexOf(carrier), 1);
      if (attackerCarriers.indexOf(carrier) > -1) {
        attackerCarriers.splice(attackerCarriers.indexOf(carrier), 1);
      }
      if (defenderCarriers.indexOf(carrier) > -1) {
        defenderCarriers.splice(defenderCarriers.indexOf(carrier), 1);
      }
    }
    let captureResult = null;
    if (star) {
      captureResult = this._starDefeatedCheck(game, star, defender, defenders, defenderUsers, defenderCarriers, attackers, attackerUsers, attackerCarriers);
    }
    for (let defenderPlayer of defenders) {
      for (let attackerPlayer of attackers) {
        await this.reputationService.decreaseReputation(game, attackerPlayer, defenderPlayer, false);
        await this.reputationService.decreaseReputation(game, defenderPlayer, attackerPlayer, false);
      }
    }
    if (star) {
      this.emit(CombatServiceEvents.onPlayerCombatStar, {
        gameId: game._id,
        gameTick: game.state.tick,
        owner: defender,
        defenders,
        attackers,
        star,
        combatResult,
        captureResult
      });
    } else {
      this.emit(CombatServiceEvents.onPlayerCombatCarrier, {
        gameId: game._id,
        gameTick: game.state.tick,
        defenders,
        attackers,
        combatResult
      });
    }
    attackerPlayerIds = [...new Set(attackerCarriers.map((c) => c.ownedByPlayerId.toString()))];
    if (attackerPlayerIds.length > 1) {
      if (star) {
        defender = this.playerService.getById(game, star.ownedByPlayerId);
      } else {
        defender = this.playerService.getById(game, attackerPlayerIds[0]);
      }
      await this.performCombat(game, gameUsers, defender, star, attackerCarriers);
    }
    return combatResultShips;
  }
  _starDefeatedCheck(game, star, owner, defenders, defenderUsers, defenderCarriers, attackers, attackerUsers, attackerCarriers) {
    let starDefenderDefeated = star && !Math.floor(star.shipsActual) && !defenderCarriers.length;
    let hasAttackersRemaining = attackerCarriers.reduce((sum, c) => sum + c.ships, 0) > 0;
    let hasCapturedStar = starDefenderDefeated && hasAttackersRemaining;
    if (hasCapturedStar) {
      return this.starService.captureStar(game, star, owner, defenders, defenderUsers, attackers, attackerUsers, attackerCarriers);
    }
    return null;
  }
  _distributeDamage(combatResult, damageObjects, shipsToKill, destroyCarriers = true) {
    while (shipsToKill) {
      let objectsToDeduct = damageObjects.filter(
        (c) => c.ships > 0 && (c.shipsActual != null || destroyCarriers || c.ships > 1)
      ).sort((a, b) => {
        if (a.specialistId == null && b.specialistId != null) {
          return -1;
        } else if (a.specialistId != null && b.specialistId == null) {
          return 1;
        }
        if (a.ships > b.ships)
          return -1;
        if (a.ships < b.ships)
          return 1;
        return 0;
      });
      if (!objectsToDeduct.length) {
        return shipsToKill;
      }
      let shipsPerObject = Math.max(1, Math.floor(shipsToKill / objectsToDeduct.length));
      for (let obj of objectsToDeduct) {
        let isCarrier = obj.shipsActual == null;
        let combatObject = combatResult.carriers.find((c) => c._id.toString() === obj._id.toString()) || combatResult.star;
        let killed;
        if (!destroyCarriers && isCarrier) {
          killed = Math.min(obj.ships - 1, shipsPerObject);
        } else {
          killed = Math.min(obj.ships, shipsPerObject);
        }
        killed = Math.max(0, killed);
        combatObject.after = combatObject.after - killed;
        combatObject.lost = combatObject.lost + killed;
        shipsToKill -= killed;
        if (isCarrier) {
          obj.ships -= killed;
        } else {
          obj.shipsActual -= killed;
          obj.ships = Math.floor(obj.shipsActual);
        }
        if (!shipsToKill) {
          break;
        }
      }
    }
    return shipsToKill;
  }
  _updatePlayersCombatAchievements(combatResult, defenders, defenderUsers, defenderCarriers, attackers, attackerUsers, attackerCarriers) {
    let defenderCarriersDestroyed = defenderCarriers.filter((c) => !c.ships).length;
    let defenderSpecialistsDestroyed = defenderCarriers.filter((c) => !c.ships && c.specialistId).length;
    let attackerCarriersDestroyed = attackerCarriers.filter((c) => !c.ships).length;
    let attackerSpecialistsDestroyed = attackerCarriers.filter((c) => !c.ships && c.specialistId).length;
    for (let defenderUser of defenderUsers) {
      let defender = defenders.find((u) => u.userId && u.userId.toString() === defenderUser._id.toString());
      if (defender && !defender.defeated) {
        let playerCarriers = defenderCarriers.filter((c) => c.ownedByPlayerId.toString() === defender._id.toString());
        defenderUser.achievements.combat.kills.ships += combatResult.lost.attacker;
        defenderUser.achievements.combat.kills.carriers += attackerCarriersDestroyed;
        defenderUser.achievements.combat.kills.specialists += attackerSpecialistsDestroyed;
        defenderUser.achievements.combat.losses.ships += combatResult.lost.defender;
        defenderUser.achievements.combat.losses.carriers += playerCarriers.filter((c) => !c.ships).length;
        defenderUser.achievements.combat.losses.specialists += playerCarriers.filter((c) => !c.ships && c.specialistId).length;
      }
    }
    for (let attackerUser of attackerUsers) {
      let attacker = attackers.find((u) => u.userId && u.userId.toString() === attackerUser._id.toString());
      if (attacker && !attacker.defeated) {
        let playerCarriers = attackerCarriers.filter((c) => c.ownedByPlayerId.toString() === attacker._id.toString());
        attackerUser.achievements.combat.kills.ships += combatResult.lost.defender;
        attackerUser.achievements.combat.kills.carriers += defenderCarriersDestroyed;
        attackerUser.achievements.combat.kills.specialists += defenderSpecialistsDestroyed;
        attackerUser.achievements.combat.losses.ships += combatResult.lost.attacker;
        attackerUser.achievements.combat.losses.carriers += playerCarriers.filter((c) => !c.ships).length;
        attackerUser.achievements.combat.losses.specialists += playerCarriers.filter((c) => !c.ships && c.specialistId).length;
      }
    }
  }
  _shouldSwapWeaponsTech(carriers) {
    return carriers.filter((c) => c.specialistId).find((c) => {
      var _a, _b;
      return (_b = (_a = this.specialistService.getByIdCarrier(c.specialistId)) == null ? void 0 : _a.modifiers.special) == null ? void 0 : _b.combatSwapWeaponsTechnology;
    }) != null;
  }
  sanitiseCombatResult(combatResult, player) {
    let result = Object.assign({}, combatResult);
    if (result.star) {
      result.star = this.tryMaskObjectShips(combatResult.star, player);
    }
    result.carriers = combatResult.carriers.map((c) => this.tryMaskObjectShips(c, player));
    return result;
  }
  tryMaskObjectShips(carrierOrStar, player) {
    if (!carrierOrStar) {
      return carrierOrStar;
    }
    if (carrierOrStar.scrambled && carrierOrStar.ownedByPlayerId && player._id.toString() !== carrierOrStar.ownedByPlayerId.toString()) {
      let clone = Object.assign({}, carrierOrStar);
      clone.before = "???";
      clone.lost = "???";
      if (carrierOrStar.before === 0 || carrierOrStar.after > 0) {
        clone.after = "???";
      }
      return clone;
    }
    return carrierOrStar;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CombatServiceEvents
});
//# sourceMappingURL=combat.js.map
