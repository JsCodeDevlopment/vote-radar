'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Avatar, CompatibilityMeter, KindBadge, SourceLink } from './ui';
import { OFFICE_LABEL } from '@/lib/labels';
import { formatDate } from '@/lib/format';
import type { FeedItem, PoliticianSummary } from '@/lib/types';

export function FollowButton({ politicianId, size }: { politicianId: string; size?: 'sm' }) {
  const { user, isFollowing, toggleFollow } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const following = isFollowing(politicianId);
  return (
    <button
      className={`v-btn ${following ? '-ghost' : '-accent'} ${size === 'sm' ? '-sm' : ''}`}
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

export function PoliticianCard({
  politician,
  score,
  showFollow = true,
}: {
  politician: PoliticianSummary;
  score?: number | null;
  showFollow?: boolean;
}) {
  const officeIcon =
    politician.office === 'PRESIDENTE'
      ? '🇧🇷'
      : politician.office === 'GOVERNADOR'
        ? '🏢'
        : politician.office === 'SENADOR'
          ? '🏛️'
          : politician.office === 'DEPUTADO_FEDERAL'
            ? '⚖️'
            : '📍';

  return (
    <div className="pol-card-v2 group">
      {/* Top Header Row com Cargo, UF e Status */}
      <div className="pol-card-top-row">
        <span className="pol-office-chip">
          <span>{officeIcon}</span>
          <span>{OFFICE_LABEL[politician.office]}</span>
        </span>

        <div className="flex items-center gap-1.5">
          <span className="pol-badge-uf font-mono text-xs">
            {politician.uf ? politician.uf : 'BR'}
          </span>
          <span
            className="text-[11px] font-mono px-2 py-0.5 rounded-full inline-flex items-center gap-1"
            style={{
              background: politician.status === 'IN_OFFICE' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              color: politician.status === 'IN_OFFICE' ? '#22c55e' : '#f59e0b',
              border: `1px solid ${politician.status === 'IN_OFFICE' ? 'rgba(34, 197, 94, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
            }}
          >
            ● {politician.status === 'IN_OFFICE' ? 'Em Exercício' : 'Licenciado'}
          </span>
        </div>
      </div>

      {/* Seção Principal: Foto Destacada + Identificação */}
      <div className="pol-card-main-info">
        <Link href={`/parlamentares/${politician.id}`} tabIndex={-1} className="flex-shrink-0">
          {politician.photoUrl ? (
            <img
              src={politician.photoUrl}
              alt={politician.name}
              className="pol-card-avatar-img transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="pol-card-avatar-img flex items-center justify-center font-bold text-xl text-primary bg-card">
              {politician.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={`/parlamentares/${politician.id}`} className="no-underline">
            <h3 className="pol-card-name group-hover:text-primary transition-colors truncate">
              {politician.name}
            </h3>
          </Link>

          <div className="pol-card-subinfo">
            <span className="pol-badge-party">{politician.party ?? 'Sem Partido'}</span>
            <span>•</span>
            <span className="truncate">{politician.uf ? `Representante de ${politician.uf}` : 'Âmbito Federal'}</span>
          </div>
        </div>
      </div>

      {/* Compatibilidade com o Eleitor */}
      {score !== undefined && (
        <div className="mb-3 p-2.5 rounded-lg bg-muted/30 border border-border/60">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-1">
            <span>Alinhamento Cívico</span>
            <strong className="text-foreground">
              {score !== null ? `${Math.round(score * 100)}%` : '—'}
            </strong>
          </div>
          <CompatibilityMeter score={score} size="sm" />
        </div>
      )}

      {/* Barra de Ações: Ver Perfil e Seguir */}
      <div className="pol-card-action-bar">
        <Link
          href={`/parlamentares/${politician.id}`}
          className="text-xs font-mono font-bold text-primary hover:underline inline-flex items-center gap-1"
        >
          Ver Ficha Completa →
        </Link>

        {showFollow && <FollowButton politicianId={politician.id} size="sm" />}
      </div>
    </div>
  );
}

const FEED_CATEGORY_CONFIG: Record<
  FeedItem['type'],
  { label: string; icon: string; accentClass: string; badgeBg: string; badgeColor: string }
> = {
  VOTE: {
    label: 'VOTAÇÃO NOMINAL EM PLENÁRIO',
    icon: '🗳️',
    accentClass: 'feed-accent-vote',
    badgeBg: 'rgba(234, 179, 8, 0.15)',
    badgeColor: '#eab308',
  },
  EXPENSE: {
    label: 'AUDITORIA DE GASTOS PÚBLICOS',
    icon: '💰',
    accentClass: 'feed-accent-expense',
    badgeBg: 'rgba(34, 197, 94, 0.15)',
    badgeColor: '#22c55e',
  },
  PROPOSAL: {
    label: 'TRAMITAÇÃO LEGISLATIVA',
    icon: '📄',
    accentClass: 'feed-accent-proposal',
    badgeBg: 'rgba(59, 130, 246, 0.15)',
    badgeColor: '#3b82f6',
  },
  NEWS: {
    label: 'IMPRENSA & INVESTIGAÇÃO OFICIAL',
    icon: '📰',
    accentClass: 'feed-accent-news',
    badgeBg: 'rgba(236, 72, 153, 0.15)',
    badgeColor: '#ec4899',
  },
};

export function FeedItemCard({ item }: { item: FeedItem }) {
  const config = FEED_CATEGORY_CONFIG[item.type] ?? FEED_CATEGORY_CONFIG.NEWS;

  return (
    <article className="feed-journal-card">
      <div className={`feed-card-accent-bar ${config.accentClass}`} />

      {/* Eyebrow de Manchete Jornalística */}
      <div className="feed-journal-eyebrow">
        <div className="flex items-center gap-2">
          <span
            className="feed-badge-kind"
            style={{ background: config.badgeBg, color: config.badgeColor }}
          >
            <span>{config.icon}</span>
            <span>{config.label}</span>
          </span>
          <span className="text-muted-foreground text-xs font-mono">•</span>
          <span className="text-muted-foreground text-xs font-mono">
            {formatDate(item.date)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <KindBadge kind={item.kind} />
        </div>
      </div>

      {/* Identificação da Autoridade Envolvida */}
      <div className="feed-pol-meta">
        <Link href={`/parlamentares/${item.politician.id}`} className="shrink-0">
          <Avatar name={item.politician.name} url={item.politician.photoUrl} size={36} />
        </Link>
        <div>
          <Link
            href={`/parlamentares/${item.politician.id}`}
            className="feed-pol-name font-mono hover:text-primary transition-colors"
          >
            {item.politician.name}
          </Link>
          <div className="text-muted-foreground text-xs font-mono">
            {item.politician.party ?? 'Sem partido'} • {item.politician.uf ?? 'BR'} ·{' '}
            {OFFICE_LABEL[item.politician.office]}
          </div>
        </div>
      </div>

      {/* Manchete Principal em Estilo Jornalístico */}
      <h3 className="feed-journal-headline">
        {item.href ? (
          <Link href={item.href} className="hover:text-primary transition-colors">
            {item.title}
          </Link>
        ) : (
          item.title
        )}
      </h3>

      {/* Lede / Descrição Detalhada */}
      {item.description && <p className="feed-journal-lead">{item.description}</p>}

      {/* Rodapé de Auditoria e Comprovante */}
      <div className="feed-journal-footer">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">Fonte Oficial:</span>
          {item.source && <SourceLink source={item.source} compact />}
        </div>

        {item.externalUrl && (
          <a
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-xs font-mono font-bold inline-flex items-center gap-1"
          >
            📄 Consultar Documento Original ↗
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
      className="search max-w-xl mx-auto flex items-center gap-2 p-1.5 rounded-full bg-card border border-border focus-within:border-primary shadow-lg transition-all"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/explorar${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`);
      }}
    >
      <input
        className="w-full bg-transparent px-4 py-2 text-foreground font-mono text-sm placeholder:text-muted-foreground outline-none"
        placeholder="Buscar parlamentar pelo nome…"
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => setQ(e.target.value)}
      />
      <button className="v-btn -accent -sm shrink-0" type="submit">
        Buscar
      </button>
    </form>
  );
}
