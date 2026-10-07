'use client';

import { useMemo, useState } from 'react';
import { Bar, Empty, ErrorState, Loading, SourceLink } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { api } from '@/lib/api';
import { formatBRL, formatDate } from '@/lib/format';
import type { PoliticianDetail } from '@/lib/types';

export function AssetsTab({
  politicianId,
  politician,
}: {
  politicianId: string;
  politician?: PoliticianDetail;
}) {
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const assets = useAsync(() => api.getPoliticianAssets(politicianId), [politicianId]);

  const filteredItems = useMemo(() => {
    let raw = assets.data?.items ?? [];
    if (typeFilter !== 'ALL') {
      raw = raw.filter((item) => item.type === typeFilter);
    }
    const q = searchTerm.trim().toLowerCase();
    if (!q) return raw;
    return raw.filter(
      (item) =>
        item.type.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)),
    );
  }, [assets.data?.items, typeFilter, searchTerm]);

  if (assets.loading && !assets.data) return <Loading />;
  if (assets.error) return <ErrorState error={assets.error} onRetry={assets.reload} />;
  const d = assets.data;
  if (!d) return null;

  const maxType = Math.max(1, ...d.byType.map((t) => t.totalCents));
  const items = showAll ? filteredItems : filteredItems.slice(0, 20);

  return (
    <div className="stack" style={{ gap: 20 }}>
      {/* Box de Auditoria Cívica do TSE */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
        }}
      >
        <div className="row between" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div className="row" style={{ gap: 8, alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: '1.2rem' }}>🏛️</span>
              <strong>Declaração Oficial de Bens e Patrimônio (TSE DivulgaCandContas)</strong>
              <span className="chip chip-green" style={{ fontSize: '0.75rem' }}>100% OFICIAL</span>
            </div>
            <p className="small muted" style={{ margin: 0, lineHeight: 1.5 }}>
              Declaração patrimonial de entrega obrigatória por lei (Art. 11, § 1º, VII da Lei nº 9.504/1997)
              registrada junto à Justiça Eleitoral nas Eleições Oficiais de {d.electionYear}.
              Estes dados refletem o patrimônio pessoal declarado à Receita Federal e ao TSE, sendo distintos das
              despesas operacionais do mandato parlamentar (CEAP).
            </p>
          </div>
          <a
            href={d.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            📋 Ficha Oficial no TSE ↗
          </a>
        </div>
      </div>

      {/* Card de Resumo de Patrimônio */}
      <div className="card">
        <div className="row between" style={{ flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
          <div>
            <div className="card-title" style={{ marginBottom: 4 }}>
              Total em Bens Declarados
            </div>
            <div className="muted small">
              Prestação de contas eleitoral oficial das Eleições de {d.electionYear} ({d.items.length} itens registrados)
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              className="stat-value"
              style={{
                color: 'var(--primary, #f59e0b)',
                fontSize: '1.8rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              {formatBRL(d.totalCents)}
            </div>
            <span className="muted small">patrimônio total informado ao TSE</span>
          </div>
        </div>
      </div>

      {/* Distribuição por Tipo de Bem */}
      {d.byType.length > 0 && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: 12 }}>
            Composição do Patrimônio por Categoria
          </div>
          <div className="stack" style={{ gap: 8 }}>
            {d.byType.map((c) => (
              <Bar
                key={c.type}
                label={`${c.type} (${c.count} ${c.count === 1 ? 'item' : 'itens'})`}
                value={formatBRL(c.totalCents, true)}
                ratio={c.totalCents / maxType}
              />
            ))}
          </div>
        </div>
      )}

      {/* Listagem Detalhada de Bens */}
      <div className="card">
        <div className="row between" style={{ flexWrap: 'wrap', gap: 12, marginBottom: 14, alignItems: 'center' }}>
          <div className="row" style={{ gap: 8, alignItems: 'center' }}>
            <div className="card-title" style={{ margin: 0 }}>
              Detalhamento dos Bens ({filteredItems.length})
            </div>
          </div>

          <div className="row" style={{ gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {d.byType.length > 1 && (
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="input input-sm"
                style={{ width: 'auto', minWidth: 160 }}
              >
                <option value="ALL">Todas as categorias ({d.items.length})</option>
                {d.byType.map((t) => (
                  <option key={t.type} value={t.type}>
                    {t.type} ({t.count})
                  </option>
                ))}
              </select>
            )}

            <div className="row" style={{ gap: 6, alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Filtrar por descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-sm"
                style={{ width: 220 }}
              />
              {searchTerm && (
                <button className="btn btn-ghost btn-sm" onClick={() => setSearchTerm('')}>
                  Limpar
                </button>
              )}
            </div>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <Empty>
            {searchTerm || typeFilter !== 'ALL'
              ? 'Nenhum bem patrimonial corresponde aos filtros informados.'
              : 'Nenhum bem declarado encontrado para esta autoridade na Justiça Eleitoral.'}
          </Empty>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>#</th>
                  <th>Tipo do Bem</th>
                  <th>Detalhamento e Descrição Registrada</th>
                  <th className="num">Valor Declarado</th>
                  <th>Fonte</th>
                </tr>
              </thead>
              <tbody>
                {items.map((b) => (
                  <tr key={b.id}>
                    <td className="muted small" style={{ fontWeight: 600 }}>
                      #{b.order}
                    </td>
                    <td>
                      <span className="chip chip-blue" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {b.type}
                      </span>
                    </td>
                    <td>
                      <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.45, maxWidth: 640 }}>
                        {b.description}
                      </p>
                      {b.updatedAt && (
                        <span className="muted small" style={{ display: 'block', marginTop: 4 }}>
                          Atualizado em: {formatDate(b.updatedAt)}
                        </span>
                      )}
                    </td>
                    <td className="num" style={{ fontWeight: 700, whiteSpace: 'nowrap', color: 'var(--text-main, #fff)' }}>
                      {formatBRL(b.amountCents)}
                    </td>
                    <td>
                      <a
                        href={b.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-ghost"
                        style={{ fontSize: '0.8rem', padding: '3px 8px' }}
                      >
                        Abrir TSE ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredItems.length > 20 && (
          <div className="row center" style={{ marginTop: 14 }}>
            <button className="btn btn-sm btn-outline" onClick={() => setShowAll((v) => !v)}>
              {showAll ? 'Mostrar menos itens' : `Ver todos os ${filteredItems.length} bens`}
            </button>
          </div>
        )}
      </div>

      <SourceLink source={d.source} />
    </div>
  );
}
