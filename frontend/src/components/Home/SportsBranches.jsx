import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const branchesData = [
  {
    id: "futsal",
    name: "Futsal",
    displayName: "Futsal",
    icon: "https://www.turktelekomspor.com.tr/media/otebufta/footballactive.png",
  },
  {
    id: "voleybol",
    name: "Voleybol",
    displayName: "Voleybol",
    icon: "https://www.turktelekomspor.com.tr/media/wjpf0elo/volleyballactive.png",
  },
  {
    id: "atletizm",
    name: "Atletizm",
    displayName: "Atletizm",
    icon: "https://www.turktelekomspor.com.tr/media/r1yjaxbv/wushuactive.png",
  },
  {
    id: "basketbol",
    name: "3X3 Basketbol",
    displayName: "3X3 Basketbol",
    icon: "https://www.turktelekomspor.com.tr/media/0dhhdnsg/basketballactive.png",
  },
  {
    id: "gures",
    name: "Güreş",
    displayName: "Güreş",
    icon: "https://www.turktelekomspor.com.tr/media/11ydcfad/wrestlingactive.png",
  },
  {
    id: "bilek-guresi",
    name: "Bilek Güreşi",
    displayName: "Bilek Güreşi",
    icon: "https://www.turktelekomspor.com.tr/media/t00dvwvg/bilekguresiactive.png",
  },
  {
    id: "taekwondo",
    name: "Taekwondo",
    displayName: "Taekwondo",
    icon: "https://www.turktelekomspor.com.tr/media/vord0mi4/taekwondoactive.png",
  },
  {
    id: "okculuk",
    name: "Geleneksel Türk Okçuluğu",
    displayName: "Geleneksel Türk Okçuluğu",
    icon: "https://www.turktelekomspor.com.tr/media/chhgaryj/okculukactive.png",
  },
  {
    id: "badminton",
    name: "Badminton",
    displayName: "Badminton",
    icon: "https://www.turktelekomspor.com.tr/media/uhxdtsk5/badmintonactive.png",
  },
  {
    id: "masa-tenisi",
    name: "MASA TENİSİ",
    displayName: "MASA TENİSİ",
    icon: "https://www.turktelekomspor.com.tr/media/q2vf53ww/tabletennisactive.png",
  },
];

export default function CreativeBranchesSlider() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [progress, setProgress] = useState(0);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      const totalScroll = scrollWidth - clientWidth;
      const currentProgress = (scrollLeft / totalScroll) * 100;
      setProgress(currentProgress);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
    }
    return () => el?.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth / 1.2;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="py-10 top-10 bg-[#FDFBF7] relative overflow-hidden font-sans selection:bg-red-100 selection:text-red-900">
      {/* --- 1. ARKA PLAN (Diğer sayfayla birebir aynı) --- */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-px h-full bg-slate-200/60"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-slate-200/60"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-slate-200/60"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* --- 2. BAŞLIK VE KONTROLLER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-10">
          <div className="max-w-xl">
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.9]">
              Mücadele <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">
                Arenası
              </span>
            </h2>
          </div>

          {/* Butonlar (Light Mode Uyumlu) */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-14 h-14 rounded-full border border-slate-200 bg-white flex items-center justify-center transition-all duration-300 ${
                !canScrollLeft
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-red-600 hover:border-red-600 hover:text-white hover:shadow-lg hover:shadow-red-500/30 text-slate-900"
              }`}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-14 h-14 rounded-full border border-slate-200 bg-white flex items-center justify-center transition-all duration-300 ${
                !canScrollRight
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-red-600 hover:border-red-600 hover:text-white hover:shadow-lg hover:shadow-red-500/30 text-slate-900"
              }`}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* --- 3. SLIDER ALANI --- */}
        <div className="relative group/slider">
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto pb-16 pt-4 snap-x snap-mandatory scrollbar-hide px-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {branchesData.map((branch, index) => (
              // SLIDER KARTI (Yeni Tasarım)
              <div
                key={branch.id}
                className="snap-center flex-shrink-0 w-[85vw] sm:w-[320px] h-[480px] group relative cursor-pointer"
              >
                <div className="h-full w-full bg-white rounded-[2.5rem] p-2 border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200 hover:border-red-100 flex flex-col">
                  {/* DEĞİŞİKLİK 1: Görsel alanı h-[65%] -> h-[78%] yapıldı. 
            Böylece görsel büyüdü, alttaki beyaz alan daraldı. */}
                  <div className="relative w-full h-[78%] rounded-[2rem] overflow-hidden bg-slate-50">
                    {/* Numara */}
                    <div className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-xs font-black text-slate-900 border border-white/20 shadow-sm">
                      {(index + 1).toString().padStart(2, "0")}
                    </div>

                    {/* Görsel */}
                    <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                    <img
                      src={branch.icon}
                      alt={branch.displayName}
                      className="w-full h-full object-cover object-center grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* DEĞİŞİKLİK 2: py-6 -> py-3 yapıldı (Dikey boşluk azaltıldı) */}
                  <div className="flex-1 flex flex-col justify-center px-3 py-3">
                    <div>
                      {/* Başlık fontu biraz daha sıkılaştırıldı */}
                      <h3 className="text-xl font-black text-slate-900 leading-tight mb-1 group-hover:text-red-600 transition-colors">
                        {branch.displayName}
                      </h3>
                      <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                        2025 Sezonu
                      </p>
                    </div>

                    {/* DEĞİŞİKLİK 3: Alt çizgi ve ok kısmındaki 'mb-20' silindi. 
                Bu gereksiz yere aşağıdan büyük bir boşluk itiyordu. */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="w-12 h-1 bg-slate-100 rounded-full group-hover:bg-red-600 group-hover:w-20 transition-all duration-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="w-4 shrink-0"></div>
          </div>

          {/* Yanlardaki Fade Efekti (Rengi arka plana uyduruldu) */}
          <div
            className={`absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-[#FDFBF7] to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
              !canScrollLeft ? "opacity-0" : "opacity-100"
            }`}
          ></div>
          <div
            className={`absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-[#FDFBF7] to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
              !canScrollRight ? "opacity-0" : "opacity-100"
            }`}
          ></div>
        </div>

        {/* --- 4. PROGRESS BAR --- */}
        <div className="mt-4 flex items-center gap-6 max-w-md mx-auto md:mx-0">
          <span className="text-xs font-bold text-slate-400">01</span>
          <div className="h-1 flex-1 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-600 transition-all duration-300 ease-out"
              style={{ width: `${Math.max(progress, 5)}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {branchesData.length.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
/*  Deniyoruz */