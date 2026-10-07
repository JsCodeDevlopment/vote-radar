'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

const NAV = [
  { href: '/explorar', label: 'Explorar' },
  { href: '/politicas', label: 'Políticas' },
  { href: '/dashboard', label: 'Meus parlamentares' },
];

export function Header() {
  const { user, ready, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo group flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center text-primary transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </span>
          <div className="flex flex-col">
            <span className="font-mono font-bold tracking-tight text-sm text-foreground flex items-center gap-1.5">
              POLÍTICA TRACKER
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Dados Oficiais Abertos
            </span>
          </div>
        </Link>

        <nav className="nav v-seg">
          {NAV.map((n) => {
            const isActive = pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`v-btn -sm ${isActive ? '-accent font-bold' : '-ghost'}`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="header-actions">
          {!ready ? null : user ? (
            <>
              <span className="muted small hide-sm font-mono">{user.name || user.email}</span>
              <button
                className="v-btn -ghost -sm"
                onClick={async () => {
                  await logout();
                  router.push('/');
                }}
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="v-btn -ghost -sm">
                Entrar
              </Link>
              <Link href="/register" className="v-btn -accent -sm">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
