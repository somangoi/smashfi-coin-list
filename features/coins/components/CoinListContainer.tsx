"use client";

import CoinListHeaderControls from "./CoinListHeaderControls";
import CoinListScreen from "./CoinListScreen";
import { GetCoinsResponse } from "../api/getCoins";

interface CoinListContainerProps {
  initialData: GetCoinsResponse;
}

export default function CoinListContainer({ initialData }: CoinListContainerProps) {
  return (
    <div className="h-[85vh] grid grid-rows-[auto_1fr_auto]">
      <CoinListHeaderControls />
      <CoinListScreen initialData={initialData} />
    </div>
  );
}
