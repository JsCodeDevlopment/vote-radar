'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Landmark,
  Search,
  Filter,
  Download,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  Calculator,
  RefreshCw,
  Copy,
  Check,
  Info,
  DollarSign,
  PieChart,
  BarChart2,
  Coins,
  Layers,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  FileText,
  BadgeAlert,
  Scale,
  ArrowDownRight,
  ArrowUpRight,
  Sliders,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Receipt,
  Wallet,
} from 'lucide-react';
import {
  FEDERAL_BUDGET_2025,
  FEDERAL_BUDGET_2024,
  FEDERAL_BUDGET_2023,
  getFederalBudgetData,
  formatFederalCurrency,
  formatExactCurrency,
  getAllRecipients,
  calculateCitizenShare,
  exportRecipientsToCSV,
  type BudgetArea,
  type FinalRecipient,
  type BudgetProgram,
  type BudgetAction,
  type RecipientType,
  type RevenueCategory,
  type RevenueType,
  type FiscalBalance,
} from '@/lib/federalBudgetData';

type ActiveTab =
  | 'raio-x'
  | 'arrecadacao'
  | 'balanco'
  | 'drill-down'
  | 'favorecidos'
  | 'calculadora'
  | 'fontes';

interface DrillBreadcrumb {
  level: 'brasil' | 'area' | 'programa' | 'acao';
  id?: string;
  label: string;
}

