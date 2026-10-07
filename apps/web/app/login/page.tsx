'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  return (
    <div className="card auth-card">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
        <img src="/logo.png" alt="Vote Radar" className="w-10 h-10 rounded-lg object-contain shadow-sm border border-primary/20" />
        <div>
          <span className="font-mono font-bold text-base text-foreground block">Vote Radar</span>
          <span className="text-xs text-muted-foreground font-mono">Portal de Fiscalização e Transparência</span>
        </div>
      </div>
      <h1>Entrar</h1>
      <p className="muted">Acesse sua conta para acompanhar seus parlamentares e posições.</p>
      <form
        className="stack"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError(undefined);
          try {
            await login(email.trim(), password);
            router.push('/dashboard');
          } catch (err) {
            setError((err as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input id="email" className="input" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="password">Senha</label>
          <input id="password" className="input" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <button className="btn btn-primary" disabled={busy}>
          {busy ? 'Entrando…' : 'Entrar'}
        </button>
        <p className="small muted center">
          Não tem conta? <Link href="/register">Criar conta</Link>
        </p>
      </form>
    </div>
  );
}
