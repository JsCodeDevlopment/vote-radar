import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RealDataService } from '../politicians/real-data.service';
import type { PoliticianSummary } from '../politicians/politicians.types';

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  following: Set<string>;
  policies: Record<string, 'AGREE' | 'DISAGREE' | 'NEUTRAL'>;
}

@Injectable()
export class UsersService {
  private users = new Map<string, UserEntity>();
  private tokens = new Map<string, string>(); // token -> userId

  constructor(private readonly dataService: RealDataService) {}

  createUser(name: string, email: string, passwordHash: string): { user: { id: string; name: string; email: string }; accessToken: string } {
    const existing = Array.from(this.users.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new UnauthorizedException('E-mail já cadastrado.');
    }

    const id = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const user: UserEntity = {
      id,
      name,
      email,
      passwordHash,
      following: new Set<string>(),
      policies: {},
    };

    this.users.set(id, user);
    const token = `pt_jwt_${id}_${Date.now()}`;
    this.tokens.set(token, id);

    return {
      user: { id, name, email },
      accessToken: token,
    };
  }

  authenticate(email: string, passwordHash: string): { user: { id: string; name: string; email: string }; accessToken: string } {
    const user = Array.from(this.users.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.passwordHash !== passwordHash) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const token = `pt_jwt_${user.id}_${Date.now()}`;
    this.tokens.set(token, user.id);

    return {
      user: { id: user.id, name: user.name, email: user.email },
      accessToken: token,
    };
  }

  getUserFromToken(authHeader?: string): UserEntity {
    if (!authHeader) throw new UnauthorizedException('Token de autenticação não fornecido.');
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const userId = this.tokens.get(token);
    if (!userId) throw new UnauthorizedException('Sessão expirada ou inválida.');
    const user = this.users.get(userId);
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return user;
  }

  logout(authHeader?: string) {
    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      this.tokens.delete(token);
    }
  }

  getPolicies(user: UserEntity): { positions: Record<string, 'AGREE' | 'DISAGREE' | 'NEUTRAL'> } {
    return { positions: user.policies };
  }

  updatePolicies(user: UserEntity, positions: Record<string, 'AGREE' | 'DISAGREE' | 'NEUTRAL'>) {
    user.policies = { ...user.policies, ...positions };
    return { positions: user.policies };
  }

  async getFollowing(user: UserEntity): Promise<PoliticianSummary[]> {
    const ids = Array.from(user.following);
    const result: PoliticianSummary[] = [];
    for (const id of ids) {
      const p = await this.dataService.getPolitician(id);
      if (p) {
        result.push({
          id: p.id,
          name: p.name,
          photoUrl: p.photoUrl,
          party: p.party,
          uf: p.uf,
          office: p.office,
          status: p.status,
        });
      }
    }
    return result;
  }

  follow(user: UserEntity, politicianId: string) {
    user.following.add(politicianId);
  }

  unfollow(user: UserEntity, politicianId: string) {
    user.following.delete(politicianId);
  }
}
