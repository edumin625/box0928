/**
 * Poster generation & styling helper for movie cards
 */

interface PosterStyle {
  gradient: string;
  accentColor: string;
  badgeBg: string;
  tagline: string;
}

const posterStyles: PosterStyle[] = [
  {
    gradient: 'from-amber-900/80 via-zinc-900 to-black',
    accentColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    tagline: 'CINEMATIC BLOCKBUSTER'
  },
  {
    gradient: 'from-purple-950/80 via-slate-900 to-zinc-950',
    accentColor: 'text-purple-400',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    tagline: 'MYSTERY & THRILLER'
  },
  {
    gradient: 'from-rose-950/80 via-neutral-900 to-zinc-950',
    accentColor: 'text-rose-400',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    tagline: 'ACTION & CRIME'
  },
  {
    gradient: 'from-cyan-950/80 via-slate-900 to-zinc-950',
    accentColor: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    tagline: 'SCI-FI & FANTASY'
  },
  {
    gradient: 'from-emerald-950/80 via-slate-900 to-zinc-950',
    accentColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    tagline: 'DRAMA & STORIES'
  },
  {
    gradient: 'from-blue-950/80 via-zinc-900 to-neutral-950',
    accentColor: 'text-blue-400',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    tagline: 'ANIMATION & FAMILY'
  }
];

export function getPosterStyle(movieCd: string, movieNm: string): PosterStyle {
  // Hash movie code to get deterministic index
  let hash = 0;
  const str = movieCd + movieNm;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % posterStyles.length;
  return posterStyles[index];
}
