import CoinListContainer from "@/features/coins/components/CoinListContainer";
import { GetCoinsResponse } from "@/features/coins/api/getCoins";

async function getInitialCoins(): Promise<GetCoinsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/coins?page=1&limit=50&sort=price_desc`, {
    cache: "no-store", // 또는 { next: { revalidate: 60 } }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch initial coins");
  }

  return res.json();
}

export default async function CoinListPage() {
  const initialData = await getInitialCoins();

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Cryptocurrency List</h1>
      <CoinListContainer initialData={initialData} />
    </div>
  );
}
