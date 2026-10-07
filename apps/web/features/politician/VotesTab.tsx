'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Empty, ErrorState, KindBadge, Loading, SourceLink } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { api } from '@/lib/api';
import { formatDate, proposalLabel } from '@/lib/format';
import { CLASSIFIED_BY_LABEL, COMPAT_LABEL, OFFICE_LABEL, POSITION_LABEL, VOTE_CHOICE_LABEL } from '@/lib/labels';
import type { Compatibility, CompatibilityItem, PoliticianDetail, PoliticianVote, VoteChoice } from '@/lib/types';

const CHOICE_CHIP: Record<VoteChoice, string> = {
  YES: 'chip-green',
  NO: 'chip-red',
  ABSTENTION: 'chip-gray',
  OBSTRUCTION: 'chip-gray',
  ABSENT: 'chip-gray',
  OTHER: 'chip-gray',
};

const COMPAT_ICON = { COMPATIBLE: '✓', INCOMPATIBLE: '✗', NOT_EVALUABLE: '–' } as const;
const COMPAT_CHIP = { COMPATIBLE: 'chip-green', INCOMPATIBLE: 'chip-red', NOT_EVALUABLE: 'chip-gray' } as const;

type Filter = 'ALL' | 'YES' | 'NO' | 'OTHER' | 'MINE';
const MANDATE_YEARS = [undefined, 2026, 2025, 2024, 2023] as const;

function matchesChoice(
  choice: string | undefined | null,
  rawChoice: string | undefined | null,
  target: 'YES' | 'NO' | 'OTHER',
): boolean {
  const normChoice = (choice || '').toUpperCase();
  const normRaw = (rawChoice || '').trim().toLowerCase();

  const isYes =
    normChoice === 'YES' ||
    normRaw.includes('sim') ||
    normRaw.includes('favor') ||
    normRaw.includes('aprov') ||
    normRaw === 'ap' ||
    normRaw === 's' ||
    normRaw === 'votou';

  if (target === 'YES') return isYes;

  const isNo =
    normChoice === 'NO' ||
    normRaw.includes('não') ||
    normRaw.includes('nao') ||
    normRaw.includes('contra') ||
    normRaw.includes('rejei') ||
    normRaw === 'rep' ||
    normRaw === 'n';

  if (target === 'NO') return isNo;

  if (target === 'OTHER') {
    return !isYes && !isNo;
  }
  return false;
}

