import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCoins } from "../api/getCoins";
import { useCoinListParams } from "./useCoinListParams";
import { useFilteredCoins } from "../lib/useFilteredCoins";

const ITEMS_PER_PAGE = 50;

export function useCoinQuery(params: ReturnType<typeof useCoinListParams>) {
  const { searchQuery, sortKey, sortDirection, activeTab } = params;

  const sortParam = sortKey ? `${sortKey}_${sortDirection}` : undefined;

  const query = useInfiniteQuery({
    queryKey: ["coins", searchQuery, sortParam, activeTab],
    queryFn: ({ pageParam = 1 }) =>
      getCoins({
        query: searchQuery,
        sort: sortParam,
        page: pageParam,
        limit: ITEMS_PER_PAGE,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.meta.hasNext ? lastPage.meta.page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const allCoins = useMemo(() => {
    if (!query.data) return [];
    return query.data.pages.flatMap((page) => page.data);
  }, [query.data]);

  const filteredCoins = useFilteredCoins(allCoins, activeTab);

  return {
    ...query,
    allCoins,
    coins: filteredCoins,
  };
}
