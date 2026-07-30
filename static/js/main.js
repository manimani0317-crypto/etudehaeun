/* =========================================================================
   ETUDE 메인페이지 — 스크립트
   프레임워크 없이 동작하는 일반 자바스크립트입니다.

   지금 들어있는 기능은 "Offline Etude"(매장찾기) 섹션 하나입니다.
     · 매장 목록을 클릭하면 지도가 해당 매장으로 이동
     · 지도를 좌우로 드래그해도 매장이 전환
     · 선택된 매장의 핀 색상과 말풍선 내용이 바뀜
   ========================================================================= */

(function () {
  'use strict';

  /* ----- 매장 데이터 -------------------------------------------------
     mapShift / mapShiftY 는 지도 이미지를 얼마나 밀어줄지(px)입니다.
     매장 위치를 조정하고 싶으면 이 숫자만 바꾸면 됩니다.            */
  var STORES = [
    {
      name: '강남지상점',
      tag: '에뛰드 가맹점',
      tagColor: '#ff6aa1',
      address1: '서울특별시 서초구 서초동',
      address2: '1306-5',
      pinColor: '#ff6aa1',
      mapShift: 72,
      mapShiftY: 179
    },
    {
      name: '역삼점',
      tag: '올리브영',
      tagColor: '#87d26e',
      address1: '서울특별시 강남구 테헤란로 111',
      address2: '',
      pinColor: '#87d26e',
      mapShift: 0,
      mapShiftY: 0
    },
    {
      name: '압구정점',
      tag: '에뛰드 가맹점',
      tagColor: '#ff6aa1',
      address1: '서울특별시 강남구 압구정로212 신사동',
      address2: '방우상가1층1호,2호',
      pinColor: '#ff6aa1',
      mapShift: -200,
      mapShiftY: 146
    }
  ];

  /* 지도 이미지(1207.5 x 1152)가 표시창(921 x 610) 밖으로 밀려
     가장자리가 비지 않도록 이동 가능한 범위를 제한합니다. */
  var MAP_LIMIT = { minX: -205, maxX: 72, minY: -288, maxY: 243 };

  function clamp(v, min, max) {
    return v < min ? min : (v > max ? max : v);
  }

  var INACTIVE_PIN = '#B1B1B1';
  var SETTLE_TRANSITION = 'transform 0.55s cubic-bezier(0.4,0,0.2,1)';
  var SWIPE_THRESHOLD = 60;   // 이 픽셀 이상 끌면 매장 전환
  var DRAG_FOLLOW = 0.35;     // 드래그할 때 지도가 따라오는 비율

  /* ----- GNB / LNB -----------------------------------------------------
     대메뉴를 클릭하면 해당 하위 메뉴(LNB)가 펼쳐지고 대메뉴에 밑줄이 생깁니다.
     같은 메뉴를 다시 누르거나 GNB 바깥을 누르면 닫힙니다.                */
  (function () {
    var gmb = document.querySelector('.gmb');
    if (!gmb) return;

    var triggers = gmb.querySelectorAll('[data-gnb]');
    var pinned = null;      // 클릭으로 고정해 둔 메뉴
    var closeTimer = null;

    function show(key) {
      window.clearTimeout(closeTimer);
      gmb.setAttribute('data-lnb-open', key);
    }

    function hide() {
      gmb.removeAttribute('data-lnb-open');
    }

    function hideSoon() {
      // 대메뉴 → LNB 로 마우스를 옮기는 사이에 닫히지 않도록 약간 지연
      closeTimer = window.setTimeout(function () {
        if (!pinned) hide();
      }, 120);
    }

    for (var i = 0; i < triggers.length; i++) {
      (function (el) {
        var key = el.getAttribute('data-gnb');

        // 호버: 잠깐 펼쳐 보기
        el.addEventListener('mouseenter', function () { show(key); });
        el.addEventListener('focusin', function () { show(key); });

        // 클릭: 고정 / 해제
        el.addEventListener('click', function (e) {
          e.stopPropagation();
          if (pinned === key) { pinned = null; hide(); }
          else { pinned = key; show(key); }
        });
      })(triggers[i]);
    }

    gmb.addEventListener('mouseenter', function () { window.clearTimeout(closeTimer); });
    gmb.addEventListener('mouseleave', function () {
      if (pinned) show(pinned);
      else hideSoon();
    });

    // GNB 바깥을 클릭하면 고정 해제 후 닫기
    document.addEventListener('click', function (e) {
      if (!gmb.contains(e.target)) { pinned = null; hide(); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { pinned = null; hide(); }
    });
  })();

  var section = document.querySelector('[data-offline-section]');
  if (!section) return;

  var mapArea = section.querySelector('[data-map-drag]');
  var movers = section.querySelectorAll('[data-map-move]');
  var rows = section.querySelectorAll('[data-store-row]');
  var bubbleName = section.querySelector('[data-bubble-name]');
  var bubbleTag = section.querySelector('[data-bubble-tag]');
  var bubbleAddress = section.querySelector('[data-bubble-address]');

  var activeIdx = 1;          // 기본값: 역삼점
  var dragStartX = null;
  var dragDelta = 0;
  var isDown = false;

  /* ----- 화면 갱신 ---------------------------------------------------- */
  function render() {
    var store = STORES[activeIdx];
    var settled = dragDelta === 0;

    // 지도 이동
    var x = clamp(store.mapShift + dragDelta * DRAG_FOLLOW, MAP_LIMIT.minX, MAP_LIMIT.maxX);
    var y = clamp(store.mapShiftY, MAP_LIMIT.minY, MAP_LIMIT.maxY);
    for (var i = 0; i < movers.length; i++) {
      movers[i].style.transform = 'translateX(' + x + 'px) translateY(' + y + 'px)';
      movers[i].style.transition = settled ? SETTLE_TRANSITION : 'none';
    }

    // 핀 색상
    for (var j = 0; j < rows.length; j++) {
      var idx = Number(rows[j].getAttribute('data-store-row'));
      var pin = rows[j].querySelector('[data-store-pin]');
      if (pin) pin.setAttribute('fill', idx === activeIdx ? STORES[idx].pinColor : INACTIVE_PIN);
    }

    // 말풍선
    if (bubbleName) bubbleName.textContent = store.name;
    if (bubbleTag) {
      bubbleTag.textContent = store.tag;
      bubbleTag.style.background = store.tagColor;
    }
    if (bubbleAddress) {
      bubbleAddress.textContent = store.address1;
      if (store.address2) {
        bubbleAddress.appendChild(document.createElement('br'));
        bubbleAddress.appendChild(document.createTextNode(store.address2));
      }
    }
  }

  function setActive(idx) {
    activeIdx = Math.max(0, Math.min(STORES.length - 1, idx));
    render();
  }

  /* ----- 목록 클릭 ---------------------------------------------------- */
  for (var k = 0; k < rows.length; k++) {
    (function (row) {
      row.addEventListener('click', function () {
        setActive(Number(row.getAttribute('data-store-row')));
      });
    })(rows[k]);
  }

  /* ----- 지도 드래그 -------------------------------------------------- */
  if (mapArea) {
    mapArea.style.cursor = 'grab';

    mapArea.addEventListener('pointerdown', function (e) {
      dragStartX = e.clientX;
      isDown = true;
      mapArea.style.cursor = 'grabbing';
      mapArea.setPointerCapture(e.pointerId);
    });

    mapArea.addEventListener('pointermove', function (e) {
      if (!isDown || dragStartX === null) return;
      dragDelta = e.clientX - dragStartX;
      render();
    });

    function endDrag(e) {
      if (!isDown) return;
      isDown = false;
      mapArea.style.cursor = 'grab';

      var delta = e.clientX - (dragStartX === null ? e.clientX : dragStartX);
      dragStartX = null;
      dragDelta = 0;

      if (delta < -SWIPE_THRESHOLD) setActive(activeIdx - 1);
      else if (delta > SWIPE_THRESHOLD) setActive(activeIdx + 1);
      else render();
    }

    mapArea.addEventListener('pointerup', endDrag);
    mapArea.addEventListener('pointerleave', endDrag);
  }

  render();
})();

/* =========================================================================
   INSTAGRAM — 3D 링(반지) 캐러셀
     · 카드가 원형으로 늘어서서 양 끝은 rotateY 로 눕습니다(사다리꼴)
     · 가운데 카드는 항상 가장 크고 정면, 자동 재생
     · 마우스를 올리면 재생되고 아래 아이템 박스가 올라옴
     · 클릭하면 그 카드가 가운데로
     · 좌우로 드래그하면 손가락을 따라 링이 부드럽게 돌아감

   ※ 카드 미디어는 muted · loop · playsinline 영상입니다.
      가운데 카드는 자동 재생하고, 양옆 카드는 호버하는 동안 재생합니다.
   ========================================================================= */
(function () {
  'use strict';

  var list = document.querySelector('[data-insta-list]');
  if (!list) return;

  var cards = Array.prototype.slice.call(list.querySelectorAll('[data-insta-card]'));
  var n = cards.length;
  if (!n) return;

  /* ----- 링 모양을 결정하는 값들 (숫자만 바꾸면 형태가 달라집니다) ----- */
  var tabletInsta = window.matchMedia('(max-width: 1024px)').matches;
  var GAP_NEAR   = tabletInsta ? 334 : 230; // 태블릿 시안: 활성 카드와 양옆 카드 중심 간격
  var GAP_FAR    = tabletInsta ? 306 : 250; // 태블릿 시안: 276px 카드 + 30px 간격
  var ROT_MAX    = tabletInsta ? 0 : 42;
  var ROT_PER    = tabletInsta ? 0 : 32;
  var SCALE_MID  = tabletInsta ? 1 : 1.2; // 태블릿은 활성 카드 자체를 332×600으로 렌더링
  var SCALE_STEP = tabletInsta ? 0 : 0.09;
  var SCALE_MIN  = tabletInsta ? 1 : 0.78;
  var VISIBLE    = 3.2;   // 이보다 멀면 숨김
  var DRAG_STEP  = 260;   // 이 픽셀만큼 끌면 한 칸 돌아감

  var pos = Math.floor(n / 2);   // 가운데에 있는 카드(소수 가능 — 드래그 중)
  var dragging = false;
  var dragMoved = false;
  var startX = 0;
  var startPos = 0;

  /* ----- 영상 재생/정지 ----- */
  function setPlaying(card, on) {
    var media = card.querySelector('.insta-card-media');
    if (!media || typeof media.play !== 'function') return;
    if (on) {
      var r = media.play();
      if (r && typeof r.catch === 'function') r.catch(function () {});
    } else {
      media.pause();
    }
  }

  /* i 번 카드가 현재 중심에서 몇 칸 떨어져 있는지 (-n/2 ~ n/2, 소수 가능) */
  function offsetOf(i) {
    var off = (i - pos) % n;
    off = (off + n) % n;
    if (off > n / 2) off -= n;
    return off;
  }

  function render() {
    for (var i = 0; i < n; i++) {
      var card = cards[i];
      var off = offsetOf(i);
      var a = Math.abs(off);
      var dir = off === 0 ? 0 : (off > 0 ? 1 : -1);

      // 가로 위치: 첫 칸은 GAP_NEAR, 그 뒤로는 GAP_FAR 씩
      var x = dir * (a <= 1 ? a * GAP_NEAR : GAP_NEAR + (a - 1) * GAP_FAR);
      // 눕는 각도: 오른쪽 카드는 오른쪽 끝이 뒤로 가도록 음수
      var rotY = -dir * Math.min(ROT_MAX, a * ROT_PER);
      // 크기: 가운데가 가장 크고 멀어질수록 작아짐
      var scale = a < 1
        ? SCALE_MID - a * (SCALE_MID - 1)
        : Math.max(SCALE_MIN, 1 - (a - 1) * SCALE_STEP);
      // 뒤로 밀어 원근감을 살림
      var z = -a * 120;

      card.style.transform =
        'translate3d(' + x.toFixed(1) + 'px,0,' + z.toFixed(1) + 'px) ' +
        'rotateY(' + rotY.toFixed(2) + 'deg) ' +
        'scale(' + scale.toFixed(3) + ')';
      card.style.zIndex = String(100 - Math.round(a * 10));
      card.style.opacity = a > VISIBLE ? '0' : '1';
      card.style.pointerEvents = a > VISIBLE ? 'none' : 'auto';

      var isCenter = a < 0.5;
      card.classList.toggle('is-active', isCenter);
      if (!dragging) setPlaying(card, isCenter);
    }
  }

  function goTo(idx) {
    // 가장 가까운 방향으로 돌도록 보정
    var off = (idx - pos) % n;
    off = (off + n) % n;
    if (off > n / 2) off -= n;
    pos = pos + off;
    render();
  }

  function settle() {
    pos = Math.round(pos);
    pos = ((pos % n) + n) % n;
    render();
  }

  /* ----- 클릭 → 가운데로 / 호버 → 재생 ----- */
  cards.forEach(function (card, i) {
    card.addEventListener('click', function () {
      if (dragMoved) return;
      goTo(i);
    });
    card.addEventListener('mouseenter', function () {
      if (Math.abs(offsetOf(i)) >= 0.5) setPlaying(card, true);
    });
    card.addEventListener('mouseleave', function () {
      if (Math.abs(offsetOf(i)) >= 0.5) setPlaying(card, false);
    });
  });

  /* ----- 드래그 — 끄는 만큼 링이 따라 돌아감 ----- */
  list.addEventListener('pointerdown', function (e) {
    dragging = true;
    dragMoved = false;
    startX = e.clientX;
    startPos = pos;
    list.classList.add('is-dragging');
    list.setPointerCapture(e.pointerId);
  });

  list.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var dx = e.clientX - startX;
    if (Math.abs(dx) > 6) dragMoved = true;
    pos = startPos - dx / DRAG_STEP;
    render();
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    list.classList.remove('is-dragging');
    settle();
    window.setTimeout(function () { dragMoved = false; }, 0);
  }

  list.addEventListener('pointerup', endDrag);
  list.addEventListener('pointercancel', endDrag);

  /* ----- 키보드 ----- */
  list.setAttribute('tabindex', '0');
  list.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { pos += 1; settle(); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { pos -= 1; settle(); e.preventDefault(); }
  });

  render();
})();

