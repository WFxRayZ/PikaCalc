'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCalcStore } from '@/src/lib/store';
import Pokedex from '@/src/components/pokedex/Pokedex';
import PokemonDetail from '@/src/components/pokedex/PokemonDetail';

export default function CalculatorPage() {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMore, setHasMore] = useState(true);

  const pokemonList = useCalcStore((state) => state.pokemonList);
  const setPokemonList = useCalcStore((state) => state.setPokemonList);
  const selectedPokemon = useCalcStore((state) => state.selectedPokemon);
  const setSelectedPokemon = useCalcStore((state) => state.setSelectedPokemon);

  // Load initial Pokemon
  useEffect(() => {
    const fetchInitialPokemon = async () => {
      try {
        setLoading(true);
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

  // Load more Pokemon
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

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 group mb-4">
              <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
              <span className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-red-500">Back to Home</span>
            </Link>
            <h1 className="text-5xl md:text-6xl font-black bg-linear-to-r from-red-600 to-orange-500 dark:from-red-500 dark:to-orange-400 bg-clip-text text-transparent mb-2">
              PikaCalc
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-semibold">Pokémon EV/IV Calculator & Team Builder</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pokedex - Left Column */}
          <div className="lg:col-span-1">
            <Pokedex
              pokemonList={pokemonList}
              selectedPokemon={selectedPokemon}
              onSelectPokemon={setSelectedPokemon}
              loading={loading}
              loadingMore={loadingMore}
              error={error}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
            />
          </div>

          {/* Pokemon Detail - Right Column */}
          <div className="lg:col-span-2">
            <PokemonDetail pokemon={selectedPokemon} />
          </div>
        </div>
      </div>
    </div>
  );
}
