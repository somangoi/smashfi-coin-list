import { http, HttpResponse } from 'msw';
import mockCoins from '@/data/mock_coins.json';

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

export const handlers = [
  // GET /api/coins - 검색, 정렬, 페이지네이션 지원
  http.get('/api/coins', ({ request }) => {
    const url = new URL(request.url);

    // 쿼리 파라미터 추출
    const query = url.searchParams.get('q')?.toLowerCase() || '';
    const sort = url.searchParams.get('sort') || '';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);

    let filteredCoins: Coin[] = [...mockCoins];

    // 1. 검색 필터링 (q 파라미터)
    // 예: ?q=bit → 이름이나 심볼에 'bit'가 포함된 코인만 반환
    if (query) {
      filteredCoins = filteredCoins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(query) ||
          coin.symbol.toLowerCase().includes(query)
      );
    }

    // 2. 정렬 (sort 파라미터)
    // 예: ?sort=price_desc → 가격 내림차순
    // 예: ?sort=volume_asc → 거래량 오름차순
    if (sort) {
      const [sortKey, sortDirection] = sort.split('_');

      filteredCoins.sort((a, b) => {
        let aValue: number;
        let bValue: number;

        switch (sortKey) {
          case 'price':
            aValue = a.current_price;
            bValue = b.current_price;
            break;
          case 'change':
            aValue = a.price_change_percentage_24h ?? 0;
            bValue = b.price_change_percentage_24h ?? 0;
            break;
          case 'volume':
            aValue = a.total_volume;
            bValue = b.total_volume;
            break;
          case 'marketCap':
          case 'market_cap':
            aValue = a.market_cap;
            bValue = b.market_cap;
            break;
          default:
            aValue = a.market_cap;
            bValue = b.market_cap;
        }

        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    // 3. 페이지네이션 (page, limit 파라미터)
    // 예: ?page=3&limit=50 → 3번째 페이지의 50개 아이템 반환
    const totalCount = filteredCoins.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCoins = filteredCoins.slice(startIndex, endIndex);

    // 4. 응답 반환 (메타데이터 포함)
    return HttpResponse.json({
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
  }),
];
