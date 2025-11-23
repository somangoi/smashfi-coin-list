import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCoins, GetCoinsResponse } from "../api/getCoins";
import { useCoinListParams } from "./useCoinListParams";
import { useFavoriteStore } from "@/features/favorites/stores/useFavoriteStore";

const ITEMS_PER_PAGE = 50;

export function useCoinQuery(params: ReturnType<typeof useCoinListParams>, initialData?: GetCoinsResponse) {
  const { searchQuery, sortKey, sortDirection, activeTab } = params;
  const { favoriteIds } = useFavoriteStore();

  const sortParam = sortKey ? `${sortKey}_${sortDirection}` : undefined;

  // 즐겨찾기 탭일 때: favoriteIds가 비어있으면 "__EMPTY__", 있으면 join
  // All 탭일 때: undefined
  const idsParam = activeTab === "favorites" ? (favoriteIds.length > 0 ? favoriteIds.join(",") : "__EMPTY__") : undefined;

  // 초기 데이터 사용 여부 확인 (검색어, 정렬, 탭이 기본값일 때만)
  const isDefaultQuery = !searchQuery && sortParam === "price_desc" && activeTab === "all";

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
    // 기본 쿼리일 때만 서버에서 받은 initialData 사용
    initialData: isDefaultQuery && initialData
      ? {
          pages: [initialData],
          pageParams: [1],
        }
      : undefined,
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
