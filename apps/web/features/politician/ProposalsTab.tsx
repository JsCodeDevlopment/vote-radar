'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Empty, ErrorState, KindBadge, Loading, SourceLink } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { api } from '@/lib/api';
import { formatDate, proposalLabel } from '@/lib/format';
import { OFFICE_LABEL } from '@/lib/labels';
import type { PoliticianDetail } from '@/lib/types';

const STATUS_FILTERS: { key: string; label: string; match: (s: string) => boolean }[] = [
  { key: 'todos', label: 'Todos os status', match: () => true },
  { key: 'tramitacao', label: 'Em tramitação', match: (s) => /tramita|aguardando|comiss/i.test(s) },
  { key: 'aprovados', label: 'Aprovados / Promulgados', match: (s) => /aprovad|promulgad|sancionad|lei/i.test(s) },
  { key: 'rejeitados', label: 'Rejeitados', match: (s) => /rejeitad/i.test(s) },
  { key: 'arquivados', label: 'Arquivados', match: (s) => /arquivad/i.test(s) },
];

const MANDATE_YEARS = [undefined, 2026, 2025, 2024, 2023] as const;

export function ProposalsTab({
  politicianId,
  politician,
}: {
  politicianId: string;
  politician?: PoliticianDetail;
}) {
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const list = useAsync(
    () => api.getPoliticianProposals(politicianId, selectedYear),
    [politicianId, selectedYear],
  );

  const matcher = STATUS_FILTERS.find((f) => f.key === statusFilter)?.match || (() => true);

  const filteredItems = useMemo(() => {
    let items = list.data ?? [];
    if (statusFilter !== 'todos') {
      items = items.filter((p) => matcher(p.currentStatus ?? ''));
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.summary?.toLowerCase().includes(q) ||
          String(p.number).includes(q) ||
          p.type.toLowerCase().includes(q),
      );
    }
    return items;
  }, [list.data, statusFilter, matcher, searchQuery]);

  if (list.loading && !list.data) return <Loading />;
  if (list.error) return <ErrorState error={list.error} onRetry={list.reload} />;

  return (
    <div className="stack" style={{ gap: 18 }}>
      {/* Box de Auditoria e Verificabilidade */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 51, 234, 0.05) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
        }}
      >
        <div className="row between" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div className="row" style={{ gap: 8, alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: '1.2rem' }}>📜</span>
              <strong>Atividade Legislativa e Projetos do Mandato</strong>
              <span className="chip chip-green" style={{ fontSize: '0.75rem' }}>DADOS REAIS</span>
            </div>
            <p className="small muted" style={{ margin: 0, lineHeight: 1.5 }}>
              Todas as proposições legislativas de autoria ou relatoria (Projetos de Lei, PECs, Medidas Provisórias e Requerimentos).
              Cada projeto contém link direto para a ficha oficial de tramitação, relatórios e textos integrais nos portais do Congresso Nacional.
            </p>
          </div>
        </div>
      </div>

      {/* Controles de Filtro: Ano do Mandato e Busca */}
      <div className="card">
        <div className="stack" style={{ gap: 14 }}>
          {/* Seletor de Ano */}
          <div className="row between" style={{ flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <div className="row" style={{ gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="small muted" style={{ fontWeight: 600 }}>Filtrar por ano:</span>
              <div className="row" style={{ gap: 6 }}>
                {MANDATE_YEARS.map((y) => (
                  <button
                    key={y ?? 'todos'}
                    type="button"
                    className={`btn btn-sm ${selectedYear === y ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setSelectedYear(y)}
                  >
                    {y ? String(y) : 'Todo o mandato'}
                  </button>
                ))}
              </div>
            </div>

            <div className="row" style={{ gap: 8, alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Buscar por termo ou número..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-sm"
                style={{ width: 240 }}
              />
              {searchQuery && (
                <button className="btn btn-ghost btn-sm" onClick={() => setSearchQuery('')}>
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Filtros por Situação / Status */}
          <div className="filters" style={{ margin: 0 }}>
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`btn btn-sm ${statusFilter === f.key ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setStatusFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Listagem de Proposições */}
      {filteredItems.length === 0 ? (
        politician?.office === 'GOVERNADOR' || politician?.office === 'DEPUTADO_ESTADUAL' ? (
          <div className="card" style={{ padding: '32px 24px', textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 12 }}>📜</span>
            <h3 style={{ marginBottom: 8, fontSize: '1.25rem' }}>
              Projetos de Lei Estaduais — Tramitação na Assembleia Legislativa
            </h3>
            <p className="muted" style={{ maxWidth: 620, margin: '0 auto 12px', lineHeight: 1.6 }}>
              Os projetos e deliberações de {politician.name} ({OFFICE_LABEL[politician.office]}) tramitam diretamente no sistema legislativo estadual ({politician.bodyName}).
            </p>
            <p className="small muted" style={{ maxWidth: 580, margin: '0 auto 16px' }}>
              Para auditar e consultar o histórico completo de projetos de lei, vetos e relatórios oficiais, acesse o portal da casa legislativa ou órgão de governo:
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <a
                href={politician.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-primary"
              >
                🏛️ Consultar Tramitações no Portal Oficial ↗
              </a>
              <Link href={`/parlamentares/${politicianId}?aba=cargo`} className="btn btn-sm btn-ghost">
                ℹ️ Ver Atribuições do Cargo
              </Link>
            </div>
          </div>
        ) : (
          <Empty>Nenhuma proposição encontrada para os filtros selecionados.</Empty>
        )
      ) : (
        <div className="stack" style={{ gap: 16 }}>
          {filteredItems.map((p, idx) => (
            <article key={`${p.id}-${idx}`} className="card" style={{ transition: 'box-shadow 0.2s ease' }}>
              <div className="row between" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                <div className="row" style={{ gap: 8, alignItems: 'center' }}>
                  <span className="chip chip-blue" style={{ fontWeight: 700 }}>
                    {p.type} {p.number}/{p.year}
                  </span>
                  <strong>{proposalLabel(p)}</strong>
                </div>
                <div className="row" style={{ gap: 6, alignItems: 'center' }}>
                  <span className="small muted">Apresentado em {formatDate(p.lastMovementAt)}</span>
                  <KindBadge kind="OFFICIAL" />
                </div>
              </div>

              <h3 style={{ marginTop: 8, marginBottom: 6, fontSize: '1.1rem' }}>
                {p.title ?? p.summary}
              </h3>
              <p className="muted small" style={{ lineHeight: 1.5, margin: 0 }}>
                {p.summary}
              </p>

              <dl className="kv" style={{ marginTop: 12, marginBottom: 14 }}>
                <dt>Autoria</dt>
                <dd>
                  {p.authors.map((a, i) => (
                    <span key={a.id}>
                      {i > 0 && ', '}
                      <Link href={`/parlamentares/${a.id}`}>{a.name}</Link>
                    </span>
                  ))}
                </dd>
                <dt>Tema principal</dt>
                <dd>{p.topics.join(', ') || 'Legislação e Políticas Públicas'}</dd>
                <dt>Situação atual</dt>
                <dd>
                  <span style={{ fontWeight: 500, color: 'var(--text-main, #fff)' }}>
                    {p.currentStatus ?? 'Em tramitação regimental'}
                  </span>
                </dd>
                <dt>Última tramitação</dt>
                <dd>{formatDate(p.lastMovementAt)}</dd>
              </dl>

              <div
                className="row between"
                style={{
                  borderTop: '1px solid var(--border)',
                  paddingTop: 12,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 10,
                }}
              >
                <div className="row" style={{ gap: 12 }}>
                  <Link href={`/proposicoes/${p.id}`} className="small">
                    Ver histórico interno
                  </Link>
                  <a
                    href={p.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: '0.85rem',
                      fontWeight: 500,
                    }}
                  >
                    🏛️ Ficha Oficial de Tramitação ↗
                  </a>
                </div>
                <SourceLink source={p.source} compact />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
