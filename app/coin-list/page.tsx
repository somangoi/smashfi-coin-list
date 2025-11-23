import CoinListContainer from "@/features/coins/components/CoinListContainer";

export default function CoinListPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Cryptocurrency List</h1>
      <CoinListContainer />
    </div>
  );
}
