"use client";

import { useCoinListParams } from "../model/useCoinListParams";
import { useCoinQuery } from "../model/useCoinQuery";
import { useCoinVirtualizer } from "../ui/useCoinVirtualizer";
import CoinListSkeletonScreen from "./CoinListSkeletonScreen";
import CoinListErrorScreen from "./CoinListErrorScreen";
import CoinListTableContent from "./CoinListTableContent";
import CoinListFooterMeta from "./CoinListFooterMeta";

export default function CoinListScreen() {
  const params = useCoinListParams();
  const { data, coins: filteredCoins, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useCoinQuery(params);
  const { tableContainerRef, rowVirtualizer } = useCoinVirtualizer(filteredCoins, hasNextPage, isFetchingNextPage, fetchNextPage);

  if (isLoading) return <CoinListSkeletonScreen params={params} />;
  if (error) return <CoinListErrorScreen />;

  return (
    <>
      <CoinListTableContent filteredCoins={filteredCoins} hasNextPage={hasNextPage} tableContainerRef={tableContainerRef} rowVirtualizer={rowVirtualizer} params={params} />
      <CoinListFooterMeta data={data} filteredCoinsLength={filteredCoins.length} isFetchingNextPage={isFetchingNextPage} />
    </>
  );
}
