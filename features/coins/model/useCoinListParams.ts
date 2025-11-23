import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { SortKey, SortDirection } from "../types/sort";

export function useCoinListParams() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL에서 파라미터 읽기
  const activeTab = (searchParams.get("tab") as "all" | "favorites") || "all";
  const searchQuery = searchParams.get("q") || "";
  const sortParam = searchParams.get("sort");
  const [sortKey, sortDirection] = sortParam ? (sortParam.split("_") as [SortKey, SortDirection]) : [null, "desc" as SortDirection];

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

  const setSearchQuery = useCallback(
    (query: string) => {
      updateParams({ q: query });
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
    searchQuery,
    sortKey,
    sortDirection,
    setActiveTab,
    setSearchQuery,
    handleSort,
  };
}
