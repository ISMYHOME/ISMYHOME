/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, CheckCircle, MessageCircle, CalendarDays, ShieldCheck } from 'lucide-react';
import { HERO_SLIDES } from '../data';
import { getKakaoLink } from '../utils/kakaoHelper';

interface HeroCarouselProps {
  onOpenBooking: () => void;
}

export default function HeroCarousel({ onOpenBooking }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleKakaoConsult = () => {
    window.open(getKakaoLink(), '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="hero-section" className="relative h-[680px] md:h-[750px] w-full flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.6, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={HERO_SLIDES[current].imageUrl}
            alt={HERO_SLIDES[current].title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter select-none brightness-75 bg-slate-900"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/40"></div>
        </motion.div>
      </AnimatePresence>

      {/* Hero Content Overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center">
        {/* Badge Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-bold tracking-tight mb-4 shadow-lg shadow-amber-400/10"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          {HERO_SLIDES[current].badge}
        </motion.div>

        {/* Super Headline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.3 }}
          className="text-xs md:text-sm font-semibold tracking-widest text-slate-300 uppercase mb-4"
        >
          건축공학 전공 + 시공사 경력 전문가의 프리미엄 아파트 사전점검
        </motion.p>

        {/* Primary Typography Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight text-white mb-6 leading-tight max-w-4xl"
        >
          입주 전 발견하지 못한 하자,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-white">IS마이홈</span>이 꼼꼼하게 확인해드립니다.
        </motion.h1>

        {/* Dynamic Caption depending on current slide */}
        <motion.p
          key={`caption-${current}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-slate-300 text-sm md:text-base font-light max-w-2xl leading-relaxed mb-10 h-12"
        >
          {HERO_SLIDES[current].subtitle}
        </motion.p>

        {/* Call To Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center px-4"
        >
          <button
            id="hero-book-now-btn"
            onClick={handleKakaoConsult}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FEE500] hover:bg-[#F0D800] text-slate-900 font-bold text-sm sm:text-base rounded-xl transition-all hover:scale-[1.02] shadow-xl shadow-yellow-500/10 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-slate-900 stroke-none" />
            카카오톡 예약문의하기
          </button>
        </motion.div>
      </div>

      {/* Manual Slide Controls */}
      <button
        id="hero-prev-btn"
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/75 hover:text-white transition-colors z-20 cursor-pointer hidden md:flex"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        id="hero-next-btn"
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/75 hover:text-white transition-colors z-20 cursor-pointer hidden md:flex"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-y-1/2 -translate-x-1/2 flex gap-2 z-20">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${current === idx ? 'bg-amber-400 w-8' : 'bg-white/40 hover:bg-white/65'}`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Accent curve wave for high end aesthetics */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-slate-950 to-transparent pointer-events-none"></div>
    </section>
  );
}
