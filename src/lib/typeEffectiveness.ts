// Type effectiveness chart - shows what damage multiplier each type does to others
export const TYPE_EFFECTIVENESS: Record<string, Record<string, number>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, steel: 2, fairy: 1 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, grass: 0.5, electric: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, flying: 0.5, poison: 0.5, rock: 2, bug: 0.5, ghost: 0, ice: 2, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, rock: 2, water: 1, flying: 0, ice: 1, steel: 2 },
  flying: { fighting: 2, bug: 2, grass: 2, electric: 0.5, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, flying: 2, bug: 2, steel: 0.5, fighting: 0.5, ground: 0.5 },
  ghost: { poison: 0.5, bug: 0.5, ghost: 2, dark: 0.5, normal: 0, fighting: 0 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, flying: 0, grass: 0.5, psychic: 0.5, bug: 0.5, ghost: 0.5, dragon: 0.5, steel: 0.5, fairy: 2, normal: 0.5, poison: 0, ground: 0 },
  fairy: { fire: 0.5, poison: 0.5, steel: 0.5, fighting: 2, dark: 2, dragon: 2 },
};

// All types
export const ALL_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

// Type colors for UI
export const TYPE_COLORS: Record<string, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-cyan-400',
  fighting: 'bg-amber-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-sky-400',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-stone-500',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-600',
  dark: 'bg-gray-800',
  steel: 'bg-slate-400',
  fairy: 'bg-pink-400',
};

export interface TypeMatchup {
  type: string;
  multiplier: number;
}

/**
 * Calculate weaknesses for a Pokémon (types that deal super-effective damage to it)
 * @param types Array of Pokémon types
 * @returns Array of types and their damage multipliers
 */
export function getWeaknesses(types: string[]): TypeMatchup[] {
  const weaknessMap: Record<string, number> = {};

  // For each attacking type
  for (const attackType of ALL_TYPES) {
    let multiplier = 1;

    // For each defending type
    for (const defendType of types) {
      const effectiveness = TYPE_EFFECTIVENESS[attackType]?.[defendType] ?? 1;
      multiplier *= effectiveness;
    }

    // Only include if it's actually super-effective (multiplier > 1)
    if (multiplier > 1) {
      weaknessMap[attackType] = multiplier;
    }
  }

  return Object.entries(weaknessMap)
    .map(([type, multiplier]) => ({ type, multiplier }))
    .sort((a, b) => b.multiplier - a.multiplier);
}

/**
 * Calculate resistances for a Pokémon (types it resists)
 * @param types Array of Pokémon types
 * @returns Array of types and their damage multipliers
 */
export function getResistances(types: string[]): TypeMatchup[] {
  const resistanceMap: Record<string, number> = {};

  // For each attacking type
  for (const attackType of ALL_TYPES) {
    let multiplier = 1;

    // For each defending type
    for (const defendType of types) {
      const effectiveness = TYPE_EFFECTIVENESS[attackType]?.[defendType] ?? 1;
      multiplier *= effectiveness;
    }

    // Only include if it's a resistance (multiplier < 1)
    if (multiplier < 1 && multiplier > 0) {
      resistanceMap[attackType] = multiplier;
    }
  }

  return Object.entries(resistanceMap)
    .map(([type, multiplier]) => ({ type, multiplier }))
    .sort((a, b) => a.multiplier - b.multiplier);
}

/**
 * Calculate immunities for a Pokémon (types it's immune to)
 * @param types Array of Pokémon types
 * @returns Array of immune types
 */
export function getImmunities(types: string[]): string[] {
  const immunities: string[] = [];

  for (const attackType of ALL_TYPES) {
    let multiplier = 1;

    for (const defendType of types) {
      const effectiveness = TYPE_EFFECTIVENESS[attackType]?.[defendType] ?? 1;
      multiplier *= effectiveness;
    }

    // Immunity means 0 damage (multiplier = 0)
    if (multiplier === 0) {
      immunities.push(attackType);
    }
  }

  return immunities.sort();
}

/**
 * Format type name for display
 */
export function formatTypeName(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

/**
 * Get STAB coverage (Super Effective Against)
 * @param types Array of Pokémon types
 * @returns Object with coverage information
 */
export function getSTABCoverage(types: string[]) {
  const coverage: Record<string, TypeMatchup[]> = {};

  for (const type of types) {
    const superEffective: TypeMatchup[] = [];

    for (const defendType of ALL_TYPES) {
      const multiplier = TYPE_EFFECTIVENESS[type]?.[defendType] ?? 1;
      if (multiplier > 1) {
        superEffective.push({ type: defendType, multiplier });
      }
    }

    coverage[type] = superEffective.sort((a, b) => b.multiplier - a.multiplier);
  }

  return coverage;
}
