import { create } from 'zustand';
import { PokemonBase, PokemonBuild, Team, UserSettings, IVs, EVs, Nature, NATURES } from '@/types';

interface CalcStore {
  // Pokemon data
  selectedPokemon: PokemonBase | null;
  pokemonList: PokemonBase[];
  
  // Current build
  currentBuild: Partial<PokemonBuild>;
  builds: PokemonBuild[];
  
  // Teams
  teams: Team[];
  selectedTeam: Team | null;
  
  // Settings
  settings: UserSettings;
  
  // Actions
  setSelectedPokemon: (pokemon: PokemonBase | null) => void;
  setPokemonList: (pokemon: PokemonBase[]) => void;
  
  // Build actions
  updateBuild: (partial: Partial<PokemonBuild>) => void;
  resetBuild: () => void;
  saveBuild: (build: PokemonBuild) => void;
  deleteBuild: (id: string) => void;

  // Team actions
  createTeam: (name: string) => void;
  deleteTeam: (id: string) => void;
  addPokemonToTeam: (teamId: string, pokemon: PokemonBuild, position: number) => void;

  // Settings actions
  updateSettings: (settings: Partial<UserSettings>) => void;
}

const defaultSettings: UserSettings = {
  theme: 'dark',
  defaultLevel: 50,
  autoCalculate: true,
  compactView: false,
};

const defaultIVs: IVs = {
  hp: 31,
  attack: 31,
  defense: 31,
  'special-attack': 31,
  'special-defense': 31,
  speed: 31,
};

const defaultEVs: EVs = {
  hp: 0,
  attack: 0,
  defense: 0,
  'special-attack': 0,
  'special-defense': 0,
  speed: 0,
};

export const useCalcStore = create<CalcStore>((set) => ({
  selectedPokemon: null,
  pokemonList: [],
  currentBuild: {
    level: 50,
    nature: NATURES.hardy,
    ivs: defaultIVs,
    evs: defaultEVs,
  },
  builds: [],
  teams: [],
  selectedTeam: null,
  settings: defaultSettings,
  
  setSelectedPokemon: (pokemon) => set({ selectedPokemon: pokemon }),
  
  setPokemonList: (pokemon) => set({ pokemonList: pokemon }),
  
  updateBuild: (partial) => set((state) => ({
    currentBuild: { ...state.currentBuild, ...partial },
  })),
  
  resetBuild: () => set({
    currentBuild: {
      level: 50,
      nature: NATURES.hardy,
      ivs: defaultIVs,
      evs: defaultEVs,
    },
  }),
  
  saveBuild: (build) => set((state) => ({
    builds: [...state.builds, build],
  })),
  
  deleteBuild: (id) => set((state) => ({
    builds: state.builds.filter((b) => b.id !== id),
  })),
  
  createTeam: (name) => set((state) => {
    const newTeam: Team = {
      id: Date.now().toString(),
      name,
      members: [],
    };
    return { teams: [...state.teams, newTeam] };
  }),
  
  deleteTeam: (id) => set((state) => ({
    teams: state.teams.filter((t) => t.id !== id),
  })),
  
  addPokemonToTeam: (teamId, pokemon, position) => set((state) => ({
    teams: state.teams.map((team) =>
      team.id === teamId
        ? {
            ...team,
            members: [
              ...team.members.filter((m) => m.position !== position),
              { ...pokemon, position },
            ].sort((a, b) => a.position - b.position),
          }
        : team,
    ),
  })),
  
  updateSettings: (settings) => set((state) => ({
    settings: { ...state.settings, ...settings },
  })),
}));