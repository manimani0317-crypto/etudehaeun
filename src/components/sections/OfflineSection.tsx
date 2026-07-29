"use client";

import { useState, useRef } from "react";
import { imgOfflineMap } from "@/assets/images";
import svgPaths from "@/components/main-page/svg-paths";

// Map order (left → right): 강남지상점(0) → 역삼점(1) → 압구정점(2)
// List order (original Figma): 강남지상점, 압구정점, 역삼점
const STORES = [
  {
    id: 0,
    name: "강남지상점",
    tag: "에뛰드 가맹점",
    tagColor: "#ff6aa1",
    address1: "서울특별시 서초구 서초동",
    address2: "1306-5",
    phone: "02-532-5139",
    pinColor: "#ff6aa1",
    mapShift: 150,
    mapShiftY: 170, // 왼쪽 위로 45도 조정
  },
  {
    id: 1,
    name: "역삼점",
    tag: "올리브영",
    tagColor: "#87d26e",
    address1: "서울특별시 강남구 테헤란로 111",
    address2: "",
    phone: "1577-4887",
    pinColor: "#87d26e",
    mapShift: 0,
    mapShiftY: 0,
  },
  {
    id: 2,
    name: "압구정점",
    tag: "에뛰드 가맹점",
    tagColor: "#ff6aa1",
    address1: "서울특별시 강남구 압구정로212 신사동",
    address2: "방우상가1층1호,2호",
    phone: "02-2679-6030",
    pinColor: "#ff6aa1",
    mapShift: -280,
    mapShiftY: 150,
  },
];

// Lens center in map-container coords:
// Magnifier SVG: left=905.38, top=280.79 in section
// Lens circle center in SVG coords: (223.722, 223.722), inner radius≈190.32
// → section: (1129.1, 504.5) → map container (left=671, top=290): (458, 215)
const LENS_CLIP = "circle(190px at 458px 215px)";

function LocationPin({ color }: { color: string }) {
  return (
    <div style={{ position: "relative", overflow: "clip", flexShrink: 0, width: 48, height: 48 }}>
      <div style={{ position: "absolute", top: "12.5%", left: "16.67%", right: "20.43%", bottom: "10.67%" }}>
        <svg
          fill="none"
          height="36.8805"
          viewBox="0 0 30.192 36.8805"
          width="30.192"
          style={{ position: "absolute", display: "block", inset: 0, width: "100%", height: "100%" }}
        >
          <path data-store-pin="" d={svgPaths.p362d6a80} fill={color} style={{ transition: "fill 0.3s ease" }} />
        </svg>
      </div>
    </div>
  );
}

function PlusIcon({ color }: { color: string }) {
  return (
    <div style={{ position: "relative", overflow: "clip", flexShrink: 0, width: 14, height: 14 }}>
      <div style={{ position: "absolute", inset: "22.92%" }}>
        <svg
          fill="none"
          height="7.58333"
          viewBox="0 0 7.58333 7.58333"
          width="7.58333"
          style={{ position: "absolute", display: "block", inset: 0, width: "100%", height: "100%" }}
        >
          <path d={svgPaths.pd675600} fill={color} style={{ transition: "fill 0.25s ease" }} />
        </svg>
      </div>
    </div>
  );
}

function OfflineButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      data-offline-button=""
      style={{
        display: "flex",
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        borderRadius: 12,
        width: 150,
        border: "1px solid #737373",
        cursor: "pointer",
        transition: "background-color 0.25s ease",
        backgroundColor: hovered ? "#737373" : "transparent",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        style={{
          fontFamily: "'Pretendard Variable', sans-serif",
          fontWeight: 200,
          fontSize: 16,
          color: hovered ? "#ffffff" : "#737373",
          transition: "color 0.25s ease",
        }}
      >
        매장 찾기
      </span>
      <PlusIcon color={hovered ? "#ffffff" : "#737373"} />
    </div>
  );
}

interface StoreRowProps {
  store: (typeof STORES)[0];
  isActive: boolean;
  onClick: () => void;
}

