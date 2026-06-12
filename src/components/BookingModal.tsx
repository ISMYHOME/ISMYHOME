/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, FormEvent, SVGProps } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, User, Phone, Home, Layers, CheckCircle2, ArrowRight, Clock, HelpCircle, Database, Check, ShieldAlert, WifiOff } from 'lucide-react';
import { Booking } from '../types';
import { supabase } from '../lib/supabaseClient';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
}

export default function BookingModal({ isOpen, onClose, onSuccess }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [apartmentName, setApartmentName] = useState('');
  const [dong, setDong] = useState('');
  const [ho, setHo] = useState('');
  const [pyeong, setPyeong] = useState('84'); // Initial typical Korean apartment size
  const [m2, setM2] = useState('25'); // Initial converted
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00');
  const [memo, setMemo] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Supabase Integration States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbSetupRequired, setDbSetupRequired] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<Booking | null>(null);


  // Handle pyeong conversion
  const handlePyeongChange = (val: string) => {
    setPyeong(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setM2((num * 3.3057).toFixed(1));
    } else {
      setM2('');
    }
  };

  const handleM2Change = (val: string) => {
    setM2(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setPyeong((num / 3.3057).toFixed(1));
    } else {
      setPyeong('');
    }
  };

  // Reset formulation on open/close
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setName('');
      setPhone('');
      setApartmentName('');
      setDong('');
      setHo('');
      setPyeong('84');
      setM2('25');
      setBookingDate('');
      setBookingTime('10:00');
      setMemo('');
      setErrorMsg('');
      setIsSubmitting(false);
      setDbSetupRequired(false);
      setCopiedSql(false);
      setPendingBooking(null);
    }
  }, [isOpen]);

  const validateStep1 = () => {
    if (!apartmentName.trim()) {
      setErrorMsg('아파트 단지명을 입력해주세요.');
      return false;
    }
    if (!dong.trim() || !ho.trim()) {
      setErrorMsg('동/호수를 정확히 기입해주세요.');
      return false;
    }
    if (!pyeong.trim()) {
      setErrorMsg('공급 면적을 입력해주세요.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const validateStep2 = () => {
    if (!bookingDate) {
      setErrorMsg('예약 희망 일자를 선택해주세요.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const validateStep3 = () => {
    if (!name.trim()) {
      setErrorMsg('예약자 성함을 입력해주세요.');
      return false;
    }
    if (!phone.trim()) {
      setErrorMsg('연락처 휴대전화번호를 입력해주세요.');
      return false;
    }
    const phoneRegex = /^(01[016789]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      setErrorMsg('올바른 한국 휴대전화 번호 형태여야 합니다 (예: 010-1234-5678).');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrev = () => {
    setErrorMsg('');
    setStep(prev => prev - 1);
  };

  const sendEmailNotification = async (booking: Booking) => {
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: booking.id,
          name: booking.name,
          phone: booking.phone,
          apartmentName: booking.apartmentName,
          dong: booking.dong,
          ho: booking.ho,
          pyeong: booking.pyeong,
          bookingDate: booking.bookingDate,
          bookingTime: booking.bookingTime,
          memo: booking.memo,
          createdAt: booking.createdAt
        })
      });
      const data = await res.json();
      console.log("[Email Notification] Response:", data);
    } catch (err) {
      console.error("[Email Notification] Failed to trigger server API:", err);
    }
  };

  const handleRetryInsert = async () => {
    if (!pendingBooking) return;
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            id: pendingBooking.id,
            name: pendingBooking.name,
            phone: pendingBooking.phone,
            apartment_name: pendingBooking.apartmentName,
            dong: pendingBooking.dong,
            ho: pendingBooking.ho,
            pyeong: pendingBooking.pyeong,
            booking_date: pendingBooking.bookingDate,
            booking_time: pendingBooking.bookingTime,
            memo: pendingBooking.memo,
            status: pendingBooking.status,
            created_at: pendingBooking.createdAt
          }
        ]);

      if (error) {
        console.error('Retry error:', error);
        setErrorMsg(`에러 내용: ${error.message}${error.details ? ` (${error.details})` : ''}${error.hint ? ` - Hint: ${error.hint}` : ''} (에러 코드: ${error.code || '알수없음'})`);
      } else {
        sendEmailNotification(pendingBooking);
        onSuccess(pendingBooking);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('연결 오류: ' + (err.message || '인터넷 연결 및 API 설정을 확인해주세요.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBypass = () => {
    if (pendingBooking) {
      onSuccess(pendingBooking);
    }
  };

  const handleCopySql = () => {
    const sqlText = `CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  apartment_name TEXT NOT NULL,
  dong TEXT NOT NULL,
  ho TEXT NOT NULL,
  pyeong TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  memo TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and add policies
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.bookings;
CREATE POLICY "Allow anonymous inserts" ON public.bookings FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow anonymous read" ON public.bookings;
CREATE POLICY "Allow anonymous read" ON public.bookings FOR SELECT USING (true);`;

    navigator.clipboard.writeText(sqlText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsSubmitting(true);
    setErrorMsg('');

    const formattedPyeong = `${pyeong}m² (${Math.round(parseFloat(pyeong) * 0.3025)}평형)`;

    const newBooking: Booking = {
      id: 'B-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      name,
      phone,
      apartmentName,
      dong,
      ho,
      pyeong: formattedPyeong,
      bookingDate,
      bookingTime,
      memo: memo || '특이사항 없음',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            id: newBooking.id,
            name: newBooking.name,
            phone: newBooking.phone,
            apartment_name: newBooking.apartmentName,
            dong: newBooking.dong,
            ho: newBooking.ho,
            pyeong: newBooking.pyeong,
            booking_date: newBooking.bookingDate,
            booking_time: newBooking.bookingTime,
            memo: newBooking.memo,
            status: newBooking.status,
            created_at: newBooking.createdAt
          }
        ]);

      if (error) {
        console.error('Supabase write error:', error);
        setPendingBooking(newBooking);
        setErrorMsg(`에러 내용: ${error.message}${error.details ? ` (${error.details})` : ''}${error.hint ? ` - Hint: ${error.hint}` : ''} (에러 코드: ${error.code || '알수없음'})`);
        setDbSetupRequired(true);
      } else {
        sendEmailNotification(newBooking);
        onSuccess(newBooking);
      }
    } catch (err: any) {
      console.error('Supabase exception error:', err);
      setPendingBooking(newBooking);
      setErrorMsg('연결 오류: ' + (err.message || '인터넷 연결 상태 및 API 인증 정보를 재확인해주세요.'));
      setDbSetupRequired(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="booking-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        id="booking-modal-container"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-lg overflow-hidden bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col"
      >
        {/* Banner Section */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            id="close-booking-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold tracking-wider uppercase mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            IS마이홈 안심 사전점검 예약
          </div>
          <h3 id="booking-modal-title" className="text-xl font-bold font-display tracking-tight text-white mb-2">
            프리미엄 사전점검 문의
          </h3>
          <p className="text-slate-300 text-xs">
            전문 장비를 총동원하여 완벽한 상태를 리포팅해드립니다.
          </p>

          {/* Stepper Header */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}>1</span>
              <span className={step >= 1 ? 'text-white font-medium' : ''}>단지 정보</span>
            </div>
            <div className="w-6 h-[1px] bg-slate-800"></div>
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}>2</span>
              <span className={step >= 2 ? 'text-white font-medium' : ''}>일정 조율</span>
            </div>
            <div className="w-6 h-[1px] bg-slate-800"></div>
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}>3</span>
              <span className={step >= 3 ? 'text-white font-medium' : ''}>고객 정보</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {dbSetupRequired ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5 text-left text-slate-800"
            >
              <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-200 space-y-2">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-amber-500 shrink-0" />
                  <h4 className="text-sm font-black text-amber-950">Supabase 연결 성공 (테이블 생성 필요)</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  프로젝트 연결은 활성화되었으나, DB 내에 <code>bookings</code> 테이블 또는 RLS 권한이 정의되어 있지 않습니다. 아래의 SQL 쿼리를 복사하시고, 유저님의 <strong>Supabase 대시보드 - SQL Editor</strong> 창에 실행하시면 온전한 예약 데이터 적재가 즉시 가동됩니다!
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Supabase SQL 실행 스크립트</span>
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="text-[10px] font-black bg-slate-100 hover:bg-slate-200 p-1.5 px-3 rounded-lg text-slate-700 transition active:scale-95 cursor-pointer"
                  >
                    {copiedSql ? '복사 완료! ✔' : 'SQL 복사하기'}
                  </button>
                </div>
                <div className="relative">
                  <pre className="text-[10px] bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono overflow-x-auto max-h-[160px] leading-relaxed select-all border border-slate-850">
{`CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  apartment_name TEXT NOT NULL,
  dong TEXT NOT NULL,
  ho TEXT NOT NULL,
  pyeong TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  memo TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책 설정 (익명 권한 허용)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.bookings;
CREATE POLICY "Allow anonymous inserts" ON public.bookings FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow anonymous read" ON public.bookings;
CREATE POLICY "Allow anonymous read" ON public.bookings FOR SELECT USING (true);

-- API 익명/인증 권한 부여 (42501 permission denied 에러 해결)
GRANT ALL ON TABLE public.bookings TO anon;
GRANT ALL ON TABLE public.bookings TO authenticated;
GRANT ALL ON TABLE public.bookings TO service_role;`}
                  </pre>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4 border-t border-slate-100 mt-6 sm:flex-row">
                <button
                  type="button"
                  onClick={handleBypass}
                  className="flex-1 py-3 text-xs font-bold border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors cursor-pointer"
                >
                  임시 로컬 저장 완료 처리
                </button>
                <button
                  type="button"
                  onClick={handleRetryInsert}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 text-xs font-black bg-amber-400 hover:bg-amber-500 disabled:bg-slate-200 text-slate-950 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      연결 시도 중...
                    </span>
                  ) : (
                    <>
                      테이블 생성 완료 및 다시 저장
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              {errorMsg && (
                <div id="booking-error-message" className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Step 1: Property details */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-slate-500" />
                        아파트 단지명 *
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        placeholder="예: 마포 프레스티지 자이"
                        value={apartmentName}
                        onChange={(e) => setApartmentName(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-shadow bg-slate-50/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          동 번호 *
                        </label>
                        <input
                          type="text"
                          required
                          disabled={isSubmitting}
                          placeholder="예: 104동"
                          value={dong}
                          onChange={(e) => setDong(e.target.value)}
                          className="w-full text-sm px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-800 transition-shadow bg-slate-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          호수 번호 *
                        </label>
                        <input
                          type="text"
                          required
                          disabled={isSubmitting}
                          placeholder="예: 1802호"
                          value={ho}
                          onChange={(e) => setHo(e.target.value)}
                          className="w-full text-sm px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-800 transition-shadow bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-slate-500" />
                          공급 면적 (m²) *
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            required
                            disabled={isSubmitting}
                            placeholder="예: 84"
                            value={pyeong}
                            onChange={(e) => handlePyeongChange(e.target.value)}
                            className="w-full text-sm px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-800 transition-shadow bg-slate-50/50 pr-8"
                          />
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">m²</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          평형 환산치 (평)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            disabled={isSubmitting}
                            placeholder="예: 25"
                            value={m2}
                            onChange={(e) => handleM2Change(e.target.value)}
                            className="w-full text-sm px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-800 transition-shadow bg-slate-50/50 pr-12 text-slate-500"
                          />
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">평형</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 font-medium">
                      ※ 면적(m²) 입력 시 평수로 자동 자로 환산 노출되며, 견적 금액 수치는 평형 기준으로 산출되는 데 참고됩니다.
                    </p>
                  </motion.div>
                )}

                {/* Step 2: Date & Time */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        사전점검 희망 일자 *
                      </label>
                      <input
                        type="date"
                        required
                        disabled={isSubmitting}
                        min={new Date().toISOString().split('T')[0]}
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-800 transition-shadow bg-slate-50/50 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        희망 미팅/방문 시간대 *
                      </label>
                      <select
                        disabled={isSubmitting}
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-800 transition-shadow bg-slate-50/50"
                      >
                        <option value="10:00">오전 10:00</option>
                        <option value="12:00">오후 12:00 (정오)</option>
                        <option value="14:00">오후 02:00</option>
                        <option value="15:00">오후 03:00</option>
                      </select>
                    </div>

                    <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
                      <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                        <InfoIcon className="w-3.5 h-3.5 text-amber-500" />
                        점검 소요 시간 안내
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        아파트 세대 입회 하에 진행 장비 점검은 <strong>평형 무관 약 1시간 ~ 1시간 30분</strong> 소요됩니다. 입주자님 동참이 어려운 경우 점검 종료 30분 전 유선 연동 브리핑을 지원합니다.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Visitor detail & submit */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        예약주 성함 *
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        placeholder="예: 홍길동"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-800 transition-shadow bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        연락처 *
                      </label>
                      <input
                        type="tel"
                        required
                        disabled={isSubmitting}
                        placeholder="예: 010-1234-5678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-800 transition-shadow bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        기타 요구 사항 또는 중점 점검 구역 (옵션)
                      </label>
                      <textarea
                        rows={3}
                        disabled={isSubmitting}
                        placeholder="예: 욕실 급배수관 우천 시 누수 의심, 발코니 창호 틈새 가구 접착제 오프 가스 꼼꼼히 부탁드립니다."
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-800 transition-shadow bg-slate-50/50 resize-none"
                      ></textarea>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
                      <input type="checkbox" required defaultChecked disabled={isSubmitting} id="privacy-agreement" className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                      <label htmlFor="privacy-agreement" className="font-medium cursor-pointer leading-tight">
                        [필수] 개인정보 수집 및 유선 상담 안내 도달 보수 청구 대행 위조 방지에 동의합니다.
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* Navigation buttons */}
                <div className="flex gap-2 pt-4 border-t border-slate-100 mt-6 shrink-0">
                  {step > 1 && (
                    <button
                      type="button"
                      id="booking-prev-step-btn"
                      disabled={isSubmitting}
                      onClick={handlePrev}
                      className="flex-1 py-3 text-sm font-bold border border-slate-200 hover:bg-slate-50 disabled:bg-slate-100 rounded-xl text-slate-600 transition-colors cursor-pointer"
                    >
                      이전 단계
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      type="button"
                      id="booking-next-step-btn"
                      onClick={handleNext}
                      className="flex-1 py-3 px-4 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center gap-2 group transition-all cursor-pointer"
                    >
                      다음 단계
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      id="booking-submit-btn"
                      disabled={isSubmitting}
                      className="flex-1 py-3 px-4 text-sm font-bold bg-slate-900 hover:bg-slate-800 disabled:bg-slate-500 text-white rounded-xl flex items-center justify-center gap-2 group transition-all cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          데이터 DB 저장 중...
                        </span>
                      ) : (
                        <>
                          무료 견적 & 예약 신청 완료
                          <CheckCircle2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
