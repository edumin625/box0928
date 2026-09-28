import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Helper to get active API key from environment variable
function getEffectiveApiKey(): string {
  const envKey = process.env.KOBIS_API_KEY || process.env.VITE_KOBIS_API_KEY;
  if (envKey && envKey.trim().length > 0 && envKey !== 'YOUR_KOBIS_API_KEY') {
    return envKey.trim();
  }
  return '';
}

// Fallback Mock Box Office Data generator for smooth demo when no API key or invalid API key
function getMockDailyBoxOffice(targetDt: string) {
  // Format date readable
  const y = targetDt.substring(0, 4);
  const m = targetDt.substring(4, 6);
  const d = targetDt.substring(6, 8);

  return [
    {
      rnum: '1',
      rank: '1',
      rankInten: '0',
      rankOldAndNew: 'OLD',
      movieCd: '20248881',
      movieNm: '파묘 (Exhuma)',
      openDt: '2024-02-22',
      salesAmt: '1845210000',
      salesShare: '34.2',
      salesInten: '120500000',
      salesChange: '7.0',
      salesAcc: '115820450000',
      audiCnt: '182410',
      audiInten: '11200',
      audiChange: '6.5',
      audiAcc: '11912450',
      scrnCnt: '1850',
      showCnt: '7920'
    },
    {
      rnum: '2',
      rank: '2',
      rankInten: '1',
      rankOldAndNew: 'OLD',
      movieCd: '20248882',
      movieNm: '범죄도시4 (The RoundUp : Punishment)',
      openDt: '2024-04-24',
      salesAmt: '1420100000',
      salesShare: '26.3',
      salesInten: '85000000',
      salesChange: '6.4',
      salesAcc: '109820000000',
      audiCnt: '141020',
      audiInten: '8100',
      audiChange: '6.1',
      audiAcc: '11485000',
      scrnCnt: '1620',
      showCnt: '6850'
    },
    {
      rnum: '3',
      rank: '3',
      rankInten: '-1',
      rankOldAndNew: 'OLD',
      movieCd: '20248883',
      movieNm: '인사이드 아웃 2 (Inside Out 2)',
      openDt: '2024-06-12',
      salesAmt: '980450000',
      salesShare: '18.1',
      salesInten: '-25000000',
      salesChange: '-2.5',
      salesAcc: '86420000000',
      audiCnt: '98400',
      audiInten: '-2400',
      audiChange: '-2.4',
      audiAcc: '8792000',
      scrnCnt: '1350',
      showCnt: '5400'
    },
    {
      rnum: '4',
      rank: '4',
      rankInten: '0',
      rankOldAndNew: 'NEW',
      movieCd: '20248884',
      movieNm: '베테랑2 (I, THE EXECUTIONER)',
      openDt: '2024-09-13',
      salesAmt: '510200000',
      salesShare: '9.4',
      salesInten: '510200000',
      salesChange: '100',
      salesAcc: '510200000',
      audiCnt: '52100',
      audiInten: '52100',
      audiChange: '100',
      audiAcc: '52100',
      scrnCnt: '980',
      showCnt: '3800'
    },
    {
      rnum: '5',
      rank: '5',
      rankInten: '2',
      rankOldAndNew: 'OLD',
      movieCd: '20248885',
      movieNm: '듄: 파트2 (Dune: Part Two)',
      openDt: '2024-02-28',
      salesAmt: '280100000',
      salesShare: '5.2',
      salesInten: '42000000',
      salesChange: '17.6',
      salesAcc: '23410000000',
      audiCnt: '24150',
      audiInten: '3200',
      audiChange: '15.3',
      audiAcc: '2012000',
      scrnCnt: '520',
      showCnt: '1850'
    },
    {
      rnum: '6',
      rank: '6',
      rankInten: '-1',
      rankOldAndNew: 'OLD',
      movieCd: '20248886',
      movieNm: '퓨리오사: 매드맥스 사가',
      openDt: '2024-05-22',
      salesAmt: '175200000',
      salesShare: '3.2',
      salesInten: '-12000000',
      salesChange: '-6.4',
      salesAcc: '16120000000',
      audiCnt: '16800',
      audiInten: '-1100',
      audiChange: '-6.1',
      audiAcc: '1608000',
      scrnCnt: '410',
      showCnt: '1200'
    },
    {
      rnum: '7',
      rank: '7',
      rankInten: '1',
      rankOldAndNew: 'OLD',
      movieCd: '20248887',
      movieNm: '외계+인 2부',
      openDt: '2024-01-10',
      salesAmt: '112000000',
      salesShare: '2.1',
      salesInten: '8500000',
      salesChange: '8.2',
      salesAcc: '14200000000',
      audiCnt: '11200',
      audiInten: '850',
      audiChange: '8.2',
      audiAcc: '1430000',
      scrnCnt: '320',
      showCnt: '850'
    },
    {
      rnum: '8',
      rank: '8',
      rankInten: '-2',
      rankOldAndNew: 'OLD',
      movieCd: '20248888',
      movieNm: '위키드 (Wicked)',
      openDt: '2024-11-20',
      salesAmt: '95000000',
      salesShare: '1.8',
      salesInten: '-15000000',
      salesChange: '-13.6',
      salesAcc: '18500000000',
      audiCnt: '9200',
      audiInten: '-1400',
      audiChange: '-13.2',
      audiAcc: '1820000',
      scrnCnt: '280',
      showCnt: '620'
    },
    {
      rnum: '9',
      rank: '9',
      rankInten: '0',
      rankOldAndNew: 'OLD',
      movieCd: '20248889',
      movieNm: '글래디에이터 II',
      openDt: '2024-11-13',
      salesAmt: '72000000',
      salesShare: '1.3',
      salesInten: '1200000',
      salesChange: '1.7',
      salesAcc: '12400000000',
      audiCnt: '7100',
      audiInten: '100',
      audiChange: '1.4',
      audiAcc: '1210000',
      scrnCnt: '240',
      showCnt: '480'
    },
    {
      rnum: '10',
      rank: '10',
      rankInten: '0',
      rankOldAndNew: 'NEW',
      movieCd: '20248890',
      movieNm: '하얼빈 (Harbin)',
      openDt: '2024-12-25',
      salesAmt: '58000000',
      salesShare: '1.1',
      salesInten: '58000000',
      salesChange: '100',
      salesAcc: '58000000',
      audiCnt: '5900',
      audiInten: '5900',
      audiChange: '100',
      audiAcc: '5900',
      scrnCnt: '210',
      showCnt: '410'
    }
  ];
}