/* =========================================================================
   MAKEUP LOOK — 큰 카드의 아이템 미니 슬라이더
     · 아래 화살표를 누르면 아이템 창이 조금 내려오고 인디케이터가 나타남
     · 열린 상태에서 좌우 드래그 / 점 클릭으로 아이템 3개를 넘길 수 있음
   ========================================================================= */
(function () {
  'use strict';

  var panel = document.querySelector('[data-look-panel]');
  if (!panel) return;

  var track = panel.querySelector('[data-look-track]');
  var toggle = panel.querySelector('[data-look-toggle]');
  var dots = Array.prototype.slice.call(panel.querySelectorAll('[data-look-dot]'));
  var slides = Array.prototype.slice.call(panel.querySelectorAll('.look-slide'));
  if (!track || !toggle || !slides.length) return;

  var idx = 0;
  var open = false;

  function render() {
    track.style.transform = 'translateX(' + (-idx * 100 / slides.length) + '%)';
    dots.forEach(function (d, i) { d.classList.toggle('is-on', i === idx); });
  }

  function goTo(i) {
    idx = Math.max(0, Math.min(slides.length - 1, i));
    render();
  }

  // 트랙 전체 너비를 슬라이드 수만큼 잡아 줍니다
  track.style.width = (slides.length * 100) + '%';
  slides.forEach(function (s) { s.style.width = (100 / slides.length) + '%'; });

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    open = !open;
    panel.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open) goTo(0);
  });

  dots.forEach(function (d) {
    d.addEventListener('click', function (e) {
      e.stopPropagation();
      goTo(Number(d.getAttribute('data-look-dot')));
    });
  });

  /* 열린 상태에서 좌우 드래그로 넘기기 */
  var startX = null;
  var down = false;

  track.addEventListener('pointerdown', function (e) {
    if (!open) return;
    down = true;
    startX = e.clientX;
    track.setPointerCapture(e.pointerId);
  });

  function end(e) {
    if (!down) return;
    down = false;
    var dx = e.clientX - startX;
    startX = null;
    if (dx < -40) goTo(idx + 1);
    else if (dx > 40) goTo(idx - 1);
  }

  track.addEventListener('pointerup', end);
  track.addEventListener('pointercancel', end);

  render();
})();