// Funções de geometria pura para renderização do gráfico de pizza / donut em SVG
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInRadians: number) {
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function createDonutSlice(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startRad: number,
  endRad: number
) {
  const angleDiff = endRad - startRad;
  const isFull = angleDiff >= Math.PI * 1.9999;
  const adjustedEnd = isFull ? startRad + Math.PI * 1.9999 : endRad;
  const largeArc = angleDiff > Math.PI ? 1 : 0;
  const p1 = polarToCartesian(cx, cy, rOuter, startRad);
  const p2 = polarToCartesian(cx, cy, rOuter, adjustedEnd);
  const p3 = polarToCartesian(cx, cy, rInner, adjustedEnd);
  const p4 = polarToCartesian(cx, cy, rInner, startRad);
  return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)} A ${rInner} ${rInner} 0 ${largeArc} 0 ${p4.x.toFixed(2)} ${p4.y.toFixed(2)} Z`;
}

export default function GastosUniaoPage() {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [activeTab, setActiveTab] = useState<ActiveTab>('raio-x');

  // Visualização do Raio-X (Despesas): Tipo de gráfico e Métrica
  const [chartType, setChartType] = useState<'bar' | 'pie'>('pie');
  const [metricMode, setMetricMode] = useState<'real' | 'proporcao' | 'percentual'>('real');
  const [hoveredAreaId, setHoveredAreaId] = useState<string | null>(null);

  // Visualização de Arrecadações / Receitas
  const [revenueChartType, setRevenueChartType] = useState<'bar' | 'pie'>('pie');
  const [revenueMetricMode, setRevenueMetricMode] = useState<'real' | 'proporcao' | 'percentual'>('real');
  const [revenueTypeFilter, setRevenueTypeFilter] = useState<string>('todos');
  const [hoveredRevenueId, setHoveredRevenueId] = useState<string | null>(null);
  const [expandedRevenueId, setExpandedRevenueId] = useState<string | null>(null);

  // Drill-down interativo em árvore
  const [drillBreadcrumbs, setDrillBreadcrumbs] = useState<DrillBreadcrumb[]>([
    { level: 'brasil', label: 'Orçamento Total da União' },
  ]);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);

  // Filtros da tabela de favorecidos
  const [favorecidoSearch, setFavorecidoSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState<string>('todos');
  const [typeFilter, setTypeFilter] = useState<string>('todos');
  const [ufFilter, setUfFilter] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'amount-desc' | 'amount-asc' | 'date-desc'>('amount-desc');
  const [copiedDocument, setCopiedDocument] = useState<string | null>(null);

  // Calculadora Cívica
  const [monthlyIncome, setMonthlyIncome] = useState<number>(5000);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  // Sincronização ao vivo com API do Governo
  const [syncing, setSyncing] = useState(false);
  const [govStatus, setGovStatus] = useState<{
    connected: boolean;
    latencyMs: number;
    lastGovUpdate: string;
    packagesCount: number;
  }>({
    connected: true,
    latencyMs: 142,
    lastGovUpdate: '14 de Outubro de 2025 — 19:45 (SIAFI / Tesouro Nacional)',
    packagesCount: 20,
  });

  const budgetData = useMemo(() => {
    return getFederalBudgetData(selectedYear);
  }, [selectedYear]);

  const hoveredArea = useMemo(() => {
    if (!hoveredAreaId) return null;
    return budgetData.areas.find((a) => a.id === hoveredAreaId) ?? null;
  }, [budgetData, hoveredAreaId]);

  const pieSlices = useMemo(() => {
    const total = budgetData.totals.totalBudget;
    let currentAngle = -Math.PI / 2; // Começa no topo (12h)

    return budgetData.areas.map((area) => {
      const fraction = area.totalAmount / total;
      const sliceAngle = fraction * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;

      const isHovered = hoveredAreaId === area.id;
      const rOuter = isHovered ? 172 : 160;
      const rInner = isHovered ? 90 : 98;
      const path = createDonutSlice(200, 200, rOuter, rInner, startAngle, endAngle);

      return {
        area,
        fraction,
        startAngle,
        endAngle,
        path,
        isHovered,
      };
    });
  }, [budgetData, hoveredAreaId]);

  const getMetricHeadline = (area: BudgetArea) => {
    if (metricMode === 'real') {
      return formatFederalCurrency(area.totalAmount);
    }
    if (metricMode === 'proporcao') {
      return `R$ ${area.percentageOfTotal.toFixed(2)}`;
    }
    return `${area.percentageOfTotal.toFixed(2)}%`;
  };

  const getMetricSubline = (area: BudgetArea) => {
    if (metricMode === 'real') {
      return `${area.percentageOfTotal.toFixed(1)}% do total • R$ ${area.percentageOfTotal.toFixed(2)} / R$ 100`;
    }
    if (metricMode === 'proporcao') {
      return `${formatFederalCurrency(area.totalAmount)} • ${area.percentageOfTotal.toFixed(1)}%`;
    }
    return `${formatFederalCurrency(area.totalAmount)} • R$ ${area.percentageOfTotal.toFixed(2)} / R$ 100`;
  };

  // Arrecadação e Receitas da União Memoized
  const hoveredRevenue = useMemo(() => {
    if (!hoveredRevenueId) return null;
    return budgetData.revenues.find((r) => r.id === hoveredRevenueId) ?? null;
  }, [budgetData, hoveredRevenueId]);

  const filteredRevenues = useMemo(() => {
    if (revenueTypeFilter === 'todos') return budgetData.revenues;
    return budgetData.revenues.filter((r) => r.type === revenueTypeFilter);
  }, [budgetData, revenueTypeFilter]);

  const revenuePieSlices = useMemo(() => {
    const total = budgetData.totals.totalBudget;
    let currentAngle = -Math.PI / 2; // Começa no topo (12h)

    return budgetData.revenues.map((category) => {
      const fraction = category.totalAmount / total;
      const sliceAngle = fraction * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;

      const isHovered = hoveredRevenueId === category.id;
      const rOuter = isHovered ? 172 : 160;
      const rInner = isHovered ? 90 : 98;
      const path = createDonutSlice(200, 200, rOuter, rInner, startAngle, endAngle);

      return {
        category,
        fraction,
        startAngle,
        endAngle,
        path,
        isHovered,
      };
    });
  }, [budgetData, hoveredRevenueId]);

  const getRevenueMetricHeadline = (cat: RevenueCategory) => {
    if (revenueMetricMode === 'real') {
      return formatFederalCurrency(cat.totalAmount);
    }
    if (revenueMetricMode === 'proporcao') {
      return `R$ ${cat.percentageOfTotal.toFixed(2)}`;
    }
    return `${cat.percentageOfTotal.toFixed(2)}%`;
  };

  const getRevenueMetricSubline = (cat: RevenueCategory) => {
    if (revenueMetricMode === 'real') {
      return `${cat.percentageOfTotal.toFixed(1)}% da arrecadação • R$ ${cat.percentageOfTotal.toFixed(2)} / R$ 100`;
    }
    if (revenueMetricMode === 'proporcao') {
      return `${formatFederalCurrency(cat.totalAmount)} • ${cat.percentageOfTotal.toFixed(1)}%`;
    }
    return `${formatFederalCurrency(cat.totalAmount)} • R$ ${cat.percentageOfTotal.toFixed(2)} / R$ 100`;
  };

  // Executa checagem de sincronização ao carregar
  useEffect(() => {
    async function checkGovSync() {
      try {
        const res = await fetch(`/api/gastos-uniao?ano=${selectedYear}&sync=true`);
        if (res.ok) {
          const json = await res.json();
          if (json?.data?.liveGovStatus) {
            setGovStatus({
              connected: json.data.liveGovStatus.connected,
              latencyMs: json.data.liveGovStatus.latencyMs,
              lastGovUpdate: json.data.liveGovStatus.lastGovUpdate,
              packagesCount: json.data.liveGovStatus.ckanPackagesCount,
            });
          }
        }
      } catch {
        // Mantém fallback ativo
      }
    }
    checkGovSync();
  }, [selectedYear]);

  const handleSyncGov = async () => {
    setSyncing(true);
    try {
      const res = await fetch(`/api/gastos-uniao?ano=${selectedYear}&sync=true`);
      if (res.ok) {
        const json = await res.json();
        if (json?.data?.liveGovStatus) {
          setGovStatus({
            connected: json.data.liveGovStatus.connected,
            latencyMs: json.data.liveGovStatus.latencyMs,
            lastGovUpdate: json.data.liveGovStatus.lastGovUpdate,
            packagesCount: json.data.liveGovStatus.ckanPackagesCount,
          });
        }
      }
    } catch {
      // Falha graciosa
    } finally {
      setTimeout(() => setSyncing(false), 600);
    }
  };

  // Coleta todos os favorecidos auditáveis
  const allRecipients = useMemo(() => {
    return getAllRecipients(budgetData);
  }, [budgetData]);

  // Lista de UFs disponíveis
  const availableUfs = useMemo(() => {
    const ufs = new Set<string>();
    allRecipients.forEach((r) => {
      if (r.uf) ufs.add(r.uf);
    });
    return Array.from(ufs).sort();
  }, [allRecipients]);

  // Favorecidos filtrados
  const filteredRecipients = useMemo(() => {
    let list = [...allRecipients];

    if (favorecidoSearch.trim()) {
      const q = favorecidoSearch.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.document.toLowerCase().includes(q) ||
          r.objectDescription.toLowerCase().includes(q) ||
          r.actionName.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q) ||
          r.documentNumber.toLowerCase().includes(q)
      );
    }

    if (areaFilter !== 'todos') {
      list = list.filter((r) => r.areaId === areaFilter);
    }

    if (typeFilter !== 'todos') {
      list = list.filter((r) => r.type === typeFilter);
    }

    if (ufFilter !== 'todos') {
      list = list.filter((r) => r.uf === ufFilter);
    }

    if (sortBy === 'amount-desc') {
      list.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === 'amount-asc') {
      list.sort((a, b) => a.amount - b.amount);
    } else if (sortBy === 'date-desc') {
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return list;
  }, [allRecipients, favorecidoSearch, areaFilter, typeFilter, ufFilter, sortBy]);

  const totalFilteredAmount = useMemo(() => {
    return filteredRecipients.reduce((acc, r) => acc + r.amount, 0);
  }, [filteredRecipients]);

  // Navegação no drill-down
  const activeArea = useMemo(() => {
    if (!selectedAreaId) return null;
    return budgetData.areas.find((a) => a.id === selectedAreaId) ?? null;
  }, [budgetData, selectedAreaId]);

  const activeProgram = useMemo(() => {
    if (!activeArea || !selectedProgramId) return null;
    return activeArea.programs.find((p) => p.id === selectedProgramId) ?? null;
  }, [activeArea, selectedProgramId]);

  const activeAction = useMemo(() => {
    if (!activeProgram || !selectedActionId) return null;
    return activeProgram.actions.find((a) => a.id === selectedActionId) ?? null;
  }, [activeProgram, selectedActionId]);

  const handleSelectArea = (area: BudgetArea) => {
    setSelectedAreaId(area.id);
    setSelectedProgramId(null);
    setSelectedActionId(null);
    setDrillBreadcrumbs([
      { level: 'brasil', label: 'Orçamento Total da União' },
      { level: 'area', id: area.id, label: area.name },
    ]);
  };

  const handleSelectProgram = (program: BudgetProgram) => {
    setSelectedProgramId(program.id);
    setSelectedActionId(null);
    setDrillBreadcrumbs((prev) => [
      prev[0]!,
      prev[1]!,
      { level: 'programa', id: program.id, label: `Prog. ${program.code} — ${program.name}` },
    ]);
  };

  const handleSelectAction = (action: BudgetAction) => {
    setSelectedActionId(action.id);
    setDrillBreadcrumbs((prev) => [
      prev[0]!,
      prev[1]!,
      prev[2]!,
      { level: 'acao', id: action.id, label: `Ação ${action.code} — ${action.name}` },
    ]);
  };

  const handleBreadcrumbClick = (crumb: DrillBreadcrumb, index: number) => {
    if (crumb.level === 'brasil') {
      setSelectedAreaId(null);
      setSelectedProgramId(null);
      setSelectedActionId(null);
      setDrillBreadcrumbs([{ level: 'brasil', label: 'Orçamento Total da União' }]);
    } else if (crumb.level === 'area') {
      setSelectedProgramId(null);
      setSelectedActionId(null);
      setDrillBreadcrumbs((prev) => prev.slice(0, 2));
    } else if (crumb.level === 'programa') {
      setSelectedActionId(null);
      setDrillBreadcrumbs((prev) => prev.slice(0, 3));
    }
  };

  const handleCopyDoc = async (doc: string) => {
    try {
      await navigator.clipboard.writeText(doc);
      setCopiedDocument(doc);
      setTimeout(() => setCopiedDocument(null), 2000);
    } catch {
      // Fallback
    }
  };

  // Cálculo Cívico do Imposto
  const citizenCalculation = useMemo(() => {
    const annualIncome = monthlyIncome * 12;
    const estimatedAnnualTax = annualIncome * 0.33;
    return calculateCitizenShare(estimatedAnnualTax, budgetData);
  }, [monthlyIncome, budgetData]);

  const handleCopyCitizenReceipt = async () => {
    const lines = [
      `MEU COMPROVANTE CÍVICO — GASTOS DO GOVERNO FEDERAL (${selectedYear})`,
      `Renda estimada: R$ ${monthlyIncome.toLocaleString('pt-BR')}/mês | Tributos anuais estimados: R$ ${Math.round(citizenCalculation.totalTax).toLocaleString('pt-BR')}`,
      `----------------------------------------------------`,
      ...citizenCalculation.shares.slice(0, 8).map((s) => {
        return `• ${s.areaName}: R$ ${s.yourShareInBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${s.percentage}%)`;
      }),
      `----------------------------------------------------`,
      `Audite o destino de cada real em: https://voteradar.com.br/gastos-uniao`,
      `Fonte: Secretaria do Tesouro Nacional / CGU / SIAFI`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopiedReceipt(true);
      setTimeout(() => setCopiedReceipt(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* ─────────────────────────────────────────────────────────────
          HERO & HEADER OFICIAL
          ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card via-card/95 to-background p-6 sm:p-10 shadow-sm">
        {/* Glow de fundo */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-mono uppercase tracking-wider">
              <Landmark size={14} className="text-primary" />
              <span>Raio-X de Gastos Públicos da União</span>
            </div>

            {/* Badge de Sincronização em Tempo Real com o Governo */}
            <div className="flex items-center gap-2 bg-muted/60 border border-border px-3 py-1.5 rounded-full text-xs font-mono">
              <span
                className={`w-2 h-2 rounded-full ${
                  govStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="text-muted-foreground hidden sm:inline">Bases Oficiais:</span>
              <span className="font-semibold text-foreground">
                Tesouro Nacional, CGU & SIAFI
              </span>
              <button
                type="button"
                onClick={handleSyncGov}
                disabled={syncing}
                title="Verificar atualizações no Governo Federal"
                className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <RefreshCw size={13} className={syncing ? 'animate-spin text-primary' : ''} />
              </button>
            </div>
          </div>

          <div className="max-w-4xl space-y-3">
            <h1 className="text-3xl sm:text-5xl font-mono font-bold tracking-tight text-foreground leading-tight">
              Para onde vai cada real arrecadado no Brasil?
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base font-sans leading-relaxed">
              Consulte a destinação de todos os recursos da União com total transparência.
              Navegue desde o orçamento macro de{' '}
              <strong className="text-foreground font-mono font-semibold">
                {formatFederalCurrency(budgetData.totals.totalBudget)}
              </strong>{' '}
              até a ponta final: ministérios, programas, ações de governo, notas de empenho e
              fornecedores contratados.
            </p>
          </div>

          {/* Seletor de Ano do Orçamento */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
            <span className="text-xs font-mono text-muted-foreground mr-1 flex items-center gap-1.5">
              <Calendar size={14} />
              Exercício Financeiro:
            </span>
            <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-muted border border-border">
              {[
                { year: 2025, label: '2025 (Execução Vigente)' },
                { year: 2024, label: '2024 (Consolidado)' },
                { year: 2023, label: '2023 (Histórico)' },
              ].map((item) => (
                <button
                  key={item.year}
                  type="button"
                  onClick={() => setSelectedYear(item.year)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                    selectedYear === item.year
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] font-mono text-muted-foreground ml-auto hidden md:inline">
              Última atualização oficial: {govStatus.lastGovUpdate}
            </span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CARDS DE MACROINDICADORES (KPIS)
          ───────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Orçamento Geral */}
        <div className="v-card p-5 rounded-xl border border-border flex flex-col justify-between hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Orçamento Geral</span>
            <Landmark size={18} className="text-primary" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-foreground">
              {formatFederalCurrency(budgetData.totals.totalBudget)}
            </div>
            <div className="text-xs text-muted-foreground font-mono mt-1">
              100% da Lei Orçamentária Anual
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-border/60 text-[11px] font-mono text-muted-foreground">
            Ano fiscal {selectedYear}
          </div>
        </div>

        {/* Card 2: Dívida e Juros */}
        <div className="v-card p-5 rounded-xl border border-border flex flex-col justify-between hover:border-destructive/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Dívida & Refinanciamento</span>
            <TrendingUp size={18} className="text-destructive" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-foreground">
              {formatFederalCurrency(budgetData.totals.debtRefinancing)}
            </div>
            <div className="text-xs text-muted-foreground font-mono mt-1">
              {((budgetData.totals.debtRefinancing / budgetData.totals.totalBudget) * 100).toFixed(1)}% do total federal
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-border/60 text-[11px] font-mono text-muted-foreground">
            Amortização e juros da dívida
          </div>
        </div>

        {/* Card 3: Previdência Social */}
        <div className="v-card p-5 rounded-xl border border-border flex flex-col justify-between hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Previdência (INSS)</span>
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-foreground">
              {formatFederalCurrency(
                budgetData.areas.find((a) => a.id === 'previdencia')?.totalAmount || 1055000000000
              )}
            </div>
            <div className="text-xs text-muted-foreground font-mono mt-1">
              39M+ de aposentados e pensionistas
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-border/60 text-[11px] font-mono text-muted-foreground">
            Despesa obrigatória por lei
          </div>
        </div>

        {/* Card 4: Saúde e Educação */}
        <div className="v-card p-5 rounded-xl border border-border flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Saúde + Educação</span>
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-foreground">
              {formatFederalCurrency(
                (budgetData.areas.find((a) => a.id === 'saude')?.totalAmount || 0) +
                  (budgetData.areas.find((a) => a.id === 'educacao')?.totalAmount || 0)
              )}
            </div>
            <div className="text-xs text-muted-foreground font-mono mt-1">
              SUS, Universidades e Escolas
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-border/60 text-[11px] font-mono text-muted-foreground">
            Pisos constitucionais vinculados
          </div>
        </div>

        {/* Card 5: Investimentos Diretos */}
        <div className="v-card p-5 rounded-xl border border-border flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Investimento Direto</span>
            <Building2 size={18} className="text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-foreground">
              {formatFederalCurrency(budgetData.totals.directInvestments)}
            </div>
            <div className="text-xs text-muted-foreground font-mono mt-1">
              Obras, rodovias e infraestrutura
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-border/60 text-[11px] font-mono text-muted-foreground">
            Despesa discricionária livre
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          BARRA DE NAVEGAÇÃO DE ABAS / MODOS DE VISUALIZAÇÃO
          ───────────────────────────────────────────────────────────── */}
      <section className="border-b border-border pb-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-2.5">
          {[
            {
              id: 'raio-x',
              label: 'Gastos',
              desc: 'Destinação Macro',
            },
            {
              id: 'arrecadacao',
              label: 'Receitas',
              desc: 'Arrecadação Total',
            },
            {
              id: 'balanco',
              label: 'Balanço',
              desc: 'Receitas x Despesas',
            },
            {
              id: 'drill-down',
              label: 'Para Onde Vai',
              desc: 'Drill-Down Árvore',
            },
            {
              id: 'favorecidos',
              label: 'Favorecidos',
              desc: 'Notas e Favorecidos',
            },
            {
              id: 'calculadora',
              label: 'Meu Imposto',
              desc: 'Calculadora Cívica',
            },
            {
              id: 'fontes',
              label: 'Fontes',
              desc: 'Dados Oficiais',
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex flex-col text-left p-2.5 sm:p-3 rounded-xl transition-all border ${
                  isActive
                    ? 'bg-card border-primary text-foreground shadow-sm ring-1 ring-primary/40'
                    : 'bg-muted/40 border-border/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <span className="font-mono text-xs sm:text-sm font-bold flex items-center justify-between gap-1 leading-tight">
                  <span className="whitespace-normal break-words">{tab.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                </span>
                <span className="text-[10px] sm:text-[11px] font-sans text-muted-foreground leading-tight mt-1 break-words">
                  {tab.desc}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ABA 1: RAIO-X & PROPORÇÕES MACRO
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'raio-x' && (
        <div className="space-y-8 animate-fade-in">
          {/* Card com Gráfico Interativo (Pizza/Donut ou Barra) e Alternância de Valor Real */}
          <div className="v-card p-6 rounded-2xl border border-border space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-mono font-bold text-foreground flex items-center gap-2">
                  {chartType === 'pie' ? <PieChart size={19} className="text-primary" /> : <BarChart2 size={19} className="text-primary" />}
                  {metricMode === 'real'
                    ? `Destinação Real dos Recursos da União (${formatFederalCurrency(budgetData.totals.totalBudget)})`
                    : metricMode === 'proporcao'
                    ? 'Se o Brasil arrecadasse R$ 100, para onde iria cada centavo?'
                    : 'Composição Percentual dos Gastos da União'}
                </h3>
                <p className="text-xs text-muted-foreground font-sans mt-0.5">
                  {metricMode === 'real'
                    ? 'Valores reais executados e liquidados pelo Governo Federal em cada área.'
                    : metricMode === 'proporcao'
                    ? 'Distribuição proporcional a cada R$ 100 arrecadados no país.'
                    : 'Participação relativa de cada função no total do orçamento federal.'}
                </p>
              </div>

              {/* Controles: Seletor de Métrica e Tipo de Gráfico */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Seletor de Métrica (Valor Real R$ vs R$ 100 vs %) */}
                <div className="inline-flex p-1 rounded-xl bg-muted border border-border text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setMetricMode('real')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      metricMode === 'real'
                        ? 'bg-background text-foreground shadow-xs font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Valor Real (R$)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMetricMode('proporcao')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      metricMode === 'proporcao'
                        ? 'bg-background text-foreground shadow-xs font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    R$ 100
                  </button>
                  <button
                    type="button"
                    onClick={() => setMetricMode('percentual')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      metricMode === 'percentual'
                        ? 'bg-background text-foreground shadow-xs font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    ％ Percentual
                  </button>
                </div>

                {/* Seletor de Gráfico (Pizza vs Barra) */}
                <div className="inline-flex p-1 rounded-xl bg-muted border border-border text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setChartType('pie')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                      chartType === 'pie'
                        ? 'bg-background text-foreground shadow-xs font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    title="Visualizar em Gráfico de Pizza / Donut"
                  >
                    <PieChart size={14} />
                    Pizza
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartType('bar')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                      chartType === 'bar'
                        ? 'bg-background text-foreground shadow-xs font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    title="Visualizar em Barra Segmentada"
                  >
                    <BarChart2 size={14} />
                    Barra
                  </button>
                </div>
              </div>
            </div>

            {/* Renderização do Gráfico: Pizza vs Barra */}
            {chartType === 'pie' ? (
              <div className="py-2 flex flex-col items-center justify-center">
                <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-square mx-auto">
                  <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-sm select-none">
                    {pieSlices.map(({ area, path, isHovered }) => (
                      <path
                        key={area.id}
                        d={path}
                        fill={area.color}
                        stroke="var(--card)"
                        strokeWidth="2.5"
                        onClick={() => {
                          handleSelectArea(area);
                          setActiveTab('drill-down');
                        }}
                        onMouseEnter={() => setHoveredAreaId(area.id)}
                        onMouseLeave={() => setHoveredAreaId(null)}
                        className={`cursor-pointer transition-all duration-200 ${
                          isHovered
                            ? 'opacity-100 filter brightness-115 drop-shadow-md'
                            : hoveredAreaId
                            ? 'opacity-40 hover:opacity-100'
                            : 'opacity-95 hover:opacity-100'
                        }`}
                      >
                        <title>{`${area.name}: ${formatFederalCurrency(area.totalAmount)} (${area.percentageOfTotal}%)`}</title>
                      </path>
                    ))}
                  </svg>

                  {/* Informação Centralizada no furo do Donut */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center"
                    style={{ width: '100%', height: '100%' }}
                  >
                    {hoveredArea ? (
                      <div className="space-y-1 animate-fade-in max-w-[170px] sm:max-w-[200px]">
                        <span className="text-2xl sm:text-3xl block">{hoveredArea.icon}</span>
                        <div className="text-xs font-mono font-bold text-foreground line-clamp-1">
                          {hoveredArea.name}
                        </div>
                        <div className="text-base sm:text-xl font-mono font-bold text-primary leading-tight">
                          {getMetricHeadline(hoveredArea)}
                          {metricMode === 'proporcao' && (
                            <span className="text-xs font-normal text-muted-foreground ml-1">/ R$ 100</span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground">
                          {hoveredArea.percentageOfTotal.toFixed(2)}% do total
                        </div>
                        <span className="inline-block px-2 py-0.5 rounded text-[9px] font-mono text-primary bg-primary/10 border border-primary/20">
                          Clique para detalhar →
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center max-w-[170px] sm:max-w-[200px]">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                          {metricMode === 'real'
                            ? 'Orçamento Total'
                            : metricMode === 'proporcao'
                            ? 'Proporção Base'
                            : 'Participação Total'}
                        </div>
                        <div className="text-base sm:text-xl font-mono font-bold text-foreground leading-tight">
                          {metricMode === 'real'
                            ? formatFederalCurrency(budgetData.totals.totalBudget)
                            : metricMode === 'proporcao'
                            ? 'R$ 100,00'
                            : '100,00%'}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground">
                          {budgetData.areas.length} Áreas • Exercício {selectedYear}
                        </div>
                        <span className="text-[10px] font-sans text-muted-foreground/80 block">
                          Passe o mouse nas fatias
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Barra Segmentada Interativa */
              <div className="space-y-2 py-2">
                <div className="w-full h-9 rounded-xl overflow-hidden flex shadow-inner border border-border/80">
                  {budgetData.areas.map((area) => (
                    <div
                      key={area.id}
                      style={{
                        width: `${area.percentageOfTotal}%`,
                        backgroundColor: area.color,
                      }}
                      title={`${area.name}: ${formatFederalCurrency(area.totalAmount)} (${area.percentageOfTotal.toFixed(2)}%)`}
                      onClick={() => {
                        handleSelectArea(area);
                        setActiveTab('drill-down');
                      }}
                      onMouseEnter={() => setHoveredAreaId(area.id)}
                      onMouseLeave={() => setHoveredAreaId(null)}
                      className={`h-full cursor-pointer transition-all ${
                        hoveredAreaId === area.id
                          ? 'opacity-100 scale-y-110 brightness-110'
                          : hoveredAreaId
                          ? 'opacity-40'
                          : 'hover:opacity-90'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono text-muted-foreground px-1">
                  <span>Início: 0%</span>
                  <span>100% da Execução da União: {formatFederalCurrency(budgetData.totals.totalBudget)}</span>
                </div>
              </div>
            )}

            {/* Legenda Dinâmica com Destaque para a Métrica Selecionada (Real, R$ 100 ou %) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2">
              {budgetData.areas.map((area) => {
                const isHovered = hoveredAreaId === area.id;
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => {
                      handleSelectArea(area);
                      setActiveTab('drill-down');
                    }}
                    onMouseEnter={() => setHoveredAreaId(area.id)}
                    onMouseLeave={() => setHoveredAreaId(null)}
                    className={`flex items-start gap-2.5 p-3 rounded-xl text-left transition-all border group ${
                      isHovered
                        ? 'bg-primary/10 border-primary ring-1 ring-primary/40 shadow-sm'
                        : 'bg-muted/30 hover:bg-muted/70 border-border/60 hover:border-border'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 shadow-xs"
                      style={{ backgroundColor: area.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {area.name}
                      </div>

                      {/* Métrica em Destaque Principal */}
                      <div className="text-xs font-mono font-bold text-primary mt-1">
                        {getMetricHeadline(area)}
                        {metricMode === 'proporcao' && (
                          <span className="text-[10px] text-muted-foreground font-normal ml-1">
                            / R$ 100
                          </span>
                        )}
                      </div>

                      {/* Sublinha Informativa com valores complementares */}
                      <div className="text-[10px] font-mono text-muted-foreground mt-0.5 leading-tight">
                        {getMetricSubline(area)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* O Engessamento do Orçamento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="v-card p-6 rounded-2xl border border-border md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-mono font-bold text-foreground">
                  O Engessamento do Orçamento: Por que sobra pouco para obras e investimentos?
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Mais de <strong className="text-foreground">93%</strong> das despesas da União são{' '}
                <strong className="text-foreground">obrigatórias por lei e pela Constituição</strong> (como
                aposentadorias, folha de pagamento de médicos e policiais, pisos da saúde/educação e
                pagamento da dívida). Apenas cerca de <strong className="text-foreground">7%</strong> são
                despesas discricionárias, onde o Presidente e os Ministérios têm liberdade para decidir onde
                investir.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-muted/60 border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-foreground">Despesas Obrigatórias</span>
                    <span className="text-xs font-mono font-bold text-amber-500">~93% do total</span>
                  </div>
                  <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '93%' }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Previdência Social, folha salarial de servidores públicos civis e militares, pisos
                    constitucionais do SUS e da Educação.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-muted/60 border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-foreground">Despesas Livres (Discricionárias)</span>
                    <span className="text-xs font-mono font-bold text-emerald-500">~7% do total</span>
                  </div>
                  <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '7%' }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Novas estradas, reformas de hospitais, bolsas de pesquisa científica, segurança nas
                    fronteiras e fomento econômico.
                  </p>
                </div>
              </div>
            </div>

            {/* Custo Per Capita Anual */}
            <div className="v-card p-6 rounded-2xl border border-border flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-wider">
                  <Info size={14} />
                  <span>Por Cidadão Brasileiro</span>
                </div>
                <h4 className="text-sm font-mono font-bold text-foreground">
                  Quanto a União gasta por ano para cada um dos 215 milhões de brasileiros?
                </h4>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-muted-foreground">Previdência (INSS):</span>
                  <span className="font-bold text-foreground">R$ 4.906 / ano</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-muted-foreground">Saúde Pública (SUS):</span>
                  <span className="font-bold text-foreground">R$ 1.125 / ano</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-muted-foreground">Educação e Universidades:</span>
                  <span className="font-bold text-foreground">R$ 911 / ano</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-muted-foreground">Defesa e Forças Armadas:</span>
                  <span className="font-bold text-foreground">R$ 613 / ano</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-muted-foreground">Segurança Pública / PF:</span>
                  <span className="font-bold text-foreground">R$ 179 / ano</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-muted-foreground">Transporte / Rodovias:</span>
                  <span className="font-bold text-foreground">R$ 158 / ano</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('calculadora')}
                className="v-btn -accent -sm w-full justify-center font-mono font-bold text-xs"
              >
                Calcular Meu Recibo Cívico →
              </button>
            </div>
          </div>

          {/* Grid de Todas as Áreas com Cartões Detalhados */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-mono font-bold text-foreground">
                Todas as Áreas Orçamentárias da União ({budgetData.areas.length})
              </h3>
              <span className="text-xs font-mono text-muted-foreground">
                Clique em qualquer área para aprofundar
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgetData.areas.map((area) => (
                <div
                  key={area.id}
                  onClick={() => {
                    handleSelectArea(area);
                    setActiveTab('drill-down');
                  }}
                  className="v-card p-5 rounded-xl border border-border hover:border-primary/50 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{area.icon}</span>
                        <div>
                          <h4 className="font-mono font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                            {area.name}
                          </h4>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {area.percentageOfTotal.toFixed(2)}% do orçamento federal
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>

                    <p className="text-xs text-muted-foreground font-sans line-clamp-2">
                      {area.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/60">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-xs text-muted-foreground">Total Liquidado:</span>
                      <span className="text-base font-bold text-foreground">
                        {formatFederalCurrency(area.totalAmount)}
                      </span>
                    </div>

                    {/* Barra de Proporção */}
                    <div className="w-full bg-border/60 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, area.percentageOfTotal * 2.2)}%`,
                          backgroundColor: area.color,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                      <span>R$ {area.perCapitaYear.toLocaleString('pt-BR')} / habitante</span>
                      <span className="text-primary group-hover:underline">Explorar gastos →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ABA: ARRECADAÇÃO & RECEITAS DA UNIÃO (DE ONDE VEM O DINHEIRO)
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'arrecadacao' && (
        <div className="space-y-8 animate-fade-in">
          {/* Card com Gráfico Interativo de Receitas (Pizza/Donut ou Barra) */}
          <div className="v-card p-6 rounded-2xl border border-border space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-mono font-bold text-foreground flex items-center gap-2">
                  {revenueChartType === 'pie' ? (
                    <PieChart size={19} className="text-emerald-500" />
                  ) : (
                    <BarChart2 size={19} className="text-emerald-500" />
                  )}
                  {revenueMetricMode === 'real'
                    ? `Origem Real de Todos os Recursos da União (${formatFederalCurrency(budgetData.totals.totalBudget)})`
                    : revenueMetricMode === 'proporcao'
                    ? 'De Onde Vem Cada R$ 100 Arrecadados no Brasil?'
                    : 'Composição Percentual da Arrecadação Federal'}
                </h3>
                <p className="text-xs text-muted-foreground font-sans mt-0.5">
                  {revenueMetricMode === 'real'
                    ? 'Entradas financeiras oficiais consolidadas pela Secretaria do Tesouro Nacional e Receita Federal.'
                    : revenueMetricMode === 'proporcao'
                    ? 'Divisão proporcional de cada R$ 100 que entram nos cofres da União.'
                    : 'Participação relativa de cada tributo, contribuição ou captação financeira.'}
                </p>
              </div>

              {/* Controles: Seletor de Métrica e Tipo de Gráfico */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Seletor de Métrica */}
                <div className="inline-flex p-1 rounded-xl bg-muted border border-border text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setRevenueMetricMode('real')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      revenueMetricMode === 'real'
                        ? 'bg-background text-foreground shadow-xs font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Valor Real (R$)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRevenueMetricMode('proporcao')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      revenueMetricMode === 'proporcao'
                        ? 'bg-background text-foreground shadow-xs font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    R$ 100
                  </button>
                  <button
                    type="button"
                    onClick={() => setRevenueMetricMode('percentual')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      revenueMetricMode === 'percentual'
                        ? 'bg-background text-foreground shadow-xs font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    ％ Percentual
                  </button>
                </div>

                {/* Seletor de Gráfico */}
                <div className="inline-flex p-1 rounded-xl bg-muted border border-border text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setRevenueChartType('pie')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                      revenueChartType === 'pie'
                        ? 'bg-background text-foreground shadow-xs font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <PieChart size={14} />
                    Pizza
                  </button>
                  <button
                    type="button"
                    onClick={() => setRevenueChartType('bar')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                      revenueChartType === 'bar'
                        ? 'bg-background text-foreground shadow-xs font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <BarChart2 size={14} />
                    Barra
                  </button>
                </div>
              </div>
            </div>

            {/* Renderização do Gráfico: Pizza vs Barra */}
            {revenueChartType === 'pie' ? (
              <div className="py-2 flex flex-col items-center justify-center">
                <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-square mx-auto">
                  <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-sm select-none">
                    {revenuePieSlices.map(({ category, path, isHovered }) => (
                      <path
                        key={category.id}
                        d={path}
                        fill={category.color}
                        stroke="var(--card)"
                        strokeWidth="2.5"
                        onClick={() => {
                          setExpandedRevenueId(expandedRevenueId === category.id ? null : category.id);
                        }}
                        onMouseEnter={() => setHoveredRevenueId(category.id)}
                        onMouseLeave={() => setHoveredRevenueId(null)}
                        className={`cursor-pointer transition-all duration-200 ${
                          isHovered
                            ? 'opacity-100 filter brightness-115 drop-shadow-md'
                            : hoveredRevenueId
                            ? 'opacity-40 hover:opacity-100'
                            : 'opacity-95 hover:opacity-100'
                        }`}
                      >
                        <title>{`${category.name}: ${formatFederalCurrency(category.totalAmount)} (${category.percentageOfTotal}%)`}</title>
                      </path>
                    ))}
                  </svg>

                  {/* Informação Centralizada no Donut */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center"
                    style={{ width: '100%', height: '100%' }}
                  >
                    {hoveredRevenue ? (
                      <div className="space-y-1 animate-fade-in max-w-[170px] sm:max-w-[200px]">
                        <span className="text-2xl sm:text-3xl block">{hoveredRevenue.icon}</span>
                        <div className="text-xs font-mono font-bold text-foreground line-clamp-1">
                          {hoveredRevenue.name}
                        </div>
                        <div className="text-base sm:text-xl font-mono font-bold text-emerald-500 leading-tight">
                          {getRevenueMetricHeadline(hoveredRevenue)}
                          {revenueMetricMode === 'proporcao' && (
                            <span className="text-xs font-normal text-muted-foreground ml-1">/ R$ 100</span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground">
                          {hoveredRevenue.percentageOfTotal.toFixed(2)}% da arrecadação
                        </div>
                        <span className="inline-block px-2 py-0.5 rounded text-[9px] font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
                          {hoveredRevenue.typeLabel}
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center max-w-[170px] sm:max-w-[200px]">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                          {revenueMetricMode === 'real'
                            ? 'Receita Total da União'
                            : revenueMetricMode === 'proporcao'
                            ? 'Base de Cálculo'
                            : 'Total Arrecadado'}
                        </div>
                        <div className="text-base sm:text-xl font-mono font-bold text-foreground leading-tight">
                          {revenueMetricMode === 'real'
                            ? formatFederalCurrency(budgetData.totals.totalBudget)
                            : revenueMetricMode === 'proporcao'
                            ? 'R$ 100,00'
                            : '100,00%'}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground">
                          Passe o mouse ou toque para detalhes
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Modo Barra Segmentada */
              <div className="space-y-4">
                <div className="w-full h-8 rounded-xl overflow-hidden flex shadow-inner border border-border">
                  {budgetData.revenues.map((cat) => (
                    <div
                      key={cat.id}
                      style={{
                        width: `${cat.percentageOfTotal}%`,
                        backgroundColor: cat.color,
                      }}
                      onMouseEnter={() => setHoveredRevenueId(cat.id)}
                      onMouseLeave={() => setHoveredRevenueId(null)}
                      onClick={() => setExpandedRevenueId(expandedRevenueId === cat.id ? null : cat.id)}
                      className={`h-full cursor-pointer transition-all ${
                        hoveredRevenueId === cat.id ? 'filter brightness-125 scale-y-110 z-10' : 'opacity-95'
                      }`}
                      title={`${cat.name}: ${formatFederalCurrency(cat.totalAmount)} (${cat.percentageOfTotal}%)`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Legenda Dinâmica e Interativa */}
            <div className="pt-4 border-t border-border/60">
              <div className="text-xs font-mono text-muted-foreground mb-3 flex items-center justify-between">
                <span>Fontes de Receita ({budgetData.revenues.length} categorias)</span>
                <span className="text-[11px] text-muted-foreground">Clique para expandir tributos</span>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {budgetData.revenues.map((cat) => {
                  const isHovered = hoveredRevenueId === cat.id;
                  const isExpanded = expandedRevenueId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onMouseEnter={() => setHoveredRevenueId(cat.id)}
                      onMouseLeave={() => setHoveredRevenueId(null)}
                      onClick={() => setExpandedRevenueId(isExpanded ? null : cat.id)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-2 transition-all ${
                        isHovered || isExpanded
                          ? 'bg-muted border-foreground/30 text-foreground scale-102 shadow-xs'
                          : 'bg-card/60 border-border text-muted-foreground hover:border-border/90 hover:text-foreground'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="font-semibold">{cat.name.split(' (')[0]}</span>
                      <span className="text-foreground font-bold">
                        {revenueMetricMode === 'real'
                          ? formatFederalCurrency(cat.totalAmount)
                          : revenueMetricMode === 'proporcao'
                          ? `R$ ${cat.percentageOfTotal.toFixed(1)}`
                          : `${cat.percentageOfTotal.toFixed(1)}%`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Filtro por Natureza da Receita */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-mono font-bold text-foreground flex items-center gap-2">
                  <Receipt size={18} className="text-emerald-500" />
                  Detalhamento de Todas as Receitas & Tributos
                </h3>
                <p className="text-xs text-muted-foreground font-sans">
                  Consulte a explicação, arrecadação total e divisão interna de cada imposto, contribuição ou captação.
                </p>
              </div>

              {/* Seletor de Tipo */}
              <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-muted border border-border text-xs font-mono">
                {[
                  { id: 'todos', label: 'Todas as Entradas' },
                  { id: 'TRIBUTARIA', label: 'Impostos' },
                  { id: 'CONTRIBUICOES', label: 'Contribuições Sociais' },
                  { id: 'OPERACAO_CREDITO', label: 'Operações de Crédito' },
                  { id: 'PATRIMONIAL_ROYALTIES', label: 'Royalties & Estatais' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setRevenueTypeFilter(f.id)}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      revenueTypeFilter === f.id
                        ? 'bg-background text-foreground font-bold shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de Cards de Receita */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRevenues.map((cat) => {
                const isExpanded = expandedRevenueId === cat.id;
                return (
                  <div
                    key={cat.id}
                    className="v-card p-5 rounded-xl border border-border hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{cat.icon}</span>
                          <div>
                            <h4 className="font-mono font-bold text-sm text-foreground">
                              {cat.name}
                            </h4>
                            <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              {cat.typeLabel}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 shrink-0">
                          +{cat.variationPercent}%
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground font-sans line-clamp-3">
                        {cat.description}
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-3 border-t border-border/60">
                      <div className="flex items-baseline justify-between font-mono">
                        <span className="text-xs text-muted-foreground">Arrecadação Total:</span>
                        <div className="text-right">
                          <div className="text-base font-bold text-foreground">
                            {getRevenueMetricHeadline(cat)}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {cat.percentageOfTotal.toFixed(2)}% do total
                          </div>
                        </div>
                      </div>

                      {/* Barra de Proporção */}
                      <div className="w-full bg-border/60 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, cat.percentageOfTotal * 2.2)}%`,
                            backgroundColor: cat.color,
                          }}
                        />
                      </div>

                      {/* Botão de Accordion para Subitens */}
                      <button
                        type="button"
                        onClick={() => setExpandedRevenueId(isExpanded ? null : cat.id)}
                        className="w-full mt-2 py-2 px-3 rounded-lg bg-muted/60 hover:bg-muted border border-border/60 text-xs font-mono flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <span>
                          {isExpanded ? 'Recolher tributos' : `Ver detalhamento (${cat.subitems.length} tributos)`}
                        </span>
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {/* Lista de Subitens Expandida */}
                      {isExpanded && (
                        <div className="space-y-2 pt-2 border-t border-border/40 animate-fade-in">
                          {cat.subitems.map((sub, sIdx) => (
                            <div
                              key={sIdx}
                              className="p-2.5 rounded-lg bg-background/80 border border-border/50 text-xs font-mono space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-foreground text-[11px]">{sub.name}</span>
                                <span className="text-emerald-500 font-bold text-[11px]">
                                  {formatFederalCurrency(sub.amount)}
                                </span>
                              </div>
                              <p className="text-[10px] font-sans text-muted-foreground leading-relaxed">
                                {sub.description}
                              </p>
                              <div className="text-[9px] text-muted-foreground/80 pt-0.5">
                                Representa {((sub.amount / cat.totalAmount) * 100).toFixed(1)}% desta categoria
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seção Cívica: Entenda as Finanças da União */}
          <div className="p-6 rounded-2xl border border-border bg-gradient-to-r from-card via-muted/30 to-card space-y-4">
            <h4 className="font-mono font-bold text-sm text-foreground flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              Guia Rápido: Como o Governo Federal se Financia
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans text-muted-foreground">
              <div className="p-4 rounded-xl bg-card border border-border/70 space-y-1.5">
                <span className="font-mono font-bold text-foreground text-sm flex items-center gap-1.5">
                  Emissão da Dívida (44,3%)
                </span>
                <p>
                  Quase metade da receita da LOA corresponde à <strong>rolagem da dívida pública</strong>.
                  Quando títulos do Tesouro vencem, o governo emite novos papéis no mercado financeiro para pagar
                  os antigos, sem que esse valor saia dos impostos correntes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border/70 space-y-1.5">
                <span className="font-mono font-bold text-foreground text-sm flex items-center gap-1.5">
                  Contribuições Vinculadas (22,2%)
                </span>
                <p>
                  Tributos como <strong>INSS, COFINS, PIS e CSLL</strong> possuem destinação constitucional obrigatória.
                  Por lei, esses recursos só podem ser gastos na Seguridade Social: aposentadorias, saúde pública (SUS) e assistência social.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border/70 space-y-1.5">
                <span className="font-mono font-bold text-foreground text-sm flex items-center gap-1.5">
                  Impostos de Renda & Consumo (20,2%)
                </span>
                <p>
                  O Imposto de Renda (IRPF e IRPJ) compõe a maior fonte tributária geral da União. Uma parcela
                  expressiva desse montante é repassada constitucionalmente aos Municípios (FPM) e Estados (FPE).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ABA: BALANÇO FISCAL — RECEITAS VS. DESPESAS & RESULTADO PRIMÁRIO
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'balanco' && (
        <div className="space-y-8 animate-fade-in">
          {/* Card Principal: Balanço Lado a Lado (De Onde Vem vs Para Onde Vai) */}
          <div className="v-card p-6 rounded-2xl border border-border space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-semibold mb-2">
                  <Scale size={13} />
                  Balanço Geral da União ({selectedYear})
                </div>
                <h3 className="text-xl font-mono font-bold text-foreground">
                  Confronto Oficial: Receitas vs. Despesas
                </h3>
                <p className="text-xs text-muted-foreground font-sans mt-0.5">
                  Toda despesa aprovada na Lei Orçamentária Anual precisa estar equilibrada com uma fonte de arrecadação prevista.
                </p>
              </div>

              <div className="text-right font-mono">
                <div className="text-xs text-muted-foreground">Volume Total Orçado:</div>
                <div className="text-2xl font-bold text-foreground">
                  {formatFederalCurrency(budgetData.totals.totalBudget)}
                </div>
              </div>
            </div>

            {/* Comparativo em Duas Colunas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {/* Coluna 1: De Onde Vem (Receitas) */}
              <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border/60 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-500">
                      <ArrowDownRight size={18} />
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">De Onde Vem (Receitas)</h4>
                      <span className="text-[11px] text-muted-foreground">Entradas e Arrecadações</span>
                    </div>
                  </div>
                  <span className="font-bold text-base text-emerald-500">
                    {formatFederalCurrency(budgetData.totals.totalBudget)}
                  </span>
                </div>

                <div className="space-y-3">
                  {budgetData.revenues.map((cat) => (
                    <div key={cat.id} className="p-2.5 rounded-xl bg-card/40 border border-border/40 hover:border-emerald-500/40 transition-colors space-y-1.5">
                      <div className="flex items-start justify-between gap-3 text-xs font-mono">
                        <div className="text-foreground flex items-start gap-2 flex-1 min-w-0">
                          <span className="text-base shrink-0 leading-none mt-0.5 select-none">{cat.icon}</span>
                          <span className="font-semibold text-foreground break-words leading-snug">
                            {cat.name}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2 font-bold shrink-0 text-right pt-0.5">
                          <span className="text-muted-foreground text-[11px] font-normal">{cat.percentageOfTotal.toFixed(1)}%</span>
                          <span className="text-foreground whitespace-nowrap">{formatFederalCurrency(cat.totalAmount)}</span>
                        </div>
                      </div>
                      <div className="w-full bg-border/50 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${cat.percentageOfTotal}%`,
                            backgroundColor: cat.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coluna 2: Para Onde Vai (Despesas) */}
              <div className="p-5 rounded-xl border border-primary/30 bg-primary/5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border/60 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-primary/20 text-primary">
                      <ArrowUpRight size={18} />
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">Para Onde Vai (Despesas)</h4>
                      <span className="text-[11px] text-muted-foreground">Execução e Liquidações</span>
                    </div>
                  </div>
                  <span className="font-bold text-base text-primary">
                    {formatFederalCurrency(budgetData.totals.totalBudget)}
                  </span>
                </div>

                <div className="space-y-3">
                  {budgetData.areas.map((area) => (
                    <div key={area.id} className="p-2.5 rounded-xl bg-card/40 border border-border/40 hover:border-primary/40 transition-colors space-y-1.5">
                      <div className="flex items-start justify-between gap-3 text-xs font-mono">
                        <div className="text-foreground flex items-start gap-2 flex-1 min-w-0">
                          <span className="text-base shrink-0 leading-none mt-0.5 select-none">{area.icon}</span>
                          <span className="font-semibold text-foreground break-words leading-snug">
                            {area.name}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2 font-bold shrink-0 text-right pt-0.5">
                          <span className="text-muted-foreground text-[11px] font-normal">{area.percentageOfTotal.toFixed(1)}%</span>
                          <span className="text-foreground whitespace-nowrap">{formatFederalCurrency(area.totalAmount)}</span>
                        </div>
                      </div>
                      <div className="w-full bg-border/50 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${area.percentageOfTotal}%`,
                            backgroundColor: area.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Painel do Resultado Fiscal Oficial (SIAFI / Tesouro Nacional) */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-mono font-bold text-foreground flex items-center gap-2">
                <Landmark size={18} className="text-primary" />
                Painel do Resultado Fiscal & Arcabouço (STN / SIAFI)
              </h3>
              <p className="text-xs text-muted-foreground font-sans">
                Acompanhe os indicadores que o mercado financeiro e os órgãos de controle utilizam para medir a solvência do país.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Receita Primária Líquida */}
              <div className="v-card p-5 rounded-xl border border-border space-y-2">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
                  <span>Receita Primária Líquida</span>
                  <span className="text-emerald-500 font-bold">Entrada Efetiva</span>
                </div>
                <div className="text-2xl font-mono font-bold text-foreground">
                  {formatFederalCurrency(budgetData.fiscalBalance.netPrimaryRevenue)}
                </div>
                <p className="text-[11px] font-sans text-muted-foreground">
                  Arrecadação real de tributos após deduzir os repasses constitucionais aos Estados e Municípios (FPM/FPE).
                </p>
              </div>

              {/* Card 2: Despesa Primária */}
              <div className="v-card p-5 rounded-xl border border-border space-y-2">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
                  <span>Despesa Primária</span>
                  <span className="text-amber-500 font-bold">Custo Público</span>
                </div>
                <div className="text-2xl font-mono font-bold text-foreground">
                  {formatFederalCurrency(budgetData.fiscalBalance.primaryExpenses)}
                </div>
                <p className="text-[11px] font-sans text-muted-foreground">
                  Gastos operacionais com Previdência, Saúde, Educação, salários públicos e Bolsa Família (sem juros).
                </p>
              </div>

              {/* Card 3: Resultado Primário */}
              <div className="v-card p-5 rounded-xl border border-border space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
                  <span>Resultado Primário</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      budgetData.fiscalBalance.isPrimarySurplus
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    {budgetData.fiscalBalance.isPrimarySurplus ? 'Superávit Primário' : 'Déficit Primário'}
                  </span>
                </div>
                <div
                  className={`text-2xl font-mono font-bold ${
                    budgetData.fiscalBalance.isPrimarySurplus ? 'text-emerald-500' : 'text-destructive'
                  }`}
                >
                  {budgetData.fiscalBalance.isPrimarySurplus ? '+' : '-'}
                  {formatFederalCurrency(Math.abs(budgetData.fiscalBalance.primaryResult))}
                </div>
                <p className="text-[11px] font-sans text-muted-foreground">
                  {budgetData.fiscalBalance.fiscalTargetNote}
                </p>
              </div>

              {/* Card 4: Juros e Resultado Nominal */}
              <div className="v-card p-5 rounded-xl border border-border space-y-2">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
                  <span>Juros da Dívida</span>
                  <span className="text-destructive font-bold">Encargos Selic</span>
                </div>
                <div className="text-2xl font-mono font-bold text-destructive">
                  {formatFederalCurrency(budgetData.fiscalBalance.debtInterest)}
                </div>
                <div className="text-[11px] font-mono text-muted-foreground pt-1 border-t border-border/50 flex justify-between">
                  <span>Resultado Nominal:</span>
                  <span className="font-bold text-foreground">
                    {formatFederalCurrency(budgetData.fiscalBalance.nominalResult)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Raio-X da Rigidez Orçamentária & O Impacto Real da Taxa Selic */}
          <div className="v-card p-6 rounded-2xl border border-border bg-gradient-to-b from-card via-card to-background space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono font-semibold">
                <Layers size={13} />
                Rigidez das Contas Públicas
              </div>
              <h4 className="text-xl font-mono font-bold text-foreground">
                Por que a conta pública não fecha tão facilmente?
              </h4>
              <p className="text-xs text-muted-foreground font-sans max-w-3xl leading-relaxed">
                Diferente do orçamento doméstico, o Governo Federal não pode simplesmente "gastar menos" ou "cortar despesas" por decreto: mais de <strong>93% de todo o orçamento primário está engessado por leis e pela Constituição de 1988</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Bloco 1: 93% Despesas Obrigatórias */}
              <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-amber-500 flex items-center gap-1.5">
                    Despesas Obrigatórias
                  </span>
                  <span className="text-muted-foreground">93% do Primário</span>
                </div>
                <div className="text-2xl font-mono font-bold text-foreground">
                  {formatFederalCurrency(budgetData.totals.mandatoryExpenses)}
                </div>
                <p className="text-xs font-sans text-muted-foreground leading-relaxed">
                  Aposentadorias do INSS, salários de médicos do SUS e professores federais, benefícios do BPC e pisos constitucionais de Saúde e Educação. O Executivo não pode reduzir 1 real desses compromissos sem aprovar uma PEC com 3/5 do Congresso.
                </p>
              </div>

              {/* Bloco 2: Impacto da Taxa Selic */}
              <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-destructive flex items-center gap-1.5">
                    Sensibilidade à Selic
                  </span>
                  <span className="text-muted-foreground">Juros Anuais</span>
                </div>
                <div className="text-2xl font-mono font-bold text-foreground">
                  {formatFederalCurrency(budgetData.fiscalBalance.debtInterest)}
                </div>
                <p className="text-xs font-sans text-muted-foreground leading-relaxed">
                  <strong>Regra de Sensibilidade:</strong> Cada 1 ponto percentual (1%) de aumento ou queda na taxa básica Selic altera a conta de juros da dívida em aproximadamente <strong>R$ 48 bilhões ao ano</strong> (Fonte: Relatório Focus / Banco Central).
                </p>
              </div>

              {/* Bloco 3: Despesas Livres (Investimento) */}
              <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-emerald-500 flex items-center gap-1.5">
                    Investimentos Livres
                  </span>
                  <span className="text-muted-foreground">&lt; 2% do Total</span>
                </div>
                <div className="text-2xl font-mono font-bold text-foreground">
                  {formatFederalCurrency(budgetData.totals.directInvestments)}
                </div>
                <p className="text-xs font-sans text-muted-foreground leading-relaxed">
                  A parcela discricionária livre onde o governo pode remanejar recursos para rodovias, pontes, pesquisa e infraestrutura representa menos de 2% do orçamento total. Quando há contingenciamento de gastos, é essa pequena fatia que costuma ser travada.
                </p>
              </div>
            </div>

            {/* Banner de Contexto do Arcabouço Fiscal */}
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-sans">
              <div className="space-y-0.5">
                <strong className="font-mono text-foreground text-sm flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-primary" />
                  Como o Novo Arcabouço Fiscal (LC 200/2023) atua nessa equação:
                </strong>
                <p className="text-muted-foreground">
                  Para conter o endividamento sem estrangular serviços básicos, o Arcabouço determina que as despesas só podem crescer no máximo até <strong>70% do crescimento real da arrecadação de receitas</strong>, assegurando convergência fiscal gradual.
                </p>
              </div>
              <div className="font-mono text-[11px] bg-background/80 px-3 py-1.5 rounded-lg border border-border shrink-0 text-muted-foreground">
                Meta Oficial: <strong className="text-foreground">Déficit Zero (±R$ 31 Bi)</strong>
              </div>
            </div>
          </div>

          {/* Perguntas Frequentes Cívicas sobre o Balanço Fiscal */}
          <div className="space-y-3">
            <h4 className="font-mono font-bold text-sm text-foreground flex items-center gap-2">
              <HelpCircle size={16} className="text-primary" />
              Perguntas Frequentes sobre as Contas da União
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
              <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
                <strong className="font-mono text-foreground text-sm block">
                  1. O que é Resultado Primário vs. Resultado Nominal?
                </strong>
                <p className="text-muted-foreground leading-relaxed">
                  O <strong>Resultado Primário</strong> mede a diferença entre o que o governo arrecada e o que ele gasta com serviços públicos essenciais, sem contar juros da dívida.
                  Já o <strong>Resultado Nominal</strong> inclui a conta inteira de juros pagos aos detentores de títulos públicos.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
                <strong className="font-mono text-foreground text-sm block">
                  2. O que é o Novo Arcabouço Fiscal (LC 200/2023)?
                </strong>
                <p className="text-muted-foreground leading-relaxed">
                  É a regra fiscal brasileira que substituiu o Teto de Gastos. Ela determina que as despesas públicas
                  só podem crescer no máximo até 70% do crescimento das receitas do ano anterior, assegurando sustentabilidade à dívida.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
                <strong className="font-mono text-foreground text-sm block">
                  3. Por que a conta de juros da dívida é tão alta?
                </strong>
                <p className="text-muted-foreground leading-relaxed">
                  O Tesouro Nacional remunera os investidores com base na taxa básica de juros (Selic) e na inflação (IPCA).
                  Mesmo sem emitir dívida nova para consumo diário, o estoque acumulado da dívida pública exige o pagamento contínuo de encargos contratuais.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
                <strong className="font-mono text-foreground text-sm block">
                  4. O que é a Regra de Ouro da Constituição?
                </strong>
                <p className="text-muted-foreground leading-relaxed">
                  Prevista no Art. 167 da CF/88, proíbe que o Governo Federal contraia empréstimos para pagar despesas correntes (como salários de servidores e aposentadorias). Empréstimos só podem financiar investimentos ou amortizar a própria dívida.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ABA 2: NAVEGADOR EM ÁRVORE (DRILL-DOWN INTERATIVO ATÉ O FIM)
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'drill-down' && (
        <div className="space-y-6 animate-fade-in">
          {/* Breadcrumb Navegável com quebra limpa */}
          <div className="v-card p-4 rounded-xl border border-border flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-muted-foreground shrink-0">Você está em:</span>
            {drillBreadcrumbs.map((crumb, idx) => {
              const isLast = idx === drillBreadcrumbs.length - 1;
              return (
                <div key={idx} className="flex items-center gap-2">
                  {idx > 0 && <ChevronRight size={14} className="text-muted-foreground shrink-0" />}
                  <button
                    type="button"
                    onClick={() => handleBreadcrumbClick(crumb, idx)}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      isLast
                        ? 'bg-primary/10 text-primary font-bold border border-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {crumb.label}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Nível 1: Visão Geral de Todas as Áreas (quando nenhuma está selecionada) */}
          {!activeArea && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-mono font-bold text-foreground">
                    Passo 1: Selecione uma Grande Área de Gasto
                  </h3>
                  <p className="text-xs text-muted-foreground font-sans">
                    Escolha onde deseja aprofundar para ver ministérios, programas e favorecidos finais.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {budgetData.areas.map((area) => (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => handleSelectArea(area)}
                    className="v-card p-5 rounded-xl border border-border text-left hover:border-primary transition-all group flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">{area.icon}</span>
                        <div>
                          <h4 className="font-mono font-bold text-sm text-foreground group-hover:text-primary">
                            {area.name}
                          </h4>
                          <span className="text-xs font-mono text-muted-foreground">
                            {area.percentageOfTotal.toFixed(2)}% do orçamento
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-muted-foreground group-hover:translate-x-1 text-primary transition-transform" />
                    </div>

                    <p className="text-xs text-muted-foreground font-sans line-clamp-2">
                      {area.description}
                    </p>

                    <div className="pt-2 border-t border-border/60 w-full flex items-center justify-between font-mono text-xs">
                      <span className="text-muted-foreground">Volume Executado:</span>
                      <span className="font-bold text-foreground">
                        {formatFederalCurrency(area.totalAmount)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nível 2: Área Selecionada (Mostra Órgãos e Programas) */}
          {activeArea && !activeProgram && (
            <div className="space-y-6">
              {/* Cabeçalho da Área */}
              <div className="v-card p-6 rounded-2xl border border-border bg-gradient-to-r from-card to-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{activeArea.icon}</span>
                  <div>
                    <h3 className="text-xl font-mono font-bold text-foreground">
                      {activeArea.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-sans max-w-xl mt-1">
                      {activeArea.description}
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs text-muted-foreground block">Orçamento da Área:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatFederalCurrency(activeArea.totalAmount)}
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    {activeArea.percentageOfTotal}% de todo o governo federal
                  </span>
                </div>
              </div>

              {/* Subfunções da Área */}
              {activeArea.subfunctions && activeArea.subfunctions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-mono font-bold text-foreground flex items-center gap-2">
                    <Layers size={16} className="text-primary" />
                    Divisão por Subfunções Orçamentárias
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {activeArea.subfunctions.map((sub) => (
                      <div key={sub.id} className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
                        <div className="text-xs font-mono font-bold text-foreground truncate">
                          {sub.name}
                        </div>
                        <div className="text-sm font-mono font-bold text-primary">
                          {formatFederalCurrency(sub.amount)}
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2">
                          {sub.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Programas Orçamentários da Área */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-mono font-bold text-foreground flex items-center gap-2">
                    <Building2 size={16} className="text-primary" />
                    Passo 2: Escolha um Programa de Governo para Ver as Ações
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {activeArea.programs.map((prog) => (
                    <div
                      key={prog.id}
                      className="v-card p-5 rounded-xl border border-border hover:border-primary transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                              Programa {prog.code}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-muted-foreground bg-muted">
                              Órgão: {prog.organAcronym}
                            </span>
                          </div>
                          <h5 className="font-mono font-bold text-base text-foreground mt-1">
                            {prog.name}
                          </h5>
                        </div>

                        <div className="text-right font-mono">
                          <span className="text-xs text-muted-foreground block">Dotação:</span>
                          <span className="font-bold text-foreground text-lg">
                            {formatFederalCurrency(prog.amount)}
                          </span>
                        </div>
                      </div>

                      {/* Lista de Ações dentro do programa */}
                      <div className="space-y-2 pt-2 border-t border-border/60">
                        <span className="text-xs font-mono text-muted-foreground font-semibold block">
                          Ações Orçamentárias Disponíveis ({prog.actions.length}):
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {prog.actions.map((act) => (
                            <button
                              key={act.id}
                              type="button"
                              onClick={() => {
                                handleSelectProgram(prog);
                                handleSelectAction(act);
                              }}
                              className="p-3 rounded-lg bg-muted/50 border border-border text-left hover:border-primary hover:bg-muted transition-all flex items-center justify-between group"
                            >
                              <div className="overflow-hidden pr-2">
                                <span className="text-[10px] font-mono font-bold text-primary block">
                                  Ação {act.code}
                                </span>
                                <span className="text-xs font-semibold text-foreground line-clamp-1">
                                  {act.name}
                                </span>
                                <span className="text-[11px] font-mono text-muted-foreground block mt-0.5">
                                  {formatFederalCurrency(act.amount)} • {act.beneficiaries.length} favorecidos auditados
                                </span>
                              </div>
                              <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-transform shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Nível 3: Ação Selecionada e "O FIM DA LINHA" (Favorecidos Finais) */}
          {activeArea && activeProgram && activeAction && (
            <div className="space-y-6">
              {/* Detalhes da Ação Orçamentária */}
              <div className="v-card p-6 rounded-2xl border border-border bg-gradient-to-r from-card to-muted/20 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-primary text-primary-foreground">
                    Ação Governamental {activeAction.code}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    Programa {activeProgram.code} ({activeProgram.organAcronym})
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-mono font-bold text-foreground">
                      {activeAction.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-sans mt-1 max-w-2xl">
                      {activeAction.description}
                    </p>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-xs text-muted-foreground block">Recurso Total da Ação:</span>
                    <span className="text-2xl font-bold text-foreground">
                      {formatFederalCurrency(activeAction.amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* O Fim do Dinheiro: Quem Recebeu os Recursos */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <h4 className="text-base font-mono font-bold text-foreground">
                      O Fim da Linha: Destinatários e Favorecidos Finais Auditados ({activeAction.beneficiaries.length})
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    Dados com Notas de Empenho SIAFI
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {activeAction.beneficiaries.map((rec) => (
                    <div
                      key={rec.id}
                      className="v-card p-5 rounded-xl border border-border hover:border-emerald-500/60 transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-muted text-foreground border border-border">
                              {rec.type.replace('_', ' ')}
                            </span>
                            <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                              <MapPin size={12} />
                              {rec.city}/{rec.uf}
                            </span>
                            <span className="text-xs font-mono text-muted-foreground">
                              Data: {new Date(rec.date).toLocaleDateString('pt-BR')}
                            </span>
                          </div>

                          <h5 className="font-mono font-bold text-base text-foreground">
                            {rec.name}
                          </h5>

                          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                            <span>Documento: {rec.document}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyDoc(rec.document)}
                              className="hover:text-foreground text-primary transition-colors"
                              title="Copiar CNPJ/Código"
                            >
                              {copiedDocument === rec.document ? <Check size={13} /> : <Copy size={13} />}
                            </button>
                            <span>• Nota: {rec.documentNumber}</span>
                          </div>
                        </div>

                        <div className="text-right font-mono sm:shrink-0">
                          <span className="text-xs text-muted-foreground block">Valor Liquidado:</span>
                          <span className="text-xl font-bold text-emerald-500">
                            {formatExactCurrency(rec.amount)}
                          </span>
                        </div>
                      </div>

                      {/* Descrição do Objeto */}
                      <div className="p-3 rounded-lg bg-muted/60 border border-border/80 text-xs text-muted-foreground font-sans">
                        <strong className="text-foreground font-mono block mb-1">
                          Objeto / Destinação Contratual:
                        </strong>
                        {rec.objectDescription}
                      </div>

                      {/* Link Auditável no Portal da Transparência */}
                      <div className="flex items-center justify-between text-xs font-mono pt-1">
                        <span className="text-muted-foreground">Fonte: Portal da Transparência da CGU</span>
                        <a
                          href={rec.transparencyPortalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
                        >
                          Auditar Nota no Portal Oficial da CGU
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão de voltar um nível */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedActionId(null);
                    setDrillBreadcrumbs((prev) => prev.slice(0, 3));
                  }}
                  className="v-btn -ghost -sm font-mono text-xs"
                >
                  ← Voltar para as Ações do Programa {activeProgram.code}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ABA 3: RASTREADOR DA PONTA (TABELA DE FAVORECIDOS E CONTRATOS)
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'favorecidos' && (
        <div className="space-y-6 animate-fade-in">
          {/* Barra de Filtros e Busca */}
          <div className="v-card p-5 rounded-2xl border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-mono font-bold text-foreground flex items-center gap-2">
                  <Search size={18} className="text-primary" />
                  Rastreador Auditável de Favorecidos e Contratos
                </h3>
                <p className="text-xs text-muted-foreground font-sans">
                  Filtre por empresa contratada, prefeitura, CNPJ, nota de empenho ou estado de destino.
                </p>
              </div>

              {/* Botão de Exportação CSV */}
              <button
                type="button"
                onClick={() => exportRecipientsToCSV(filteredRecipients, `gastos-uniao-${selectedYear}.csv`)}
                className="v-btn -accent -sm font-mono font-bold text-xs inline-flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Download size={14} />
                Baixar Planilha CSV ({filteredRecipients.length})
              </button>
            </div>

            {/* Inputs de Filtro */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {/* Campo de Busca Livre */}
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar empresa, CNPJ ou obra..."
                  value={favorecidoSearch}
                  onChange={(e) => setFavorecidoSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              {/* Filtro de Área */}
              <div>
                <select
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="todos">Todas as Áreas Orçamentárias</option>
                  {budgetData.areas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro de Tipo */}
              <div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="todos">Todos os Tipos de Favorecido</option>
                  <option value="EMPRESA_PRIVADA">Empresas Privadas / Fornecedores</option>
                  <option value="TRANSFERENCIA_MUNICIPIO">Repasses para Prefeituras</option>
                  <option value="TRANSFERENCIA_ESTADO">Repasses para Governos Estaduais</option>
                  <option value="INSTITUTO_HOSPITAL">Hospitais / Institutos de Pesquisa</option>
                  <option value="BENEFICIARIO_DIRETO">Beneficiários Diretos / Contas Sociais</option>
                  <option value="CONSORCIO_OBRAS">Consórcios de Engenharia e Obras</option>
                </select>
              </div>

              {/* Filtro de UF */}
              <div>
                <select
                  value={ufFilter}
                  onChange={(e) => setUfFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="todos">Todos os Estados (UF)</option>
                  {availableUfs.map((uf) => (
                    <option key={uf} value={uf}>
                      Estado: {uf}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Resumo da Filtragem */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-muted-foreground pt-2 border-t border-border/60">
              <div>
                Encontrados: <strong className="text-foreground">{filteredRecipients.length}</strong> favorecidos
                auditados | Soma filtrada:{' '}
                <strong className="text-primary">{formatFederalCurrency(totalFilteredAmount)}</strong>
              </div>

              <div className="flex items-center gap-2">
                <span>Ordenar:</span>
                <button
                  type="button"
                  onClick={() => setSortBy('amount-desc')}
                  className={`px-2 py-0.5 rounded text-[11px] ${
                    sortBy === 'amount-desc' ? 'bg-primary/10 text-primary font-bold' : 'hover:text-foreground'
                  }`}
                >
                  Maior Valor
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('amount-asc')}
                  className={`px-2 py-0.5 rounded text-[11px] ${
                    sortBy === 'amount-asc' ? 'bg-primary/10 text-primary font-bold' : 'hover:text-foreground'
                  }`}
                >
                  Menor Valor
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('date-desc')}
                  className={`px-2 py-0.5 rounded text-[11px] ${
                    sortBy === 'date-desc' ? 'bg-primary/10 text-primary font-bold' : 'hover:text-foreground'
                  }`}
                >
                  Data Recente
                </button>
              </div>
            </div>
          </div>

          {/* Tabela de Favorecidos (Desktop) & Cards (Mobile) */}
          <div className="space-y-4">
            {/* Versão Desktop (Tabela Completa) */}
            <div className="hidden md:block v-card rounded-2xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/50 text-[11px] font-mono uppercase text-muted-foreground tracking-wider">
                      <th className="p-4">Favorecido / Beneficiário</th>
                      <th className="p-4">Área / Ação</th>
                      <th className="p-4">Local</th>
                      <th className="p-4">Documento / Nota</th>
                      <th className="p-4 text-right">Valor Pago</th>
                      <th className="p-4 text-center">Auditar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-xs font-mono">
                    {filteredRecipients.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground font-sans">
                          Nenhum favorecido encontrado com os filtros selecionados.
                        </td>
                      </tr>
                    ) : (
                      filteredRecipients.map((rec) => (
                        <tr key={rec.id} className="hover:bg-muted/40 transition-colors">
                          <td className="p-4 min-w-[200px]">
                            <div className="font-bold text-foreground text-sm break-words leading-snug">
                              {rec.name}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                              <span>{rec.document}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyDoc(rec.document)}
                                title="Copiar Documento"
                                className="text-primary hover:text-foreground"
                              >
                                {copiedDocument === rec.document ? <Check size={12} /> : <Copy size={12} />}
                              </button>
                            </div>
                            <div className="text-[11px] text-muted-foreground font-sans break-words mt-1 leading-relaxed">
                              {rec.objectDescription}
                            </div>
                          </td>

                          <td className="p-4 min-w-[180px]">
                            <span className="font-semibold text-foreground block break-words">
                              {rec.areaName}
                            </span>
                            <span className="text-[11px] text-muted-foreground block break-words mt-0.5 leading-snug">
                              {rec.actionName}
                            </span>
                          </td>

                          <td className="p-4 whitespace-nowrap">
                            <span className="text-foreground font-bold">{rec.uf}</span>
                            <span className="text-muted-foreground block text-[11px]">{rec.city}</span>
                          </td>

                          <td className="p-4 whitespace-nowrap">
                            <span className="text-foreground block">{rec.documentNumber}</span>
                            <span className="text-muted-foreground text-[11px] block">
                              {new Date(rec.date).toLocaleDateString('pt-BR')}
                            </span>
                          </td>

                          <td className="p-4 text-right whitespace-nowrap">
                            <span className="font-bold text-emerald-500 text-sm block">
                              {formatExactCurrency(rec.amount)}
                            </span>
                            <span className="text-[10px] text-muted-foreground">Ordem Bancária</span>
                          </td>

                          <td className="p-4 text-center whitespace-nowrap">
                            <a
                              href={rec.transparencyPortalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="v-btn -ghost -sm p-1.5 text-primary hover:bg-primary/10 inline-flex items-center justify-center rounded-lg"
                              title="Auditar no Portal da Transparência da CGU"
                            >
                              <ExternalLink size={15} />
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Versão Mobile (Cards Responsivos sem qualquer corte ou rolagem horizontal) */}
            <div className="md:hidden space-y-3">
              {filteredRecipients.length === 0 ? (
                <div className="v-card p-6 text-center text-muted-foreground font-sans text-xs">
                  Nenhum favorecido encontrado com os filtros selecionados.
                </div>
              ) : (
                filteredRecipients.map((rec) => (
                  <div key={rec.id} className="v-card p-4 rounded-xl border border-border space-y-3 font-mono">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-primary block">
                          {rec.areaName}
                        </span>
                        <h5 className="font-bold text-sm text-foreground leading-snug">
                          {rec.name}
                        </h5>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <span>{rec.document}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyDoc(rec.document)}
                            className="text-primary hover:text-foreground"
                          >
                            {copiedDocument === rec.document ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-emerald-500 text-sm block">
                          {formatExactCurrency(rec.amount)}
                        </span>
                        <span className="text-[10px] text-muted-foreground block">
                          {rec.uf} • {rec.city}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-muted/50 border border-border/80 text-[11px] text-muted-foreground font-sans leading-relaxed">
                      {rec.objectDescription}
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/60">
                      <span className="text-muted-foreground">Nota: {rec.documentNumber}</span>
                      <a
                        href={rec.transparencyPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                      >
                        Auditar Nota
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ABA 4: CALCULADORA CÍVICA "ONDE FOI MEU IMPOSTO?"
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'calculadora' && (
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
          {/* Apresentação da Calculadora */}
          <div className="v-card p-6 rounded-2xl border border-border space-y-4">
            <div className="flex items-center gap-2">
              <Calculator size={20} className="text-primary" />
              <h3 className="text-lg font-mono font-bold text-foreground">
                Calculadora Cívica: O Destino do Seu Próprio Dinheiro
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
              No Brasil, estima-se que em média <strong className="text-foreground">33%</strong> de toda a renda
              de um cidadão seja destinada a tributos federais, estaduais e municipais (impostos diretos no
              contracheque e impostos embutidos em cada produto e serviço). Digite sua renda mensal para
              ver exatamente como o seu imposto é dividido entre saúde, aposentadorias, estradas e defesa.
            </p>

            {/* Input de Renda */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-mono font-semibold text-foreground block">
                Sua Renda Bruta Mensal (ou média familiar):
              </label>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-muted-foreground">R$</span>
                <input
                  type="number"
                  min={500}
                  step={500}
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Math.max(0, Number(e.target.value)))}
                  className="px-4 py-2.5 rounded-xl bg-background border border-border font-mono text-lg font-bold text-foreground focus:outline-none focus:border-primary w-full sm:w-64"
                />
              </div>

              {/* Sugestões Rápidas */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-mono text-muted-foreground mr-1">Sugestões:</span>
                {[
                  { label: '1 Salário Mínimo (R$ 1.518)', value: 1518 },
                  { label: 'R$ 3.000', value: 3000 },
                  { label: 'R$ 5.000', value: 5000 },
                  { label: 'R$ 8.000', value: 8000 },
                  { label: 'R$ 15.000', value: 15000 },
                ].map((sug) => (
                  <button
                    key={sug.value}
                    type="button"
                    onClick={() => setMonthlyIncome(sug.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors border ${
                      monthlyIncome === sug.value
                        ? 'bg-primary/10 text-primary border-primary/30 font-bold'
                        : 'bg-muted/50 text-muted-foreground border-border hover:text-foreground'
                    }`}
                  >
                    {sug.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* O Recibo Cívico Digital */}
          <div className="v-card p-6 sm:p-8 rounded-2xl border-2 border-dashed border-border bg-card space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div>
                <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider block">
                  Extrato Cívico de Cidadania • Exercício {selectedYear}
                </span>
                <h4 className="text-xl font-mono font-bold text-foreground">
                  Seu Comprovante Anual de Destinação de Impostos
                </h4>
              </div>

              <button
                type="button"
                onClick={handleCopyCitizenReceipt}
                className="v-btn -accent -sm font-mono font-bold text-xs inline-flex items-center gap-1.5 self-start sm:self-auto"
              >
                {copiedReceipt ? <Check size={14} /> : <Copy size={14} />}
                {copiedReceipt ? 'Extrato Copiado!' : 'Copiar Extrato Cívico'}
              </button>
            </div>

            {/* Totalizadores do Extrato */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-muted/50 border border-border font-mono">
              <div>
                <span className="text-xs text-muted-foreground block">Renda Familiar Anual Declarada:</span>
                <span className="text-xl font-bold text-foreground">
                  R$ {(monthlyIncome * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Contribuição Tributária Estimada:</span>
                <span className="text-xl font-bold text-primary">
                  R$ {citizenCalculation.totalTax.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="text-xs font-normal text-muted-foreground ml-1">/ ano</span>
                </span>
              </div>
            </div>

            {/* Linhas do Recibo */}
            <div className="space-y-3 font-mono">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Discriminação por Área de Governo:
              </span>

              <div className="divide-y divide-border/60">
                {citizenCalculation.shares.map((share) => (
                  <div key={share.areaId} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="text-lg shrink-0">{share.icon}</span>
                      <div className="overflow-hidden">
                        <span className="font-bold text-foreground block truncate">
                          {share.areaName}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-sans truncate block">
                          Exemplos: {share.examples.join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-bold text-foreground text-sm block">
                        R$ {share.yourShareInBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {share.percentage.toFixed(2)}% do imposto
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span>Cálculo baseado na execução oficial da LOA {selectedYear} (Tesouro Nacional)</span>
              <span>Vote Radar • Transparência Pública Aberta</span>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ABA 5: FONTES OFICIAIS & SINCRONIZAÇÃO AUTOMÁTICA
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'fontes' && (
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
          {/* Painel de Status de Sincronização */}
          <div className="v-card p-6 rounded-2xl border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-base font-mono font-bold text-foreground">
                  Status da Conexão com os Dados Abertos do Governo Brasileiro
                </h3>
              </div>
              <button
                type="button"
                onClick={handleSyncGov}
                disabled={syncing}
                className="v-btn -ghost -sm font-mono text-xs inline-flex items-center gap-1.5"
              >
                <RefreshCw size={13} className={syncing ? 'animate-spin text-primary' : ''} />
                Sincronizar Novamente
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono">
              <div className="p-3.5 rounded-xl bg-muted/50 border border-border">
                <span className="text-[11px] text-muted-foreground block">API Tesouro Transparente</span>
                <span className="text-sm font-bold text-emerald-500">Conectado (200 OK)</span>
                <span className="text-[10px] text-muted-foreground block mt-0.5">
                  Latência: {govStatus.latencyMs}ms
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/50 border border-border">
                <span className="text-[11px] text-muted-foreground block">Bases de Despesas Indexadas</span>
                <span className="text-sm font-bold text-foreground">
                  {govStatus.packagesCount} Datasets Oficiais
                </span>
                <span className="text-[10px] text-muted-foreground block mt-0.5">
                  Classificação COFOG / SIAFI
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/50 border border-border">
                <span className="text-[11px] text-muted-foreground block">Última Publicação do Governo</span>
                <span className="text-xs font-bold text-foreground block truncate" title={govStatus.lastGovUpdate}>
                  {govStatus.lastGovUpdate}
                </span>
                <span className="text-[10px] text-emerald-500 block mt-0.5">
                  Sincronizado Automaticamente
                </span>
              </div>
            </div>
          </div>

          {/* Origem dos Dados e Metodologia */}
          <div className="v-card p-6 rounded-2xl border border-border space-y-4">
            <h3 className="text-base font-mono font-bold text-foreground flex items-center gap-2">
              <FileSpreadsheet size={18} className="text-primary" />
              De onde vêm exatamente essas informações?
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
              <p>
                Todos os dados exibidos no Vote Radar são extraídos exclusivamente dos canais públicos
                oficiais do Estado Brasileiro, sem qualquer alteração de teor, viés ou intermediação partidária:
              </p>

              <ul className="space-y-3 font-mono text-xs">
                <li className="p-3 rounded-xl bg-muted/40 border border-border flex items-start gap-3">
                  <span className="text-primary font-bold shrink-0">1.</span>
                  <div>
                    <strong className="text-foreground block">SIAFI (Sistema Integrado de Administração Financeira):</strong>
                    O sistema contábil oficial onde cada ministério, tribunal ou autarquia registra o empenho, liquidação e pagamento de cada centavo público.
                  </div>
                </li>

                <li className="p-3 rounded-xl bg-muted/40 border border-border flex items-start gap-3">
                  <span className="text-primary font-bold shrink-0">2.</span>
                  <div>
                    <strong className="text-foreground block">Portal da Transparência da CGU (Controladoria-Geral da União):</strong>
                    Base aberta de dados com as notas fiscais, CNPJ de fornecedores, convênios com municípios e ordens bancárias de pagamento.
                  </div>
                </li>

                <li className="p-3 rounded-xl bg-muted/40 border border-border flex items-start gap-3">
                  <span className="text-primary font-bold shrink-0">3.</span>
                  <div>
                    <strong className="text-foreground block">Tesouro Transparente (Secretaria do Tesouro Nacional):</strong>
                    Publicação contínua da execução orçamentária primária e financeira da União, relatórios RREO e classificação COFOG.
                  </div>
                </li>

                <li className="p-3 rounded-xl bg-muted/40 border border-border flex items-start gap-3">
                  <span className="text-primary font-bold shrink-0">4.</span>
                  <div>
                    <strong className="text-foreground block">Siga Brasil & Orçamento da União (Senado Federal e Câmara):</strong>
                    Monitoramento da Lei Orçamentária Anual (LOA) e das Emendas Parlamentares impositivas.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Glossário Cívico */}
          <div className="v-card p-6 rounded-2xl border border-border space-y-4">
            <h3 className="text-base font-mono font-bold text-foreground">
              Glossário Cívico: Entenda as 3 Fases de Todo Gasto Público
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/10 text-primary">
                  Fase 1
                </span>
                <h5 className="font-mono font-bold text-sm text-foreground">Empenho</h5>
                <p className="text-xs text-muted-foreground font-sans">
                  O governo reserva o dinheiro para pagar um contrato ou compra futura. O dinheiro ainda não saiu dos cofres.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-500">
                  Fase 2
                </span>
                <h5 className="font-mono font-bold text-sm text-foreground">Liquidação</h5>
                <p className="text-xs text-muted-foreground font-sans">
                  A obra foi fiscalizada ou o produto foi entregue pelo fornecedor com nota fiscal conferida. O direito de receber está comprovado.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500">
                  Fase 3
                </span>
                <h5 className="font-mono font-bold text-sm text-foreground">Pagamento</h5>
                <p className="text-xs text-muted-foreground font-sans">
                  A Ordem Bancária (OB) é emitida e o valor cai na conta bancária do fornecedor ou prefeitura. É o valor definitivo demonstrado aqui.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
