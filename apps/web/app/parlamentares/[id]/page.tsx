'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { FollowButton } from '@/components/politicians';
import { Avatar, CompatibilityMeter, ErrorState, KindBadge, Loading, SourceLink } from '@/components/ui';
import { SummaryTab } from '@/features/politician/SummaryTab';
import { VotesTab } from '@/features/politician/VotesTab';
import { ProposalsTab } from '@/features/politician/ProposalsTab';
import { ExpensesTab } from '@/features/politician/ExpensesTab';
import { AssetsTab } from '@/features/politician/AssetsTab';
import { StaffTab } from '@/features/politician/StaffTab';
import { NewsTab } from '@/features/politician/NewsTab';
import { OfficeTab } from '@/features/politician/OfficeTab';
import { OfficeExplanationModal } from '@/features/politician/OfficeExplanationModal';
import { useAsync } from '@/hooks/useAsync';
import { api } from '@/lib/api';
import { formatBRL, formatNumber, formatPercent } from '@/lib/format';
import { OFFICE_LABEL, TERM_STATUS_LABEL } from '@/lib/labels';
import Link from 'next/link';

const TABS = [
  { key: 'resumo', label: 'Resumo', icon: '📊' },
  { key: 'votos', label: 'Votações', icon: '🗳️' },
  { key: 'projetos', label: 'Projetos', icon: '📄' },
  { key: 'gastos', label: 'Gastos', icon: '💰' },
  { key: 'bens', label: 'Bens', icon: '💼' },
  { key: 'gabinete', label: 'Gabinete', icon: '👥' },
  { key: 'noticias', label: 'Notícias', icon: '📰' },
] as const;
type TabKey = (typeof TABS)[number]['key'] | 'cargo';

