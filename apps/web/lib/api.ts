// Cliente da API NestJS 100% oficial e em tempo real.
// Todos os dados são obtidos diretamente das fontes oficiais do Estado Brasileiro.

import type {
  AuthResponse,
  AssetsResponse,
  Compatibility,
  ExpensesResponse,
  FeedItem,
  NewsArticle,
  Paginated,
  PoliticianDetail,
  PoliticianSummary,
  PoliticianVote,
  PolicyTopic,
  ProposalDetail,
  ProposalSummary,
  StaffResponse,
  User,
  UserPositions,
} from './types';

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000').trim().replace(/\/+$/, '');
export const TOKEN_KEY = 'pt:token';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function getDataMode(): Promise<'api'> {
  return 'api';
}

// ───────── http ─────────

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = `${API_URL}${cleanPath}`;
  const res = await fetch(fullUrl, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = Array.isArray(body.message) ? body.message.join(', ') : (body.message ?? message);
    } catch {
      /* corpo nao-JSON */
    }
    throw new ApiError(res.status, message);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function qs(params: Record<string, string | number | undefined | null>): string {
  const s = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== '') s.set(k, String(v));
  const str = s.toString();
  return str ? `?${str}` : '';
}

const json = (body: unknown): RequestInit => ({ body: JSON.stringify(body) });

// ───────── endpoints 100% oficiais ─────────

export const api = {
  // /auth
  register: (name: string, email: string, password: string) =>
    http<AuthResponse>('/auth/register', { method: 'POST', ...json({ name, email, password }) }),
  login: (email: string, password: string) =>
    http<AuthResponse>('/auth/login', { method: 'POST', ...json({ email, password }) }),
  logout: () =>
    http<void>('/auth/logout', { method: 'POST' }),

  // /users
  me: () => http<User>('/users/me'),

  // /politicians (100% reais do Congresso Nacional)
  listPoliticians: (params: { q?: string; uf?: string; party?: string; office?: string; page?: number; pageSize?: number }) =>
    http<Paginated<PoliticianSummary>>(`/politicians${qs(params)}`),
  listParties: () => http<string[]>('/parties'),
  getPolitician: (id: string) =>
    http<PoliticianDetail>(`/politicians/${id}`),
  getPoliticianVotes: (id: string, year?: number) =>
    http<PoliticianVote[]>(`/politicians/${id}/votes${qs({ year })}`),
  getPoliticianProposals: (id: string, year?: number) =>
    http<ProposalSummary[]>(`/politicians/${id}/proposals${qs({ year })}`),
  getPoliticianExpenses: (id: string, year?: number) =>
    http<ExpensesResponse>(`/politicians/${id}/expenses${qs({ year })}`),
  getPoliticianAssets: (id: string) =>
    http<AssetsResponse>(`/politicians/${id}/assets`),
  getPoliticianStaff: (id: string) =>
    http<StaffResponse>(`/politicians/${id}/staff`),
  getPoliticianNews: (id: string) =>
    http<NewsArticle[]>(`/politicians/${id}/news`),
  getCompatibility: (id: string) =>
    http<Compatibility>(`/politicians/${id}/compatibility`),

  // /proposals
  getProposal: (id: string) =>
    http<ProposalDetail>(`/proposals/${id}`),

  // /policies
  getPolicies: () => http<PolicyTopic[]>('/policies'),
  getMyPolicies: () =>
    http<UserPositions>('/users/me/policies'),
  putMyPolicies: (positions: UserPositions) =>
    http<UserPositions>('/users/me/policies', { method: 'PUT', ...json({ positions }) }),

  // /users/me/following
  getFollowing: () =>
    http<PoliticianSummary[]>('/users/me/following'),
  follow: (politicianId: string) =>
    http<void>('/users/me/following', { method: 'POST', ...json({ politicianId }) }),
  unfollow: (politicianId: string) =>
    http<void>(`/users/me/following/${politicianId}`, { method: 'DELETE' }),

  // feed (timeline oficial de atividade parlamentar em tempo real)
  getFeed: (onlyFollowing: boolean) =>
    http<FeedItem[]>(onlyFollowing ? '/users/me/feed' : '/feed'),
};
