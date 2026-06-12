/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Eye, X, ChevronLeft, ChevronRight, Star, Heart, FileText, Sparkles } from 'lucide-react';

interface ReviewItem {
  id: string;
  title: string;
  tag: string;
  imageUrl: string;
  author: string;
  apartment: string;
  summary: string;
}

const REAL_REVIEWS: ReviewItem[] = [
  {
    id: 'review-4',
    title: '가족이 살 집처럼 내 집처럼 챙겨주는 마음',
    tag: '내 집처럼 꼼꼼함',
    imageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MDZfMjc1/MDAxNzgwNjgxNzMyNTgz.rHJAqsYRTC5wyHXYFem0MCqIWZAhSvlub7LrfyfnYy4g.StL2Ljn-q3ByRR52x0bTGgZlsna2WGKuYNM58CH5NBQg.JPEG/Screenshot_20260531_142756_KakaoTalk.jpg?type=w773',
    author: '최*영 입주민님',
    apartment: '자이 프리미어',
    summary: '무사히 안심하고 안전하게 디딜 수 있도록 눈에 안 보이는 타일 탐진과 대기 오염까지 책임 정밀 전폭 지지 검출해주셨습니다.'
  },
  {
    id: 'review-2',
    title: '전문 장비 덕분에 미세 하자까지 모두 집았습니다',
    tag: '첨단 장비 진단',
    imageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MDZfOSAg/MDAxNzgwNjgxNzMyNDc0.z2NAvP66L_s3GF30cbJN4S5PEVS2ppodkoFK0UHIdOgg.sPwy3ht_0CMjucXJakrD6k4jg23eFp6yx_QhcBVAdmEg.JPEG/Screenshot_20260531_142553_KakaoTalk.jpg?type=w773',
    author: '김*호 입주민님',
    apartment: '푸르지오 메트로팰리스',
    summary: '열화상 카메라와 고정밀 디지털 레이저 레벨기를 이용하여 신뢰도 높은 정밀 기하 측정 수치를 제시해 주셨습니다.'
  },
  {
    id: 'review-3',
    title: '시공사 하자 접수 리포트 작성이 너무 편했습니다',
    tag: '하자보수 서포트',
    imageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MDZfMjQz/MDAxNzgwNjgxNzMyNjI4.G_RmFjAfpS2YzleEbO35tkEW3SoCSZSngthyCTJmpoYg.eeyqLiLpDn8wbH4CLCyg4HUWuV9J_JlsFNKhFosFsuEg.JPEG/Screenshot_20260531_142729_KakaoTalk.jpg?type=w773',
    author: '박*진 입주민님',
    apartment: '래미안 센트럴뷰',
    summary: '시공사 대기업 하자 보수 청구 양식에 딱 맞춰 작성해주셔서 불필요한 마찰 없이 완벽하고 빠르게 수리받을 수 있었습니다.'
  },
  {
    id: 'review-1',
    title: '꼼꼼한 점검과 상세한 설명에 감동했습니다',
    tag: '친절 눈높이 설명',
    imageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MDZfOTgg/MDAxNzgwNjgxNzMyNTQ4.LH2O2kAL0Ga45UJr-QNEcx7ajk6aQfmgrfI8M2dWZPAg.AkYYelJC5Go_5wIrN2TXaRnj9PSvtIVbrzVPXvWUMJUg.JPEG/Screenshot_20260531_142452_KakaoTalk.jpg?type=w773',
    author: '이*정 입주민님',
    apartment: '힐스테이트 더퍼스트',
    summary: '건축공학 출신의 꼼꼼한 진단 덕분에 몰랐던 미세 전단 균열과 마찰 들뜸을 즉각 찾아내어 속이 시원합니다.'
  },
  {
    id: 'review-5',
    title: '눈높이 대답과 밀착 가이드로 완벽 정산',
    tag: '입주민 밀착 동행',
    imageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MDZfMTQw/MDAxNzgwNjgxNzMyNjAw.sDz0PyS2qI6RYRTvmZusa1RMva4hlhzcYI2YZ28A23Mg.nEl4xwDDM4CmZPCSEVe4yM7NYwoJxWpiF1YoEnbfjnUg.JPEG/Screenshot_20260531_142806_KakaoTalk.jpg?type=w773',
    author: '윤*현 입주민님',
    apartment: 'e편한세상 센텀',
    summary: '건설사 실무를 가장 잘 아시는 전문가의 조언에 따라 소중한 권리를 온전히 보너스로 보전받게 되었습니다.'
  },
  {
    id: 'review-6',
    title: '하자 점검 처음이었는데 대만족 솔직 후기',
    tag: '입주만족도 100%',
    imageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MDZfMjE3/MDAxNzgwNjgxNzMyNDY4.b3Pdzgox08p2nin0D1tRGLG0sLOPvLgARsgzSo7nfhMg.WEb8yS7KjI_Ch4iLHizaTUXCOh4t53iN3O8vfZi6I_kg.JPEG/Screenshot_20260531_142740_KakaoTalk.jpg?type=w773',
    author: '정*율 입주민님',
    apartment: '아이파크 에듀포레',
    summary: '처음 사전점검을 받아보는데도 한군데도 놓치지 않고 완벽한 측정과 기술 진단으로 신뢰를 안겨주셨습니다.'
  }
];