export function VotesTab({
  politicianId,
  politician,
  compatibility,
}: {
  politicianId: string;
  politician?: PoliticianDetail;
  compatibility?: Compatibility;
}) {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [filter, setFilter] = useState<Filter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const votes = useAsync(
    () => api.getPoliticianVotes(politicianId, selectedYear),
    [politicianId, selectedYear],
  );

  const compatByVoting = useMemo(() => {
    const m = new Map<string, CompatibilityItem[]>();
    for (const i of compatibility?.items ?? []) m.set(i.votingId, [...(m.get(i.votingId) ?? []), i]);
    return m;
  }, [compatibility]);

  const all = votes.data ?? [];

  const counts = useMemo(() => {
    let yes = 0;
    let no = 0;
    let other = 0;
    for (const v of all) {
      if (matchesChoice(v.choice, v.rawChoice, 'YES')) yes++;
      else if (matchesChoice(v.choice, v.rawChoice, 'NO')) no++;
      else other++;
    }
    return { all: all.length, yes, no, other };
  }, [all]);

  const list = useMemo(() => {
    return all.filter((v) => {
      if (filter === 'YES' && !matchesChoice(v.choice, v.rawChoice, 'YES')) return false;
      if (filter === 'NO' && !matchesChoice(v.choice, v.rawChoice, 'NO')) return false;
      if (filter === 'OTHER' && !matchesChoice(v.choice, v.rawChoice, 'OTHER')) return false;
      if (filter === 'MINE' && !compatByVoting.has(v.voting.id)) return false;

      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const matchDesc = v.voting.description?.toLowerCase().includes(q) ?? false;
        const matchProp =
          v.proposal?.title?.toLowerCase().includes(q) ||
          v.proposal?.summary?.toLowerCase().includes(q) ||
          v.proposal?.type?.toLowerCase().includes(q) ||
          String(v.proposal?.number).includes(q);
        if (!matchDesc && !matchProp) return false;
      }

      return true;
    });
  }, [all, filter, searchQuery, compatByVoting]);

  if (votes.loading && !votes.data) return <Loading />;
  if (votes.error) return <ErrorState error={votes.error} onRetry={votes.reload} />;

  return (
    <div className="stack" style={{ gap: 18 }}>
      {/* Box de Auditoria e Verificabilidade de Votos */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)',
          border: '1px solid rgba(234, 88, 12, 0.25)',
        }}
      >
        <div className="row between" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div className="row" style={{ gap: 8, alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: '1.2rem' }}>🗳️</span>
              <strong>Votações Nominais e Deliberações Plenárias</strong>
              <span className="chip chip-green" style={{ fontSize: '0.75rem' }}>PAINEL OFICIAL</span>
            </div>
            <p className="small muted" style={{ margin: 0, lineHeight: 1.5 }}>
              Registros oficiais de votos nominais e deliberações extraídos dos painéis eletrônicos oficiais
              (Câmara dos Deputados, Senado Federal e Assembleias Legislativas).
              Todas as votações possuem ata oficial, resultado soberano e link auditável direto no portal do Legislativo.
            </p>
          </div>
        </div>
      </div>

      {/* Controles de Filtro: Ano do Mandato, Tipo de Voto e Busca */}
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
                placeholder="Buscar votação ou projeto..."
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

          {/* Filtros de Voto com Contadores Dinâmicos */}
          <div className="filters" style={{ margin: 0 }}>
            {(
              [
                ['ALL', `Todas (${counts.all})`],
                ['YES', `Votou SIM (${counts.yes})`],
                ['NO', `Votou NÃO (${counts.no})`],
                ['OTHER', `Abstenção / outros (${counts.other})`],
                ...(user ? [['MINE', 'Ligadas às minhas políticas']] : []),
              ] as [Filter, string][]
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                className={`btn btn-sm ${filter === k ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setFilter(k)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        all.length === 0 ? (
          <div className="card" style={{ padding: '32px 24px', textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 12 }}>🏛️</span>
            <h3 style={{ marginBottom: 8, fontSize: '1.25rem' }}>
              Nenhuma deliberação registrada para este ano
            </h3>
            <p className="muted" style={{ maxWidth: 620, margin: '0 auto 12px', lineHeight: 1.6 }}>
              Não constam registros de votação nominal para o período selecionado nas bases de dados oficiais do Legislativo ({politician?.bodyName || 'órgão oficial'}).
            </p>
            {selectedYear && (
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => setSelectedYear(undefined)}
              >
                🔄 Ver todo o mandato
              </button>
            )}
          </div>
        ) : (
          <div className="card" style={{ padding: '32px 24px', textAlign: 'center' }}>
            <p className="muted" style={{ margin: '0 0 12px' }}>
              Nenhuma votação encontrada com o filtro selecionado ({filter === 'YES' ? 'Votou SIM' : filter === 'NO' ? 'Votou NÃO' : filter === 'OTHER' ? 'Abstenção / outros' : 'Busca'}).
            </p>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => {
                setFilter('ALL');
                setSearchQuery('');
              }}
            >
              🔄 Limpar filtros e ver todas ({all.length})
            </button>
          </div>
        )
      ) : (
        <div className="stack" style={{ gap: 16 }}>
          {list.map((v, idx) => (
            <VoteCard key={`${v.id}-${idx}`} vote={v} compat={compatByVoting.get(v.voting.id)} loggedIn={!!user} />
          ))}
        </div>
      )}
    </div>
  );
}

function VoteCard({ vote: v, compat, loggedIn }: { vote: PoliticianVote; compat?: CompatibilityItem[]; loggedIn: boolean }) {
  return (
    <article className="card vote-card" style={{ transition: 'box-shadow 0.2s ease' }}>
      <div className="row between" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        <div>
          {v.proposal && (
            <span className="chip chip-blue" style={{ fontWeight: 700, marginRight: 8 }}>
              {v.proposal.type} {v.proposal.number}/{v.proposal.year}
            </span>
          )}
          {v.proposal && <strong>{proposalLabel(v.proposal)}</strong>}
          <span className="muted small"> · {formatDate(v.voting.votedAt)}</span>
        </div>
        <KindBadge kind="OFFICIAL" />
      </div>

      <h3 style={{ marginTop: 8, marginBottom: 6, fontSize: '1.05rem' }}>
        {v.proposal?.title ?? v.voting.description}
      </h3>
      {v.proposal && <p className="muted small" style={{ lineHeight: 1.5, margin: 0 }}>{v.proposal.summary}</p>}

      <div className="vote-grid" style={{ marginTop: 12, marginBottom: 12 }}>
        <span>Resultado Oficial</span>
        <strong>{v.voting.result ?? '—'}</strong>
        <span>Voto do Parlamentar</span>
        <span className={`chip ${CHOICE_CHIP[v.choice]}`} style={{ fontWeight: 700 }}>
          {v.rawChoice || VOTE_CHOICE_LABEL[v.choice]}
        </span>
      </div>

      {compat && compat.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 6 }}>
          <div className="row between">
            <strong className="small">Comparação com suas posições cívicas</strong>
            <span className="row" style={{ gap: 6 }}>
              <KindBadge kind="USER" />
              <KindBadge kind="ANALYSIS" />
            </span>
          </div>
          {compat.map((c) => (
            <div key={c.policyId} style={{ marginTop: 8 }}>
              <div className="vote-grid" style={{ margin: '4px 0' }}>
                <span>Política</span>
                <strong>
                  {c.topicName} — {c.policyName}
                </strong>
                <span>Sua posição</span>
                <strong>{POSITION_LABEL[c.userPosition]}</strong>
                <span>Compatibilidade</span>
                <span className={`chip ${COMPAT_CHIP[c.result]}`}>
                  {COMPAT_ICON[c.result]} {COMPAT_LABEL[c.result]}
                </span>
              </div>
              <p className="warning-note">
                ⚠ Esta classificação considera o voto registrado e a política associada ao projeto. Votar contra um
                projeto não significa necessariamente ser contra a política em geral.
              </p>
              <details className="why">
                <summary>Por que essa classificação?</summary>
                <p>{c.reason}</p>
                {c.rationale && (
                  <p>
                    <strong>Associação projeto → política:</strong> {c.rationale}
                  </p>
                )}
                <p className="muted">
                  Método: {CLASSIFIED_BY_LABEL[c.classifiedBy]}
                  {c.confidence != null && ` · confiança ${Math.round(c.confidence * 100)}%`}
                </p>
              </details>
            </div>
          ))}
        </div>
      )}

      {!compat && v.policies.length > 0 && (
        <p className="small muted" style={{ marginTop: 6 }}>
          Temas relacionados: {[...new Set(v.policies.map((p) => p.topicName))].join(', ')}
          {loggedIn ? ' · você não marcou posição nessas políticas.' : ''}
        </p>
      )}

      <div
        className="row between"
        style={{
          borderTop: '1px solid var(--border)',
          paddingTop: 12,
          marginTop: 10,
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div className="row" style={{ gap: 10, alignItems: 'center' }}>
          {v.proposal && (
            <Link
              href={`/proposicoes/${v.proposal.id}`}
              className="btn btn-sm btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
            >
              📜 Ver Detalhes do Projeto ➔
            </Link>
          )}
          <a
            href={v.voting.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
          >
            🏛️ Conferir no Portal Oficial ↗
          </a>
        </div>
        <SourceLink source={v.source} compact />
      </div>
    </article>
  );
}
