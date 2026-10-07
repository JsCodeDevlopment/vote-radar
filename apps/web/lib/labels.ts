import type {
  ClassificationSource,
  CompatibilityResult,
  DataKind,
  Office,
  PolicyPosition,
  PromiseStatus,
  SourceType,
  TermStatus,
  VoteChoice,
} from './types';

export const OFFICE_LABEL: Record<Office, string> = {
  PRESIDENTE: 'Presidente',
  GOVERNADOR: 'Governador(a)',
  SENADOR: 'Senador(a)',
  DEPUTADO_FEDERAL: 'Deputado(a) Federal',
  DEPUTADO_ESTADUAL: 'Deputado(a) Estadual',
};

export const TERM_STATUS_LABEL: Record<TermStatus, string> = {
  IN_OFFICE: 'Em exercício',
  ON_LEAVE: 'Licenciado(a)',
  ENDED: 'Mandato encerrado',
};

export const VOTE_CHOICE_LABEL: Record<VoteChoice, string> = {
  YES: 'SIM',
  NO: 'NÃO',
  ABSTENTION: 'Abstenção',
  OBSTRUCTION: 'Obstrução',
  ABSENT: 'Ausente',
  OTHER: 'Outro',
};

export const POSITION_LABEL: Record<PolicyPosition, string> = {
  AGREE: 'CONCORDA',
  DISAGREE: 'DISCORDA',
  NEUTRAL: 'NEUTRO',
};

export const CLASSIFIED_BY_LABEL: Record<ClassificationSource, string> = {
  OFFICIAL: 'Tema oficial da fonte',
  RULE: 'Regra automática (palavras-chave)',
  AI: 'Classificação assistida por IA',
  HUMAN: 'Revisão humana',
};

export const SOURCE_TYPE_LABEL: Record<SourceType, string> = {
  OFFICIAL: 'Fonte oficial',
  PRESS: 'Imprensa',
  POLITICIAN: 'Canal do político',
  OTHER: 'Outra fonte',
};

export const COMPAT_LABEL: Record<CompatibilityResult, string> = {
  COMPATIBLE: 'Compatível',
  INCOMPATIBLE: 'Contrária',
  NOT_EVALUABLE: 'Não avaliável',
};

export const DATA_KIND_LABEL: Record<DataKind, string> = {
  OFFICIAL: 'Dado oficial',
  ANALYSIS: 'Análise do sistema',
  USER: 'Opinião do usuário',
  PRESS: 'Notícia de terceiros',
};

export const PROMISE_STATUS_LABEL: Record<PromiseStatus, string> = {
  NOT_STARTED: '🔴 Não iniciado',
  IN_PROGRESS: '🟢 Em andamento',
  PARTIAL: '🟡 Parcialmente cumprido',
  COMPLETED: '🔵 Concluído',
  ABANDONED: '⚫ Arquivado / abandonado',
  UNVERIFIED: '❓ Não foi possível verificar',
};

export function sourceTypeToKind(t: SourceType): DataKind {
  return t === 'OFFICIAL' ? 'OFFICIAL' : 'PRESS';
}

export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];
