import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/components/AuthProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { DemoBanner } from '@/components/ui';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vote Radar — Portal de Fiscalização e Integridade Pública',
  description:
    'Vote Radar: acompanhe votações, proposições, gastos e notícias de parlamentares brasileiros com dados 100% oficiais e auditáveis.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;0,6..72,700;1,6..72,400;1,6..72,600&family=Geist+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var saved = localStorage.getItem('vote-radar-theme');
                if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-mode', 'dark');
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.setAttribute('data-mode', 'light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground transition-colors duration-150 antialiased selection:bg-primary/20 selection:text-primary">
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <DemoBanner />
            <main className="container main">{children}</main>
            <footer className="footer">
              <div className="container">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/logo.png"
                      alt="Logo Vote Radar"
                      className="w-7 h-7 rounded-lg object-contain border border-border"
                    />
                    <span className="font-semibold tracking-tight text-foreground text-sm">Vote Radar</span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-mono">
                      Dados Oficiais
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground flex gap-4 items-center flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      1.816 autoridades monitoradas
                    </span>
                    <span>·</span>
                    <a href="/como-cobrar" className="text-foreground hover:underline font-medium">
                      Como Cobrar
                    </a>
                    <span>·</span>
                    <span>Câmara</span>
                    <span>·</span>
                    <span>Senado</span>
                    <span>·</span>
                    <span>TSE</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  O <strong>Vote Radar</strong> consolida dados factuais com rigor metodológico. Cada
                  informação é classificada como <strong className="text-foreground">Dado oficial</strong>, <strong className="text-foreground">Análise do sistema</strong>,{' '}
                  <strong className="text-foreground">Opinião do usuário</strong> ou <strong className="text-foreground">Notícia de terceiros</strong>.
                </p>
                <p className="text-[11px] text-muted-foreground mt-2">
                  Fontes: API de Dados Abertos da Câmara dos Deputados · Dados Abertos do Senado Federal · Tribunal Superior Eleitoral.
                </p>
              </div>
            </footer>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