export default function Reviews() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // Handle keyboard arrow keys for navigation when lightbox is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIdx === null) return;
      if (e.key === 'ArrowLeft') {
        setActiveIdx((prev) => (prev !== null ? (prev - 1 + REAL_REVIEWS.length) % REAL_REVIEWS.length : null));
      } else if (e.key === 'ArrowRight') {
        setActiveIdx((prev) => (prev !== null ? (prev + 1) % REAL_REVIEWS.length : null));
      } else if (e.key === 'Escape') {
        setActiveIdx(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx]);

  return (
    <div id="real-resident-reviews-section" className="space-y-12">
      
      {/* Visual Reviews Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {REAL_REVIEWS.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: idx * 0.08, duration: 0.5 }}
            onClick={() => setActiveIdx(idx)}
            className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            {/* Screenshot Thumbnail Frame */}
            <div className="relative aspect-[4/5] bg-slate-900 overflow-hidden shrink-0 border-b border-slate-50">
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
              />
              {/* Top soft gradient */}
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent"></div>
              {/* Bottom gradient */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              <span className="absolute top-4 left-4 text-[10px] font-black py-1 px-3 bg-slate-950/75 backdrop-blur-md rounded-full text-amber-400 border border-white/10 flex items-center gap-1.5 z-10">
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                {item.tag}
              </span>

              {/* Hover screen with eye and text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 p-4 text-center z-10">
                <div className="p-3 bg-amber-400 text-slate-950 rounded-full shadow-lg mb-3 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <Eye className="w-6 h-6" />
                </div>
                <span className="text-xs font-black text-white tracking-widest uppercase">
                  카톡 대화 원본 확대 보기
                </span>
                <span className="text-[10px] text-slate-300 mt-1">
                  클릭 시 무배율 원본 슬라이더가 켜집니다
                </span>
              </div>

              {/* Bottom Info Row on Thumbnail */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-baseline justify-between text-white">
                <div>
                  <span className="text-[10px] text-slate-350 block font-bold tracking-wide">
                    {item.apartment}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {item.author}
                  </span>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, sIdx) => (
                    <Star key={sIdx} className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>

            {/* Content Bottom Card */}
            <div className="p-5 text-left space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-amber-500 transition-colors">
                  "{item.title}"
                </h4>
                <p className="text-xs text-slate-550 leading-relaxed font-normal line-clamp-2 mt-1">
                  {item.summary}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-500 fill-red-500" /> 
                  100% 리얼 자필 확인
                </span>
                <span className="text-slate-300 group-hover:text-amber-500 transition-colors">
                  확대보기 →
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Advanced Fullscreen Lightbox & Original Photo Slider */}
      <AnimatePresence>
        {activeIdx !== null && (
          <div 
            id="review-fullscreen-lightbox-slider-overlay"
            className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-slate-950 select-none overflow-hidden cursor-default"
            onClick={() => setActiveIdx(null)}
          >
            {/* Visual Header / Close Button */}
            <div className="absolute top-4 right-4 z-50 md:top-6 md:right-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx(null);
                }}
                className="p-2.5 bg-white/10 hover:bg-amber-400 hover:text-slate-950 focus:outline-hidden text-white rounded-full transition-all cursor-pointer backdrop-blur-md shadow-lg border border-white/10 active:scale-95"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* Left Portion: Immersive Chat Image Viewport */}
            <div 
              className="flex-1 relative bg-black flex items-center justify-center p-4 md:p-8 min-h-[50vh] md:min-h-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background Ambient Glow */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-10 filter blur-2xl object-cover transition-all duration-1000 scale-110 pointer-events-none"
                style={{ backgroundImage: `url(${REAL_REVIEWS[activeIdx].imageUrl})` }}
              ></div>

              {/* Slider Prev Navigation Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev !== null ? (prev - 1 + REAL_REVIEWS.length) % REAL_REVIEWS.length : null));
                }}
                className="absolute left-4 z-40 p-2 md:p-3 bg-black/60 hover:bg-amber-400 hover:text-slate-950 text-white rounded-full transition-all cursor-pointer border border-white/10 shadow-md active:scale-90"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Image Frame */}
              <div className="relative max-w-full max-h-[45vh] md:max-h-[85vh] flex items-center justify-center z-30">
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={activeIdx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    src={REAL_REVIEWS[activeIdx].imageUrl}
                    alt={REAL_REVIEWS[activeIdx].title}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-[45vh] md:max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/5"
                  />
                </AnimatePresence>
                
                {/* Float Stamp */}
                <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md py-1.5 px-3 rounded-md text-[10px] font-bold text-white border border-white/10 flex items-center gap-1.5 pointer-events-none">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  실제 카카오톡 입주민 감사 메세지 전문
                </div>
              </div>

              {/* Slider Next Navigation Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev !== null ? (prev + 1) % REAL_REVIEWS.length : null));
                }}
                className="absolute right-4 z-40 p-2 md:p-3 bg-black/60 hover:bg-amber-400 hover:text-slate-950 text-white rounded-full transition-all cursor-pointer border border-white/10 shadow-md active:scale-90"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* Right Portion: Interactive Review Specs */}
            <div 
              className="w-full md:w-[380px] lg:w-[420px] bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-5 md:p-7 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-screen shrink-0 text-left z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4 md:space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-black bg-amber-500 text-slate-950 rounded-md uppercase tracking-wider mb-2">
                    {REAL_REVIEWS[activeIdx].tag}
                  </span>
                  
                  <h3 className="text-lg md:text-xl font-bold font-display text-white tracking-tight leading-tight">
                    {REAL_REVIEWS[activeIdx].title}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-3 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-mono">RESIDENT / 아파트</span>
                      <span className="text-white font-bold">{REAL_REVIEWS[activeIdx].apartment} {REAL_REVIEWS[activeIdx].author}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, sIdx) => (
                        <Star key={sIdx} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sub Description */}
                <div className="space-y-2 border-t border-slate-800 pt-4">
                  <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    Resident Feedback / 입주민 한줄 요약
                  </h4>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-normal bg-slate-950/40 p-3.5 rounded-lg border border-slate-800">
                    "{REAL_REVIEWS[activeIdx].summary}"
                  </p>
                </div>

                {/* Assurance and Trust card inside slide drawer */}
                <div className="p-3 bg-amber-400/5 rounded-xl border border-amber-400/10 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <h5 className="text-xs font-black text-amber-400">100% 조작 없는 사전점검 감사 메세지</h5>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    본 캡처본들은 IS마이홈을 전적으로 신뢰하시고 무사히 입주하신 실제 현장 고객님들의 자발적인 감사 의사 표현 및 하이라이트 내역입니다. 개인정보 유출 방지를 위해 성함 및 민감 정보만 마스킹 처리되었습니다.
                  </p>
                </div>
              </div>

              {/* Bottom Thumb Nail selection indicator */}
              <div className="mt-5 pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="font-extrabold text-slate-500 font-sans">다른 카톡 후기 살펴보기</span>
                  <span className="text-amber-400 font-bold">{activeIdx + 1} / {REAL_REVIEWS.length}</span>
                </div>

                {/* Interactive Jump Thumbnail strip */}
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-850 scrollbar-track-transparent">
                  {REAL_REVIEWS.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveIdx(index)}
                      className={`relative rounded-md overflow-hidden aspect-[4/5] w-12 border-2 transition-all shrink-0 cursor-pointer ${
                        activeIdx === index 
                          ? 'border-amber-400 scale-105 shadow-md shadow-amber-400/10' 
                          : 'border-slate-800 opacity-50 hover:opacity-100'
                      }`}
                      title={item.title}
                    >
                      <img src={item.imageUrl} alt="" className="w-full h-full object-cover object-top" />
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
