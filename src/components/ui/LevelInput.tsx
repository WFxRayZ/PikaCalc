'use client';

interface LevelInputProps {
  value: number;
  onChange: (level: number) => void;
}

export default function LevelInput({ value, onChange }: LevelInputProps) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.min(100, Math.max(1, Number(e.target.value)));
    onChange(newValue);
  };

  const quickSetLevel = (level: number) => {
    onChange(level);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Level
      </label>

      {/* Slider and Number Input Row */}
      <div className="flex gap-4 items-end">
        {/* Slider */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="range"
              min="1"
              max="100"
              value={value}
              onChange={handleSliderChange}
              className="w-full h-3 bg-gradient-to-r from-red-400 to-orange-400 rounded-lg appearance-none cursor-pointer accent-red-500"
              style={{
                background: `linear-gradient(to right, rgb(248, 113, 113) 0%, rgb(248, 113, 113) ${((value - 1) / 99) * 100}%, rgb(229, 231, 235) ${((value - 1) / 99) * 100}%, rgb(229, 231, 235) 100%)`
              }}
            />
          </div>
        </div>

        {/* Number Input */}
        <div className="w-24">
          <input
            type="number"
            min="1"
            max="100"
            value={value}
            onChange={handleNumberChange}
            maxLength={3}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-center font-bold text-lg hover:border-red-400 dark:hover:border-red-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900 transition-all"
            placeholder="1-100"
          />
        </div>
      </div>

      {/* Level Display */}
      <div className="mt-4 text-center">
        <span className="inline-block px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full font-bold text-sm">
          Level {value}
        </span>
      </div>

      {/* Quick Buttons */}
      <div className="flex gap-2 mt-4">
        {[
          { label: 'Lv. 1', value: 1 },
          { label: 'Lv. 25', value: 25 },
          { label: 'Lv. 50', value: 50 },
          { label: 'Lv. 75', value: 75 },
          { label: 'Lv. 100', value: 100 },
        ].map(({ label, value: btnValue }) => (
          <button
            key={btnValue}
            onClick={() => quickSetLevel(btnValue)}
            className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
              value === btnValue
                ? 'bg-red-500 text-white shadow-lg scale-105'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
