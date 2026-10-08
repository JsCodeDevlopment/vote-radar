'use client';

import { useState, useMemo } from 'react';
import { ErrorState, KindBadge, Loading, SourceLink, Avatar } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { api } from '@/lib/api';
import { formatBRL, formatNumber } from '@/lib/format';
import type { StaffMember } from '@/lib/types';

export function StaffTab({ politicianId }: { politicianId: string }) {
  const staff = useAsync(() => api.getPoliticianStaff(politicianId), [politicianId]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');

  const s = staff.data;

  const filteredMembers = useMemo(() => {
    if (!s?.members) return [];
    return s.members.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.level && m.level.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = selectedRole === 'ALL' || m.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [s?.members, searchTerm, selectedRole]);

  if (staff.loading) return <Loading label="Auditando custos e quadro de servidores do gabinete..." />;
  if (staff.error) return <ErrorState error={staff.error} onRetry={staff.reload} />;
  if (!s) return null;

  const avgCostPerMember = s.total > 0 ? Math.round(s.monthlyCostCents / s.total) : 0;

  return (
    <div className="space-y-6">
      {/* ── Cabeçalho do Painel ── */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Pessoal & Custo de Gabinete à União</h2>
              <KindBadge kind="OFFICIAL" />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Auditoria de servidores em exercício, remunerações por padrão remuneratório e projeção de impacto ao erário público.
            </p>
          </div>
          <SourceLink source={s.source} compact />
        </div>

        {/* ── Grid Executivo de Custos (Mensal e Anual) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5">
          {/* Card 1: Servidores em Exercício */}
          <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center justify-between">
                <span>Servidores em Exercício</span>
                <span>👥</span>
              </span>
              <div className="text-2xl font-black font-mono mt-1 text-foreground">
                {formatNumber(s.total)}
              </div>
            </div>
            <div className="text-[11px] text-muted-foreground mt-2 border-t border-border/50 pt-1.5">
              Exclusivamente quadro ativo em exercício
            </div>
          </div>

          {/* Card 2: Impacto Mensal à União */}
          <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center justify-between">
                <span>Custo Mensal à União</span>
                <span>💵</span>
              </span>
              <div className="text-2xl font-black font-mono mt-1 text-primary">
                {formatBRL(s.monthlyCostCents)}
              </div>
            </div>
            <div className="text-[11px] text-muted-foreground mt-2 border-t border-border/50 pt-1.5">
              Salários base + auxílio-alimentação
            </div>
          </div>

          {/* Card 3: Projeção de Custo Anual */}
          <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center justify-between">
                <span>Custo Anual Projetado</span>
                <span>📅</span>
              </span>
              <div className="text-2xl font-black font-mono mt-1 text-foreground">
                {formatBRL(s.annualCostCents)}
              </div>
            </div>
            <div className="text-[11px] text-muted-foreground mt-2 border-t border-border/50 pt-1.5">
              12 meses + 13º + 1/3 férias + benefícios
            </div>
          </div>

          {/* Card 4: Verba Legal / Custo Médio */}
          <div className="p-3.5 rounded-xl bg-card border border-border shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center justify-between">
                <span>Teto Mensal da Verba</span>
                <span>🏛️</span>
              </span>
              <div className="text-2xl font-black font-mono mt-1 text-foreground">
                {s.budgetLimitMonthlyCents ? formatBRL(s.budgetLimitMonthlyCents) : 'Norma própria'}
              </div>
            </div>
            <div className="text-[11px] text-muted-foreground mt-2 border-t border-border/50 pt-1.5">
              Custo médio: <strong className="text-foreground">{formatBRL(avgCostPerMember)}/servidor</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── Distribuição Financeira por Função / Categoria ── */}
      <div className="card">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-mono">
            Composição e Custo por Cargo
          </h3>
          <span className="text-xs font-mono text-muted-foreground">
            {s.byRole.length} {s.byRole.length === 1 ? 'categoria' : 'categorias'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {s.byRole.map((r) => {
            const roleMonthly = r.monthlyCostCents ?? 0;
            const roleAnnual = r.annualCostCents ?? 0;
            const pct = s.monthlyCostCents > 0 ? Math.round((roleMonthly / s.monthlyCostCents) * 100) : 0;

            return (
              <div
                key={r.role}
                className="p-3.5 rounded-xl border border-border bg-card/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-sm text-foreground">{r.role}</span>
                    <span className="text-xs font-mono font-semibold bg-muted px-2 py-0.5 rounded text-foreground whitespace-nowrap">
                      {r.count} {r.count === 1 ? 'servidor' : 'servidores'}
                    </span>
                  </div>

                  {roleMonthly > 0 && (
                    <div className="flex items-baseline justify-between mt-3 text-xs font-mono">
                      <span className="text-muted-foreground">Impacto Mensal:</span>
                      <span className="font-bold text-primary">{formatBRL(roleMonthly)}</span>
                    </div>
                  )}

                  {roleAnnual > 0 && (
                    <div className="flex items-baseline justify-between mt-1 text-xs font-mono">
                      <span className="text-muted-foreground">Projeção Anual:</span>
                      <span className="font-semibold text-foreground">{formatBRL(roleAnnual)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-muted-foreground font-mono mb-1">
                    <span>Representa da folha:</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(3, pct))}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Lista Nominal com Cargos, Padrões e Salários ── */}
      {s.members && s.members.length > 0 && (
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-mono">
                Quadro Nominal de Servidores em Exercício
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Relação pública oficial com padrão remuneratório e valor bruto individual estimado.
              </p>
            </div>
            <div className="text-xs font-mono text-muted-foreground bg-muted/60 px-2.5 py-1 rounded">
              {filteredMembers.length} de {s.members.length} servidores
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="flex flex-col sm:flex-row gap-2.5 mt-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por nome ou nível (ex: SP14, CNE)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>

            {s.byRole.length > 1 && (
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="text-xs font-mono px-3 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">Todos os cargos ({s.members.length})</option>
                {s.byRole.map((r) => (
                  <option key={r.role} value={r.role}>
                    {r.role} ({r.count})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Tabela Responsiva */}
          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/70 text-muted-foreground font-mono uppercase tracking-wider text-[11px] border-b border-border">
                <tr>
                  <th className="px-3.5 py-2.5">Nome do Servidor</th>
                  <th className="px-3 py-2.5">Cargo</th>
                  <th className="px-3 py-2.5 text-center">Nível / Padrão</th>
                  <th className="px-3.5 py-2.5 text-right">Salário Base Bruto</th>
                  <th className="px-3.5 py-2.5 text-right">Exercício</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 bg-card">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground font-mono">
                      Nenhum servidor encontrado para os termos da busca.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((m, idx) => (
                    <tr key={`${m.name}-${idx}`} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3.5 py-2.5 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <Avatar name={m.name} size={24} />
                          <span className="font-semibold">{m.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {m.role}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        {m.level ? (
                          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-muted text-foreground border border-border">
                            {m.level}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-mono font-bold text-primary">
                        {m.monthlySalaryCents ? formatBRL(m.monthlySalaryCents) : '—'}
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                        {m.since || 'Ativo'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Nota Metodológica e Transparência Legal ── */}
      <div className="card bg-muted/20 border-dashed">
        <div className="flex items-start gap-2.5">
          <span className="text-lg">⚖️</span>
          <div className="space-y-1 text-xs text-muted-foreground">
            <h4 className="font-bold text-foreground">Metodologia de Cálculo e Transparência Pública</h4>
            <p>
              • <strong>Base Legal:</strong> Os vencimentos são calculados com base nas tabelas remuneratórias oficiais vigentes:
              Lei nº 14.526/2023 (Câmara dos Deputados — níveis SP01 a SP25 e cargos CNE) e Lei nº 14.525/2023 (Senado Federal).
            </p>
            <p>
              • <strong>Custo à União:</strong> O cálculo mensal abrange a remuneração base fixada por lei acrescida do auxílio-alimentação
              obrigatório (R$ 1.393,10/mês na Câmara e R$ 1.418,00/mês no Senado). A projeção anual contempla 12 meses regulares, gratificação natalina (13º salário), adicional constitucional de 1/3 de férias e 12 cotas de auxílio-alimentação.
            </p>
            <p>
              • <strong>Quadro Efetivo:</strong> O portal exibe estritamente os servidores que constam <em>em exercício</em> no momento da consulta pública, expurgando registros de servidores exonerados ou de legislaturas anteriores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
