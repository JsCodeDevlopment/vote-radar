export type Office = 'PRESIDENTE' | 'GOVERNADOR' | 'SENADOR' | 'DEPUTADO_FEDERAL' | 'DEPUTADO_ESTADUAL';
export type TermStatus = 'IN_OFFICE' | 'ON_LEAVE' | 'ENDED';
export type VoteChoice = 'YES' | 'NO' | 'ABSTENTION' | 'OBSTRUCTION' | 'ABSENT' | 'OTHER';
export type PolicyPosition = 'AGREE' | 'DISAGREE' | 'NEUTRAL';
export type ClassificationSource = 'OFFICIAL' | 'RULE' | 'AI' | 'HUMAN';
export type CompatibilityResult = 'COMPATIBLE' | 'INCOMPATIBLE' | 'NOT_EVALUABLE';
export type SourceType = 'OFFICIAL' | 'PRESS' | 'POLITICIAN' | 'OTHER';
export type DataKind = 'OFFICIAL' | 'ANALYSIS' | 'USER' | 'PRESS';

export interface Source {
  id: string;
  type: SourceType;
  name: string;
  publisher?: string | null;
  url: string;
  publishedAt?: string | null;
  retrievedAt: string;
}

export interface PoliticianSummary {
  id: string;
  externalId?: string;
  name: string;
  photoUrl?: string | null;
  party?: string | null;
  uf?: string | null;
  office: Office;
  status: TermStatus;
}

export interface PoliticianDetail extends PoliticianSummary {
  civilName?: string | null;
  email?: string | null;
  birthDate?: string | null;
  bodyName: string;
  termStart?: string | null;
  termEnd?: string | null;
  stats: {
    authoredProposals: number;
    votings: number;
    presence: number | null;
    expensesCents: number;
    staffCount: number;
  };
  recent30d: {
    votings: number;
    proposalsMoved: number;
    newProposals: number;
    expensesCents: number;
  };
  source: Source;
  updatedAt: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProposalRef {
  id: string;
  type: string;
  number: number;
  year: number;
  title?: string | null;
  summary: string;
}

export interface ProposalSummary extends ProposalRef {
  currentStatus?: string | null;
  lastMovementAt?: string | null;
  authors: { id: string; name: string }[];
  topics: string[];
  votingsCount: number;
  source: Source;
}

export interface ProposalStatusEntry {
  id: string;
  sequence: number;
  oldStatus?: string | null;
  newStatus: string;
  description?: string | null;
  changedAt: string;
  source: Source;
}

export interface ProposalDetail extends ProposalSummary {
  history: ProposalStatusEntry[];
  votings: (VotingSummary & {
    tally: Partial<Record<VoteChoice, number>>;
  })[];
  policies: ProposalPolicyLink[];
}


export interface ProposalPolicyLink {
  policyId: string;
  policyName: string;
  topicName: string;
  supportsPolicy: boolean;
  classifiedBy: ClassificationSource;
  confidence?: number | null;
  rationale?: string | null;
}

export interface VotingSummary {
  id: string;
  description?: string | null;
  result?: string | null;
  nominal: boolean;
  votedAt: string;
  source: Source;
}

export interface PoliticianVote {
  id: string;
  choice: VoteChoice;
  rawChoice?: string | null;
  voting: VotingSummary;
  proposal?: ProposalRef | null;
  policies: ProposalPolicyLink[];
  source: Source;
}

export interface Expense {
  id: string;
  category: string;
  supplier?: string | null;
  amountCents: number;
  date: string;
  documentUrl?: string | null;
  source: Source;
}

export interface ExpensesResponse {
  year: number;
  availableYears: number[];
  totalCents: number;
  byCategory: { category: string; totalCents: number }[];
  byMonth: { month: number; totalCents: number }[];
  items: Expense[];
  source: Source;
  electoralSummary?: {
    year: number;
    totalCents: number;
    itemCount: number;
  };
}

export interface PoliticianAsset {
  id: string;
  order: number;
  type: string;
  description: string;
  amountCents: number;
  updatedAt?: string | null;
  source: Source;
}

export interface AssetsResponse {
  totalCents: number;
  byType: { type: string; totalCents: number; count: number }[];
  items: PoliticianAsset[];
  electionYear: number;
  source: Source;
}

export interface StaffResponse {
  total: number;
  byRole: { role: string; count: number }[];
  source: Source;
}

export interface NewsArticle {
  id: string;
  title: string;
  description?: string | null;
  url: string;
  imageUrl?: string | null;
  author?: string | null;
  sourceName: string;
  sourceUrl?: string | null;
  sourceType: SourceType;
  publishedAt: string;
  politicianId?: string | null;
}

export interface CompatibilityItem {
  votingId: string;
  votedAt: string;
  proposal?: ProposalRef | null;
  policyId: string;
  policyName: string;
  topicName: string;
  userPosition: PolicyPosition;
  choice: VoteChoice;
  supportsPolicy: boolean;
  result: CompatibilityResult;
  reason: string;
  classifiedBy: ClassificationSource;
  confidence?: number | null;
  rationale?: string | null;
  source: Source;
}

export interface Compatibility {
  politicianId: string;
  compatible: number;
  incompatible: number;
  notEvaluable: number;
  score: number | null;
  items: CompatibilityItem[];
}

export interface FeedItem {
  id: string;
  type: 'VOTE' | 'EXPENSE' | 'PROPOSAL' | 'NEWS';
  kind: DataKind;
  date: string;
  politician: PoliticianSummary;
  title: string;
  description?: string | null;
  href?: string | null;
  source?: Source | null;
  externalUrl?: string | null;
}
