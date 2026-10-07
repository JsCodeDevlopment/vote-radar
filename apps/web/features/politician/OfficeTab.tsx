'use client';

import { useState } from 'react';
import type { Office, PoliticianDetail } from '@/lib/types';
import { OFFICE_DUTIES } from '@/lib/officeDuties';
import { OFFICE_LABEL } from '@/lib/labels';

export function OfficeTab({ politician: p }: { politician: PoliticianDetail }) {
  const [selectedOffice, setSelectedOffice] = useState<Office>(p.office);
  const duty = OFFICE_DUTIES[selectedOffice];
  const isCurrentPoliticianOffice = selectedOffice === p.office;

  const ALL_OFFICES: Office[] = [
    'PRESIDENTE',
    'GOVERNADOR',
    'SENADOR',
    'DEPUTADO_FEDERAL',
    'DEPUTADO_ESTADUAL',
  ];

  return (
    <div className="stack office-tab-page">
      {/* Banner de Apresentação */}
      <div className="card office-hero-card" style={{ borderLeft: `6px solid ${duty.accentColor}` }}>
        <div className="row between">
          <div className="office-hero-header">
            <span className="badge badge-analysis">Guia Cívico Constitucional</span>
            <h1>
              {duty.badgeEmoji} Cargo de {duty.title}
            </h1>
            <p className="office-hero-summary">{duty.shortSummary}</p>
          </div>
          {isCurrentPoliticianOffice && (
            <div className="office-politician-badge">
              <span className="small muted">Cargo ocupado por</span>
              <strong>{p.name}</strong>
              <span className="chip chip-blue">{p.bodyName}</span>
            </div>
          )}
        </div>

        {/* Seletor comparativo para ver outros cargos */}
        <div className="office-switcher-bar">
          <span className="small muted">Comparar com outros cargos:</span>
          <div className="row" style={{ gap: 6 }}>
            {ALL_OFFICES.map((off) => (
              <button
                key={off}
                type="button"
                className={`btn btn-sm ${selectedOffice === off ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setSelectedOffice(off)}
              >
                {OFFICE_DUTIES[off].badgeEmoji} {OFFICE_LABEL[off]}
                {off === p.office && ' (deste perfil)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de Metadados Constitucionais */}
      <div className="grid grid-4 office-meta-cards">
        <div className="card">
          <span className="card-title">Poder & Esfera</span>
          <strong style={{ fontSize: '1.1rem' }}>Poder {duty.branch}</strong>
          <span className="small muted">Esfera {duty.sphere}</span>
        </div>
        <div className="card">
          <span className="card-title">Casa / Órgão Oficial</span>
          <strong style={{ fontSize: '1.1rem' }}>{duty.bodyName}</strong>
          <span className="small muted">Sede do exercício funcional</span>
        </div>
        <div className="card">
          <span className="card-title">Duração do Mandato</span>
          <strong style={{ fontSize: '1.1rem' }}>{duty.mandateYears} anos</strong>
          <span className="small muted">{duty.electoralSystem}</span>
        </div>
        <div className="card">
          <span className="card-title">Representação</span>
          <strong style={{ fontSize: '1.1rem' }}>{duty.representedEntity}</strong>
          <span className="small muted">Titular do poder outorgado</span>
        </div>
      </div>

      {/* Seção 1: O que faz na prática */}
      <div className="card">
        <div className="row between">
          <div>
            <span className="card-title">Competências Oficiais</span>
            <h2>💼 O que este cargo faz na prática?</h2>
          </div>
          <span className="chip chip-green">Atribuições Constitucionais</span>
        </div>
        <p className="muted" style={{ marginBottom: 16 }}>
          Estas são as funções legais reais exercidas no dia a dia legislativo e executivo pelo ocupante desta cadeira:
        </p>

        <div className="office-grid-duties">
          {duty.whatItDoes.map((item, idx) => (
            <div key={idx} className="office-duty-card">
              <div className="office-duty-icon">{item.icon}</div>
              <div className="office-duty-content">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seção 2: O que DEVERIA fazer (Missão e Ética Republicana) */}
      <div className="card">
        <div className="row between">
          <div>
            <span className="card-title">Expectativa Republicana</span>
            <h2>🎯 O que o ocupante deste cargo DEVERIA fazer?</h2>
          </div>
          <span className="chip chip-blue">Ética & Bem Comum</span>
        </div>
        <p className="muted" style={{ marginBottom: 16 }}>
          Além das regras formais, a cidadania exige padrões éticos de conduta, responsabilidade com os recursos públicos e compromisso com o interesse público:
        </p>

        <div className="office-grid-duties">
          {duty.whatItShouldDo.map((item, idx) => (
            <div key={idx} className="office-duty-card office-duty-card-should">
              <div className="office-duty-icon">{item.icon}</div>
              <div className="office-duty-content">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seção 3: O que NÃO faz (Alerta contra promessas falsas) */}
      <div className="card" style={{ borderColor: '#ffc9c9' }}>
        <div className="row between">
          <div>
            <span className="card-title" style={{ color: 'var(--red)' }}>Guia Anti-Ilusão Eleitoral</span>
            <h2>🚫 O que NÃO cabe a este cargo?</h2>
          </div>
          <span className="chip chip-red">Não Caia em Falsas Promessas</span>
        </div>

        <div className="office-alert-box" style={{ marginTop: 8 }}>
          <span className="office-alert-icon">⚠️</span>
          <div>
            <strong>Atenção eleitor:</strong> Candidatos em campanhas eleitorais frequentemente prometem ações que não pertencem à sua alçada constitucional. Identifique limites para votar com consciência e cobrar de quem realmente tem a obrigação de agir.
          </div>
        </div>

        <div className="office-grid-duties" style={{ marginTop: 16 }}>
          {duty.whatItDoesNotDo.map((item, idx) => (
            <div key={idx} className="office-duty-card office-duty-card-not">
              <div className="office-duty-icon">{item.icon}</div>
              <div className="office-duty-content">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seção 4: Checklist do Cidadão - Como cobrar */}
      <div className="grid grid-2">
        <div className="card">
          <div className="row between">
            <span className="card-title">Controle Social</span>
            <span className="badge badge-official">Como Fiscalizar</span>
          </div>
          <h3>🔍 Checklist do Eleitor Consciente</h3>
          <p className="small muted">
            Utilize estes pontos práticos para avaliar a atuação de {isCurrentPoliticianOffice ? p.name : `qualquer ${duty.title}`}:
          </p>

          <div className="office-checklist-list" style={{ marginTop: 12 }}>
            {duty.citizenChecklist.map((c, idx) => (
              <div key={idx} className="office-checklist-item">
                <div className="office-check-badge">✓ {idx + 1}</div>
                <div>
                  <strong>{c.action}</strong>
                  <p className="muted small" style={{ marginTop: 4 }}>
                    {c.howToEvaluate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="row between">
            <span className="card-title">Constituição Federal de 1988</span>
            <span className="badge badge-official">Fonte Primária</span>
          </div>
          <h3>📜 Base Legal e Constitucional</h3>
          <p className="small muted">
            Consulte os artigos originais da Constituição no portal oficial da Presidência da República:
          </p>

          <div className="office-legal-links" style={{ marginTop: 12 }}>
            {duty.legalBasis.map((l, idx) => (
              <a
                key={idx}
                href={l.url ?? 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm'}
                target="_blank"
                rel="noopener noreferrer"
                className="office-legal-pill"
              >
                📜 <strong>{l.article}</strong>: {l.description} ↗
              </a>
            ))}
          </div>

          <h3 style={{ marginTop: 20 }}>💡 Dúvidas Frequentes</h3>
          <div className="office-faq-list" style={{ marginTop: 8 }}>
            {duty.frequentlyAskedQuestions.map((f, idx) => (
              <div key={idx} className="office-faq-item">
                <strong>{f.question}</strong>
                <p className="small muted" style={{ marginTop: 4 }}>
                  {f.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
