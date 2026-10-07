'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { CompatibilityMeter, KindBadge, SourceLink } from '@/components/ui';
import { formatBRL, formatDate, formatDateTime, formatNumber, formatPercent, proposalLabel } from '@/lib/format';
import { OFFICE_LABEL, POSITION_LABEL, TERM_STATUS_LABEL, VOTE_CHOICE_LABEL } from '@/lib/labels';
import type { Compatibility, PoliticianDetail } from '@/lib/types';

export function SummaryTab({
  politician: p,
  compatibility,
}: {
  politician: PoliticianDetail;
  compatibility?: Compatibility;
}) {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* ── Módulo 1: Ficha Institucional e Dados Oficiais ── */}
      <div className="card">
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="text-primary text-base">🏛️</span>
            <h2 className="text-base font-mono font-bold uppercase tracking-wider text-foreground">
              Ficha Institucional do Mandato
            </h2>
          </div>
          <KindBadge kind="OFFICIAL" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna 1: Cargo e Mandato */}
          <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border/50">
            <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block">
              1. Estrutura do Cargo
            </span>

            <div>
              <span className="text-xs font-mono text-muted-foreground block">Cargo Eletivo</span>
              <strong className="text-sm font-mono text-foreground">{OFFICE_LABEL[p.office]}</strong>
            </div>

            <div>
              <span className="text-xs font-mono text-muted-foreground block">Órgão / Casa</span>
              <span className="text-sm font-mono text-foreground">{p.bodyName}</span>
            </div>

            <div>
              <span className="text-xs font-mono text-muted-foreground block">Período de Exercício</span>
              <span className="text-sm font-mono text-foreground">
                {p.termStart ? new Date(p.termStart).getUTCFullYear() : '—'} –{' '}
                {p.termEnd ? new Date(p.termEnd).getUTCFullYear() : 'atual'}
              </span>
            </div>

            <div>
              <span className="text-xs font-mono text-muted-foreground block">Situação do Mandato</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                ● {TERM_STATUS_LABEL[p.status]}
              </span>
            </div>
          </div>

          {/* Coluna 2: Representação Política */}
          <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border/50">
            <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block">
              2. Representação Eleitoral
            </span>

            <div>
              <span className="text-xs font-mono text-muted-foreground block">Legenda Partidária</span>
              <strong className="text-sm font-mono text-primary">{p.party ?? 'Sem partido'}</strong>
            </div>

            <div>
              <span className="text-xs font-mono text-muted-foreground block">Unidade Federativa</span>
              <span className="text-sm font-mono text-foreground">
                {p.uf ? `Estado: ${p.uf}` : 'Território Nacional (Brasil)'}
              </span>
            </div>

            <div>
              <span className="text-xs font-mono text-muted-foreground block">Última Atualização Oficial</span>
              <span className="text-xs font-mono text-muted-foreground">
                {formatDateTime(p.updatedAt)}
              </span>
            </div>

            <div>
              <span className="text-xs font-mono text-muted-foreground block">Quadro de Pessoal</span>
              <span className="text-xs font-mono text-foreground">
                {p.stats.staffCount > 0
                  ? `${p.stats.staffCount} assessores e servidores vinculados`
                  : 'Quadro funcional regido pelo órgão'}
              </span>
            </div>
          </div>

          {/* Coluna 3: Identificação e Contato */}
          <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border/50">
            <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block">
              3. Identificação & Contato
            </span>

            <div>
              <span className="text-xs font-mono text-muted-foreground block">Nome Parlamentar</span>
              <strong className="text-sm font-mono text-foreground">{p.name}</strong>
            </div>

            {p.civilName && (
              <div>
                <span className="text-xs font-mono text-muted-foreground block">Nome Civil Registrado</span>
                <span className="text-xs font-mono text-muted-foreground">{p.civilName}</span>
              </div>
            )}

            <div>
              <span className="text-xs font-mono text-muted-foreground block">Canal Institucional</span>
              {p.email ? (
                <a
                  href={`mailto:${p.email}`}
                  className="text-xs font-mono text-primary hover:underline break-all"
                >
                  ✉️ {p.email}
                </a>
              ) : (
                <span className="text-xs font-mono text-muted-foreground">Consultar portal oficial</span>
              )}
            </div>

            <div className="pt-1">
              <SourceLink source={p.source} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Módulo 2: Radar de Atividade Recente (Últimos 30 Dias) ── */}
      <div className="card">
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-border/60">
          <div>
            <h3 className="text-base font-mono font-bold text-foreground">
              ⚡ Movimentação nos Últimos 30 Dias
            </h3>
            <p className="text-xs font-mono text-muted-foreground mt-0.5">
              Atividade apurada recentemente nos sistemas oficiais do Poder Público
            </p>
          </div>
          <KindBadge kind="OFFICIAL" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <span className="text-2xl font-bold font-mono text-primary block mb-1">
              {p.recent30d.votings}
            </span>
            <span className="text-xs font-mono text-muted-foreground">Votações Nominais</span>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <span className="text-2xl font-bold font-mono text-foreground block mb-1">
              {p.recent30d.proposalsMoved}
            </span>
            <span className="text-xs font-mono text-muted-foreground">Projetos Movimentados</span>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <span className="text-2xl font-bold font-mono text-foreground block mb-1">
              {p.recent30d.newProposals}
            </span>
            <span className="text-xs font-mono text-muted-foreground">Novas Proposições</span>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <span className="text-xl font-bold font-mono text-primary block mb-1">
              {formatBRL(p.recent30d.expensesCents, true)}
            </span>
            <span className="text-xs font-mono text-muted-foreground">Despesas no Período</span>
          </div>
        </div>
      </div>

      {/* ── Módulo 3: Atalhos Rápidos para Fiscalização Cidadã ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href={`/parlamentares/${p.id}?aba=gastos`}
          className="p-5 rounded-xl bg-card border border-border hover:border-primary transition-all duration-200 group no-underline text-inherit"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💰</span>
            <span className="text-xs font-mono text-primary group-hover:underline">Acessar aba →</span>
          </div>
          <h4 className="font-mono font-bold text-sm text-foreground mb-1">
            Auditoria de Gastos
          </h4>
          <p className="text-xs text-muted-foreground">
            Notas fiscais, recibos eletrônicos, fornecedores e CNPJs itemizados.
          </p>
        </Link>

        <Link
          href={`/parlamentares/${p.id}?aba=bens`}
          className="p-5 rounded-xl bg-card border border-border hover:border-primary transition-all duration-200 group no-underline text-inherit"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💼</span>
            <span className="text-xs font-mono text-primary group-hover:underline">Acessar aba →</span>
          </div>
          <h4 className="font-mono font-bold text-sm text-foreground mb-1">
            Bens Patrimoniais
          </h4>
          <p className="text-xs text-muted-foreground">
            Declaração de patrimônio entregue à Justiça Eleitoral (TSE).
          </p>
        </Link>

        <Link
          href={`/parlamentares/${p.id}?aba=votos`}
          className="p-5 rounded-xl bg-card border border-border hover:border-primary transition-all duration-200 group no-underline text-inherit"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🗳️</span>
            <span className="text-xs font-mono text-primary group-hover:underline">Acessar aba →</span>
          </div>
          <h4 className="font-mono font-bold text-sm text-foreground mb-1">
            Votações em Plenário
          </h4>
          <p className="text-xs text-muted-foreground">
            Histórico completo de votos nominais: Sim, Não, Abstenção e Obstrução.
          </p>
        </Link>
      </div>

      {/* ── Módulo 4: Comparativo Cívico (se o usuário possuir políticas) ── */}
      {user && compatibility && compatibility.items.length > 0 && (
        <AfterVote politician={p} compatibility={compatibility} />
      )}
    </div>
  );
}

