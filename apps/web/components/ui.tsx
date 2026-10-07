'use client';

import Link from 'next/link';
import { type ReactNode } from 'react';
import { DATA_KIND_LABEL, SOURCE_TYPE_LABEL } from '@/lib/labels';
import { formatDateTime, initials, formatPercent } from '@/lib/format';
import type { DataKind, Source } from '@/lib/types';

/** Separacao visual: Dado oficial · Analise do sistema · Opiniao do usuario · Noticia de terceiros. */
export function KindBadge({ kind }: { kind: DataKind }) {
  return (
    <span className={`badge badge-${kind.toLowerCase()} font-mono`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {DATA_KIND_LABEL[kind]}
    </span>
  );
}

/** Toda informacao factual relevante aponta para sua fonte rastreavel. */
export function SourceLink({ source, compact }: { source: Source; compact?: boolean }) {
  return (
    <span className="source font-mono flex items-center gap-1.5 flex-wrap">
      <span className="text-muted-foreground">Fonte:</span>{' '}
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline inline-flex items-center gap-1 font-medium"
      >
        {source.name}
        <span className="text-[10px]">↗</span>
      </a>
      {!compact && (
        <span className="text-muted-foreground/70 text-xs">
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
        className="avatar"
        style={{ width: size, height: size, borderColor: 'var(--border)' }}
      />
    );
  return (
    <span
      className="avatar avatar-fallback font-mono"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials(name)}
    </span>
  );
}

export function Loading({ label = 'Carregando dados oficiais…' }: { label?: string }) {
  return (
    <div className="state">
      <span className="spinner" />
      <span className="font-mono text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <div className="state state-error">
      <p className="font-mono text-sm">Não foi possível carregar: {error.message}</p>
      {onRetry && (
        <button className="v-btn -ghost -sm" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="state text-muted-foreground font-mono text-sm">{children}</div>;
}

export function Stat({ value, label, hint }: { value: ReactNode; label: string; hint?: string }) {
  return (
    <div className="stat">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {hint && <div className="stat-hint">{hint}</div>}
    </div>
  );
}

export function CompatibilityMeter({ score, size = 'md' }: { score: number | null; size?: 'sm' | 'md' }) {
  const pct = score === null ? 0 : Math.round(score * 100);
  const tone = score === null ? 'none' : pct >= 66 ? 'high' : pct >= 40 ? 'mid' : 'low';
  return (
    <div className={`meter meter-${size}`}>
      <div className="meter-track">
        <div className={`meter-fill tone-${tone}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="meter-label font-mono">{formatPercent(score)}</span>
    </div>
  );
}

export function Bar({ ratio, label, value }: { ratio: number; label: string; value: string }) {
  return (
    <div className="bar-row">
      <div className="bar-head">
        <span className="text-muted-foreground">{label}</span>
        <strong className="text-foreground">{value}</strong>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${Math.max(2, Math.round(ratio * 100))}%` }} />
      </div>
    </div>
  );
}

export function DemoBanner() {
  return null;
}

export function RequireLogin({ children, message }: { children?: ReactNode; message: string }) {
  return (
    <div className="v-card center p-8 border border-border">
      <p className="text-foreground mb-4 font-mono">{message}</p>
      <div className="row center-row gap-3">
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
