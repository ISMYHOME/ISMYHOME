/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { MessageCircle, Phone, ArrowUpToLine } from 'lucide-react';
import { getKakaoLink } from '../utils/kakaoHelper';

interface StickyBottomBarProps {
  onOpenBooking: () => void;
}

export default function StickyBottomBar({ onOpenBooking }: StickyBottomBarProps) {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKakaoLink = () => {
    window.open(getKakaoLink(), '_blank', 'noopener,noreferrer');
  };

  const handleCall = () => {
    // Simulated dialer trigger
    window.location.href = 'tel:010-5027-0939';
  };

  return (
    <>
      {/* Sticky Bottom Consultation Floating Bar for Mobile Devices */}
      <div
        id="mobile-sticky-bottom-bar"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 py-3 shadow-lg md:hidden flex items-center gap-3.5"
      >
        {/* Telephone Call Button */}
        <button
          id="mobile-sticky-call-btn"
          onClick={handleCall}
          className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl shrink-0 transition-all cursor-pointer"
          aria-label="전화 문의하기"
        >
          <Phone className="w-5 h-5" />
        </button>

        {/* Yellow Kakao Consulting Bar */}
        <button
          id="mobile-sticky-kakao-btn"
          onClick={handleKakaoLink}
          className="flex-1 py-3.5 bg-[#FEE500] hover:bg-[#F0D800] active:scale-95 text-slate-900 font-bold text-sm tracking-tight rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-yellow-500/10 cursor-pointer"
        >
          <MessageCircle className="w-4.5 h-4.5 fill-slate-900 stroke-none" />
          카카오톡 상담하기 (실시간)
        </button>
      </div>

      {/* Floating Action Button (FAB) for Desktop has been removed */}
    </>
  );
}
