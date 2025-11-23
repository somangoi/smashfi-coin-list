import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { SortKey, SortDirection } from "../types/sort";
import { useSearchStore, useSearchDebounce } from "../stores/useSearchStore";

export function useCoinListParams() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 검색어 debounce 활성화
  useSearchDebounce();

  // 전역 상태에서 검색어 가져오기
  const { localSearchQuery, debouncedSearchQuery, setLocalSearchQuery } = useSearchStore();

  // URL에서 파라미터 읽기
  const activeTab = (searchParams.get("tab") as "all" | "favorites") || "all";
  const sortParam = searchParams.get("sort") || "price_desc";
  const [sortKey, sortDirection] = sortParam.split("_") as [SortKey, SortDirection];

  // URL 업데이트 헬퍼
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  // 개별 setter 함수들
  const setActiveTab = useCallback(
    (tab: "all" | "favorites") => {
      updateParams({ tab: tab === "all" ? null : tab });
    },
    [updateParams]
  );

  const handleSort = useCallback(
    (key: SortKey) => {
      const isSameKey = sortKey === key;
      const newDirection = isSameKey && sortDirection === "desc" ? "asc" : "desc";
      updateParams({ sort: `${key}_${newDirection}` });
    },
    [sortKey, sortDirection, updateParams]
  );

  return {
    activeTab,
    searchQuery: debouncedSearchQuery, // 서버 요청용
    localSearchQuery, // UI 표시용
    setSearchQuery: setLocalSearchQuery, // 검색어 입력 핸들러
    sortKey,
    sortDirection,
    setActiveTab,
    handleSort,
  };
}
