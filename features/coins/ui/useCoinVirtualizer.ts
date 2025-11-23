import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useEffect } from "react";
import { Coin } from "../types/coin";

export function useCoinVirtualizer(coins: Coin[], hasNextPage?: boolean, isFetchingNextPage?: boolean, fetchNextPage?: () => void) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? coins.length + 1 : coins.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 60,
    overscan: 10,
  });

  useEffect(() => {
    const virtualItems = rowVirtualizer.getVirtualItems();
    if (!virtualItems.length) return;

    const lastItem = virtualItems[virtualItems.length - 1];

    if (lastItem.index >= coins.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage?.();
    }
  }, [coins.length, hasNextPage, isFetchingNextPage, fetchNextPage, rowVirtualizer.getVirtualItems()]);

  return {
    tableContainerRef,
    rowVirtualizer,
  };
}
