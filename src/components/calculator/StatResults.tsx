'use client';

import { CalculatedStats, BaseStat } from '@/types';

interface StatResultsProps {
  calculatedStats: CalculatedStats | null;
  baseStats: BaseStat | null;
  level: number;
}

const STAT_NAMES: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

const STAT_COLORS: Record<string, string> = {
  hp: 'from-red-400 to-pink-400',
  attack: 'from-orange-400 to-red-400',
  defense: 'from-yellow-400 to-orange-400',
  'special-attack': 'from-purple-400 to-pink-400',
  'special-defense': 'from-green-400 to-emerald-400',
  speed: 'from-blue-400 to-cyan-400',
};

export default function StatResults({ calculatedStats, baseStats, level }: StatResultsProps) {
  if (!calculatedStats || !baseStats) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white">Calculated Stats</h4>
        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">at Level {level}</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {(Object.keys(calculatedStats) as (keyof CalculatedStats)[]).map((stat) => {
          const base = baseStats[stat] || 0;
          const calculated = calculatedStats[stat];
          const diff = calculated - base;
          const percentage = (calculated / 255) * 100;
          const color = STAT_COLORS[stat] || 'from-gray-400 to-gray-500';

          return (
            <div key={stat} className="bg-white dark:bg-gray-700/50 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h5 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    {STAT_NAMES[stat]}
                  </h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Base: {base}</p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {calculated}
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      diff > 0 ? 'text-green-600 dark:text-green-400' : diff < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'
                    }`}
                  >
                    {diff > 0 ? '+' : ''}{diff}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${color} transition-all duration-300`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>

              {/* Stat Bar Chart */}
              <div className="mt-2 flex items-end gap-1 h-8">
                {[...Array(10)].map((_, i) => {
                  const barValue = ((i + 1) * 25.5);
                  const active = calculated > barValue;
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-sm transition-all ${
                        active
                          ? `bg-gradient-to-r ${color}`
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      style={{ height: '100%' }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
