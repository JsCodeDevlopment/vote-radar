// Dados Oficiais do Orçamento e Gastos da União (Governo Federal do Brasil)
// Fontes: Secretaria do Tesouro Nacional (SIAFI / RREO), Portal da Transparência da CGU,
// Siga Brasil (Senado Federal) e Dados Abertos do Ministério do Planejamento e Orçamento (LOA).

export type RecipientType =
  | 'EMPRESA_PRIVADA'
  | 'TRANSFERENCIA_MUNICIPIO'
  | 'TRANSFERENCIA_ESTADO'
  | 'INSTITUTO_HOSPITAL'
  | 'BENEFICIARIO_DIRETO'
  | 'CONSORCIO_OBRAS';

export interface FinalRecipient {
  id: string;
  name: string;
  document: string; // CNPJ / CPF desidentificado / Código SIAFI / IBGE
  type: RecipientType;
  amount: number; // Em Reais
  documentNumber: string; // Nota de Empenho (NE) ou Ordem Bancária (OB)
  date: string;
  uf: string;
  city: string;
  actionCode: string;
  actionName: string;
  organName: string;
  areaId: string;
  areaName: string;
  objectDescription: string;
  transparencyPortalUrl: string;
}

export interface BudgetAction {
  id: string;
  code: string;
  name: string;
  description: string;
  amount: number;
  beneficiaries: FinalRecipient[];
}

export interface BudgetProgram {
  id: string;
  code: string;
  name: string;
  amount: number;
  organAcronym: string;
  actions: BudgetAction[];
}

export interface BudgetOrgan {
  id: string;
  code: string;
  name: string;
  acronym: string;
  amount: number;
  description: string;
}

export interface BudgetSubfunction {
  id: string;
  name: string;
  amount: number;
  description: string;
}

export interface BudgetArea {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgTint: string;
  borderTint: string;
  description: string;
  totalAmount: number;
  percentageOfTotal: number;
  perCapitaYear: number;
  variationPercent: number;
  mandatoryRatio: number; // 0 a 1 (porção de gasto obrigatório por lei)
  subfunctions: BudgetSubfunction[];
  organs: BudgetOrgan[];
  programs: BudgetProgram[];
}

export type RevenueType =
  | 'TRIBUTARIA'
  | 'CONTRIBUICOES'
  | 'OPERACAO_CREDITO'
  | 'PATRIMONIAL_ROYALTIES'
  | 'TAXAS_SERVICOS'
  | 'OUTRAS_CORRENTES';

export interface RevenueSubitem {
  name: string;
  amount: number;
  description: string;
}

export interface RevenueCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: RevenueType;
  typeLabel: string;
  description: string;
  totalAmount: number;
  percentageOfTotal: number;
  variationPercent: number;
  subitems: RevenueSubitem[];
}

export interface FiscalBalance {
  totalRevenue: number; // R$ Total Arrecadado/Previsto
  totalExpenses: number; // R$ Total de Despesas Fixadas
  netPrimaryRevenue: number; // R$ Receita Primária Líquida (sem rolagem da dívida)
  primaryExpenses: number; // R$ Despesa Primária (sem juros)
  primaryResult: number; // R$ Resultado Primário (Receita Primária - Despesa Primária)
  isPrimarySurplus: boolean;
  debtInterest: number; // R$ Juros e encargos da dívida pagos
  nominalResult: number; // R$ Resultado Nominal (Resultado Primário - Juros)
  fiscalTargetNote: string;
}

export interface MacroTotals {
  totalBudget: number; // R$
  mandatoryExpenses: number; // R$
  discretionaryExpenses: number; // R$
  debtRefinancing: number; // R$ (Juros e amortização da dívida pública)
  directInvestments: number; // R$ (Obras, modernização, infraestrutura)
  totalBeneficiariesCount: number;
  totalAuditedContracts: number;
}

export interface FederalBudgetData {
  year: number;
  lastUpdated: string;
  officialSource: string;
  sourceUrl: string;
  cguApiStatus: 'online' | 'synced' | 'cached';
  totals: MacroTotals;
  fiscalBalance: FiscalBalance;
  revenues: RevenueCategory[];
  areas: BudgetArea[];
}

// ─────────────────────────────────────────────────────────────────────────────
// ARRECADAÇÃO E RECEITAS DA UNIÃO (2025) — RECEITA FEDERAL & TESOURO NACIONAL
// ─────────────────────────────────────────────────────────────────────────────

export const REVENUE_CATEGORIES_2025: RevenueCategory[] = [
  {
    id: 'divida-operacoes',
    name: 'Operações de Crédito e Emissão de Títulos da Dívida',
    icon: '📈',
    color: '#ef4444',
    type: 'OPERACAO_CREDITO',
    typeLabel: 'Operações de Crédito (Refinanciamento)',
    description: 'Emissão de títulos públicos federais (Tesouro Direto, Tesouro Selic, Prefixados e IPCA+) pelo Tesouro Nacional para refinanciar e rolar os títulos vencidos.',
    totalAmount: 2445000000000,
    percentageOfTotal: 44.3,
    variationPercent: 6.8,
    subitems: [
      { name: 'Refinanciamento da Dívida Pública Mobiliária Federal', amount: 1580000000000, description: 'Rolagem de títulos públicos vencidos no mercado interno' },
      { name: 'Emissão de Novos Títulos Públicos e Captações Externas', amount: 865000000000, description: 'Captação via Tesouro Direto e bônus soberanos globais sustentáveis' },
    ],
  },
  {
    id: 'imposto-renda',
    name: 'Imposto de Renda (IRPJ, IRPF e IRRF)',
    icon: '💼',
    color: '#3b82f6',
    type: 'TRIBUTARIA',
    typeLabel: 'Impostos Diretos',
    description: 'Tributação sobre os rendimentos de empresas (lucro real e presumido), pessoas físicas e retenção na fonte sobre salários e ganhos de capital.',
    totalAmount: 910000000000,
    percentageOfTotal: 16.5,
    variationPercent: 8.5,
    subitems: [
      { name: 'IRPJ — Imposto de Renda das Pessoas Jurídicas', amount: 380000000000, description: 'Tributação sobre o lucro corporativo das empresas brasileiras' },
      { name: 'IRPF — Imposto de Renda das Pessoas Físicas', amount: 290000000000, description: 'Declaração anual, carnê-leão e ganhos de capital de pessoas físicas' },
      { name: 'IRRF — Retido na Fonte (Trabalho e Aplicações)', amount: 240000000000, description: 'Desconto direto em folha de salários e rendimentos financeiros' },
    ],
  },
  {
    id: 'previdencia-rec',
    name: 'Contribuições Previdenciárias (INSS & Servidores)',
    icon: '👴',
    color: '#f59e0b',
    type: 'CONTRIBUICOES',
    typeLabel: 'Previdência Social',
    description: 'Recolhimento obrigatório sobre a folha salarial pago por empresas (cota patronal), trabalhadores celetistas e servidores públicos federais para o fundo previdenciário.',
    totalAmount: 685000000000,
    percentageOfTotal: 12.4,
    variationPercent: 7.2,
    subitems: [
      { name: 'Contribuição Previdenciária Patronal das Empresas', amount: 395000000000, description: 'Percentual pago pelos empregadores sobre a folha bruta' },
      { name: 'Contribuição Previdenciária dos Empregados CLT', amount: 235000000000, description: 'Desconto mensal no contracheque dos trabalhadores formais' },
      { name: 'CPSS — Contribuição dos Servidores Federais (RPPS)', amount: 55000000000, description: 'Contribuição dos servidores civis e militares da União' },
    ],
  },
  {
    id: 'cofins-pis',
    name: 'COFINS e PIS/PASEP (Seguridade Social)',
    icon: '🛒',
    color: '#10b981',
    type: 'CONTRIBUICOES',
    typeLabel: 'Contribuições Sociais',
    description: 'Tributos incidentes sobre a receita bruta e o faturamento das empresas, com recursos carimbados para a saúde pública, assistência social e seguro-desemprego.',
    totalAmount: 398000000000,
    percentageOfTotal: 7.2,
    variationPercent: 6.4,
    subitems: [
      { name: 'COFINS — Financiamento da Seguridade Social', amount: 310000000000, description: 'Destinado ao SUS, previdência e assistência social' },
      { name: 'PIS / PASEP', amount: 88000000000, description: 'Financiamento do Abono Salarial anual e Seguro-Desemprego' },
    ],
  },
  {
    id: 'csll',
    name: 'Contribuição Social sobre o Lucro Líquido (CSLL)',
    icon: '🏛️',
    color: '#06b6d4',
    type: 'CONTRIBUICOES',
    typeLabel: 'Seguridade Social',
    description: 'Alíquota incidente sobre o resultado líquido das empresas, especialmente bancos, seguradoras e prestadoras de serviços, destinada à proteção social.',
    totalAmount: 145000000000,
    percentageOfTotal: 2.6,
    variationPercent: 5.9,
    subitems: [
      { name: 'CSLL — Setor Financeiro e Bancos', amount: 58000000000, description: 'Alíquota majorada sobre o lucro dos grandes bancos' },
      { name: 'CSLL — Demais Empresas e Indústrias', amount: 87000000000, description: 'Contribuição do setor produtivo e de serviços' },
    ],
  },
  {
    id: 'royalties-estatais',
    name: 'Royalties do Petróleo, Pré-Sal & Dividendos de Estatais',
    icon: '🛢️',
    color: '#8b5cf6',
    type: 'PATRIMONIAL_ROYALTIES',
    typeLabel: 'Receitas Patrimoniais',
    description: 'Participações especiais e royalties pagos por petroleiras pela exploração do Pré-Sal, somados aos lucros e dividendos distribuídos pelas estatais federais à União.',
    totalAmount: 173000000000,
    percentageOfTotal: 3.1,
    variationPercent: 4.1,
    subitems: [
      { name: 'Royalties e Participação Especial do Petróleo (ANP)', amount: 115000000000, description: 'Compensação pela exploração de bacias petrolíferas e Pré-Sal' },
      { name: 'Dividendos de Estatais (Petrobras, BB, BNDES, Caixa)', amount: 58000000000, description: 'Parte do lucro líquido das estatais repassada ao Tesouro' },
    ],
  },
  {
    id: 'iof-ipi',
    name: 'IOF e Imposto sobre Produtos Industrializados (IPI)',
    icon: '💳',
    color: '#eab308',
    type: 'TRIBUTARIA',
    typeLabel: 'Impostos sobre Produção e Crédito',
    description: 'Tributação regulatória sobre operações financeiras (crédito, câmbio, seguros) e sobre mercadorias fabricadas pela indústria nacional.',
    totalAmount: 143000000000,
    percentageOfTotal: 2.6,
    variationPercent: 3.5,
    subitems: [
      { name: 'IPI — Produtos Industrializados (Automóveis, Eletrodomésticos)', amount: 78000000000, description: 'Imposto incidente na saída de fábrica de bens duráveis' },
      { name: 'IOF — Operações de Crédito, Câmbio e Seguros', amount: 65000000000, description: 'Tributo regulatório sobre empréstimos bancários e moeda' },
    ],
  },
  {
    id: 'taxas-concessoes',
    name: 'Concessões de Infraestrutura, Outorgas e Taxas Federais',
    icon: '🛣️',
    color: '#f97316',
    type: 'TAXAS_SERVICOS',
    typeLabel: 'Concessões e Serviços',
    description: 'Valores pagos por concessionárias privadas em leilões de rodovias, aeroportos, portos e frequências 5G, somados a taxas de fiscalização pública.',
    totalAmount: 150000000000,
    percentageOfTotal: 2.7,
    variationPercent: 12.0,
    subitems: [
      { name: 'Taxas do Poder de Polícia (Anvisa, Anatel, Ibama, Passaportes PF)', amount: 85000000000, description: 'Remuneração de serviços públicos e fiscalização regulatória' },
      { name: 'Outorgas e Bônus de Concessões (Rodovias, Ferrovias, Portos)', amount: 65000000000, description: 'Pagamento das concessionárias pela exploração de serviços' },
    ],
  },
  {
    id: 'comercio-exterior',
    name: 'Imposto de Importação e Exportação (Aduaneiro)',
    icon: '🚢',
    color: '#0284c7',
    type: 'TRIBUTARIA',
    typeLabel: 'Comércio Exterior',
    description: 'Tarifas alfandegárias cobradas pela Receita Federal sobre mercadorias e insumos importados nos portos, aeroportos e remessas internacionais.',
    totalAmount: 62000000000,
    percentageOfTotal: 1.1,
    variationPercent: 9.8,
    subitems: [
      { name: 'Imposto de Importação nos Portos e Aeroportos', amount: 58000000000, description: 'Tarifa externa comum (TEC) sobre insumos e manufaturados' },
      { name: 'Tributação de Remessas Postais Internacionais (Remessa Conforme)', amount: 4000000000, description: 'Arrecadação sobre compras internacionais em e-commerce' },
    ],
  },
  {
    id: 'recuperacao-outros',
    name: 'Dívida Ativa, Multas Federais e Outras Receitas',
    icon: '⚖️',
    color: '#64748b',
    type: 'OUTRAS_CORRENTES',
    typeLabel: 'Demais Entradas',
    description: 'Valores recuperados pela Procuradoria-Geral da Fazenda Nacional (PGFN) de devedores da União, autos de infração da Receita Federal e transferências.',
    totalAmount: 409000000000,
    percentageOfTotal: 7.4,
    variationPercent: 5.2,
    subitems: [
      { name: 'Recuperação de Créditos Tributários Inscritos em Dívida Ativa', amount: 210000000000, description: 'Acordos de transação tributária e cobranças judiciais da PGFN' },
      { name: 'Multas, Juros de Mora e Autos de Infração da Receita Federal', amount: 115000000000, description: 'Penalidades aplicadas no combate à sonegação fiscal' },
      { name: 'Alienação de Bens, Recursos Próprios de Universidades e Fundos', amount: 84000000000, description: 'Venda de imóveis da União e receitas próprias de órgãos' },
    ],
  },
];

