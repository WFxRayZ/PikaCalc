// Clean TypeScript definitions for the app

// Ability with description
export interface Ability {
  name: string;
  description: string;
}

// Base Pokemon data from API
export interface PokemonBase {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  baseStats: BaseStat;
  abilities?: Ability[];
  height?: number;
  weight?: number;
}

// Stat type
export interface BaseStat {
  hp: number;
  attack: number;
  defense: number;
  'special-attack': number;
  'special-defense': number;
  speed: number;
}

export type StatName = keyof BaseStat;
export type StatArray = [number, number, number, number, number, number]; // hp, atk, def, spa, spd, spe

// Nature - boosts one stat, reduces another
export interface Nature {
  id: string;
  name: string;
  increased: StatName | null; // +10%
  decreased: StatName | null; // -10%
}

export const NATURES: Record<string, Nature> = {
  hardy: { id: 'hardy', name: 'Hardy', increased: null, decreased: null },
  lonely: { id: 'lonely', name: 'Lonely', increased: 'attack', decreased: 'defense' },
  brave: { id: 'brave', name: 'Brave', increased: 'attack', decreased: 'speed' },
  adamant: { id: 'adamant', name: 'Adamant', increased: 'attack', decreased: 'special-attack' },
  naughty: { id: 'naughty', name: 'Naughty', increased: 'attack', decreased: 'special-defense' },
  bold: { id: 'bold', name: 'Bold', increased: 'defense', decreased: 'attack' },
  docile: { id: 'docile', name: 'Docile', increased: null, decreased: null },
  relaxed: { id: 'relaxed', name: 'Relaxed', increased: 'defense', decreased: 'speed' },
  impish: { id: 'impish', name: 'Impish', increased: 'defense', decreased: 'special-attack' },
  lax: { id: 'lax', name: 'Lax', increased: 'defense', decreased: 'special-defense' },
  timid: { id: 'timid', name: 'Timid', increased: 'speed', decreased: 'attack' },
  hasty: { id: 'hasty', name: 'Hasty', increased: 'speed', decreased: 'defense' },
  serious: { id: 'serious', name: 'Serious', increased: null, decreased: null },
  jolly: { id: 'jolly', name: 'Jolly', increased: 'speed', decreased: 'special-attack' },
  naive: { id: 'naive', name: 'Naive', increased: 'speed', decreased: 'special-defense' },
  modest: { id: 'modest', name: 'Modest', increased: 'special-attack', decreased: 'attack' },
  mild: { id: 'mild', name: 'Mild', increased: 'special-attack', decreased: 'defense' },
  quiet: { id: 'quiet', name: 'Quiet', increased: 'special-attack', decreased: 'speed' },
  bashful: { id: 'bashful', name: 'Bashful', increased: null, decreased: null },
  rash: { id: 'rash', name: 'Rash', increased: 'special-attack', decreased: 'special-defense' },
  calm: { id: 'calm', name: 'Calm', increased: 'special-defense', decreased: 'attack' },
  gentle: { id: 'gentle', name: 'Gentle', increased: 'special-defense', decreased: 'defense' },
  sassy: { id: 'sassy', name: 'Sassy', increased: 'special-defense', decreased: 'speed' },
  careful: { id: 'careful', name: 'Careful', increased: 'special-defense', decreased: 'special-attack' },
  quirky: { id: 'quirky', name: 'Quirky', increased: null, decreased: null },
};

// IVs (Individual Values) - range 0-31
export interface IVs {
  hp: number;
  attack: number;
  defense: number;
  'special-attack': number;
  'special-defense': number;
  speed: number;
}

// EVs (Effort Values) - max 252 per stat, 508 total
export interface EVs {
  hp: number;
  attack: number;
  defense: number;
  'special-attack': number;
  'special-defense': number;
  speed: number;
}

export const MAX_EV_PER_STAT = 252;
export const MAX_TOTAL_EV = 508;

// Full Pokemon build configuration
export interface PokemonBuild {
  id: string; // unique identifier
  pokemon: PokemonBase;
  level: number; // 1-100
  nature: Nature;
  ivs: IVs;
  evs: EVs;
  ability?: string;
  item?: string;
  teraType?: string; // Scarlet/Violet Tera Type
}

// Calculated stats
export interface CalculatedStats {
  hp: number;
  attack: number;
  defense: number;
  'special-attack': number;
  'special-defense': number;
  speed: number;
}

// Team comparisons
export interface PokemonTeamMember extends PokemonBuild {
  position: number;
}

export interface Team {
  id: string;
  name: string;
  members: PokemonTeamMember[];
}

// Type effectiveness
export interface TypeMatchup {
  type: string;
  effective: number; // 0.5, 1, 2
}

// Move data
export interface Move {
  id: string;
  name: string;
  type: string;
  category: 'physical' | 'special' | 'status';
  power: number;
  accuracy: number;
  pp: number;
}

// User preferences
export interface UserSettings {
  theme: 'light' | 'dark';
  defaultLevel: number;
  autoCalculate: boolean;
  compactView: boolean;
}
