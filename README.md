# Cryptocurrency List

실시간 암호화폐 가격 정보를 제공하는 Next.js 기반 웹 애플리케이션

## 주요 기능

- **암호화폐 목록 조회** - 50개 이상의 주요 암호화폐 실시간 정보
- **실시간 검색** - Debounced search (300ms)로 최적화된 검색 경험
- **즐겨찾기** - 관심있는 코인을 로컬에 저장하고 필터링
- **다중 정렬** - 가격, 변동률, 거래량, 시가총액 기준 정렬
- **무한 스크롤** - Virtual scrolling으로 성능 최적화된 페이지네이션
- **SSR** - Server-side rendering으로 빠른 초기 로딩

## 기술 스택

### Core

- **Next.js 15** - App Router, Server Components, API Routes
- **React 19** - Server/Client Components
- **TypeScript** - 타입 안정성

### 상태 관리

- **TanStack Query (React Query)** - 서버 상태 관리 및 캐싱
- **Zustand** - 전역 클라이언트 상태 (검색어, 즐겨찾기)

### UI/UX

- **Tailwind CSS** - 유틸리티 우선 스타일링
- **TanStack Virtual** - 가상 스크롤링으로 성능 최적화
- **React Hot Toast** - 사용자 알림

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
npm run build
npm start
```

## 프로젝트 구조

```
smashfi-coin-list/
├── app/
│   ├── api/coins/          # API Routes
│   ├── coin-list/          # Coin list page
│   └── layout.tsx          # Root layout
├── features/
│   ├── coins/              # 코인 관련 기능
│   │   ├── api/            # API 클라이언트
│   │   ├── components/     # UI 컴포넌트
│   │   ├── model/          # 비즈니스 로직
│   │   ├── stores/         # Zustand stores
│   │   ├── types/          # TypeScript 타입
│   │   └── ui/             # UI 로직 (virtualizer)
│   └── favorites/          # 즐겨찾기 기능
│       ├── components/
│       └── stores/
├── shared/                 # 공유 컴포넌트
└── data/                   # Mock 데이터
```

## 주요 기능 구현

### 1. Server-side Rendering

```typescript
// app/coin-list/page.tsx
export default async function CoinListPage() {
  const initialData = await getInitialCoins(); // 서버에서 데이터 페칭
  return <CoinListContainer initialData={initialData} />;
}
```

- 서버에서 초기 데이터를 페칭하여 즉시 렌더링
- React Query의 `initialData`로 hydration

### 2. Debounced Search

```typescript
// features/coins/stores/useSearchStore.ts
const useSearchStore = create<SearchState>((set) => ({
  localSearchQuery: "", // 즉시 UI 반영
  debouncedSearchQuery: "", // 300ms 후 서버 요청
}));
```

- 사용자 입력은 즉시 UI에 반영
- 서버 요청은 300ms debounce로 최적화
- 검색 중 포커스 및 커서 위치 유지

### 3. Virtual Scrolling

```typescript
// features/coins/ui/useCoinVirtualizer.ts
const rowVirtualizer = useVirtualizer({
  count: coins.length,
  estimateSize: () => 60,
  overscan: 10,
});
```

- 대량의 데이터를 효율적으로 렌더링
- 실제로 보이는 행만 DOM에 렌더링
- 부드러운 스크롤 경험

### 4. API Routes

```typescript
// app/api/coins/route.ts
export async function GET(request: NextRequest) {
  // 검색, 정렬, 페이지네이션, 필터링 처리
  return NextResponse.json({ data, meta });
}
```

- Next.js API Routes로 백엔드 구현
- 개발/프로덕션 환경에서 동일한 코드 사용
- 현재는 mock 데이터 사용

## 성능 최적화

### 초기 로딩

- Server-side rendering
- React Query의 stale-while-revalidate 전략

### 런타임 성능

- Virtual scrolling로 렌더링 최적화
- Debounced search로 불필요한 API 호출 방지
- React.memo로 불필요한 리렌더링 방지

### 사용자 경험

- 스켈레톤 로딩 화면
- 에러 바운더리 및 에러 처리

## 개발 가이드

### 새로운 기능 추가

1. `features/` 디렉토리에 기능별 폴더 생성
2. 컴포넌트, API, 스토어를 분리하여 구성
3. Server/Client Components를 적절히 사용

### 코드 스타일

- ESLint + TypeScript로 타입 안정성 보장
- Feature-first 구조로 관련 코드 응집
- Server/Client Components 명확히 구분

## 향후 개선 방향

### 구현하지 못한 부분

- **실시간 데이터 연동**
  - 현재는 mock 데이터 사용
  - CoinGecko, Binance 등 실제 암호화폐 API 연동 필요
  - WebSocket을 통한 실시간 가격 업데이트

### 보완하고 싶은 점

1. **접근성 개선**

   - ARIA 레이블 추가
   - 키보드 네비게이션 개선
   - 스크린 리더 지원 강화

2. **반응형 UI 및 UX 개선**

   - 반응형 테이블 및 너비 조정 기능
   - 모바일 전용 UI/UX

3. **국제화 (i18n)**
   - 통화 단위 변환 (USD, KRW, etc.)
   - 날짜/시간 로케일 처리

## AI 도구 활용

프로젝트를 구현하는 과정에서 Claude Code, Cursor를 활용하였습니다.

#### 1. 초기 프로젝트 구조 설계

- Next.js 15 App Router 기반의 파일 구조 설정
- TypeScript 설정 및 타입 시스템 구축

#### 2. 기능 구현

- **SSR 구현**: Server Components와 React Query의 `initialData` 연동
- **Virtual Scrolling**: TanStack Virtual을 활용한 성능 최적화
- **API Routes**: Next.js API Routes로 백엔드 로직 구현

#### 3. 코드 리팩토링 및 코드 리뷰

- 중복 코드 제거 및 컴포넌트 분리