function StoreRow({ store, isActive, onClick }: StoreRowProps) {
  return (
    <div data-store-row={STORES.indexOf(store)} onClick={onClick} style={{ position: "relative", width: "100%", cursor: "pointer" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 40px 8px 0",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span
              style={{
                fontFamily: "'Lisu Bosa', 'Noto Sans KR', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: "#3b3638",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              {store.name}
            </span>
            <span
              style={{
                background: store.tagColor,
                color: "white",
                fontSize: 10,
                padding: "4px 8px",
                borderRadius: 4,
                fontFamily: "'Pretendard Variable', sans-serif",
                fontWeight: 400,
                whiteSpace: "nowrap",
              }}
            >
              {store.tag}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontFamily: "'S-Core Dream', sans-serif", fontSize: 14, color: "#3b3638", lineHeight: 1 }}>
              {store.address1}
            </span>
            {store.address2 && (
              <span
                style={{
                  fontFamily: "'Pretendard Variable', sans-serif",
                  fontWeight: 200,
                  fontSize: 14,
                  color: "#737373",
                  lineHeight: 1,
                }}
              >
                {store.address2}
              </span>
            )}
          </div>
          <span
            style={{
              fontFamily: "'Pretendard Variable', sans-serif",
              fontWeight: 200,
              fontSize: 14,
              color: "#737373",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {store.phone}
          </span>
        </div>
        <LocationPin color={isActive ? store.pinColor : "#B1B1B1"} />
      </div>
    </div>
  );
}

export default function OfflineSection() {
  const [activeIdx, setActiveIdx] = useState(1); // 역삼점 default
  const store = STORES[activeIdx];

  const dragStartX = useRef<number | null>(null);
  const [dragDelta, setDragDelta] = useState(0);
  const isDown = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    isDown.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDown.current || dragStartX.current === null) return;
    setDragDelta(e.clientX - dragStartX.current);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDown.current) return;
    isDown.current = false;
    const delta = e.clientX - (dragStartX.current ?? e.clientX);
    dragStartX.current = null;
    setDragDelta(0);

    if (delta < -60) setActiveIdx((p) => Math.max(0, p - 1));
    else if (delta > 60) setActiveIdx((p) => Math.min(2, p + 1));
  };

  const mapTranslateX = store.mapShift + dragDelta * 0.35;
  const mapTranslateY = store.mapShiftY;
  const isSettled = dragDelta === 0;
  const mapTransform = `translateX(${mapTranslateX}px) translateY(${mapTranslateY}px)`;
  const mapTransition = isSettled ? "transform 0.55s cubic-bezier(0.4,0,0.2,1)" : "none";

  const mapImgStyle: React.CSSProperties = {
    position: "absolute",
    height: "147.74%",
    left: "-14.83%",
    maxWidth: "none",
    top: "-26.14%",
    width: "130.03%",
    display: "block",
  };

  return (
    <div
      data-offline-section=""
      style={{
        position: "absolute",
        height: 1080,
        left: 0,
        top: 4325,
        width: 1920,
        overflow: "clip",
        background: "white",
        zIndex: 10,
      }}
    >
      {/* ── MAP (oval) ─────────────────────────────────────────── */}
      <div
        data-map-drag=""
        style={{
          position: "absolute",
          height: 438,
          left: 671,
          top: 290,
          width: 908,
          borderRadius: 999,
          overflow: "hidden",
          cursor: isDown.current ? "grabbing" : "grab",
          userSelect: "none",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={(e) => { if (isDown.current) onPointerUp(e); }}
      >
        {/* Layer 1: Blurred background — moves with drag/store */}
        <div
          data-map-move=""
          style={{
            position: "absolute",
            inset: 0,
            transform: mapTransform,
            transition: mapTransition,
            filter: "blur(4px) brightness(0.82)",
          }}
        >
          <img src={imgOfflineMap} alt="" style={mapImgStyle} />
        </div>

        {/* Layer 2: Fixed lens clip — stays at lens position */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: LENS_CLIP,
          }}
        >
          {/* Unblurred map inside the clip — moves with drag/store */}
          <div
            data-map-move=""
            style={{
              position: "absolute",
              inset: 0,
              transform: mapTransform,
              transition: mapTransition,
            }}
          >
            <img src={imgOfflineMap} alt="" style={mapImgStyle} />
          </div>
        </div>
      </div>

      {/* ── Subtract white overlay ──────────────────────────────── */}
      <div style={{ position: "absolute", height: 592, left: 499, top: 213, width: 1209, pointerEvents: "none" }}>
        <svg
          fill="none"
          height="592"
          preserveAspectRatio="none"
          viewBox="0 0 1209 592"
          width="1209"
          style={{ position: "absolute", display: "block", inset: 0, width: "100%", height: "100%" }}
        >
          <path d={svgPaths.p2f45f980} fill="white" fillOpacity="0.1" />
        </svg>
      </div>

      {/* ── Magnifier SVG ───────────────────────────────────────── */}
      <div style={{ position: "absolute", height: 461.213, left: 905.38, top: 280.79, width: 590.722, pointerEvents: "none" }}>
        <svg
          fill="none"
          height="461.213"
          preserveAspectRatio="none"
          viewBox="0 0 590.722 461.213"
          width="590.722"
          style={{ position: "absolute", display: "block", inset: 0, width: "100%", height: "100%" }}
        >
          <g opacity="0.88">
            <g>
              <path d={svgPaths.p1adcf880} fill="#8D8787" />
              <path d={svgPaths.p1adcf880} fill="url(#mgGrad)" fillOpacity="0.5" />
            </g>
            <g>
              <path d={svgPaths.p2e731f00} fill="#8D8787" />
            </g>
          </g>
          <defs>
            <linearGradient id="mgGrad" gradientUnits="userSpaceOnUse" x1="481.043" x2="405.24" y1="385.572" y2="341.319">
              <stop stopColor="#666666" stopOpacity="0" />
              <stop offset="1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ── Speech Bubble ───────────────────────────────────────── */}
      <div style={{ position: "absolute", left: 996, top: 390, width: 295, pointerEvents: "none", zIndex: 20 }}>
        <div
          style={{
            background: "white",
            borderRadius: 14,
            padding: "14px 16px 13px",
            boxShadow: "-1px -3px 10px rgba(180,150,150,0.4)",
            position: "relative",
          }}
        >
          {/* tail */}
          <div
            style={{
              position: "absolute",
              bottom: -11,
              left: 22,
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "12px solid white",
            }}
          />
          {/* store name + tag + 더보기 */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span data-bubble-name="" style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, fontSize: 14, color: "#3b3638", whiteSpace: "nowrap" }}>
                {store.name}
              </span>
              <span
                data-bubble-tag=""
                style={{
                  background: store.tagColor,
                  color: "white",
                  fontSize: 9,
                  padding: "2px 5px",
                  borderRadius: 4,
                  fontFamily: "'Pretendard Variable', sans-serif",
                  fontWeight: 400,
                  whiteSpace: "nowrap",
                }}
              >
                {store.tag}
              </span>
            </div>
            <span
              style={{
                fontFamily: "'Pretendard Variable', sans-serif",
                fontSize: 11,
                color: "#737373",
                whiteSpace: "nowrap",
                marginLeft: 8,
                borderBottom: "1px solid #b1b1b1",
                pointerEvents: "auto",
                cursor: "pointer",
              }}
            >
              더보기+
            </span>
          </div>
          <p
            data-bubble-address=""
            style={{
              fontFamily: "'Pretendard Variable', sans-serif",
              fontWeight: 300,
              fontSize: 12,
              color: "#737373",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {store.address1}
            {store.address2 && (
              <>
                <br />
                {store.address2}
              </>
            )}
          </p>
        </div>
      </div>

      {/* ── Left panel: title + button ──────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: 343,
          top: 190,
          display: "flex",
          flexDirection: "column",
          gap: 40,
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <p style={{ fontFamily: "'Lisu Bosa', serif", fontWeight: 700, fontSize: 60, color: "#252525", lineHeight: 1.1, margin: 0, whiteSpace: "nowrap" }}>
            Offline Etude
          </p>
          <div>
            <p style={{ fontFamily: "'Pretendard Variable', sans-serif", fontWeight: 200, fontSize: 24, color: "#737373", lineHeight: 1.2, margin: 0 }}>
              제품들을 직접 보고
            </p>
            <p style={{ fontFamily: "'Pretendard Variable', sans-serif", fontWeight: 200, fontSize: 24, color: "#737373", lineHeight: 1.2, margin: 0 }}>
              구매할 수 있는 오프라인 매장!
            </p>
          </div>
        </div>
        <OfflineButton />
      </div>

      {/* ── Store list ─────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: 343,
          top: 460,
          width: 431,
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* 강남지상점 */}
        <StoreRow store={STORES[0]} isActive={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <hr style={{ border: "none", borderTop: "0.6px solid #B1B1B1", margin: "0 20px" }} />
        {/* 압구정점 */}
        <StoreRow store={STORES[2]} isActive={activeIdx === 2} onClick={() => setActiveIdx(2)} />
        <hr style={{ border: "none", borderTop: "0.6px solid #B1B1B1", margin: "0 20px" }} />
        {/* 역삼점 */}
        <StoreRow store={STORES[1]} isActive={activeIdx === 1} onClick={() => setActiveIdx(1)} />
      </div>
    </div>
  );
}
