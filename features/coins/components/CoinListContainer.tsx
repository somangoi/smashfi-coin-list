import CoinListHeaderControls from "./CoinListHeaderControls";
import CoinListScreen from "./CoinListScreen";

export default function CoinListContainer() {
  return (
    <div className="h-[85vh] grid grid-rows-[auto_1fr_auto]">
      <CoinListHeaderControls />
      <CoinListScreen />
    </div>
  );
}
