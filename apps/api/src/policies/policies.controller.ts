import { Controller, Get } from '@nestjs/common';

export const OFFICIAL_POLICY_TOPICS = [
  {
    id: 't-trib',
    name: 'Tributação',
    description: 'Impostos, contribuições e sistema tributário nacional.',
    policies: [
      { id: 'pol-reducao-impostos', name: 'Redução da carga tributária', description: 'Diminuir o peso total de tributos sobre pessoas e empresas.' },
      { id: 'pol-simplificacao', name: 'Simplificação do sistema tributário', description: 'Unificar tributos (IBS/CBS) e reduzir obrigações acessórias.' },
    ],
  },
  {
    id: 't-eco',
    name: 'Economia',
    description: 'Gasto público, estatais e política fiscal.',
    policies: [
      { id: 'pol-resp-fiscal', name: 'Responsabilidade fiscal', description: 'Limitar o crescimento das despesas e equilibrar as contas públicas.' },
      { id: 'pol-privatizacao', name: 'Privatização de empresas estatais', description: 'Transferir empresas estatais para a iniciativa privada.' },
    ],
  },
  {
    id: 't-saude',
    name: 'Saúde',
    description: 'Sistema Único de Saúde (SUS) e saúde suplementar.',
    policies: [
      { id: 'pol-invest-saude', name: 'Mais investimento público em saúde', description: 'Ampliar o orçamento e eficiência da rede hospitalar do SUS.' },
    ],
  },
  {
    id: 't-edu',
    name: 'Educação',
    description: 'Educação básica, técnica e superior.',
    policies: [
      { id: 'pol-ensino-tecnico', name: 'Expansão do ensino técnico', description: 'Ampliar vagas de ensino técnico e profissionalizante.' },
      { id: 'pol-educacao-basica', name: 'Prioridade à educação básica', description: 'Priorizar recursos para ensino infantil, fundamental e médio.' },
    ],
  },
  {
    id: 't-seg',
    name: 'Segurança pública',
    description: 'Polícias, sistema penal e prevenção.',
    policies: [
      { id: 'pol-efetivo-policial', name: 'Aumento do efetivo policial', description: 'Contratar mais policiais e modernizar equipamentos.' },
      { id: 'pol-penas', name: 'Endurecimento de penas', description: 'Aumentar penas previstas na legislação penal para crimes graves.' },
    ],
  },
  {
    id: 't-amb',
    name: 'Meio ambiente',
    description: 'Clima, florestas e recursos naturais.',
    policies: [
      { id: 'pol-desmatamento', name: 'Metas de redução do desmatamento', description: 'Estabelecer metas obrigatórias de combate ao desmatamento.' },
    ],
  },
  {
    id: 't-trab',
    name: 'Trabalho',
    description: 'Relações de trabalho e emprego.',
    policies: [
      { id: 'pol-flex-trabalhista', name: 'Flexibilização das leis trabalhistas', description: 'Ampliar a liberdade de negociação entre empregadores e trabalhadores.' },
    ],
  },
  {
    id: 't-infra',
    name: 'Infraestrutura',
    description: 'Transporte, saneamento e energia.',
    policies: [
      { id: 'pol-concessoes', name: 'Concessões de infraestrutura à iniciativa privada', description: 'Conceder rodovias, ferrovias e saneamento ao setor privado.' },
    ],
  },
];

@Controller('policies')
export class PoliciesController {
  @Get()
  getPolicies() {
    return OFFICIAL_POLICY_TOPICS;
  }
}
