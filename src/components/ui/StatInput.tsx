'use client';

import { EVs, IVs } from '@/types';

interface StatInputProps {
  label: string;
  stats: EVs | IVs;
  onChange: (stats: EVs | IVs) => void;
  maxValue: number;
  type: 'iv' | 'ev';
}

const STAT_NAMES: Record<string, string> = {
  hp: 'HP',
  attack: 'Atk',
  defense: 'Def',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Spd',
};

export default function StatInput({ label, stats, onChange, maxValue, type }: StatInputProps) {
  const handleChange = (stat: keyof typeof stats, value: number) => {
    const newValue = Math.min(maxValue, Math.max(0, value));
    onChange({ ...stats, [stat]: newValue });
  };

  const handleMaxAll = () => {
    const maxed = Object.keys(stats).reduce((acc, stat) => {
      (acc as any)[stat] = maxValue;
      return acc;
    }, {}) as typeof stats;
    onChange(maxed);
  };

  const handleClearAll = () => {
    const cleared = Object.keys(stats).reduce((acc, stat) => {
      (acc as any)[stat] = 0;
      return acc;
    }, {}) as typeof stats;
    onChange(cleared);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{label}</label>
        <div className="flex gap-2">
          <button
            onClick={handleMaxAll}
            className="text-xs px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors font-medium"
          >
            Max All
          </button>
          <button
            onClick={handleClearAll}
            className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {(Object.keys(stats) as (keyof typeof stats)[]).map((stat) => {
          const value = stats[stat];
          const percentage = (value / maxValue) * 100;

          return (
            <div key={stat} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                {STAT_NAMES[stat] || stat}
              </label>

              <div className="mb-2">
                <input
                  type="number"
                  min="0"
                  max={maxValue}
                  value={value}
                  onChange={(e) => handleChange(stat, Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-gray-900 dark:text-white text-center font-bold text-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all"
                />
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-200"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                {percentage.toFixed(0)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
