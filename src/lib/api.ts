// Fetch ability description from PokeAPI
async function fetchAbilityDescription(abilityUrl: string): Promise<string> {
  try {
    const res = await fetch(abilityUrl);
    const data = await res.json();
    
    // Find English description
    const englishEntry = data.effect_entries?.find((entry: any) => entry.language.name === 'en');
    if (englishEntry?.effect) {
      return englishEntry.effect;
    }
    
    // Fallback to flavor text
    const flavorEntry = data.flavor_text_entries?.find((entry: any) => entry.language.name === 'en');
    if (flavorEntry?.flavor_text) {
      return flavorEntry.flavor_text;
    }
    
    return 'No description available';
  } catch (error) {
    console.error(`Failed to fetch ability description:`, error);
    return 'No description available';
  }
}

// src/lib/api.ts
import { PokemonBase } from '@/types';

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

// Helper to format names (e.g., "mr-mime" -> "Mr. Mime")
const formatName = (name: string) => {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Cache key for localStorage
const POKEMON_CACHE_KEY = 'pikacalc_pokemon_cache';
const POKEMON_CACHE_VERSION = 'v3';

interface CacheData {
  version: string;
  timestamp: number;
  pokemon: PokemonBase[];
}

// Get cached Pokemon from localStorage
export function getCachedPokemon(): PokemonBase[] {
  try {
    const cached = localStorage.getItem(POKEMON_CACHE_KEY);
    if (!cached) return [];
    
    const data: CacheData = JSON.parse(cached);
    if (data.version !== POKEMON_CACHE_VERSION) return [];
    
    return data.pokemon || [];
  } catch (error) {
    console.error('Error reading cache:', error);
    return [];
  }
}

// Save Pokemon to localStorage cache
export function cachePokemon(pokemon: PokemonBase[]): void {
  try {
    const data: CacheData = {
      version: POKEMON_CACHE_VERSION,
      timestamp: Date.now(),
      pokemon,
    };
    localStorage.setItem(POKEMON_CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving cache:', error);
  }
}

async function fetchPokemonBatch(names: { name: string; url: string }[]): Promise<PokemonBase[]> {
  const promises = names.map(async (p: { name: string; url: string }) => {
    try {
      const res = await fetch(p.url);
      const details = await res.json();

      // Fetch ability descriptions in parallel
      const abilityPromises = details.abilities
        .filter((a: any) => !a.is_hidden) // Get non-hidden abilities
        .map(async (a: any) => ({
          name: formatName(a.ability.name),
          description: await fetchAbilityDescription(a.ability.url),
        }));

      const abilities = await Promise.all(abilityPromises);

      return {
        id: details.id,
        name: formatName(details.name),
        sprite: details.sprites.other['official-artwork'].front_default || details.sprites.front_default,
        types: details.types.map((t: any) => t.type.name),
        baseStats: {
          hp: details.stats[0].base_stat,
          attack: details.stats[1].base_stat,
          defense: details.stats[2].base_stat,
          'special-attack': details.stats[3].base_stat,
          'special-defense': details.stats[4].base_stat,
          speed: details.stats[5].base_stat,
        },
        abilities,
        height: details.height,
        weight: details.weight,
      };
    } catch (error) {
      console.error(`Failed to fetch ${p.name}:`, error);
      return null;
    }
  });

  const results = await Promise.all(promises);
  return results.filter((p) => p !== null) as PokemonBase[];
}

export async function getPokemon(limit = 1025, offset = 0): Promise<PokemonBase[]> {
  // 1. Fetch the list of Pokemon
  const res = await fetch(`${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`);
  const data = await res.json();

  // 2. Fetch details for each Pokemon in parallel (with batching)
  const batchSize = 20;
  const results: PokemonBase[] = [];

  for (let i = 0; i < data.results.length; i += batchSize) {
    const batch = data.results.slice(i, i + batchSize);
    const batchResults = await fetchPokemonBatch(batch);
    results.push(...batchResults);
  }

  // Cache the results
  cachePokemon(results);
  return results;
}

// Load initial batch of Pokemon (fast load)
export async function getInitialPokemon(limit = 150): Promise<PokemonBase[]> {
  // Check cache first
  const cached = getCachedPokemon();
  if (cached.length > 0) {
    return cached.slice(0, limit);
  }

  const res = await fetch(`${POKEAPI_BASE}/pokemon?limit=${limit}&offset=0`);
  const data = await res.json();
  const batchSize = 20;
  const results: PokemonBase[] = [];

  for (let i = 0; i < data.results.length; i += batchSize) {
    const batch = data.results.slice(i, i + batchSize);
    const batchResults = await fetchPokemonBatch(batch);
    results.push(...batchResults);
  }

  return results;
}

// Load remaining Pokemon in background
export async function loadRemainingPokemon(
  currentCount: number,
  onProgress?: (pokemon: PokemonBase[]) => void
): Promise<PokemonBase[]> {
  const cached = getCachedPokemon();
  if (cached.length > currentCount) {
    return cached;
  }

  const batchSize = 20;
  const limit = 1025;
  const res = await fetch(`${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${currentCount}`);
  const data = await res.json();
  const allResults = [...cached];

  for (let i = 0; i < data.results.length; i += batchSize) {
    const batch = data.results.slice(i, i + batchSize);
    const batchResults = await fetchPokemonBatch(batch);
    allResults.push(...batchResults);
    
    // Call progress callback
    if (onProgress) {
      onProgress(allResults);
    }
  }

  cachePokemon(allResults);
  return allResults;
}

export async function getPokemonDetails(nameOrId: string | number): Promise<PokemonBase | null> {
  try {
    const res = await fetch(`${POKEAPI_BASE}/pokemon/${nameOrId}`);
    if (!res.ok) return null;
    const details = await res.json();

    return {
      id: details.id,
      name: formatName(details.name),
      sprite: details.sprites.other['official-artwork'].front_default,
      types: details.types.map((t: any) => t.type.name),
      baseStats: {
        hp: details.stats[0].base_stat,
        attack: details.stats[1].base_stat,
        defense: details.stats[2].base_stat,
        'special-attack': details.stats[3].base_stat,
        'special-defense': details.stats[4].base_stat,
        speed: details.stats[5].base_stat,
      },
    };
  } catch (error) {
    return null;
  }
}