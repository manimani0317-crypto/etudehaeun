# ETUDE 메인페이지

Figma 시안([피그마 파일 복제](https://www.figma.com/design/WAaADtkHIFqUBf4a3keYkY/%ED%94%BC%EA%B7%B8%EB%A7%88-%ED%8C%8C%EC%9D%BC-%EB%B3%B5%EC%A0%9C))을 구현한 에뛰드 메인페이지입니다.
기존 Vite + React SPA 구조를 **Next.js(App Router)** 로 리팩토링했습니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
```

| 스크립트 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드 결과 실행 |
| `npm run typecheck` | 타입 검사 (`tsc --noEmit`) |

## 기술 스택

- Next.js 15 (App Router) / React 19 / TypeScript
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- Radix UI 기반 shadcn/ui 컴포넌트

## 두 가지 버전

이 저장소에는 같은 페이지가 두 벌 들어 있습니다.

| 폴더 | 설명 |
| --- | --- |
| 루트 (`src/`, `public/`) | **Next.js 버전** — `npm run dev` 로 실행 |
| [`static/`](static/) | **순수 HTML/CSS/JS 버전** — `static/index.html` 을 브라우저로 바로 열면 됨 |

두 버전은 서로 독립적입니다. 한쪽을 고쳐도 다른 쪽에 반영되지 않습니다.
프레임워크 없이 직접 코드를 다루고 싶다면 `static/` 을, 컴포넌트 단위로 개발하려면 루트를 쓰세요.

## 디렉터리 구조

```
static/                 순수 HTML/CSS/JS 버전 (독립 실행)
public/
  images/main/            메인페이지 이미지(PNG) — 정적 서빙
src/
  app/
    layout.tsx            루트 레이아웃 (metadata, 웹폰트 <link>)
    page.tsx              메인페이지 라우트 (/)
  assets/
    images.ts             public 이미지 경로 상수
  components/
    main-page/            Figma 에서 생성된 메인페이지 마크업
      MainPage.tsx
      svg-paths.ts        SVG path 데이터
      logo.ts             로고 data URI
    sections/
      OfflineSection.tsx  매장찾기 섹션 (인터랙티브, client component)
    figma/                ImageWithFallback
    ui/                   shadcn/ui 컴포넌트
  hooks/
    use-mobile.ts
  lib/
    utils.ts              cn() 헬퍼
  styles/
    globals.css           엔트리 (layout.tsx 에서 import)
    tailwind.css          Tailwind v4 진입점 + @source
    theme.css             디자인 토큰 / @theme inline
    main-page.css         메인페이지 전용 전역 스타일(호버·애니메이션)
assets/                   원본 Figma SVG 에셋 (코드에서 직접 참조하지 않음)
```

## 참고

- 메인페이지는 **1920px 고정 폭** 디자인입니다. 반응형이 아니며, `app/page.tsx` 에서
  최소 캔버스 크기(1920 × 9926)를 지정합니다.
- `MainPage.tsx` 는 Figma 에서 생성된 코드라 서버 컴포넌트로 렌더링되며,
  상태·이벤트가 필요한 컴포넌트에만 `"use client"` 가 선언되어 있습니다.
- 원본 Figma 의 매장찾기 섹션은 `main-page.css` 에서 숨기고
  `OfflineSection` 으로 대체합니다.
