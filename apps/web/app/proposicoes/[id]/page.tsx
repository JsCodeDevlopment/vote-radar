'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Empty, ErrorState, KindBadge, Loading, SourceLink, Stat } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { api } from '@/lib/api';
import { formatDate, formatDateTime, proposalLabel } from '@/lib/format';
import { CLASSIFIED_BY_LABEL } from '@/lib/labels';

export default function ProposalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const proposal = useAsync(() => api.getProposal(id), [id]);

  if (proposal.loading) return <Loading />;
  if (proposal.error || !proposal.data) {
    return <ErrorState error={proposal.error ?? new Error('Proposição não encontrada')} onRetry={proposal.reload} />;
  }

  const p = proposal.data;

  return (
    <div className="stack" style={{ maxWidth: 880, margin: '0 auto' }}>
      <div className="card">
        <div className="row between">
          <div>
            <span className="chip chip-blue" style={{ fontSize: '0.85rem', marginBottom: 6 }}>
              {proposalLabel(p)}
            </span>
            <h1 style={{ fontSize: '1.6rem', marginTop: 4 }}>{p.title ?? p.summary}</h1>
          </div>
          <KindBadge kind="OFFICIAL" />
        </div>

        <p className="muted" style={{ marginTop: 8, fontSize: '1rem', lineHeight: 1.6 }}>
          {p.summary}
        </p>

        <div style={{ marginTop: 16 }}>
          <dl className="kv">
            <dt>Autoria</dt>
            <dd>
              {p.authors.length === 0 ? (
                '—'
              ) : (
                p.authors.map((a, i) => (
                  <span key={a.id}>
                    {i > 0 && ', '}
                    <Link href={`/parlamentares/${a.id}`}>{a.name}</Link>
                  </span>
                ))
              )}
            </dd>
            <dt>Situação atual</dt>
            <dd>{p.currentStatus ?? '—'}</dd>
            <dt>Última movimentação</dt>
            <dd>{formatDate(p.lastMovementAt)}</dd>
            <dt>Temas</dt>
            <dd>{p.topics.join(', ') || 'Geral'}</dd>
          </dl>
        </div>

        <div style={{ marginTop: 16 }}>
          <SourceLink source={p.source} />
        </div>
      </div>

      {/* Políticas Relacionadas e Classificação */}
      <div className="card">
        <div className="row between">
          <div className="card-title">Políticas Públicas Vinculadas</div>
          <KindBadge kind="ANALYSIS" />
        </div>
        <p className="small muted">
          Como esta proposição se relaciona a políticas públicas para cálculo de compatibilidade com os cidadãos.
        </p>

        {p.policies.length === 0 ? (
          <Empty>Nenhuma política associada a esta proposição até o momento.</Empty>
        ) : (
          <div className="stack" style={{ marginTop: 12 }}>
            {p.policies.map((link) => (
              <div
                key={link.policyId}
                style={{
                  padding: '12px',
                  background: 'var(--bg)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="row between">
                  <strong>
                    {link.topicName} — {link.policyName}
                  </strong>
                  <span className={`chip ${link.supportsPolicy ? 'chip-green' : 'chip-red'}`}>
                    {link.supportsPolicy ? '✓ Favorece a política' : '✕ Contraria a política'}
                  </span>
                </div>
                {link.rationale && (
                  <p className="small" style={{ margin: '8px 0 4px', color: 'var(--text)' }}>
                    <strong>Justificativa da associação:</strong> {link.rationale}
                  </p>
                )}
                <div className="row between" style={{ marginTop: 6 }}>
                  <span className="small muted">
                    Método de classificação: <strong>{CLASSIFIED_BY_LABEL[link.classifiedBy]}</strong>
                    {link.confidence != null && ` (confiança: ${Math.round(link.confidence * 100)}%)`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Votações nominais realizadas */}
      <div className="card">
        <div className="row between">
          <div className="card-title">Votações Nominais ({p.votings.length})</div>
          <KindBadge kind="OFFICIAL" />
        </div>

        {p.votings.length === 0 ? (
          <Empty>Ainda não houve votação nominal registrada para este projeto.</Empty>
        ) : (
          <div className="stack" style={{ marginTop: 12 }}>
            {p.votings.map((v) => (
              <div
                key={v.id}
                style={{
                  padding: '12px',
                  background: 'var(--bg)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="row between">
                  <strong>{v.description ?? 'Votação em Plenário'}</strong>
                  <span className={`chip ${v.result?.toLowerCase().includes('aprov') ? 'chip-green' : 'chip-red'}`}>
                    {v.result ?? 'Concluída'}
                  </span>
                </div>
                <div className="row" style={{ marginTop: 8, gap: 16 }}>
                  <span className="small muted">Data: {formatDateTime(v.votedAt)}</span>
                  {v.tally.YES !== undefined && (
                    <span className="small">
                      SIM: <strong>{v.tally.YES}</strong>
                    </span>
                  )}
                  {v.tally.NO !== undefined && (
                    <span className="small">
                      NÃO: <strong>{v.tally.NO}</strong>
                    </span>
                  )}
                  {v.tally.ABSTENTION !== undefined && (
                    <span className="small">
                      Abstenções: <strong>{v.tally.ABSTENTION}</strong>
                    </span>
                  )}
                </div>
                <div style={{ marginTop: 8 }}>
                  <SourceLink source={v.source} compact />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Histórico completo de tramitação */}
      <div className="card">
        <div className="row between">
          <div className="card-title">Histórico de Tramitação</div>
          <KindBadge kind="OFFICIAL" />
        </div>
        <p className="small muted" style={{ marginBottom: 16 }}>
          Registro cronológico dos passos do projeto na casa legislativa.
        </p>

        {p.history.length === 0 ? (
          <Empty>Nenhum histórico registrado.</Empty>
        ) : (
          <ul className="timeline">
            {p.history.map((h) => (
              <li key={h.id}>
                <div className="timeline-date">{formatDate(h.changedAt)}</div>
                <strong>{h.newStatus}</strong>
                {h.description && <p className="small muted" style={{ margin: '2px 0 0' }}>{h.description}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
