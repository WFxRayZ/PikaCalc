'use client';

import { useMemo, useRef, useEffect } from 'react';
import { PokemonBase } from '@/types';

interface PokedexProps {
  pokemonList: PokemonBase[];
  selectedPokemon: PokemonBase | null;
  onSelectPokemon: (pokemon: PokemonBase) => void;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  hasMore: boolean;
  onLoadMore: () => void;
}

export default function Pokedex({
  pokemonList,
  selectedPokemon,
  onSelectPokemon,
  loading,
  loadingMore,
  error,
  searchQuery,
  onSearchChange,
  hasMore,
  onLoadMore,
}: PokedexProps) {
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

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for auto-load
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !searchQuery) {
          onLoadMore();
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
  }, [hasMore, loadingMore, searchQuery, onLoadMore]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Pokédex</h2>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, ID, or type..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-5 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all font-medium"
          />
          <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-500"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4 font-medium">Loading Pokémon...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-2">⚠️</div>
          <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-4 px-2">
            Showing {filteredPokemon.length} of {pokemonList.length} Pokémon
          </p>
          <div className="space-y-2 max-h-96 overflow-y-auto flex-1">
            {filteredPokemon.map((pokemon) => (
              <button
                key={pokemon.id}
                onClick={() => onSelectPokemon(pokemon)}
                className={`w-full text-left p-3 rounded-lg transition-all transform hover:scale-102 ${
                  selectedPokemon?.id === pokemon.id
                    ? 'bg-linear-to-r from-red-500 to-red-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  {pokemon.sprite && (
                    <img
                      src={pokemon.sprite}
                      alt={pokemon.name}
                      className="w-10 h-10 object-contain"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">#{pokemon.id.toString().padStart(4, '0')}</p>
                    <p className="text-sm opacity-85">{pokemon.name}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {pokemon.types.map((type) => (
                      <span
                        key={type}
                        className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold uppercase"
                      >
                        {type.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
            {loadingMore && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-500 mb-2"></div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Loading more...</p>
              </div>
            )}
            <div ref={sentinelRef} className="h-4" />
          </div>
        </div>
      )}
    </div>
  );
}
