import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, RotateCcw, Filter, Sparkles } from 'lucide-react';
import { getMaxAllowedDateString, isBeforeToday, formatKoreanDate } from '../utils/date';
import heroBg from '../assets/images/cinema_hero_bg_1790605404026.jpg';

interface HeroHeaderProps {
  selectedInputDate: string; // YYYY-MM-DD
  onDateChange: (newDate: string) => void;
  targetDt: string; // YYYYMMDD
  filterNation: 'ALL' | 'K' | 'F';
  onFilterNationChange: (val: 'ALL' | 'K' | 'F') => void;
  filterMulti: 'ALL' | 'COMMERCIAL' | 'INDEPENDENT';
  onFilterMultiChange: (val: 'ALL' | 'COMMERCIAL' | 'INDEPENDENT') => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  selectedInputDate,
  onDateChange,
  targetDt,
  filterNation,
  onFilterNationChange,
  filterMulti,
  onFilterMultiChange
}) => {
  const maxDate = getMaxAllowedDateString(); // Yesterday's date YYYY-MM-DD

  // Quick jump calculations
  const handleJumpDays = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    onDateChange(`${y}-${m}-${day}`);
  };

  const handlePrevDay = () => {
    if (!selectedInputDate) return;
    const cur = new Date(selectedInputDate + 'T00:00:00');
    cur.setDate(cur.getDate() - 1);
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    const day = String(cur.getDate()).padStart(2, '0');
    onDateChange(`${y}-${m}-${day}`);
  };

  const handleNextDay = () => {
    if (!selectedInputDate) return;
    const cur = new Date(selectedInputDate + 'T00:00:00');
    cur.setDate(cur.getDate() + 1);

    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    const day = String(cur.getDate()).padStart(2, '0');
    const nextDateStr = `${y}-${m}-${day}`;

    // Restrict strictly before today
    if (isBeforeToday(nextDateStr)) {
      onDateChange(nextDateStr);
    }
  };

  // Is Next Day allowed? (Must be strictly before today)
  const isNextDayDisabled = () => {
    if (!selectedInputDate) return true;
    const cur = new Date(selectedInputDate + 'T00:00:00');
    cur.setDate(cur.getDate() + 1);
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    const day = String(cur.getDate()).padStart(2, '0');
    return !isBeforeToday(`${y}-${m}-${day}`);
  };

  return (
    <div className="relative overflow-hidden bg-[#12141c] border-b border-slate-800/80">
      {/* Background Hero Wallpaper Scrim */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src={heroBg}
          alt="Cinema theater background"
          className="w-full h-full object-cover object-center filter blur-xs"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-[#0d0e12]/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
        
        {/* Title Area */}
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>영화진흥위원회 일별 박스오피스 서비스</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif-brand tracking-tight leading-tight">
            대한민국 <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">일별 영화 박스오피스</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
            원하는 날짜를 선택하여 해당 일자의 국내 영화 흥행 순위, 관객수, 매출액 및 영화별 세부 출연진과 제작 정보를 한눈에 조회해 보세요.
          </p>
        </div>

        {/* Date Selector & Controls Card */}
        <div className="glass-panel p-5 rounded-2xl bg-slate-900/90 border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            
            {/* Primary Date Picker & Step Controls */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>조회 날짜:</span>
              </span>

              {/* Prev Day Button */}
              <button
                onClick={handlePrevDay}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors cursor-pointer"
                title="이전 날짜"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Native Date Input with MAX = Yesterday constraint */}
              <div className="relative flex-1 sm:flex-initial">
                <input
                  type="date"
                  value={selectedInputDate}
                  max={maxDate}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && isBeforeToday(val)) {
                      onDateChange(val);
                    }
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-950 border border-amber-500/40 rounded-xl text-sm font-semibold text-amber-300 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono shadow-inner cursor-pointer"
                />
              </div>

              {/* Next Day Button */}
              <button
                onClick={handleNextDay}
                disabled={isNextDayDisabled()}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isNextDayDisabled()
                    ? 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 cursor-pointer'
                }`}
                title={isNextDayDisabled() ? '오늘 이후 날짜는 선택할 수 없습니다' : '다음 날짜'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Current formatted date label */}
              <div className="hidden sm:block text-xs font-semibold text-amber-200/90 pl-2">
                {formatKoreanDate(targetDt)}
              </div>
            </div>

            {/* Quick Date Presets */}
            <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 mr-1 hidden sm:inline">빠른 선택:</span>
              <button
                onClick={() => handleJumpDays(1)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  selectedInputDate === maxDate
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                }`}
              >
                어제
              </button>
              <button
                onClick={() => handleJumpDays(3)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors cursor-pointer"
              >
                3일 전
              </button>
              <button
                onClick={() => handleJumpDays(7)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors cursor-pointer"
              >
                1주일 전
              </button>
              <button
                onClick={() => handleJumpDays(30)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors cursor-pointer"
              >
                1달 전
              </button>
            </div>

          </div>

          {/* Sub Filters (Nation & Movie Types) */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-400">국가 구분:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => onFilterNationChange('ALL')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    filterNation === 'ALL' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  전체
                </button>
                <button
                  onClick={() => onFilterNationChange('K')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    filterNation === 'K' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  한국영화
                </button>
                <button
                  onClick={() => onFilterNationChange('F')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    filterNation === 'F' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  외국영화
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-400">영화 유형:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => onFilterMultiChange('ALL')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    filterMulti === 'ALL' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  전체
                </button>
                <button
                  onClick={() => onFilterMultiChange('COMMERCIAL')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    filterMulti === 'COMMERCIAL' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  상업영화
                </button>
                <button
                  onClick={() => onFilterMultiChange('INDEPENDENT')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    filterMulti === 'INDEPENDENT' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  다양성/독립
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
