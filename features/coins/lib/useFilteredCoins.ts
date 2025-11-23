import { useMemo } from "react";
import { useFavoriteStore } from "@/features/favorites/stores/useFavoriteStore";
import { Coin } from "../types/coin";

export function useFilteredCoins(allCoins: Coin[], activeTab: string) {
  const { favoriteIds } = useFavoriteStore();

  return useMemo(() => {
    if (activeTab === "favorites") {
      return allCoins.filter((coin) => favoriteIds.includes(coin.id));
    }
    return allCoins;
  }, [allCoins, activeTab, favoriteIds]);
}
