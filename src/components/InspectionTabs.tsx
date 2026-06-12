/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckSquare, Square, Eye, Hammer, Cpu, ListCollapse, AlertTriangle } from 'lucide-react';
import { VISUAL_ITEMS, TOOL_ITEMS, EQUIPMENT_ITEMS } from '../data';
import { InspectionCategory } from '../types';

export default function InspectionTabs() {
  const [activeTab, setActiveTab] = useState<InspectionCategory>('visual');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleToggle = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const currentItems = 
    activeTab === 'visual' ? VISUAL_ITEMS :
    activeTab === 'tool' ? TOOL_ITEMS :
    EQUIPMENT_ITEMS;

  const currentIcon = 
    activeTab === 'visual' ? <Eye className="w-5 h-5 text-indigo-500" /> :
    activeTab === 'tool' ? <Hammer className="w-5 h-5 text-amber-500" /> :
    <Cpu className="w-5 h-5 text-emerald-500" />;

  const currentHeading = 
    activeTab === 'visual' ? '육안 정밀 검진 (벽면, 오염, 유격 마감 위주)' :
    activeTab === 'tool' ? '기능 및 물리 도구 점검 (타공음, 강도, 배수 경사)' :
    '첨단 하이테크 장비 점검 (열화상 기밀 측정)';

  // Calculate items checked
  const totalInCurrent = currentItems.length;
  const checkedInCurrent = currentItems.filter(item => checkedItems[item.id]).length;
  const progressPercent = Math.round((checkedInCurrent / totalInCurrent) * 100) || 0;

  return (
    <div id="inspection-tabs-container" className="w-full bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
      {/* Tab Selectors */}
      <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-2">
        <button
          id="tab-visual-btn"
          onClick={() => setActiveTab('visual')}
          className={`flex-1 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'visual' 
              ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' 
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          <Eye className="w-4 h-4 shrink-0" />
          육안 점검
        </button>

        <button
          id="tab-tool-btn"
          onClick={() => setActiveTab('tool')}
          className={`flex-1 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'tool' 
              ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' 
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          <Hammer className="w-4 h-4 shrink-0" />
          도구 기능 점검
        </button>

        <button
          id="tab-equipment-btn"
          onClick={() => setActiveTab('equipment')}
          className={`flex-1 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'equipment' 
              ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' 
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          <Cpu className="w-4 h-4 shrink-0" />
          전문 장비 점검
        </button>
      </div>

      <div className="p-6">
        {/* Tab Description Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dashed border-slate-100 pb-5 mb-5 text-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              {currentIcon}
            </span>
            <div>
              <h4 id="tab-heading" className="text-sm font-bold">{currentHeading}</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                각 항목을 클릭하여 전문가의 실제 점검 프로세스를 가상으로 보정해보세요.
              </p>
            </div>
          </div>

          {/* Interactive Simulated Inspector Checkmeter */}
          <div className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">점검 완료 진폭</span>
              <span className="text-xs font-bold font-mono text-slate-700">{checkedInCurrent} / {totalInCurrent} 개 체크됨</span>
            </div>
            <div className="relative w-16 h-16 flex items-center justify-center bg-white rounded-full border border-slate-100 shadow-xs">
              <span className="text-xs font-bold font-mono text-slate-800">{progressPercent}%</span>
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="32" cy="32" r="28" className="stroke-slate-100 fill-none" strokeWidth="2.5" />
                <circle cx="32" cy="32" r="28" className="stroke-slate-800 fill-none transition-all duration-500" strokeWidth="2.5" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * progressPercent) / 100} />
              </svg>
            </div>
          </div>
        </div>

        {/* Dynamic Items Listing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <AnimatePresence mode="popLayout">
            {currentItems.map((item, idx) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: idx * 0.04, duration: 0.3 }}
                  onClick={() => handleToggle(item.id)}
                  className={`p-4 border rounded-xl flex gap-3 cursor-pointer select-none transition-all group ${
                    isChecked 
                      ? 'border-slate-800 bg-slate-900/5 shadow-xs' 
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="pt-0.5" id={`checkbox-${item.id}`}>
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-slate-800 fill-amber-100" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300 group-hover:text-slate-400 transition-colors" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className="block text-xs font-bold font-mono text-slate-400">
                      PROTOCOL {activeTab.toUpperCase()}-{String(idx + 1).padStart(2, '0')}
                    </span>
                    <h5 className={`text-sm font-semibold transition-colors duration-200 ${isChecked ? 'text-slate-950 line-through decoration-slate-300' : 'text-slate-800'}`}>
                      {item.title}
                    </h5>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Warning Badge */}
        <div className="mt-6 p-4 bg-amber-50/40 border border-amber-100/60 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">
            <strong>하자 미발견 시 입주자 전액 책임 전가 가능성:</strong> 아파트 시공 계약 조항 상, 입주 예정자가 기한 내 서면으로 공인 하자를 입증 제출하지 못하여 차후 가구 전도나 타일 붕괴 등 이차 안전사고 및 누수 사태가 발생할 경우 보수 비용 공제가 거절될 수 있습니다. 따라서 반드시 전문 장비를 갖춘 검진 팀장을 통해 하자 흔적의 기하학적 수광 수치를 기록해 전송하여야 안전합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
