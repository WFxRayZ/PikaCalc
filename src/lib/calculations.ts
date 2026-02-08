import { BaseStat, CalculatedStats, EVs, IVs, Nature, StatName } from '@/types';

/**
 * Calculate a single stat for a Pokémon
 * Formula: ((2 * Base + IV + (EV / 4)) * Level / 100 + 5) * Nature modifier
 * For HP: ((2 * Base + IV + (EV / 4)) * Level / 100 + Level + 1)
 */
export function calculateStat(
  base: number,
  iv: number,
  ev: number,
  level: number,
  statName: StatName,
  nature: Nature | null,
): number {
  // Cap IV at 31
  const cappedIV = Math.min(31, Math.max(0, iv));
  // Cap EV at 252
  const cappedEV = Math.min(252, Math.max(0, ev));

  let stat: number;

  if (statName === 'hp') {
    // HP formula is special
    stat = Math.floor((2 * base + cappedIV + Math.floor(cappedEV / 4)) * level / 100) + level + 1;
  } else {
    stat = Math.floor((2 * base + cappedIV + Math.floor(cappedEV / 4)) * level / 100) + 5;
    
    // Apply nature modifier
    if (nature) {
      if (nature.increased === statName) {
        stat = Math.floor(stat * 1.1);
      } else if (nature.decreased === statName) {
        stat = Math.floor(stat * 0.9);
      }
    }
  }

  return stat;
}

/**
 * Calculate all stats for a Pokémon
 */
export function calculateAllStats(
  baseStats: BaseStat,
  ivs: IVs,
  evs: EVs,
  level: number,
  nature: Nature | null,
): CalculatedStats {
  return {
    hp: calculateStat(baseStats.hp, ivs.hp, evs.hp, level, 'hp', nature),
    attack: calculateStat(baseStats.attack, ivs.attack, evs.attack, level, 'attack', nature),
    defense: calculateStat(baseStats.defense, ivs.defense, evs.defense, level, 'defense', nature),
    'special-attack': calculateStat(
      baseStats['special-attack'],
      ivs['special-attack'],
      evs['special-attack'],
      level,
      'special-attack',
      nature,
    ),
    'special-defense': calculateStat(
      baseStats['special-defense'],
      ivs['special-defense'],
      evs['special-defense'],
      level,
      'special-defense',
      nature,
    ),
    speed: calculateStat(baseStats.speed, ivs.speed, evs.speed, level, 'speed', nature),
  };
}

/**
 * Get the total EV allocation
 */
export function getTotalEV(evs: EVs): number {
  return evs.hp + evs.attack + evs.defense + evs['special-attack'] + evs['special-defense'] + evs.speed;
}

/**
 * Check if EVs are valid (max 252 per stat, 508 total)
 */
export function isValidEVs(evs: EVs): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (evs.hp > 252) errors.push('HP EV cannot exceed 252');
  if (evs.attack > 252) errors.push('Attack EV cannot exceed 252');
  if (evs.defense > 252) errors.push('Defense EV cannot exceed 252');
  if (evs['special-attack'] > 252) errors.push('Special Attack EV cannot exceed 252');
  if (evs['special-defense'] > 252) errors.push('Special Defense EV cannot exceed 252');
  if (evs.speed > 252) errors.push('Speed EV cannot exceed 252');

  const total = getTotalEV(evs);
  if (total > 508) errors.push(`Total EV is ${total}, cannot exceed 508`);

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get remaining EVs available
 */
export function getRemainingEV(evs: EVs): number {
  return 508 - getTotalEV(evs);
}

/**
 * Distribute EVs across stats (simple greedy algorithm)
 */
export function distributeEVs(preferences: Partial<EVs>, baseEVs?: EVs): EVs {
  const evs = baseEVs || { hp: 0, attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0 };
  const result = { ...evs };
  const stats: (keyof EVs)[] = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

  for (const stat of stats) {
    if (preferences[stat] !== undefined) {
      const value = Math.min(252, preferences[stat]!);
      result[stat] = value;
    }
  }

  return result;
}

/**
 * Calculate the nature's impact on a stat
 */
export function getNatureModifier(statName: StatName, nature: Nature | null): number {
  if (!nature) return 1;
  if (nature.increased === statName) return 1.1;
  if (nature.decreased === statName) return 0.9;
  return 1;
}

/**
 * Find the level required for a Pokémon to reach a target stat
 */
export function findLevelForTargetStat(
  base: number,
  iv: number,
  ev: number,
  targetStat: number,
  statName: StatName,
  nature: Nature | null,
): number | null {
  for (let level = 1; level <= 100; level++) {
    const stat = calculateStat(base, iv, ev, level, statName, nature);
    if (stat >= targetStat) {
      return level;
    }
  }
  return null;
}

/**
 * Get optimal spreads for common competitive strategies
 */
export const COMMON_EV_SPREADS = {
  physical: { hp: 252, attack: 252, defense: 4, 'special-attack': 0, 'special-defense': 0, speed: 0 } as EVs,
  special: { hp: 252, attack: 0, defense: 4, 'special-attack': 252, 'special-defense': 0, speed: 0 } as EVs,
  mixed: { hp: 252, attack: 128, defense: 4, 'special-attack': 124, 'special-defense': 0, speed: 0 } as EVs,
  bulky: { hp: 252, attack: 0, defense: 252, 'special-attack': 0, 'special-defense': 4, speed: 0 } as EVs,
  speedyPhysical: { hp: 0, attack: 252, defense: 0, 'special-attack': 0, 'special-defense': 4, speed: 252 } as EVs,
  speedySpecial: { hp: 0, attack: 0, defense: 0, 'special-attack': 252, 'special-defense': 4, speed: 252 } as EVs,
  defensiveSpeaker: { hp: 252, attack: 0, defense: 0, 'special-attack': 252, 'special-defense': 4, speed: 0 } as EVs,
  defensive: { hp: 252, attack: 4, defense: 252, 'special-attack': 0, 'special-defense': 0, speed: 0 } as EVs,
};
