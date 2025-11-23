import { createColumnHelper } from "@tanstack/react-table";
import { Coin } from "../types/coin";
import FavoriteButton from "@/features/favorites/components/FavoriteButton";

const columnHelper = createColumnHelper<Coin>();

export const columns = [
  columnHelper.display({
    id: "favorite",
    size: 5,

    header: "",
    cell: (info) => <FavoriteButton coinId={info.row.original.id} />,
  }),
  columnHelper.accessor("name", {
    id: "coin",
    size: 25,
    enableSorting: false,
    header: "Coin",
    cell: (info) => {
      const coin = info.row.original;
      return (
        <div className="flex items-center gap-2">
          <img src={coin.image} alt={coin.name} className="w-6 h-6" />
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="uppercase font-semibold whitespace-nowrap">{coin.symbol}</span>
            <span className="text-gray-400 text-sm truncate">{coin.name}</span>
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("current_price", {
    id: "price",
    size: 17.5,
    header: "Price",
    cell: (info) => <span>${info.getValue().toLocaleString()}</span>,
  }),
  columnHelper.accessor("price_change_percentage_24h", {
    id: "change",
    size: 17.5,
    header: "24h Change",
    cell: (info) => {
      const value = info.getValue();
      const colorClass = value !== null && value >= 0 ? "text-green-600" : value !== null ? "text-red-600" : "";
      return <span className={colorClass}>{value?.toFixed(2) ?? "N/A"}%</span>;
    },
  }),
  columnHelper.accessor("total_volume", {
    id: "volume",
    size: 17.5,
    header: "24h Volume",
    cell: (info) => <span>${info.getValue().toLocaleString()}</span>,
  }),
  columnHelper.accessor("market_cap", {
    id: "marketCap",
    size: 17.5,
    header: "Market Cap",
    cell: (info) => <span>${info.getValue().toLocaleString()}</span>,
  }),
];
