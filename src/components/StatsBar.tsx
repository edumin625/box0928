import React from 'react';
import { Users, DollarSign, Trophy, Flame } from 'lucide-react';
import { DailyBoxOffice } from '../types/kobis';
import { formatNumber, formatKoreanCurrency } from '../utils/date';

interface StatsBarProps {
  boxOfficeList: DailyBoxOffice[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ boxOfficeList }) => {
  if (!boxOfficeList || boxOfficeList.length === 0) return null;

  // Calculate totals
  const totalDailyAudi = boxOfficeList.reduce(
    (acc, curr) => acc + (parseInt(curr.audiCnt, 10) || 0),
    0
  );

  const totalDailySales = boxOfficeList.reduce(
    (acc, curr) => acc + (parseInt(curr.salesAmt, 10) || 0),
    0
  );

  const top1 = boxOfficeList.find((item) => item.rank === '1') || boxOfficeList[0];

  const newEntriesCount = boxOfficeList.filter(
    (item) => item.rankOldAndNew === 'NEW'
  ).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
      
      {/* Metric 1: Total Audience */}
      <div className="glass-panel p-4 rounded-xl bg-slate-900/80 border-slate-800/80 space-y-1">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold">TOP10 총 관객수</span>
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
          {formatNumber(totalDailyAudi)} <span className="text-xs font-normal text-slate-400">명</span>
        </p>
      </div>

      {/* Metric 2: Total Gross Sales */}
      <div className="glass-panel p-4 rounded-xl bg-slate-900/80 border-slate-800/80 space-y-1">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold">TOP10 총 매출액</span>
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono tabular-nums tracking-tight">
          {formatKoreanCurrency(totalDailySales)}
        </p>
      </div>

      {/* Metric 3: Number 1 Movie */}
      <div className="glass-panel p-4 rounded-xl bg-slate-900/80 border-slate-800/80 space-y-1">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold">1위 박스오피스</span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Trophy className="w-4 h-4" />
          </div>
        </div>
        <p className="text-base sm:text-lg font-bold text-amber-300 truncate font-serif-brand">
          {top1?.movieNm || '데이터 없음'}
        </p>
        <p className="text-[11px] text-slate-400 font-mono">
          당일 {formatNumber(top1?.audiCnt || 0)}명 (누적 {formatNumber(top1?.audiAcc || 0)}명)
        </p>
      </div>

      {/* Metric 4: New Entries */}
      <div className="glass-panel p-4 rounded-xl bg-slate-900/80 border-slate-800/80 space-y-1">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold">신규 진입 (NEW)</span>
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-rose-400 font-mono tabular-nums tracking-tight">
          {newEntriesCount} <span className="text-xs font-normal text-slate-400">편 진입</span>
        </p>
      </div>

    </div>
  );
};
