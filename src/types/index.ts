export type StatName = 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed';

export interface BaseStat {
  hp: number;
  attack: number;
  defense: number;
  'special-attack': number;
  'special-defense': number;
  speed: number;
}

export interface IVs {
  hp: number;
  attack: number;
  defense: number;
  'special-attack': number;
  'special-defense': number;
  speed: number;
}

export interface EVs {
  hp: number;
  attack: number;
  defense: number;
  'special-attack': number;
  'special-defense': number;
  speed: number;
}

export interface CalculatedStats {
  hp: number;
  attack: number;
  defense: number;
  'special-attack': number;
  'special-defense': number;
  speed: number;
}

export interface Nature {
  increased: StatName | null;
  decreased: StatName | null;
}

export const NATURES: Record<string, Nature> = {
  hardy: { increased: null, decreased: null },
  lonely: { increased: 'attack', decreased: 'defense' },
  brave: { increased: 'attack', decreased: 'speed' },
  adamant: { increased: 'attack', decreased: 'special-attack' },
  naughty: { increased: 'attack', decreased: 'special-defense' },
  bold: { increased: 'defense', decreased: 'attack' },
  docile: { increased: null, decreased: null },
  relaxed: { increased: 'defense', decreased: 'speed' },
  impish: { increased: 'defense', decreased: 'special-attack' },
  lax: { increased: 'defense', decreased: 'special-defense' },
  timid: { increased: 'speed', decreased: 'attack' },
  hasty: { increased: 'speed', decreased: 'defense' },
  serious: { increased: null, decreased: null },
  jolly: { increased: 'speed', decreased: 'special-attack' },
  naive: { increased: 'speed', decreased: 'special-defense' },
  modest: { increased: 'special-attack', decreased: 'attack' },
  mild: { increased: 'special-attack', decreased: 'defense' },
  quiet: { increased: 'special-attack', decreased: 'speed' },
  bashful: { increased: null, decreased: null },
  rash: { increased: 'special-attack', decreased: 'special-defense' },
  calm: { increased: 'special-defense', decreased: 'attack' },
  gentle: { increased: 'special-defense', decreased: 'defense' },
  sassy: { increased: 'special-defense', decreased: 'speed' },
  careful: { increased: 'special-defense', decreased: 'special-attack' },
  quirky: { increased: null, decreased: null },
};

export interface PokemonBase {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  baseStats: BaseStat;
  abilities?: Array<{ name: string; description: string }>;
}
