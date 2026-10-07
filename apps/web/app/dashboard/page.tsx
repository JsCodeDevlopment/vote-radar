'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { FeedItemCard, PoliticianCard } from '@/components/politicians';
import { CompatibilityMeter, Empty, ErrorState, KindBadge, Loading, RequireLogin, Stat } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { api } from '@/lib/api';
import { formatPercent } from '@/lib/format';
import type { Compatibility, PoliticianSummary } from '@/lib/types';

export default function DashboardPage() {
  const { user, ready, followingIds } = useAuth();

  const following = useAsync(() => api.getFollowing(), [user?.id, followingIds.size], ready && !!user);
  const feed = useAsync(() => api.getFeed(true), [user?.id, followingIds.size], ready && !!user);

  const [compatScores, setCompatScores] = useState<Record<string, number | null>>({});
  const [loadingScores, setLoadingScores] = useState(false);

  useEffect(() => {
    if (!following.data || following.data.length === 0) {
      setCompatScores({});
      return;
    }
    let cancelled = false;
    setLoadingScores(true);

    Promise.allSettled(
      following.data.map((p) =>
        api.getCompatibility(p.id).then((c: Compatibility) => ({ id: p.id, score: c.score })),
      ),
    ).then((results) => {
      if (cancelled) return;
      const scores: Record<string, number | null> = {};
      for (const res of results) {
        if (res.status === 'fulfilled') {
          scores[res.value.id] = res.value.score;
        }
      }
      setCompatScores(scores);
      setLoadingScores(false);
    });

    return () => {
      cancelled = true;
    };
  }, [following.data]);

  if (!ready) return <Loading />;
  if (!user) {
    return (
      <RequireLogin message="Acesse sua conta para ver o feed e as métricas dos parlamentares que você acompanha.">
        <p className="small muted" style={{ marginTop: 12 }}>
          Você pode seguir parlamentares de qualquer estado e comparar votos com suas posições.
        </p>
      </RequireLogin>
    );
  }

  if (following.loading) return <Loading />;
  if (following.error) return <ErrorState error={following.error} onRetry={following.reload} />;

  const followedList: PoliticianSummary[] = following.data ?? [];
  const validScores = Object.values(compatScores).filter((s): s is number => s !== null);
  const avgScore = validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : null;

  // Contagem de atualizações do feed
  const feedItems = feed.data ?? [];
  const voteCount = feedItems.filter((i) => i.type === 'VOTE').length;
  const proposalCount = feedItems.filter((i) => i.type === 'PROPOSAL').length;
  const newsCount = feedItems.filter((i) => i.type === 'NEWS').length;
  const expenseCount = feedItems.filter((i) => i.type === 'EXPENSE').length;

  const [feedType, setFeedType] = useState<string>('ALL');

  const filteredFeed = feedItems.filter((i) => {
    if (feedType === 'ALL') return true;
    return i.type === feedType;
  });

  return (
    <div className="stack">
      <div className="card">
        <div className="row between">
          <div>
            <h1>Meu Painel</h1>
            <p className="muted">
              Você acompanha <strong>{followedList.length}</strong> parlamentar(es).
            </p>
          </div>
          <KindBadge kind="ANALYSIS" />
        </div>

        <div className="grid grid-2" style={{ marginTop: 16 }}>
          <div className="card" style={{ background: 'var(--bg)' }}>
            <div className="card-title">Compatibilidade média</div>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                {formatPercent(avgScore)}
              </div>
              <div style={{ marginTop: 8, maxWidth: 280 }}>
                <CompatibilityMeter score={avgScore} />
              </div>
              <p className="small muted" style={{ marginTop: 8 }}>
                {validScores.length > 0
                  ? `Calculada com base nas votações avaliáveis dos seus parlamentares.`
                  : `Defina suas políticas para calcular a compatibilidade.`}
              </p>
              <Link href="/politicas" className="small" style={{ fontWeight: 600 }}>
                Revisar minhas políticas →
              </Link>
            </div>
          </div>

          <div className="card" style={{ background: 'var(--bg)' }}>
            <div className="card-title">Atualizações recentes</div>
            <div className="grid grid-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginTop: 8 }}>
              <Stat value={voteCount} label="votações" />
              <Stat value={proposalCount} label="projetos movimentados" />
              <Stat value={newsCount} label="notícias" />
              <Stat value={expenseCount} label="lançamentos de despesa" />
            </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>Seus Parlamentares</h2>
          <Link href="/explorar">Adicionar mais parlamentares →</Link>
        </div>

        {followedList.length === 0 ? (
          <div className="card row between">
            <div>
              <strong>Você ainda não acompanha nenhum parlamentar.</strong>
              <p className="muted small">Busque deputados do seu estado ou temas de seu interesse para acompanhar.</p>
            </div>
            <Link href="/explorar" className="btn btn-primary">
              Explorar parlamentares
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {followedList.map((p) => (
              <PoliticianCard
                key={p.id}
                politician={p}
                score={loadingScores ? undefined : compatScores[p.id]}
                showFollow={true}
              />
            ))}
          </div>
        )}
      </section>

      <section className="section">
        {/* Plantão Jornalístico & Filtros de Categoria */}
        <div className="feed-journal-header">
          <div className="flex items-center gap-3">
            <div className="feed-live-ticker">
              <span className="feed-pulse-dot" />
              Plantão Cívico em Tempo Real
            </div>
            <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
              Fiscalização contínua dos parlamentares que você segue
            </span>
          </div>

          <div className="feed-category-filters">
            <button
              type="button"
              className={`feed-filter-btn ${feedType === 'ALL' ? 'active' : ''}`}
              onClick={() => setFeedType('ALL')}
            >
              ⚡ Todos ({feedItems.length})
            </button>
            <button
              type="button"
              className={`feed-filter-btn ${feedType === 'VOTE' ? 'active' : ''}`}
              onClick={() => setFeedType('VOTE')}
            >
              🗳️ Votações ({voteCount})
            </button>
            <button
              type="button"
              className={`feed-filter-btn ${feedType === 'EXPENSE' ? 'active' : ''}`}
              onClick={() => setFeedType('EXPENSE')}
            >
              💰 Gastos ({expenseCount})
            </button>
            <button
              type="button"
              className={`feed-filter-btn ${feedType === 'PROPOSAL' ? 'active' : ''}`}
              onClick={() => setFeedType('PROPOSAL')}
            >
              📄 Projetos ({proposalCount})
            </button>
            <button
              type="button"
              className={`feed-filter-btn ${feedType === 'NEWS' ? 'active' : ''}`}
              onClick={() => setFeedType('NEWS')}
            >
              📰 Notícias ({newsCount})
            </button>
          </div>
        </div>

        {feed.loading ? (
          <Loading />
        ) : feed.error ? (
          <ErrorState error={feed.error} onRetry={feed.reload} />
        ) : filteredFeed.length > 0 ? (
          <div className="space-y-4">
            {filteredFeed.map((item) => (
              <FeedItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <Empty>
            Nenhuma atividade do tipo selecionado encontrada nos parlamentares que você segue.
          </Empty>
        )}
      </section>
    </div>
  );
}
