import * as fs from 'fs';
import * as path from 'path';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: any;
  last_updated: string;
}

async function fetchCoinsPage(page: number): Promise<CoinData[]> {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${page}&sparkline=false`;

  console.log(`Fetching page ${page}...`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch page ${page}: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`Page ${page}: ${data.length} coins fetched`);

  return data;
}

async function fetchAllCoins(targetCount: number = 1000): Promise<CoinData[]> {
  const allCoins: CoinData[] = [];
  const perPage = 250;
  const totalPages = Math.ceil(targetCount / perPage);

  console.log(`Target: ${targetCount} coins (${totalPages} pages)\n`);

  for (let page = 1; page <= totalPages; page++) {
    try {
      const coins = await fetchCoinsPage(page);

      if (coins.length === 0) {
        console.log(`No more coins available at page ${page}`);
        break;
      }

      allCoins.push(...coins);
      console.log(`Total collected: ${allCoins.length} coins\n`);

      // CoinGecko API rate limit 방지를 위한 딜레이 (무료 API는 분당 10-50 요청)
      if (page < totalPages) {
        console.log('Waiting 2 seconds before next request...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      if (allCoins.length >= targetCount) {
        break;
      }
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      break;
    }
  }

  return allCoins;
}

async function saveMockData(coins: CoinData[]): Promise<void> {
  const dataDir = path.join(process.cwd(), 'data');
  const filePath = path.join(dataDir, 'mock_coins.json');

  // data 디렉토리가 없으면 생성
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('Created data directory');
  }

  // JSON 파일 저장
  fs.writeFileSync(filePath, JSON.stringify(coins, null, 2));
  console.log(`\n✅ Successfully saved ${coins.length} coins to ${filePath}`);
  console.log(`File size: ${(fs.statSync(filePath).size / 1024 / 1024).toFixed(2)} MB`);
}

async function main() {
  try {
    console.log('🚀 Starting CoinGecko data fetch...\n');

    const coins = await fetchAllCoins(1000);

    if (coins.length === 0) {
      console.error('❌ No coins fetched');
      process.exit(1);
    }

    await saveMockData(coins);

    console.log('\n📊 Summary:');
    console.log(`   Total coins: ${coins.length}`);
    console.log(`   First coin: ${coins[0].name} (${coins[0].symbol})`);
    console.log(`   Last coin: ${coins[coins.length - 1].name} (${coins[coins.length - 1].symbol})`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
