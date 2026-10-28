'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Avatar, CompatibilityMeter, KindBadge, SourceLink } from './ui';
import { MapPin } from 'lucide-react';
import { OFFICE_LABEL, STATE_NAMES } from '@/lib/labels';
import { formatDate } from '@/lib/format';
import type { FeedItem, PoliticianSummary } from '@/lib/types';

import { PartyLogo } from './PartyLogo';

export function getRegionLabel(politician: PoliticianSummary): string {
  if (politician.office === 'PRESIDENTE') {
    return 'Brasil (Nacional)';
  }
  const uf = politician.uf?.trim().toUpperCase();
  if (!uf || uf === 'BR') {
    return 'Brasil (Nacional)';
  }
  const stateName = STATE_NAMES[uf];
  if (politician.office === 'GOVERNADOR') {
    return stateName ? `${stateName} (${uf})` : `Estado de ${uf}`;
  }
  if (politician.office === 'SENADOR') {
    return stateName ? `${stateName} (${uf})` : `Senado • ${uf}`;
  }
  if (politician.office === 'DEPUTADO_FEDERAL') {
    return stateName ? `Bancada ${uf} (${stateName})` : `Bancada ${uf}`;
  }
  if (politician.office === 'DEPUTADO_ESTADUAL') {
    return stateName ? `Assembleia ${uf}` : `Bancada ${uf}`;
  }
  return stateName ? `${stateName} (${uf})` : `Bancada ${uf}`;
}

export function FollowButton({ politicianId, size }: { politicianId: string; size?: 'sm' }) {
  const { user, isFollowing, toggleFollow } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const following = isFollowing(politicianId);
  return (
    <button
      className={`v-btn ${following ? '-ghost' : '-accent'} ${size === 'sm' ? '-sm' : ''} rounded-full`}
      disabled={busy}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
          router.push('/login');
          return;
        }
        setBusy(true);
        try {
          await toggleFollow(politicianId);
        } finally {
          setBusy(false);
        }
      }}
    >
      {following ? '✓ Acompanhando' : '+ Acompanhar'}
    </button>
  );
}

export function getOfficeSubtitle(politician: PoliticianSummary): string {
  const uf = politician.uf?.trim().toUpperCase();
  const stateName = uf && uf !== 'BR' ? STATE_NAMES[uf] || uf : '';
  switch (politician.office) {
    case 'PRESIDENTE':
      return 'Presidência da República';
    case 'GOVERNADOR':
      return stateName ? `Governo de ${stateName}` : 'Governo do Estado';
    case 'SENADOR':
      return stateName ? `Senador por ${stateName}` : 'Senado Federal';
    case 'DEPUTADO_FEDERAL':
      return stateName ? `Deputado Federal (${uf})` : 'Câmara dos Deputados';
    case 'DEPUTADO_ESTADUAL':
      return stateName ? `Deputado Estadual (${uf})` : 'Assembleia Legislativa';
    default:
      return OFFICE_LABEL[politician.office] || 'Parlamentar';
  }
}

