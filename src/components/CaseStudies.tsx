/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CASE_STUDIES } from '../data';
import { CaseStudy } from '../types';
import { Eye, Star, AlertCircle, X, ShieldAlert, BadgeCheck, ChevronLeft, ChevronRight, Info } from 'lucide-react';

export default function CaseStudies() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // Handle keyboard arrow keys for navigation when lightbox is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIdx === null) return;
      if (e.key === 'ArrowLeft') {
        setActiveIdx((prev) => (prev !== null ? (prev - 1 + CASE_STUDIES.length) % CASE_STUDIES.length : null));
      } else if (e.key === 'ArrowRight') {
        setActiveIdx((prev) => (prev !== null ? (prev + 1) % CASE_STUDIES.length : null));
      } else if (e.key === 'Escape') {
        setActiveIdx(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx]);

  return (
    <div id="case-studies-section-container" className="space-y-8">
      {/* Visual Case Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CASE_STUDIES.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            onClick={() => setActiveIdx(idx)}
            className="group bg-white rounded-xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer flex flex-col h-full"
          >
            {/* Case Image Frame */}
            <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden shrink-0">
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
              
              <span className="absolute top-3 left-3 text-[10px] font-bold py-1 px-2.5 bg-black/60 backdrop-blur-md rounded-full text-amber-400 capitalize flex items-center gap-1 z-10">
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                {item.defectType}
              </span>

              {/* Hover effect hover button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-3">
                <span className="px-4 py-2.5 text-xs font-bold text-slate-950 bg-white hover:bg-amber-400 rounded-lg shadow-md flex items-center gap-1.5 transition-all transform hover:scale-105 duration-300">
                  <Eye className="w-4 h-4 text-amber-600" />
                  실제 현장 사진 보기
                </span>
              </div>

              {/* Quick eye hint badge on mobile */}
              <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] text-white/90 font-medium flex items-center gap-0.5 pointer-events-none md:hidden">
                <Eye className="w-3 h-3 text-amber-400" />
                터치 시 크게보기
              </div>
            </div>

            {/* Case Content */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="block text-[11px] font-bold text-slate-400 font-mono tracking-wider mb-1 uppercase">
                  CASESTUDY #0{idx + 1}
                </span>
                <h4 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-amber-500 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] font-medium text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold font-mono text-slate-400">
                <span>심각도 영향 지표:</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, sIdx) => (
                    <Star
                      key={sIdx}
                      className={`w-3.5 h-3.5 ${
                        sIdx < item.impactScore 
                          ? 'text-red-500 fill-red-500' 
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Advanced Fullscreen Lightbox & Original Photo Slider */}
      <AnimatePresence>
        {activeIdx !== null && (
          <div 
            id="fullscreen-lightbox-slider-overlay"
            className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-slate-950 select-none overflow-hidden"
          >
            {/* Visual Header / Close Button for mobile */}
            <div className="absolute top-4 right-4 z-50 md:top-6 md:right-6">
              <button
                onClick={() => setActiveIdx(null)}
                className="p-2 bg-white/15 hover:bg-white/25 active:scale-95 text-white rounded-full transition-all cursor-pointer backdrop-blur-md shadow-lg border border-white/10"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* Left Portion: Immersive Media Viewport */}
            <div className="flex-1 relative bg-black flex items-center justify-center p-4 md:p-8 min-h-[45vh] md:min-h-0">
              
              {/* Background Ambient Glow */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-10 filter blur-2xl object-cover transition-all duration-1000 scale-110 pointer-events-none"
                style={{ backgroundImage: `url(${CASE_STUDIES[activeIdx].imageUrl})` }}
              ></div>

              {/* Slider Prev Navigation Arrow Control */}
              <button
                onClick={() => setActiveIdx((prev) => (prev !== null ? (prev - 1 + CASE_STUDIES.length) % CASE_STUDIES.length : null))}
                className="absolute left-4 z-40 p-2 md:p-3 bg-black/60 hover:bg-amber-400 hover:text-slate-950 text-white rounded-full transition-all cursor-pointer border border-white/5 shadow-md active:scale-90"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Active Zoomable Full Scale Original Image Container */}
              <div className="relative max-w-full max-h-full flex items-center justify-center z-30">
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={activeIdx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    src={CASE_STUDIES[activeIdx].zoomImageUrl || CASE_STUDIES[activeIdx].imageUrl}
                    alt={CASE_STUDIES[activeIdx].title}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-[40vh] md:max-h-[80vh] object-contain rounded-lg shadow-2xl border border-white/10"
                  />
                </AnimatePresence>
                
                {/* Float Case Stamp */}
                <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md py-1.5 px-3 rounded-md text-[10px] font-bold text-white border border-white/10 flex items-center gap-1.5 pointer-events-none">
                  <Eye className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  실제 정밀 검사 정밀적출 원본사진
                </div>
              </div>

              {/* Slider Next Navigation Arrow Control */}
              <button
                onClick={() => setActiveIdx((prev) => (prev !== null ? (prev + 1) % CASE_STUDIES.length : null))}
                className="absolute right-4 z-40 p-2 md:p-3 bg-black/60 hover:bg-amber-400 hover:text-slate-950 text-white rounded-full transition-all cursor-pointer border border-white/5 shadow-md active:scale-90"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* Right Portion: Interactive Spec Sheet Drawer (Fits both Desktop and Mobile nicely) */}
            <div className="w-full md:w-[380px] lg:w-[440px] bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-5 md:p-7 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-screen shrink-0 text-left z-20">
              
              {/* Scrolling Content Details */}
              <div className="space-y-4 md:space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-black bg-red-500 text-white rounded-md uppercase tracking-wider mb-2">
                    {CASE_STUDIES[activeIdx].defectType}
                  </span>
                  
                  <h3 className="text-xl md:text-2xl font-bold font-display text-white tracking-tight leading-tight">
                    {CASE_STUDIES[activeIdx].title}
                  </h3>
                  
                  <p className="text-slate-400 text-xs mt-1.5 font-medium">
                    {CASE_STUDIES[activeIdx].subtitle}
                  </p>
                </div>

                {/* Technical Description Panel */}
                <div className="space-y-2 border-t border-slate-800 pt-4">
                  <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                    <Info className="w-3.5 h-3.5" />
                    DEFECT SPECIFICATIONS / 결함 명세
                  </h4>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-normal bg-slate-950/40 p-3.5 rounded-lg border border-slate-800">
                    {CASE_STUDIES[activeIdx].description}
                  </p>
                </div>

                {/* Rating / Severity Check */}
                <div className="p-3 bg-red-950/20 rounded-xl border border-red-900/30 flex gap-3">
                  <div className="p-2 bg-red-950/60 rounded-lg text-red-400 self-start shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-extrabold text-red-300">위험 정도 평가</h5>
                      <span className="text-[9px] px-1.5 py-0.2 bg-red-900/40 text-red-200 rounded border border-red-800/30">
                        LEVEL {CASE_STUDIES[activeIdx].impactScore} / 5
                      </span>
                    </div>
                    <div className="flex gap-0.5 pb-1">
                      {Array.from({ length: 5 }).map((_, sIdx) => (
                        <Star
                          key={sIdx}
                          className={`w-3 h-3 ${
                            sIdx < CASE_STUDIES[activeIdx].impactScore 
                              ? 'text-red-500 fill-red-500' 
                              : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-red-200/70 leading-relaxed">
                      구조체 수밀, 기밀, 혹은 수평 균열 거동에 심대한 변위를 야기할 수 있어 소중한 세대의 자산 가치 보존을 위해 선제적으로 밀착 처리가 필요한 불량입니다.
                    </p>
                  </div>
                </div>

                {/* Action Guidelines */}
                <div className="p-3 bg-blue-950/20 rounded-xl border border-blue-900/30 flex gap-3">
                  <div className="p-2 bg-blue-950/60 rounded-lg text-blue-400 self-start shrink-0">
                    <BadgeCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-blue-300">IS마이홈 정밀진단팀 기술 가이드</h5>
                    <p className="text-[10px] text-blue-200/70 leading-relaxed mt-1">
                      {CASE_STUDIES[activeIdx].inspectorNote}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Carousel Thumbnail Bar & General Counter */}
              <div className="mt-5 pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="font-extrabold text-slate-500">다른 현장 확인하기</span>
                  <span className="text-amber-400 font-bold">{activeIdx + 1} / {CASE_STUDIES.length}</span>
                </div>

                {/* Interactive Jump Thumbnail strip */}
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  {CASE_STUDIES.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveIdx(index)}
                      className={`relative rounded-md overflow-hidden aspect-video w-14 border-2 transition-all shrink-0 cursor-pointer ${
                        activeIdx === index 
                          ? 'border-amber-400 scale-105 shadow-md shadow-amber-400/10' 
                          : 'border-slate-800 opacity-50 hover:opacity-100'
                      }`}
                      title={item.title}
                    >
                      <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
