export interface DailyBoxOffice {
  rnum: string;
  rank: string;
  rankInten: string;
  rankOldAndNew: 'OLD' | 'NEW';
  movieCd: string;
  movieNm: string;
  openDt: string;
  salesAmt: string;
  salesShare: string;
  salesInten: string;
  salesChange: string;
  salesAcc: string;
  audiCnt: string;
  audiInten: string;
  audiChange: string;
  audiAcc: string;
  scrnCnt: string;
  showCnt: string;
}

export interface BoxOfficeResponse {
  boxOfficeResult?: {
    boxofficeType: string;
    showRange: string;
    dailyBoxOfficeList: DailyBoxOffice[];
  };
  isDemoData?: boolean;
  apiKeyStatus?: 'VALID' | 'NO_KEY' | 'INVALID_KEY' | 'NO_DATA' | 'FETCH_ERROR';
  message?: string;
}

export interface MovieGenre {
  genreNm: string;
}

export interface MovieDirector {
  peopleNm: string;
  peopleNmEn?: string;
}

export interface MovieActor {
  peopleNm: string;
  peopleNmEn?: string;
  cast?: string;
  castEn?: string;
}

export interface MovieCompany {
  companyCd: string;
  companyNm: string;
  companyNmEn?: string;
  companyPartNm: string;
}

export interface MovieAudit {
  auditNo: string;
  watchGradeNm: string;
}

export interface MovieStaff {
  peopleNm: string;
  peopleNmEn?: string;
  staffRoleNm: string;
}

export interface MovieInfo {
  movieCd: string;
  movieNm: string;
  movieNmEn: string;
  movieNmOg?: string;
  showTm: string;
  openDt: string;
  typeNm: string;
  nationNm: string;
  genres: MovieGenre[];
  directors: MovieDirector[];
  actors: MovieActor[];
  showTypes?: { showTypeGroupNm: string; showTypeNm: string }[];
  companys: MovieCompany[];
  audits: MovieAudit[];
  staffs: MovieStaff[];
}

export interface MovieInfoResponse {
  movieInfoResult?: {
    movieInfo: MovieInfo;
    source?: string;
  };
  isDemoData?: boolean;
  message?: string;
}