export function PoliticianCard({
  politician,
  score,
  showFollow = false,
}: {
  politician: PoliticianSummary;
  score?: number | null;
  showFollow?: boolean;
}) {
  const officeSubtitle = getOfficeSubtitle(politician);

  return (
    <div className="pol-card-v2 group flex flex-col justify-between">
      <div>
        {/* Top Header Row com Cargo e UF em formato Pill */}
        <div className="pol-card-top-row flex items-center justify-between mb-5">
          <span className={`pol-office-chip pol-office-${politician.office.toLowerCase()}`}>
            <span>{OFFICE_LABEL[politician.office]}</span>
          </span>

          <span className="pol-badge-uf text-xs font-bold">
            {politician.uf ? politician.uf : 'BR'}
          </span>
        </div>

        {/* Visual Hero Central: Foto Proeminente + Nome em Grande Destaque */}
        <div className="flex flex-col items-center text-center mb-4">
          <Link
            href={`/parlamentares/${politician.id}`}
            tabIndex={-1}
            className="relative inline-block mb-3"
          >
            {politician.photoUrl ? (
              <img
                src={politician.photoUrl}
                alt={politician.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-border/80 shadow-md ring-4 ring-muted/50 dark:ring-white/[0.06] transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-full flex items-center justify-center font-extrabold text-2xl text-primary bg-primary/10 border-2 border-border/80 shadow-md ring-4 ring-muted/50 dark:ring-white/[0.06]">
                {politician.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </Link>

          <Link href={`/parlamentares/${politician.id}`} className="no-underline block max-w-full px-2">
            <h3
              className="text-xl sm:text-[1.3rem] font-extrabold text-foreground tracking-tight leading-snug group-hover:text-primary transition-colors line-clamp-2"
              title={politician.name}
            >
              {politician.name}
            </h3>
          </Link>

          <p className="text-xs font-medium text-muted-foreground mt-1 truncate max-w-full px-2">
            {officeSubtitle}
          </p>
        </div>

        {/* Badge do Partido em Destaque em Largura Inteira */}
        <div className="w-full mb-5 py-2.5 px-4 rounded-2xl bg-muted/50 dark:bg-white/[0.04] border border-border/80 flex items-center justify-center gap-3 shadow-xs">
          <PartyLogo party={politician.party} size={28} />
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75 leading-none mb-0.5">
              Partido
            </span>
            <span
              className="text-sm font-bold text-foreground leading-tight"
              title={politician.party ?? 'Sem Partido'}
            >
              {politician.party ?? 'Sem Partido'}
            </span>
          </div>
        </div>

        {/* Compatibilidade com o Eleitor */}
        {score !== undefined && (
          <div className="mb-4 p-3 rounded-xl bg-muted/40 border border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span className="font-medium">Alinhamento Cívico</span>
              <strong className="text-foreground tabular-nums">
                {score !== null ? `${Math.round(score * 100)}%` : '—'}
              </strong>
            </div>
            <CompatibilityMeter score={score} size="sm" />
          </div>
        )}
      </div>

      {/* Barra de Ações: Ver Ficha Completa (botão ghost sem seta) */}
      <div className="pol-card-action-bar mt-auto pt-3 border-t border-border flex items-center justify-center">
        <Link
          href={`/parlamentares/${politician.id}`}
          className="v-btn -ghost -sm w-full rounded-full text-xs font-bold justify-center text-center py-2.5 tracking-wide transition-all"
        >
          Ver Ficha Completa
        </Link>
      </div>
    </div>
  );
}

const FEED_CATEGORY_CONFIG: Record<
  FeedItem['type'],
  { label: string; accentClass: string; badgeBg: string; badgeColor: string }
> = {
  VOTE: {
    label: 'Votação em Plenário',
    accentClass: 'feed-accent-vote',
    badgeBg: 'rgba(234, 179, 8, 0.12)',
    badgeColor: '#ca8a04',
  },
  EXPENSE: {
    label: 'Auditoria de Gastos',
    accentClass: 'feed-accent-expense',
    badgeBg: 'rgba(34, 197, 94, 0.12)',
    badgeColor: '#16a34a',
  },
  PROPOSAL: {
    label: 'Tramitação Legislativa',
    accentClass: 'feed-accent-proposal',
    badgeBg: 'rgba(59, 130, 246, 0.12)',
    badgeColor: '#2563eb',
  },
  NEWS: {
    label: 'Notícia & Imprensa',
    accentClass: 'feed-accent-news',
    badgeBg: 'rgba(236, 72, 153, 0.12)',
    badgeColor: '#db2777',
  },
};

export function FeedItemCard({ item }: { item: FeedItem }) {
  const config = FEED_CATEGORY_CONFIG[item.type] ?? FEED_CATEGORY_CONFIG.NEWS;

  return (
    <article className="feed-journal-card">
      {/* Eyebrow com Badge Capsule */}
      <div className="feed-journal-eyebrow flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="feed-badge-kind px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5"
            style={{ background: config.badgeBg, color: config.badgeColor }}
          >
            <span>{config.label}</span>
          </span>
          <span className="text-muted-foreground text-xs">•</span>
          <span className="text-muted-foreground text-xs">
            {formatDate(item.date)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <KindBadge kind={item.kind} />
        </div>
      </div>

      {/* Identificação da Autoridade Envolvida */}
      <div className="feed-pol-meta flex items-center gap-2.5 mb-3">
        <Link href={`/parlamentares/${item.politician.id}`} className="shrink-0">
          <Avatar name={item.politician.name} url={item.politician.photoUrl} size={32} />
        </Link>
        <div>
          <Link
            href={`/parlamentares/${item.politician.id}`}
            className="feed-pol-name font-semibold text-sm hover:underline"
          >
            {item.politician.name}
          </Link>
          <div className="text-muted-foreground text-xs">
            {item.politician.party ?? 'Sem partido'} • {item.politician.uf ?? 'BR'} ·{' '}
            {OFFICE_LABEL[item.politician.office]}
          </div>
        </div>
      </div>

      {/* Manchete Principal */}
      <h3 className="feed-journal-headline text-base font-semibold leading-snug mb-2">
        {item.href ? (
          <Link href={item.href} className="hover:text-primary transition-colors">
            {item.title}
          </Link>
        ) : (
          item.title
        )}
      </h3>

      {/* Lede / Descrição Detalhada */}
      {item.description && <p className="feed-journal-lead text-xs text-muted-foreground leading-relaxed mb-3">{item.description}</p>}

      {/* Rodapé de Auditoria e Comprovante */}
      <div className="feed-journal-footer flex items-center justify-between pt-3 border-t border-border text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Fonte:</span>
          {item.source && <SourceLink source={item.source} compact />}
        </div>

        {item.externalUrl && (
          <a
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline font-semibold inline-flex items-center gap-1"
          >
            Documento Original ↗
          </a>
        )}
      </div>
    </article>
  );
}

export function SearchBox({ initial = '', autoFocus }: { initial?: string; autoFocus?: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState(initial);
  return (
    <form
      className="search max-w-xl mx-auto flex items-center gap-2 p-1.5 rounded-full bg-card border border-border focus-within:border-foreground/40 shadow-xs transition-all"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/explorar${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`);
      }}
    >
      <input
        className="w-full bg-transparent px-4 py-2 text-foreground text-sm placeholder:text-muted-foreground outline-none"
        placeholder="Buscar parlamentar pelo nome…"
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => setQ(e.target.value)}
      />
      <button className="v-btn -accent -sm shrink-0 rounded-full px-5" type="submit">
        Buscar
      </button>
    </form>
  );
}
