import React from 'react';
import { Film, Calendar } from 'lucide-react';

interface NavbarProps {
  isDemoData?: boolean;
  selectedDateFormatted: string;
  onResetToYesterday: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDemoData,
  selectedDateFormatted,
  onResetToYesterday
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-[#0d0e12]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold">
            <Film className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <a href="#" className="text-lg font-bold tracking-tight text-white font-serif-brand flex items-center gap-2">
              KOBIS <span className="text-amber-400 font-sans font-semibold text-sm tracking-normal">박스오피스</span>
            </a>
            <p className="text-[11px] text-slate-400 hidden sm:block">영화진흥위원회 공식 OpenAPI 연동</p>
          </div>
        </div>

        {/* Zone 2: Navigation Links / Quick Actions */}
        <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={onResetToYesterday}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors text-xs py-1.5 px-3 rounded-lg bg-slate-800/50 border border-slate-700/50 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>어제자 순위</span>
          </button>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <span className="text-xs text-slate-400 hidden sm:inline">
            조회 일자: <strong className="text-slate-200 font-semibold">{selectedDateFormatted}</strong>
          </span>
        </nav>

        {/* Zone 3: Connection Status */}
        <div className="flex items-center gap-2">
          {!isDemoData ? (
            <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>실시간 연동</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>데모 모드</span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
