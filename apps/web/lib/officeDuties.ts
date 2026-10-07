import type { Office } from './types';

export interface OfficeDutyItem {
  icon: string;
  title: string;
  description: string;
}

export interface LegalBasis {
  article: string;
  description: string;
  url?: string;
}

export interface CitizenChecklistItem {
  action: string;
  howToEvaluate: string;
}

export interface OfficeDutiesData {
  office: Office;
  title: string;
  feminineTitle: string;
  branch: 'Executivo' | 'Legislativo';
  sphere: 'Federal' | 'Estadual';
  bodyName: string;
  mandateYears: number;
  electoralSystem: string;
  representedEntity: string;
  shortSummary: string;
  tagline: string;
  accentColor: string;
  accentSoft: string;
  badgeEmoji: string;

  whatItDoes: OfficeDutyItem[];
  whatItShouldDo: OfficeDutyItem[];
  whatItDoesNotDo: OfficeDutyItem[];
  legalBasis: LegalBasis[];
  citizenChecklist: CitizenChecklistItem[];
  frequentlyAskedQuestions: { question: string; answer: string }[];
}

export const OFFICE_DUTIES: Record<Office, OfficeDutiesData> = {
  PRESIDENTE: {
    office: 'PRESIDENTE',
    title: 'Presidente da República',
    feminineTitle: 'Presidenta da República',
    branch: 'Executivo',
    sphere: 'Federal',
    bodyName: 'Presidência da República (Palácio do Planalto)',
    mandateYears: 4,
    electoralSystem: 'Majoritário (maioria absoluta de votos com 2º turno se necessário)',
    representedEntity: 'A Nação inteira e a soberania da República Federativa do Brasil',
    shortSummary:
      'É o Chefe de Estado e de Governo do Brasil. Administra a máquina pública federal, executa o orçamento da União, conduz políticas públicas nacionais e representa o país internacionalmente.',
    tagline: 'Comanda a administração pública federal e implementa as diretrizes do país.',
    accentColor: 'oklch(0.72 0.12 200)',
    accentSoft: 'rgba(56, 189, 248, 0.12)',
    badgeEmoji: '🇧🇷',

    whatItDoes: [
      {
        icon: '🏛️',
        title: 'Chefia de Estado e de Governo',
        description:
          'Dirige a administração federal, define prioridades nacionais, expede decretos e regulamentos para fiel execução das leis e comanda as Forças Armadas.',
      },
      {
        icon: '📊',
        title: 'Execução do Orçamento e Políticas Nacionais',
        description:
          'Elabora os projetos de lei orçamentária (PPA, LDO e LOA) e executa os recursos públicos em saúde (SUS), educação básica e superior (MEC), segurança nacional, transportes e assistência social.',
      },
      {
        icon: '✍️',
        title: 'Sanção e Veto de Leis',
        description:
          'Analisa os projetos aprovados pelo Congresso Nacional, podendo sancioná-los (convertendo em lei) ou vetá-los total ou parcialmente por inconstitucionalidade ou contrariedade ao interesse público.',
      },
      {
        icon: '⚡',
        title: 'Edição de Medidas Provisórias (MPs)',
        description:
          'Em casos excepcionais de relevância e urgência, edita Medidas Provisórias com força imediata de lei, que devem ser apreciadas e votadas pelo Congresso em até 120 dias.',
      },
      {
        icon: '🌐',
        title: 'Relações Exteriores e Defesa da Soberania',
        description:
          'Representa o Brasil no exterior, mantém relações com Estados estrangeiros, celebra tratados, convenções e atos internacionais (sujeitos a referendo do Congresso).',
      },
      {
        icon: '⚖️',
        title: 'Nomeação de Autoridades de Estado',
        description:
          'Indica ministros do Supremo Tribunal Federal (STF), tribunais superiores, Procurador-Geral da República (PGR), diretores do Banco Central e embaixadores — todos dependendo da sabatina e aprovação do Senado Federal.',
      },
    ],

    whatItShouldDo: [
      {
        icon: '🛡️',
        title: 'Zelo Republicano e Responsabilidade Fiscal',
        description:
          'Equilibrar as contas públicas com responsabilidade, respeitando o teto de gastos e a Lei de Responsabilidade Fiscal, evitando o endividamento desmedido que gera inflação e empobrecimento.',
      },
      {
        icon: '🤝',
        title: 'Respeito à Independência e Harmonia dos Poderes',
        description:
          'Governar dialogando democraticamente com o Congresso Nacional e respeitando as decisões do Poder Judiciário, sem atritos institucionais ou tentativas de interferência.',
      },
      {
        icon: '🔍',
        title: 'Transparência Ativa e Combate à Corrupção',
        description:
          'Garantir autonomia aos órgãos de controle (Controladoria-Geral da União, Polícia Federal, Ministério Público) e manter total clareza na aplicação do dinheiro dos impostos.',
      },
      {
        icon: '🇧🇷',
        title: 'Governar para Toda a População sem Revanchismo',
        description:
          'Atuar como presidente de todos os brasileiros, superando divisões eleitorais para focar no desenvolvimento sustentável, na redução das desigualdades e no bem-estar de todas as regiões.',
      },
    ],

    whatItDoesNotDo: [
      {
        icon: '🚫',
        title: 'NÃO cria leis ou impostos por vontade própria',
        description:
          'O Presidente não tem poder absolutista. Toda nova lei ou imposto precisa obrigatoriamente de discussão e aprovação pelo Congresso Nacional.',
      },
      {
        icon: '🚫',
        title: 'NÃO anula decisões judiciais nem absolve processos comuns',
        description:
          'O Presidente não interfere nas decisões de juízes e tribunais, preservando o Estado de Direito e a separação dos Poderes.',
      },
      {
        icon: '🚫',
        title: 'NÃO comanda prefeituras ou governos estaduais',
        description:
          'Estados e municípios possuem autonomia constitucional. O Presidente não pode determinar asfaltamento de rua de bairro ou regras de impostos municipais (como IPTU/ISS).',
      },
    ],

    legalBasis: [
      {
        article: 'Artigo 84 da CF/88',
        description: 'Define as competências privativas do Presidente da República.',
        url: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm#art84',
      },
      {
        article: 'Artigo 85 da CF/88',
        description: 'Define os atos do Presidente que configuram crime de responsabilidade.',
        url: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm#art85',
      },
      {
        article: 'Artigo 76 a 83 da CF/88',
        description: 'Estrutura o Poder Executivo, condições de posse e substituição.',
        url: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm#art76',
      },
    ],

    citizenChecklist: [
      {
        action: 'Cobrar cumprimento do Plano de Governo',
        howToEvaluate: 'Verifique se as promessas registradas no TSE estão avançando em projetos concretos ou se foram abandonadas.',
      },
      {
        action: 'Monitorar a Responsabilidade Fiscal',
        howToEvaluate: 'Acompanhe os índices de dívida pública, metas de déficit fiscal primário e os relatórios do Tribunal de Contas da União.',
      },
      {
        action: 'Fiscalizar nomeações para órgãos técnicos',
        howToEvaluate: 'Observe se as indicações para agências reguladoras e ministérios priorizam qualificação técnica ou puro loteamento político.',
      },
    ],

    frequentlyAskedQuestions: [
      {
        question: 'O Presidente pode governar apenas por decreto ou Medida Provisória?',
        answer:
          'Não. Decretos servem apenas para regulamentar leis existentes, e Medidas Provisórias têm validade máxima de 120 dias, precisando de aprovação do Congresso para virarem leis definitivas.',
      },
      {
        question: 'O que acontece se o Presidente cometer crime de responsabilidade?',
        answer:
          'A Câmara dos Deputados analisa e precisa aprovar por 2/3 dos votos a abertura do processo, e o Senado Federal realiza o julgamento formal do impeachment.',
      },
    ],
  },

  GOVERNADOR: {
    office: 'GOVERNADOR',
    title: 'Governador(a) de Estado',
    feminineTitle: 'Governadora de Estado',
    branch: 'Executivo',
    sphere: 'Estadual',
    bodyName: 'Governo do Estado (Palácio de Governo)',
    mandateYears: 4,
    electoralSystem: 'Majoritário (maioria absoluta de votos com 2º turno se necessário)',
    representedEntity: 'A população e o território da respectiva Unidade Federativa',
    shortSummary:
      'É o chefe do Poder Executivo estadual. Administra as finanças e serviços públicos do Estado, comanda as Polícias Militar e Civil, a rede estadual de ensino médio, os hospitais regionais do SUS e a infraestrutura rodoviária estadual.',
    tagline: 'Comanda a administração pública estadual, a segurança pública e os serviços regionais.',
    accentColor: 'oklch(0.68 0.14 150)',
    accentSoft: 'rgba(34, 197, 94, 0.12)',
    badgeEmoji: '🏛️',

    whatItDoes: [
      {
        icon: '👮',
        title: 'Comandar as Forças de Segurança Pública Estadual',
        description:
          'É a autoridade máxima sobre a Polícia Militar (policiamento ostensivo e ordem pública), Polícia Civil (investigação judiciária e perícias), Corpo de Bombeiros e Polícia Penal do Estado.',
      },
      {
        icon: '🏥',
        title: 'Administrar a Rede Hospitalar e Especializada do SUS',
        description:
          'Gere hospitais estaduais de grande porte, prontos-socorros regionais, centros de tratamento oncológico e laboratórios de saúde pública (LACEN), além de regular a fila estadual de leitos.',
      },
      {
        icon: '🎓',
        title: 'Gerir a Educação Básica (Ensino Médio) e Técnica',
        description:
          'Responsável constitucional pela oferta do ensino médio público, centros de educação profissionalizante e, quando existentes, universidades estaduais públicas.',
      },
      {
        icon: '💰',
        title: 'Arrecadar Tributos Estaduais e Executar o Orçamento',
        description:
          'Administra a cobrança do ICMS (imposto sobre circulação de mercadorias), IPVA e ITCMD, executando as despesas públicas autorizadas pela Assembleia Legislativa.',
      },
      {
        icon: '🛣️',
        title: 'Construir e Manter Rodovias Estaduais e Transportes',
        description:
          'Planeja concessões, pavimentação e manutenção da malha rodoviária estadual (através do DER estadual), além de sistemas metropolitanos de transporte público (metrô, trens e ônibus intermunicipais).',
      },
    ],

    whatItShouldDo: [
      {
        icon: '🛡️',
        title: 'Reduzir a Violência e Humanizar o Sistema Prisional',
        description:
          'Implementar políticas de segurança baseadas em inteligência, tecnologia de investigação e combate ao crime organizado, garantindo controle ético e vagas adequadas no sistema penitenciário.',
      },
      {
        icon: '⏱️',
        title: 'Zerar Filas de Cirurgias e Exames Especializados',
        description:
          'Equipar hospitais regionais no interior do Estado para evitar deslocamentos desgastantes de pacientes e garantir fornecimento pontual de medicamentos de alto custo.',
      },
      {
        icon: '📊',
        title: 'Garantir Equilíbrio Fiscal e Transparência em Renúncias',
        description:
          'Manter os gastos com pessoal dentro dos limites da Lei de Responsabilidade Fiscal (LRF) e dar transparência pública aos incentivos fiscais concedidos a empresas privadas.',
      },
      {
        icon: '👩‍🏫',
        title: 'Valorizar Professores, Policiais e Profissionais de Saúde',
        description:
          'Cumprir o piso salarial nacional dos professores, investir em capacitação contínua e realizar concursos públicos regulares para evitar déficit crônico de servidores efetivos.',
      },
    ],

    whatItDoesNotDo: [
      {
        icon: '⛔',
        title: 'Não cria leis de forma autônoma sem o Legislativo',
        description:
          'O Governador pode propor projetos de lei, mas compete exclusivamente à Assembleia Legislativa discutir, emendar e aprovar ou rejeitar os projetos.',
      },
      {
        icon: '⛔',
        title: 'Não administra serviços e tributos exclusivamente municipais',
        description:
          'Não é responsável por creches, postos de saúde de atenção básica (UBS), transporte coletivo urbano municipal, IPTU ou coleta de lixo domiciliar (atribuições do Prefeito).',
      },
      {
        icon: '⛔',
        title: 'Não interfere em decisões judiciais ou no Ministério Público',
        description:
          'O Tribunal de Justiça do Estado e o Ministério Público Estadual (MPE) são instituições autônomas e independentes do Poder Executivo estadual.',
      },
    ],

    legalBasis: [
      {
        article: 'Art. 28 da Constituição Federal de 1988',
        description: 'Fixa a eleição do Governador e do Vice-Governador pelo sistema majoritário para mandato de 4 anos.',
      },
      {
        article: 'Art. 25 a 27 da Constituição Federal',
        description: 'Define a autonomia dos Estados-membros e as competências reservadas ao Poder Executivo estadual.',
      },
      {
        article: 'Art. 144 da Constituição Federal',
        description: 'Estabelece a subordinação das Polícias Militar e Civil e dos Corpos de Bombeiros aos Governadores de Estado.',
      },
    ],

    citizenChecklist: [
      {
        action: 'Acompanhar os Indicadores de Segurança Pública',
        howToEvaluate: 'Consulte os dados oficiais de criminalidade e letalidade divulgados pelas secretarias estaduais e pelo Fórum Brasileiro de Segurança Pública.',
      },
      {
        action: 'Fiscalizar a Prestação de Contas no Tribunal de Contas (TCE)',
        howToEvaluate: 'Verifique se as contas do governo estadual foram aprovadas com ou sem ressalvas pelo Tribunal de Contas do respectivo Estado.',
      },
      {
        action: 'Monitorar Filas do SUS e Qualidade das Escolas Estaduais',
        howToEvaluate: 'Verifique o tempo médio de espera no sistema estadual de regulação de consultas e os índices do IDEB no ensino médio estadual.',
      },
    ],

    frequentlyAskedQuestions: [
      {
        question: 'Qual a diferença fundamental entre Governador e Prefeito?',
        answer:
          'O Prefeito cuida da cidade (creches, postos de saúde de bairro, asfalto, IPTU, trânsito urbano). O Governador cuida do Estado inteiro (polícias civil e militar, hospitais de alta complexidade, ensino médio e rodovias estaduais).',
      },
      {
        question: 'Quem fiscaliza as ações e os gastos do Governador?',
        answer:
          'A Assembleia Legislativa do Estado (deputados estaduais) fiscaliza o Governador com o auxílio técnico do Tribunal de Contas do Estado (TCE) e do Ministério Público Estadual (MPE).',
      },
      {
        question: 'O Governador pode ser alvo de impeachment?',
        answer:
          'Sim. Se cometer crime de responsabilidade, o Governador pode ser julgado por um tribunal misto composto por deputados estaduais e desembargadores do Tribunal de Justiça.',
      },
    ],
  },

  SENADOR: {
    office: 'SENADOR',
    title: 'Senador(a) da República',
    feminineTitle: 'Senadora da República',
    branch: 'Legislativo',
    sphere: 'Federal',
    bodyName: 'Senado Federal (Congresso Nacional)',
    mandateYears: 8,
    electoralSystem: 'Majoritário (3 senadores por unidade federativa, eleitos em alternância de 1 e 2 vagas a cada 4 anos)',
    representedEntity: 'Os 26 Estados brasileiros e o Distrito Federal em igualdade paritária de peso político',
    shortSummary:
      'Representa o seu Estado no Congresso Nacional com peso paritário (3 senadores por UF). Cria e vota leis federais, sabatina e aprova altos cargos da República (ministros do STF, PGR, Banco Central) e fiscaliza a dívida pública.',
    tagline: 'Guarda o equilíbrio federativo entre os Estados e fiscaliza as autoridades supremas.',
    accentColor: 'oklch(0.72 0.13 250)',
    accentSoft: 'rgba(99, 102, 241, 0.12)',
    badgeEmoji: '⚖️',

    whatItDoes: [
      {
        icon: '⚖️',
        title: 'Garantir Equilíbrio Federativo Paritário',
        description:
          'Cada Estado da Federação e o Distrito Federal possui exatamente 3 senadores, garantindo que estados com menor população tenham a mesma representação política no Senado que os estados mais populosos.',
      },
      {
        icon: '📜',
        title: 'Criar, Modificar e Votar Leis Nacionais',
        description:
          'Apresenta e vota Projetos de Lei e Propostas de Emenda à Constituição (PECs), atuando também como câmara revisora das matérias aprovadas pela Câmara dos Deputados.',
      },
      {
        icon: '🎓',
        title: 'Sabatinar e Aprovar Altas Autoridades',
        description:
          'Competência privativa e crucial: sabatina e aprova por voto secreto os indicados pelo Presidente para o STF, tribunais superiores, Procuradoria-Geral da República, diretoria do Banco Central e embaixadores.',
      },
      {
        icon: '🏛️',
        title: 'Julgar Crimes de Responsabilidade (Impeachment)',
        description:
          'Processa e julga por crime de responsabilidade o Presidente da República, ministros de Estado, ministros do STF e o Procurador-Geral da República.',
      },
      {
        icon: '💰',
        title: 'Regulação da Dívida Pública e Crédito Externo',
        description:
          'Fixa limites globais para a dívida consolidada da União, dos Estados, do DF e dos Municípios, e autoriza operações de crédito externo contratadas por qualquer ente da federação.',
      },
      {
        icon: '🔎',
        title: 'Fiscalização e Comissões Parlamentares de Inquérito',
        description:
          'Fiscaliza os atos do Poder Executivo, convoca ministros para prestar informações e instala CPIs do Senado ou CPIs Mistas (CPMI) para investigar irregularidades.',
      },
    ],

    whatItShouldDo: [
      {
        icon: '🏛️',
        title: 'Atuação como Câmara Alta com Visão Estratégica',
        description:
          'Aproveitar o mandato de 8 anos para planejar o desenvolvimento nacional e regional a longo prazo, com serenidade e ponderação, acima das paixões eleitorais momentâneas.',
      },
      {
        icon: '🔍',
        title: 'Rigor e Independência nas Sabatinas',
        description:
          'Sabatina minuciosa de candidatos ao STF e órgãos de controle, avaliando notório saber jurídico e reputação ilibada, sem aprovações meramente protocolares ou por barganha.',
      },
      {
        icon: '🛡️',
        title: 'Defesa Equilibrada do Pacto Federativo',
        description:
          'Zelar pela justa distribuição de receitas tributárias (como o Fundo de Participação dos Estados - FPE) e pela autonomia dos estados contra a centralização em Brasília.',
      },
      {
        icon: '💡',
        title: 'Sobriedade com Gastos Públicos de Gabinete',
        description:
          'Prestar contas de cada assessor contratado e gastos de cota parlamentar, mantendo estrutura enxuta e transparente.',
      },
    ],

    whatItDoesNotDo: [
      {
        icon: '🚫',
        title: 'NÃO executa obras ou serviços públicos diretamente',
        description:
          'Senador não constrói estradas, hospitais nem administra postos de saúde. Pode apenas alocar emendas no orçamento federal para que órgãos executores realizem.',
      },
      {
        icon: '🚫',
        title: 'NÃO decide leis municipais ou estaduais exclusivas',
        description:
          'O Senado vota leis de amplitude federal e constitucional; assuntos internos do seu estado ou município cabem aos deputados estaduais e vereadores.',
      },
    ],

    legalBasis: [
      {
        article: 'Artigo 46 da CF/88',
        description: 'Composição do Senado Federal e mandato dos senadores.',
        url: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm#art46',
      },
      {
        article: 'Artigo 52 da CF/88',
        description: 'Competências privativas do Senado Federal (sabatinas, julgamentos e limites da dívida).',
        url: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm#art52',
      },
    ],

    citizenChecklist: [
      {
        action: 'Conferir como votou nas Sabatinas de ministros do STF e PGR',
        howToEvaluate: 'Verifique se o senador fez perguntas de mérito técnico ou se votou com base em alinhamento político passageiro.',
      },
      {
        action: 'Verificar assiduidade no Plenário e Comissões',
        howToEvaluate: 'Acompanhe a frequência nas sessões e comissões temáticas como a CCJ (Constituição e Justiça) e CAE (Assuntos Econômicos).',
      },
      {
        action: 'Acompanhar a destinação das Emendas Parlamentares',
        howToEvaluate: 'Consulte os municípios do seu Estado beneficiados e se as obras indicadas foram efetivamente concluídas.',
      },
    ],

    frequentlyAskedQuestions: [
      {
        question: 'Por que o mandato do Senador dura 8 anos?',
        answer:
          'Para garantir estabilidade institucional e visão de longo prazo nas decisões do país, com renovação intercalada a cada 4 anos (uma vez renova 1/3, na eleição seguinte renova 2/3 das cadeiras).',
      },
      {
        question: 'Quem substitui o Senador se ele se afastar?',
        answer:
          'Cada senador é eleito em chapa com dois suplentes registrados previamente na urna, que assumem no caso de licença, falecimento ou renúncia.',
      },
    ],
  },

  DEPUTADO_FEDERAL: {
    office: 'DEPUTADO_FEDERAL',
    title: 'Deputado(a) Federal',
    feminineTitle: 'Deputada Federal',
    branch: 'Legislativo',
    sphere: 'Federal',
    bodyName: 'Câmara dos Deputados (Congresso Nacional)',
    mandateYears: 4,
    electoralSystem: 'Proporcional com quociente eleitoral (número de vagas varia de 8 a 70 conforme a população do estado)',
    representedEntity: 'O povo brasileiro de cada Estado e do Distrito Federal',
    shortSummary:
      'Representa diretamente a população na Câmara dos Deputados. Cria e vota leis nacionais, discute e aprova o Orçamento da União, fiscaliza o Poder Executivo com o TCU e autoriza processos de impeachment contra o Presidente.',
    tagline: 'Voz direta dos cidadãos na elaboração das leis nacionais e controle do orçamento.',
    accentColor: 'oklch(0.75 0.14 145)',
    accentSoft: 'rgba(52, 211, 153, 0.12)',
    badgeEmoji: '🏛️',

    whatItDoes: [
      {
        icon: '👥',
        title: 'Representação Popular Direta',
        description:
          'Compõe a bancada de seu estado (mínimo de 8 e máximo de 70 parlamentares conforme o tamanho populacional), levando as demandas dos cidadãos de sua região ao centro das decisões federais em Brasília.',
      },
      {
        icon: '📄',
        title: 'Proposição e Votação de Leis de Âmbito Nacional',
        description:
          'Cria Projetos de Lei Ordinária (PL), Leis Complementares (PLP) e Propostas de Emenda Constitucional (PEC) sobre temas essenciais: Código Penal, Direito Civil, Direito do Trabalho, tributos federais e previdência.',
      },
      {
        icon: '💵',
        title: 'Aprovação do Orçamento e Emendas Parlamentares',
        description:
          'Analisa e vota o Plano Plurianual (PPA), a Lei de Diretrizes Orçamentárias (LDO) e a Lei Orçamentária Anual (LOA), destinando emendas individuais e de bancada para financiar hospitais, escolas e infraestrutura nos municípios.',
      },
      {
        icon: '🔎',
        title: 'Fiscalização e Controle dos Atos do Executivo',
        description:
          'Acompanha a aplicação das verbas federais com auxílio técnico do Tribunal de Contas da União (TCU), convoca ministros de Estado para prestar contas e pode instaurar CPIs para apurar irregularidades graves.',
      },
      {
        icon: '⚖️',
        title: 'Autorização de Processo de Impeachment',
        description:
          'Competência exclusiva: é quem delibera, por votação de no mínimo dois terços dos deputados (342 votos), se autoriza a instauração de processo por crime de responsabilidade contra o Presidente da República.',
      },
    ],

    whatItShouldDo: [
      {
        icon: '🎯',
        title: 'Priorizar o Interesse Coletivo sobre Interesses Partidários',
        description:
          'Votar projetos avaliando o benefício para toda a sociedade brasileira, sem se curvar a interesses fisiológicos, corporativistas ou trocas de votos por cargos.',
      },
      {
        icon: '💡',
        title: 'Transparência Absoluta na Destinação de Emendas',
        description:
          'Tornar 100% público para quais cidades, entidades e obras foram indicados os recursos das emendas parlamentares, sem uso do orçamento para compra de apoio político.',
      },
      {
        icon: '📋',
        title: 'Assiduidade nas Sessões e Comissões Temáticas',
        description:
          'Comparecer rigorosamente às votações no plenário e aos debates nas comissões técnicas (onde as leis são verdadeiramente moldadas e aperfeiçoadas).',
      },
      {
        icon: '📉',
        title: 'Economia com Cotas e Verba de Gabinete',
        description:
          'Gastar apenas o estritamente necessário da Cota para o Exercício da Atividade Parlamentar (CEAP) e nomear assessores por mérito e capacitação técnica, jamais por nepotismo ou cabide de empregos.',
      },
    ],

    whatItDoesNotDo: [
      {
        icon: '🚫',
        title: 'NÃO executa obras diretamente',
        description:
          'Deputado não asfalta ruas, não constrói postos de saúde nem compra ambulâncias por conta própria. Ele aloca verba orçamentária via emenda; quem licita e executa a obra é a prefeitura, governo estadual ou ministério.',
      },
      {
        icon: '🚫',
        title: 'NÃO legisla sobre regras municipais ou impostos locais',
        description:
          'Não tem poder para mexer em taxas municipais, zoneamento urbano, IPTU ou leis da Câmara de Vereadores da sua cidade.',
      },
      {
        icon: '🚫',
        title: 'NÃO comanda polícias ou serviços de trânsito',
        description:
          'A gestão diária de policiamento e segurança é do governo estadual (Polícia Militar e Civil) ou municipal (Guarda Municipal).',
      },
    ],

    legalBasis: [
      {
        article: 'Artigo 45 da CF/88',
        description: 'Representação popular proporcional e número de deputados por estado.',
        url: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm#art45',
      },
      {
        article: 'Artigo 48 da CF/88',
        description: 'Matérias de competência do Congresso Nacional com sanção presidencial.',
        url: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm#art48',
      },
      {
        article: 'Artigo 51 da CF/88',
        description: 'Competências privativas da Câmara dos Deputados.',
        url: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm#art51',
      },
    ],

    citizenChecklist: [
      {
        action: 'Verificar a assiduidade e presença em votações',
        howToEvaluate: 'Consulte o percentual de presenças nominais registradas no portal e se as faltas foram justificadas com atestado.',
      },
      {
        action: 'Auditar gastos da Cota Parlamentar (CEAP)',
        howToEvaluate: 'Confira as notas fiscais declaradas pelo deputado com combustíveis, passagens aéreas e consultorias no portal da transparência.',
      },
      {
        action: 'Checar coerência das votações com o que defendeu na campanha',
        howToEvaluate: 'Compare as propostas e discursos do candidato com os votos nominais registrados em matérias cruciais.',
      },
    ],

    frequentlyAskedQuestions: [
      {
        question: 'O que é quociente eleitoral e por que um candidato com muitos votos pode não ser eleito?',
        answer:
          'As eleições para deputado seguem o sistema proporcional: as vagas pertencem primeiro aos partidos que alcançam o quociente eleitoral (total de votos válidos dividido pelo número de vagas). Depois, preenchem-se as cadeiras com os mais votados de cada partido.',
      },
      {
        question: 'Qual é a diferença entre Deputado Federal e Deputado Estadual?',
        answer:
          'O Deputado Federal atua em Brasília na Câmara dos Deputados criando leis para o país inteiro e votando o orçamento da União. O Deputado Estadual atua na Assembleia Legislativa do Estado criando leis estaduais e fiscalizando o Governador.',
      },
    ],
  },

  DEPUTADO_ESTADUAL: {
    office: 'DEPUTADO_ESTADUAL',
    title: 'Deputado(a) Estadual',
    feminineTitle: 'Deputada Estadual',
    branch: 'Legislativo',
    sphere: 'Estadual',
    bodyName: 'Assembleia Legislativa Estadual (AL)',
    mandateYears: 4,
    electoralSystem: 'Proporcional (número de vagas corresponde ao triplo de deputados federais até 36, mais os excedentes)',
    representedEntity: 'A população do respectivo Estado federado',
    shortSummary:
      'Representa a população do seu Estado na Assembleia Legislativa. Cria e vota leis estaduais (ICMS, IPVA, segurança e educação pública estadual), aprova o orçamento do Estado e fiscaliza os atos e gastos do Governador.',
    tagline: 'Legisla no âmbito estadual e fiscaliza o uso do dinheiro público pelo Governo do Estado.',
    accentColor: 'oklch(0.74 0.14 50)',
    accentSoft: 'rgba(251, 146, 60, 0.12)',
    badgeEmoji: '🏙️',

    whatItDoes: [
      {
        icon: '🏛️',
        title: 'Legislar no Âmbito Estadual',
        description:
          'Apresenta e vota projetos de lei sobre competências do Estado: regras sobre tributos estaduais (ICMS, IPVA, ITCMD), segurança pública (Polícia Civil e Militar), sistema penitenciário, universidades estaduais e transporte intermunicipal.',
      },
      {
        icon: '📊',
        title: 'Votar o Orçamento do Estado e Destinar Emendas',
        description:
          'Discute, altera e aprova o orçamento anual estadual enviado pelo Governador e aloca emendas orçamentárias estaduais para reformas de escolas estaduais, hospitais regionais e convênios municipais.',
      },
      {
        icon: '🔎',
        title: 'Fiscalizar o Poder Executivo Estadual',
        description:
          'Fiscaliza os contratos, licitações e atos do Governador e secretarias de Estado, com o auxílio do Tribunal de Contas do Estado (TCE).',
      },
      {
        icon: '🚨',
        title: 'Instaurar CPIs e Processar Crimes de Responsabilidade',
        description:
          'Pode criar Comissões Parlamentares de Inquérito (CPIs) estaduais para apurar corrupção na administração estadual e julgar o Governador em caso de crime de responsabilidade política.',
      },
      {
        icon: '📜',
        title: 'Emendar a Constituição Estadual',
        description:
          'Aprova emendas à Carta Magna do Estado, respeitados os princípios fundamentais da Constituição Federal de 1988.',
      },
    ],

    whatItShouldDo: [
      {
        icon: '🛡️',
        title: 'Focar nas Verdadeiras Competências do Estado',
        description:
          'Concentrar esforços em áreas que realmente mudam o dia a dia da população estadual: modernização das polícias, melhoria do ensino médio estadual, saneamento regional e infraestrutura rodoviária do estado.',
      },
      {
        icon: '🔍',
        title: 'Independência Real na Fiscalização do Governador',
        description:
          'Exercer fiscalização autônoma e corajosa, sem agir como simples "chancela" cega dos projetos do Palácio do Governo nem transformar a oposição em mera disputa partidária.',
      },
      {
        icon: '💰',
        title: 'Moderação e Transparência com Verbas Indenizatórias',
        description:
          'Controlar com rigor o uso da verba indenizatória estadual, diárias e contratação de servidores comissionados, evitando desvios ou apadrinhamentos políticos.',
      },
      {
        icon: '🤝',
        title: 'Ouvir e Atender Todas as Regiões do Interior e Capital',
        description:
          'Garantir que as políticas públicas estaduais cheguem também aos municípios menores do interior, historicamente desassistidos pelo poder central do Estado.',
      },
    ],

    whatItDoesNotDo: [
      {
        icon: '🚫',
        title: 'NÃO legisla sobre Direito Penal, do Trabalho ou Moeda',
        description:
          'O Deputado Estadual não pode alterar o Código Penal para aumentar penas de crimes nem mudar leis trabalhistas ou aposentadoria geral (são competências exclusivas do Congresso Nacional).',
      },
      {
        icon: '🚫',
        title: 'NÃO resolve problemas municipais de prefeitura',
        description:
          'Não é dever do deputado estadual tapar buracos de ruas de bairro, trocar lâmpadas de postes ou recolher lixo — essas são funções privativas do Prefeito e da Câmara de Vereadores.',
      },
      {
        icon: '🚫',
        title: 'NÃO executa obras diretamente',
        description:
          'O parlamentar pode sugerir ou destinar emendas, mas toda licitação, contratação e execução é atribuição das secretarias do Governo Estadual.',
      },
    ],

    legalBasis: [
      {
        article: 'Artigo 27 da CF/88',
        description: 'Composição, subsídios e regras das Assembleias Legislativas estaduais.',
        url: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm#art27',
      },
      {
        article: 'Artigo 25 da CF/88',
        description: 'Autonomia dos Estados e competências legislativas remanescentes.',
        url: 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm#art25',
      },
    ],

    citizenChecklist: [
      {
        action: 'Verificar a presença nas sessões da Assembleia Legislativa',
        howToEvaluate: 'Consulte a lista de presença nominal no portal da ALESP, ALMG, ALERJ ou da Assembleia do seu Estado.',
      },
      {
        action: 'Auditar a prestação de contas da verba indenizatória',
        howToEvaluate: 'Examine os recibos de combustível, divulgação de mandato e aluguel de imóveis pagos com dinheiro público.',
      },
      {
        action: 'Checar projetos aprovados e relevância pública',
        howToEvaluate: 'Verifique se o deputado propõe leis de relevância real ou apenas projetos simbólicos (como homenagens ou nomes de rodovias).',
      },
    ],

    frequentlyAskedQuestions: [
      {
        question: 'Quantos deputados estaduais tem cada estado?',
        answer:
          'A Constituição Federal define que o número é igual ao triplo dos deputados federais até atingir 36. Atingindo esse número, adiciona-se o mesmo número de federais que exceder 12 (exemplo: SP tem 70 deputados federais, logo tem 94 deputados estaduais na ALESP).',
      },
      {
        question: 'O deputado estadual pode investigar o governador?',
        answer:
          'Sim. A Assembleia Legislativa pode convocar secretários estaduais para prestar esclarecimentos, abrir CPIs com poder de investigação próprio de autoridades judiciais e receber denúncias de crime de responsabilidade.',
      },
    ],
  },
};
