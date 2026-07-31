# ETUDE 메인페이지

Figma 시안([피그마 파일 복제](https://www.figma.com/design/WAaADtkHIFqUBf4a3keYkY/%ED%94%BC%EA%B7%B8%EB%A7%88-%ED%8C%8C%EC%9D%BC-%EB%B3%B5%EC%A0%9C))을 구현한 에뛰드 메인페이지입니다.

**순수 HTML / CSS / JS 로만 되어 있습니다.** 프레임워크도, 빌드 도구도, `npm install` 도 필요 없습니다.

## 실행

로컬 서버로 `static/index.html` 을 엽니다 (VS Code 의 Live Server 확장이 가장 간단).

`file://` 로 직접 열면 JS 가 캐시돼서 수정이 반영되지 않고, Instagram 영상(mp4)도
Range 요청이 필요해 제대로 재생되지 않습니다. **반드시 서버로 보세요.**

코드 구조와 수정 방법은 [`static/README.md`](static/README.md) 에 정리돼 있습니다.

## 배포

[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) 이 `main` 에 푸시될 때마다
`static/` 폴더를 GitHub Pages 아티팩트로 올립니다.

> 저장소 **Settings → Pages → Source** 가 `GitHub Actions` 로 되어 있어야 합니다.
> `Deploy from a branch` 로 두면 저장소 루트에 `index.html` 이 없어서
> Jekyll 이 이 README 를 대신 렌더링합니다.

## 디렉터리 구조

```
static/                 사이트 본체
  index.html              페이지 전체 마크업
  css/style.css           모든 스타일 (미디어쿼리 2개: ≤1024px 태블릿, =768px 보정)
  js/main.js              매장찾기 · GNB/LNB · Instagram 캐러셀
  images/main/            PNG 65 · SVG 15 · MP4 8

assets/                 디자이너가 주는 원본 Figma 에셋 101개
                        (여기서 골라 static/images/main/ 으로 복사해 씁니다)

.github/workflows/      GitHub Pages 배포
```

## 참고

- **작업 전에 [`작업-인계-문서.md`](작업-인계-문서.md) 를 먼저 읽으세요.**
  피그마 노드 ID, 반응형 구조, 그리고 모르면 헛수고하는 함정 7가지가 정리돼 있습니다.
- **1920 × 10427px 캔버스**를 `zoom` 으로 화면 폭에 맞춰 스케일합니다. 가로 스크롤은 생기지 않습니다.
- 여러 도구(Claude / Codex)로 병행 작업하는 저장소라 HEAD 가 자주 바뀝니다.
  손대기 전에 `git fetch` 후 `git log --oneline -5` 로 현재 상태를 확인하세요.

## 이력

2026-07-31 까지 이 저장소에는 같은 페이지의 **Next.js(App Router) 버전**이 `src/` 에 함께 있었습니다.
`static/` 쪽만 계속 수정되면서 8커밋 차이로 벌어졌고, 이미지가 담긴 `public/` 이 `.gitignore` 에
걸려 있어 실행조차 되지 않는 상태여서 제거했습니다.

마지막 상태는 `nextjs-last` 태그에 남아 있습니다.

```bash
git show nextjs-last:src/components/main-page/MainPage.tsx
```
