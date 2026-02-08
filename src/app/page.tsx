'use client';

import { useEffect, useState, useMemo } from 'react';
import { useCalcStore } from '@/src/lib/store';
import { PokemonBase } from '@/types';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const pokemonList = useCalcStore((state) => state.pokemonList);
  const setPokemonList = useCalcStore((state) => state.setPokemonList);
  const selectedPokemon = useCalcStore((state) => state.selectedPokemon);
  const setSelectedPokemon = useCalcStore((state) => state.setSelectedPokemon);

  // Filter Pokemon based on search query
  const filteredPokemon = useMemo(() => {
    if (!searchQuery.trim()) return pokemonList;
    
    const query = searchQuery.toLowerCase();
    return pokemonList.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.id.toString().includes(query) ||
        p.types.some((t) => t.toLowerCase().includes(query))
    );
  }, [pokemonList, searchQuery]);

  useEffect(() => {
    const fetchInitialPokemon = async () => {
      try {
        setLoading(true);
        // Import getInitialPokemon
        const { getInitialPokemon, loadRemainingPokemon } = await import('@/src/lib/api');
        const initialData = await getInitialPokemon(150);
        setPokemonList(initialData);
        setError(null);
        setLoading(false);

        // Load remaining Pokemon in background
        loadRemainingPokemon(initialData.length, (allPokemon) => {
          setPokemonList(allPokemon);
        }).catch((err) => {
          console.error('Error loading remaining Pokemon:', err);
        });
      } catch (err) {
        setError('Failed to load Pokémon');
        console.error(err);
        setLoading(false);
      }
    };

    if (pokemonList.length === 0) {
      fetchInitialPokemon();
    } else {
      setLoading(false);
    }
  }, [pokemonList.length, setPokemonList]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-2 text-red-600 dark:text-red-400">PikaCalc</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Pokémon EV/IV Calculator</p>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pokemon List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Pokédex</h2>
              
              {/* Search Bar */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search by name, ID, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">Loading Pokémon...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Showing {filteredPokemon.length} of {pokemonList.length}
                  </p>
                  {filteredPokemon.map((pokemon: PokemonBase) => (
                    <button
                      key={pokemon.id}
                      onClick={() => setSelectedPokemon(pokemon)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedPokemon?.id === pokemon.id
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {pokemon.sprite && (
                          <img
                            src={pokemon.sprite}
                            alt={pokemon.name}
                            className="w-8 h-8"
                          />
                        )}
                        <div>
                          <p className="font-semibold">#{pokemon.id}</p>
                          <p className="text-sm opacity-75">{pokemon.name}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Calculator */}
          <div className="lg:col-span-2">
            {selectedPokemon ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-4 mb-6">
                  {selectedPokemon.sprite && (
                    <img
                      src={selectedPokemon.sprite}
                      alt={selectedPokemon.name}
                      className="w-24 h-24"
                    />
                  )}
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{selectedPokemon.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400">#{selectedPokemon.id}</p>
                    <div className="flex gap-2 mt-2">
                      {selectedPokemon.types.map((type) => (
                        <span
                          key={type}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Base Stats */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Base Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedPokemon.baseStats).map(([stat, value]) => (
                      <div key={stat} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 capitalize">
                          {stat.replace('-', ' ')}
                        </div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{value}</div>
                        <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2 mt-1">
                          <div
                            className="h-2 bg-green-500 rounded-full"
                            style={{ width: `${(value / 255) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calculator Controls */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Calculate Stats</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                    Calculator interface coming soon...
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">Select a Pokémon to view stats and calculate builds</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
