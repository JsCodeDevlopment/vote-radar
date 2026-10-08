export interface OfficialChannel {
  id: string;
  name: string;
  entity: string;
  description: string;
  whenToUse: string;
  url: string;
  phone?: string;
  freePhone?: boolean;
  category: 'lai' | 'ouvidoria' | 'legislativo' | 'fiscalizacao' | 'auditoria';
  badge: string;
  badgeColor: string;
}

export interface CivicGuideStep {
  step: number;
  title: string;
  icon: string;
  summary: string;
  details: string[];
  tip?: string;
}

export interface AccountabilityTemplate {
  id: 'votacao' | 'gastos' | 'lai' | 'denuncia';
  title: string;
  icon: string;
  tagline: string;
  description: string;
  defaultSubject: string;
  fields: {
    key: string;
    label: string;
    placeholder: string;
    defaultValue?: string;
  }[];
  generateText: (params: {
    politicianName: string;
    civilName?: string | null;
    officeLabel: string;
    party?: string | null;
    uf?: string | null;
    bodyName: string;
    customFields: Record<string, string>;
  }) => { subject: string; body: string };
}

export const CIVIC_GUIDE_STEPS: CivicGuideStep[] = [
  {
    step: 1,
    title: 'Reúna Fatos e Dados Concretos',
    icon: '📊',
    summary: 'A cobrança eficiente começa com evidências extraídas de fontes oficiais.',
    details: [
      'Anote o número do Projeto de Lei (PL, PEC, MPV) e a data da votação na aba Votações.',
      'Identifique o número da nota fiscal, o valor exato em reais e o CNPJ do fornecedor na aba Gastos.',
      'Verifique se os dados são recentes e extraídos das fontes primárias (Câmara, Senado, TSE ou Diário Oficial).',
    ],
    tip: 'Quanto mais específico for o questionamento (ex: citar data, número do processo e valor), mais difícil será para a assessoria responder com respostas evasivas.',
  },
  {
    step: 2,
    title: 'Mantenha Tom Firme, Técnico e Respeitoso',
    icon: '⚖️',
    summary: 'Ataque o gasto ou o voto, nunca a pessoa física do parlamentar.',
    details: [
      'Você tem direito constitucional de exigir explicações (Art. 5º, XXXIII e XXXIV da CF/88).',
      'Evite termos ofensivos, acusações sem prova ou xingamentos: isso desvia o foco do problema e pode ensejar processos por calúnia ou injúria.',
      'Pergunte com objetividade: "Qual a justificativa de interesse público para este gasto?" ou "Por que o senhor votou sim nesta proposta?".',
    ],
    tip: 'Lembre-se: parlamentares e suas equipes são servidores comissionados mantidos por impostos para representar o povo.',
  },
  {
    step: 3,
    title: 'Acione os Canais Oficiais Primários',
    icon: '✉️',
    summary: 'Gere um registro formal antes de qualquer outra medida.',
    details: [
      'Envie primeiro um e-mail formal para o gabinete do parlamentar com o modelo sugerido.',
      'Se não obtiver resposta em até 10 dias úteis, protocole um pedido oficial via Lei de Acesso à Informação (LAI) pelo Fala.BR.',
      'Pela LAI (Lei 12.527/2011), o órgão público tem prazo legal de 20 dias (prorrogáveis por mais 10) para fornecer resposta oficial.',
    ],
    tip: 'Guarde sempre o comprovante de envio do e-mail ou o número de protocolo do Fala.BR.',
  },
  {
    step: 4,
    title: 'Controle Social, Redes e Mobilização Coletiva',
    icon: '📣',
    summary: 'Parlamentares são altamente sensíveis à opinião pública do seu eleitorado.',
    details: [
      'Se o gabinete ignorar o contato, publique questionamentos objetivos nas redes sociais oficiais do parlamentar marcando os canais dele.',
      'Compartilhe dados objetivos com outros cidadãos do mesmo estado ou município para amplificar a cobrança.',
      'Se houver suspeita real de fraude ou desvio (ex: empresa fantasma, notas clonadas), formalize representação ao Ministério Público Federal (MPF) ou TCU.',
    ],
    tip: 'A pressão popular conjunta costuma ser decisiva para reverter posicionamentos em votações polêmicas.',
  },
];

