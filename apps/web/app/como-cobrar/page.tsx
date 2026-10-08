'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Share2,
  ShieldAlert,
  Send,
  Scale,
  PhoneCall,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  ACCOUNTABILITY_TEMPLATES,
  CIVIC_GUIDE_STEPS,
  OFFICIAL_CHANNELS,
  type AccountabilityTemplate,
  type OfficialChannel,
} from '@/lib/accountabilityData';
import { useAsync } from '@/hooks/useAsync';
import { api } from '@/lib/api';
import { Loading } from '@/components/ui';

export default function ComoCobrarPage() {
  const [activeTemplateId, setActiveTemplateId] = useState<AccountabilityTemplate['id']>('votacao');
  const [customFields, setCustomFields] = useState<Record<string, string>>({});
  const [copiedText, setCopiedText] = useState(false);
  const [channelFilter, setChannelFilter] = useState<'all' | OfficialChannel['category']>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Busca rápida de políticos para levar à aba individual
  const politiciansRes = useAsync(() => api.listPoliticians({ pageSize: 12 }), []);

  const activeTemplate = useMemo(() => {
    return (
      ACCOUNTABILITY_TEMPLATES.find((t) => t.id === activeTemplateId) ??
      ACCOUNTABILITY_TEMPLATES[0]
    );
  }, [activeTemplateId]);

  const generatedMessage = useMemo(() => {
    return activeTemplate.generateText({
      politicianName: customFields.politicoNome?.trim() || '[Nome do(a) Parlamentar]',
      officeLabel: customFields.cargoLabel?.trim() || 'Deputado(a) / Senador(a)',
      party: customFields.partido?.trim() || null,
      uf: customFields.uf?.trim() || null,
      bodyName: customFields.orgao?.trim() || 'Congresso Nacional',
      customFields,
    });
  }, [activeTemplate, customFields]);

  const handleFieldChange = (key: string, value: string) => {
    setCustomFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopyGeneratedText = async () => {
    const fullText = `Assunto: ${generatedMessage.subject}\n\n${generatedMessage.body}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2200);
    } catch {
      // Fallback
    }
  };

  const filteredChannels = useMemo(() => {
    if (channelFilter === 'all') return OFFICIAL_CHANNELS;
    return OFFICIAL_CHANNELS.filter((ch) => ch.category === channelFilter);
  }, [channelFilter]);

  const matchingPoliticians = useMemo(() => {
    const list = politiciansRes.data?.items ?? [];
    const q = searchTerm.trim().toLowerCase();
    if (!q) return list.slice(0, 6);
    return list
      .filter((p) => p.name.toLowerCase().includes(q) || (p.party && p.party.toLowerCase().includes(q)))
      .slice(0, 6);
  }, [politiciansRes.data?.items, searchTerm]);

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto">
      {/* ── Header Principal ── */}
      <div
        className="card text-center sm:text-left space-y-4 p-6 sm:p-8"
        style={{
          background:
            'radial-gradient(ellipse at top left, rgba(234, 88, 12, 0.12) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 100%)',
          border: '1px solid rgba(234, 88, 12, 0.3)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary font-bold">
              <Megaphone className="w-3.5 h-3.5" />
              <span>Controle Social e Cidadania Ativa</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-foreground">
              Como Cobrar Seus Representantes Políticos
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
              Ter acesso a dados abertos sobre votações e despesas é apenas o primeiro passo.
              Aprenda como transformar informações em ação cívica fundamentada, utilize modelos prontos
              e acione os canais oficiais de fiscalização da República.
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-center justify-center p-4 rounded-2xl bg-background/80 border border-border text-center min-w-[200px]">
            <span className="text-2xl mb-1">🇧🇷</span>
            <span className="text-xs font-mono font-bold text-foreground">Art. 5º da CF/88</span>
            <span className="text-[11px] font-mono text-muted-foreground mt-0.5">
              Direito de Petição e Acesso à Informação
            </span>
          </div>
        </div>
      </div>

      {/* ── Atalho: Selecionar Político para Cobrança Direta ── */}
      <div className="card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            <h2 className="text-base font-mono font-bold text-foreground uppercase tracking-wider">
              Cobrar um Parlamentar Específico
            </h2>
          </div>
          <Link
            href="/explorar"
            className="text-xs font-mono text-primary hover:underline inline-flex items-center gap-1"
          >
            <span>Ver todos os parlamentares</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          Ao abrir o perfil individual de qualquer deputado ou senador, acesse a aba <strong>&quot;Como Cobrar&quot;</strong>{' '}
          para obter o e-mail oficial institucional do gabinete, telefone e dados pré-preenchidos.
        </p>

        {/* Input de filtro */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite o nome ou partido de um parlamentar para cobrança direta..."
            className="w-full pl-9 pr-4 py-2 text-xs font-mono rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
          />
        </div>

        {/* Lista de cards rápidos */}
        {politiciansRes.loading ? (
          <Loading label="Carregando parlamentares..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {matchingPoliticians.map((pol) => (
              <Link
                key={pol.id}
                href={`/parlamentares/${pol.id}?aba=cobranca`}
                className="p-2.5 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 hover:border-primary/50 transition-all flex items-center justify-between gap-2 group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {pol.photoUrl ? (
                    <img
                      src={pol.photoUrl}
                      alt={pol.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0 border border-border"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center font-bold text-xs text-primary shrink-0">
                      {pol.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <strong className="text-xs font-mono text-foreground block truncate group-hover:text-primary transition-colors">
                      {pol.name}
                    </strong>
                    <span className="text-[10px] font-mono text-muted-foreground block truncate">
                      {pol.party ?? 'Sem partido'} · {pol.uf ?? 'BR'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  Cobrar ↗
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Guia Metodológico: 4 Passos da Cobrança Eficaz ── */}
      <div className="card space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            <h2 className="text-base font-mono font-bold text-foreground uppercase tracking-wider">
              Guia Passo a Passo: Metodologia de Fiscalização
            </h2>
          </div>
          <span className="text-xs font-mono text-muted-foreground">Boas Práticas Cívicas</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CIVIC_GUIDE_STEPS.map((step) => (
            <div
              key={step.step}
              className="p-4 rounded-xl bg-muted/30 border border-border space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                    Passo 0{step.step}
                  </span>
                  <span className="text-xl">{step.icon}</span>
                </div>

                <h3 className="text-sm font-mono font-bold text-foreground">{step.title}</h3>

                <p className="text-xs text-muted-foreground leading-relaxed">{step.summary}</p>

                <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="leading-snug">
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {step.tip && (
                <div className="p-2.5 rounded-lg bg-background/80 border border-border text-[11px] font-mono text-muted-foreground flex items-start gap-2 mt-2">
                  <span className="text-primary font-bold">💡</span>
                  <span>{step.tip}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <strong className="text-amber-300 font-mono block">
              Dica Jurídica: Cobrança Firme vs. Crimes Contra a Honra
            </strong>
            <p className="text-muted-foreground leading-relaxed">
              O cidadão tem o direito constitucional de questionar como o dinheiro público é gasto e
              como os parlamentares votam. Mas lembre-se: ofensas à honra e acusações genéricas desviam
              a atenção e desqualificam a cobrança. Sempre baseie seu pedido no número da lei, na nota
              fiscal ou no posicionamento nominal em ata.
            </p>
          </div>
        </div>
      </div>

      {/* ── Gerador Geral de Modelos de Cobrança ── */}
      <div className="card space-y-6">
        <div>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">✍️</span>
              <h2 className="text-base font-mono font-bold text-foreground uppercase tracking-wider">
                Gerador de Modelos de E-mail e Ofício
              </h2>
            </div>
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded">
              Modelos Universais
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Escolha o modelo abaixo, preencha as variáveis e copie o texto pronto para ser enviado ao gabinete ou protocolado na ouvidoria:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {ACCOUNTABILITY_TEMPLATES.map((tmpl) => {
            const isSelected = tmpl.id === activeTemplateId;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => {
                  setActiveTemplateId(tmpl.id);
                  setCopiedText(false);
                }}
                className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary/10 border-primary text-foreground shadow-sm'
                    : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{tmpl.icon}</span>
                  <strong className="text-xs font-mono font-bold truncate block">
                    {tmpl.title}
                  </strong>
                </div>
                <p className="text-[11px] leading-tight opacity-80 line-clamp-2">
                  {tmpl.tagline}
                </p>
              </button>
            );
          })}
        </div>

        {/* Campos customizáveis */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
            <Info className="w-4 h-4 text-primary" />
            <span>Preencha as Informações para Gerar o Texto</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-mono text-muted-foreground block">
                Nome do Parlamentar
              </label>
              <input
                type="text"
                value={customFields.politicoNome ?? ''}
                placeholder="Ex: Deputado Fulano de Tal"
                onChange={(e) => handleFieldChange('politicoNome', e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-muted-foreground block">
                Estado / UF
              </label>
              <input
                type="text"
                value={customFields.uf ?? ''}
                placeholder="Ex: SP, RJ, MG"
                onChange={(e) => handleFieldChange('uf', e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-muted-foreground block">
                Partido
              </label>
              <input
                type="text"
                value={customFields.partido ?? ''}
                placeholder="Ex: Sigla do partido"
                onChange={(e) => handleFieldChange('partido', e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
              />
            </div>

            {activeTemplate.fields.map((field) => (
              <div key={field.key} className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground block">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={customFields[field.key] ?? ''}
                  placeholder={field.placeholder}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Texto Gerado */}
        <div className="space-y-2">
          <div className="rounded-xl border border-border bg-background p-4 space-y-3 font-mono text-xs">
            <div className="pb-2 border-b border-border/60">
              <span className="text-muted-foreground font-bold">Assunto: </span>
              <span className="text-primary font-semibold">{generatedMessage.subject}</span>
            </div>

            <div className="whitespace-pre-wrap leading-relaxed text-foreground select-text max-h-[360px] overflow-y-auto pr-2">
              {generatedMessage.body}
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleCopyGeneratedText}
                className="v-btn -primary -sm text-xs font-mono inline-flex items-center gap-2 shadow-sm"
              >
                {copiedText ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Texto copiado com sucesso!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar texto completo</span>
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `*Cobrança Cidadã*\n\n${generatedMessage.subject}\n\n${generatedMessage.body}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="v-btn -ghost -sm text-xs font-mono inline-flex items-center gap-2"
              >
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span>Compartilhar via WhatsApp</span>
              </a>
            </div>

            <span className="text-[11px] font-mono text-muted-foreground">
              Personalize o texto acima antes de colar no seu e-mail.
            </span>
          </div>
        </div>
      </div>

      {/* ── Diretório Completo de Canais e Ouvidorias Oficiais ── */}
      <div className="card space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" />
              <h2 className="text-base font-mono font-bold text-foreground uppercase tracking-wider">
                Diretório de Canais Institucionais e Fiscalização
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Acesse diretamente os órgãos com atribuição legal para receber pedidos da LAI, denúncias e consultas públicas:
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'lai', label: 'LAI' },
              { id: 'ouvidoria', label: 'Ouvidorias' },
              { id: 'legislativo', label: 'Participação' },
              { id: 'fiscalizacao', label: 'Denúncias' },
              { id: 'auditoria', label: 'CNPJ' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setChannelFilter(f.id as any)}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  channelFilter === f.id
                    ? 'bg-primary text-primary-foreground font-bold'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredChannels.map((channel) => (
            <div
              key={channel.id}
              className="p-4 rounded-xl bg-muted/20 border border-border hover:border-primary/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-mono font-bold text-foreground">
                      {channel.name}
                    </h3>
                    <span className="text-xs text-muted-foreground font-mono">
                      {channel.entity}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: `${channel.badgeColor}18`,
                      color: channel.badgeColor,
                      border: `1px solid ${channel.badgeColor}40`,
                    }}
                  >
                    {channel.badge}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {channel.description}
                </p>

                <div className="p-2.5 rounded-lg bg-background/70 border border-border text-xs space-y-1">
                  <span className="text-[11px] font-mono font-bold text-primary block">
                    Quando acionar:
                  </span>
                  <p className="text-muted-foreground text-[11px] leading-snug">
                    {channel.whenToUse}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60">
                {channel.phone ? (
                  <a
                    href={`tel:${channel.phone.replace(/\D/g, '')}`}
                    className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-primary" />
                    <span>{channel.phone}</span>
                  </a>
                ) : (
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Atendimento Online
                  </span>
                )}

                <a
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v-btn -ghost -sm text-xs font-mono inline-flex items-center gap-1.5"
                >
                  <span>Acessar portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
