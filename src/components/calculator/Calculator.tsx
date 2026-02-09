'use client';

import { useState, useMemo, useEffect } from 'react';
import { calculateAllStats, isValidEVs, getRemainingEV, COMMON_EV_SPREADS } from '@/src/lib/calculations';
import { EVs, IVs, NATURES, PokemonBase, CalculatedStats } from '@/src/types';
import LevelInput from '@/src/components/ui/LevelInput';
import StatInput from '@/src/components/ui/StatInput';
import StatResults from '@/src/components/calculator/StatResults';

interface CalculatorProps {
  pokemon: PokemonBase;
}

export default function Calculator({ pokemon }: CalculatorProps) {
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
    const nature = NATURES[selectedNature] ? { id: selectedNature, name: selectedNature, ...NATURES[selectedNature] } : null;
    return calculateAllStats(pokemon.baseStats, ivs, evs, level, nature);
  }, [pokemon, level, selectedNature, ivs, evs]);

  // Validate EVs
  useEffect(() => {
    const validation = isValidEVs(evs);
    setEvErrors(validation.errors);
  }, [evs]);

  const remainingEV = getRemainingEV(evs);
  const totalEV = 508 - remainingEV;

  return (
    <div className="space-y-6">
      {/* Level Input */}
      <LevelInput value={level} onChange={setLevel} />

      {/* Nature Selection */}
      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
          Nature
        </label>
        <select
          value={selectedNature}
          onChange={(e) => setSelectedNature(e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-medium hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all cursor-pointer"
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
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
          Quick EV Spreads
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(COMMON_EV_SPREADS).map(([key, spread]) => (
            <button
              key={key}
              onClick={() => setEVs(spread)}
              className="px-4 py-3 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg text-sm font-bold capitalize shadow-md hover:shadow-lg transition-all transform hover:scale-105"
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* IVs */}
      <StatInput label="Individual Values (IVs)" stats={ivs} onChange={(stats) => setIVs(stats as IVs)} maxValue={31} type="iv" />

      {/* EVs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
            Effort Values (EVs)
          </label>
          <div className="text-sm">
            <span className={`font-bold ${remainingEV === 0 ? 'text-green-600 dark:text-green-400' : remainingEV > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'}`}>
              {remainingEV}
            </span>
            <span className="text-gray-600 dark:text-gray-400"> / 508</span>
          </div>
        </div>

        <StatInput label="" stats={evs} onChange={(stats) => setEVs(stats as EVs)} maxValue={252} type="ev" />

        {/* EV Progress Bar */}
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Overall EV Distribution</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">{totalEV} / 508</span>
          </div>
          <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                remainingEV >= 0 ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-red-500'
              }`}
              style={{ width: `${Math.min((totalEV / 508) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* EV Errors */}
        {evErrors.length > 0 && (
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-lg">
            <h5 className="text-sm font-bold text-red-700 dark:text-red-300 mb-2">EV Errors:</h5>
            <ul className="space-y-1">
              {evErrors.map((error, i) => (
                <li key={i} className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
                  <span>•</span> {error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Calculated Stats */}
      <StatResults calculatedStats={calculatedStats} baseStats={pokemon.baseStats} level={level} />
    </div>
  );
}
