"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState, useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Coin } from "../types/coin";
import { getCoins } from "../api/getCoins";
import FavoriteButton from "@/features/favorites/components/FavoriteButton";
import TabNavigation from "@/features/favorites/components/TabNavigation";
import { useFavoriteStore } from "@/features/favorites/stores/useFavoriteStore";
import SearchBar from "@/shared/components/SearchBar";
import CoinListTableSkeleton from "./CoinListTableSkeleton";

type SortKey = "price" | "change" | "volume" | "marketCap";
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE = 50;

export default function CoinListTable() {
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const { favoriteIds } = useFavoriteStore();

  const tableContainerRef = useRef<HTMLDivElement>(null);

  // 서버사이드 정렬 키 생성
  const sortParam = sortKey ? `${sortKey}_${sortDirection}` : undefined;

  // useInfiniteQuery로 서버사이드 페이지네이션 구현
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteQuery({
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

  // 모든 페이지의 코인 데이터를 하나의 배열로 합치기
  const allCoins = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);

  // 즐겨찾기 탭 필터링 (클라이언트 사이드)
  const filteredCoins = useMemo(() => {
    if (activeTab === "favorites") {
      return allCoins.filter((coin) => favoriteIds.includes(coin.id));
    }
    return allCoins;
  }, [allCoins, activeTab, favoriteIds]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  // 가상 리스트 설정
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? filteredCoins.length + 1 : filteredCoins.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 60, // 각 row의 예상 높이
    overscan: 10, // 화면 밖 렌더링할 아이템 수
  });

  // 무한 스크롤: 마지막 아이템이 보이면 다음 페이지 로드
  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) return;

    if (lastItem.index >= filteredCoins.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, filteredCoins.length, isFetchingNextPage, rowVirtualizer.getVirtualItems()]);

  const SortableHeader = ({ sortKeyValue, children, align = "right" }: { sortKeyValue: SortKey; children: React.ReactNode; align?: "left" | "right" }) => (
    <th className={`px-4 py-3 text-${align} font-semibold cursor-pointer hover:bg-gray-100 select-none`} onClick={() => handleSort(sortKeyValue)}>
      <div className={`flex items-center gap-1 ${align === "right" ? "justify-end" : "justify-start"}`}>
        {children}
        {sortKey === sortKeyValue && <span className="text-xs">{sortDirection === "asc" ? "▲" : "▼"}</span>}
      </div>
    </th>
  );

  if (isLoading) {
    return (
      <div>
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by name or symbol..." />
        <CoinListTableSkeleton />
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
      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by name or symbol..." />

      <div ref={tableContainerRef} className="overflow-auto h-[600px]">
        <table className="w-full border-collapse table-fixed">
          <colgroup>
            <col style={{ width: "40px" }} />
            <col style={{ width: "300px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "150px" }} />
          </colgroup>
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b">
              <th className="px-4 py-3 text-left font-semibold"></th>
              <th className="px-4 py-3 text-left font-semibold">Coin</th>
              <SortableHeader sortKeyValue="price">Price</SortableHeader>
              <SortableHeader sortKeyValue="change">24h Change</SortableHeader>
              <SortableHeader sortKeyValue="volume">24h Volume</SortableHeader>
              <SortableHeader sortKeyValue="marketCap">Market Cap</SortableHeader>
            </tr>
          </thead>
          <tbody>
            <tr
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const isLoaderRow = virtualRow.index > filteredCoins.length - 1;
                const coin = filteredCoins[virtualRow.index];

                return (
                  <tr
                    key={virtualRow.index}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="border-b hover:bg-gray-50"
                  >
                    {isLoaderRow ? (
                      <td colSpan={6} className="px-4 py-3 text-center">
                        {hasNextPage ? "Loading more..." : "No more data"}
                      </td>
                    ) : coin ? (
                      <>
                        <td className="px-4 py-3">
                          <FavoriteButton coinId={coin.id} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                            <div className="flex items-center gap-2">
                              <span className="uppercase font-semibold">{coin.symbol}</span>
                              <span className="text-gray-400 text-sm">{coin.name}</span>
                            </div>
                          </div>
                        </td>
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
                      </>
                    ) : null}
                  </tr>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* 메타 정보 표시 */}
      <div className="mt-4 text-center text-sm text-gray-600">
        {data && (
          <p>
            전체 {data.pages[0]?.meta.total.toLocaleString() || 0}개의 코인 중 {filteredCoins.length.toLocaleString()}개를 표시
            {isFetchingNextPage && " (불러오는 중...)"}
          </p>
        )}
      </div>
    </div>
  );
}
