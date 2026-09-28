import React from 'react';
import { TrendingUp, TrendingDown, Minus, Sparkles, Users, Info, ChevronRight, Calendar } from 'lucide-react';
import { DailyBoxOffice } from '../types/kobis';
import { formatNumber, formatKoreanCurrency } from '../utils/date';
import { getPosterStyle } from '../utils/poster';

interface BoxOfficeGridCardProps {
  movie: DailyBoxOffice;
  onSelectMovie: (movieCd: string, movieItem: DailyBoxOffice) => void;
}

export const BoxOfficeGridCard: React.FC<BoxOfficeGridCardProps> = ({
  movie,
  onSelectMovie
}) => {
  const style = getPosterStyle(movie.movieCd, movie.movieNm);
  const rankNum = parseInt(movie.rank, 10);

  // Rank emblem styling
  const getRankBadge = () => {
    if (rankNum === 1) {
      return (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-slate-950 font-extrabold flex items-center justify-center text-lg shadow-lg shadow-amber-500/30">
          1
        </div>
      );
    }
    if (rankNum === 2) {
      return (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-950 font-extrabold flex items-center justify-center text-lg shadow-md shadow-slate-400/20">
          2
        </div>
      );
    }
    if (rankNum === 3) {
      return (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 text-amber-200 font-extrabold flex items-center justify-center text-lg shadow-md shadow-amber-900/30 border border-amber-600/40">
          3
        </div>
      );
    }
    return (
      <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-base border border-slate-700">
        {movie.rank}
      </div>
    );
  };

  // Rank Intensity Badge
  const getRankIntenBadge = () => {
    if (movie.rankOldAndNew === 'NEW') {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-extrabold tracking-wide animate-pulse">
          <Sparkles className="w-3 h-3 text-rose-400" />
          NEW
        </span>
      );
    }

    const inten = parseInt(movie.rankInten, 10);
    if (inten > 0) {
      return (
        <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold font-mono">
          <TrendingUp className="w-3 h-3" />
          ▲{inten}
        </span>
      );
    }
    if (inten < 0) {
      return (
        <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700 text-[11px] font-medium font-mono">
          <TrendingDown className="w-3 h-3 text-rose-400" />
          ▼{Math.abs(inten)}
        </span>
      );
    }
    return (
      <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-500 text-[11px] font-medium font-mono">
        <Minus className="w-3 h-3" />
        -
      </span>
    );
  };

  return (
    <div 
      onClick={() => onSelectMovie(movie.movieCd, movie)}
      className="group relative glass-panel glass-panel-hover rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
    >
      {/* Top Banner & Poster Background */}
      <div className={`relative h-36 bg-gradient-to-br ${style.gradient} p-4 flex flex-col justify-between border-b border-slate-800/80`}>
        <div className="flex items-center justify-between">
          {getRankBadge()}
          {getRankIntenBadge()}
        </div>

        <div className="space-y-1 z-10">
          <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            {style.tagline}
          </p>
          <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 font-serif-brand">
            {movie.movieNm}
          </h3>
        </div>
      </div>

      {/* Card Body Data */}
      <div className="p-4 space-y-3 bg-[#11131c]/90 flex-1 flex flex-col justify-between">
        
        {/* Main Stats: Audience */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 font-medium">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              당일 관객수
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              점유율 {movie.salesShare}%
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-xl font-extrabold text-white font-mono tabular-nums">
              {formatNumber(movie.audiCnt)} <span className="text-xs font-normal text-slate-400">명</span>
            </p>
            <p className="text-xs font-semibold text-amber-400 font-mono">
              누적 {formatNumber(movie.audiAcc)}명
            </p>
          </div>

          {/* Sales share bar indicator */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div 
              className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, parseFloat(movie.salesShare) || 10))}%` }}
            />
          </div>
        </div>

        {/* Secondary Info: Sales & Release date */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Calendar className="w-3 h-3 text-slate-500" />
            개봉: {movie.openDt || '미상'}
          </span>
          <span className="font-mono text-slate-300 font-medium">
            {formatKoreanCurrency(movie.salesAmt)}
          </span>
        </div>

        {/* Interactive Hover CTA Button */}
        <div className="pt-2 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-amber-300 transition-colors">
          <span className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            <span>상세 정보 보기 (팝업)</span>
          </span>
          <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>

      </div>
    </div>
  );
};
