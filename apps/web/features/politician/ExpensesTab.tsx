'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Bar, Empty, ErrorState, Loading, SourceLink } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { api } from '@/lib/api';
import { formatBRL, formatDate, monthLabel } from '@/lib/format';
import { OFFICE_LABEL } from '@/lib/labels';
import type { PoliticianDetail } from '@/lib/types';

export function ExpensesTab({
  politicianId,
  politician,
}: {
  politicianId: string;
  politician?: PoliticianDetail;
}) {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [year, setYear] = useState<number>(currentYear);
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const exp = useAsync(() => api.getPoliticianExpenses(politicianId, year), [politicianId, year]);

  useEffect(() => {
    const years = exp.data?.availableYears;
    if (years && years.length > 0 && !years.includes(year)) {
      setYear(years[0]);
    }
  }, [exp.data?.availableYears, year]);

  const filteredItems = useMemo(() => {
    const rawItems = exp.data?.items ?? [];
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rawItems;
    return rawItems.filter(
      (item) =>
        item.category.toLowerCase().includes(q) ||
        (item.supplier && item.supplier.toLowerCase().includes(q)),
    );
  }, [exp.data?.items, searchTerm]);

  if (exp.loading && !exp.data) return <Loading />;
  if (exp.error) return <ErrorState error={exp.error} onRetry={exp.reload} />;
  const d = exp.data;
  if (!d) return null;

  const maxCat = Math.max(1, ...d.byCategory.map((c) => c.totalCents));
  const maxMonth = Math.max(1, ...d.byMonth.map((m) => m.totalCents));
  const items = showAll ? filteredItems : filteredItems.slice(0, 20);

  return (
    <div className="stack" style={{ gap: 20 }}>
      {/* Box de Auditoria Cívica Oficial */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
        }}
      >
        <div className="row between" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div className="row" style={{ gap: 8, alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: '1.2rem' }}>🔍</span>
              <strong>Auditoria Cívica e Prestação de Contas Verificável</strong>
              <span className="chip chip-green" style={{ fontSize: '0.75rem' }}>100% OFICIAL</span>
            </div>
            <p className="small muted" style={{ margin: 0, lineHeight: 1.5 }}>
              Todos os lançamentos exibidos são extraídos diretamente das fontes oficiais do Poder Público:
              Cota para o Exercício da Atividade Parlamentar (CEAP na Câmara e CEAPS no Senado) e Prestação de Contas
              Oficial do TSE (DivulgaCandContas) com notas fiscais, contratos, valores e CNPJ dos fornecedores.
              Para consultar o patrimônio e declaração de bens pessoais do político, acesse a aba <strong>Bens declarados</strong>.
            </p>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <Link
              href={`/parlamentares/${politicianId}?aba=bens`}
              className="btn btn-sm btn-ghost"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              💼 Ver Bens Declarados
            </Link>
            <a
              href={d.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              🏛️ Auditoria no Portal Oficial ↗
            </a>
          </div>
        </div>
      </div>

      {/* Seletor de Anos de Todo o Mandato */}
      <div className="card">
        <div className="row between" style={{ flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
          <div>
            <div className="card-title" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              Gastos por Ano de Mandato
              {d.year === currentYear && (
                <span className="chip chip-blue" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                  Ano Atual ({currentYear})
                </span>
              )}
            </div>
            <div className="row" style={{ gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="small muted">Selecione o ano:</span>
              <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
                {d.availableYears.map((y) => {
                  const isTseYear = y === 2022;
                  const isCurrent = y === currentYear;
                  const isExec =
                    politician?.office === 'PRESIDENTE' ||
                    politician?.office === 'GOVERNADOR' ||
                    politician?.office === 'DEPUTADO_ESTADUAL';
                  return (
                    <button
                      key={y}
                      type="button"
                      className={`btn btn-sm ${d.year === y ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => {
                        setYear(y);
                        setShowAll(false);
                      }}
                      title={
                        isTseYear
                          ? 'Prestação de Contas Eleitoral e Notas Fiscais no TSE'
                          : isExec
                            ? `Exercício orçamentário de governo de ${y}`
                            : `Cota Parlamentar do exercício de ${y}`
                      }
                    >
                      {y}
                      {isCurrent ? ' (Atual)' : ''}
                      {isTseYear && isExec ? ' • TSE' : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="stat-value" style={{ color: 'var(--text-main, #fff)', fontSize: '1.5rem', fontWeight: 700 }}>
              {d.totalCents > 0 ? formatBRL(d.totalCents) : 'Orçamento Público'}
            </div>
            <span className="muted small">
              {d.totalCents > 0
                ? d.year === 2022
                  ? 'total comprovado no TSE (2022)'
                  : `total auditado em ${d.year}`
                : `execução orçamentária de ${d.year}`}
            </span>
          </div>
        </div>

        {d.electoralSummary && d.totalCents === 0 && (
          <div
            style={{
              marginTop: 14,
              padding: '12px 16px',
              borderRadius: 8,
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <div className="small">
              💡 <strong>Prestação de Contas Eleitoral com Notas Fiscais:</strong> Este perfil possui{' '}
              <strong>{formatBRL(d.electoralSummary.totalCents)}</strong> em{' '}
              <strong>{d.electoralSummary.itemCount} comprovantes detalhados</strong> com fornecedor e CNPJ no TSE (2022).
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => {
                setYear(2022);
                setShowAll(false);
              }}
              style={{ fontSize: '0.8rem', padding: '4px 10px', whiteSpace: 'nowrap' }}
            >
              📑 Ver Notas de 2022 ({d.electoralSummary.itemCount})
            </button>
          </div>
        )}
      </div>

      {/* Gráficos por Categoria e por Mês (exibidos quando houver lançamentos) */}
      {d.totalCents > 0 && (
        <div className="grid grid-2">
          <div className="card">
            <div className="card-title">Por categoria em {d.year}</div>
            {d.byCategory.length === 0 ? (
              <Empty>Sem despesas registradas nesta categoria em {d.year}.</Empty>
            ) : (
              d.byCategory.map((c) => (
                <Bar key={c.category} label={c.category} value={formatBRL(c.totalCents, true)} ratio={c.totalCents / maxCat} />
              ))
            )}
          </div>
          <div className="card">
            <div className="card-title">Distribuição mensal ({d.year})</div>
            <div className="month-chart">
              {Array.from({ length: 12 }, (_, i) => {
                const m = d.byMonth.find((x) => x.month === i + 1);
                const h = m ? (m.totalCents / maxMonth) * 100 : 0;
                return (
                  <div className="month-col" key={i} title={m ? `${monthLabel(i + 1)}: ${formatBRL(m.totalCents)}` : ''}>
                    <div className="month-bar" style={{ height: `${h}%`, opacity: m ? 0.85 : 0.15 }} />
                    <span className="month-label">{monthLabel(i + 1)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Lançamentos Detalhados com Links de Notas Fiscais */}
      <div className="card">
        <div className="row between" style={{ flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
          <div>
            <div className="card-title" style={{ margin: 0 }}>
              Lançamentos e Comprovantes Oficiais ({filteredItems.length})
            </div>
            <p className="small muted" style={{ margin: '4px 0 0 0' }}>
              Exercício financeiro de {d.year}
            </p>
          </div>
          <div className="row" style={{ gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Filtrar por fornecedor ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-sm"
              style={{ width: 260 }}
            />
            {searchTerm && (
              <button className="btn btn-ghost btn-sm" onClick={() => setSearchTerm('')}>
                Limpar
              </button>
            )}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          searchTerm ? (
            <Empty>
              Nenhum lançamento corresponde à busca &quot;{searchTerm}&quot;.
              <div style={{ marginTop: 8 }}>
                <button className="btn btn-sm btn-ghost" onClick={() => setSearchTerm('')}>
                  Limpar busca
                </button>
              </div>
            </Empty>
          ) : politician?.office === 'PRESIDENTE' || politician?.office === 'GOVERNADOR' || politician?.office === 'DEPUTADO_ESTADUAL' ? (
            <div className="card" style={{ padding: '32px 24px', textAlign: 'center' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 12 }}>🏛️</span>
              <h3 style={{ marginBottom: 8, fontSize: '1.25rem' }}>
                Orçamento de Governo no Exercício de {d.year} ({OFFICE_LABEL[politician.office]})
              </h3>
              <p className="muted" style={{ maxWidth: 640, margin: '0 auto 12px', lineHeight: 1.6 }}>
                As despesas governamentais de mandato ({d.year}) para cargos do Poder Executivo e Assembleias Estaduais são executadas via orçamento público e auditáveis diretamente no Portal da Transparência oficial do órgão.
              </p>
              <p className="small muted" style={{ maxWidth: 600, margin: '0 auto 16px', lineHeight: 1.5 }}>
                Os lançamentos detalhados de despesas e notas fiscais comprovadas junto à Justiça Eleitoral estão disponíveis na prestação de contas de 2022.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    setYear(2022);
                    setShowAll(false);
                  }}
                >
                  📑 Ver Prestação de Contas Oficial de 2022 (Notas Fiscais e Fornecedores)
                </button>
                <a href={d.source.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline">
                  🏛️ Portal Oficial de Transparência ↗
                </a>
                <Link href={`/parlamentares/${politicianId}?aba=bens`} className="btn btn-sm btn-ghost">
                  💼 Ver Bens Declarados
                </Link>
              </div>
            </div>
          ) : (
            <Empty>
              As despesas deste cargo são auditadas e geridas pelo orçamento público correspondente. Acesse o botão de Auditoria no Portal Oficial acima para consultar os demonstrativos fiscais do órgão.
            </Empty>
          )
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Categoria da Despesa</th>
                  <th>Fornecedor / Favorecido</th>
                  <th className="num">Valor</th>
                  <th>Comprovante Auditável</th>
                </tr>
              </thead>
              <tbody>
                {items.map((e, idx) => (
                  <tr key={`${e.id}-${idx}`}>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDate(e.date)}</td>
                    <td>{e.category}</td>
                    <td>
                      <span style={{ fontWeight: 500 }}>{e.supplier ?? '—'}</span>
                    </td>
                    <td className="num" style={{ fontWeight: 600 }}>
                      {formatBRL(e.amountCents)}
                    </td>
                    <td>
                      {e.documentUrl ? (
                        <a
                          href={e.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-ghost"
                          style={{
                            fontSize: '0.8rem',
                            padding: '3px 8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            color: 'var(--primary, #3b82f6)',
                          }}
                          title="Abrir nota fiscal ou recibo eletrônico original"
                        >
                          📄 Abrir Documento ↗
                        </a>
                      ) : (
                        <a
                          href={e.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="small muted"
                        >
                          🏛️ Portal ↗
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredItems.length > 20 && (
          <div style={{ marginTop: 14, textAlign: 'center' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowAll((s) => !s)}>
              {showAll ? 'Mostrar menos (primeiros 20)' : `Exibir todos os lançamentos (${filteredItems.length})`}
            </button>
          </div>
        )}

        <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <SourceLink source={d.source} />
        </div>
      </div>
    </div>
  );
}
