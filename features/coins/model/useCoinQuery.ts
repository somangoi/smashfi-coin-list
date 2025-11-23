import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCoins } from "../api/getCoins";
import { useCoinListParams } from "./useCoinListParams";
import { useFavoriteStore } from "@/features/favorites/stores/useFavoriteStore";

const ITEMS_PER_PAGE = 50;

export function useCoinQuery(params: ReturnType<typeof useCoinListParams>) {
  const { searchQuery, sortKey, sortDirection, activeTab } = params;
  const { favoriteIds } = useFavoriteStore();

  const sortParam = sortKey ? `${sortKey}_${sortDirection}` : undefined;

  // 즐겨찾기 탭일 때: favoriteIds가 비어있으면 "__EMPTY__", 있으면 join
  // All 탭일 때: undefined
  const idsParam = activeTab === "favorites" ? (favoriteIds.length > 0 ? favoriteIds.join(",") : "__EMPTY__") : undefined;

  const query = useInfiniteQuery({
    queryKey: ["coins", searchQuery, sortParam, activeTab, idsParam],
    queryFn: ({ pageParam = 1 }) =>
      getCoins({
        query: searchQuery,
        sort: sortParam,
        page: pageParam,
        limit: ITEMS_PER_PAGE,
        ids: idsParam,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.meta.hasNext ? lastPage.meta.page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const coins = useMemo(() => {
    if (!query.data) return [];
    return query.data.pages.flatMap((page) => page.data);
  }, [query.data]);

  return {
    ...query,
    coins,
  };
}
