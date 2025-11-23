import { Virtualizer } from "@tanstack/react-virtual";
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender, SortingState } from "@tanstack/react-table";
import { useMemo } from "react";
import { Coin } from "../types/coin";
import { useCoinListParams } from "../model/useCoinListParams";
import { columns } from "../config/columns";

interface CoinListTableContentProps {
  filteredCoins: Coin[];
  hasNextPage: boolean | undefined;
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  params: ReturnType<typeof useCoinListParams>;
}

export default function CoinListTableContent({ filteredCoins, hasNextPage, tableContainerRef, rowVirtualizer, params }: CoinListTableContentProps) {
  const { sortKey, sortDirection, handleSort } = params;

  // React Table의 정렬 상태를 URL 기반 정렬과 동기화
  const sorting: SortingState = useMemo(() => {
    if (!sortKey) return [];
    return [{ id: sortKey, desc: sortDirection === "desc" }];
  }, [sortKey, sortDirection]);

  const table = useReactTable({
    data: filteredCoins,
    columns,
    state: {
      sorting,
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === "function" ? updater(sorting) : updater;
      if (newSorting.length > 0) {
        handleSort(newSorting[0].id as any);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true, // URL 기반 정렬 사용
    enableSortingRemoval: false, // 정렬 해제 방지 (asc <-> desc만 토글)
    enableColumnResizing: false,
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
  });

  const { rows } = table.getRowModel();

  return (
    <div ref={tableContainerRef} className="overflow-auto h-full align-top">
      <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
        <thead className="sticky top-0 bg-white z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b">
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const isSorted = header.column.getIsSorted();

                return (
                  <th
                    key={header.id}
                    className={`px-4 py-3 font-semibold ${header.column.id === "favorite" || header.column.id === "coin" ? "text-left" : "text-right"} ${
                      canSort ? "cursor-pointer hover:bg-gray-100 select-none" : ""
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ width: `${header.column.getSize()}%` }}
                  >
                    <div className={`flex items-center gap-1 ${header.column.id === "favorite" || header.column.id === "coin" ? "justify-start" : "justify-end"}`}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {isSorted && <span className="text-xs">{isSorted === "desc" ? "▼" : "▲"}</span>}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const isLoaderRow = virtualRow.index > filteredCoins.length - 1;
            const row = rows[virtualRow.index];

            return (
              <tr
                key={virtualRow.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  display: "table",
                  tableLayout: "fixed",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="border-b hover:bg-gray-50"
              >
                {isLoaderRow ? (
                  <td colSpan={table.getAllColumns().length} className="px-4 py-3 text-center">
                    {hasNextPage ? "Loading more..." : "No more data"}
                  </td>
                ) : row ? (
                  row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={`px-4 py-3 ${cell.column.id === "favorite" || cell.column.id === "coin" ? "text-left" : "text-right"}`} style={{ width: `${cell.column.getSize()}%` }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