function getMockMovieInfo(movieCd: string) {
  const mockDatabase: Record<string, any> = {
    '20248881': {
      movieCd: '20248881',
      movieNm: '파묘',
      movieNmEn: 'Exhuma',
      showTm: '134',
      openDt: '20240222',
      typeNm: '장편',
      nationNm: '한국',
      genres: [{ genreNm: '미스터리' }, { genreNm: '공포(호러)' }],
      directors: [{ peopleNm: '장재현' }],
      actors: [
        { peopleNm: '최민식', cast: '상덕' },
        { peopleNm: '김고은', cast: '화림' },
        { peopleNm: '유해진', cast: '영근' },
        { peopleNm: '이도현', cast: '봉길' }
      ],
      showTypes: [{ showTypeGroupNm: '2D', showTypeNm: '디지털' }],
      companys: [
        { companyCd: '20161801', companyNm: '(주)쇼박스', companyPartNm: '배급사' },
        { companyCd: '20182902', companyNm: '엠씨엠씨', companyPartNm: '제작사' }
      ],
      audits: [{ auditNo: '2024-MF00123', watchGradeNm: '15세이상관람가' }],
      staffs: [{ peopleNm: '이모개', staffRoleNm: '촬영' }]
    },
    '20248882': {
      movieCd: '20248882',
      movieNm: '범죄도시4',
      movieNmEn: 'The RoundUp : Punishment',
      showTm: '109',
      openDt: '20240424',
      typeNm: '장편',
      nationNm: '한국',
      genres: [{ genreNm: '범죄' }, { genreNm: '액션' }],
      directors: [{ peopleNm: '허명행' }],
      actors: [
        { peopleNm: '마동석', cast: '마석도' },
        { peopleNm: '김무열', cast: '백창기' },
        { peopleNm: '박지환', cast: '장이수' },
        { peopleNm: '이동휘', cast: '장동철' }
      ],
      showTypes: [{ showTypeGroupNm: '2D', showTypeNm: '디지털' }, { showTypeGroupNm: 'IMAX', showTypeNm: 'IMAX 2D' }],
      companys: [
        { companyCd: '20110854', companyNm: '에이비오엔터테인먼트', companyPartNm: '배급사' },
        { companyCd: '20121112', companyNm: '빅펀치복싱클럽', companyPartNm: '제작사' }
      ],
      audits: [{ auditNo: '2024-MF00456', watchGradeNm: '15세이상관람가' }],
      staffs: [{ peopleNm: '남성준', staffRoleNm: '무술' }]
    },
    '20248883': {
      movieCd: '20248883',
      movieNm: '인사이드 아웃 2',
      movieNmEn: 'Inside Out 2',
      showTm: '96',
      openDt: '20240612',
      typeNm: '장편',
      nationNm: '미국',
      genres: [{ genreNm: '애니메이션' }, { genreNm: '코미디' }, { genreNm: '모험' }],
      directors: [{ peopleNm: '켈시 만' }],
      actors: [
        { peopleNm: '에이미 포엘러', cast: '기쁨이 (목소리)' },
        { peopleNm: '마야 호크', cast: '불안이 (목소리)' },
        { peopleNm: '켄싱턴 탈만', cast: '라일리 (목소리)' }
      ],
      showTypes: [{ showTypeGroupNm: '2D', showTypeNm: '디지털' }, { showTypeGroupNm: '3D', showTypeNm: '3D 디지털' }],
      companys: [
        { companyCd: '20100041', companyNm: '월트디즈니컴퍼니코리아(주)', companyPartNm: '배급사' }
      ],
      audits: [{ auditNo: '2024-MF00890', watchGradeNm: '전체관람가' }],
      staffs: []
    }
  };

  if (mockDatabase[movieCd]) {
    return mockDatabase[movieCd];
  }

  // Generic mock for any unrecognized movie code
  return {
    movieCd,
    movieNm: '영화 상세 정보',
    movieNmEn: 'Movie Information',
    showTm: '120',
    openDt: '20240101',
    typeNm: '장편',
    nationNm: '한국',
    genres: [{ genreNm: '드라마' }, { genreNm: '액션' }],
    directors: [{ peopleNm: '유명 감독' }],
    actors: [
      { peopleNm: '주연 배우 A', cast: '주인공' },
      { peopleNm: '주연 배우 B', cast: '동료' },
      { peopleNm: '조연 배우 C', cast: '조연' }
    ],
    showTypes: [{ showTypeGroupNm: '2D', showTypeNm: '디지털' }],
    companys: [
      { companyCd: '10001', companyNm: '주요 배급사', companyPartNm: '배급사' },
      { companyCd: '10002', companyNm: '대표 제작사', companyPartNm: '제작사' }
    ],
    audits: [{ auditNo: '2024-MF00999', watchGradeNm: '12세이상관람가' }],
    staffs: [{ peopleNm: '제작 스태프', staffRoleNm: '기획' }]
  };
}

