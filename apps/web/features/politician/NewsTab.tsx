'use client';

import { Empty, ErrorState, KindBadge, Loading } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { SOURCE_TYPE_LABEL, sourceTypeToKind } from '@/lib/labels';

export function NewsTab({ politicianId }: { politicianId: string }) {
  const news = useAsync(() => api.getPoliticianNews(politicianId), [politicianId]);
  const pol = useAsync(() => api.getPolitician(politicianId), [politicianId]);

  if (news.loading && !news.data) return <Loading />;
  if (news.error) return <ErrorState error={news.error} onRetry={news.reload} />;
  const items = news.data ?? [];
  const politicianName = pol.data?.name || 'Parlamentar';

  return (
    <div className="stack" style={{ gap: 20 }}>
      {/* Box de Notícias Verídicas e Auditáveis */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(99, 102, 241, 0.05) 100%)',
          border: '1px solid rgba(14, 165, 233, 0.25)',
        }}
      >
        <div className="row between" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div className="row" style={{ gap: 8, alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: '1.2rem' }}>📰</span>
              <strong>Cobertura Jornalística Verídica e Fontes Acessíveis</strong>
              <span className="chip chip-blue" style={{ fontSize: '0.75rem' }}>FONTES REAIS</span>
            </div>
            <p className="small muted" style={{ margin: 0, lineHeight: 1.5 }}>
              Todas as notícias são agregadas diretamente de agências de comunicação públicas e veículos de imprensa
              consolidados (Agência Brasil, Agência Câmara, Agência Senado, G1, CNN Brasil, Estadão, Folha).
              Clique nos links para acessar o conteúdo na íntegra no veículo original.
            </p>
          </div>
        </div>

        {/* Hub de Acesso Rápido a Canais de Checagem */}
        <div style={{ marginTop: 14, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <span className="small muted" style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>
            Pesquisar cobertura em tempo real nos portais oficiais:
          </span>
          <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
            <a
              href={`https://www.camara.leg.br/busca-geral?termo=${encodeURIComponent(politicianName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.82rem' }}
            >
              🏛️ Agência Câmara ↗
            </a>
            <a
              href={`https://www12.senado.leg.br/noticias/busca?q=${encodeURIComponent(politicianName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.82rem' }}
            >
              ⚖️ Agência Senado ↗
            </a>
            <a
              href={`https://agenciabrasil.ebc.com.br/politica`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.82rem' }}
            >
              🇧🇷 Agência Brasil (EBC) ↗
            </a>
            <a
              href={`https://g1.globo.com/busca/?q=${encodeURIComponent(politicianName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.82rem' }}
            >
              🔍 G1 Política ↗
            </a>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <Empty>Nenhuma notícia encontrada para este parlamentar.</Empty>
      ) : (
        <div className="stack" style={{ gap: 16 }}>
          {items.map((n, idx) => (
            <article key={`${n.id}-${idx}`} className="card" style={{ transition: 'box-shadow 0.2s ease' }}>
              <div className="row between" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                <span className="small muted">
                  <strong style={{ color: 'var(--text-main, #fff)' }}>{n.sourceName}</strong> ·{' '}
                  {SOURCE_TYPE_LABEL[n.sourceType]} · publicado em {formatDate(n.publishedAt)}
                </span>
                <KindBadge kind={sourceTypeToKind(n.sourceType)} />
              </div>

              <h3 style={{ marginTop: 8, marginBottom: 6, fontSize: '1.1rem' }}>
                {n.title}
              </h3>
              {n.description && (
                <p className="muted small" style={{ lineHeight: 1.5, margin: '0 0 12px 0' }}>
                  {n.description}
                </p>
              )}

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                <a
                  href={n.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.85rem',
                  }}
                >
                  📰 Ler Matéria Completa no {n.sourceName} ↗
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
