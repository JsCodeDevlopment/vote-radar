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
      <h1>Entrar</h1>
      <p className="muted">Acompanhe seus parlamentares e suas políticas.</p>
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