// API Check Endpoint
app.get('/api/config', (req, res) => {
  const envKey = process.env.KOBIS_API_KEY || process.env.VITE_KOBIS_API_KEY;
  const hasEnvKey = !!(envKey && envKey.trim().length > 0 && envKey !== 'YOUR_KOBIS_API_KEY');
  res.json({ hasEnvKey });
});

// Daily Box Office API Endpoint
app.get('/api/boxoffice', async (req, res) => {
  const targetDt = (req.query.date as string) || '';
  const multiMovieYn = (req.query.multiMovieYn as string) || '';
  const repNationCd = (req.query.repNationCd as string) || '';

  if (!targetDt || targetDt.length !== 8) {
    return res.status(400).json({ error: '유효한 날짜(YYYYMMDD)가 필요합니다.' });
  }

  const apiKey = getEffectiveApiKey();

  if (!apiKey) {
    // Return fallback mock data with message
    return res.json({
      boxOfficeResult: {
        boxofficeType: '일별 박스오피스',
        showRange: `${targetDt}~${targetDt}`,
        dailyBoxOfficeList: getMockDailyBoxOffice(targetDt)
      },
      isDemoData: true,
      apiKeyStatus: 'NO_KEY',
      message: '환경변수에 KOBIS_API_KEY가 설정되지 않았습니다. 데모 데이터를 표시합니다.'
    });
  }

  try {
    let url = `https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${encodeURIComponent(
      apiKey
    )}&targetDt=${encodeURIComponent(targetDt)}`;

    if (multiMovieYn) url += `&multiMovieYn=${encodeURIComponent(multiMovieYn)}`;
    if (repNationCd) url += `&repNationCd=${encodeURIComponent(repNationCd)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.faultInfo) {
      return res.json({
        boxOfficeResult: {
          boxofficeType: '일별 박스오피스 (데모)',
          showRange: `${targetDt}~${targetDt}`,
          dailyBoxOfficeList: getMockDailyBoxOffice(targetDt)
        },
        isDemoData: true,
        apiKeyStatus: 'INVALID_KEY',
        message: `KOBIS API 오류: ${data.faultInfo.message || '환경변수 KOBIS_API_KEY가 유효하지 않습니다.'}`
      });
    }

    if (data.boxOfficeResult?.dailyBoxOfficeList) {
      return res.json({
        ...data,
        isDemoData: false,
        apiKeyStatus: 'VALID'
      });
    }

    res.json({
      boxOfficeResult: {
        boxofficeType: '일별 박스오피스 (데모)',
        showRange: `${targetDt}~${targetDt}`,
        dailyBoxOfficeList: getMockDailyBoxOffice(targetDt)
      },
      isDemoData: true,
      apiKeyStatus: 'NO_DATA',
      message: '해당 날짜에 대한 데이터를 찾을 수 없습니다.'
    });
  } catch (err: any) {
    console.error('KOBIS BoxOffice API proxy error:', err);
    res.json({
      boxOfficeResult: {
        boxofficeType: '일별 박스오피스 (데모)',
        showRange: `${targetDt}~${targetDt}`,
        dailyBoxOfficeList: getMockDailyBoxOffice(targetDt)
      },
      isDemoData: true,
      apiKeyStatus: 'FETCH_ERROR',
      message: 'KOBIS 서버 연결 중 오류가 발생했습니다.'
    });
  }
});

// Movie Details API Endpoint
app.get('/api/movie-info', async (req, res) => {
  const movieCd = (req.query.movieCd as string) || '';

  if (!movieCd) {
    return res.status(400).json({ error: '영화 코드가 필요합니다.' });
  }

  const apiKey = getEffectiveApiKey();

  if (!apiKey) {
    return res.json({
      movieInfoResult: {
        movieInfo: getMockMovieInfo(movieCd),
        source: 'KOBIS'
      },
      isDemoData: true
    });
  }

  try {
    const url = `https://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${encodeURIComponent(
      apiKey
    )}&movieCd=${encodeURIComponent(movieCd)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.movieInfoResult?.movieInfo) {
      return res.json({
        ...data,
        isDemoData: false
      });
    }

    // Fallback if KOBIS returns fault or empty
    return res.json({
      movieInfoResult: {
        movieInfo: getMockMovieInfo(movieCd),
        source: 'KOBIS'
      },
      isDemoData: true,
      message: data.faultInfo?.message || 'KOBIS 상세 정보 조회 실패'
    });
  } catch (err: any) {
    console.error('KOBIS MovieInfo API proxy error:', err);
    return res.json({
      movieInfoResult: {
        movieInfo: getMockMovieInfo(movieCd),
        source: 'KOBIS'
      },
      isDemoData: true
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await vite.transformIndexHtml(url, `
          <!doctype html>
          <html lang="ko">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>일별 박스오피스 & 영화 상세정보 - KOBIS</title>
              <meta name="description" content="영화진흥위원회 KOBIS Open API를 이용한 일별 영화 박스오피스 순위 및 상세 영화 정보 조회" />
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Noto+Sans+KR:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
            </head>
            <body class="bg-[#0b0c10] text-slate-100 antialiased font-sans selection:bg-amber-500/30 selection:text-amber-200">
              <div id="root"></div>
              <script type="module" src="/src/main.tsx"></script>
            </body>
          </html>
        `);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
