'use client';

import React, { useEffect, useState } from 'react';

export interface PartyInfo {
  sigla: string;
  nome: string;
  logoUrl: string | null;
  color?: string;
  numero?: number;
}

// Cache em memória para o fetch de partidos não repetir requisições
let partiesCache: Record<string, PartyInfo> | null = null;
let fetchPromise: Promise<Record<string, PartyInfo>> | null = null;

async function getPartiesData(): Promise<Record<string, PartyInfo>> {
  if (partiesCache) return partiesCache;
  if (!fetchPromise) {
    fetchPromise = fetch('/api/partidos')
      .then((res) => (res.ok ? res.json() : {}))
      .then((data: Record<string, PartyInfo>) => {
        partiesCache = data;
        return data;
      })
      .catch(() => ({}));
  }
  return fetchPromise;
}

export function PartyLogo({
  party,
  className = '',
  size = 20,
}: {
  party?: string | null;
  className?: string;
  size?: number;
}) {
  const [partyInfo, setPartyInfo] = useState<PartyInfo | null>(() => {
    if (!party) return null;
    const key = party.toUpperCase().trim();
    return partiesCache ? partiesCache[key] ?? null : null;
  });

  useEffect(() => {
    if (!party) return;
    let isMounted = true;
    getPartiesData().then((registry) => {
      if (!isMounted) return;
      const key = party.toUpperCase().trim();
      const found = registry[key];
      if (found) {
        setPartyInfo(found);
      } else {
        setPartyInfo({
          sigla: party,
          nome: party,
          logoUrl: `/partidos/${key.toLowerCase()}.svg`,
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, [party]);

  if (!party || party === 'S/Partido' || party === 'S.PART.' || party.toLowerCase() === 'sem partido') {
    return (
      <span
        className={`text-[11px] text-muted-foreground/75 italic select-none ${className}`}
        title="Sem Filiação Partidária"
      >
        Sem Partido
      </span>
    );
  }

  const cleanSigla = party.trim();
  const fullName = partyInfo?.nome && partyInfo.nome !== cleanSigla
    ? `${partyInfo.nome} (${cleanSigla})`
    : `Partido ${cleanSigla}`;
  const logoUrl = partyInfo?.logoUrl || `/partidos/${cleanSigla.toLowerCase()}.svg`;

  return (
    <div
      className={`relative inline-flex items-center group/partylogo ${className}`}
      title={fullName}
      aria-label={fullName}
    >
      {/* Imagem da logo solta (sem badge/pill ao redor, apenas o logo oficial) */}
      <img
        src={logoUrl}
        alt={fullName}
        style={{ height: `${size}px`, maxHeight: `${size}px` }}
        className="w-auto max-w-[54px] object-contain transition-transform duration-200 group-hover/partylogo:scale-115 drop-shadow-sm select-none"
        loading="lazy"
        onError={(e) => {
          // Fallback se imagem específica falhar: exibe sigla limpa com title
          const target = e.currentTarget;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent && !parent.querySelector('.pol-party-fallback')) {
            const span = document.createElement('span');
            span.className = 'pol-party-fallback text-xs font-bold text-foreground tracking-tight';
            span.textContent = cleanSigla;
            parent.appendChild(span);
          }
        }}
      />

      {/* Tooltip flutuante e elegante ao passar o mouse com o nome do partido */}
      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/partylogo:flex flex-col items-center z-50 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-white bg-neutral-900/95 dark:bg-neutral-800/95 backdrop-blur-md border border-white/10 dark:border-white/15 shadow-xl whitespace-nowrap">
          <span>{fullName}</span>
        </div>
        <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-neutral-900/95 dark:border-t-neutral-800/95 -mt-[1px]" />
      </div>
    </div>
  );
}
