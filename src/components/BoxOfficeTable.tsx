import React from 'react';
import { TrendingUp, TrendingDown, Minus, Sparkles, ChevronRight } from 'lucide-react';
import { DailyBoxOffice } from '../types/kobis';
import { formatNumber, formatKoreanCurrency } from '../utils/date';

interface BoxOfficeTableProps {
  boxOfficeList: DailyBoxOffice[];
  onSelectMovie: (movieCd: string, movieItem: DailyBoxOffice) => void;
}

export const BoxOfficeTable: React.FC<BoxOfficeTableProps> = ({
  boxOfficeList,
  onSelectMovie
}) => {
  if (!boxOfficeList || boxOfficeList.length === 0) return null;

  return (
    <div className="w-full glass-panel bg-slate-900/80 border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-200 border-collapse">
          <thead>
            <tr className="bg-[#0f1118] border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th scope="col" className="py-4 px-4 text-center w-16">순위</th>
              <th scope="col" className="py-4 px-4">영화명</th>
              <th scope="col" className="py-4 px-4">개봉일</th>
              <th scope="col" className="py-4 px-4 text-right">당일 관객수</th>
              <th scope="col" className="py-4 px-4 text-right">누적 관객수</th>
              <th scope="col" className="py-4 px-4 text-right">당일 매출액</th>
              <th scope="col" className="py-4 px-4 text-right">매출 점유율</th>
              <th scope="col" className="py-4 px-4 text-center w-28">상세보기</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {boxOfficeList.map((movie) => {
              const rankNum = parseInt(movie.rank, 10);
              const inten = parseInt(movie.rankInten, 10);

              return (
                <tr
                  key={movie.movieCd}
                  onClick={() => onSelectMovie(movie.movieCd, movie)}
                  className="hover:bg-slate-800/60 transition-colors cursor-pointer group"
                >
                  {/* Rank Column */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className={`w-7 h-7 rounded-lg font-extrabold flex items-center justify-center text-sm font-mono ${
                        rankNum === 1
                          ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/30'
                          : rankNum === 2
                          ? 'bg-slate-300 text-slate-950'
                          : rankNum === 3
                          ? 'bg-amber-800 text-amber-100 border border-amber-600/50'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {movie.rank}
                      </span>

                      {/* Rank Change */}
                      {movie.rankOldAndNew === 'NEW' ? (
                        <span className="text-[10px] font-extrabold text-rose-400 flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" /> NEW
                        </span>
                      ) : inten > 0 ? (
                        <span className="text-[10px] font-bold text-emerald-400 font-mono">
                          ▲{inten}
                        </span>
                      ) : inten < 0 ? (
                        <span className="text-[10px] font-bold text-rose-400 font-mono">
                          ▼{Math.abs(inten)}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">-</span>
                      )}
                    </div>
                  </td>

                  {/* Movie Name */}
                  <td className="py-4 px-4 font-bold text-white group-hover:text-amber-300 transition-colors">
                    <div className="space-y-0.5">
                      <p className="text-base font-serif-brand">{movie.movieNm}</p>
                      <p className="text-[11px] font-normal text-slate-400">
                        스크린수 {formatNumber(movie.scrnCnt)}개 · 상영회수 {formatNumber(movie.showCnt)}회
                      </p>
                    </div>
                  </td>

                  {/* Release Date */}
                  <td className="py-4 px-4 text-xs font-mono text-slate-400 whitespace-nowrap">
                    {movie.openDt || '미상'}
                  </td>

                  {/* Daily Audience */}
                  <td className="py-4 px-4 text-right font-mono font-bold text-white text-base tabular-nums whitespace-nowrap">
                    {formatNumber(movie.audiCnt)} <span className="text-xs font-normal text-slate-400">명</span>
                  </td>

                  {/* Cumulative Audience */}
                  <td className="py-4 px-4 text-right font-mono font-semibold text-amber-400 text-sm tabular-nums whitespace-nowrap">
                    {formatNumber(movie.audiAcc)} 명
                  </td>

                  {/* Daily Sales Gross */}
                  <td className="py-4 px-4 text-right font-mono text-slate-300 text-xs tabular-nums whitespace-nowrap">
                    {formatKoreanCurrency(movie.salesAmt)}
                  </td>

                  {/* Sales Share */}
                  <td className="py-4 px-4 text-right font-mono text-xs text-slate-400 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-semibold">
                      {movie.salesShare}%
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 text-center">
                    <button className="px-3 py-1.5 text-xs font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-colors inline-flex items-center gap-1 cursor-pointer">
                      <span>팝업</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