/** Análise Cívica: "Você votou nele. E agora?" com layout moderno e sem fórmulas brutas */
function AfterVote({ politician: p, compatibility: c }: { politician: PoliticianDetail; compatibility: Compatibility }) {
  const total = c.compatible + c.incompatible + c.notEvaluable;
  const divergences = c.items.filter((i) => i.result === 'INCOMPATIBLE').slice(0, 5);

  return (
    <div className="card">
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-border/60">
        <div>
          <h3 className="text-base font-mono font-bold text-foreground">
            🎯 Seu Alinhamento com {p.name}
          </h3>
          <p className="text-xs font-mono text-muted-foreground mt-0.5">
            Comparação automática entre as suas políticas de interesse e as votações nominais registradas
          </p>
        </div>
        <KindBadge kind="ANALYSIS" />
      </div>

      {total === 0 ? (
        <p className="text-xs font-mono text-muted-foreground">
          Ainda não há votações deste parlamentar ligadas às políticas que você configurou.{' '}
          <Link href="/politicas" className="text-primary hover:underline">
            Revise suas políticas
          </Link>.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-center">
              <span className="text-2xl font-bold font-mono text-emerald-400 block mb-1">
                {formatPercent(c.compatible / total)}
              </span>
              <span className="text-xs font-mono text-muted-foreground">Posições Compatíveis</span>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-center">
              <span className="text-2xl font-bold font-mono text-rose-400 block mb-1">
                {formatPercent(c.incompatible / total)}
              </span>
              <span className="text-xs font-mono text-muted-foreground">Posições Divergentes</span>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border text-center">
              <span className="text-2xl font-bold font-mono text-muted-foreground block mb-1">
                {formatPercent(c.notEvaluable / total)}
              </span>
              <span className="text-xs font-mono text-muted-foreground">Inconclusivas / Neutras</span>
            </div>
          </div>

          <div className="max-w-md p-4 rounded-xl bg-card border border-border mb-6">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-muted-foreground">Índice Geral de Compatibilidade</span>
              <strong className="text-primary text-base font-bold">
                {c.score !== null ? `${Math.round(c.score * 100)}%` : '—'}
              </strong>
            </div>
            <CompatibilityMeter score={c.score} />
          </div>

          {divergences.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
                Principais Pontos de Divergência em Plenário
              </h4>
              {divergences.map((d) => (
                <div
                  className="p-3.5 rounded-xl bg-muted/20 border border-border flex items-start gap-3"
                  key={`${d.votingId}-${d.policyId}`}
                >
                  <span className="text-rose-400 text-sm mt-0.5">⚠️</span>
                  <div className="flex-1 space-y-1">
                    <strong className="text-sm font-mono text-foreground block">
                      {d.topicName} — {d.policyName}
                    </strong>
                    <div className="text-xs font-mono text-muted-foreground">
                      Sua posição: <strong className="text-foreground">{POSITION_LABEL[d.userPosition]}</strong> ·
                      Parlamentar votou:{' '}
                      <strong className="text-rose-400">{VOTE_CHOICE_LABEL[d.choice]}</strong>
                      {d.proposal && <> em {proposalLabel(d.proposal)}</>}
                    </div>
                    <div className="flex items-center gap-3 pt-1 text-xs font-mono">
                      {d.proposal && (
                        <Link href={`/proposicoes/${d.proposal.id}`} className="text-primary hover:underline">
                          Ver Projeto ↗
                        </Link>
                      )}
                      <Link href={`/parlamentares/${p.id}?aba=votos`} className="text-primary hover:underline">
                        Ver Votação ↗
                      </Link>
                      <SourceLink source={d.source} compact />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