export const OFFICIAL_CHANNELS: OfficialChannel[] = [
  {
    id: 'falabr',
    name: 'Fala.BR — Plataforma Integrada de Ouvidoria e LAI',
    entity: 'Controladoria-Geral da União (CGU)',
    description:
      'Canal central do Governo Federal para protocolar pedidos formais via Lei de Acesso à Informação (LAI) e manifestações cívicas.',
    whenToUse:
      'Use para exigir documentos, cópias integrais de notas fiscais, contratos de prestação de serviços ou esclarecimentos oficiais obrigatórios por lei.',
    url: 'https://falabr.cgu.gov.br/',
    category: 'lai',
    badge: 'Lei 12.527/2011 (LAI)',
    badgeColor: '#10b981',
  },
  {
    id: 'ouvidoria-camara',
    name: 'Ouvidoria da Câmara dos Deputados',
    entity: 'Câmara dos Deputados',
    description:
      'Órgão oficial de interlocução entre a sociedade e a Câmara dos Deputados para envio de reclamações, elogios, sugestões e denúncias de quebra de decoro.',
    whenToUse:
      'Use para questionar conduta ética de deputados federais, atuação de comissões ou formalizar reclamações institucionais.',
    url: 'https://www.camara.leg.br/fale-com-a-ouvidoria/',
    phone: '0800 0 619 619',
    freePhone: true,
    category: 'ouvidoria',
    badge: 'Disque-Câmara Gratuito',
    badgeColor: '#3b82f6',
  },
  {
    id: 'alo-senado',
    name: 'Alô Senado & Ouvidoria do Senado Federal',
    entity: 'Senado Federal',
    description:
      'Canal telefônico e digital gratuito para o cidadão opinar sobre projetos em pauta, atuação de senadores e serviços legislativos.',
    whenToUse:
      'Use para registrar apoio ou repúdio a projetos de lei que tramitam no Senado ou cobrar posicionamentos de senadores do seu estado.',
    url: 'https://www12.senado.leg.br/institucional/ouvidoria',
    phone: '0800 061 2211',
    freePhone: true,
    category: 'ouvidoria',
    badge: 'Ligação Gratuita',
    badgeColor: '#3b82f6',
  },
  {
    id: 'edemocracia',
    name: 'Portal e-Democracia',
    entity: 'Câmara dos Deputados',
    description:
      'Ambiente virtual de participação legislativa popular com audiências públicas interativas, discussões de projetos e enquetes oficiais.',
    whenToUse:
      'Participe de consultas públicas sobre projetos de lei (PLs/PECs) e envie perguntas para serem lidas em tempo real nas audiências de comissões.',
    url: 'https://edemocracia.camara.leg.br/',
    category: 'legislativo',
    badge: 'Participação ao Vivo',
    badgeColor: '#8b5cf6',
  },
  {
    id: 'ecidadania',
    name: 'Portal e-Cidadania',
    entity: 'Senado Federal',
    description:
      'Plataforma interativa do Senado Federal onde os cidadãos podem votar nas consultas públicas de matérias e propor Novas Ideias Legislativas.',
    whenToUse:
      'Vote "A Favor" ou "Contra" em projetos em tramitação. Ideias legislativas com 20 mil apoios viram Projetos de Lei formais.',
    url: 'https://www12.senado.leg.br/ecidadania',
    category: 'legislativo',
    badge: 'Consultas Públicas',
    badgeColor: '#8b5cf6',
  },
  {
    id: 'mpf-sac',
    name: 'Ministério Público Federal (Sala de Atendimento ao Cidadão)',
    entity: 'MPF — Procuradoria-Geral da República',
    description:
      'Órgão independente guardião da ordem jurídica, dos direitos sociais e do patrimônio público federal.',
    whenToUse:
      'Use para registrar Representação ou Denúncia caso encontre indícios sólidos de crime, corrupção, empresas de fachada ou improbidade administrativa com verbas federais.',
    url: 'https://sac.mpf.mp.br/',
    category: 'fiscalizacao',
    badge: 'Denúncia e Representação',
    badgeColor: '#ef4444',
  },
  {
    id: 'ouvidoria-tcu',
    name: 'Ouvidoria do Tribunal de Contas da União (TCU)',
    entity: 'Tribunal de Contas da União',
    description:
      'Tribunal que realiza o controle externo dos recursos públicos federais e julga as contas de administradores e parlamentares.',
    whenToUse:
      'Use para denunciar irregularidades na aplicação de recursos públicos federais, contratações superfaturadas ou desvios de finalidade na cota parlamentar.',
    url: 'https://portal.tcu.gov.br/ouvidoria/',
    phone: '0800 644 2300',
    freePhone: true,
    category: 'fiscalizacao',
    badge: 'Controle Externo',
    badgeColor: '#f59e0b',
  },
  {
    id: 'redesim-cnpj',
    name: 'Consulta de CNPJ na Receita Federal (Redesim)',
    entity: 'Secretaria Especial da Receita Federal do Brasil',
    description:
      'Emissão pública de Comprovante de Inscrição e de Situação Cadastral de Pessoas Jurídicas fornecedoras do Poder Público.',
    whenToUse:
      'Antes de questionar uma despesa da CEAP, consulte o CNPJ do prestador para verificar a atividade econômica (CNAE), data de abertura e endereço real.',
    url: 'https://solucoes.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp',
    category: 'auditoria',
    badge: 'Auditoria de Fornecedores',
    badgeColor: '#06b6d4',
  },
];

