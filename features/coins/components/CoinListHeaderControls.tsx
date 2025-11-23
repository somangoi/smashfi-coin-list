"use client";

import { useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TabNavigation from "@/features/favorites/components/TabNavigation";
import CoinSearchBar from "./CoinSearchBar";

export default function CoinListHeaderControls() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeTab = (searchParams.get("tab") as "all" | "favorites") || "all";

  const setActiveTab = useCallback(
    (tab: "all" | "favorites") => {
      const params = new URLSearchParams(searchParams.toString());
      if (tab === "all") {
        params.delete("tab");
      } else {
        params.set("tab", tab);
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  return (
    <div>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <CoinSearchBar placeholder="Search by name or symbol..." />
    </div>
  );
}
