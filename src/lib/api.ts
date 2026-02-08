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

export async function getPokemon(limit = 50, offset = 0): Promise<PokemonBase[]> {
  // 1. Fetch the list of Pokemon
  const res = await fetch(`${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`);
  const data = await res.json();

  // 2. Fetch details for each Pokemon in parallel
  const promises = data.results.map(async (p: { name: string; url: string }) => {
    const res = await fetch(p.url);
    const details = await res.json();

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
    };
  });

  return Promise.all(promises);
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