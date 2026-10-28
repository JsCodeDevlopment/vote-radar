'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from './AuthProvider';
import { Menu, X, Compass, Scale, Building2, Megaphone, LogIn, UserPlus, LogOut, User as UserIcon, Landmark, Sun, Moon, Search } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const NAV = [
  { href: '/explorar', label: 'Explorar', icon: Compass, description: 'Deputados federais e estaduais, senadores e governantes' },
  { href: '/gastos-uniao', label: 'Gastos da União', icon: Landmark, description: 'Raio-X de todo o orçamento e despesas federais' },
  { href: '/como-cobrar', label: 'Como Cobrar', icon: Megaphone, description: 'Guia cívico de controle social e modelos de cobrança' },
];

export function Header() {
  const { user, ready, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fecha o menu móvel ao mudar de página
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Fecha o menu ao pressionar ESC e previne scroll de fundo quando aberto
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    }
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          {/* Logo Vote Radar estilo SeuImposto */}
          <Link href="/" className="logo group flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="Logo Vote Radar"
              className="w-8 h-8 rounded-full object-contain border border-border shadow-xs"
            />
            <div className="flex flex-col">
              <span className="font-semibold tracking-tight text-sm text-foreground flex items-center gap-1.5 leading-none">
                Vote Radar
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </span>
              <span className="text-[10px] text-muted-foreground tracking-wide mt-0.5">
                Portal Cívico Oficial
              </span>
            </div>
          </Link>

          {/* Navegação Segmentada Desktop (Capsule switcher igual ao seuimposto.com) */}
          <nav className="desktop-nav seuimposto-nav-seg">
            {NAV.map((n) => {
              const isActive = pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`seuimposto-nav-pill ${isActive ? 'active' : ''}`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          {/* Ações Desktop: Botão de Tema (Sol/Lua) e Perfil */}
          <div className="header-actions desktop-actions flex items-center gap-2">
            <Link
              href="/explorar"
              className="seuimposto-icon-btn"
              title="Buscar na base"
              aria-label="Buscar"
            >
              <Search size={16} />
            </Link>

            {/* Alternador de tema Claro / Escuro igual ao seuimposto.com */}
            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                className="seuimposto-icon-btn"
                title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
                aria-label="Alternar tema"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}

            {!ready ? null : user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground truncate max-w-[140px]" title={user.name || user.email}>
                  {user.name || user.email}
                </span>
                <button
                  className="v-btn -ghost -sm"
                  onClick={async () => {
                    await logout();
                    router.push('/');
                  }}
                >
                  Sair
                </button>
              </div>
            ) : null}
          </div>

          {/* Botão Hambúrguer Mobile */}
          <div className="mobile-header-toggle flex items-center gap-2">
            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                className="seuimposto-icon-btn"
                title="Alternar tema"
                aria-label="Alternar tema"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
            <button
              type="button"
              className="seuimposto-icon-btn mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu / Drawer Mobile renderizado via Portal no document.body para garantir tela cheia sem contenção de backdrop-filter */}
      {mounted && mobileMenuOpen && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="mobile-drawer-overlay"
              onClick={() => setMobileMenuOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-label="Menu principal"
            >
              <div
                className="mobile-drawer-panel"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mobile-drawer-header">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/logo.png"
                      alt="Vote Radar"
                      className="w-7 h-7 rounded-md object-contain"
                    />
                    <div className="flex flex-col">
                      <span className="font-mono font-bold text-foreground leading-tight">Vote Radar</span>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">Navegação</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="v-btn -ghost -sm p-1.5"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Fechar menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mobile-drawer-body">
                  {/* Links de Navegação Principal */}
                  <div className="mobile-nav-group">
                    <span className="mobile-nav-section-title">Navegação Principal</span>
                    {NAV.map((n) => {
                      const Icon = n.icon;
                      const isActive = pathname.startsWith(n.href);
                      return (
                        <Link
                          key={n.href}
                          href={n.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                        >
                          <span className="mobile-nav-link-icon">
                            <Icon size={18} />
                          </span>
                          <div className="flex flex-col">
                            <span className="mobile-nav-link-label">{n.label}</span>
                            <span className="mobile-nav-link-desc">{n.description}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Seção de Autenticação / Usuário */}
                  <div className="mobile-auth-group">
                    <span className="mobile-nav-section-title">Sua Conta</span>
                    {user ? (
                      <div className="mobile-user-card">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-mono font-bold">
                            <UserIcon size={20} />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="font-semibold text-sm text-foreground truncate">
                              {user.name || 'Cidadão Conectado'}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono truncate">
                              {user.email}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="v-btn -ghost w-full justify-center text-sm font-mono text-destructive"
                          onClick={async () => {
                            setMobileMenuOpen(false);
                            await logout();
                            router.push('/');
                          }}
                        >
                          <LogOut size={16} className="mr-2" />
                          Encerrar Sessão (Sair)
                        </button>
                      </div>
                    ) : (
                      /* Botões de entrar e registrar temporariamente ocultos
                      <div className="mobile-auth-buttons">
                        <Link
                          href="/login"
                          onClick={() => setMobileMenuOpen(false)}
                          className="v-btn -ghost w-full justify-center text-sm font-semibold"
                        >
                          <LogIn size={16} className="mr-2" />
                          Entrar na conta
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setMobileMenuOpen(false)}
                          className="v-btn -accent w-full justify-center text-sm font-bold shadow-sm"
                        >
                          <UserPlus size={16} className="mr-2" />
                          Criar conta gratuita
                        </Link>
                      </div>
                      */
                      null
                    )}
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
