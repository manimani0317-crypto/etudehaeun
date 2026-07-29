import MainPage from "@/components/main-page/MainPage";
import OfflineSection from "@/components/sections/OfflineSection";

/**
 * 메인페이지는 1920px 고정 폭 디자인이라 부모에 최소 크기를 잡아둡니다.
 * (Figma 원본 캔버스: 1920 × 9926)
 */
export default function Home() {
  return (
    <div className="relative min-h-[9926px] min-w-[1920px] overflow-visible">
      <MainPage />
      <OfflineSection />
    </div>
  );
}
