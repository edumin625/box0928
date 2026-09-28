import React, { useEffect, useState } from 'react';
import { X, Calendar, Clock, Globe, Shield, TrendingUp, AlertCircle } from 'lucide-react';
import { DailyBoxOffice, MovieInfo } from '../types/kobis';
import { formatKoreanDate, formatNumber, formatKoreanCurrency } from '../utils/date';
import { getPosterStyle } from '../utils/poster';

interface MovieModalProps {
  movieCd: string | null;
  boxOfficeItem?: DailyBoxOffice | null;
  targetDt: string;
  onClose: () => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({
  movieCd,
  boxOfficeItem,
  targetDt,
  onClose
}) => {
  const [movieInfo, setMovieInfo] = useState<MovieInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'cast' | 'boxoffice'>('info');

  useEffect(() => {
    if (!movieCd) {
      setMovieInfo(null);
      return;
    }

    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `/api/movie-info?movieCd=${encodeURIComponent(movieCd)}`;
        const res = await fetch(url);
        const contentType = res.headers.get('content-type') || '';

        if (!res.ok || !contentType.includes('application/json')) {
          setError('상세 정보를 불러올 수 없거나 서버 응답 형식이 올바르지 않습니다.');
          return;
        }

        const data = await res.json();

        if (data.movieInfoResult?.movieInfo) {
          setMovieInfo(data.movieInfoResult.movieInfo);
        } else {
          setError(data.message || '영화 상세 정보를 가져올 수 없습니다.');
        }
      } catch (err) {
        setError('서버 연결 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieCd]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!movieCd) return null;

  const style = getPosterStyle(movieCd, boxOfficeItem?.movieNm || movieInfo?.movieNm || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl glass-panel bg-[#12141d] border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Scrim Backdrop */}
        <div className={`relative h-44 sm:h-52 bg-gradient-to-r ${style.gradient} p-6 flex flex-col justify-end shrink-0 border-b border-slate-800`}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-slate-300 hover:text-white hover:bg-black/80 transition-colors border border-white/10 cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${style.badgeBg}`}>
                  {style.tagline}
                </span>
                {boxOfficeItem && (
                  <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
                    박스오피스 {boxOfficeItem.rank}위
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif-brand tracking-tight">
                {movieInfo?.movieNm || boxOfficeItem?.movieNm || '영화 상세 정보'}
              </h2>
              {(movieInfo?.movieNmEn || movieInfo?.movieNmOg) && (
                <p className="text-xs sm:text-sm text-slate-400 font-sans">
                  {movieInfo.movieNmEn} {movieInfo.movieNmOg && `(${movieInfo.movieNmOg})`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-1 p-2 bg-[#0d0f17] border-b border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors text-center cursor-pointer ${
              activeTab === 'info'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            기초 영화 정보
          </button>
          <button
            onClick={() => setActiveTab('cast')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors text-center cursor-pointer ${
              activeTab === 'cast'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            감독 & 출연진 ({movieInfo?.actors?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('boxoffice')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors text-center cursor-pointer ${
              activeTab === 'boxoffice'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            박스오피스 성과
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-slate-400">영화 상세 정보를 불러오는 중입니다...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
              <p className="text-sm text-slate-300">{error}</p>
            </div>
          ) : movieInfo ? (
            <>
              {/* TAB 1: INFO */}
              {activeTab === 'info' && (
                <div className="space-y-6">
                  {/* Quick Metadata Badge Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>개봉일</span>
                      </div>
                      <p className="text-sm font-semibold text-white font-mono">
                        {movieInfo.openDt ? `${movieInfo.openDt.slice(0, 4)}-${movieInfo.openDt.slice(4, 6)}-${movieInfo.openDt.slice(6, 8)}` : '미상'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>상영 시간</span>
                      </div>
                      <p className="text-sm font-semibold text-white font-mono">
                        {movieInfo.showTm ? `${movieInfo.showTm}분` : '미상'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Globe className="w-3.5 h-3.5 text-amber-400" />
                        <span>제작 국가</span>
                      </div>
                      <p className="text-sm font-semibold text-white">
                        {movieInfo.nationNm || '한국'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                        <span>관람 등급</span>
                      </div>
                      <p className="text-sm font-semibold text-amber-300 truncate">
                        {movieInfo.audits?.[0]?.watchGradeNm || '전체관람가'}
                      </p>
                    </div>
                  </div>

                  {/* Genres & Types */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">장르 및 구분</h4>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                        {movieInfo.typeNm || '장편'}
                      </span>
                      {movieInfo.genres?.map((g, idx) => (
                        <span key={idx} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          {g.genreNm}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Directors */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">감독</h4>
                    <div className="flex flex-wrap gap-2">
                      {movieInfo.directors?.length > 0 ? (
                        movieInfo.directors.map((dir, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                            <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 text-xs font-bold">
                              {dir.peopleNm[0]}
                            </div>
                            <span className="text-sm font-semibold text-white">{dir.peopleNm}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500">등록된 감독 정보가 없습니다.</p>
                      )}
                    </div>
                  </div>

                  {/* Production & Distribution Companies */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">제작사 및 배급사</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {movieInfo.companys?.map((comp, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                          <span className="text-xs text-slate-300 font-medium">{comp.companyNm}</span>
                          <span className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                            {comp.companyPartNm}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CAST */}
              {activeTab === 'cast' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">주요 출연진</h4>
                  {movieInfo.actors?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {movieInfo.actors.map((actor, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-slate-800 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold text-sm">
                              {actor.peopleNm[0]}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{actor.peopleNm}</p>
                              {actor.cast && (
                                <p className="text-xs text-amber-400/90 font-sans">
                                  배역: {actor.cast}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 py-6 text-center">등록된 출연 배우 정보가 없습니다.</p>
                  )}
                </div>
              )}

              {/* TAB 3: BOX OFFICE */}
              {activeTab === 'boxoffice' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>조회 일자: <strong>{formatKoreanDate(targetDt)}</strong> 기준 데이터</span>
                  </div>

                  {boxOfficeItem ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-xs text-slate-400">당일 관객수</span>
                        <p className="text-xl font-bold text-white font-mono tabular-nums">
                          {formatNumber(boxOfficeItem.audiCnt)} 명
                        </p>
                        <p className="text-[11px] text-slate-500">
                          전일 대비: {parseInt(boxOfficeItem.audiInten, 10) >= 0 ? '+' : ''}{formatNumber(boxOfficeItem.audiInten)}명 ({boxOfficeItem.audiChange}%)
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-xs text-slate-400">누적 관객수</span>
                        <p className="text-xl font-bold text-amber-400 font-mono tabular-nums">
                          {formatNumber(boxOfficeItem.audiAcc)} 명
                        </p>
                        <p className="text-[11px] text-slate-500">
                          개봉일: {boxOfficeItem.openDt || '미상'}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-xs text-slate-400">당일 매출액</span>
                        <p className="text-lg font-bold text-white font-mono tabular-nums">
                          {formatKoreanCurrency(boxOfficeItem.salesAmt)}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          매출 점유율: {boxOfficeItem.salesShare}%
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-xs text-slate-400">누적 매출액</span>
                        <p className="text-lg font-bold text-slate-200 font-mono tabular-nums">
                          {formatKoreanCurrency(boxOfficeItem.salesAcc)}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          상영 스크린수: {formatNumber(boxOfficeItem.scrnCnt)}개
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-xl bg-slate-900 text-center text-xs text-slate-400">
                      선택한 날짜의 박스오피스 기록을 바로 확인할 수 있습니다.
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0d0f17] border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-mono">
            KOBIS 영화코드: <span className="text-slate-300">{movieCd}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