export const ACCOUNTABILITY_TEMPLATES: AccountabilityTemplate[] = [
  {
    id: 'votacao',
    title: 'Cobrança de Votação Nominal',
    icon: '🗳️',
    tagline: 'Exija justificativa sobre voto em projeto de lei, PEC ou medida provisória.',
    description:
      'Modelo para solicitar que o parlamentar esclareça publicamente aos seus representados os motivos técnicos e políticos do seu voto.',
    defaultSubject: 'Solicitação de Esclarecimentos sobre Votação em Plenário — [PROPOSICAO]',
    fields: [
      {
        key: 'proposicao',
        label: 'Número da Matéria / Projeto',
        placeholder: 'Ex: PEC 45/2019, PL 2630/2020, MPV 1185/2023',
        defaultValue: 'PL em tramitação',
      },
      {
        key: 'voto',
        label: 'Posicionamento do Parlamentar',
        placeholder: 'Ex: Voto FAVORÁVEL, Voto CONTRÁRIO, AUSÊNCIA',
        defaultValue: 'Voto no plenário',
      },
      {
        key: 'cidadaoNome',
        label: 'Seu Nome Completo (Eleitor)',
        placeholder: 'Ex: Maria Silva',
        defaultValue: '',
      },
      {
        key: 'cidadaoCidade',
        label: 'Sua Cidade / Bairro',
        placeholder: 'Ex: Campinas/SP ou Belo Horizonte/MG',
        defaultValue: '',
      },
    ],
    generateText: ({ politicianName, officeLabel, party, uf, customFields }) => {
      const prop = customFields.proposicao || 'proposição em pauta';
      const voto = customFields.voto || 'seu voto registrado';
      const nome = customFields.cidadaoNome?.trim() || '[Seu Nome Completo]';
      const cidade = customFields.cidadaoCidade?.trim() || '[Sua Cidade/UF]';

      const subject = `Solicitação de Justificativa de Voto — ${prop} — Eleitor(a) de ${uf ?? 'Brasil'}`;
      const body = `À atenção do(a) Exmo(a). ${officeLabel} ${politicianName}
${party ? `Partido: ${party}` : ''} | Representação: ${uf ? `Estado de ${uf}` : 'Brasil'}

Prezado(a) ${officeLabel},

Como cidadão(ã) e eleitor(a) domiciliado(a) em ${cidade}, acompanho com atenção o exercício do seu mandato parlamentar por meio de plataformas de integridade pública e dados abertos oficiais.

Tomei conhecimento do seu posicionamento formal a respeito da matéria ${prop}, em que constou ${voto}.

Considerando que o mandato eletivo é um encargo público de representação popular e que o voto parlamentar afeta diretamente a vida dos cidadãos do nosso estado e país, venho respeitosamente solicitar:

1. Os fundamentos e justificativas técnicas, sociais ou econômicas que balizaram o posicionamento adotado pelo(a) senhor(a);
2. Os estudos, dados públicos ou interlocuções com a sociedade civil que embasaram essa decisão;
3. Se há compromisso do gabinete em acolher manifestações do eleitorado nas próximas etapas de tramitação.

Agradeço a atenção e aguardo a manifestação oficial deste gabinete parlamentar em prol da transparência pública e da prestação de contas com seus eleitores.

Atenciosamente,

${nome}
Eleitor(a) — ${cidade}`;

      return { subject, body };
    },
  },
  {
    id: 'gastos',
    title: 'Questionamento de Gastos (CEAP)',
    icon: '💰',
    tagline: 'Solicite esclarecimentos sobre notas fiscais da Cota Parlamentar.',
    description:
      'Modelo para questionar despesas atípicas, gastos elevados de combustíveis, divulgação de mandato ou consultorias pagas com verba indenizatória.',
    defaultSubject: 'Pedido de Esclarecimento sobre Despesas da Cota Parlamentar — CEAP',
    fields: [
      {
        key: 'tipoGasto',
        label: 'Categoria da Despesa',
        placeholder: 'Ex: Divulgação da atividade parlamentar, Combustíveis, Consultoria',
        defaultValue: 'Cota para Exercício da Atividade Parlamentar (CEAP)',
      },
      {
        key: 'valorOuNota',
        label: 'Valor e/ou Nota Fiscal (NF)',
        placeholder: 'Ex: R$ 15.000,00 na NF nº 1234 emitida em 10/2024',
        defaultValue: 'Lançamentos recentes na cota parlamentar',
      },
      {
        key: 'fornecedor',
        label: 'Nome / Razão Social do Fornecedor (Opcional)',
        placeholder: 'Ex: Empresa XYZ Comunicação Ltda (CNPJ 00.000.000/0001-00)',
        defaultValue: '',
      },
      {
        key: 'cidadaoNome',
        label: 'Seu Nome Completo',
        placeholder: 'Ex: João Santos',
        defaultValue: '',
      },
    ],
    generateText: ({ politicianName, officeLabel, bodyName, customFields }) => {
      const gasto = customFields.tipoGasto || 'despesas indenizatórias';
      const valor = customFields.valorOuNota || 'valores registrados no portal oficial';
      const forn = customFields.fornecedor ? `junto à empresa/prestador ${customFields.fornecedor}` : '';
      const nome = customFields.cidadaoNome?.trim() || '[Seu Nome Completo]';

      const subject = `Pedido de Esclarecimento e Economicidade de Gastos — CEAP — Gabinete ${politicianName}`;
      const body = `À Chefia de Gabinete do(a) Exmo(a). ${officeLabel} ${politicianName}
${bodyName}

Prezada equipe de assessoria e Exmo(a). Parlamentar,

Em exercício do controle social e em conformidade com o princípio constitucional da publicidade e economicidade (Art. 37 da Constituição Federal), consultei a prestação de contas oficial da Cota para o Exercício da Atividade Parlamentar (CEAP) deste mandato.

Verifiquei o lançamento da despesa referente a:
• Categoria: ${gasto}
• Referência / Valor: ${valor} ${forn ? `\n• Fornecedor: ${forn}` : ''}

Com o intuito de verificar o estrito atendimento ao interesse público e à necessária economicidade dos recursos do contribuinte, solicito cordialmente:

1. A descrição dos produtos ou serviços efetivamente entregues ao mandato;
2. A comprovação de que o valor contratado guardou conformidade com os preços médios praticados no mercado;
3. Cópia dos relatórios de execução ou produtos gerados decorrentes dessa despesa, caso aplicável.

Conto com o espírito de transparência deste mandato para responder aos cidadãos pagadores de impostos.

Respeitosamente,

${nome}
Cidadão(ã) e Contribuinte`;

      return { subject, body };
    },
  },
  {
    id: 'lai',
    title: 'Pedido Formal via LAI (Fala.BR / e-SIC)',
    icon: '📜',
    tagline: 'Protocolo com respaldo na Lei Federal 12.527/2011 e prazos legais.',
    description:
      'Modelo formal para protocolar diretamente no Fala.BR (CGU) ou no Serviço de Informações ao Cidadão (e-SIC) da respectiva Casa Legislativa.',
    defaultSubject: 'Pedido de Informação com base na Lei nº 12.527/2011 (LAI)',
    fields: [
      {
        key: 'objeto',
        label: 'Objeto Específico da Informação Solicitada',
        placeholder: 'Ex: Cópia integral de relatórios de consultoria técnica pagos em 2024',
        defaultValue: 'Detalhamento de despesas e contratos de gabinete',
      },
      {
        key: 'periodo',
        label: 'Período de Referência',
        placeholder: 'Ex: Exercício de 2024 ou Período de Janeiro a Junho',
        defaultValue: 'Ano corrente',
      },
      {
        key: 'cidadaoNome',
        label: 'Seu Nome Completo',
        placeholder: 'Seu nome civil conforme documento',
        defaultValue: '',
      },
    ],
    generateText: ({ politicianName, officeLabel, bodyName, customFields }) => {
      const objeto = customFields.objeto || 'Informações e documentos relativos ao mandato parlamentar';
      const periodo = customFields.periodo || 'ano corrente';
      const nome = customFields.cidadaoNome?.trim() || '[Nome do Solicitante]';

      const subject = `Requerimento de Acesso à Informação — Lei 12.527/2011 — Gabinete ${politicianName}`;
      const body = `À autoridade competente pelo Serviço de Informação ao Cidadão (SIC) / Ouvidoria
${bodyName}

Com fundamento na Lei nº 12.527, de 18 de novembro de 2011 (Lei de Acesso à Informação) e no Artigo 5º, inciso XXXIII da Constituição da República Federativa do Brasil, venho requerer o fornecimento dos seguintes dados públicos:

DADOS DO MANDATO:
Parlamentar: ${officeLabel} ${politicianName}
Órgão: ${bodyName}

ESPECIFICAÇÃO DO PEDIDO:
Solicito o acesso às informações e aos documentos públicos relativos a:
"${objeto}", referente ao período de ${periodo}.

FUNDAMENTAÇÃO LEGAL:
Ressalto que o Artigo 10 da referida lei garante a qualquer pessoa física ou jurídica o direito de obter informações públicas, sendo prescindível a apresentação de justificativa ou motivação para o pedido.

Aguardo o atendimento desta solicitação no prazo legal de até 20 (vinte) dias, nos termos do Art. 11, § 1º da Lei nº 12.527/2011.

Requerente:
${nome}`;

      return { subject, body };
    },
  },
  {
    id: 'denuncia',
    title: 'Notícia de Irregularidade (MPF / TCU)',
    icon: '🛡️',
    tagline: 'Estrutura formal para comunicar indícios ao Ministério Público ou TCU.',
    description:
      'Utilize este modelo quando tiver levantado elementos com suspeita fundamentada de fraude, notas fiscais inidôneas ou empresas de fachada.',
    defaultSubject: 'Comunicação de Indícios de Irregularidade em Gastos Públicos',
    fields: [
      {
        key: 'resumoFatos',
        label: 'Resumo dos Fatos Constatados',
        placeholder: 'Ex: Constatado pagamento de R$ X para empresa sem capacidade operacional instalada',
        defaultValue: 'Indícios de incompatibilidade em notas fiscais da cota parlamentar',
      },
      {
        key: 'provas',
        label: 'Documentos e Links Anexados',
        placeholder: 'Ex: Link do portal da transparência, NF nº 1234, Consulta CNPJ',
        defaultValue: 'Links das despesas oficiais no portal da transparência',
      },
      {
        key: 'cidadaoNome',
        label: 'Seu Nome (ou opção de anonimato no órgão)',
        placeholder: 'Seu nome ou "Manifestação Cidadã"',
        defaultValue: '',
      },
    ],
    generateText: ({ politicianName, officeLabel, bodyName, customFields }) => {
      const fatos = customFields.resumoFatos || '[Descreva com precisão o que foi identificado]';
      const provas = customFields.provas || '[Relacione as notas, links e números de empenho]';
      const nome = customFields.cidadaoNome?.trim() || 'Cidadão Fiscalizador';

      const subject = `Notícia de Fato / Comunicação de Irregularidade — Gabinete ${politicianName}`;
      const body = `À Sala de Atendimento ao Cidadão / Ouvidoria
Órgão de Fiscalização (MPF / TCU / Ouvidoria)

Assunto: Notícia de fato cívica sobre recursos públicos

Venho, na qualidade de cidadão(ã) exercendo a prerrogativa do controle social, trazer ao conhecimento deste respeitável órgão elementos que demandam apuração quanto à legalidade e legitimidade no emprego de recursos públicos:

1. AGENTE PÚBLICO:
${officeLabel} ${politicianName} (${bodyName})

2. DOS FATOS CONSTATADOS:
${fatos}

3. DAS EVIDÊNCIAS E ELEMENTOS DISPONÍVEIS:
${provas}

4. DO PEDIDO:
Diante do exposto e para resguardo do erário e da moralidade administrativa (Art. 37, caput, da CF/88), solicito que este órgão examine a procedência das informações aqui relatadas, adotando as providências fiscalizatórias ou de inquérito civil que entender cabíveis.

Nestes termos,
${nome}`;

      return { subject, body };
    },
  },
];
