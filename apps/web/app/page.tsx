'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { FeedItemCard, PoliticianCard, SearchBox } from '@/components/politicians';
import { Empty, ErrorState, Loading } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { api } from '@/lib/api';

export default function HomePage() {
  const { user, ready, followingIds } = useAuth();
  const hasFollowing = followingIds.size > 0;

  const following = useAsync(() => api.getFollowing(), [user?.id, followingIds.size], ready && !!user);
  const feed = useAsync(
    () => api.getFeed(!!user && hasFollowing),
    [user?.id, hasFollowing, followingIds.size],
    ready,
  );

  return (
    <>
      <section className="hero py-14 px-4 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-mono uppercase tracking-wider mb-6">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          Transparência Cívica e Auditoria Pública
        </div>

        <h1 className="text-3xl sm:text-5xl font-mono font-bold tracking-tight text-foreground max-w-3xl mx-auto leading-tight mb-4">
          Acompanhe quem você elegeu com dados 100% auditáveis.
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base font-sans max-w-xl mx-auto mb-8 leading-relaxed">
          Gastos detalhados nota a nota, votações nominais em plenário, proposições legislativas e notícias verificadas diretamente nas fontes oficiais.
        </p>

        <SearchBox />

        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <span className="text-xs font-mono text-muted-foreground mr-1">Filtros rápidos:</span>
          <Link href="/explorar?cargo=DEPUTADO_FEDERAL" className="v-btn -ghost -sm">
            Deputados Federais
          </Link>
          <Link href="/explorar?cargo=SENADOR" className="v-btn -ghost -sm">
            Senadores
          </Link>
          <Link href="/explorar?uf=SP" className="v-btn -ghost -sm">
            São Paulo
          </Link>
          <Link href="/explorar?uf=RJ" className="v-btn -ghost -sm">
            Rio de Janeiro
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold">◆</span>
            <h2 className="text-xl font-mono font-bold">Meus parlamentares</h2>
          </div>
          {user && (
            <Link href="/dashboard" className="text-primary text-sm font-mono hover:underline">
              Ver painel completo →
            </Link>
          )}
        </div>
        {!ready ? (
          <Loading />
        ) : !user ? (
          <div className="v-card row between p-6">
            <span className="text-muted-foreground text-sm font-mono">
              Crie uma conta para acompanhar parlamentares e comparar votos nominais com o seu posicionamento.
            </span>
            <Link href="/register" className="v-btn -accent -sm">
              Criar conta gratuita
            </Link>
          </div>
        ) : following.loading ? (
          <Loading />
        ) : following.data && following.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {following.data.map((p) => (
              <PoliticianCard key={p.id} politician={p} />
            ))}
          </div>
        ) : (
          <div className="v-card row between p-6">
            <span className="text-muted-foreground text-sm font-mono">
              Você ainda não está acompanhando nenhum parlamentar.
            </span>
            <Link href="/explorar" className="v-btn -accent -sm">
              Explorar lista oficial
            </Link>
          </div>
        )}
      </section>

      <section className="section">
        {/* Plantão Jornalístico Oficial */}
        <div className="feed-journal-header">
          <div className="flex items-center gap-3">
            <div className="feed-live-ticker">
              <span className="feed-pulse-dot" />
              Plantão Cívico Oficial
            </div>
            <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
              {user && hasFollowing
                ? 'Atualizações das autoridades que você acompanha'
                : 'Últimas movimentações apuradas nas bases oficiais da República'}
            </span>
          </div>

          <span className="text-xs font-mono text-muted-foreground">
            Auditoria Contínua & Neutra
          </span>
        </div>

        {feed.loading ? (
          <Loading />
        ) : feed.error ? (
          <ErrorState error={feed.error} onRetry={feed.reload} />
        ) : feed.data && feed.data.length > 0 ? (
          <div className="space-y-4">
            {feed.data.slice(0, 15).map((item) => (
              <FeedItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <Empty>Nenhuma atividade recente encontrada nas bases oficiais.</Empty>
        )}
      </section>
    </>
  );
}
