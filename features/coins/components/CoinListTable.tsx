"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Coin } from "../types/coin";
import { getCoins } from "../api/getCoins";
import FavoriteButton from "@/features/favorites/components/FavoriteButton";
import TabNavigation from "@/features/favorites/components/TabNavigation";
import { useFavoriteStore } from "@/features/favorites/stores/useFavoriteStore";
import SearchBar from "@/shared/components/SearchBar";

type SortKey = 'price' | 'change' | 'volume' | 'marketCap';
type SortDirection = 'asc' | 'desc';

export default function CoinListTable() {
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const { favoriteIds } = useFavoriteStore();

  const {
    data: coins,
    isLoading,
    error,
  } = useQuery<Coin[]>({
    queryKey: ["coins"],
    queryFn: getCoins,
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const SortableHeader = ({ sortKeyValue, children, align = 'right' }: { sortKeyValue: SortKey; children: React.ReactNode; align?: 'left' | 'right' }) => (
    <th
      className={`px-4 py-3 text-${align} font-semibold cursor-pointer hover:bg-gray-100 select-none`}
      onClick={() => handleSort(sortKeyValue)}
    >
      <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
        {children}
        {sortKey === sortKeyValue && (
          <span className="text-xs">{sortDirection === 'asc' ? '▲' : '▼'}</span>
        )}
      </div>
    </th>
  );

  const sortedCoins = useMemo(() => {
    if (!coins) return [];
    let filtered = [...coins];

    // 탭 필터링
    if (activeTab === 'favorites') {
      filtered = filtered.filter(coin => favoriteIds.includes(coin.id));
    }

    // 검색 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(coin =>
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query)
      );
    }

    // 동적 정렬
    return filtered.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      // sortKey가 null이면 기본값으로 price 내림차순 적용
      const currentSortKey = sortKey ?? 'price';

      switch (currentSortKey) {
        case 'price':
          aValue = a.current_price;
          bValue = b.current_price;
          break;
        case 'change':
          aValue = a.price_change_percentage_24h ?? 0;
          bValue = b.price_change_percentage_24h ?? 0;
          break;
        case 'volume':
          aValue = a.total_volume;
          bValue = b.total_volume;
          break;
        case 'marketCap':
          aValue = a.market_cap;
          bValue = b.market_cap;
          break;
      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [coins, activeTab, favoriteIds, searchQuery, sortKey, sortDirection]);

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
    <div>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by name or symbol..."
      />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left font-semibold"></th>
            <th className="px-4 py-3 text-left font-semibold">Name</th>
            <th className="px-4 py-3 text-left font-semibold">Symbol</th>
            <SortableHeader sortKeyValue="price">Price</SortableHeader>
            <SortableHeader sortKeyValue="change">24h Change</SortableHeader>
            <SortableHeader sortKeyValue="volume">Volume (24h)</SortableHeader>
            <SortableHeader sortKeyValue="marketCap">Market Cap</SortableHeader>
          </tr>
        </thead>
        <tbody>
          {sortedCoins.map((coin, index) => (
            <tr key={coin.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">
                <FavoriteButton coinId={coin.id} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                  <span>{coin.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 uppercase text-gray-600">{coin.symbol}</td>
              <td className="px-4 py-3 text-right">${coin.current_price.toLocaleString()}</td>
              <td
                className={`px-4 py-3 text-right ${
                  coin.price_change_percentage_24h !== null && coin.price_change_percentage_24h >= 0 ? "text-green-600" : coin.price_change_percentage_24h !== null ? "text-red-600" : ""
                }`}
              >
                {coin.price_change_percentage_24h?.toFixed(2) ?? "N/A"}%
              </td>
              <td className="px-4 py-3 text-right">${coin.total_volume.toLocaleString()}</td>
              <td className="px-4 py-3 text-right">${coin.market_cap.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
