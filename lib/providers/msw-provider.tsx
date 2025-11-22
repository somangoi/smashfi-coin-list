'use client';

import { useEffect, useState } from 'react';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    const initMsw = async () => {
      // 개발 환경에서만 MSW 활성화
      if (process.env.NODE_ENV === 'development') {
        const { worker } = await import('@/mocks/browser');
        await worker.start({
          onUnhandledRequest: 'bypass', // MSW가 처리하지 않는 요청은 그대로 통과
        });
        console.log('[MSW] Mock Service Worker started');
      }
      setMswReady(true);
    };

    initMsw();
  }, []);

  // MSW가 준비될 때까지 로딩 표시
  if (!mswReady) {
    return null;
  }

  return <>{children}</>;
}
