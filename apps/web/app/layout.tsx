import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/components/AuthProvider';
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
    <html lang="pt-BR" className="dark" data-mode="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="dark min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
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
                    className="w-7 h-7 rounded-md object-contain"
                  />
                  <span className="font-mono font-bold tracking-tight text-foreground text-base">Vote Radar</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-mono">v2.0-real</span>
                </div>
                <div className="text-xs font-mono text-muted-foreground flex gap-4">
                  <span>Câmara dos Deputados</span>
                  <span>·</span>
                  <span>Senado Federal</span>
                  <span>·</span>
                  <span>TSE</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                O <strong>Vote Radar</strong> consolida dados factuais com rigor metodológico. Cada
                informação é classificada como <strong className="text-foreground">Dado oficial</strong>, <strong className="text-foreground">Análise do sistema</strong>,{' '}
                <strong className="text-foreground">Opinião do usuário</strong> ou <strong className="text-foreground">Notícia de terceiros</strong>.
              </p>
              <p className="text-xs font-mono text-muted-foreground mt-2">
                Fontes: API de Dados Abertos da Câmara dos Deputados · Dados Abertos do Senado Federal · Tribunal Superior Eleitoral.
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
