'use client';

import React from 'react';

interface PartyInfo {
  name: string;
  short: string;
  color: string;
  bgLight: string;
  bgDark: string;
  textLight: string;
  textDark: string;
  borderColor: string;
  icon: (size?: number) => React.ReactNode;
}

const PARTIES: Record<string, PartyInfo> = {
  PT: {
    name: 'Partido dos Trabalhadores',
    short: 'PT',
    color: '#CC0000',
    bgLight: 'rgba(204, 0, 0, 0.08)',
    bgDark: 'rgba(204, 0, 0, 0.16)',
    textLight: '#b91c1c',
    textDark: '#f87171',
    borderColor: 'rgba(204, 0, 0, 0.28)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path
          d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7.1-6.2-3.7-6.2 3.7 1.6-7.1-5.4-4.7 7.1-.6L12 2z"
          fill="#CC0000"
        />
        <text
          x="12"
          y="15"
          textAnchor="middle"
          fontSize="6.5"
          fontWeight="900"
          fill="#ffffff"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          PT
        </text>
      </svg>
    ),
  },
  PL: {
    name: 'Partido Liberal',
    short: 'PL',
    color: '#002776',
    bgLight: 'rgba(0, 39, 118, 0.08)',
    bgDark: 'rgba(0, 39, 118, 0.18)',
    textLight: '#1d4ed8',
    textDark: '#60a5fa',
    borderColor: 'rgba(0, 39, 118, 0.28)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect width="24" height="24" rx="12" fill="#002776" />
        <path d="M4 14c4-3 12-3 16 0" stroke="#FFCC00" strokeWidth="2.5" strokeLinecap="round" />
        <text
          x="12"
          y="11.5"
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="900"
          fill="#FFFFFF"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          PL
        </text>
      </svg>
    ),
  },
  UNIÃO: {
    name: 'União Brasil',
    short: 'UNIÃO',
    color: '#002B49',
    bgLight: 'rgba(0, 43, 73, 0.08)',
    bgDark: 'rgba(0, 43, 73, 0.18)',
    textLight: '#0369a1',
    textDark: '#38bdf8',
    borderColor: 'rgba(0, 43, 73, 0.28)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect width="24" height="24" rx="12" fill="#002B49" />
        <path d="M6 16c2-6 8-8 12-6" stroke="#FF6600" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="16" cy="9" r="2.5" fill="#FFCC00" />
      </svg>
    ),
  },
  UNIAO: {
    name: 'União Brasil',
    short: 'UNIÃO',
    color: '#002B49',
    bgLight: 'rgba(0, 43, 73, 0.08)',
    bgDark: 'rgba(0, 43, 73, 0.18)',
    textLight: '#0369a1',
    textDark: '#38bdf8',
    borderColor: 'rgba(0, 43, 73, 0.28)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect width="24" height="24" rx="12" fill="#002B49" />
        <path d="M6 16c2-6 8-8 12-6" stroke="#FF6600" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="16" cy="9" r="2.5" fill="#FFCC00" />
      </svg>
    ),
  },
  PSD: {
    name: 'Partido Social Democrático',
    short: 'PSD',
    color: '#005CAA',
    bgLight: 'rgba(0, 92, 170, 0.08)',
    bgDark: 'rgba(0, 92, 170, 0.18)',
    textLight: '#0284c7',
    textDark: '#38bdf8',
    borderColor: 'rgba(0, 92, 170, 0.28)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect width="24" height="24" rx="12" fill="#005CAA" />
        <path d="M5 12h14" stroke="#FDB813" strokeWidth="3" strokeLinecap="round" />
        <circle cx="12" cy="7" r="2" fill="#FDB813" />
      </svg>
    ),
  },
  MDB: {
    name: 'Movimento Democrático Brasileiro',
    short: 'MDB',
    color: '#008000',
    bgLight: 'rgba(0, 128, 0, 0.08)',
    bgDark: 'rgba(0, 128, 0, 0.18)',
    textLight: '#15803d',
    textDark: '#4ade80',
    borderColor: 'rgba(0, 128, 0, 0.28)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect width="24" height="24" rx="12" fill="#008000" />
        <path d="M8 17l4-10 4 10" stroke="#FFCC00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 7v7" stroke="#E52320" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  PP: {
    name: 'Progressistas',
    short: 'PP',
    color: '#005A9C',
    bgLight: 'rgba(0, 90, 156, 0.08)',
    bgDark: 'rgba(0, 90, 156, 0.18)',
    textLight: '#2563eb',
    textDark: '#60a5fa',
    borderColor: 'rgba(0, 90, 156, 0.28)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect width="24" height="24" rx="12" fill="#005A9C" />
        <path d="M7 16l5-8 5 8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8l4 6" stroke="#E30613" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  REPUBLICANOS: {
    name: 'Republicanos',
    short: 'REP',
    color: '#0C2340',
    bgLight: 'rgba(12, 35, 64, 0.08)',
    bgDark: 'rgba(12, 35, 64, 0.18)',
    textLight: '#1e3a8a',
    textDark: '#93c5fd',
    borderColor: 'rgba(12, 35, 64, 0.28)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect width="24" height="24" rx="12" fill="#0C2340" />
        <path d="M12 4l6 4v6c0 4-6 6-6 6s-6-2-6-6V8l6-4z" fill="#00A859" opacity="0.9" />
        <circle cx="12" cy="11" r="2" fill="#FFFFFF" />
      </svg>
    ),
  },
  PSDB: {
    name: 'Partido da Social Democracia Brasileira',
    short: 'PSDB',
    color: '#004A97',
    bgLight: 'rgba(0, 74, 151, 0.08)',
    bgDark: 'rgba(0, 74, 151, 0.18)',
    textLight: '#1d4ed8',
    textDark: '#60a5fa',
    borderColor: 'rgba(0, 74, 151, 0.28)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect width="24" height="24" rx="12" fill="#004A97" />
        <path d="M7 15c3-5 9-6 13-3" stroke="#FFD100" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="9" cy="10" r="2.5" fill="#FFD100" />
      </svg>
    ),
  },
  PSOL: {
    name: 'Partido Socialismo e Liberdade',
    short: 'PSOL',
    color: '#D97706',
    bgLight: 'rgba(245, 158, 11, 0.1)',
    bgDark: 'rgba(245, 158, 11, 0.2)',
    textLight: '#b45309',
    textDark: '#fbbf24',
    borderColor: 'rgba(245, 158, 11, 0.32)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <circle cx="12" cy="12" r="6" fill="#F59E0B" />
        <path
          d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.36-6.36l-1.41 1.41M7.05 16.95l-1.41 1.41m12.72 0l-1.41-1.41M7.05 7.05L5.64 5.64"
          stroke="#E52320"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  NOVO: {
    name: 'Partido Novo',
    short: 'NOVO',
    color: '#FF5E00',
    bgLight: 'rgba(255, 94, 0, 0.1)',
    bgDark: 'rgba(255, 94, 0, 0.2)',
    textLight: '#c2410c',
    textDark: '#fb923c',
    borderColor: 'rgba(255, 94, 0, 0.32)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect width="24" height="24" rx="6" fill="#FF5E00" />
        <path d="M7 17V7l10 10V7" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  PDT: {
    name: 'Partido Democrático Trabalhista',
    short: 'PDT',
    color: '#C4122D',
    bgLight: 'rgba(196, 18, 45, 0.08)',
    bgDark: 'rgba(196, 18, 45, 0.18)',
    textLight: '#b91c1c',
    textDark: '#f87171',
    borderColor: 'rgba(196, 18, 45, 0.28)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect width="24" height="24" rx="12" fill="#C4122D" />
        <path d="M12 7c-2 2-2 5 0 7 2-2 2-5 0-7z" fill="#FFFFFF" />
        <path d="M12 14v4" stroke="#008000" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  PSB: {
    name: 'Partido Socialista Brasileiro',
    short: 'PSB',
    color: '#E2001A',
    bgLight: 'rgba(226, 0, 26, 0.08)',
    bgDark: 'rgba(226, 0, 26, 0.18)',
    textLight: '#b91c1c',
    textDark: '#f87171',
    borderColor: 'rgba(226, 0, 26, 0.28)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect width="24" height="24" rx="12" fill="#E2001A" />
        <path d="M6 14c3-1 6-4 8-8 1 3 2 6 4 8-4-1-8 0-12 0z" fill="#FFFFFF" />
      </svg>
    ),
  },
  PODE: {
    name: 'Podemos',
    short: 'PODE',
    color: '#5F259F',
    bgLight: 'rgba(95, 37, 159, 0.08)',
    bgDark: 'rgba(95, 37, 159, 0.18)',
    textLight: '#6d28d9',
    textDark: '#a78bfa',
    borderColor: 'rgba(95, 37, 159, 0.28)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect width="24" height="24" rx="12" fill="#5F259F" />
        <circle cx="12" cy="12" r="5" stroke="#00A859" strokeWidth="2" />
        <circle cx="12" cy="12" r="2" fill="#FFFFFF" />
      </svg>
    ),
  },
  PODEMOS: {
    name: 'Podemos',
    short: 'PODE',
    color: '#5F259F',
    bgLight: 'rgba(95, 37, 159, 0.08)',
    bgDark: 'rgba(95, 37, 159, 0.18)',
    textLight: '#6d28d9',
    textDark: '#a78bfa',
    borderColor: 'rgba(95, 37, 159, 0.28)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect width="24" height="24" rx="12" fill="#5F259F" />
        <circle cx="12" cy="12" r="5" stroke="#00A859" strokeWidth="2" />
        <circle cx="12" cy="12" r="2" fill="#FFFFFF" />
      </svg>
    ),
  },
  PV: {
    name: 'Partido Verde',
    short: 'PV',
    color: '#00843D',
    bgLight: 'rgba(0, 132, 61, 0.08)',
    bgDark: 'rgba(0, 132, 61, 0.18)',
    textLight: '#15803d',
    textDark: '#4ade80',
    borderColor: 'rgba(0, 132, 61, 0.28)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect width="24" height="24" rx="12" fill="#00843D" />
        <path d="M12 6c3 3 5 7 2 11-2 2-6 2-7-1s1-7 5-10z" fill="#FFFFFF" />
      </svg>
    ),
  },
  PCDOB: {
    name: 'Partido Comunista do Brasil',
    short: 'PCdoB',
    color: '#C8102E',
    bgLight: 'rgba(200, 16, 46, 0.08)',
    bgDark: 'rgba(200, 16, 46, 0.18)',
    textLight: '#b91c1c',
    textDark: '#f87171',
    borderColor: 'rgba(200, 16, 46, 0.28)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect width="24" height="24" rx="12" fill="#C8102E" />
        <path d="M12 7l1.5 3.5 3.5.5-2.5 2.5.5 3.5-3-2-3 2 .5-3.5-2.5-2.5 3.5-.5z" fill="#F7CE00" />
      </svg>
    ),
  },
  'PC DO B': {
    name: 'Partido Comunista do Brasil',
    short: 'PCdoB',
    color: '#C8102E',
    bgLight: 'rgba(200, 16, 46, 0.08)',
    bgDark: 'rgba(200, 16, 46, 0.18)',
    textLight: '#b91c1c',
    textDark: '#f87171',
    borderColor: 'rgba(200, 16, 46, 0.28)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect width="24" height="24" rx="12" fill="#C8102E" />
        <path d="M12 7l1.5 3.5 3.5.5-2.5 2.5.5 3.5-3-2-3 2 .5-3.5-2.5-2.5 3.5-.5z" fill="#F7CE00" />
      </svg>
    ),
  },
  REDE: {
    name: 'Rede Sustentabilidade',
    short: 'REDE',
    color: '#00A88F',
    bgLight: 'rgba(0, 168, 143, 0.08)',
    bgDark: 'rgba(0, 168, 143, 0.18)',
    textLight: '#0f766e',
    textDark: '#2dd4bf',
    borderColor: 'rgba(0, 168, 143, 0.28)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect width="24" height="24" rx="12" fill="#00A88F" />
        <circle cx="8" cy="12" r="2.5" fill="#FF7A00" />
        <circle cx="16" cy="9" r="2" fill="#FFFFFF" />
        <circle cx="14" cy="16" r="2" fill="#FFFFFF" />
        <path d="M8 12l8-3m-8 3l6 4" stroke="#FFFFFF" strokeWidth="1.2" />
      </svg>
    ),
  },
  AVANTE: {
    name: 'Avante',
    short: 'AVANTE',
    color: '#003399',
    bgLight: 'rgba(0, 51, 153, 0.08)',
    bgDark: 'rgba(0, 51, 153, 0.18)',
    textLight: '#1d4ed8',
    textDark: '#60a5fa',
    borderColor: 'rgba(0, 51, 153, 0.28)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect width="24" height="24" rx="12" fill="#003399" />
        <path d="M8 8l5 4-5 4m5-8l5 4-5 4" stroke="#00AEEF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  SOLIDARIEDADE: {
    name: 'Solidariedade',
    short: 'SOLID.',
    color: '#FF7F00',
    bgLight: 'rgba(255, 127, 0, 0.08)',
    bgDark: 'rgba(255, 127, 0, 0.18)',
    textLight: '#c2410c',
    textDark: '#fb923c',
    borderColor: 'rgba(255, 127, 0, 0.28)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect width="24" height="24" rx="12" fill="#FF7F00" />
        <circle cx="12" cy="12" r="5" stroke="#FFFFFF" strokeWidth="2" />
      </svg>
    ),
  },
  PRD: {
    name: 'Partido Renovação Democrática',
    short: 'PRD',
    color: '#002D62',
    bgLight: 'rgba(0, 45, 98, 0.08)',
    bgDark: 'rgba(0, 45, 98, 0.18)',
    textLight: '#1e40af',
    textDark: '#60a5fa',
    borderColor: 'rgba(0, 45, 98, 0.28)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect width="24" height="24" rx="12" fill="#002D62" />
        <path d="M12 6l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" fill="#D21034" />
      </svg>
    ),
  },
  CIDADANIA: {
    name: 'Cidadania',
    short: 'CIDAD.',
    color: '#E40046',
    bgLight: 'rgba(228, 0, 70, 0.08)',
    bgDark: 'rgba(228, 0, 70, 0.18)',
    textLight: '#be123c',
    textDark: '#fb7185',
    borderColor: 'rgba(228, 0, 70, 0.28)',
    icon: (s = 14) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
        <rect width="24" height="24" rx="12" fill="#E40046" />
        <circle cx="12" cy="12" r="4" fill="#FFFFFF" />
      </svg>
    ),
  },
};

export function getPartyInfo(partyName?: string | null): PartyInfo | null {
  if (!partyName) return null;
  const key = partyName.toUpperCase().trim();
  return PARTIES[key] ?? null;
}

export function PartyBadge({
  party,
  className = '',
  showFullName = false,
}: {
  party?: string | null;
  className?: string;
  showFullName?: boolean;
}) {
  if (!party) {
    return (
      <span className={`pol-badge-party ${className}`}>
        Sem Partido
      </span>
    );
  }

  const info = getPartyInfo(party);

  if (!info) {
    return (
      <span className={`pol-badge-party inline-flex items-center gap-1.5 ${className}`} title={party}>
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" className="shrink-0 opacity-70">
          <path d="M4 4v17M4 4h14l-3 5 3 5H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-bold tracking-tight">{party}</span>
      </span>
    );
  }

  return (
    <span
      className={`pol-badge-party inline-flex items-center gap-1.5 transition-colors ${className}`}
      title={info.name}
      style={{
        borderColor: info.borderColor,
      }}
    >
      {info.icon(14)}
      <span className="font-bold tracking-tight">
        {showFullName ? `${info.short} — ${info.name}` : party}
      </span>
    </span>
  );
}
