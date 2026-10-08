'use client';

import { useMemo, useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Share2,
  ShieldAlert,
  Send,
  HelpCircle,
  FileText,
  AlertTriangle,
  Scale,
  PhoneCall,
  CheckCircle2,
  Info,
} from 'lucide-react';
import {
  ACCOUNTABILITY_TEMPLATES,
  CIVIC_GUIDE_STEPS,
  OFFICIAL_CHANNELS,
  type AccountabilityTemplate,
  type OfficialChannel,
} from '@/lib/accountabilityData';
import { formatBRL, formatNumber } from '@/lib/format';
import { OFFICE_LABEL } from '@/lib/labels';
import type { PoliticianDetail } from '@/lib/types';

export function AccountabilityTab({ politician: p }: { politician: PoliticianDetail }) {
  const [activeTemplateId, setActiveTemplateId] = useState<AccountabilityTemplate['id']>('votacao');
  const [customFields, setCustomFields] = useState<Record<string, string>>({});
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [channelFilter, setChannelFilter] = useState<'all' | OfficialChannel['category']>('all');

  const officeTitle = OFFICE_LABEL[p.office] || 'Parlamentar';

  const activeTemplate = useMemo(() => {
    return (
      ACCOUNTABILITY_TEMPLATES.find((t) => t.id === activeTemplateId) ??
      ACCOUNTABILITY_TEMPLATES[0]
    );
  }, [activeTemplateId]);

  // Texto gerado em tempo real com base no template e dados do político
  const generatedMessage = useMemo(() => {
    return activeTemplate.generateText({
      politicianName: p.name,
      civilName: p.civilName,
      officeLabel: officeTitle,
      party: p.party,
      uf: p.uf,
      bodyName: p.bodyName,
      customFields,
    });
  }, [activeTemplate, p, officeTitle, customFields]);

  const handleFieldChange = (key: string, value: string) => {
    setCustomFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopyEmail = async () => {
    if (!p.email) return;
    try {
      await navigator.clipboard.writeText(p.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      // Fallback silencioso
    }
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

  // URL mailto: com assunto e corpo pré-preenchidos
  const mailtoUrl = useMemo(() => {
    const recipient = p.email || '';
    const subject = encodeURIComponent(generatedMessage.subject);
    const body = encodeURIComponent(generatedMessage.body);
    return `mailto:${recipient}?subject=${subject}&body=${body}`;
  }, [p.email, generatedMessage]);

  // URL WhatsApp para compartilhamento cívico
  const whatsappUrl = useMemo(() => {
    const shareText = `*Cobrança Cidadã — ${officeTitle} ${p.name}*\n\n${generatedMessage.subject}\n\n${generatedMessage.body}`;
    return `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  }, [officeTitle, p.name, generatedMessage]);

  const filteredChannels = useMemo(() => {
    if (channelFilter === 'all') return OFFICIAL_CHANNELS;
    return OFFICIAL_CHANNELS.filter((ch) => ch.category === channelFilter);
  }, [channelFilter]);

  return (
    <div className="space-y-8" id="cobranca-tab-content">
      {/* ── 1. Banner Principal de Conscientização Cívica ── */}
      <div
        className="card"
        style={{
          background:
            'linear-gradient(135deg, rgba(234, 88, 12, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
          border: '1px solid rgba(234, 88, 12, 0.25)',
        }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl">📢</span>
              <h2 className="text-lg font-mono font-bold text-foreground">
                Como Cobrar este Mandato — Controle Social Cidadão
              </h2>
              <span className="badge badge-official font-mono text-[11px]">
                Art. 5º da CF/88
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O mandato de <strong>{p.name}</strong> ({p.party ?? 'Sem partido'}/{p.uf ?? 'BR'}) é
              público e sustentado com recursos do contribuinte. Todo cidadão tem o direito constitucional
              de solicitar esclarecimentos formais sobre votos nominais, projetos e notas fiscais de despesas.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs font-mono text-muted-foreground bg-background/60 p-2.5 rounded-lg border border-border">
            <span>📊 Gastos: {formatBRL(p.stats.expensesCents, true)}</span>
            <span>·</span>
            <span>🗳️ {formatNumber(p.stats.votings)} votos</span>
            <span>·</span>
            <span>👥 {p.stats.staffCount} servidores</span>
          </div>
        </div>
      </div>

      {/* ── 2. Card de Contato Direto do Parlamentar ── */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            <h3 className="text-base font-mono font-bold text-foreground uppercase tracking-wider">
              Canais Oficiais de Contato do Gabinete
            </h3>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {p.bodyName}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* E-mail Institucional */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
                E-mail Oficial do Gabinete
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Canal Primário
              </span>
            </div>

            {p.email ? (
              <div className="space-y-3">
                <div className="font-mono text-sm text-foreground font-semibold break-all bg-background px-3 py-2 rounded-lg border border-border flex items-center justify-between gap-2">
                  <span>{p.email}</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="v-btn -ghost -sm text-xs font-mono inline-flex items-center gap-1.5"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>E-mail copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar e-mail</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${p.email}`}
                    className="v-btn -primary -sm text-xs font-mono inline-flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Abrir leitor de e-mail</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  E-mail institucional direto não divulgado nesta listagem para este cargo ({officeTitle}).
                  Utilize o portal oficial do órgão ou as ouvidorias abaixo.
                </p>
                {p.source?.url && (
                  <a
                    href={p.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="v-btn -ghost -sm text-xs font-mono inline-flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ver página oficial no órgão ↗</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Portal Oficial e Ouvidoria Institucional */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
                Portal Oficial e Gabinete Físico
              </span>
              <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                Poder Público
              </span>
            </div>

            <div className="text-xs text-muted-foreground space-y-1.5">
              <p>
                <strong>Órgão:</strong> {p.bodyName}
              </p>
              <p>
                <strong>Situação:</strong> {p.status === 'IN_OFFICE' ? 'Mandato em Exercício Ativo' : 'Fora de Exercício'}
              </p>
              <p>
                <strong>Escritório Político / Gabinete:</strong> Brasília / DF e Representação em {p.uf ?? 'sua região'}.
              </p>
            </div>

            {p.source?.url && (
              <div>
                <a
                  href={p.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v-btn -ghost -sm text-xs font-mono inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Página Oficial de {p.name} ↗</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 3. Gerador Interativo de Modelos de Cobrança ── */}
      <div className="card space-y-6">
        <div>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">✍️</span>
              <h3 className="text-base font-mono font-bold text-foreground uppercase tracking-wider">
                Gerador de Mensagens e Modelos de Cobrança
              </h3>
            </div>
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded">
              Pronto para copiar e enviar
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Selecione o tipo de cobrança abaixo, customize as informações e clique em copiar ou enviar diretamente por e-mail ou WhatsApp:
          </p>
        </div>

        {/* Seletores de Templates */}
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

        {/* Formulário de Personalização dos Campos */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
            <Info className="w-4 h-4 text-primary" />
            <span>Personalize os Dados do seu Pedido (Opcional)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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

        {/* Preview do Texto Gerado */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Pré-visualização do Texto Gerado
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-muted-foreground">
                {activeTemplate.description}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-4 space-y-3 font-mono text-xs">
            {/* Assunto */}
            <div className="pb-2 border-b border-border/60">
              <span className="text-muted-foreground font-bold">Assunto: </span>
              <span className="text-primary font-semibold">{generatedMessage.subject}</span>
            </div>

            {/* Corpo */}
            <div className="whitespace-pre-wrap leading-relaxed text-foreground select-text max-h-[360px] overflow-y-auto pr-2">
              {generatedMessage.body}
            </div>
          </div>

          {/* Barra de Ações Rápidas */}
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

              {p.email ? (
                <a
                  href={mailtoUrl}
                  className="v-btn -ghost -sm text-xs font-mono inline-flex items-center gap-2"
                  title="Abrir no seu aplicativo de e-mail (Gmail, Outlook, etc.)"
                >
                  <Mail className="w-4 h-4 text-primary" />
                  <span>Enviar para {p.email}</span>
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="v-btn -ghost -sm text-xs font-mono opacity-50 cursor-not-allowed inline-flex items-center gap-1.5"
                  title="E-mail direto não disponível. Copie o texto e protocole no Fala.BR ou Ouvidoria."
                >
                  <Mail className="w-4 h-4" />
                  <span>E-mail direto indisponível (copie o texto)</span>
                </button>
              )}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="v-btn -ghost -sm text-xs font-mono inline-flex items-center gap-2"
                title="Compartilhar modelo no WhatsApp com amigos ou grupos cívicos"
              >
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span>Compartilhar no WhatsApp</span>
              </a>
            </div>

            <span className="text-[11px] font-mono text-muted-foreground">
              Você pode editar o texto antes de enviar.
            </span>
          </div>
        </div>
      </div>

      {/* ── 4. Guia Passo a Passo: "Boas Práticas de Cobrança Cidadã" ── */}
      <div className="card space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            <h3 className="text-base font-mono font-bold text-foreground uppercase tracking-wider">
              Guia Prático: Como Cobrar com Eficácia e Segurança Jurídica
            </h3>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            Metodologia de Controle Social
          </span>
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

                <h4 className="text-sm font-mono font-bold text-foreground">
                  {step.title}
                </h4>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.summary}
                </p>

                <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
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

        {/* Alerta Jurídico e Constitucional */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <strong className="text-amber-300 font-mono block">
              Aviso de Segurança Jurídica: Firmeza Sim, Ofensas Não
            </strong>
            <p className="text-muted-foreground leading-relaxed">
              O cidadão brasileiro possui total garantia constitucional (Artigo 5º, incisos XXXIII e XXXIV da Constituição Federal)
              para fiscalizar qualquer agente público. No entanto, mensagens com xingamentos pessoais, ameaças ou acusações sem prova
              podem ser enquadradas como crimes contra a honra (injúria, calúnia ou difamação) e perdem toda a força política.
              <strong> Mantenha sempre o foco estrito nas notas fiscais, nas presenças e nos votos nominais.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* ── 5. Diretório de Órgãos Oficiais de Controle e Fiscalização ── */}
      <div className="card space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" />
              <h3 className="text-base font-mono font-bold text-foreground uppercase tracking-wider">
                Diretório de Órgãos Oficiais de Controle & Fiscalização
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Canais institucionais para onde enviar pedidos, denúncias e participar das decisões legislativas:
            </p>
          </div>

          {/* Filtro de Canais */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'lai', label: 'LAI / Transparência' },
              { id: 'ouvidoria', label: 'Ouvidorias' },
              { id: 'legislativo', label: 'Participação' },
              { id: 'fiscalizacao', label: 'Denúncias' },
              { id: 'auditoria', label: 'Auditoria CNPJ' },
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
                    <h4 className="text-sm font-mono font-bold text-foreground">
                      {channel.name}
                    </h4>
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
                    Quando acionar este canal:
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
