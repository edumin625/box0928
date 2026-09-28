import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutGrid, 
  List, 
  Search, 
  AlertCircle, 
  RefreshCw, 
  Film, 
  ExternalLink 
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroHeader } from './components/HeroHeader';
import { StatsBar } from './components/StatsBar';
import { BoxOfficeGridCard } from './components/BoxOfficeGridCard';
import { BoxOfficeTable } from './components/BoxOfficeTable';
import { MovieModal } from './components/MovieModal';
import { DailyBoxOffice, BoxOfficeResponse } from './types/kobis';
import { 
  getYesterday, 
  formatDateToInput, 
  formatInputToTargetDt, 
  formatKoreanDate, 
  isBeforeToday 
} from './utils/date';

export default function App() {
  // Date State - Defaults to Yesterday (today's boxoffice is not published yet)
  const [selectedInputDate, setSelectedInputDate] = useState<string>(() => {
    return formatDateToInput(getYesterday());
  });

  // Filters State
  const [filterNation, setFilterNation] = useState<'ALL' | 'K' | 'F'>('ALL');
  const [filterMulti, setFilterMulti] = useState<'ALL' | 'COMMERCIAL' | 'INDEPENDENT'>('ALL');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');

  // Data State
  const [boxOfficeData, setBoxOfficeData] = useState<BoxOfficeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal Pop-up State
  const [selectedMovieCd, setSelectedMovieCd] = useState<string | null>(null);
  const [selectedBoxOfficeItem, setSelectedBoxOfficeItem] = useState<DailyBoxOffice | null>(null);

  // Target Date String YYYYMMDD
  const targetDt = useMemo(() => {
    return formatInputToTargetDt(selectedInputDate);
  }, [selectedInputDate]);

  // Fetch Daily Box Office Data using environment variable API key on backend
  const fetchBoxOffice = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `/api/boxoffice?date=${targetDt}`;
      if (filterNation === 'K') url += '&repNationCd=K';
      if (filterNation === 'F') url += '&repNationCd=F';
      if (filterMulti === 'COMMERCIAL') url += '&multiMovieYn=N';
      if (filterMulti === 'INDEPENDENT') url += '&multiMovieYn=Y';

      const response = await fetch(url);
      const contentType = response.headers.get('content-type') || '';

      if (!response.ok || !contentType.includes('application/json')) {
        const text = await response.text();
        console.warn('Non-JSON response received:', text.substring(0, 100));
        setError('서버 응답이 올바른 JSON 형식이 아닙니다. 백엔드 서버를 확인해 주세요.');
        return;
      }

      const data: BoxOfficeResponse = await response.json();
      setBoxOfficeData(data);
    } catch (err) {
      console.error('fetchBoxOffice error:', err);
      setError('박스오피스 데이터를 불러오는 도중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetDt) {
      fetchBoxOffice();
    }
  }, [targetDt, filterNation, filterMulti]);

  // Filter Box Office List by search keyword
  const rawList = boxOfficeData?.boxOfficeResult?.dailyBoxOfficeList || [];
  const filteredList = useMemo(() => {
    if (!searchKeyword.trim()) return rawList;
    const kw = searchKeyword.trim().toLowerCase();
    return rawList.filter((m) => m.movieNm.toLowerCase().includes(kw));
  }, [rawList, searchKeyword]);

  // Reset date to yesterday
  const handleResetToYesterday = () => {
    const yest = formatDateToInput(getYesterday());
    setSelectedInputDate(yest);
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* 1. Header Navigation Bar */}
      <Navbar
        isDemoData={boxOfficeData?.isDemoData}
        selectedDateFormatted={formatKoreanDate(targetDt)}
        onResetToYesterday={handleResetToYesterday}
      />

      {/* 2. Hero Header & Interactive Date Controls */}
      <HeroHeader
        selectedInputDate={selectedInputDate}
        onDateChange={(newDate) => {
          if (isBeforeToday(newDate)) {
            setSelectedInputDate(newDate);
          }
        }}
        targetDt={targetDt}
        filterNation={filterNation}
        onFilterNationChange={setFilterNation}
        filterMulti={filterMulti}
        onFilterMultiChange={setFilterMulti}
      />

      {/* 3. Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Banner Alert if Env Key is missing or error */}
        {boxOfficeData?.isDemoData && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-center justify-between gap-3 shadow-lg">
            <div className="text-xs space-y-0.5">
              <p className="font-bold text-amber-300">
                {boxOfficeData.message || '현재 데모 박스오피스 데이터를 확인하고 계십니다.'}
              </p>
              <p className="text-slate-300">
                AI Studio 환경변수에 <code className="text-amber-300 font-mono">KOBIS_API_KEY</code>를 등록하시면 실시간 KOBIS 최신 흥행 데이터로 자동 전환됩니다.
              </p>
            </div>
          </div>
        )}

        {/* Summary Metric Stats Ribbon */}
        {!loading && !error && (
          <StatsBar boxOfficeList={rawList} />
        )}

        {/* View Switcher & Search Bar Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif-brand flex items-center gap-2">
              <span>일일 순위 목록</span>
              <span className="text-xs font-sans font-normal text-slate-400">
                ({filteredList.length}편)
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="목록 내 영화 제목 검색..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80 transition-all"
              />
            </div>

            {/* View Mode Toggle Buttons */}
            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
              <button
                onClick={() => setViewMode('GRID')}
                className={`p-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'GRID'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="포스터 카드형 (Grid)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                className={`p-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'TABLE'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="목록 리스트형 (Table)"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Content Area: Loading / Error / Empty / Data Display */}
        {loading ? (
          <div className="glass-panel p-16 rounded-2xl bg-slate-900/60 border-slate-800 text-center space-y-4 my-8">
            <div className="w-12 h-12 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <p className="text-base font-bold text-white">
                {formatKoreanDate(targetDt)} 일별 박스오피스를 조회 중입니다
              </p>
              <p className="text-xs text-slate-400">
                영화진흥위원회 KOBIS API 서버로부터 실시간 흥행 데이터를 불러오고 있습니다...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="glass-panel p-12 rounded-2xl bg-slate-900/80 border-rose-500/30 text-center space-y-4 my-8">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
            <div className="space-y-1 max-w-md mx-auto">
              <p className="text-base font-bold text-white">데이터 로드 실패</p>
              <p className="text-xs text-slate-400">{error}</p>
            </div>
            <button
              onClick={fetchBoxOffice}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>다시 시도하기</span>
            </button>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl bg-slate-900/60 border-slate-800 text-center space-y-3 my-8">
            <Film className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-base font-bold text-slate-300">조회된 박스오피스 영화가 없습니다.</p>
            <p className="text-xs text-slate-500">
              검색어나 조건 필터를 변경하거나 다른 날짜를 선택해 보세요.
            </p>
          </div>
        ) : (
          <>
            {viewMode === 'GRID' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredList.map((movie) => (
                  <BoxOfficeGridCard
                    key={movie.movieCd}
                    movie={movie}
                    onSelectMovie={(code, item) => {
                      setSelectedMovieCd(code);
                      setSelectedBoxOfficeItem(item);
                    }}
                  />
                ))}
              </div>
            ) : (
              <BoxOfficeTable
                boxOfficeList={filteredList}
                onSelectMovie={(code, item) => {
                  setSelectedMovieCd(code);
                  setSelectedBoxOfficeItem(item);
                }}
              />
            )}
          </>
        )}

      </main>

      {/* 4. Movie Detail Modal Pop-up */}
      <MovieModal
        movieCd={selectedMovieCd}
        boxOfficeItem={selectedBoxOfficeItem}
        targetDt={targetDt}
        onClose={() => {
          setSelectedMovieCd(null);
          setSelectedBoxOfficeItem(null);
        }}
      />

      {/* 5. Footer */}
      <footer className="mt-16 border-t border-slate-800 bg-[#0a0b0e] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-bold text-slate-400">
              영화진흥위원회 KOBIS Open API 박스오피스 서비스
            </p>
            <p className="text-[11px] text-slate-500">
              본 서비스는 KOBIS(Korean Box Office Information System) 오픈 API를 기반으로 작성되었습니다.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="https://www.kobis.or.kr/kobisopenapi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <span>KOBIS API 포털</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
