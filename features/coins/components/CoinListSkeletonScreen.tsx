import Skeleton from "@/shared/components/Skeleton";

export default function CoinListSkeletonScreen() {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          <colgroup>
            <col style={{ width: "5%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "17.5%" }} />
            <col style={{ width: "17.5%" }} />
            <col style={{ width: "17.5%" }} />
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
