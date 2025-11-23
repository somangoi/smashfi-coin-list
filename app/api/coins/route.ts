import { NextRequest, NextResponse } from "next/server";
import mockCoins from "@/data/mock_coins.json";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  total_volume: number;
  market_cap: number;
  image: string;
  [key: string]: any;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // 쿼리 파라미터 추출
  const query = searchParams.get("q")?.toLowerCase() || "";
  const sort = searchParams.get("sort") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const idsParam = searchParams.get("ids");

  let filteredCoins: Coin[] = [...mockCoins];

  // 즐겨찾기 필터링
  if (idsParam !== null) {
    // ids 파라미터가 "__EMPTY__"이면 빈 배열 반환
    if (idsParam === "__EMPTY__") {
      filteredCoins = [];
    } else {
      // ids 파라미터가 존재하면 해당 id들만 필터링
      const favoriteIds = idsParam.split(",").filter((id) => id);
      filteredCoins = filteredCoins.filter((coin) => favoriteIds.includes(coin.id));
    }
  }

  // 1. 검색 필터링 (q 파라미터)
  if (query) {
    filteredCoins = filteredCoins.filter(
      (coin) => coin.name.toLowerCase().includes(query) || coin.symbol.toLowerCase().includes(query)
    );
  }

  // 2. 정렬 (sort 파라미터)
  if (sort) {
    const [sortKey, sortDirection] = sort.split("_");

    filteredCoins.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortKey) {
        case "price":
          aValue = a.current_price;
          bValue = b.current_price;
          break;
        case "change":
          aValue = a.price_change_percentage_24h ?? 0;
          bValue = b.price_change_percentage_24h ?? 0;
          break;
        case "volume":
          aValue = a.total_volume;
          bValue = b.total_volume;
          break;
        case "marketCap":
        case "market_cap":
          aValue = a.market_cap;
          bValue = b.market_cap;
          break;
        default:
          aValue = a.market_cap;
          bValue = b.market_cap;
      }

      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });
  }

  // 3. 페이지네이션 (page, limit 파라미터)
  const totalCount = filteredCoins.length;
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedCoins = filteredCoins.slice(startIndex, endIndex);

  // 4. 응답 반환 (메타데이터 포함)
  return NextResponse.json({
    data: paginatedCoins,
    meta: {
      total: totalCount,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  });
}
