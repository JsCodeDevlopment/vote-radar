'use client';

import Link from 'next/link';
import { type ReactNode } from 'react';
import { DATA_KIND_LABEL, SOURCE_TYPE_LABEL } from '@/lib/labels';
import { formatDateTime, initials, formatPercent } from '@/lib/format';
import type { DataKind, Source } from '@/lib/types';

/** Separacao visual: Dado oficial · Analise do sistema · Opiniao do usuario · Noticia de terceiros. */
export function KindBadge({ kind }: { kind: DataKind }) {
  return (
    <span className={`badge badge-${kind.toLowerCase()} text-xs font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {DATA_KIND_LABEL[kind]}
    </span>
  );
}

/** Toda informacao factual relevante aponta para sua fonte rastreavel. */
export function SourceLink({ source, compact }: { source: Source; compact?: boolean }) {
  return (
    <span className="source text-xs flex items-center gap-1.5 flex-wrap">
      <span className="text-muted-foreground">Fonte:</span>{' '}
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground hover:underline inline-flex items-center gap-1 font-semibold"
      >
        {source.name}
        <span className="text-[10px]">↗</span>
      </a>
      {!compact && (
        <span className="text-muted-foreground text-xs">
          {' '}
          · {SOURCE_TYPE_LABEL[source.type]} · coletado em {formatDateTime(source.retrievedAt)}
        </span>
      )}
    </span>
  );
}

export function Avatar({ name, url, size = 48 }: { name: string; url?: string | null; size?: number }) {
  if (url)
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={url}
        alt={name}
        className="avatar rounded-full object-cover border border-border shadow-2xs"
        style={{ width: size, height: size }}
      />
    );
  return (
    <span
      className="avatar avatar-fallback rounded-full flex items-center justify-center font-bold bg-muted text-foreground border border-border shadow-2xs"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials(name)}
    </span>
  );
}

export function Loading({ label = 'Carregando dados oficiais…' }: { label?: string }) {
  return (
    <div className="state py-12 flex flex-col items-center justify-center gap-3">
      <span className="spinner" />
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <div className="state state-error p-6 rounded-2xl border border-destructive/30 bg-destructive/5 text-center">
      <p className="text-sm font-medium text-destructive mb-3">Não foi possível carregar: {error.message}</p>
      {onRetry && (
        <button className="v-btn -ghost -sm" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="state text-muted-foreground text-sm text-center py-12">{children}</div>;
}

export function Stat({ value, label, hint }: { value: ReactNode; label: string; hint?: string }) {
  return (
    <div className="stat p-4 rounded-2xl bg-card border border-border shadow-2xs">
      <div className="stat-value text-2xl font-bold tracking-tight text-foreground tabular-nums">{value}</div>
      <div className="stat-label text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-1">{label}</div>
      {hint && <div className="stat-hint text-xs text-muted-foreground/80 mt-1">{hint}</div>}
    </div>
  );
}

export function CompatibilityMeter({ score, size = 'md' }: { score: number | null; size?: 'sm' | 'md' }) {
  const pct = score === null ? 0 : Math.round(score * 100);
  const tone = score === null ? 'none' : pct >= 66 ? 'high' : pct >= 40 ? 'mid' : 'low';
  return (
    <div className={`meter meter-${size} flex items-center gap-2`}>
      <div className="meter-track flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div className={`meter-fill tone-${tone} h-full rounded-full transition-all duration-300`} style={{ width: `${pct}%` }} />
      </div>
      <span className="meter-label text-xs font-semibold tabular-nums text-foreground">{formatPercent(score)}</span>
    </div>
  );
}

export function Bar({ ratio, label, value }: { ratio: number; label: string; value: string }) {
  return (
    <div className="bar-row mb-2">
      <div className="bar-head flex justify-between text-xs font-medium mb-1">
        <span className="text-muted-foreground">{label}</span>
        <strong className="text-foreground tabular-nums">{value}</strong>
      </div>
      <div className="bar-track h-2 rounded-full bg-muted overflow-hidden">
        <div className="bar-fill h-full rounded-full bg-primary" style={{ width: `${Math.max(2, Math.round(ratio * 100))}%` }} />
      </div>
    </div>
  );
}

export function DemoBanner() {
  return null;
}

export function RequireLogin({ children, message }: { children?: ReactNode; message: string }) {
  return (
    <div className="v-card center p-8 rounded-2xl border border-border bg-card text-center">
      <p className="text-foreground mb-5 text-sm font-medium">{message}</p>
      <div className="row center-row gap-3 justify-center">
        <Link href="/login" className="v-btn -accent">
          Entrar
        </Link>
        <Link href="/register" className="v-btn -ghost">
          Criar conta
        </Link>
      </div>
      {children}
    </div>
  );
}
