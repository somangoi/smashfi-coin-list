import TabNavigation from "@/features/favorites/components/TabNavigation";
import CoinSearchBar from "./CoinSearchBar";
import Skeleton from "@/shared/components/Skeleton";
import { useCoinListParams } from "../model/useCoinListParams";

interface CoinListSkeletonScreenProps {
  params: ReturnType<typeof useCoinListParams>;
}

export default function CoinListSkeletonScreen({ params }: CoinListSkeletonScreenProps) {
  const { activeTab, setActiveTab } = params;

  return (
    <div>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <CoinSearchBar placeholder="Search by name or symbol..." />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          <colgroup>
            <col style={{ width: "40px" }} />
            <col style={{ width: "300px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "150px" }} />
          </colgroup>
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 text-left font-semibold"></th>
              <th className="px-4 py-3 text-left font-semibold">Coin</th>
              <th className="px-4 py-3 text-right font-semibold">Price</th>
              <th className="px-4 py-3 text-right font-semibold">24h Change</th>
              <th className="px-4 py-3 text-right font-semibold">24h Volume</th>
              <th className="px-4 py-3 text-right font-semibold">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, index) => (
              <tr key={index} className="border-b h-[57px]">
                <td className="px-4 py-3">
                  <Skeleton className="w-6 h-6 rounded-full" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 h-6">
                    <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-16 h-5" />
                      <Skeleton className="w-24 h-5" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Skeleton className="w-20 h-5" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Skeleton className="w-16 h-5" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Skeleton className="w-24 h-5" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Skeleton className="w-28 h-5" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
