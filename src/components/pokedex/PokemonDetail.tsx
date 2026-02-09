'use client';

import { useState, useMemo } from 'react';
import { PokemonBase } from '@/types';
import { getWeaknesses, getResistances, getImmunities, TYPE_COLORS, formatTypeName } from '@/src/lib/typeEffectiveness';
import Calculator from '@/src/components/calculator/Calculator';

interface PokemonDetailProps {
  pokemon: PokemonBase | null;
}

export default function PokemonDetail({ pokemon }: PokemonDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'matchups' | 'abilities' | 'calculator'>('overview');

  // Move all hooks to TOP - before any conditional returns
  const totalBST = pokemon ? Object.values(pokemon.baseStats).reduce((a, b) => a + b, 0) : 0;
  const weaknesses = useMemo(() => (pokemon ? getWeaknesses(pokemon.types) : []), [pokemon?.types]);
  const resistances = useMemo(() => (pokemon ? getResistances(pokemon.types) : []), [pokemon?.types]);
  const immunities = useMemo(() => (pokemon ? getImmunities(pokemon.types) : []), [pokemon?.types]);

  if (!pokemon) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 border-2 border-gray-100 dark:border-gray-700 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-gray-500 dark:text-gray-400 text-lg font-semibold">Select a Pokémon to view stats and calculate builds</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'stats', label: 'Stats' },
    { id: 'matchups', label: 'Matchups' },
    { id: 'abilities', label: 'Abilities' },
    { id: 'calculator', label: 'Calculator' },
  ] as const;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-gray-100 dark:border-gray-700">
      {/* Pokemon Header */}
      <div className="flex items-center gap-6 mb-8 pb-8 border-b-2 border-gray-200 dark:border-gray-700">
        {pokemon.sprite && (
          <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 shadow-lg">
            <img
              src={pokemon.sprite}
              alt={pokemon.name}
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400">#{pokemon.id.toString().padStart(4, '0')}</p>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">{pokemon.name}</h2>
          <div className="flex gap-2 flex-wrap">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className={`px-4 py-2 rounded-lg text-white font-bold uppercase text-sm shadow-md ${
                  TYPE_COLORS[type] || 'bg-gray-400'
                }`}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b-2 border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
        <div className="flex gap-1 -mb-[2px]">
          {tabs.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-6 py-3 font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === id
                  ? 'border-red-500 text-red-600 dark:text-red-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <span className="text-lg">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Base Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Pokédex ID</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">#{pokemon.id}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Types</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{pokemon.types.join(', ')}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Base Stats</h3>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">HP</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{pokemon.baseStats.hp}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Total BST</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{totalBST}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div>
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Base Stats</h3>
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(pokemon.baseStats).map(([stat, value]) => {
                const percentage = (value / 255) * 100;
                const statLabel = stat === 'special-attack' ? 'Sp. Atk' : stat === 'special-defense' ? 'Sp. Def' : stat.charAt(0).toUpperCase() + stat.slice(1);
                return (
                  <div key={stat} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase">{statLabel}</span>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
                    </div>
                    <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'matchups' && (
          <TypeMatchupTable weaknesses={weaknesses} resistances={resistances} immunities={immunities} />
        )}

        {activeTab === 'abilities' && (
          <div>
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Abilities</h3>
            {pokemon.abilities && pokemon.abilities.length > 0 ? (
              <div className="space-y-4">
                {pokemon.abilities.map((ability) => (
                  <div key={ability.name} className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
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
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No ability data available</p>
            )}
          </div>
        )}

        {activeTab === 'calculator' && (
          <Calculator pokemon={pokemon} />
        )}
      </div>
    </div>
  );
}

// Type Matchup Table Component
function TypeMatchupTable({
  weaknesses,
  resistances,
  immunities,
}: {
  weaknesses: Array<{ type: string; multiplier: number }>;
  resistances: Array<{ type: string; multiplier: number }>;
  immunities: string[];
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Type Matchups</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weaknesses */}
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border-2 border-red-200 dark:border-red-800">
          <h4 className="font-bold text-red-700 dark:text-red-300 mb-4 text-lg flex items-center gap-2">
            <span>⚠️</span> Weak to
          </h4>
          <div className="space-y-2">
            {weaknesses.length > 0 ? (
              weaknesses.map(({ type, multiplier }) => (
                <div key={type} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${TYPE_COLORS[type] || 'bg-gray-400'}`}>
                    {formatTypeName(type)}
                  </span>
                  <span className="text-red-700 dark:text-red-300 font-bold text-lg">
                    {multiplier}x
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic py-4 text-center">No weaknesses</p>
            )}
          </div>
        </div>

        {/* Resistances */}
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border-2 border-green-200 dark:border-green-800">
          <h4 className="font-bold text-green-700 dark:text-green-300 mb-4 text-lg flex items-center gap-2">
            <span>✅</span> Resists
          </h4>
          <div className="space-y-2">
            {resistances.length > 0 ? (
              resistances.map(({ type, multiplier }) => (
                <div key={type} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${TYPE_COLORS[type] || 'bg-gray-400'}`}>
                    {formatTypeName(type)}
                  </span>
                  <span className="text-green-700 dark:text-green-300 font-bold text-lg">
                    {multiplier}x
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic py-4 text-center">No resistances</p>
            )}
          </div>
        </div>

        {/* Immunities */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
          <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-4 text-lg flex items-center gap-2">
            <span>🛡️</span> Immune to
          </h4>
          <div className="space-y-2">
            {immunities.length > 0 ? (
              immunities.map((type) => (
                <div key={type} className="flex items-center p-2 bg-white dark:bg-gray-800 rounded">
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${TYPE_COLORS[type] || 'bg-gray-400'}`}>
                    {formatTypeName(type)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic py-4 text-center">No immunities</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
