import { create } from "zustand";
import { useEffect, useRef } from "react";

interface SearchState {
  localSearchQuery: string;
  debouncedSearchQuery: string;
  setLocalSearchQuery: (query: string) => void;
  setDebouncedSearchQuery: (query: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  localSearchQuery: "",
  debouncedSearchQuery: "",
  setLocalSearchQuery: (query: string) => set({ localSearchQuery: query }),
  setDebouncedSearchQuery: (query: string) => set({ debouncedSearchQuery: query }),
}));

// 로컬 검색어를 300ms debounce하여 서버 요청용 검색어로 업데이트하는 훅
export function useSearchDebounce() {
  const { localSearchQuery, setDebouncedSearchQuery } = useSearchStore();
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(localSearchQuery);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [localSearchQuery, setDebouncedSearchQuery]);
}
