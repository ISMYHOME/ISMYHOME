/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Lock, Shield, User, Key, KeyRound, 
  Database, RefreshCw, Trash2, Calendar, 
  MapPin, Clipboard, CheckCircle2, AlertTriangle, 
  Mail, Users, HelpCircle, HardDrive, Check,
  ChevronDown, Search, Filter, TrendingUp, DollarSign,
  MessageSquare
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Booking } from '../types';
import { getKakaoId, getKakaoUrlId, setKakaoSettings } from '../utils/kakaoHelper';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  // Authentication states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Bookings list & UI states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'guide' | 'settings'>('list');

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Copy helpers
  const [copiedText, setCopiedText] = useState(false);

  // Kakao states
  const [kakaoId, setKakaoIdState] = useState(getKakaoId());
  const [kakaoUrlId, setKakaoUrlIdState] = useState(getKakaoUrlId());
  const [isKakaoSaved, setIsKakaoSaved] = useState(false);

  const handleKakaoTestClick = () => {
    let link = kakaoUrlId.trim();
    if (!link.startsWith("http")) {
      link = `https://pf.kakao.com/${link.startsWith("/") ? link.slice(1) : link}`;
    }
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  // Check auth session on render
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchBookings();
      }
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchBookings();
      } else {
        setBookings([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (error) {
        setAuthError(error.message === 'Invalid login credentials' 
          ? '아이디(이메일) 또는 비밀번호가 올바르지 않습니다. Supabase Auth 메일에 계정이 등록되었는지 확인해주세요.' 
          : error.message
        );
      } else {
        setUser(data.user);
        fetchBookings();
      }
    } catch (err: any) {
      setAuthError('로그인 처리 중 요류가 발생했습니다: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setBookings([]);
  };

  const fetchBookings = async () => {
    setDbLoading(true);
    setDbError('');
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch bookings error:', error);
        setDbError('bookings 테이블을 찾을 수 없거나 데이터 조회 권한이 없습니다. (DB에 bookings 테이블이 없는 경우 아래 가이드 탭에서 SQL 스크립트를 가동해주세요)');
      } else if (data) {
        const clientBookings: Booking[] = data.map(item => ({
          id: item.id,
          name: item.name,
          phone: item.phone,
          apartmentName: item.apartment_name,
          dong: item.dong,
          ho: item.ho,
          pyeong: item.pyeong,
          bookingDate: item.booking_date,
          bookingTime: item.booking_time,
          memo: item.memo || '',
          status: item.status as Booking['status'],
          createdAt: item.created_at
        }));
        setBookings(clientBookings);
      }
    } catch (err: any) {
      setDbError('연결 실패: ' + (err.message || '인터넷 상태 및 API 세팅을 확인하십시오.'));
    } finally {
      setDbLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) {
        alert('상태 업데이트에 실패했습니다: ' + error.message);
      } else {
        // Update local state
        setBookings(prev => 
          prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
        );
      }
    } catch (err: any) {
      alert('오류 발생: ' + err.message);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!window.confirm(`예약 번호 ${bookingId} 건을 삭제하시겠습니까? (복구 불가능)`)) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) {
        alert('삭제에 실패했습니다: ' + error.message);
      } else {
        setBookings(prev => prev.filter(b => b.id !== bookingId));
      }
    } catch (err: any) {
      alert('오류 발생: ' + err.message);
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
CREATE POLICY "Allow anonymous read" ON public.bookings FOR SELECT USING (true);

-- API 익명/인증 권한 부여 (42501 permission denied 에러 해결)
GRANT ALL ON TABLE public.bookings TO anon;
GRANT ALL ON TABLE public.bookings TO authenticated;
GRANT ALL ON TABLE public.bookings TO service_role;`;

    navigator.clipboard.writeText(sqlText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Calculations for stats
  const totalCount = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'assigned' || b.status === 'completed').length;
  
  // Calculate predicted sales: extract numeric pyeong from string like "84m² (25평형)" or "25평형"
  const totalRevenue = bookings.reduce((sum, b) => {
    if (b.status === 'cancelled') return sum;
    const match = b.pyeong.match(/(\d+)\s*평형/);
    const pyeongNum = match ? parseInt(match[1]) : 25; // default fallback 25
    return sum + (pyeongNum * 8000);
  }, 0);

  // Apply filters
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.apartmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 15 }}
        className="relative w-full max-w-6xl h-[85vh] bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 flex flex-col text-left overflow-hidden uppercase-none"
      >
        {/* Header section with lock icon */}
        <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-amber-400 text-slate-950 rounded-xl shadow-md">
              <Shield className="w-5 h-5 stroke-[2.5]" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-white font-extrabold text-base tracking-tight">IS마이홈 통합 관리자 대시보드</h3>
                <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full font-mono font-bold">v1.1</span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5 font-medium">예약 접수 연동 상황 모니터링 및 실시간 고객 관리</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5.5 h-5.5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!user ? (
            /* Login state */
            <div className="flex-1 flex items-center justify-center p-6 bg-slate-900/60">
              <div className="w-full max-w-sm bg-slate-950 p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-amber-400/10 text-amber-400 mx-auto rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black text-white">관리자 전용 로그인</h4>
                  <p className="text-slate-400 text-xs">Supabase 계정 인증 정보로 로그인해주십시오.</p>
                </div>

                {authError && (
                  <div className="p-3 bg-red-950/50 border border-red-800/60 text-red-300 rounded-xl text-xs font-semibold flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="leading-normal">{authError}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      이메일 아이디
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="dwa5040@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-sm px-4 py-3 bg-slate-900/70 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-amber-400 placeholder:text-slate-600 transition"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                      비밀번호
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-sm px-4 py-3 bg-slate-900/70 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-amber-400 placeholder:text-slate-600 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm rounded-xl transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        로그인 및 승인
                        <Check className="w-4 h-4 stroke-[3px]" />
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-2 border-t border-slate-900 text-center">
                  <span className="text-[10px] text-slate-500">
                    * 제공해 주신 <strong>dwa5040@gmail.com</strong> 계정으로 인증합니다.
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Logged In Admin view */
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
              
              {/* Top Summary Stats Panel */}
              <div className="bg-slate-950 p-5 px-6 border-b border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 p-4.5 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400">전체 문의 건수</span>
                    <strong className="text-xl font-extrabold text-white">{totalCount}건</strong>
                  </div>
                </div>

                <div className="bg-slate-900 p-4.5 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="p-2.5 bg-amber-400/10 text-amber-400 rounded-lg">
                    <RefreshCw className="w-5 h-5 animate-spin-slow" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400">대기 중 (처리 대기)</span>
                    <strong className="text-xl font-extrabold text-white text-amber-400">{pendingCount}건</strong>
                  </div>
                </div>

                <div className="bg-slate-900 p-4.5 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400">예약 수락/확정</span>
                    <strong className="text-xl font-extrabold text-white text-emerald-400">{confirmedCount}건</strong>
                  </div>
                </div>

                <div className="bg-slate-900 p-4.5 rounded-xl border border-slate-800 flex items-center gap-3 col-span-2 md:col-span-1">
                  <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-lg">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400">예상 매출액 합산</span>
                    <strong className="text-lg font-extrabold text-white text-rose-300">
                      ₩ {totalRevenue.toLocaleString()}원
                    </strong>
                  </div>
                </div>
              </div>

              {/* Navigation tabs inside Dashboard */}
              <div className="bg-slate-950 px-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveSubTab('list')}
                    className={`py-3.5 text-xs font-black border-b-2 tracking-wide transition ${
                      activeSubTab === 'list' 
                        ? 'border-amber-400 text-white' 
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    예약접수 목록 ({filteredBookings.length})
                  </button>
                  <button
                    onClick={() => setActiveSubTab('guide')}
                    className={`py-3.5 text-xs font-black border-b-2 tracking-wide transition flex items-center gap-1.5 ${
                      activeSubTab === 'guide' 
                        ? 'border-amber-400 text-white' 
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    실시간 이메일 전송 자동화 가이드
                  </button>
                  <button
                    onClick={() => setActiveSubTab('settings')}
                    className={`py-3.5 text-xs font-black border-b-2 tracking-wide transition flex items-center gap-1.5 ${
                      activeSubTab === 'settings' 
                        ? 'border-amber-400 text-white' 
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#FEE500]" />
                    카카오 채널 연동 설정
                  </button>
                </div>

                {/* Logged in identifier & Logout */}
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400 font-medium">
                    사용자: <strong className="text-slate-200">{user.email}</strong>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-1 px-2 text-[10px] font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white rounded-md transition"
                  >
                    로그아웃
                  </button>
                </div>
              </div>

              {/* Sub-tab view area */}
              {activeSubTab === 'list' ? (
                <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-4">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    {/* Search query input */}
                    <div className="relative flex-1 max-w-sm">
                      <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                        <Search className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="이름, 아파트명, 휴대전화 등 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:border-amber-400 transition"
                      />
                    </div>

                    {/* Status filter selection */}
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-bold flex items-center gap-1">
                        <Filter className="w-3.5 h-3.5" />
                        상태 필터:
                      </span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2.5 bg-slate-950 border border-slate-800 text-xs rounded-xl text-slate-200 font-bold focus:outline-hidden focus:border-amber-400"
                      >
                        <option value="all">전체보기 (상태무관)</option>
                        <option value="pending">진행 대기중 (pending)</option>
                        <option value="assigned">팀장 배정됨 (assigned)</option>
                        <option value="completed">예약/완료 (completed)</option>
                        <option value="cancelled">취소됨 (cancelled)</option>
                      </select>

                      <button
                        onClick={fetchBookings}
                        disabled={dbLoading}
                        className="p-2.5 bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center justify-center cursor-pointer"
                        title="새로고침"
                      >
                        <RefreshCw className={`w-4 h-4 ${dbLoading ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {dbError && (
                    <div className="p-4 bg-red-950/40 border border-red-800/50 rounded-xl space-y-2 text-left">
                      <div className="flex items-center gap-2 text-red-400">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <h4 className="text-xs font-bold font-sans">에러 상황 알림</h4>
                      </div>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed">
                        {dbError}
                      </p>
                      <button
                        onClick={() => setActiveSubTab('guide')}
                        className="text-[10px] font-black bg-red-800 text-white p-1 px-3 rounded-md hover:bg-red-700 transition"
                      >
                        SQL 스크립트 복사 및 설정하기 &rarr;
                      </button>
                    </div>
                  )}

                  {/* Booking Spreadsheet Table Grid */}
                  <div className="flex-1 bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col">
                    {dbLoading ? (
                      <div className="flex-1 flex flex-col items-center justify-center gap-2">
                        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs text-slate-400 font-bold">Supabase 대기 데이터를 안전하게 동기화 중...</span>
                      </div>
                    ) : filteredBookings.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2">
                        <HardDrive className="w-8 h-8 text-slate-700" />
                        <span className="block text-xs font-bold text-slate-400">일치하는 예약 내역이 존재하지 않습니다.</span>
                        <p className="text-[11px] text-slate-500">필터 기준을 변경하거나 홈페이지에서 첫 테스트 신청을 넣어보세요!</p>
                      </div>
                    ) : (
                      <div className="flex-1 overflow-auto max-h-[45vh]">
                        <table className="w-full text-xs text-left text-slate-300">
                          <thead className="text-[10px] text-slate-400 bg-slate-900 border-b border-slate-850 font-bold uppercase tracking-wider sticky top-0">
                            <tr>
                              <th className="p-4 px-6">예약번호 / 신청일시</th>
                              <th className="p-4">예약자성함 / 연락처</th>
                              <th className="p-4">아파트 주소</th>
                              <th className="p-4 text-center">공급 평형</th>
                              <th className="p-4">희망 예정일자</th>
                              <th className="p-4">고객 요청 사항</th>
                              <th className="p-4">처리 현황상태</th>
                              <th className="p-4 text-center">관리</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850">
                            {filteredBookings.map((b) => (
                              <tr key={b.id} className="hover:bg-slate-900/50 transition">
                                <td className="p-4 px-6">
                                  <span className="block font-bold text-white font-mono">{b.id}</span>
                                  <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                                    {b.createdAt ? new Date(b.createdAt).toLocaleString('ko-KR', { hour12: false }) : '-'}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <span className="block font-extrabold text-white text-sm">{b.name}</span>
                                  <a 
                                    href={`tel:${b.phone}`} 
                                    className="block text-[11px] text-slate-400 hover:text-amber-400 transition font-mono mt-0.5"
                                  >
                                    {b.phone}
                                  </a>
                                </td>
                                <td className="p-4">
                                  <span className="block font-bold text-white">{b.apartmentName}</span>
                                  <span className="block text-[11px] text-slate-400 mt-0.5">{b.dong} {b.ho}</span>
                                </td>
                                <td className="p-4 text-center font-bold text-orange-200">
                                  {b.pyeong}
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-1 text-slate-100 font-bold">
                                    <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                    <span>{b.bookingDate}</span>
                                  </div>
                                  <span className="block text-[10px] text-slate-400 font-mono pl-4.5 mt-0.5">{b.bookingTime}</span>
                                </td>
                                <td className="p-4 max-w-xs truncate" title={b.memo}>
                                  <p className="text-[11px] text-slate-400 leading-normal line-clamp-2 italic">
                                    {b.memo || '특이사항 없음'}
                                  </p>
                                </td>
                                <td className="p-4">
                                  <select
                                    value={b.status}
                                    onChange={(e) => handleUpdateStatus(b.id, e.target.value as Booking['status'])}
                                    className={`px-2 py-1 border rounded-lg font-black text-[10px] cursor-pointer focus:outline-hidden ${
                                      b.status === 'pending' ? 'bg-amber-400/10 text-amber-300 border-amber-400/40' :
                                      b.status === 'assigned' ? 'bg-indigo-400/10 text-indigo-300 border-indigo-400/40' :
                                      b.status === 'completed' ? 'bg-emerald-400/10 text-emerald-300 border-emerald-400/40' :
                                      'bg-slate-800 text-slate-400 border-slate-700'
                                    }`}
                                  >
                                    <option value="pending" className="bg-slate-900 text-amber-300">진행 대기중</option>
                                    <option value="assigned" className="bg-slate-900 text-indigo-300">팀장 배정됨</option>
                                    <option value="completed" className="bg-slate-900 text-emerald-300">예약/완료</option>
                                    <option value="cancelled" className="bg-slate-900 text-slate-400">예약 취소</option>
                                  </select>
                                </td>
                                <td className="p-4 text-center">
                                  <button
                                    onClick={() => handleDeleteBooking(b.id)}
                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                    title="제거"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ) : activeSubTab === 'guide' ? (
                /* Email integrations instructions guide view */
                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-300">
                  <div className="p-4 bg-amber-400/10 rounded-2xl border border-amber-400/20 text-left space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-amber-400 shrink-0" />
                      <h4 className="text-sm font-black text-amber-300">"온라인 예약을 접수하면 나한테 이메일이 오게 하려면?"</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                      Supabase는 강력한 백엔드 엔진이므로, <strong>Database Webhooks</strong> 또는 <strong>Edge Functions</strong> 기능을 활용해, <code>bookings</code> 테이블에 새로운 예약 행(Row)이 추가되는 즉시 관리자님 이메일(<code>{user.email}</code>)로 모든 고객 정보(성함, 연락처, 희망날짜 및 아파트)를 자동으로 전송할 수 있습니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                    {/* Method 1: Database Trigger + Edge Function */}
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center text-xs font-black">1</span>
                        <h4 className="text-xs font-black text-white">방법 1: Supabase + Resend 연동 (초추천)</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                        가장 정석이고 완벽한 무료 솔루션입니다. 전 세계 개발자 표준인 <strong className="text-white">Resend</strong> (월 3,000통 무료 이메일 전송 API) 서비스 가입 후 Supabase Edge Function을 연결합니다.
                      </p>
                      
                      <ol className="text-[11px] text-slate-400 space-y-2 font-medium list-none">
                        <li className="flex gap-1.5">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span><strong>resend.com</strong>에서 무료 가입 후 API 키를 생성합니다.</span>
                        </li>
                        <li className="flex gap-1.5">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>Supabase CLI 혹은 대시보드 <strong>Edge Functions</strong> 탭에 <code>send-booking-email</code> 함수를 배포합니다.</span>
                        </li>
                        <li className="flex gap-1.5">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span> bookings 테이블에 INSERT 트리거를 걸어 이 Edge Function을 호출하도록 설정합니다.</span>
                        </li>
                      </ol>

                      <div className="p-3 bg-slate-900 rounded-xl space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400">Edge Function 간략 이메일 발신 예시 코드</span>
                        <pre className="text-[9px] bg-slate-950 text-emerald-400 p-2.5 rounded-lg overflow-x-auto font-mono max-h-[80px]">
{`const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    "Authorization": "Bearer "+RESEND_API_KEY,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    from: "ISMYHOME Booking <onboarding@resend.dev>",
    to: "dwa5040@gmail.com",
    subject: "새로운 사전점검 온라인 예약 문의 접수!",
    html: "<p>고객 성함: " + name + "</p>"
  })
});`}
                        </pre>
                      </div>
                    </div>

                    {/* Method 2: Zapier/Make No-Code integration */}
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-black">2</span>
                        <h4 className="text-xs font-black text-white">방법 2: Zapier / Make.com 노코드 연동 (가장 간단)</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                        코딩 없이 즉시 5분 만에 연동할 수 있는 자동화 툴 활용 방법입니다.
                      </p>

                      <ul className="text-[11px] text-slate-400 space-y-2 font-medium list-none">
                        <li className="flex gap-1.5">
                          <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span><strong>Zapier.com</strong> 또는 <strong>Make.com</strong> 회원가입 후 <strong>Create Zap / Scenario</strong>를 누릅니다.</span>
                        </li>
                        <li className="flex gap-1.5">
                          <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span>트리거 앱으로 <strong className="text-white">Supabase</strong>를 연동하고 <code>"New Row"</code>(새로운 행 추가) 이벤트를 선택합니다.</span>
                        </li>
                        <li className="flex gap-1.5">
                          <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span>액션 전송 앱으로 <strong className="text-white">Gmail</strong> 또는 <code>Email by Zapier</code>를 지정 후 <code>dwa5040@gmail.com</code>으로 메일이 전송되게 빌드합니다.</span>
                        </li>
                      </ul>

                      <div className="p-3 bg-indigo-950/20 rounded-xl border border-indigo-900/40 text-[11px]">
                        <span className="font-bold text-slate-300">★ 이메일 제목 / 본문 구성 추천 가이드</span>
                        <p className="text-slate-400 mt-1">
                          제목: [IS마이홈] <code>{"{{name}}"}</code> 님의 사전점검 신규 예약이 접수되었습니다.<br/>
                          본문: 아파트단지: <code>{"{{apartment_name}}"}</code> <code>{"{{dong}}"}동</code> <code>{"{{ho}}"}호</code> <code>{"{{pyeong}}"}</code> / 연락처: <code>{"{{phone}}"}</code>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Supabase Bookings Table SQL script */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-3 font-sans">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span className="flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-emerald-400" />
                        Supabase DB 초기화 SQL 스크립트 (테이블 재생성용)
                      </span>
                      <button
                        onClick={handleCopySql}
                        className="text-[10px] font-black bg-slate-900 hover:bg-slate-850 text-slate-300 py-1.5 px-3 rounded-lg border border-slate-800 transition active:scale-95"
                      >
                        {copiedText ? '복사 완료! ✔' : 'SQL 테이블 스크립트 복사'}
                      </button>
                    </div>
                    <pre className="text-[10px] bg-slate-900/60 p-4 rounded-xl overflow-x-auto font-mono text-slate-300 border border-slate-850 max-h-[140px] leading-relaxed">
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
              ) : (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 space-y-5 font-sans text-left">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-850">
                      <MessageSquare className="w-5 h-5 text-[#FEE500]" />
                      <div>
                        <h3 className="text-sm font-bold text-white">카카오톡 채널 연동 실시간 관리</h3>
                        <p className="text-[10px] text-slate-500 mt-0.5">웹사이트 전역의 카카오톡 문의하기 버튼과 연동되는 ID 및 공식 주소를 관리자 모드로 즉각 수정합니다.</p>
                      </div>
                    </div>

                    {isKakaoSaved && (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs font-bold animate-pulse flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        카카오톡 채널 설정이 성공적으로 전역에 반영되었습니다! 실시간 예약 연결이 정상 작동합니다.
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-gap-5">
                      {/* Kakao Channel Display Name */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                          채널 검색용 아이디 (Ex: @ismyhome)
                        </label>
                        <input
                          type="text"
                          placeholder="@ismyhome"
                          value={kakaoId}
                          onChange={(e) => setKakaoIdState(e.target.value)}
                          className="w-full text-xs px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-amber-400 transition"
                        />
                        <span className="text-[10px] text-slate-500">홈페이지 단가표 및 모달 화면에 표시되는 채널명입니다. 꼭 @를 포함해 적어 주십시오.</span>
                      </div>

                      {/* Kakao Channel Landing URL ID */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                          카카오톡 채널 실제 URL 키값 (Ex: _ismyhome)
                        </label>
                        <input
                          type="text"
                          placeholder="_ismyhome"
                          value={kakaoUrlId}
                          onChange={(e) => setKakaoUrlIdState(e.target.value)}
                          className="w-full text-xs px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-amber-400 transition"
                        />
                        <span className="text-[10px] text-slate-500">
                          pf.kakao.com/ 뒤에 들어갈 고유 ID입니다. (예: <code>_ismyhome</code> 또는 전체 URL 입력 가능)
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          setKakaoSettings(kakaoId, kakaoUrlId);
                          setIsKakaoSaved(true);
                          setTimeout(() => setIsKakaoSaved(false), 4500);
                        }}
                        className="py-2.5 px-6 bg-[#FEE500] hover:bg-[#FCD200] text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                      >
                        설정 저장 및 사이트 반영
                        <Check className="w-4 h-4 stroke-[3px]" />
                      </button>
                    </div>
                  </div>

                  {/* Troubleshooting Guide Card */}
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 space-y-4 font-sans text-left">
                    <h3 className="text-xs font-extrabold text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      "페이지를 찾을 수 없습니다" 카카오톡 404 에러 원인 및 해결 방법
                    </h3>
                    <div className="text-[11px] text-slate-400 space-y-3.5 leading-relaxed">
                      <p>
                        카카오톡 채널을 개설하고 검색용 아이디를 <code>@ismyhome</code>으로 지정했더라도, 
                        카카오톡 채널 센터에서 <strong>"홈 URL"</strong>을 별도로 커스텀하게 설정하지 않았다면 
                        실제 홈 링크 주소는 <code>_ismyhome</code>이 아닌 <code>_xhxLxX</code> 형태의 알파벳 랜덤 난수 혹은 고유 문자열로 지정됩니다.
                      </p>

                      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850/60 space-y-2">
                        <span className="font-bold text-slate-200 block">🛠 해결 방법 (Step-by-Step)</span>
                        <ol className="list-decimal pl-4 space-y-1.5 text-slate-400">
                          <li>
                            <strong><a href="https://center-pf.kakao.com" target="_blank" rel="noreferrer" className="text-amber-400 underline decoration-dotted">카카오톡 채널 관리자 센터</a></strong>에 컴퓨터로 로그인합니다.
                          </li>
                          <li>
                            운영하는 <strong>IS마이홈</strong> 채널을 클릭해 진입합니다.
                          </li>
                          <li>
                            왼쪽 사이드 메뉴에서 <strong>[상세설정]</strong> &gt; <strong>[채널 정보]</strong> 탭으로 이동합니다.
                          </li>
                          <li>
                            <strong>[홈 URL]</strong>에 기록된 정확한 링크 값(예: <code>http://pf.kakao.com/_xxxxxx</code> 고유 코드)의 끝부분 <code>_xxxxxx</code> 또는 커스텀 지정된 명칭을 복사합니다.
                          </li>
                          <li>
                            복사한 값(반드시 언더바 <code>_</code> 기호 포함)을 위의 <strong>"실제 URL 키값"</strong> 입력란에 안전하게 붙여넣고 [설정 저장 및 사이트 반영] 버튼을 클릭해 주십시오!
                          </li>
                        </ol>
                      </div>

                      {/* Diagnostic current link button */}
                      <div className="p-3 bg-indigo-950/20 border border-indigo-900/50 rounded-xl flex items-center justify-between">
                        <div className="space-y-0.5 text-left">
                          <span className="font-bold text-slate-300 block">🔗 현재 설정 주소 즉시 테스트</span>
                          <p className="text-[10px] text-slate-500">현재 브라우저에 기입한 주소값 그대로 즉각 모의 클릭 테스트를 실행하여 카카오 페이지가 정상 작동되는지 체크합니다.</p>
                        </div>
                        <button
                          onClick={handleKakaoTestClick}
                          className="py-1.5 px-3 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-lg text-[10px] font-bold border border-slate-800 transition whitespace-nowrap active:scale-95 cursor-pointer"
                        >
                          즉시 테스트 새창 열기 ↗
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
