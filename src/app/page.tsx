'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useCalcStore } from '@/src/lib/store';
import { getWeaknesses, getResistances, getImmunities, TYPE_COLORS, formatTypeName } from '@/src/lib/typeEffectiveness';
import { calculateAllStats, isValidEVs, getRemainingEV, COMMON_EV_SPREADS } from '@/src/lib/calculations';
import { PokemonBase, EVs, IVs, Nature, NATURES, CalculatedStats } from '@/types';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'matchups' | 'abilities'>('overview');
  const pokemonList = useCalcStore((state) => state.pokemonList);
  const setPokemonList = useCalcStore((state) => state.setPokemonList);
  const selectedPokemon = useCalcStore((state) => state.selectedPokemon);
  const setSelectedPokemon = useCalcStore((state) => state.setSelectedPokemon);
  const [hasMore, setHasMore] = useState(true);

  // Calculator state
  const [level, setLevel] = useState(50);
  const [selectedNature, setSelectedNature] = useState<string>('hardy');
  const [ivs, setIVs] = useState<IVs>({
    hp: 31,
    attack: 31,
    defense: 31,
    'special-attack': 31,
    'special-defense': 31,
    speed: 31,
  });
  const [evs, setEVs] = useState<EVs>({
    hp: 0,
    attack: 0,
    defense: 0,
    'special-attack': 0,
    'special-defense': 0,
    speed: 0,
  });
  const [evErrors, setEvErrors] = useState<string[]>([]);

  // Calculate stats when inputs change
  const calculatedStats = useMemo(() => {
    if (!selectedPokemon) return null;
    const nature = NATURES[selectedNature];
    return calculateAllStats(selectedPokemon.baseStats, ivs, evs, level, nature || null);
  }, [selectedPokemon, level, selectedNature, ivs, evs]);

  // Validate EVs
  useEffect(() => {
    const validation = isValidEVs(evs);
    setEvErrors(validation.errors);
  }, [evs]);

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
        const { getInitialPokemon } = await import('@/src/lib/api');
        const initialData = await getInitialPokemon(150);
        setPokemonList(initialData);
        setError(null);
        setLoading(false);
        setHasMore(initialData.length < 1025);
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

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const { loadRemainingPokemon } = await import('@/src/lib/api');
      const allPokemon = await loadRemainingPokemon(pokemonList.length);
      setPokemonList(allPokemon);
      setHasMore(allPokemon.length < 1025);
    } catch (err) {
      console.error('Error loading more Pokemon:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for auto-load
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !searchQuery) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [hasMore, loadingMore, searchQuery, handleLoadMore]);

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
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
                <div className="flex flex-col h-full">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Loaded {pokemonList.length} of 1025 total
                  </p>
                  <div className="space-y-2 max-h-96 overflow-y-auto flex-1">
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
                    {loadingMore && (
                      <div className="text-center py-4">
                        <p className="text-gray-500 dark:text-gray-400">Loading more...</p>
                      </div>
                    )}
                    <div ref={sentinelRef} className="h-4" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Calculator */}
          <div className="lg:col-span-2">
            {selectedPokemon ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                {/* Header */}
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

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                  <div className="flex gap-6 -mb-px">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                        activeTab === 'overview'
                          ? 'border-red-500 text-red-600 dark:text-red-400'
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab('stats')}
                      className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                        activeTab === 'stats'
                          ? 'border-red-500 text-red-600 dark:text-red-400'
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      Stats
                    </button>
                    <button
                      onClick={() => setActiveTab('matchups')}
                      className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                        activeTab === 'matchups'
                          ? 'border-red-500 text-red-600 dark:text-red-400'
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      Matchups
                    </button>
                    <button
                      onClick={() => setActiveTab('abilities')}
                      className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                        activeTab === 'abilities'
                          ? 'border-red-500 text-red-600 dark:text-red-400'
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      Abilities
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">About</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">ID</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">#{selectedPokemon.id}</p>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Type(s)</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedPokemon.types.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Base Stats Summary</h3>
                      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="space-y-2 text-gray-900 dark:text-white">
                          <p className="text-sm">HP: <span className="font-bold">{selectedPokemon.baseStats.hp}</span></p>
                          <p className="text-sm">Total BST: <span className="font-bold">{Object.values(selectedPokemon.baseStats).reduce((a, b) => a + b, 0)}</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'stats' && (
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Base Stats</h3>
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
                )}

                {activeTab === 'matchups' && (
                  <TypeMatchupTable types={selectedPokemon.types} />
                )}

                {activeTab === 'abilities' && (
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Abilities</h3>
                    {selectedPokemon.abilities && selectedPokemon.abilities.length > 0 ? (
                      <div className="space-y-3">
                          {selectedPokemon.abilities.map((ability) => (
                            <div key={ability.name} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                              <p className="text-lg font-bold text-gray-900 dark:text-white capitalize mb-2">
                                {ability.name}
                            </p>
                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {ability.description}
                              </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No ability data available</p>
                    )}
                  </div>
                )}

                {/* Calculator Controls */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Calculate Stats</h3>
                  
                  <div className="space-y-6">
                    {/* Level Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Level
                      </label>
                      <div className="flex gap-3 items-end">
                        <div className="flex-1">
                          <input
                            type="range"
                            min="1"
                            max="100"
                            value={level}
                            onChange={(e) => setLevel(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div className="w-20">
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={level}
                            onChange={(e) => setLevel(Math.min(100, Math.max(1, Number(e.target.value))))}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white text-center font-semibold"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3 text-xs">
                        <button onClick={() => setLevel(1)} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">Lv. 1</button>
                        <button onClick={() => setLevel(50)} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">Lv. 50</button>
                        <button onClick={() => setLevel(100)} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">Lv. 100</button>
                      </div>
                    </div>

                    {/* Nature Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nature</label>
                      <select
                        value={selectedNature}
                        onChange={(e) => setSelectedNature(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                      >
                        {Object.entries(NATURES).map(([key]) => (
                          <option key={key} value={key} className="capitalize">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* EV Spreads */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Quick EV Spreads
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(COMMON_EV_SPREADS).map(([key, spread]) => (
                          <button
                            key={key}
                            onClick={() => setEVs(spread)}
                            className="px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors capitalize"
                          >
                            {key}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* IV Inputs */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Individual Values (IVs)</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {(Object.keys(ivs) as (keyof IVs)[]).map((stat) => (
                          <div key={stat}>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 capitalize mb-1">
                              {stat === 'special-attack' ? 'Sp. Atk' : stat === 'special-defense' ? 'Sp. Def' : stat}
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="31"
                              value={ivs[stat]}
                              onChange={(e) => setIVs({ ...ivs, [stat]: Math.min(31, Math.max(0, Number(e.target.value))) })}
                              className="w-full px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white text-sm"
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setIVs({ hp: 31, attack: 31, defense: 31, 'special-attack': 31, 'special-defense': 31, speed: 31 })}
                        className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Max all IVs
                      </button>
                    </div>

                    {/* EV Inputs */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Effort Values (EVs) - Remaining: <span className="text-orange-500 font-bold">{getRemainingEV(evs)}</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {(Object.keys(evs) as (keyof EVs)[]).map((stat) => (
                          <div key={stat}>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 capitalize mb-1">
                              {stat === 'special-attack' ? 'Sp. Atk' : stat === 'special-defense' ? 'Sp. Def' : stat}
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="252"
                              value={evs[stat]}
                              onChange={(e) => setEVs({ ...evs, [stat]: Math.min(252, Math.max(0, Number(e.target.value))) })}
                              className="w-full px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white text-sm"
                            />
                          </div>
                        ))}
                      </div>
                      {evErrors.length > 0 && (
                        <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded text-red-700 dark:text-red-300 text-sm">
                          {evErrors.map((error, i) => (
                            <p key={i}>• {error}</p>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Calculated Stats */}
                    {calculatedStats && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Calculated Stats at Level {level}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {(Object.keys(calculatedStats) as (keyof CalculatedStats)[]).map((stat) => {
                            const base = selectedPokemon?.baseStats[stat] || 0;
                            const calculated = calculatedStats[stat];
                            const diff = calculated - base;
                            return (
                              <div key={stat} className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                <div className="flex justify-between items-center mb-1">
                                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 capitalize">
                                    {stat === 'special-attack' ? 'Sp. Atk' : stat === 'special-defense' ? 'Sp. Def' : stat}
                                  </label>
                                  <span className="text-xs text-gray-500 dark:text-gray-500">Base {base}</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-xl font-bold text-gray-900 dark:text-white">{calculated}</span>
                                  <span className={`text-sm font-medium ${diff > 0 ? 'text-green-600 dark:text-green-400' : diff < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'}`}>
                                    {diff > 0 ? '+' : ''}{diff}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
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

// Type Matchup Table Component
function TypeMatchupTable({ types }: { types: string[] }) {
  const weaknesses = useMemo(() => getWeaknesses(types), [types]);
  const resistances = useMemo(() => getResistances(types), [types]);
  const immunities = useMemo(() => getImmunities(types), [types]);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Type Matchups</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weaknesses */}
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <h4 className="font-bold text-red-700 dark:text-red-300 mb-3">Weak to</h4>
          <div className="space-y-2">
            {weaknesses.length > 0 ? (
              weaknesses.map(({ type, multiplier }) => (
                <div key={type} className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${TYPE_COLORS[type] || 'bg-gray-400'}`}>
                    {formatTypeName(type)}
                  </span>
                  <span className="text-red-700 dark:text-red-300 font-bold">
                    {multiplier}x
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No weaknesses</p>
            )}
          </div>
        </div>

        {/* Resistances */}
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <h4 className="font-bold text-green-700 dark:text-green-300 mb-3">Resists</h4>
          <div className="space-y-2">
            {resistances.length > 0 ? (
              resistances.map(({ type, multiplier }) => (
                <div key={type} className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${TYPE_COLORS[type] || 'bg-gray-400'}`}>
                    {formatTypeName(type)}
                  </span>
                  <span className="text-green-700 dark:text-green-300 font-bold">
                    {multiplier}x
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No resistances</p>
            )}
          </div>
        </div>

        {/* Immunities */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-3">Immune to</h4>
          <div className="space-y-2">
            {immunities.length > 0 ? (
              immunities.map((type) => (
                <div key={type}>
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${TYPE_COLORS[type] || 'bg-gray-400'}`}>
                    {formatTypeName(type)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No immunities</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
