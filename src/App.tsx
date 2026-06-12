/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  Check, 
  Phone, 
  ChevronDown, 
  HelpCircle, 
  MapPin, 
  Mail, 
  FileCheck, 
  Star, 
  Lock, 
  CheckCircle2, 
  Menu, 
  X,
  Sparkles,
  HeartHandshake,
  MessageSquare,
  Calculator
} from 'lucide-react';

// Components
import HeroCarousel from './components/HeroCarousel';
import InspectionTabs from './components/InspectionTabs';
import CaseStudies from './components/CaseStudies';
import Reviews from './components/Reviews';
import StickyBottomBar from './components/StickyBottomBar';
import BookingModal from './components/BookingModal';
import AdminPanel from './components/AdminPanel';
import { getKakaoLink, getKakaoId } from './utils/kakaoHelper';

// Data
import { USP_ITEMS, PROCESS_STEPS, FAQS, COMPANY_STATS } from './data';
import { Booking } from './types';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [priceModalTab, setPriceModalTab] = useState<'kakao' | 'prices'>('prices');
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);
  const [isSuccessToastVisible, setIsSuccessToastVisible] = useState(false);
  const [selectedUsp, setSelectedUsp] = useState<typeof USP_ITEMS[0] | null>(null);

  const toggleFaq = (id: string) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  const handleBookingSuccess = (booking: Booking) => {
    setLastBooking(booking);
    setIsBookingOpen(false);
    setIsSuccessToastVisible(true);
    setTimeout(() => {
      setIsSuccessToastVisible(false);
    }, 6000);
  };

  const handleKakaoLink = () => {
    window.open(getKakaoLink(), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-slate-900 selection:text-white pb-16 md:pb-0 scroll-smooth font-sans">
      
      {/* SUCCESS TOAST MESSAGE */}
      <AnimatePresence>
        {isSuccessToastVisible && lastBooking && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-2xl border border-slate-800 flex items-start gap-4">
              <div className="p-2 bg-amber-400 text-slate-900 rounded-xl shrink-0">
                <Check className="w-5 h-5 stroke-[3px]" />
              </div>
              <div className="space-y-1 flex-1 text-left">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  예약문의 접수 완료!
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-mono font-bold">
                    {lastBooking.id}
                  </span>
                </h4>
                <p className="text-xs text-slate-300">
                  <strong>{lastBooking.name}</strong> 고객님, {lastBooking.apartmentName} ({lastBooking.dong} {lastBooking.ho}) {lastBooking.pyeong} 사전점검 희망요청이 성공적으로 접수되었습니다.
                </p>
                <p className="text-[10px] text-amber-400 font-medium">
                  ★ 배정된 현장팀장이 1-2일 이내에 예약 조율 및 유선 상담 전화를 드립니다.
                </p>
              </div>
              <button 
                onClick={() => setIsSuccessToastVisible(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER & NAVIGATION */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <a href="#hero-section" className="flex items-center gap-2 group">
            <span className="p-2 bg-slate-900 text-white rounded-xl group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors shadow-md shadow-slate-950/10">
              <Home className="w-5 h-5" />
            </span>
            <div className="text-left">
              <span className="block text-lg font-bold font-display tracking-tight text-slate-950 leading-none">
                IS마이홈
              </span>
            </div>
          </a>

          {/* Desktop Nav Menus */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
            <a href="#about-section" className="hover:text-slate-950 transition-colors">왜 IS마이홈인가?</a>
            <a href="#process-section" className="hover:text-slate-950 transition-colors">이용 절차</a>
            <a href="#inspection-section" className="hover:text-slate-950 transition-colors">점검 항목</a>
            <a href="#cases-section" className="hover:text-slate-950 transition-colors">점검 사례</a>
            <a href="#faq-section" className="hover:text-slate-950 transition-colors">자주 묻는 질문</a>
            <a href="#company-section" className="hover:text-slate-950 transition-colors">회사 소개</a>
          </nav>

          {/* Header Action Button (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={handleKakaoLink}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              카카오 상담하기
            </button>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-4.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors shadow-lg shadow-slate-950/10 cursor-pointer"
            >
              온라인 견적상담 신청
            </button>
          </div>

          {/* Mobile hamburger navigation button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="메뉴 열기"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Drawer Navigation Linkages */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-slate-100 bg-white overflow-hidden shadow-inner"
            >
              <div className="px-6 py-5 space-y-4 flex flex-col text-sm font-bold text-slate-600">
                <a 
                  href="#about-section" 
                  onClick={() => setIsMenuOpen(false)}
                  className="py-1 hover:text-slate-950 transition-colors border-b border-slate-50"
                >
                  왜 IS마이홈인가?
                </a>
                <a 
                  href="#process-section" 
                  onClick={() => setIsMenuOpen(false)}
                  className="py-1 hover:text-slate-950 transition-colors border-b border-slate-50"
                >
                  이용 절차
                </a>
                <a 
                  href="#inspection-section" 
                  onClick={() => setIsMenuOpen(false)}
                  className="py-1 hover:text-slate-950 transition-colors border-b border-slate-50"
                >
                  점검 항목
                </a>
                <a 
                  href="#cases-section" 
                  onClick={() => setIsMenuOpen(false)}
                  className="py-1 hover:text-slate-950 transition-colors border-b border-slate-50"
                >
                  점검 사례
                </a>
                <a 
                  href="#faq-section" 
                  onClick={() => setIsMenuOpen(false)}
                  className="py-1 hover:text-slate-950 transition-colors border-b border-slate-50"
                >
                  자주 묻는 질문
                </a>
                <a 
                  href="#company-section" 
                  onClick={() => setIsMenuOpen(false)}
                  className="py-1 hover:text-slate-950 transition-colors"
                >
                  회사 소개
                </a>

                <div className="pt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleKakaoLink();
                    }}
                    className="w-full text-center py-3 bg-slate-100 text-slate-800 text-xs rounded-xl"
                  >
                    카카오톡 문의
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsBookingOpen(true);
                    }}
                    className="w-full text-center py-3 bg-slate-900 text-white text-xs rounded-xl"
                  >
                    온라인 예약하기
                  </button>
                </div>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsAdminOpen(true);
                  }}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200/60 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>관리자 대시보드</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 1. HERO CAROUSEL SECTION */}
      <HeroCarousel onOpenBooking={() => setIsBookingOpen(true)} />

      {/* 2. WHY IS마이홈 SECTION (USP - UNIQUE SELLING POINTS) */}
      <section id="about-section" className="py-20 md:py-28 bg-slate-50/50 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-400/10 text-slate-900 text-xs font-black rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" />
              PROFESSIONAL CONFIDENCE
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-slate-900 leading-tight">
              왜 아파트 사전점검은 <span className="relative inline-block text-slate-950">
                IS마이홈
                <span className="absolute left-0 right-0 bottom-1 h-2 bg-amber-400/30 -z-10 rounded-sm"></span>
              </span>인가?
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              건축공학 전문 학위 및 시공사 실제 필드 경력을 지닌 팀장님들을 배정하여 육안으로 알기 어려운 대규모 하자 리스크를 원천 해결합니다.
            </p>
          </div>

          {/* 3-Column USP Card Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {USP_ITEMS.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                onClick={() => setSelectedUsp(item)}
                className="bg-white rounded-2xl p-8 border border-slate-100 shadow-xs hover:shadow-lg transition-all group duration-300 text-left flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-block px-2.5 py-1 text-[10px] font-bold text-amber-600 bg-amber-50 rounded-md">
                      {item.tag}
                    </span>
                    <span className="text-sm font-bold font-mono text-slate-200">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3.5 group-hover:text-slate-950 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center text-xs font-bold text-slate-400 group-hover:text-amber-500 transition-colors">
                  <span>자세히 보기</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1.5 transition-transform text-amber-500" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Core Team Stats Grid Banner */}
          <div className="mt-16 bg-slate-900 text-white rounded-3xl p-8 md:p-12 border border-slate-800 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center relative z-10">
              {COMPANY_STATS.map((stat, idx) => (
                <div key={idx} className="space-y-1.5 border-r border-slate-800 last:border-none">
                  <div className="text-2xl md:text-3.5xl font-black font-display text-amber-400">
                    {stat.value}
                  </div>
                  <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 3. PROCESS TIMELINE SECTION */}
      <section id="process-section" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <div className="max-w-3xl mx-auto mb-16 space-y-3">
            <span className="inline-block text-[11px] font-mono tracking-widest text-slate-400 uppercase font-black">
              EXECUTION MILESTONES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-slate-900">
              믿음직한 5단계 체계 이용 절차
            </h2>
            <p className="text-slate-500 text-sm md:text-base">
              예약 접수 단계부터 세대 동반 브리핑 및 보수 신청 까지 체계적인 프로세스를 지향합니다.
            </p>
          </div>

          {/* Timeline Layout */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-12 relative">
            
            {/* Horizontal line for desktop timelines */}
            <div className="hidden md:block absolute top-[1.25rem] left-[10%] right-[10%] h-[1.5px] bg-indigo-50 -z-10"></div>

            {PROCESS_STEPS.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="space-y-3.5 text-left md:text-center px-4 py-4 md:py-2 hover:bg-slate-50/60 rounded-xl transition-colors relative group"
              >
                {/* Timeline node circle */}
                <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-400 text-sm font-mono font-black flex items-center justify-center mx-auto shadow-md shadow-slate-900/10 group-hover:scale-110 transition-transform duration-300">
                  {step.step}
                </div>

                <div className="space-y-1 text-center">
                  <h4 className="text-sm font-bold text-slate-900">
                    {step.title}
                  </h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to action for reservation inside timeline */}
          <div className="mt-12 text-center">
            <button
               onClick={() => setIsPriceModalOpen(true)}
              className="inline-flex items-center gap-2.5 text-lg md:text-2xl font-black text-slate-950 hover:text-amber-500 hover:scale-[1.02] active:scale-98 transition-all group cursor-pointer tracking-tight"
            >
              상세 예약 절차 및 견적 단가표 확인하기 
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-amber-500 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </div>

        </div>
      </section>

      {/* 4. INSPECTION PROTOCOLS / CHECKLISTS */}
      <section id="inspection-section" className="py-20 md:py-28 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="inline-block text-[11px] font-mono tracking-widest text-slate-400 uppercase font-black">
              CHECKLIST ARCHITECTURE
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-slate-900">
              세분화된 종합 정밀 사전점검 항목
            </h2>
            <p className="text-slate-500 text-sm md:text-base">
              아파트 마감의 보존 신뢰도인 무려 100개가 넘는 세부 점검 매뉴얼을 카테고리별로 밀도가 높게 체크 연산합니다.
            </p>
          </div>

          <InspectionTabs />

        </div>
      </section>

      {/* 5. ACTUAL CASE STUDIES (점검 사례) */}
      <section id="cases-section" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="inline-block text-[11px] font-mono tracking-widest text-slate-400 uppercase font-black">
              INSPECTION ARCHIVE
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-slate-900">
              실제 현장 정밀 적출 점검 사례
            </h2>
            <p className="text-slate-500 text-sm md:text-base">
              육안 탐상과 정밀 장비를 결부시켜 적합 판정을 부르는 실제 하자의 근접 촬영본과 수량 리스트를 대공개합니다.
            </p>
          </div>

          <CaseStudies />

        </div>
      </section>

      {/* 6. ACTUAL USER REVIEWS (입주민 솔직후기) */}
      <section id="reviews-section" className="py-20 md:py-28 bg-white border-t border-slate-150">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="inline-block text-[11px] font-mono tracking-widest text-slate-400 uppercase font-black">
              REAL RESIDENT REVIEWS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-slate-900">
              실제 입주민의 솔직후기
            </h2>
            <p className="text-slate-500 text-sm md:text-base">
              검증되지 않은 홍보글 대신, 직접 의뢰하여 하자를 완벽히 정밀 진단 받으신 입주민들의 100% 생생한 실제 카톡 대화 후기를 확인하세요.
            </p>
          </div>

          <Reviews />

        </div>
      </section>

      {/* 7. FAQ SECTION (아코디언 스타일) */}
      <section id="faq-section" className="py-20 md:py-28 bg-slate-50 relative">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center mb-16 space-y-3">
            <span className="inline-block text-[11px] font-mono tracking-widest text-slate-400 uppercase font-black">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-slate-900">
              입주민이 가장 자주 묻는 질문 FAQ
            </h2>
            <p className="text-slate-500 text-sm md:text-base">
              사전점검 방문 접수 및 준비 사항 등에 대답하는 가장 신뢰도 높은 자격 증의 조치 사항을 정리했습니다.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {FAQS.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white border border-slate-150 rounded-xl overflow-hidden shadow-xs transition-shadow hover:shadow-md"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-5 py-4.5 text-left font-bold text-sm md:text-base text-slate-800 hover:text-slate-950 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      {faq.question}
                    </span>
                    <span className={`p-1 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="border-t border-slate-50"
                      >
                        <div className="p-5 text-slate-600 bg-slate-50/50 text-xs sm:text-sm leading-relaxed font-normal text-left">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <p className="text-xs text-slate-400 font-medium">
              더 궁금하신 점이 있으시다면, 실시간 무료 전담 카카오톡 채널로 물어보시면 즉각 소통을 보장드립니다.
            </p>
          </div>

        </div>
      </section>

      {/* 8. COMPANY INTRO (회사 소개) */}
      <section id="company-section" className="py-20 md:py-28 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-center">
            
            {/* Visual Intro with credentials */}
            <div className="space-y-6 text-center flex flex-col items-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-amber-400 text-xs font-black rounded-lg">
                <Award className="w-4 h-4" />
                PROFESSIONAL LICENSE
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-slate-950 text-center">
                건축공학 시공 출신 팀장,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-slate-950">IS마이홈</span>의 약속입니다.
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed font-normal text-center max-w-xl mx-auto">
                공인된 건축 지식과 혹독한 시공관리 현장의 경험 없이, 단순히 한두 번 검사해 본 비전문가가 집안의 기하학적 균형과 마찰 균열 리스크를 측정한다면 그것은 부실한 점검이나 다름없습니다.<br /><br />
                저희는 <strong>내 자녀가 첫발을 디디며 무사히 살아야 할 소중한 보금자리</strong>라는 마음가짐으로, 최선을 다할것을 약속드립니다.
              </p>

              {/* Core Check points with icon indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs font-bold text-slate-700 w-full">
                <div className="flex items-center gap-2 justify-center">
                  <span className="p-1 bg-slate-900 text-white rounded-md">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  건축공학 전문 학위단
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <span className="p-1 bg-slate-900 text-white rounded-md">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  건설사 시공 경력 명세
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <span className="p-1 bg-slate-900 text-white rounded-md">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  현직 사전점검 최고 자격
                </div>
              </div>
            </div>

            {/* Quality Statement Brand Frame */}
            <div className="relative p-8 md:p-12 bg-slate-950 text-white rounded-3xl overflow-hidden border border-slate-800 text-left">
              <div className="absolute right-0 top-0 w-80 h-80 bg-linear-to-bl from-amber-400/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-2.5 text-xs text-amber-400 font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  IS마이홈 안전 선언서
                </div>

                <blockquote className="text-sm md:text-base leading-relaxed text-slate-300 font-light italic">
                  &ldquo;시공을 안다는 것은, 철근 콘크리트 몰탈 타설 조율부터 타일 접착과 창호 프레임 안착의 역학적 원리를 모두 꿰뚫고 있다는 것입니다. 단순 육안만이 아닌 과학 장비를 수광 수치하여 신축 건물이 자아낼 수 있는 미세 균열의 원리를 완벽히 검사하고 명증하겠습니다.&rdquo;
                </blockquote>

                <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="block text-sm font-bold text-amber-400">IS마이홈 점검 대표</span>
                    <span className="block text-[10px] text-slate-400 font-mono mt-0.5">Architectural Engineering Inspector Team</span>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] bg-white/10 text-slate-300 rounded-md">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      100% 실명 검진 보증
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-6 border-t border-slate-900 text-left relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold font-display text-white">
              IS마이홈
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              건축공학 전공 및 시공사 실제 현장 경험을 바탕으로 신축 첫입주 아파트 세대의 하자를 철저하게 파악하여, 소중한 내 집을 꼼꼼하게 점검하고 보존하는 사전점검 전문 종합 서비스입니다.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-bold text-amber-400">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                대표 전화: 010-5027-0939
              </span>
              <span className="text-slate-800">|</span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                이메일: dwa5040@naver.com
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <span className="block text-xs font-bold text-white uppercase tracking-wider">법률 및 사업자 명세</span>
            <ul className="text-xs space-y-2 text-slate-400 font-normal">
              <li>상호명: IS마이홈</li>
              <li>대표자: 안재민 | 사업자등록번호: 779-54-01146</li>
              <li>주소: 울산 달천로50</li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="block text-xs font-bold text-white uppercase tracking-wider">안심 고객 지원</span>
            <ul className="text-xs space-y-2 text-slate-400 font-normal">
              <li>상담 센터: 주중 09:00 - 18:00 (토/일 휴무)</li>
              <li>긴급 연동 상담: 카카오톡 채널 연중무휴 24시간 가동</li>
              <li>
                <a href="#about-section" className="hover:text-white transition-colors">서비스 이용 약관</a>
              </li>
              <li>
                <a href="#about-section" className="hover:text-white transition-colors text-amber-400 font-bold">개인정보 처리방침</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <p className="font-medium text-slate-500">
              &copy; {new Date().getFullYear()} IS마이홈. All Rights Reserved.
            </p>
            <span className="text-slate-800 hidden sm:inline">|</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1.5 text-slate-550 hover:text-white transition font-bold cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-slate-600" />
              <span>관리자 전용</span>
            </button>
          </div>
          <div className="flex items-center gap-3.5 text-slate-500">
            <span>건축사 소화협회 제휴증</span>
            <span>|</span>
            <span>공학안전 표준협회 우수 인증</span>
          </div>
        </div>
      </footer>

      {/* PERSISTENT ACTION MODALS AND TRIGGER FLOATERS */}
      <StickyBottomBar onOpenBooking={() => setIsBookingOpen(true)} />
      
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        onSuccess={handleBookingSuccess}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* USP DETAIL MODAL */}
      <AnimatePresence>
        {selectedUsp && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs w-full cursor-pointer"
            onClick={() => setSelectedUsp(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-sm w-full overflow-hidden relative cursor-default text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedUsp(null)}
                className="absolute top-4 right-4 z-30 p-1.5 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                title="닫기"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <span className="inline-block px-2.5 py-1 text-[10px] font-bold text-amber-600 bg-amber-50 rounded-md">
                    {selectedUsp.tag}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {selectedUsp.title}
                  </h3>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Overview / 요약설명
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {selectedUsp.description}
                  </p>
                </div>

                {/* Direct Highlight Detail Box */}
                <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-md border border-slate-700/30 space-y-3 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[11px] font-black uppercase tracking-widest font-mono">
                      핵심 보증 내용
                    </span>
                  </div>
                  <p className="text-sm font-black text-white leading-relaxed">
                    "{selectedUsp.detailText}"
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedUsp(null)}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer hover:shadow-xs active:scale-98"
                >
                  확인 완료
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PRICE & RESERVATION GUIDE MODAL */}
      <AnimatePresence>
        {isPriceModalOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs w-full cursor-pointer"
            onClick={() => setIsPriceModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-sm w-full max-h-[85vh] flex flex-col overflow-hidden relative cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsPriceModalOpen(false)}
                className="absolute top-3 right-3 z-30 p-1.5 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                title="닫기"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-4 md:p-5 flex-1 overflow-y-auto space-y-3.5">
                {/* Header info */}
                <div className="text-center space-y-1">
                  <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-slate-950 tracking-tight">
                    단가표 & 예약 신청 안내
                  </h3>
                  <p className="text-slate-500 text-[10px] leading-relaxed max-w-[280px] mx-auto">
                    IS마이홈은 어떤 명목으로도 정찰 가격 이외의 추가 금액을 청구하지 않습니다.
                  </p>
                </div>

                {/* Tab buttons */}
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl relative z-10">
                  <button
                    onClick={() => setPriceModalTab('prices')}
                    className={`py-1.5 px-2.5 font-extrabold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      priceModalTab === 'prices'
                        ? 'bg-white text-slate-950 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Calculator className={`w-3 h-3 ${priceModalTab === 'prices' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    단가표 확인
                  </button>
                  <button
                    onClick={() => setPriceModalTab('kakao')}
                    className={`py-1.5 px-2.5 font-extrabold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      priceModalTab === 'kakao'
                        ? 'bg-[#FEE500] text-[#191919] shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <MessageSquare className={`w-3 h-3 fill-current ${priceModalTab === 'kakao' ? 'text-[#191919]' : 'text-slate-400'}`} />
                    카카오 문의
                  </button>
                </div>

                {/* Tab content area */}
                <div className="transition-all">
                  {priceModalTab === 'prices' ? (
                    <div className="space-y-3">
                      {/* Price box display */}
                      <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/30 rounded-xl p-3.5 border border-indigo-100 text-left space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-indigo-100/60">
                          <span className="text-xs font-extrabold text-slate-800">기본 정밀 검사 단가</span>
                          <span className="text-sm font-black text-indigo-600">평당 8,000원</span>
                        </div>

                        {/* Calculation example box */}
                        <div className="bg-white p-3 rounded-lg border border-slate-100 font-sans shadow-xs space-y-1.5">
                          <span className="inline-block text-[9px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-1.5 py-0.5 rounded-md">
                            계산 예시 (ex)
                          </span>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-800">84㎡타입 (25.45평 기준)</span>
                            <span className="text-[11px] font-medium text-slate-400 line-through">203,600원</span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            계산: 84㎡ / 3.3 = 25.45평 x 8,000원
                          </div>
                          <div className="flex justify-between items-center bg-slate-900 text-white p-2.5 rounded-md mt-1">
                            <span className="text-[10px] font-bold text-amber-400">84타입 최종 청구액</span>
                            <span className="text-xs font-black text-white">200,000원</span>
                          </div>
                        </div>

                        {/* Free details list */}
                        <div className="bg-emerald-50 rounded-xl p-3.5 border-2 border-emerald-300 flex items-center justify-center gap-2.5 shadow-sm">
                          <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 shrink-0" />
                          <span className="text-base md:text-xl font-black text-emerald-950 tracking-tight">아파트 하자신청 대행비 무료!</span>
                        </div>
                      </div>

                      {/* Important policy promise banner */}
                      <div className="bg-amber-400/10 rounded-lg p-2.5 border border-amber-400/20 text-center">
                        <p className="text-[11px] font-bold text-slate-900 leading-normal">
                          "저희는 평당 금액 이외에는 일절 추가금 없습니다!"
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-left">
                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2.5">
                        <h4 className="text-xs font-extrabold text-slate-950 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#FEE500]"></span>
                          카카오톡 실시간 상담 서비스 안내
                        </h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          IS마이홈 전문 상담원과 1:1로 직접 소통하며 사전점검 일정 예약 조율 및 상세 견적을 신속하게 안내해 드립니다.
                        </p>
                        
                        <div className="space-y-1.5 pt-1 text-[10px] font-bold text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-amber-500" />
                            채널명: {getKakaoId()} (공식 비즈니스 채널)
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-amber-500" />
                            운영시간: 실시간 24시간 연중무휴 상담 지원
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-amber-500" />
                            상담비용: 전액 무료상담
                          </div>
                        </div>
                      </div>

                      {/* Big Instant Chat Button */}
                      <button
                        onClick={handleKakaoLink}
                        className="w-full py-3 px-3 bg-[#FEE500] hover:bg-[#FCD200] active:scale-98 text-[#191919] font-black text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-[#FEE500]/15 transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 fill-current text-[#191919]" />
                        카카오 플친 무료 상담 시작하기
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Bottom simple close button to give another easy close target */}
                <div className="pt-1.5">
                  <button
                    onClick={() => setIsPriceModalOpen(false)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-[11px] rounded-lg transition-colors cursor-pointer"
                  >
                    닫기
                  </button>
                </div>

                {/* Footer disclaimer */}
                <div className="text-[9px] text-slate-400 leading-normal text-center pt-0.5">
                  * 견적서 발송 후 예약금 및 일체의 사전 추가 결제가 전혀 요구되지 않습니다.
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