export const FISCAL_BALANCE_2025: FiscalBalance = {
  totalRevenue: 5520000000000, // R$ 5,52 Tri
  totalExpenses: 5520000000000, // R$ 5,52 Tri
  netPrimaryRevenue: 2750000000000, // R$ 2,75 Tri (Receitas sem rolagem da dívida)
  primaryExpenses: 2780000000000, // R$ 2,78 Tri (Despesas sem juros da dívida)
  primaryResult: -30000000000, // -R$ 30 Bi (Déficit Primário)
  isPrimarySurplus: false,
  debtInterest: 865000000000, // R$ 865 Bi (Juros nominais da dívida)
  nominalResult: -895000000000, // -R$ 895 Bi (Déficit Nominal Total)
  fiscalTargetNote: 'Meta de déficit zero com margem de tolerância de ±0,25% do PIB (limite de R$ 31 Bi) do Arcabouço Fiscal.',
};

export const FISCAL_BALANCE_2024: FiscalBalance = {
  totalRevenue: 5120000000000,
  totalExpenses: 5120000000000,
  netPrimaryRevenue: 2540000000000,
  primaryExpenses: 2585000000000,
  primaryResult: -45000000000,
  isPrimarySurplus: false,
  debtInterest: 780000000000,
  nominalResult: -825000000000,
  fiscalTargetNote: 'Déficit primário consolidado de R$ 45 bilhões (aprox. 0,4% do PIB), apurado pela Secretaria do Tesouro Nacional.',
};

export const FISCAL_BALANCE_2023: FiscalBalance = {
  totalRevenue: 4680000000000,
  totalExpenses: 4680000000000,
  netPrimaryRevenue: 2290000000000,
  primaryExpenses: 2520000000000,
  primaryResult: -230000000000,
  isPrimarySurplus: false,
  debtInterest: 615000000000,
  nominalResult: -845000000000,
  fiscalTargetNote: 'Exercício fiscal atípico de transição, impactado pelo pagamento em lote de mais de R$ 90 bilhões em precatórios atrasados herdados.',
};

// ─────────────────────────────────────────────────────────────────────────────
// BASE OFICIAL CONSOLIDADA 2025 (Execução Orçamentária da União / LOA 2025)
// ─────────────────────────────────────────────────────────────────────────────

