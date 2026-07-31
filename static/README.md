# ETUDE 메인페이지 — 순수 HTML / CSS / JS

사이트 본체입니다. 프레임워크도, 빌드 도구도, `npm install` 도 필요 없습니다.

## 실행

**로컬 서버로 여세요.** VS Code 의 Live Server 확장(우클릭 → Open with Live Server)이 가장 간단합니다.

`index.html` 을 더블클릭해서 `file://` 로 열면 두 가지 문제가 있습니다.

- JS 가 캐시돼서 수정이 반영되지 않습니다.
- Instagram 영상(mp4)은 Range 요청이 필요해 제대로 재생되지 않을 수 있습니다.

## 파일 구성

```
static/
├── index.html          페이지 전체 마크업
├── css/
│   └── style.css       모든 스타일
├── js/
│   └── main.js         인터랙션 (매장찾기 · GNB/LNB · Instagram)
└── images/main/        PNG 65 · SVG 15 · MP4 8 (총 88개)
```

### index.html

요소마다 `class` 가 하나씩만 붙어 있고, 그 이름은 Figma 레이어 이름(`data-name`)에서 가져왔습니다.

```html
<div class="event01" data-name="Event01"> ... </div>
```

`style.css` 에서 같은 이름(`.event01`)을 찾으면 그 요소의 스타일이 전부 들어 있습니다.

### css/style.css

주석으로 구역이 나뉘어 있습니다.

| 구역 | 내용 |
| --- | --- |
| 0. 웹폰트 | S-Core Dream 을 `@font-face` 로 직접 정의 |
| 1. 기본 리셋 / 공통 변수 | 브라우저 기본 여백 제거 등. 보통 건드릴 일 없습니다. |
| 2. 요소별 스타일 | **여기를 주로 수정합니다.** 요소 하나당 규칙 하나. |
| 3. 인터랙션 | 호버 효과, 둥둥 뜨는 애니메이션 |
| 섹션별 블록 | SINCE · INSTAGRAM · FOOTER · MAKEUP LOOK |
| TABLET | `@media` 태블릿 레이아웃 (맨 아래) |

구역 2 의 요소별 규칙은 서로 독립적이라, 하나를 고쳐도 다른 요소에 영향이 가지 않습니다.
다만 **맨 아래 TABLET 구역이 위쪽 규칙을 재정의**하므로, 베이스를 고칠 땐 거기에 같은
선택자가 있는지 먼저 확인해야 합니다.

### js/main.js

인터랙션이 필요한 세 부분이 들어 있습니다.

| 구역 | 내용 |
| --- | --- |
| Offline Etude (매장찾기) | 매장 목록 클릭 → 지도 이동·핀 색상·말풍선 변경 / 지도 좌우 드래그 |
| GNB / LNB | 상단 메뉴 호버·클릭으로 LNB 4개 패널 펼침, 바깥 클릭·ESC 로 닫힘 |
| Instagram | 원통(cylinder) 캐러셀 + 카드 영상 재생 제어 |

매장 정보와 지도 위치는 파일 맨 위 `STORES` 배열에서 바꿀 수 있습니다.

```js
{
  name: '강남지상점',
  mapShift: 72,      // 지도를 가로로 미는 px
  mapShiftY: 179,    // 지도를 세로로 미는 px
  ...
}
```

Instagram 캐러셀의 모양은 `RADIUS`(1100) / `STEP_DEG`(20) 두 숫자로 조절합니다.

## 알아두면 좋은 점

- **1920 × 10427px 캔버스**를 `zoom` 으로 화면 폭에 맞춰 늘리고 줄입니다.
  (`.page { zoom: tan(atan2(100cqw, 1920px)) }` — 가로 스크롤은 생기지 않습니다.)
- 미디어쿼리는 **2개뿐**입니다. `@media (max-width: 1024px)` 가 768px 태블릿 레이아웃 전체를,
  `@media (width: 768px)` 가 Chromium 합성 문제 대응을 맡습니다.
  **베이스 규칙을 고칠 땐 태블릿 분기에 같은 선택자가 있는지 먼저 확인하세요.**
- 웹폰트(Pretendard, Lisu Bosa, S-Core Dream, Noto Sans KR)는 CDN 에서 불러옵니다.
  **인터넷 연결이 없으면 폰트가 기본 글꼴로 나옵니다.**
- 이미지는 `images/main/` 에만 둡니다. 디자이너 원본은 상위 폴더 `assets/`(101개) 에 있고,
  쓸 것만 골라 복사해서 씁니다.

## 더 볼 것

작업 이력, 피그마 노드 ID, 그리고 **모르면 헛수고하는 함정 7가지**가
[`../작업-인계-문서.md`](../작업-인계-문서.md) 에 정리돼 있습니다. 손대기 전에 먼저 읽으세요.

특히 이 두 가지는 자주 걸립니다.

- `[data-name="매장찾기"]` 는 `visibility: hidden` 으로 **숨겨져 있습니다.**
  실제로 보이는 건 `[data-offline-section]`(`.div-20`) 쪽입니다.
- 피그마 export 이미지는 **이미 잘린 결과물**이라, 중첩 래퍼와 퍼센트 좌표를 그대로 믿고
  늘리면 이미지가 찌그러집니다.
