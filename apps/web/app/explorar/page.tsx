'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { PoliticianCard } from '@/components/politicians';
import { Empty, ErrorState, Loading } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { api } from '@/lib/api';
import { OFFICE_LABEL, UFS } from '@/lib/labels';

const PAGE_SIZE_OPTIONS = [24, 48, 96] as const;

function ExploreInner() {
  const router = useRouter();
  const params = useSearchParams();

  const q = params.get('q') ?? '';
  const uf = params.get('uf') ?? '';
  const party = params.get('partido') ?? '';
  const office = params.get('cargo') ?? '';
  const currentPage = Math.max(1, parseInt(params.get('pagina') ?? '1', 10) || 1);
  const pageSize = Math.max(12, Math.min(100, parseInt(params.get('itens') ?? '24', 10) || 24));

  const [text, setText] = useState(q);

  useEffect(() => {
    setText(q);
  }, [q]);

  const parties = useAsync(() => api.listParties(), []);
  const list = useAsync(
    () => api.listPoliticians({ q, uf, party, office, page: currentPage, pageSize }),
    [q, uf, party, office, currentPage, pageSize],
  );

  function update(next: Record<string, string | number | undefined>, resetPage = true) {
    const s = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v !== undefined && v !== '' && v !== null) {
        s.set(k, String(v));
      } else {
        s.delete(k);
      }
    }
    if (resetPage) {
      s.set('pagina', '1');
    }
    router.replace(`/explorar${s.toString() ? `?${s}` : ''}`, { scroll: false });
  }

  function goToPage(p: number) {
    const s = new URLSearchParams(params.toString());
    s.set('pagina', String(p));
    router.replace(`/explorar${s.toString() ? `?${s}` : ''}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const total = list.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Gera páginas para o controle de paginação (ex: 1, 2, 3 ... 25)
  const paginationPages = useMemo(() => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push('ellipsis');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }

    pages.push(totalPages);
    return pages;
  }, [currentPage, totalPages]);

  const hasActiveFilters = Boolean(q || uf || party || office);

  return (
    <>
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-mono uppercase tracking-wider mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Base Oficial da República Federativa do Brasil
        </div>
        <h1 className="text-3xl font-mono font-bold tracking-tight text-foreground">
          Explorar parlamentares e governantes em exercício
        </h1>
        <p className="text-muted-foreground text-sm font-sans mt-1">
          Fiscalize 100% dos governantes e representantes em exercício no Brasil: Presidência da República, todos os 27 Governadores, Senado Federal, Câmara dos Deputados e Deputados Estaduais de todo o país.
        </p>
      </div>

      {/* Barra de Busca Principal e Filtros Rápidos */}
      <form
        className="v-card p-4 mb-6 flex flex-wrap gap-3 items-center"
        onSubmit={(e) => {
          e.preventDefault();
          update({ q: text.trim() });
        }}
      >
        <div className="relative flex-1 min-w-[240px]">
          <input
            className="input w-full pr-8"
            placeholder="Buscar por nome, estado (ex: SP) ou partido…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {text && (
            <button
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
              onClick={() => {
                setText('');
                update({ q: '' });
              }}
              title="Limpar busca"
            >
              ✕
            </button>
          )}
        </div>

        <select
          className="select min-w-[170px]"
          value={office}
          onChange={(e) => update({ cargo: e.target.value })}
        >
          <option value="">Todos os cargos</option>
          <option value="PRESIDENTE">Presidente da República</option>
          <option value="GOVERNADOR">Governador(a) de Estado</option>
          <option value="SENADOR">Senador(a) da República</option>
          <option value="DEPUTADO_FEDERAL">Deputado(a) Federal</option>
          <option value="DEPUTADO_ESTADUAL">Deputado(a) Estadual</option>
        </select>

        <select
          className="select min-w-[140px]"
          value={uf}
          onChange={(e) => update({ uf: e.target.value })}
        >
          <option value="">Todos os estados (UF)</option>
          {UFS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>

        <select
          className="select min-w-[140px]"
          value={party}
          onChange={(e) => update({ partido: e.target.value })}
        >
          <option value="">Todos os partidos</option>
          {parties.data?.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <button className="v-btn -accent -md" type="submit">
          Buscar
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            className="v-btn -ghost -md text-muted-foreground hover:text-foreground"
            onClick={() => {
              setText('');
              router.replace('/explorar');
            }}
          >
            Limpar tudo
          </button>
        )}
      </form>

      {/* Barra de Status e Controles de Paginação Superior */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-2 border-b border-border/40">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            {list.loading ? (
              'Consultando base oficial…'
            ) : total > 0 ? (
              <>
                Exibindo{' '}
                <strong className="text-foreground">
                  {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, total)}
                </strong>{' '}
                de <strong className="text-primary">{total}</strong> parlamentares em exercício
              </>
            ) : (
              'Nenhum registro encontrado'
            )}
          </span>
          {hasActiveFilters && (
            <span className="text-xs px-2 py-0.5 rounded bg-secondary/15 text-secondary font-mono border border-secondary/30">
              Filtro ativo
            </span>
          )}
        </div>

        {/* Seletor de itens por página */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span>Itens por página:</span>
          <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
            {PAGE_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                type="button"
                className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                  pageSize === size
                    ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                onClick={() => update({ itens: size })}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {list.loading && !list.data ? (
        <Loading />
      ) : list.error ? (
        <ErrorState error={list.error} onRetry={list.reload} />
      ) : list.data && list.data.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.data.items.map((p, idx) => (
              <PoliticianCard key={`${p.id}-${idx}`} politician={p} />
            ))}
          </div>

          {/* Paginação Inferior Completa */}
          {totalPages > 1 && (
            <div className="v-card p-4 mt-8 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs font-mono text-muted-foreground">
                Página <strong className="text-foreground">{currentPage}</strong> de{' '}
                <strong className="text-foreground">{totalPages}</strong>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  className="v-btn -ghost -sm"
                  disabled={currentPage <= 1}
                  onClick={() => goToPage(1)}
                  title="Primeira página"
                >
                  « Primeira
                </button>
                <button
                  type="button"
                  className="v-btn -ghost -sm"
                  disabled={currentPage <= 1}
                  onClick={() => goToPage(currentPage - 1)}
                  title="Página anterior"
                >
                  ‹ Anterior
                </button>

                <div className="flex items-center gap-1 mx-1">
                  {paginationPages.map((item, idx) =>
                    item === 'ellipsis' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-xs text-muted-foreground font-mono">
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        className={`w-8 h-8 rounded-md text-xs font-mono transition-colors ${
                          currentPage === item
                            ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                            : 'bg-card border border-border text-foreground hover:bg-muted/50'
                        }`}
                        onClick={() => goToPage(item)}
                      >
                        {item}
                      </button>
                    ),
                  )}
                </div>

                <button
                  type="button"
                  className="v-btn -ghost -sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                  title="Próxima página"
                >
                  Próxima ›
                </button>
                <button
                  type="button"
                  className="v-btn -ghost -sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => goToPage(totalPages)}
                  title="Última página"
                >
                  Última »
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <Empty>Nenhum parlamentar em exercício encontrado para os critérios informados.</Empty>
      )}
    </>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<Loading />}>
      <ExploreInner />
    </Suspense>
  );
}
