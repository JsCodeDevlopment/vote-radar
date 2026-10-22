'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { FeedItemCard, PoliticianCard } from '@/components/politicians';
import { Empty, ErrorState, Loading } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { api } from '@/lib/api';
import { OFFICE_LABEL, UFS } from '@/lib/labels';
import type { Office } from '@/lib/types';
import {
  Search,
  Sparkles,
  TrendingUp,
  Building2,
  Scale,
  Receipt,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Filter,
  CheckCircle2,
  MapPin,
  Users,
  FileText,
  ExternalLink,
  Eye,
  Landmark,
  Megaphone,
  Vote,
  Coins,
  BookOpen,
} from 'lucide-react';

const POPULAR_UFS = ['SP', 'RJ', 'MG', 'BA', 'RS', 'PR', 'PE', 'CE', 'DF', 'SC', 'GO'] as const;

type OfficeFilter = 'ALL' | 'DEPUTADO_FEDERAL' | 'DEPUTADO_ESTADUAL' | 'SENADOR' | 'GOVERNADOR' | 'PRESIDENTE';
type FeedFilter = 'ALL' | 'VOTE' | 'EXPENSE' | 'PROPOSAL' | 'NEWS';

export default function HomePage() {
  const router = useRouter();
  const { user, ready, followingIds } = useAuth();
  const hasFollowing = followingIds.size > 0;

  // Filtros interativos da Vitrine de Parlamentares
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOffice, setSelectedOffice] = useState<OfficeFilter>('ALL');
  const [selectedUf, setSelectedUf] = useState<string>('');
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('ALL');

  // Consulta de parlamentares em tempo real para a vitrine da home
  const politiciansAsync = useAsync(
    () =>
      api.listPoliticians({
        office: selectedOffice === 'ALL' ? undefined : selectedOffice,
        uf: selectedUf || undefined,
        pageSize: 8,
      }),
    [selectedOffice, selectedUf]
  );

  // Meus parlamentares seguidos (se logado)
  const following = useAsync(
    () => api.getFollowing(),
    [user?.id, followingIds.size],
    ready && !!user
  );

  // Feed cívico oficial em tempo real
  const feed = useAsync(
    () => api.getFeed(!!user && hasFollowing),
    [user?.id, hasFollowing, followingIds.size],
    ready
  );

  // Filtragem local do feed por categoria
  const filteredFeed = useMemo(() => {
    if (!feed.data) return [];
    if (feedFilter === 'ALL') return feed.data.slice(0, 10);
    return feed.data.filter((item) => item.type === feedFilter).slice(0, 10);
  }, [feed.data, feedFilter]);

  // Submissão da busca
  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedOffice !== 'ALL') params.set('cargo', selectedOffice);
    if (selectedUf) params.set('uf', selectedUf);
    router.push(`/explorar${params.toString() ? `?${params.toString()}` : ''}`);
  }

  // Título dinâmico da vitrine
  const showcaseTitle = useMemo(() => {
    if (selectedUf) {
      const officeName =
        selectedOffice === 'DEPUTADO_FEDERAL'
          ? 'Deputados Federais'
          : selectedOffice === 'DEPUTADO_ESTADUAL'
            ? 'Deputados Estaduais'
            : selectedOffice === 'SENADOR'
              ? 'Senadores'
              : selectedOffice === 'GOVERNADOR'
                ? 'Governador'
                : 'Parlamentares e Governantes';
      return `${officeName} de ${selectedUf}`;
    }
    if (selectedOffice === 'DEPUTADO_FEDERAL') return 'Deputados Federais em Exercício';
    if (selectedOffice === 'DEPUTADO_ESTADUAL') return 'Deputados Estaduais em Exercício';
    if (selectedOffice === 'SENADOR') return 'Senadores da República em Exercício';
    if (selectedOffice === 'GOVERNADOR') return 'Governadores dos Estados Brasileiros';
    if (selectedOffice === 'PRESIDENTE') return 'Presidência da República';
    return 'Parlamentares e Lideranças em Destaque';
  }, [selectedOffice, selectedUf]);

  return (
    <>
      {/* ───────── HERO SECTION MODERNO & DE ALTO IMPACTO ───────── */}
      <section className="home-hero-container">
        <div className="home-hero-mesh" />
        <div className="home-hero-glow-1" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge de Auditoria Cívica Oficial */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono uppercase tracking-wider mb-6 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span>Radar Cívico Oficial da República</span>
            <span className="text-muted-foreground/60">|</span>
            <span className="text-muted-foreground text-[11px] normal-case hidden sm:inline">
              Dados 100% auditáveis sem cortes
            </span>
          </div>

          {/* Título Principal de Impacto */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-mono font-bold tracking-tight text-foreground leading-[1.15] mb-5">
            Acompanhe quem você elegeu com{' '}
            <span className="text-primary underline decoration-primary/40 underline-offset-8">
              dados 100% auditáveis
            </span>
            .
          </h1>

          {/* Subtítulo Descritivo */}
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg font-sans max-w-2xl mx-auto mb-8 leading-relaxed">
            Fiscalize votos nominais em plenário, despesas nota a nota da cota parlamentar (CEAP),
            tramitações de leis e o destino de <strong>R$ 5,5 trilhões</strong> do orçamento federal.
          </p>

          {/* Barra de Busca Omnibox Refinada */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto flex items-center gap-2 p-2 rounded-2xl bg-card/90 border border-border/80 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-2xl backdrop-blur-md transition-all mb-6"
          >
            <div className="pl-3 text-muted-foreground flex items-center justify-center">
              <Search size={20} />
            </div>
            <input
              type="text"
              className="w-full bg-transparent px-3 py-2 text-foreground font-mono text-sm sm:text-base placeholder:text-muted-foreground/70 outline-none"
              placeholder="Buscar por nome do deputado, senador, partido ou estado…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-mono text-muted-foreground hover:text-foreground px-2 py-1 rounded"
              >
                Limpar
              </button>
            )}
            <button
              type="submit"
              className="v-btn -accent -sm sm:-md shrink-0 font-mono font-bold px-5 rounded-xl shadow-md"
            >
              Consultar
            </button>
          </form>

          {/* Filtros de Cargo Rápidos no Hero */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <span className="text-xs font-mono text-muted-foreground mr-1 hidden sm:inline">
              Filtrar cargo:
            </span>

            <button
              type="button"
              onClick={() => setSelectedOffice('ALL')}
              className={`home-pill-filter ${selectedOffice === 'ALL' ? 'active' : ''}`}
            >
              <Sparkles size={14} />
              Todos
            </button>
            <button
              type="button"
              onClick={() => setSelectedOffice('DEPUTADO_FEDERAL')}
              className={`home-pill-filter ${selectedOffice === 'DEPUTADO_FEDERAL' ? 'active' : ''}`}
            >
              <Users size={14} />
              Deputados Federais (513)
            </button>
            <button
              type="button"
              onClick={() => setSelectedOffice('DEPUTADO_ESTADUAL')}
              className={`home-pill-filter ${selectedOffice === 'DEPUTADO_ESTADUAL' ? 'active' : ''}`}
            >
              <Landmark size={14} />
              Deputados Estaduais (1.059)
            </button>
            <button
              type="button"
              onClick={() => setSelectedOffice('SENADOR')}
              className={`home-pill-filter ${selectedOffice === 'SENADOR' ? 'active' : ''}`}
            >
              <Scale size={14} />
              Senadores (81)
            </button>
            <button
              type="button"
              onClick={() => setSelectedOffice('GOVERNADOR')}
              className={`home-pill-filter ${selectedOffice === 'GOVERNADOR' ? 'active' : ''}`}
            >
              <Building2 size={14} />
              Governadores (27)
            </button>
            <button
              type="button"
              onClick={() => setSelectedOffice('PRESIDENTE')}
              className={`home-pill-filter ${selectedOffice === 'PRESIDENTE' ? 'active' : ''}`}
            >
              🇧🇷 Presidência
            </button>
          </div>

          {/* Barra Rápida de Estados (UFs) */}
          <div className="pt-4 border-t border-border/40 flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-xs font-mono text-muted-foreground flex items-center gap-1 mr-1">
              <MapPin size={13} className="text-primary" />
              Por estado:
            </span>

            <button
              type="button"
              onClick={() => setSelectedUf('')}
              className={`home-state-chip ${selectedUf === '' ? 'active' : ''}`}
            >
              Brasil (BR)
            </button>

            {POPULAR_UFS.map((uf) => (
              <button
                key={uf}
                type="button"
                onClick={() => setSelectedUf(selectedUf === uf ? '' : uf)}
                className={`home-state-chip ${selectedUf === uf ? 'active' : ''}`}
              >
                {uf}
              </button>
            ))}

            {/* Seletor dropdown para todos os 27 estados */}
            <select
              value={selectedUf}
              onChange={(e) => setSelectedUf(e.target.value)}
              className="bg-card/80 border border-border text-foreground font-mono text-xs rounded-lg px-2.5 py-1 outline-none cursor-pointer hover:border-primary transition-colors ml-1"
              title="Todos os estados"
            >
              <option value="">Outros estados…</option>
              {UFS.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ───────── PAINEL DE INDICADORES DA REPÚBLICA (KPIS) ───────── */}
      <section className="home-kpi-grid">
        <div className="home-kpi-card">
          <div className="home-kpi-card-bar" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Câmara dos Deputados
            </span>
            <Users size={18} className="text-primary" />
          </div>
          <div className="text-3xl font-mono font-bold text-foreground mb-1">513</div>
          <p className="text-xs text-muted-foreground">
            Deputados federais fiscalizados em presença, votos, proposições e despesas da CEAP.
          </p>
        </div>

        <div className="home-kpi-card">
          <div className="home-kpi-card-bar" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Senado Federal
            </span>
            <Scale size={18} className="text-primary" />
          </div>
          <div className="text-3xl font-mono font-bold text-foreground mb-1">81</div>
          <p className="text-xs text-muted-foreground">
            Senadores da República acompanhados em votações nominais, comissões e PECs.
          </p>
        </div>

        <div className="home-kpi-card">
          <div className="home-kpi-card-bar" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Orçamento Federal
            </span>
            <Landmark size={18} className="text-primary" />
          </div>
          <div className="text-3xl font-mono font-bold text-primary mb-1">R$ 5,5 Tri</div>
          <p className="text-xs text-muted-foreground">
            Despesas da União mapeadas por ministérios, programas e emendas parlamentares.
          </p>
        </div>

        <div className="home-kpi-card">
          <div className="home-kpi-card-bar" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Autoridades Oficiais
            </span>
            <ShieldCheck size={18} className="text-primary" />
          </div>
          <div className="text-3xl font-mono font-bold text-foreground mb-1">
            {politiciansAsync.data?.total ? `${politiciansAsync.data.total}` : '1.816+'}
          </div>
          <p className="text-xs text-muted-foreground">
            Base oficial e auditável de governantes, senadores, deputados federais e estaduais.
          </p>
        </div>
      </section>

      {/* ───────── MEUS PARLAMENTARES (SE LOGADO COM SEGUIDOS) ───────── */}
      {user && hasFollowing && (
        <section className="section mb-10">
          <div className="section-head">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <h2 className="text-xl font-mono font-bold">Parlamentares que você acompanha</h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {followingIds.size} {followingIds.size === 1 ? 'autoridade' : 'autoridades'}
              </span>
            </div>
            <Link href="/dashboard" className="text-primary text-sm font-mono hover:underline inline-flex items-center gap-1">
              Painel completo de votos e despesas →
            </Link>
          </div>

          {following.loading ? (
            <Loading label="Carregando seus parlamentares..." />
          ) : following.data && following.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {following.data.slice(0, 4).map((p) => (
                <PoliticianCard key={p.id} politician={p} />
              ))}
            </div>
          ) : null}
        </section>
      )}

      {/* ───────── VITRINE ATIVA DE PARLAMENTARES EM EXERCÍCIO ───────── */}
      <section className="section mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-3 border-b border-border/60">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider mb-1.5">
              <span>●</span>
              <span>Consulta Direta aos Representantes</span>
            </div>
            <h2 className="text-2xl font-mono font-bold text-foreground flex items-center gap-2">
              {showcaseTitle}
            </h2>
            <p className="text-xs font-mono text-muted-foreground mt-1">
              Consulte a ficha completa, despesas nota a nota, presenças e votações nominais.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/explorar${
                selectedOffice !== 'ALL' || selectedUf
                  ? `?${new URLSearchParams({
                      ...(selectedOffice !== 'ALL' ? { cargo: selectedOffice } : {}),
                      ...(selectedUf ? { uf: selectedUf } : {}),
                    }).toString()}`
                  : ''
              }`}
              className="v-btn -accent -sm font-mono font-bold shadow-sm inline-flex items-center gap-1.5"
            >
              <span>Ver todos no diretório</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Estado da Grade de Parlamentares */}
        {politiciansAsync.loading ? (
          <Loading label="Carregando parlamentares da base oficial..." />
        ) : politiciansAsync.error ? (
          <ErrorState error={politiciansAsync.error} onRetry={politiciansAsync.reload} />
        ) : politiciansAsync.data && politiciansAsync.data.items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {politiciansAsync.data.items.map((politician) => (
                <PoliticianCard key={politician.id} politician={politician} />
              ))}
            </div>

            {/* Rodapé da Vitrine com Botão de Ação */}
            <div className="mt-8 text-center p-6 rounded-2xl bg-card/60 border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <span className="font-mono text-sm font-bold text-foreground block">
                  Deseja filtrar por outros partidos ou municípios?
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  O diretório completo contém histórico de patrimônio declarado, servidores de gabinete e discursos.
                </span>
              </div>
              <Link
                href={`/explorar${
                  selectedOffice !== 'ALL' || selectedUf
                    ? `?${new URLSearchParams({
                        ...(selectedOffice !== 'ALL' ? { cargo: selectedOffice } : {}),
                        ...(selectedUf ? { uf: selectedUf } : {}),
                      }).toString()}`
                    : ''
                }`}
                className="v-btn -ghost -sm font-mono shrink-0 hover:border-primary"
              >
                Explorar busca avançada →
              </Link>
            </div>
          </>
        ) : (
          <Empty>
            Nenhum parlamentar encontrado para os filtros selecionados. Tente alterar o estado ou o cargo.
          </Empty>
        )}
      </section>

      {/* ───────── CENTRAIS DE FISCALIZAÇÃO CÍVICA (4 PILARES) ───────── */}
      <section className="section mb-12">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider mb-1.5">
            <span>◆</span>
            <span>Módulos de Auditoria Cívica</span>
          </div>
          <h2 className="text-2xl font-mono font-bold text-foreground">
            O que você pode fiscalizar no Vote Radar
          </h2>
          <p className="text-xs sm:text-sm font-sans text-muted-foreground mt-1">
            Ferramentas independentes desenvolvidas para colocar o controle dos gastos e das leis nas mãos do cidadão.
          </p>
        </div>

        <div className="home-feature-grid">
          {/* Pilar 1: Gastos da União */}
          <Link href="/gastos-uniao" className="home-feature-card group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider font-bold">
                  Auditoria Orçamentária
                </span>
                <span className="text-2xl">🏛️</span>
              </div>
              <h3 className="text-xl font-mono font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                Gastos da União (R$ 5,5 Trilhões)
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-sans">
                Raio-X completo do Orçamento Geral da União: quanto cada ministério arrecada e gasta,
                repasses de saúde, educação, previdência e as polêmicas emendas parlamentares.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary group-hover:translate-x-1 transition-transform">
              <span>Navegar pelo Orçamento da República</span>
              <ChevronRight size={16} />
            </div>
          </Link>

          {/* Pilar 2: Plenário e Votações Nominais */}
          <Link href="/explorar?cargo=DEPUTADO_FEDERAL" className="home-feature-card group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-500 uppercase tracking-wider font-bold">
                  Plenário Oficial
                </span>
                <span className="text-2xl">🗳️</span>
              </div>
              <h3 className="text-xl font-mono font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                Auditoria de Votações Nominais
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-sans">
                Saiba com clareza quem votou <strong>SIM</strong>, <strong>NÃO</strong> ou se absteve
                em reformas tributárias, marcos fiscais, segurança pública e pautas sociais.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary group-hover:translate-x-1 transition-transform">
              <span>Consultar Votações Nominais</span>
              <ChevronRight size={16} />
            </div>
          </Link>

          {/* Pilar 3: Cota Parlamentar (CEAP) */}
          <Link href="/explorar" className="home-feature-card group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 uppercase tracking-wider font-bold">
                  Cota Parlamentar (CEAP)
                </span>
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-mono font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                Gastos com Combustível & Viagens
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-sans">
                Verifique nota fiscal por nota fiscal de cada deputado e senador: aluguel de carros de luxo,
                voos, consultorias terceirizadas e reembolsos de alimentação.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary group-hover:translate-x-1 transition-transform">
              <span>Auditar Reembolsos e Fornecedores</span>
              <ChevronRight size={16} />
            </div>
          </Link>

          {/* Pilar 4: Guia Como Cobrar */}
          <Link href="/como-cobrar" className="home-feature-card group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-500 uppercase tracking-wider font-bold">
                  Participação Cidadã
                </span>
                <span className="text-2xl">📢</span>
              </div>
              <h3 className="text-xl font-mono font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                Guia Cívico: Como Cobrar
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-sans">
                Modelos prontos de ofício, canais diretos de WhatsApp de gabinetes, ouvidorias e
                requerimentos da Lei de Acesso à Informação (LAI) para exigir respostas.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary group-hover:translate-x-1 transition-transform">
              <span>Acessar Modelos e Instruções</span>
              <ChevronRight size={16} />
            </div>
          </Link>
        </div>
      </section>

      {/* ───────── GUIA RÁPIDO: COMO EXERCER O CONTROLE SOCIAL ───────── */}
      <section className="section mb-12">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider mb-1.5">
            <span>⚙️</span>
            <span>Método de Fiscalização</span>
          </div>
          <h2 className="text-2xl font-mono font-bold text-foreground">
            Como funciona a fiscalização no Vote Radar
          </h2>
          <p className="text-xs sm:text-sm font-sans text-muted-foreground mt-1">
            Três etapas diretas para você transformar transparência pública em poder de cobrança cidadã.
          </p>
        </div>

        <div className="home-steps-grid">
          <div className="home-step-card">
            <div className="home-step-num">
              <span>01</span>
              <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 uppercase tracking-wide">
                Busca
              </span>
            </div>
            <h4 className="text-base font-mono font-bold text-foreground mb-2">
              Localize seu Representante
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pesquise pelo seu estado ou partido. Descubra quais deputados e senadores têm assento em Brasília
              falando em nome da sua região.
            </p>
          </div>

          <div className="home-step-card">
            <div className="home-step-num">
              <span>02</span>
              <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 uppercase tracking-wide">
                Auditoria
              </span>
            </div>
            <h4 className="text-base font-mono font-bold text-foreground mb-2">
              Analise Dados Brutos Reais
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sem narrativas de redes sociais ou viés ideológico: consulte as notas fiscais autênticas,
              presença em comissões e histórico nominal de votações.
            </p>
          </div>

          <div className="home-step-card">
            <div className="home-step-num">
              <span>03</span>
              <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 uppercase tracking-wide">
                Ação
              </span>
            </div>
            <h4 className="text-base font-mono font-bold text-foreground mb-2">
              Exerça o Controle Social
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Utilize nossos modelos de ofício e canais oficiais para cobrar explicações e exigir postura
              alinhada com o interesse público.
            </p>
          </div>
        </div>
      </section>

      {/* ───────── PLANTÃO CÍVICO OFICIAL (FEED EM TEMPO REAL) ───────── */}
      <section className="section mb-12">
        <div className="feed-journal-header mb-4">
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

        {/* Barra de Filtro de Categoria do Feed */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-mono text-muted-foreground mr-1">Filtrar feed:</span>
          <button
            type="button"
            onClick={() => setFeedFilter('ALL')}
            className={`v-btn -sm ${feedFilter === 'ALL' ? '-accent font-bold' : '-ghost'}`}
          >
            Todos os Registros
          </button>
          <button
            type="button"
            onClick={() => setFeedFilter('VOTE')}
            className={`v-btn -sm ${feedFilter === 'VOTE' ? '-accent font-bold' : '-ghost'}`}
          >
            🗳️ Votações Nominais
          </button>
          <button
            type="button"
            onClick={() => setFeedFilter('EXPENSE')}
            className={`v-btn -sm ${feedFilter === 'EXPENSE' ? '-accent font-bold' : '-ghost'}`}
          >
            💰 Gastos Públicos
          </button>
          <button
            type="button"
            onClick={() => setFeedFilter('PROPOSAL')}
            className={`v-btn -sm ${feedFilter === 'PROPOSAL' ? '-accent font-bold' : '-ghost'}`}
          >
            📄 Tramitações & PECs
          </button>
          <button
            type="button"
            onClick={() => setFeedFilter('NEWS')}
            className={`v-btn -sm ${feedFilter === 'NEWS' ? '-accent font-bold' : '-ghost'}`}
          >
            📰 Notícias Oficiais
          </button>
        </div>

        {/* Lista do Feed com Itens Formatados */}
        {feed.loading ? (
          <Loading label="Carregando movimentações das bases oficiais..." />
        ) : feed.error ? (
          <ErrorState error={feed.error} onRetry={feed.reload} />
        ) : filteredFeed.length > 0 ? (
          <div className="space-y-4">
            {filteredFeed.map((item) => (
              <FeedItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <Empty>Nenhuma atividade encontrada para esta categoria de filtro.</Empty>
        )}
      </section>

      {/* ───────── BANNER DE ENGAJAMENTO CÍVICO FINAL ───────── */}
      <section className="my-10 p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 text-center relative overflow-hidden shadow-xl">
        <div className="max-w-2xl mx-auto relative z-10">
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold mb-3 inline-block">
            Cidadania Ativa & Transparência
          </span>
          <h2 className="text-2xl sm:text-3xl font-mono font-bold text-foreground mb-3">
            A democracia só funciona quando o cidadão fiscaliza.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
            O Vote Radar é uma iniciativa aberta que reúne dados públicos oficiais da Câmara dos Deputados,
            Senado Federal e Tribunal Superior Eleitoral para fortalecer o controle social no Brasil.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/explorar" className="v-btn -accent font-mono font-bold shadow-md">
              Explorar Diretório Completo →
            </Link>
            <Link href="/como-cobrar" className="v-btn -ghost font-mono">
              📢 Aprenda Como Cobrar
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
