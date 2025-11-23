'use client';

import { useRef } from 'react';
import { useSearchStore } from '../stores/useSearchStore';

interface CoinSearchBarProps {
  placeholder?: string;
}

export default function CoinSearchBar({ placeholder = 'Search...' }: CoinSearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const localSearchQuery = useSearchStore((state) => state.localSearchQuery);
  const setLocalSearchQuery = useSearchStore((state) => state.setLocalSearchQuery);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cursorPosition = e.target.selectionStart;
    setLocalSearchQuery(e.target.value);

    // 다음 렌더링 후 커서 위치 복원
    requestAnimationFrame(() => {
      if (inputRef.current && cursorPosition !== null) {
        inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    });
  };

  return (
    <div className="mb-4">
      <input
        ref={inputRef}
        type="text"
        value={localSearchQuery}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
