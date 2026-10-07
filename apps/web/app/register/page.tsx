'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
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
          <span className="text-xs text-muted-foreground font-mono">Crie sua conta para fiscalizar e comparar</span>
        </div>
      </div>
      <h1>Criar conta</h1>
      <p className="muted">
        Coletamos apenas o necessário. Suas posições no Vote Radar são <strong>privadas</strong> e visíveis
        somente para você.
      </p>
      <form
        className="stack"
        onSubmit={async (e) => {
          e.preventDefault();
          if (password.length < 8) {
            setError('A senha deve ter pelo menos 8 caracteres.');
            return;
          }
          setBusy(true);
          setError(undefined);
          try {
            await register(name.trim(), email.trim(), password);
            router.push('/politicas');
          } catch (err) {
            setError((err as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="field">
          <label htmlFor="name">Nome (opcional)</label>
          <input id="name" className="input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input id="email" className="input" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="password">Senha</label>
          <input id="password" className="input" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <span className="small muted">Mínimo de 8 caracteres.</span>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <button className="btn btn-primary" disabled={busy}>
          {busy ? 'Criando…' : 'Criar conta'}
        </button>
        <p className="small muted center">
          Já tem conta? <Link href="/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
