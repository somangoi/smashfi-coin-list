'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Coin } from '../types/coin';
import { getCoins } from '../api/getCoins';

export default function CoinListTable() {
  const { data: coins, isLoading, error } = useQuery<Coin[]>({
    queryKey: ['coins'],
    queryFn: getCoins,
  });

  const sortedCoins = useMemo(() => {
    if (!coins) return [];
    return [...coins].sort((a, b) => b.current_price - a.current_price);
  }, [coins]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-lg text-red-600">Error loading coin data</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left font-semibold">#</th>
            <th className="px-4 py-3 text-left font-semibold">Name</th>
            <th className="px-4 py-3 text-left font-semibold">Symbol</th>
            <th className="px-4 py-3 text-right font-semibold">Price</th>
            <th className="px-4 py-3 text-right font-semibold">24h Change</th>
            <th className="px-4 py-3 text-right font-semibold">Volume (24h)</th>
            <th className="px-4 py-3 text-right font-semibold">Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {sortedCoins.map((coin, index) => (
            <tr key={coin.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                  <span>{coin.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 uppercase text-gray-600">
                {coin.symbol}
              </td>
              <td className="px-4 py-3 text-right">
                ${coin.current_price.toLocaleString()}
              </td>
              <td
                className={`px-4 py-3 text-right ${
                  coin.price_change_percentage_24h !== null && coin.price_change_percentage_24h >= 0
                    ? 'text-green-600'
                    : coin.price_change_percentage_24h !== null
                    ? 'text-red-600'
                    : ''
                }`}
              >
                {coin.price_change_percentage_24h?.toFixed(2) ?? 'N/A'}%
              </td>
              <td className="px-4 py-3 text-right">
                ${coin.total_volume.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-right">
                ${coin.market_cap.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