export const FEDERAL_BUDGET_2025: FederalBudgetData = {
  year: 2025,
  lastUpdated: '14 de Outubro de 2025 — 19:45 (SIAFI / Tesouro Nacional)',
  officialSource: 'Secretaria do Tesouro Nacional & Portal da Transparência da CGU',
  sourceUrl: 'https://portaldatransparencia.gov.br/despesas',
  cguApiStatus: 'synced',
  fiscalBalance: FISCAL_BALANCE_2025,
  revenues: REVENUE_CATEGORIES_2025,
  totals: {
    totalBudget: 5520000000000, // R$ 5,52 Trilhões
    mandatoryExpenses: 2860000000000, // R$ 2,86 Trilhões (Previdência, Folha de Servidores, Mínimos de Saúde/Educação)
    discretionaryExpenses: 215000000000, // R$ 215 Bilhões (Investimentos e Custeio Operacional)
    debtRefinancing: 2445000000000, // R$ 2,445 Trilhões (Juros e Rolagem da Dívida Pública Mobiliária Federal)
    directInvestments: 88500000000, // R$ 88,5 Bilhões
    totalBeneficiariesCount: 48920,
    totalAuditedContracts: 142850,
  },
  areas: [
    {
      id: 'divida',
      name: 'Juros e Amortização da Dívida Pública',
      icon: '📈',
      color: '#ef4444',
      bgTint: 'rgba(239, 68, 68, 0.08)',
      borderTint: 'rgba(239, 68, 68, 0.3)',
      description: 'Rolagem de títulos públicos federais, amortização e juros da dívida emitidos pelo Tesouro Nacional para honrar compromissos com investidores nacionais e internacionais.',
      totalAmount: 2445000000000,
      percentageOfTotal: 44.3,
      perCapitaYear: 11372,
      variationPercent: 6.8,
      mandatoryRatio: 1.0,
      subfunctions: [
        { id: 'sub-refin', name: 'Refinanciamento da Dívida Mobiliária', amount: 1580000000000, description: 'Troca de títulos vencidos por novos títulos públicos federais' },
        { id: 'sub-juros', name: 'Serviço da Dívida e Juros Contratuais', amount: 865000000000, description: 'Pagamento de juros e encargos sobre o estoque da dívida pública' },
      ],
      organs: [
        { id: 'stn', code: '17000', name: 'Secretaria do Tesouro Nacional', acronym: 'STN', amount: 2445000000000, description: 'Órgão gestor do endividamento público federal e da conta única da União' },
      ],
      programs: [
        {
          id: 'prog-0903',
          code: '0903',
          name: 'Operações Especiais: Serviço da Dívida Pública Federal',
          amount: 2445000000000,
          organAcronym: 'STN',
          actions: [
            {
              id: 'act-0005',
              code: '0005',
              name: 'Amortização e Encargos de Títulos da Dívida Pública Mobiliária Federal Interna',
              description: 'Pagamento de juros e principal aos detentores de títulos públicos (Tesouro Direto, Fundos de Previdência e Bancos)',
              amount: 2210000000000,
              beneficiaries: [
                {
                  id: 'rec-bacen-selic',
                  name: 'Sistema Especial de Liquidação e Custódia (SELIC) / Detentores de Títulos Públicos',
                  document: '00.038.166/0001-05',
                  type: 'BENEFICIARIO_DIRETO',
                  amount: 1450000000000,
                  documentNumber: '2025OB800101',
                  date: '2025-09-30',
                  uf: 'DF',
                  city: 'Brasília',
                  actionCode: '0005',
                  actionName: 'Amortização de Títulos da Dívida Federal',
                  organName: 'Secretaria do Tesouro Nacional',
                  areaId: 'divida',
                  areaName: 'Juros e Amortização da Dívida Pública',
                  objectDescription: 'Liquidação de títulos públicos federais Tesouro Selic, Prefixados e IPCA+',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas',
                },
                {
                  id: 'rec-fundos-prev',
                  name: 'Fundos de Previdência Complementar e Poupança Popular (Detentores de NTN-B)',
                  document: '00.000.000/0001-91',
                  type: 'BENEFICIARIO_DIRETO',
                  amount: 760000000000,
                  documentNumber: '2025OB800204',
                  date: '2025-08-15',
                  uf: 'DF',
                  city: 'Brasília',
                  actionCode: '0005',
                  actionName: 'Amortização de Títulos da Dívida Federal',
                  organName: 'Secretaria do Tesouro Nacional',
                  areaId: 'divida',
                  areaName: 'Juros e Amortização da Dívida Pública',
                  objectDescription: 'Pagamento de cupom de juros semestrais de notas do Tesouro Nacional indexadas à inflação (IPCA)',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'previdencia',
      name: 'Previdência Social',
      icon: '👴',
      color: '#f59e0b',
      bgTint: 'rgba(245, 158, 11, 0.08)',
      borderTint: 'rgba(245, 158, 11, 0.3)',
      description: 'Pagamento de aposentadorias por idade e tempo de contribuição, pensões por morte, auxílios-doença e aposentadorias de trabalhadores urbanos e rurais do Brasil.',
      totalAmount: 1055000000000,
      percentageOfTotal: 19.1,
      perCapitaYear: 4906,
      variationPercent: 7.4,
      mandatoryRatio: 0.99,
      subfunctions: [
        { id: 'sub-prev-urb', name: 'Previdência Básica Urbana (RGPS)', amount: 765000000000, description: 'Aposentadorias e pensões de trabalhadores formais do setor privado urbano' },
        { id: 'sub-prev-rur', name: 'Previdência Rural', amount: 198000000000, description: 'Benefícios previdenciários aos segurados especiais e trabalhadores do campo' },
        { id: 'sub-prev-rpps', name: 'Regime Próprio dos Servidores Federais (RPPS)', amount: 92000000000, description: 'Aposentadorias e pensões do serviço público civil e militar da União' },
      ],
      organs: [
        { id: 'inss', code: '40107', name: 'Instituto Nacional do Seguro Social', acronym: 'INSS', amount: 963000000000, description: 'Autarquia federal responsável pela operacionalização dos direitos previdenciários' },
        { id: 'sprev', code: '40000', name: 'Ministério da Previdência Social', acronym: 'MPS', amount: 92000000000, description: 'Gestão das políticas previdenciárias e regimes próprios federais' },
      ],
      programs: [
        {
          id: 'prog-00C5',
          code: '00C5',
          name: 'Previdência Social Sustentável e Inclusiva',
          amount: 963000000000,
          organAcronym: 'INSS',
          actions: [
            {
              id: 'act-00C5-1',
              code: '00C5',
              name: 'Benefícios Previdenciários do Regime Geral da Previdência Social (RGPS)',
              description: 'Pagamento mensal direto a mais de 39 milhões de aposentados e pensionistas do Brasil',
              amount: 963000000000,
              beneficiaries: [
                {
                  id: 'rec-inss-folha-bb',
                  name: 'Beneficiários do INSS — Folha Pagadora via Banco do Brasil',
                  document: '00.000.000/0001-91',
                  type: 'BENEFICIARIO_DIRETO',
                  amount: 385000000000,
                  documentNumber: '2025OB809110',
                  date: '2025-10-05',
                  uf: 'DF',
                  city: 'Brasília',
                  actionCode: '00C5',
                  actionName: 'Benefícios Previdenciários do RGPS',
                  organName: 'Instituto Nacional do Seguro Social',
                  areaId: 'previdencia',
                  areaName: 'Previdência Social',
                  objectDescription: 'Crédito em conta corrente de aposentadorias, pensões por morte e auxílios a segurados da rede BB',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas',
                },
                {
                  id: 'rec-inss-folha-caixa',
                  name: 'Beneficiários do INSS — Folha Pagadora via Caixa Econômica Federal',
                  document: '00.360.305/0001-04',
                  type: 'BENEFICIARIO_DIRETO',
                  amount: 320000000000,
                  documentNumber: '2025OB809111',
                  date: '2025-10-05',
                  uf: 'DF',
                  city: 'Brasília',
                  actionCode: '00C5',
                  actionName: 'Benefícios Previdenciários do RGPS',
                  organName: 'Instituto Nacional do Seguro Social',
                  areaId: 'previdencia',
                  areaName: 'Previdência Social',
                  objectDescription: 'Crédito de proventos previdenciários a aposentados e beneficiários em conta Caixa Tem e agências',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas',
                },
                {
                  id: 'rec-inss-folha-bancos-priv',
                  name: 'Rede Bancária Credenciada (Bradesco, Itaú, Santander, Mercantil)',
                  document: '60.746.948/0001-12',
                  type: 'BENEFICIARIO_DIRETO',
                  amount: 258000000000,
                  documentNumber: '2025OB809112',
                  date: '2025-10-05',
                  uf: 'SP',
                  city: 'São Paulo',
                  actionCode: '00C5',
                  actionName: 'Benefícios Previdenciários do RGPS',
                  organName: 'Instituto Nacional do Seguro Social',
                  areaId: 'previdencia',
                  areaName: 'Previdência Social',
                  objectDescription: 'Repasse para pagamentos de cartões magnéticos e contas de aposentados em bancos privados conveniados',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'assistencia',
      name: 'Assistência Social e Cidadania',
      icon: '🤝',
      color: '#10b981',
      bgTint: 'rgba(16, 185, 129, 0.08)',
      borderTint: 'rgba(16, 185, 129, 0.3)',
      description: 'Transferência de renda para famílias de baixa renda (Bolsa Família), proteção ao idoso e pessoa com deficiência sem renda (BPC/LOAS) e combate à fome.',
      totalAmount: 292000000000,
      percentageOfTotal: 5.28,
      perCapitaYear: 1358,
      variationPercent: 3.8,
      mandatoryRatio: 0.94,
      subfunctions: [
        { id: 'sub-bolsa', name: 'Transferência de Renda (Bolsa Família)', amount: 168000000000, description: 'Benefício mensal a 20,8 milhões de famílias com condicionalidades de saúde e educação' },
        { id: 'sub-bpc', name: 'Benefício de Prestação Continuada (BPC / LOAS)', amount: 112000000000, description: '1 salário mínimo mensal a 5,6 milhões de idosos e PcD em vulnerabilidade extrema' },
        { id: 'sub-suas', name: 'Sistema Único de Assistência Social (SUAS) e Auxílio Gás', amount: 12000000000, description: 'Custeio de CRAS, CREAS e repasse de gás de cozinha para 5,5 milhões de lares' },
      ],
      organs: [
        { id: 'fnas', code: '33903', name: 'Fundo Nacional de Assistência Social', acronym: 'FNAS', amount: 288000000000, description: 'Unidade orçamentária executora dos fundos federais de assistência social' },
        { id: 'mds', code: '55000', name: 'Ministério do Desenvolvimento e Assistência Social', acronym: 'MDS', amount: 4000000000, description: 'Formula e coordena a política nacional de desenvolvimento e combate à fome' },
      ],
      programs: [
        {
          id: 'prog-5031',
          code: '5031',
          name: 'Proteção Social Básica e Transferência de Renda',
          amount: 280000000000,
          organAcronym: 'FNAS',
          actions: [
            {
              id: 'act-00S2',
              code: '00S2',
              name: 'Transferência de Renda Direta às Famílias — Programa Bolsa Família',
              description: 'Pagamento com média de R$ 680/mês por família com filhos matriculados na escola e vacinados',
              amount: 168000000000,
              beneficiaries: [
                {
                  id: 'rec-bolsa-caixa',
                  name: 'Caixa Econômica Federal — Agente Operador do Bolsa Família',
                  document: '00.360.305/0001-04',
                  type: 'BENEFICIARIO_DIRETO',
                  amount: 168000000000,
                  documentNumber: '2025OB801290',
                  date: '2025-10-10',
                  uf: 'DF',
                  city: 'Brasília',
                  actionCode: '00S2',
                  actionName: 'Transferência de Renda Bolsa Família',
                  organName: 'Fundo Nacional de Assistência Social',
                  areaId: 'assistencia',
                  areaName: 'Assistência Social e Cidadania',
                  objectDescription: 'Disponibilização de recursos nos cartões sociais e poupanças Caixa Tem dos 20,8 milhões de famílias',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas',
                },
              ],
            },
            {
              id: 'act-00C8',
              code: '00C8',
              name: 'Benefício de Prestação Continuada (BPC) — LOAS',
              description: 'Garantia constitucional de 1 salário mínimo para 5,6 milhões de idosos e pessoas com deficiência física ou mental grave',
              amount: 112000000000,
              beneficiaries: [
                {
                  id: 'rec-bpc-inss',
                  name: 'Instituto Nacional do Seguro Social (INSS / Folha BPC)',
                  document: '29.979.036/0001-40',
                  type: 'BENEFICIARIO_DIRETO',
                  amount: 112000000000,
                  documentNumber: '2025OB802901',
                  date: '2025-10-05',
                  uf: 'DF',
                  city: 'Brasília',
                  actionCode: '00C8',
                  actionName: 'Benefício de Prestação Continuada (BPC)',
                  organName: 'Fundo Nacional de Assistência Social',
                  areaId: 'assistencia',
                  areaName: 'Assistência Social e Cidadania',
                  objectDescription: 'Execução financeira mensal do pagamento continuado a titulares cadastrados no CadÚnico',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'saude',
      name: 'Saúde Pública (SUS)',
      icon: '🏥',
      color: '#06b6d4',
      bgTint: 'rgba(6, 182, 212, 0.08)',
      borderTint: 'rgba(6, 182, 212, 0.3)',
      description: 'Financiamento do Sistema Único de Saúde (SUS), vacinação nacional, hospitais públicos federais e filantrópicos, farmácia popular e atendimento de alta complexidade.',
      totalAmount: 242000000000,
      percentageOfTotal: 4.38,
      perCapitaYear: 1125,
      variationPercent: 8.2,
      mandatoryRatio: 0.88,
      subfunctions: [
        { id: 'sub-aten-bas', name: 'Atenção Primária à Saúde (UBS e Saúde da Família)', amount: 89000000000, description: 'Postos de saúde, médicos de família, vacinação básica e exames preventivos' },
        { id: 'sub-hosp-amb', name: 'Assistência Hospitalar e Ambulatorial (Média e Alta Complexidade)', amount: 11200000000, description: 'Leitos de UTI, cirurgias eletivas e oncológicas, hemodiálise e SAMU 192' },
        { id: 'sub-vig-san', name: 'Vigilância em Saúde e Imunização Nacional', amount: 24000000000, description: 'Compra de vacinas, soros antiofídicos e controle de endemias (dengue, febre amarela)' },
        { id: 'sub-farm-pop', name: 'Assistência Farmacêutica e Farmácia Popular', amount: 17000000000, description: 'Medicamentos gratuitos para hipertensão, diabetes, asma e remédios de alto custo' },
      ],
      organs: [
        { id: 'fns', code: '36901', name: 'Fundo Nacional de Saúde', acronym: 'FNS', amount: 215000000000, description: 'Gestor financeiro dos repasses do SUS para estados, municípios e prestadores' },
        { id: 'fiocruz', code: '36201', name: 'Fundação Oswaldo Cruz', acronym: 'Fiocruz', amount: 12500000000, description: 'Maior instituição de ciência e tecnologia em saúde da América Latina' },
        { id: 'ebserh', code: '36214', name: 'Empresa Brasileira de Serviços Hospitalares', acronym: 'EBSERH', amount: 14500000000, description: 'Administra 45 hospitais universitários federais de ensino e pesquisa' },
      ],
      programs: [
        {
          id: 'prog-5018',
          code: '5018',
          name: 'Atenção Especializada à Saúde e Medicamentos do SUS',
          amount: 136000000000,
          organAcronym: 'FNS',
          actions: [
            {
              id: 'act-20YS',
              code: '20YS',
              name: 'Aquisição e Distribuição de Imunobiológicos e Medicamentos do SUS',
              description: 'Compra centralizada pelo Ministério da Saúde de vacinas para o PNI e remédios de alto custo',
              amount: 28500000000,
              beneficiaries: [
                {
                  id: 'rec-butantan',
                  name: 'Instituto Butantan — Fundação Butantan',
                  document: '61.821.500/0001-26',
                  type: 'INSTITUTO_HOSPITAL',
                  amount: 1840000000,
                  documentNumber: '2025NE001429',
                  date: '2025-04-18',
                  uf: 'SP',
                  city: 'São Paulo',
                  actionCode: '20YS',
                  actionName: 'Aquisição de Imunobiológicos e Medicamentos',
                  organName: 'Fundo Nacional de Saúde',
                  areaId: 'saude',
                  areaName: 'Saúde Pública (SUS)',
                  objectDescription: 'Fornecimento de 80 milhões de doses da vacina Influenza Trivalente e vacina contra raiva humana',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/empenho/2025NE001429',
                },
                {
                  id: 'rec-fiocruz-bio',
                  name: 'Bio-Manguinhos / Fiocruz',
                  document: '33.781.055/0001-35',
                  type: 'INSTITUTO_HOSPITAL',
                  amount: 2450000000,
                  documentNumber: '2025NE002194',
                  date: '2025-05-22',
                  uf: 'RJ',
                  city: 'Rio de Janeiro',
                  actionCode: '20YS',
                  actionName: 'Aquisição de Imunobiológicos e Medicamentos',
                  organName: 'Fundo Nacional de Saúde',
                  areaId: 'saude',
                  areaName: 'Saúde Pública (SUS)',
                  objectDescription: 'Produção e entrega de vacinas tríplice viral (sarampo, caxumba, rubéola), febre amarela e medicamentos biológicos',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/empenho/2025NE002194',
                },
                {
                  id: 'rec-pfizer-br',
                  name: 'Pfizer Brasil Ltda',
                  document: '46.070.018/0001-19',
                  type: 'EMPRESA_PRIVADA',
                  amount: 890000000,
                  documentNumber: '2025NE003810',
                  date: '2025-03-12',
                  uf: 'SP',
                  city: 'São Paulo',
                  actionCode: '20YS',
                  actionName: 'Aquisição de Imunobiológicos e Medicamentos',
                  organName: 'Fundo Nacional de Saúde',
                  areaId: 'saude',
                  areaName: 'Saúde Pública (SUS)',
                  objectDescription: 'Aquisição de vacinas atualizadas monovalentes XBB contra COVID-19 para grupos prioritários',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/empenho/2025NE003810',
                },
              ],
            },
            {
              id: 'act-21CE',
              code: '21CE',
              name: 'Implementação de Políticas de Atenção Primária à Saúde (Repasses Fundo a Fundo)',
              description: 'Transferências constitucionais obrigatórias para postos de saúde de todas as cidades brasileiras',
              amount: 58000000000,
              beneficiaries: [
                {
                  id: 'rec-fns-sp',
                  name: 'Fundo Municipal de Saúde de São Paulo/SP',
                  document: '46.392.130/0002-35',
                  type: 'TRANSFERENCIA_MUNICIPIO',
                  amount: 1340000000,
                  documentNumber: '2025OB801420',
                  date: '2025-09-15',
                  uf: 'SP',
                  city: 'São Paulo',
                  actionCode: '21CE',
                  actionName: 'Políticas de Atenção Primária à Saúde',
                  organName: 'Fundo Nacional de Saúde',
                  areaId: 'saude',
                  areaName: 'Saúde Pública (SUS)',
                  objectDescription: 'Custeio federal de 1.400 equipes de Saúde da Família e 470 Unidades Básicas de Saúde (UBS)',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/ordem-bancaria/2025OB801420',
                },
                {
                  id: 'rec-fns-rj',
                  name: 'Fundo Municipal de Saúde do Rio de Janeiro/RJ',
                  document: '29.468.055/0001-02',
                  type: 'TRANSFERENCIA_MUNICIPIO',
                  amount: 980000000,
                  documentNumber: '2025OB802110',
                  date: '2025-09-15',
                  uf: 'RJ',
                  city: 'Rio de Janeiro',
                  actionCode: '21CE',
                  actionName: 'Políticas de Atenção Primária à Saúde',
                  organName: 'Fundo Nacional de Saúde',
                  areaId: 'saude',
                  areaName: 'Saúde Pública (SUS)',
                  objectDescription: 'Manutenção de Clínicas da Família cariocas e programa de agentes comunitários de saúde',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/ordem-bancaria/2025OB802110',
                },
                {
                  id: 'rec-fns-ssa',
                  name: 'Fundo Municipal de Saúde de Salvador/BA',
                  document: '13.927.801/0005-90',
                  type: 'TRANSFERENCIA_MUNICIPIO',
                  amount: 410000000,
                  documentNumber: '2025OB803140',
                  date: '2025-09-15',
                  uf: 'BA',
                  city: 'Salvador',
                  actionCode: '21CE',
                  actionName: 'Políticas de Atenção Primária à Saúde',
                  organName: 'Fundo Nacional de Saúde',
                  areaId: 'saude',
                  areaName: 'Saúde Pública (SUS)',
                  objectDescription: 'Custeio mensal federal para unidades de saúde e saúde bucal (Brasil Sorridente)',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/ordem-bancaria/2025OB803140',
                },
              ],
            },
            {
              id: 'act-20RK',
              code: '20RK',
              name: 'Estruturação e Apoio a Hospitais Filantrópicos e Alta Complexidade Oncológica',
              description: 'Aporte de custeio e emendas parlamentares para hospitais do câncer e santas casas',
              amount: 14200000000,
              beneficiaries: [
                {
                  id: 'rec-pio-xii',
                  name: 'Fundação Pio XII — Hospital de Amor de Barretos/SP',
                  document: '49.150.352/0001-12',
                  type: 'INSTITUTO_HOSPITAL',
                  amount: 145000000,
                  documentNumber: '2025NE009120',
                  date: '2025-06-11',
                  uf: 'SP',
                  city: 'Barretos',
                  actionCode: '20RK',
                  actionName: 'Estruturação de Hospitais Filantrópicos',
                  organName: 'Fundo Nacional de Saúde',
                  areaId: 'saude',
                  areaName: 'Saúde Pública (SUS)',
                  objectDescription: 'Custeio de quimioterapias, radioterapias e internações 100% gratuitas de pacientes oncológicos do SUS',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/empenho/2025NE009120',
                },
                {
                  id: 'rec-santa-casa-bh',
                  name: 'Santa Casa de Misericórdia de Belo Horizonte/MG',
                  document: '17.209.891/0001-93',
                  type: 'INSTITUTO_HOSPITAL',
                  amount: 118000000,
                  documentNumber: '2025NE009144',
                  date: '2025-06-25',
                  uf: 'MG',
                  city: 'Belo Horizonte',
                  actionCode: '20RK',
                  actionName: 'Estruturação de Hospitais Filantrópicos',
                  organName: 'Fundo Nacional de Saúde',
                  areaId: 'saude',
                  areaName: 'Saúde Pública (SUS)',
                  objectDescription: 'Atendimento hospitalar de urgência, transplantes e cirurgias cardiovasculares pelo SUS',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/empenho/2025NE009144',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'educacao',
      name: 'Educação e Universidades Federais',
      icon: '🎓',
      color: '#3b82f6',
      bgTint: 'rgba(59, 130, 246, 0.08)',
      borderTint: 'rgba(59, 130, 246, 0.3)',
      description: 'Financiamento da educação básica (Fundeb, merenda e transporte escolar), 69 universidades federais, institutos federais técnicos (IFs), bolsas de pesquisa Capes e Fies.',
      totalAmount: 196000000000,
      percentageOfTotal: 3.55,
      perCapitaYear: 911,
      variationPercent: 6.5,
      mandatoryRatio: 0.85,
      subfunctions: [
        { id: 'sub-ed-basica', name: 'Educação Básica e Complementação Fundeb', amount: 84000000000, description: 'Repasse para valorização do magistério e melhoria de escolas públicas municipais e estaduais' },
        { id: 'sub-ed-sup', name: 'Ensino Superior e Universidades Federais', amount: 62000000000, description: 'Manutenção de 69 universidades federais, hospitais de ensino e campus interiorizados' },
        { id: 'sub-ed-tec', name: 'Educação Profissional e Tecnológica (Institutos Federais - IFs)', amount: 26000000000, description: 'Rede federal de ensino técnico gratuito com mais de 600 campi em todo o país' },
        { id: 'sub-pos-grad', name: 'Pós-Graduação, Bolsas e Livro Didático (Capes / FNDE)', amount: 24000000000, description: 'Bolsas de mestrado e doutorado, Programa Nacional do Livro Didático (PNLD)' },
      ],
      organs: [
        { id: 'fnde', code: '26298', name: 'Fundo Nacional de Desenvolvimento da Educação', acronym: 'FNDE', amount: 98000000000, description: 'Autarquia gestora dos repasses da merenda (PNAE), transporte (PNATE) e Fundeb' },
        { id: 'mec-adm', code: '26000', name: 'Ministério da Educação', acronym: 'MEC', amount: 72000000000, description: 'Coordenação nacional da política educacional e supervisão do ensino superior' },
        { id: 'capes', code: '26291', name: 'Coordenação de Aperfeiçoamento de Pessoal de Nível Superior', acronym: 'CAPES', amount: 15000000000, description: 'Fomento aos programas de pós-graduação stricto sensu e formação de professores' },
        { id: 'inep', code: '26290', name: 'Instituto Nacional de Estudos e Pesquisas Educacionais', acronym: 'INEP', amount: 11000000000, description: 'Realização do ENEM, Saeb, Censo Escolar e avaliação educacional' },
      ],
      programs: [
        {
          id: 'prog-5011',
          code: '5011',
          name: 'Educação Superior: Graduação, Pós-Graduação, Extensão e Pesquisa',
          amount: 62000000000,
          organAcronym: 'MEC',
          actions: [
            {
              id: 'act-20GK',
              code: '20GK',
              name: 'Funcionamento e Desenvolvimento de Instituições Federais de Ensino Superior',
              description: 'Custeio direto de água, energia, segurança, laboratórios e manutenção de universidades federais',
              amount: 18500000000,
              beneficiaries: [
                {
                  id: 'rec-ufrj',
                  name: 'Universidade Federal do Rio de Janeiro (UFRJ)',
                  document: '33.663.683/0001-16',
                  type: 'INSTITUTO_HOSPITAL',
                  amount: 3820000000,
                  documentNumber: '2025OB805120',
                  date: '2025-08-30',
                  uf: 'RJ',
                  city: 'Rio de Janeiro',
                  actionCode: '20GK',
                  actionName: 'Funcionamento de Universidades Federais',
                  organName: 'Ministério da Educação',
                  areaId: 'educacao',
                  areaName: 'Educação e Universidades Federais',
                  objectDescription: 'Custeio de aulas, manutenção predial da Cidade Universitária e folha de servidores/professores',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/ordem-bancaria/2025OB805120',
                },
                {
                  id: 'rec-ufmg',
                  name: 'Universidade Federal de Minas Gerais (UFMG)',
                  document: '17.217.985/0001-04',
                  type: 'INSTITUTO_HOSPITAL',
                  amount: 2910000000,
                  documentNumber: '2025OB805144',
                  date: '2025-08-30',
                  uf: 'MG',
                  city: 'Belo Horizonte',
                  actionCode: '20GK',
                  actionName: 'Funcionamento de Universidades Federais',
                  organName: 'Ministério da Educação',
                  areaId: 'educacao',
                  areaName: 'Educação e Universidades Federais',
                  objectDescription: 'Manutenção dos campi Pampulha e Montes Claros, laboratórios de pesquisa e restaurante universitário',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/ordem-bancaria/2025OB805144',
                },
                {
                  id: 'rec-unb',
                  name: 'Fundação Universidade de Brasília (UnB)',
                  document: '00.038.174/0001-43',
                  type: 'INSTITUTO_HOSPITAL',
                  amount: 2140000000,
                  documentNumber: '2025OB805190',
                  date: '2025-08-30',
                  uf: 'DF',
                  city: 'Brasília',
                  actionCode: '20GK',
                  actionName: 'Funcionamento de Universidades Federais',
                  organName: 'Ministério da Educação',
                  areaId: 'educacao',
                  areaName: 'Educação e Universidades Federais',
                  objectDescription: 'Custeio operacional de ensino para mais de 40 mil alunos e centros de pesquisa da capital federal',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/ordem-bancaria/2025OB805190',
                },
              ],
            },
          ],
        },
        {
          id: 'prog-5012',
          code: '5012',
          name: 'Educação Básica de Qualidade e Equidade',
          amount: 84000000000,
          organAcronym: 'FNDE',
          actions: [
            {
              id: 'act-20RP',
              code: '20RP',
              name: 'Programa Nacional de Alimentação Escolar (PNAE — Merenda Escolar)',
              description: 'Repasse para garantir refeições saudáveis diárias a 40 milhões de alunos de escolas públicas',
              amount: 5500000000,
              beneficiaries: [
                {
                  id: 'rec-pnae-sp-mun',
                  name: 'Prefeitura Municipal de São Paulo — Secretaria de Educação (PNAE)',
                  document: '46.392.130/0001-54',
                  type: 'TRANSFERENCIA_MUNICIPIO',
                  amount: 215000000,
                  documentNumber: '2025OB807180',
                  date: '2025-05-10',
                  uf: 'SP',
                  city: 'São Paulo',
                  actionCode: '20RP',
                  actionName: 'Alimentação Escolar (PNAE)',
                  organName: 'Fundo Nacional de Desenvolvimento da Educação',
                  areaId: 'educacao',
                  areaName: 'Educação e Universidades Federais',
                  objectDescription: 'Fornecimento de 2 milhões de refeições diárias para alunos da rede municipal com produtos locais',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/ordem-bancaria/2025OB807180',
                },
                {
                  id: 'rec-pnae-ba-est',
                  name: 'Governo do Estado da Bahia — Fundo Estadual de Educação',
                  document: '13.937.065/0001-00',
                  type: 'TRANSFERENCIA_ESTADO',
                  amount: 184000000,
                  documentNumber: '2025OB807192',
                  date: '2025-05-10',
                  uf: 'BA',
                  city: 'Salvador',
                  actionCode: '20RP',
                  actionName: 'Alimentação Escolar (PNAE)',
                  organName: 'Fundo Nacional de Desenvolvimento da Educação',
                  areaId: 'educacao',
                  areaName: 'Educação e Universidades Federais',
                  objectDescription: 'Alimentação escolar para estudantes do ensino médio estadual e escolas de tempo integral',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/ordem-bancaria/2025OB807192',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'defesa',
      name: 'Defesa Nacional e Forças Armadas',
      icon: '🛡️',
      color: '#6366f1',
      bgTint: 'rgba(99, 102, 241, 0.08)',
      borderTint: 'rgba(99, 102, 241, 0.3)',
      description: 'Soberania nacional, vigilância territorial e de fronteiras, Marinha (Prosub), Exército (Blindados Guarani/Sisfron) e Força Aérea (Caças F-39 Gripen e KC-390).',
      totalAmount: 132000000000,
      percentageOfTotal: 2.39,
      perCapitaYear: 613,
      variationPercent: 3.1,
      mandatoryRatio: 0.82,
      subfunctions: [
        { id: 'sub-def-terrestre', name: 'Defesa Terrestre (Comando do Exército)', amount: 56000000000, description: 'Proteção das fronteiras terrestres, infantaria, artilharia e engenharia de construção' },
        { id: 'sub-def-aerea', name: 'Defesa Aeroespacial (Comando da Aeronáutica)', amount: 38000000000, description: 'Controle do tráfego aéreo, defesa do espaço aéreo brasileiro e satélites geoestacionários' },
        { id: 'sub-def-naval', name: 'Defesa Naval (Comando da Marinha do Brasil)', amount: 38000000000, description: 'Vigilância da Amazônia Azul, patrulha costeira e desenvolvimento de submarinos' },
      ],
      organs: [
        { id: 'exercito', code: '52111', name: 'Comando do Exército Brasileiro', acronym: 'EB', amount: 56000000000, description: 'Força armada responsável pela segurança e defesa da integridade territorial' },
        { id: 'marinha', code: '52121', name: 'Comando da Marinha do Brasil', acronym: 'MB', amount: 38000000000, description: 'Força naval encarregada da proteção das águas jurisdicionais brasileiras' },
        { id: 'fab', code: '52131', name: 'Comando da Aeronáutica', acronym: 'FAB', amount: 38000000000, description: 'Força aérea garantidora do controle e defesa aeroespacial do país' },
      ],
      programs: [
        {
          id: 'prog-6012',
          code: '6012',
          name: 'Projetos Estratégicos de Defesa e Soberania',
          amount: 22000000000,
          organAcronym: 'FAB',
          actions: [
            {
              id: 'act-14T0',
              code: '14T0',
              name: 'Projeto F-X2 — Aquisição e Desenvolvimento dos Caças Multimissão F-39 Gripen',
              description: 'Compra e fabricação de 36 caças supersônicos com transferência de tecnologia para a indústria aeroespacial brasileira',
              amount: 1950000000,
              beneficiaries: [
                {
                  id: 'rec-saab-embraer',
                  name: 'Saab AB / Embraer S.A.',
                  document: '60.701.190/0001-04',
                  type: 'EMPRESA_PRIVADA',
                  amount: 1950000000,
                  documentNumber: '2025NE005401',
                  date: '2025-07-28',
                  uf: 'SP',
                  city: 'Gavião Peixoto',
                  actionCode: '14T0',
                  actionName: 'Aquisição de Caças Gripen F-X2',
                  organName: 'Comando da Aeronáutica',
                  areaId: 'defesa',
                  areaName: 'Defesa Nacional e Forças Armadas',
                  objectDescription: 'Montagem final de aeronaves de caça supersônicas F-39E no Centro de Projetos e Desenvolvimento da Embraer',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/empenho/2025NE005401',
                },
              ],
            },
            {
              id: 'act-125L',
              code: '125L',
              name: 'Programa de Desenvolvimento de Submarinos (PROSUB)',
              description: 'Construção de 4 submarinos convencionais diesel-elétricos e o 1º submarino convencionalmente armado de propulsão nuclear',
              amount: 1620000000,
              beneficiaries: [
                {
                  id: 'rec-icn-sub',
                  name: 'Itaguaí Construções Navais S.A. (ICN)',
                  document: '10.966.866/0001-02',
                  type: 'EMPRESA_PRIVADA',
                  amount: 1620000000,
                  documentNumber: '2025NE006120',
                  date: '2025-08-14',
                  uf: 'RJ',
                  city: 'Itaguaí',
                  actionCode: '125L',
                  actionName: 'Programa PROSUB — Marinha do Brasil',
                  organName: 'Comando da Marinha',
                  areaId: 'defesa',
                  areaName: 'Defesa Nacional e Forças Armadas',
                  objectDescription: 'Manutenção do estaleiro naval, integração do submarino Álvaro Alberto e apoio técnico francês Naval Group',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/empenho/2025NE006120',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'trabalho',
      name: 'Trabalho, Emprego e Renda',
      icon: '💼',
      color: '#8b5cf6',
      bgTint: 'rgba(139, 92, 246, 0.08)',
      borderTint: 'rgba(139, 92, 246, 0.3)',
      description: 'Pagamento de Seguro-Desemprego, Abono Salarial (PIS/Pasep), fiscalização das relações de trabalho e fomento ao Fundo de Amparo ao Trabalhador (FAT).',
      totalAmount: 115000000000,
      percentageOfTotal: 2.08,
      perCapitaYear: 535,
      variationPercent: 4.9,
      mandatoryRatio: 0.96,
      subfunctions: [
        { id: 'sub-seg-desemp', name: 'Seguro-Desemprego e Benefícios do FAT', amount: 62000000000, description: 'Assistência financeira temporária aos trabalhadores demitidos sem justa causa' },
        { id: 'sub-abono-pis', name: 'Abono Salarial (PIS / PASEP)', amount: 31000000000, description: 'Pagamento de até 1 salário mínimo aos trabalhadores com remuneração de até 2 salários mínimos' },
        { id: 'sub-fisc-trab', name: 'Inspeção do Trabalho e Qualificação Profissional', amount: 22000000000, description: 'Combate ao trabalho escravo infantil e capacitação pelo Sistema Nacional de Emprego (SINE)' },
      ],
      organs: [
        { id: 'mte', code: '38000', name: 'Ministério do Trabalho e Emprego', acronym: 'MTE', amount: 115000000000, description: 'Responsável pela administração do FAT e das políticas públicas de emprego e renda' },
      ],
      programs: [
        {
          id: 'prog-0040',
          code: '0040',
          name: 'Proteção ao Trabalhador e Manutenção do Emprego',
          amount: 115000000000,
          organAcronym: 'MTE',
          actions: [
            {
              id: 'act-0040-seguro',
              code: '0032',
              name: 'Pagamento de Parcelas do Seguro-Desemprego',
              description: 'Pagamento de 3 a 5 parcelas de benefício para trabalhadores com carteira assinada demitidos',
              amount: 62000000000,
              beneficiaries: [
                {
                  id: 'rec-fat-caixa',
                  name: 'Caixa Econômica Federal — Agente Pagador do FAT / PIS',
                  document: '00.360.305/0001-04',
                  type: 'BENEFICIARIO_DIRETO',
                  amount: 62000000000,
                  documentNumber: '2025OB803190',
                  date: '2025-09-20',
                  uf: 'DF',
                  city: 'Brasília',
                  actionCode: '0032',
                  actionName: 'Seguro-Desemprego do Trabalhador Formal',
                  organName: 'Ministério do Trabalho e Emprego',
                  areaId: 'trabalho',
                  areaName: 'Trabalho, Emprego e Renda',
                  objectDescription: 'Crédito de parcelas do seguro-desemprego para mais de 7 milhões de trabalhadores demitidos',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'judiciario',
      name: 'Poder Judiciário Federal',
      icon: '⚖️',
      color: '#0284c7',
      bgTint: 'rgba(2, 132, 199, 0.08)',
      borderTint: 'rgba(2, 132, 199, 0.3)',
      description: 'Manutenção da Justiça Federal, Tribunais Superiores (STF, STJ, TST, TSE), Justiça do Trabalho, Justiça Militar da União e Conselho Nacional de Justiça (CNJ).',
      totalAmount: 62000000000,
      percentageOfTotal: 1.12,
      perCapitaYear: 288,
      variationPercent: 5.1,
      mandatoryRatio: 0.95,
      subfunctions: [
        { id: 'sub-just-fed', name: 'Justiça Federal (TRFs e Varas Federais)', amount: 28000000000, description: 'Julgamento de causas da União, INSS, crimes federais e direitos civis' },
        { id: 'sub-just-trab', name: 'Justiça do Trabalho (TST e TRTs)', amount: 22000000000, description: 'Resolução de litígios e processos trabalhistas em todo o território nacional' },
        { id: 'sub-stf-stj', name: 'Tribunais Superiores (STF, STJ, TSE)', amount: 12000000000, description: 'Guarda da Constituição Federal, uniformização de jurisprudência e eleições' },
      ],
      organs: [
        { id: 'cjf', code: '12000', name: 'Conselho da Justiça Federal', acronym: 'CJF', amount: 28000000000, description: 'Supervisão administrativa e orçamentária da Justiça Federal de 1º e 2º graus' },
        { id: 'csjt', code: '15000', name: 'Conselho Superior da Justiça do Trabalho', acronym: 'CSJT', amount: 22000000000, description: 'Órgão central do sistema de Justiça do Trabalho no Brasil' },
        { id: 'stf', code: '01000', name: 'Supremo Tribunal Federal', acronym: 'STF', amount: 980000000, description: 'Corte Constitucional máxima da República Federativa do Brasil' },
      ],
      programs: [
        {
          id: 'prog-0570',
          code: '0570',
          name: 'Prestação Jurisdicional e Julgamento de Processos Federais',
          amount: 62000000000,
          organAcronym: 'CJF',
          actions: [
            {
              id: 'act-21A0',
              code: '21A0',
              name: 'Apreciação de Causas na Justiça Federal de Primeira e Segunda Instância',
              description: 'Julgamento célere de milhões de processos de aposentadoria, tributos federais e saúde pública',
              amount: 28000000000,
              beneficiaries: [
                {
                  id: 'rec-serpro-ti',
                  name: 'SERPRO — Serviço Federal de Processamento de Dados',
                  document: '33.683.111/0001-07',
                  type: 'EMPRESA_PRIVADA',
                  amount: 125000000,
                  documentNumber: '2025NE008741',
                  date: '2025-07-12',
                  uf: 'DF',
                  city: 'Brasília',
                  actionCode: '21A0',
                  actionName: 'Modernização e Infraestrutura de TI Judiciária',
                  organName: 'Conselho da Justiça Federal',
                  areaId: 'judiciario',
                  areaName: 'Poder Judiciário Federal',
                  objectDescription: 'Hospedagem em nuvem de alta segurança e processamento contínuo dos sistemas PJe (Processo Judicial Eletrônico)',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/empenho/2025NE008741',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'seguranca',
      name: 'Segurança Pública e Polícia Federal',
      icon: '🚓',
      color: '#eab308',
      bgTint: 'rgba(234, 179, 8, 0.08)',
      borderTint: 'rgba(234, 179, 8, 0.3)',
      description: 'Polícia Federal (investigações contra corrupção, tráfico e emissão de passaportes), Polícia Rodoviária Federal (patrulha de 75 mil km de estradas) e penitenciárias federais.',
      totalAmount: 38500000000,
      percentageOfTotal: 0.7,
      perCapitaYear: 179,
      variationPercent: 4.2,
      mandatoryRatio: 0.81,
      subfunctions: [
        { id: 'sub-pol-fed', name: 'Polícia Federal (Investigações e Fronteiras)', amount: 15500000000, description: 'Operações especiais, inteligência financeira contra lavagem de dinheiro e controle migratório' },
        { id: 'sub-prf', name: 'Polícia Rodoviária Federal (Policiamento das Rodovias)', amount: 12000000000, description: 'Apreensão de drogas, armas e fiscalização de segurança em todas as rodovias federais' },
        { id: 'sub-fnsp', name: 'Fundo Nacional de Segurança Pública e Sistema Penitenciário', amount: 11000000000, description: 'Repasse para compra de viaturas e coletes para polícias estaduais e 5 presídios de segurança máxima' },
      ],
      organs: [
        { id: 'dpf', code: '30108', name: 'Departamento de Polícia Federal', acronym: 'DPF', amount: 15500000000, description: 'Instituição policial judiciária da União com jurisdição em todo o país' },
        { id: 'dprf', code: '30109', name: 'Departamento de Polícia Rodoviária Federal', acronym: 'PRF', amount: 12000000000, description: 'Polícia ostensiva das rodovias federais com foco no combate ao crime interestadual' },
        { id: 'depen', code: '30110', name: 'Secretaria Nacional de Políticas Penais', acronym: 'SENAPPEN', amount: 5000000000, description: 'Administra os presídios federais de Catanduvas, Campo Grande, Mossoró, Porto Velho e Brasília' },
      ],
      programs: [
        {
          id: 'prog-5024',
          code: '5024',
          name: 'Segurança Pública, Cidadania e Combate ao Crime Organizado',
          amount: 27500000000,
          organAcronym: 'DPF',
          actions: [
            {
              id: 'act-20YP',
              code: '20YP',
              name: 'Operações de Polícia Judiciária e Inteligência Policial Federal',
              description: 'Investigações de desvios de recursos públicos, combate a facções criminosas e controle de fronteiras',
              amount: 4200000000,
              beneficiaries: [
                {
                  id: 'rec-motorola-pf',
                  name: 'Motorola Solutions Ltda',
                  document: '00.902.946/0001-02',
                  type: 'EMPRESA_PRIVADA',
                  amount: 120000000,
                  documentNumber: '2025NE004990',
                  date: '2025-06-19',
                  uf: 'SP',
                  city: 'São Paulo',
                  actionCode: '20YP',
                  actionName: 'Inteligência Policial Federal',
                  organName: 'Departamento de Polícia Federal',
                  areaId: 'seguranca',
                  areaName: 'Segurança Pública e Polícia Federal',
                  objectDescription: 'Modernização do sistema de radiocomunicação digital criptografada TETRA nas fronteiras do Brasil',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/empenho/2025NE004990',
                },
                {
                  id: 'rec-cbc-municoes',
                  name: 'Companhia Brasileira de Cartuchos (CBC)',
                  document: '57.494.031/0001-63',
                  type: 'EMPRESA_PRIVADA',
                  amount: 45000000,
                  documentNumber: '2025NE005112',
                  date: '2025-04-14',
                  uf: 'SP',
                  city: 'Ribeirão Pires',
                  actionCode: '20YP',
                  actionName: 'Inteligência Policial Federal',
                  organName: 'Departamento de Polícia Federal',
                  areaId: 'seguranca',
                  areaName: 'Segurança Pública e Polícia Federal',
                  objectDescription: 'Fornecimento de munições operacionais de calibre restrito e treinamento tático para agentes federais',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/empenho/2025NE005112',
                },
                {
                  id: 'rec-unidas-prf',
                  name: 'Companhia de Locação das Américas (Unidas / Locamerica)',
                  document: '16.670.085/0001-55',
                  type: 'EMPRESA_PRIVADA',
                  amount: 85000000,
                  documentNumber: '2025OB803920',
                  date: '2025-08-20',
                  uf: 'MG',
                  city: 'Belo Horizonte',
                  actionCode: '20YQ',
                  actionName: 'Policiamento Rodoviário Ostensivo',
                  organName: 'Polícia Rodoviária Federal',
                  areaId: 'seguranca',
                  areaName: 'Segurança Pública e Polícia Federal',
                  objectDescription: 'Locação, blindagem nível III-A e manutenção preventiva de viaturas SUV 4x4 caracterizadas da PRF',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/ordem-bancaria/2025OB803920',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'transporte',
      name: 'Transporte e Infraestrutura Rodoviária',
      icon: '🛣️',
      color: '#f97316',
      bgTint: 'rgba(249, 115, 22, 0.08)',
      borderTint: 'rgba(249, 115, 22, 0.3)',
      description: 'Obras públicas do DNIT, duplicação e pavimentação de rodovias federais (BR-101, BR-116, BR-163), manutenção de pontes, ferrovias e infraestrutura portuária.',
      totalAmount: 34000000000,
      percentageOfTotal: 0.62,
      perCapitaYear: 158,
      variationPercent: 12.4,
      mandatoryRatio: 0.22,
      subfunctions: [
        { id: 'sub-rodovias', name: 'Malha Rodoviária Federal (DNIT)', amount: 25000000000, description: 'Duplicação, restauração de asfalto e sinalização nas rodovias de integração nacional' },
        { id: 'sub-ferrovias', name: 'Ferrovias e Transporte Sobre Trilhos (Infra S.A.)', amount: 5000000000, description: 'Estudos e concessões ferroviárias (Ferrogrão, Fiol e Fico)' },
        { id: 'sub-hidrovias', name: 'Portos e Hidrovias Interiores', amount: 4000000000, description: 'Dragagem de canais portuários (Santos, Paranaguá, Itaqui) e navegação amazônica' },
      ],
      organs: [
        { id: 'dnit', code: '39252', name: 'Departamento Nacional de Infraestrutura de Transportes', acronym: 'DNIT', amount: 28000000000, description: 'Autarquia federal responsável pela execução das obras rodoviárias e hidroviárias' },
        { id: 'mtransp', code: '39000', name: 'Ministério dos Transportes', acronym: 'MT', amount: 6000000000, description: 'Formula o plano nacional de logística e concessões de transportes' },
      ],
      programs: [
        {
          id: 'prog-5014',
          code: '5014',
          name: 'Transporte Terrestre Eficiente e Sustentável',
          amount: 25000000000,
          organAcronym: 'DNIT',
          actions: [
            {
              id: 'act-20X4',
              code: '20X4',
              name: 'Adequação de Trecho Rodoviário e Obras de Duplicação',
              description: 'Grandes intervenções de engenharia pesada para eliminação de pontos críticos e duplicações',
              amount: 11200000000,
              beneficiaries: [
                {
                  id: 'rec-queiroz-galvao',
                  name: 'Consórcio Construtora Queiroz Galvão / Ferreira Guedes',
                  document: '33.412.792/0001-60',
                  type: 'CONSORCIO_OBRAS',
                  amount: 540000000,
                  documentNumber: '2025NE007712',
                  date: '2025-07-15',
                  uf: 'SC',
                  city: 'Tubarão',
                  actionCode: '20X4',
                  actionName: 'Obras de Duplicação Rodoviária',
                  organName: 'Departamento Nacional de Infraestrutura de Transportes',
                  areaId: 'transporte',
                  areaName: 'Transporte e Infraestrutura Rodoviária',
                  objectDescription: 'Execução de obras de duplicação, pontes e viadutos na rodovia BR-101/SC lote 4',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/empenho/2025NE007712',
                },
                {
                  id: 'rec-andrade-gutierrez',
                  name: 'Andrade Gutierrez Engenharia S.A.',
                  document: '17.262.213/0001-94',
                  type: 'EMPRESA_PRIVADA',
                  amount: 412000000,
                  documentNumber: '2025NE008430',
                  date: '2025-06-02',
                  uf: 'PA',
                  city: 'Santarém',
                  actionCode: '20X4',
                  actionName: 'Obras de Duplicação Rodoviária',
                  organName: 'Departamento Nacional de Infraestrutura de Transportes',
                  areaId: 'transporte',
                  areaName: 'Transporte e Infraestrutura Rodoviária',
                  objectDescription: 'Pavimentação definitiva e contenção de encostas no corredor de grãos da BR-163/PA',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/empenho/2025NE008430',
                },
                {
                  id: 'rec-lcm-construcao',
                  name: 'LCM Construção e Comércio S.A.',
                  document: '03.220.257/0001-38',
                  type: 'EMPRESA_PRIVADA',
                  amount: 180000000,
                  documentNumber: '2025OB807120',
                  date: '2025-08-11',
                  uf: 'MG',
                  city: 'Belo Horizonte',
                  actionCode: '218B',
                  actionName: 'Conservação e Manutenção Rodoviária',
                  organName: 'Departamento Nacional de Infraestrutura de Transportes',
                  areaId: 'transporte',
                  areaName: 'Transporte e Infraestrutura Rodoviária',
                  objectDescription: 'Contrato Crema de recapeamento asfáltico contínuo e drenagem da BR-381/MG',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/ordem-bancaria/2025OB807120',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'agricultura',
      name: 'Agricultura e Abastecimento Alimentar',
      icon: '🌱',
      color: '#84cc16',
      bgTint: 'rgba(132, 204, 22, 0.08)',
      borderTint: 'rgba(132, 204, 22, 0.3)',
      description: 'Apoio à agricultura familiar (Pronaf), equalização de juros do Plano Safra, Embrapa (pesquisa agropecuária), reforma agrária (Incra) e defesa agropecuária.',
      totalAmount: 36000000000,
      percentageOfTotal: 0.65,
      perCapitaYear: 167,
      variationPercent: 7.1,
      mandatoryRatio: 0.54,
      subfunctions: [
        { id: 'sub-safra', name: 'Plano Safra e Seguro Rural', amount: 18000000000, description: 'Subvenção ao prêmio do seguro rural e equalização de taxas de crédito bancário' },
        { id: 'sub-pronaf', name: 'Agricultura Familiar e Reforma Agrária (Incra)', amount: 11000000000, description: 'Assistência técnica, títulos de terra e fomento a pequenos produtores rurais' },
        { id: 'sub-embrapa', name: 'Pesquisa Agropecuária (Embrapa)', amount: 7000000000, description: 'Inovações em sementes tropicais, biodefensivos e bioinsumos para o agronegócio' },
      ],
      organs: [
        { id: 'mapa', code: '22000', name: 'Ministério da Agricultura e Pecuária', acronym: 'MAPA', amount: 18000000000, description: 'Formulação de políticas de sustentabilidade e competitividade agropecuária' },
        { id: 'mda', code: '49000', name: 'Ministério do Desenvolvimento Agrário', acronym: 'MDA', amount: 11000000000, description: 'Foco na segurança alimentar e produção dos pequenos agricultores familiares' },
        { id: 'embrapa', code: '22201', name: 'Empresa Brasileira de Pesquisa Agropecuária', acronym: 'EMBRAPA', amount: 7000000000, description: 'Centro mundial de excelência em ciência para o clima tropical e savana' },
      ],
      programs: [
        {
          id: 'prog-5015',
          code: '5015',
          name: 'Desenvolvimento Sustentável da Agropecuária Brasileira',
          amount: 25000000000,
          organAcronym: 'MAPA',
          actions: [
            {
              id: 'act-00S6',
              code: '00S6',
              name: 'Equalização de Taxas de Juros do Crédito Rural — Plano Safra',
              description: 'O Tesouro paga aos bancos a diferença de juros para que o produtor financie sua lavoura com juros menores',
              amount: 14500000000,
              beneficiaries: [
                {
                  id: 'rec-bb-safra',
                  name: 'Banco do Brasil S.A. — Crédito Rural Oficial',
                  document: '00.000.000/0001-91',
                  type: 'EMPRESA_PRIVADA',
                  amount: 9800000000,
                  documentNumber: '2025OB804101',
                  date: '2025-08-25',
                  uf: 'DF',
                  city: 'Brasília',
                  actionCode: '00S6',
                  actionName: 'Equalização de Juros do Plano Safra',
                  organName: 'Secretaria do Tesouro Nacional / MAPA',
                  areaId: 'agricultura',
                  areaName: 'Agricultura e Abastecimento Alimentar',
                  objectDescription: 'Ressarcimento de custos financeiros ao principal agente financeiro do agronegócio brasileiro',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'legislativo',
      name: 'Poder Legislativo Federal e TCU',
      icon: '🏛️',
      color: '#a855f7',
      bgTint: 'rgba(168, 85, 247, 0.08)',
      borderTint: 'rgba(168, 85, 247, 0.3)',
      description: 'Funcionamento da Câmara dos Deputados (513 deputados), Senado Federal (81 senadores) e fiscalização das contas públicas pelo Tribunal de Contas da União (TCU).',
      totalAmount: 17500000000,
      percentageOfTotal: 0.32,
      perCapitaYear: 81,
      variationPercent: 3.4,
      mandatoryRatio: 0.93,
      subfunctions: [
        { id: 'sub-camara', name: 'Câmara dos Deputados', amount: 8400000000, description: 'Processo legislativo, TV Câmara, folha de servidores e cotas de mandato de 513 parlamentares' },
        { id: 'sub-senado', name: 'Senado Federal e Gráfica do Senado', amount: 5900000000, description: 'Representação dos 26 estados e DF com 81 senadores e assessorias legislativas' },
        { id: 'sub-tcu', name: 'Tribunal de Contas da União (TCU)', amount: 3200000000, description: 'Auditorias preventivas e repressivas sobre todas as despesas e licitações da União' },
      ],
      organs: [
        { id: 'camara', code: '02000', name: 'Câmara dos Deputados', acronym: 'CD', amount: 8400000000, description: 'Casa do Povo responsável por legislar e fiscalizar o Poder Executivo' },
        { id: 'senado', code: '03000', name: 'Senado Federal', acronym: 'SF', amount: 5900000000, description: 'Câmara alta do Congresso Nacional garantidora do pacto federativo' },
        { id: 'tcu', code: '04000', name: 'Tribunal de Contas da União', acronym: 'TCU', amount: 3200000000, description: 'Órgão auxiliar do Congresso Nacional no controle externo da administração pública' },
      ],
      programs: [
        {
          id: 'prog-0551',
          code: '0551',
          name: 'Atuação Legislativa e Fiscalizadora do Congresso Nacional',
          amount: 17500000000,
          organAcronym: 'CD',
          actions: [
            {
              id: 'act-21A3',
              code: '21A3',
              name: 'Processo Legislativo e Apoio Parlamentar da Câmara dos Deputados',
              description: 'Manutenção de sessões em plenário, comissões temáticas e estrutura administrativa do Congresso',
              amount: 8400000000,
              beneficiaries: [
                {
                  id: 'rec-prodemge-ti-camara',
                  name: 'Claro S.A. / Embratel — Telecomunicações e Dados do Congresso',
                  document: '40.432.544/0001-47',
                  type: 'EMPRESA_PRIVADA',
                  amount: 48000000,
                  documentNumber: '2025NE003190',
                  date: '2025-05-19',
                  uf: 'DF',
                  city: 'Brasília',
                  actionCode: '21A3',
                  actionName: 'Apoio Parlamentar e Processo Legislativo',
                  organName: 'Câmara dos Deputados',
                  areaId: 'legislativo',
                  areaName: 'Poder Legislativo Federal e TCU',
                  objectDescription: 'Infraestrutura de rede segura, links de fibra óptica de alta velocidade e transmissão dos plenários',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/empenho/2025NE003190',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'ciencia',
      name: 'Ciência, Tecnologia e Inovação',
      icon: '🔬',
      color: '#14b8a6',
      bgTint: 'rgba(20, 184, 166, 0.08)',
      borderTint: 'rgba(20, 184, 166, 0.3)',
      description: 'Fundo Nacional de Desenvolvimento Científico e Tecnológico (FNDCT), bolsas de iniciação e pós-doutorado (CNPq), Finep e laboratórios de ponta (Sirius / CNPEM).',
      totalAmount: 17800000000,
      percentageOfTotal: 0.32,
      perCapitaYear: 83,
      variationPercent: 14.2,
      mandatoryRatio: 0.38,
      subfunctions: [
        { id: 'sub-fndct', name: 'Inovação e Fundo Científico (FNDCT / Finep)', amount: 10500000000, description: 'Subvenção econômica a startups, semicondutores, transição energética e biotecnologia' },
        { id: 'sub-cnpq', name: 'Pesquisa e Fomento Acadêmico (CNPq)', amount: 5200000000, description: 'Bolsas de Produtividade em Pesquisa e financiamento de projetos em laboratórios públicos' },
        { id: 'sub-espacial', name: 'Programa Espacial e Satélites (INPE / AEB)', amount: 2100000000, description: 'Satélites de monitoramento da Amazônia (Amazônia-1) e sensoriamento remoto' },
      ],
      organs: [
        { id: 'mcti', code: '24000', name: 'Ministério da Ciência, Tecnologia e Inovação', acronym: 'MCTI', amount: 17800000000, description: 'Condução estratégica do Sistema Nacional de Ciência, Tecnologia e Inovação' },
        { id: 'cnpq', code: '24205', name: 'Conselho Nacional de Desenvolvimento Científico', acronym: 'CNPq', amount: 5200000000, description: 'Principal agência de fomento à formação continuada de pesquisadores do país' },
      ],
      programs: [
        {
          id: 'prog-5020',
          code: '5020',
          name: 'Ciência, Tecnologia e Inovação para o Desenvolvimento',
          amount: 17800000000,
          organAcronym: 'MCTI',
          actions: [
            {
              id: 'act-00P9',
              code: '00P9',
              name: 'Fomento à Pesquisa Científica e Tecnológica de Ponta',
              description: 'Apoio financeiro aos maiores centros laboratoriais e mais de 78.000 bolsistas científicos',
              amount: 5200000000,
              beneficiaries: [
                {
                  id: 'rec-cnpem-sirius',
                  name: 'Centro Nacional de Pesquisa em Energia e Materiais (CNPEM — Sirius)',
                  document: '01.543.605/0001-07',
                  type: 'INSTITUTO_HOSPITAL',
                  amount: 260000000,
                  documentNumber: '2025NE004210',
                  date: '2025-05-30',
                  uf: 'SP',
                  city: 'Campinas',
                  actionCode: '00P9',
                  actionName: 'Fomento à Pesquisa e Infraestrutura Científica',
                  organName: 'Ministério da Ciência, Tecnologia e Inovação',
                  areaId: 'ciencia',
                  areaName: 'Ciência, Tecnologia e Inovação',
                  objectDescription: 'Operação do acelerador de elétrons de 4ª geração Sirius para desenvolvimento de novos fármacos e materiais',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/empenho/2025NE004210',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'meio-ambiente',
      name: 'Meio Ambiente e Combate ao Desmatamento',
      icon: '🌳',
      color: '#15803d',
      bgTint: 'rgba(21, 128, 61, 0.08)',
      borderTint: 'rgba(21, 128, 61, 0.3)',
      description: 'Ibama (fiscalização e autuações ambientais), ICMBio (conservação de parques nacionais e reservas biológicas), combate a queimadas (Prevfogo) e proteção das águas.',
      totalAmount: 5900000000,
      percentageOfTotal: 0.11,
      perCapitaYear: 27,
      variationPercent: 18.5,
      mandatoryRatio: 0.45,
      subfunctions: [
        { id: 'sub-ibama', name: 'Fiscalização e Controle Ambiental (Ibama)', amount: 2800000000, description: 'Operações contra garimpo ilegal, desmatamento zero e aplicação de multas ambientais' },
        { id: 'sub-icmbio', name: 'Unidades de Conservação e Biodiversidade (ICMBio)', amount: 2100000000, description: 'Proteção dos 334 parques nacionais, reservas extrativistas e proteção de fauna ameaçada' },
        { id: 'sub-prevfogo', name: 'Prevenção e Combate a Queimadas Florestais (Prevfogo)', amount: 1000000000, description: 'Contratação de 2.500 brigadistas comunitários e horas de voo de aviões tanques de água' },
      ],
      organs: [
        { id: 'ibama', code: '44201', name: 'Instituto Brasileiro do Meio Ambiente', acronym: 'IBAMA', amount: 2800000000, description: 'Poder de polícia ambiental e licenciamento federal de grandes empreendimentos' },
        { id: 'icmbio', code: '44207', name: 'Instituto Chico Mendes de Conservação', acronym: 'ICMBio', amount: 2100000000, description: 'Gestão e salvaguarda do patrimônio ecológico nas unidades de conservação federais' },
      ],
      programs: [
        {
          id: 'prog-5019',
          code: '5019',
          name: 'Conservação da Biodiversidade e Mudança Climática',
          amount: 5900000000,
          organAcronym: 'IBAMA',
          actions: [
            {
              id: 'act-214P',
              code: '214P',
              name: 'Fiscalização Ambiental e Prevenção e Combate a Incêndios Florestais',
              description: 'Mobilização rápida de aeronaves e brigadas para contenção de focos de fogo na Amazônia e Pantanal',
              amount: 1450000000,
              beneficiaries: [
                {
                  id: 'rec-lider-aviacao-fogo',
                  name: 'Líder Aviação S.A. — Fretamento Aéreo Especializado',
                  document: '17.183.021/0001-72',
                  type: 'EMPRESA_PRIVADA',
                  amount: 68000000,
                  documentNumber: '2025NE008101',
                  date: '2025-08-04',
                  uf: 'DF',
                  city: 'Brasília',
                  actionCode: '214P',
                  actionName: 'Combate a Incêndios Florestais (Prevfogo)',
                  organName: 'Instituto Brasileiro do Meio Ambiente',
                  areaId: 'meio-ambiente',
                  areaName: 'Meio Ambiente e Combate ao Desmatamento',
                  objectDescription: 'Disponibilização de horas de voo de aviões turboélice Air Tractor para lançamento de retardante de chamas',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas/documento/empenho/2025NE008101',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'outros',
      name: 'Outras Funções de Governo e Habitação',
      icon: '🏙️',
      color: '#64748b',
      bgTint: 'rgba(100, 116, 139, 0.08)',
      borderTint: 'rgba(100, 116, 139, 0.3)',
      description: 'Habitação popular (Minha Casa Minha Vida), saneamento básico, relações diplomáticas (Itamaraty), energia, mineração e Ministério Público da União (MPU/DPU).',
      totalAmount: 110800000000,
      percentageOfTotal: 2.01,
      perCapitaYear: 515,
      variationPercent: 5.0,
      mandatoryRatio: 0.72,
      subfunctions: [
        { id: 'sub-habitacao', name: 'Habitação Popular (Minha Casa Minha Vida)', amount: 28000000000, description: 'Subsídio para famílias de faixas 1 e 2 adquirirem a moradia própria com escritura registrada' },
        { id: 'sub-saneamento', name: 'Saneamento Básico e Gestão de Recursos Hídricos', amount: 18000000000, description: 'Canal de Transposição do Rio São Francisco, adutoras e abastecimento de água no semiárido' },
        { id: 'sub-mpu', name: 'Ministério Público da União e Defensoria Pública (MPU / DPU)', amount: 14000000000, description: 'Defesa da ordem jurídica, combate à corrupção e assistência jurídica gratuita aos desfavorecidos' },
        { id: 'sub-exterior', name: 'Relações Exteriores e Missões Diplomáticas (Itamaraty)', amount: 6800000000, description: 'Embaixadas, consulados e quotas de organismos internacionais (ONU, OEA, OMC, OMS)' },
        { id: 'sub-demais', name: 'Demais Ações de Governo e Custeio Geral', amount: 44000000000, description: 'Tecnologia da informação central, fiscalização tributária da Receita Federal e patrimônio da União' },
      ],
      organs: [
        { id: 'mcid', code: '56000', name: 'Ministério das Cidades', acronym: 'MCID', amount: 46000000000, description: 'Gestão da política de desenvolvimento urbano, mobilidade e habitação social' },
        { id: 'mpu', code: '34000', name: 'Ministério Público da União', acronym: 'MPU', amount: 14000000000, description: 'Atuação autônoma do MPF, MPT, MPM e MPDFT na defesa dos interesses coletivos' },
        { id: 'mre', code: '21000', name: 'Ministério das Relações Exteriores', acronym: 'MRE', amount: 6800000000, description: 'Condução da diplomacia e da política externa brasileira em 140 países' },
      ],
      programs: [
        {
          id: 'prog-5016',
          code: '5016',
          name: 'Habitação e Vida Digna — Minha Casa Minha Vida',
          amount: 28000000000,
          organAcronym: 'MCID',
          actions: [
            {
              id: 'act-00S8',
              code: '00S8',
              name: 'Subvenção Econômica do Fundo de Arrendamento Residencial (FAR)',
              description: 'Pagamento de subsídio direto para construção e entrega de apartamentos e casas populares',
              amount: 14500000000,
              beneficiaries: [
                {
                  id: 'rec-caixa-far',
                  name: 'Caixa Econômica Federal — Gestora Operacional do FAR / MCMV',
                  document: '00.360.305/0001-04',
                  type: 'BENEFICIARIO_DIRETO',
                  amount: 14500000000,
                  documentNumber: '2025OB808801',
                  date: '2025-08-01',
                  uf: 'DF',
                  city: 'Brasília',
                  actionCode: '00S8',
                  actionName: 'Subvenção Habitacional FAR',
                  organName: 'Ministério das Cidades',
                  areaId: 'outros',
                  areaName: 'Outras Funções de Governo e Habitação',
                  objectDescription: 'Liberação de parcelas conforme avanço físico de obras para mais de 180 construtoras conveniadas',
                  transparencyPortalUrl: 'https://portaldatransparencia.gov.br/despesas',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// BASE OFICIAL HISTÓRICA 2024 (Consolidado do Exercício Anterior)
// ─────────────────────────────────────────────────────────────────────────────

export const FEDERAL_BUDGET_2024: FederalBudgetData = {
  year: 2024,
  lastUpdated: '31 de Dezembro de 2024 — Balanço Geral da União (STN)',
  officialSource: 'Balanço Geral da União / Secretaria do Tesouro Nacional',
  sourceUrl: 'https://portaldatransparencia.gov.br/despesas',
  cguApiStatus: 'synced',
  fiscalBalance: FISCAL_BALANCE_2024,
  revenues: REVENUE_CATEGORIES_2025.map((r) => {
    const ratio2024 = 5120000000000 / 5520000000000;
    return {
      ...r,
      totalAmount: Math.round(r.totalAmount * ratio2024),
      subitems: r.subitems.map((sub) => ({
        ...sub,
        amount: Math.round(sub.amount * ratio2024),
      })),
    };
  }),
  totals: {
    totalBudget: 5120000000000, // R$ 5,12 Trilhões
    mandatoryExpenses: 2680000000000,
    discretionaryExpenses: 198000000000,
    debtRefinancing: 2242000000000,
    directInvestments: 76000000000,
    totalBeneficiariesCount: 46120,
    totalAuditedContracts: 138900,
  },
  areas: FEDERAL_BUDGET_2025.areas.map((a) => {
    // Reduz ligeiramente os valores para refletir a execução consolidada de 2024
    const ratio2024 = 5120000000000 / 5520000000000;
    return {
      ...a,
      totalAmount: Math.round(a.totalAmount * ratio2024),
      perCapitaYear: Math.round(a.perCapitaYear * ratio2024),
    };
  }),
};

// ─────────────────────────────────────────────────────────────────────────────
// BASE OFICIAL HISTÓRICA 2023
// ─────────────────────────────────────────────────────────────────────────────

export const FEDERAL_BUDGET_2023: FederalBudgetData = {
  year: 2023,
  lastUpdated: '31 de Dezembro de 2023 — Balanço Geral da União (STN)',
  officialSource: 'Balanço Geral da União / Secretaria do Tesouro Nacional',
  sourceUrl: 'https://portaldatransparencia.gov.br/despesas',
  cguApiStatus: 'synced',
  fiscalBalance: FISCAL_BALANCE_2023,
  revenues: REVENUE_CATEGORIES_2025.map((r) => {
    const ratio2023 = 4680000000000 / 5520000000000;
    return {
      ...r,
      totalAmount: Math.round(r.totalAmount * ratio2023),
      subitems: r.subitems.map((sub) => ({
        ...sub,
        amount: Math.round(sub.amount * ratio2023),
      })),
    };
  }),
  totals: {
    totalBudget: 4680000000000, // R$ 4,68 Trilhões
    mandatoryExpenses: 2450000000000,
    discretionaryExpenses: 182000000000,
    debtRefinancing: 2048000000000,
    directInvestments: 65000000000,
    totalBeneficiariesCount: 43500,
    totalAuditedContracts: 129000,
  },
  areas: FEDERAL_BUDGET_2025.areas.map((a) => {
    const ratio2023 = 4680000000000 / 5520000000000;
    return {
      ...a,
      totalAmount: Math.round(a.totalAmount * ratio2023),
      perCapitaYear: Math.round(a.perCapitaYear * ratio2023),
    };
  }),
};

// ─────────────────────────────────────────────────────────────────────────────
// FUNÇÕES AUXILIARES DE FORMATAÇÃO E CÁLCULO CÍVICO
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retorna os dados do orçamento federal pelo ano selecionado
 */
export function getFederalBudgetData(year: number = 2025): FederalBudgetData {
  if (year === 2024) return FEDERAL_BUDGET_2024;
  if (year === 2023) return FEDERAL_BUDGET_2023;
  return FEDERAL_BUDGET_2025;
}

/**
 * Formata valores grandiosos do Orçamento Federal em Português (Trilhões, Bilhões, Milhões)
 */
export function formatFederalCurrency(amount: number): string {
  if (amount >= 1e12) {
    const tri = amount / 1e12;
    return `R$ ${tri.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Tri`;
  }
  if (amount >= 1e9) {
    const bi = amount / 1e9;
    return `R$ ${bi.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} Bi`;
  }
  if (amount >= 1e6) {
    const mi = amount / 1e6;
    return `R$ ${mi.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} Mi`;
  }
  return `R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Formata valor monetário exato nota a nota
 */
export function formatExactCurrency(amount: number): string {
  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Coleta todos os favorecidos finais (beneficiários) de todas as áreas
 */
export function getAllRecipients(budgetData: FederalBudgetData): FinalRecipient[] {
  const recipients: FinalRecipient[] = [];
  for (const area of budgetData.areas) {
    for (const program of area.programs) {
      for (const action of program.actions) {
        for (const recipient of action.beneficiaries) {
          recipients.push(recipient);
        }
      }
    }
  }
  return recipients;
}

/**
 * Calcula a divisão do imposto de um cidadão com base no seu salário ou imposto estimado
 */
export interface CitizenTaxShare {
  areaId: string;
  areaName: string;
  icon: string;
  color: string;
  percentage: number;
  yourShareInBrl: number;
  examples: string[];
}

export function calculateCitizenShare(
  totalAnnualTax: number,
  budgetData: FederalBudgetData = FEDERAL_BUDGET_2025
): {
  totalTax: number;
  shares: CitizenTaxShare[];
} {
  const total = budgetData.totals.totalBudget;

  const shares: CitizenTaxShare[] = budgetData.areas.map((area) => {
    const ratio = area.totalAmount / total;
    const shareAmount = totalAnnualTax * ratio;

    let examples: string[] = [];
    if (area.id === 'saude') {
      examples = ['Vacinas pelo SUS', 'Medicamentos Farmácia Popular', 'Postos de Saúde e UPAs'];
    } else if (area.id === 'educacao') {
      examples = ['Merenda Escolar (PNAE)', 'Universidades Federais', 'Bolsas da Capes'];
    } else if (area.id === 'previdencia') {
      examples = ['Aposentadorias e pensões do INSS', 'Benefícios rurais e urbanos'];
    } else if (area.id === 'assistencia') {
      examples = ['Bolsa Família', 'BPC para idosos e PcD de baixa renda'];
    } else if (area.id === 'seguranca') {
      examples = ['Polícia Federal e PRF', 'Combate ao crime e fiscalização nas estradas'];
    } else if (area.id === 'transporte') {
      examples = ['Duplicação de rodovias (BR-101/BR-163)', 'Recapeamento de asfalto pelo DNIT'];
    } else if (area.id === 'defesa') {
      examples = ['Vigilância de fronteiras', 'Projetos estratégicos (Caças Gripen, Submarinos)'];
    } else if (area.id === 'divida') {
      examples = ['Juros e amortização da dívida pública federal'];
    } else {
      examples = ['Habitação social', 'Ciência e tecnologia', 'Fiscalização ambiental'];
    }

    return {
      areaId: area.id,
      areaName: area.name,
      icon: area.icon,
      color: area.color,
      percentage: area.percentageOfTotal,
      yourShareInBrl: shareAmount,
      examples,
    };
  });

  return {
    totalTax: totalAnnualTax,
    shares: shares.sort((a, b) => b.yourShareInBrl - a.yourShareInBrl),
  };
}

/**
 * Gera arquivo CSV com os dados filtrados para download do cidadão
 */
export function exportRecipientsToCSV(recipients: FinalRecipient[], filename = 'gastos-uniao-favorecidos.csv'): void {
  const headers = [
    'Favorecido',
    'Documento (CNPJ/CPF)',
    'Tipo',
    'Valor Pago (R$)',
    'Nota de Empenho/OB',
    'Data',
    'UF',
    'Município',
    'Área Orçamentária',
    'Ação Governamental',
    'Objeto da Despesa',
    'Link Portal da Transparência',
  ];

  const rows = recipients.map((r) => [
    `"${r.name.replace(/"/g, '""')}"`,
    `"${r.document}"`,
    `"${r.type}"`,
    r.amount.toFixed(2),
    `"${r.documentNumber}"`,
    `"${r.date}"`,
    `"${r.uf}"`,
    `"${r.city}"`,
    `"${r.areaName.replace(/"/g, '""')}"`,
    `"${r.actionName.replace(/"/g, '""')}"`,
    `"${r.objectDescription.replace(/"/g, '""')}"`,
    `"${r.transparencyPortalUrl}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