function ProfileInner() {
  const { id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const router = useRouter();
  const { user, ready } = useAuth();
  const [officeModalOpen, setOfficeModalOpen] = useState(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const requestedTab = params.get('aba');
  const tab: TabKey =
    requestedTab === 'cargo'
      ? 'cargo'
      : (TABS.find((t) => t.key === requestedTab)?.key ?? 'resumo');

  // Auto-scroll horizontal da aba ativa para o centro no carregamento ou troca de aba (apenas quando em modo responsivo com overflow)
  useEffect(() => {
    const container = tabsContainerRef.current;
    if (!container) return;

    // Apenas rola se o container realmente tiver overflow horizontal (modo responsivo)
    if (container.scrollWidth > container.clientWidth) {
      const activeBtn = container.querySelector<HTMLElement>('.profile-tab-btn.active');
      if (activeBtn) {
        const targetScrollLeft =
          activeBtn.offsetLeft - container.clientWidth / 2 + activeBtn.clientWidth / 2;
        container.scrollTo({
          left: Math.max(0, targetScrollLeft),
          behavior: 'smooth',
        });
      }
    }
  }, [tab]);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const amount = direction === 'left' ? -220 : 220;
      tabsContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const pol = useAsync(() => api.getPolitician(id), [id]);
  const compat = useAsync(() => api.getCompatibility(id), [id, user?.id], ready && !!user);

  if (pol.loading) return <Loading />;
  if (pol.error || !pol.data) return <ErrorState error={pol.error ?? new Error('não encontrado')} onRetry={pol.reload} />;
  const p = pol.data;

  const officeIcon =
    p.office === 'PRESIDENTE'
      ? '🇧🇷'
      : p.office === 'GOVERNADOR'
        ? '🏢'
        : p.office === 'SENADOR'
          ? '🏛️'
          : p.office === 'DEPUTADO_FEDERAL'
            ? '⚖️'
            : '📍';

  return (
    <>
      {/* ── Hero Executivo do Político (Limpo e Direto) ── */}
      <div className="profile-hero-card">
        <div className="profile-hero-content">
          {/* Avatar com identificação visual */}
          <div className="profile-hero-avatar-col">
            {p.photoUrl ? (
              <img
                src={p.photoUrl}
                alt={p.name}
                className="profile-avatar-large"
                loading="eager"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="profile-avatar-large flex items-center justify-center font-bold text-3xl text-primary bg-card">
                {p.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* Dados Principais e Identificação */}
          <div className="profile-hero-main">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="profile-hero-name">{p.name}</h1>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full"
                style={{
                  background: p.status === 'IN_OFFICE' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                  color: p.status === 'IN_OFFICE' ? '#22c55e' : '#f59e0b',
                  border: `1px solid ${p.status === 'IN_OFFICE' ? 'rgba(34, 197, 94, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
                }}
              >
                ● {TERM_STATUS_LABEL[p.status] ?? 'Situação do Mandato'}
              </span>
            </div>

            {p.civilName && p.civilName !== p.name && (
              <p className="profile-hero-civilname">Nome civil registrado: {p.civilName}</p>
            )}

            <div className="profile-pills-row">
              <span className="pol-office-chip">
                <span>{officeIcon}</span>
                <span>{OFFICE_LABEL[p.office]}</span>
              </span>

              <span className="pol-badge-party text-xs font-mono">
                {p.party ?? 'Sem partido'}
              </span>

              <span className="pol-badge-uf text-xs font-mono">
                {p.uf ? `Estado: ${p.uf}` : 'Brasil'}
              </span>

              {p.termStart && (
                <span className="text-xs font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
                  Mandato {new Date(p.termStart).getUTCFullYear()} –{' '}
                  {p.termEnd ? new Date(p.termEnd).getUTCFullYear() : 'atual'}
                </span>
              )}

              <span className="text-xs font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
                Casa: {p.bodyName}
              </span>
            </div>

            {/* Ações Rápidas */}
            <div className="profile-hero-actions">
              <FollowButton politicianId={p.id} />

              <button
                type="button"
                className="office-info-trigger-btn"
                onClick={() => setOfficeModalOpen(true)}
                title={`Entenda o papel e atribuições de um(a) ${OFFICE_LABEL[p.office]}`}
              >
                🏛️ O que faz este cargo?
              </button>

              {p.source?.url && (
                <a
                  href={p.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v-btn -ghost -sm text-xs font-mono inline-flex items-center gap-1.5"
                  title="Abrir página oficial do parlamentar"
                >
                  🔗 Portal Oficial ↗
                </a>
              )}

              <KindBadge kind="OFFICIAL" />
            </div>
          </div>

          {/* Card Lateral de Compatibilidade Cívica */}
          <div className="profile-compat-card">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Seu Alinhamento
              </span>
              <KindBadge kind="ANALYSIS" />
            </div>

            {!user ? (
              <p className="text-xs text-muted-foreground">
                {/* Link de login temporariamente oculto:
                <Link href="/login" className="text-primary hover:underline font-bold">
                  Entre na sua conta
                </Link>{' '}
                e */}
                Defina suas{' '}
                <Link href="/politicas" className="text-primary hover:underline font-bold">
                  políticas
                </Link>{' '}
                para comparar suas posições com as votações deste político.
              </p>
            ) : compat.loading ? (
              <Loading label="" />
            ) : compat.data ? (
              <div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-2xl font-bold font-mono text-primary">
                    {compat.data.score !== null ? `${Math.round(compat.data.score * 100)}%` : '—'}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {compat.data.compatible} votos compatíveis
                  </span>
                </div>
                <CompatibilityMeter score={compat.data.score} />
                <p className="text-[11px] font-mono text-muted-foreground mt-2">
                  {compat.data.compatible} a favor · {compat.data.incompatible} contrários ·{' '}
                  {compat.data.notEvaluable} neutros
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* ── Ribbon de Indicadores Chave (KPIs) ── */}
      <div className="profile-kpi-ribbon">
        <button
          type="button"
          onClick={() => router.replace(`/parlamentares/${id}?aba=gastos`, { scroll: false })}
          className="profile-kpi-card text-left cursor-pointer"
        >
          <div className="profile-kpi-card-head">
            <span className="profile-kpi-label">Gastos Auditados</span>
            <span className="text-sm">💰</span>
          </div>
          <div className="profile-kpi-value text-primary">
            {formatBRL(p.stats.expensesCents, true)}
          </div>
          <span className="profile-kpi-subtext">
            {p.office === 'PRESIDENTE' || p.office === 'GOVERNADOR'
              ? 'TSE e portais governamentais →'
              : 'Cota parlamentar (CEAP) →'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => router.replace(`/parlamentares/${id}?aba=votos`, { scroll: false })}
          className="profile-kpi-card text-left cursor-pointer"
        >
          <div className="profile-kpi-card-head">
            <span className="profile-kpi-label">Votações Nominais</span>
            <span className="text-sm">🗳️</span>
          </div>
          <div className="profile-kpi-value">
            {formatNumber(p.stats.votings)}
          </div>
          <span className="profile-kpi-subtext">
            {p.stats.presence !== null
              ? `${formatPercent(p.stats.presence)} de presença em plenário →`
              : 'Ver posicionamentos nominais →'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => router.replace(`/parlamentares/${id}?aba=projetos`, { scroll: false })}
          className="profile-kpi-card text-left cursor-pointer"
        >
          <div className="profile-kpi-card-head">
            <span className="profile-kpi-label">Proposições</span>
            <span className="text-sm">📄</span>
          </div>
          <div className="profile-kpi-value">
            {formatNumber(p.stats.authoredProposals)}
          </div>
          <span className="profile-kpi-subtext">Projetos de autoria e relatoria →</span>
        </button>

        <button
          type="button"
          onClick={() => router.replace(`/parlamentares/${id}?aba=gabinete`, { scroll: false })}
          className="profile-kpi-card text-left cursor-pointer"
        >
          <div className="profile-kpi-card-head">
            <span className="profile-kpi-label">Gabinete & Servidores</span>
            <span className="text-sm">👥</span>
          </div>
          <div className="profile-kpi-value">
            {p.stats.staffCount > 0 ? formatNumber(p.stats.staffCount) : '—'}
          </div>
          <span className="profile-kpi-subtext">
            {p.stats.staffCount > 0 ? 'Servidores e assessores ativos →' : 'Consultar quadro de pessoal →'}
          </span>
        </button>
      </div>

      {/* ── Navegação em Abas (Scrollable Tabs Strip com Indicador e Controles) ── */}
      <div className="profile-tabs-wrapper">
        <div className="profile-tabs-mobile-cue items-center justify-between px-3 py-1.5 mb-2.5 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1.5">
            <span className="text-primary font-bold">↔</span> Deslize para ver todas as opções
          </span>
          <span className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-bold">
            {TABS.length} seções
          </span>
        </div>

        <div className="profile-tabs-scroll-container">
          <button
            type="button"
            className="profile-tabs-scroll-btn"
            onClick={() => scrollTabs('left')}
            aria-label="Rolar abas para a esquerda"
            title="Rolar para esquerda"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="profile-tabs-strip" role="tablist" ref={tabsContainerRef}>
            {TABS.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                className={`profile-tab-btn ${tab === t.key ? 'active' : ''}`}
                onClick={() => router.replace(`/parlamentares/${id}?aba=${t.key}`, { scroll: false })}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="profile-tabs-scroll-btn"
            onClick={() => scrollTabs('right')}
            aria-label="Rolar abas para a direita"
            title="Rolar para direita"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {tab === 'resumo' && <SummaryTab politician={p} compatibility={compat.data} />}
      {tab === 'cargo' && <OfficeTab politician={p} />}
      {tab === 'votos' && <VotesTab politician={p} politicianId={id} compatibility={compat.data} />}
      {tab === 'projetos' && <ProposalsTab politician={p} politicianId={id} />}
      {tab === 'gastos' && <ExpensesTab politicianId={id} politician={p} />}
      {tab === 'bens' && <AssetsTab politicianId={id} politician={p} />}
      {tab === 'gabinete' && <StaffTab politicianId={id} />}
      {tab === 'noticias' && <NewsTab politicianId={id} />}

      <OfficeExplanationModal
        office={p.office}
        isOpen={officeModalOpen}
        onClose={() => setOfficeModalOpen(false)}
      />
    </>
  );
}

export default function PoliticianPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProfileInner />
    </Suspense>
  );
}
