'use client';

import { useEffect, useState } from 'react';
import type { Office } from '@/lib/types';
import { OFFICE_DUTIES } from '@/lib/officeDuties';
import { OFFICE_LABEL } from '@/lib/labels';

interface OfficeExplanationModalProps {
  office: Office;
  isOpen: boolean;
  onClose: () => void;
}

export function OfficeExplanationModal({ office, isOpen, onClose }: OfficeExplanationModalProps) {
  const [activeSection, setActiveSection] = useState<'whatItDoes' | 'whatItShouldDo' | 'whatItDoesNotDo' | 'checklist' | 'faq'>('whatItDoes');

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const duty = OFFICE_DUTIES[office];

  return (
    <div className="office-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="office-modal-title">
      <div className="office-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="office-modal-header" style={{ borderBottomColor: duty.accentSoft }}>
          <div className="office-modal-header-info">
            <span className="office-modal-badge" style={{ backgroundColor: duty.accentSoft, color: duty.accentColor }}>
              {duty.badgeEmoji} Guia Cívico de Cidadania · {duty.sphere} · Poder {duty.branch}
            </span>
            <h2 id="office-modal-title" className="office-modal-title">
              O que faz um(a) {OFFICE_LABEL[office]}?
            </h2>
            <p className="office-modal-subtitle">{duty.shortSummary}</p>
          </div>
          <button className="office-modal-close" onClick={onClose} aria-label="Fechar modal">
            ✕
          </button>
        </div>

        {/* Metadados rápidos */}
        <div className="office-modal-meta-grid">
          <div className="office-meta-item">
            <span className="office-meta-label">Órgão / Casa</span>
            <strong className="office-meta-value">{duty.bodyName}</strong>
          </div>
          <div className="office-meta-item">
            <span className="office-meta-label">Duração do Mandato</span>
            <strong className="office-meta-value">{duty.mandateYears} anos</strong>
          </div>
          <div className="office-meta-item">
            <span className="office-meta-label">Representação</span>
            <strong className="office-meta-value">{duty.representedEntity}</strong>
          </div>
          <div className="office-meta-item">
            <span className="office-meta-label">Sistema Eleitoral</span>
            <strong className="office-meta-value">{duty.electoralSystem}</strong>
          </div>
        </div>

        {/* Abas internas do Modal */}
        <div className="office-modal-nav">
          <button
            className={`office-nav-btn ${activeSection === 'whatItDoes' ? 'active' : ''}`}
            onClick={() => setActiveSection('whatItDoes')}
          >
            💼 O que faz na prática ({duty.whatItDoes.length})
          </button>
          <button
            className={`office-nav-btn ${activeSection === 'whatItShouldDo' ? 'active' : ''}`}
            onClick={() => setActiveSection('whatItShouldDo')}
          >
            🎯 O que deveria fazer ({duty.whatItShouldDo.length})
          </button>
          <button
            className={`office-nav-btn ${activeSection === 'whatItDoesNotDo' ? 'active' : ''}`}
            onClick={() => setActiveSection('whatItDoesNotDo')}
          >
            🚫 O que NÃO cabe ao cargo ({duty.whatItDoesNotDo.length})
          </button>
          <button
            className={`office-nav-btn ${activeSection === 'checklist' ? 'active' : ''}`}
            onClick={() => setActiveSection('checklist')}
          >
            🔍 Como Fiscalizar ({duty.citizenChecklist.length})
          </button>
          <button
            className={`office-nav-btn ${activeSection === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveSection('faq')}
          >
            ❓ Dúvidas Frequentes
          </button>
        </div>

        {/* Conteúdo Dinâmico */}
        <div className="office-modal-body">
          {activeSection === 'whatItDoes' && (
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
          )}

          {activeSection === 'whatItShouldDo' && (
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
          )}

          {activeSection === 'whatItDoesNotDo' && (
            <div>
              <div className="office-alert-box">
                <span className="office-alert-icon">⚠️</span>
                <div>
                  <strong>Atenção às Promessas Eleitorais Enganosas:</strong>
                  <p>Muitos candidatos prometem medidas que não fazem parte das competências constitucionais deste cargo. Conhecer esses limites protege seu voto!</p>
                </div>
              </div>
              <div className="office-grid-duties" style={{ marginTop: 14 }}>
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
          )}

          {activeSection === 'checklist' && (
            <div className="office-checklist-wrap">
              <p className="muted" style={{ marginBottom: 16 }}>
                Como cidadão consciente, utilize estes critérios práticos para avaliar e cobrar a atuação deste mandatário durante o exercício do mandato:
              </p>
              <div className="office-checklist-list">
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

              <div className="office-legal-box" style={{ marginTop: 24 }}>
                <span className="card-title">Base Legal na Constituição Federal de 1988:</span>
                <div className="office-legal-links">
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
              </div>
            </div>
          )}

          {activeSection === 'faq' && (
            <div className="office-faq-list">
              {duty.frequentlyAskedQuestions.map((f, idx) => (
                <div key={idx} className="office-faq-item">
                  <h4>💡 {f.question}</h4>
                  <p>{f.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="office-modal-footer">
          <span className="small muted">
            Fonte: Constituição da República Federativa do Brasil de 1988 (CF/88) · Dados e atribuições oficiais.
          </span>
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            Entendido, fechar
          </button>
        </div>
      </div>
    </div>
  );
}
