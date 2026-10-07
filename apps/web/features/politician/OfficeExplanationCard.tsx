'use client';

import { useState } from 'react';
import type { Office } from '@/lib/types';
import { OFFICE_DUTIES } from '@/lib/officeDuties';
import { OFFICE_LABEL } from '@/lib/labels';
import { OfficeExplanationModal } from './OfficeExplanationModal';

export function OfficeExplanationCard({
  office,
  showFullLink = true,
}: {
  office: Office;
  showFullLink?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<'does' | 'should' | 'notDoes'>('does');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const duty = OFFICE_DUTIES[office];

  return (
    <>
      <div className="card office-explanation-card">
        {/* Top Header */}
        <div className="office-card-head">
          <div className="office-title-wrap">
            <div className="office-emoji-circle" style={{ backgroundColor: duty.accentSoft }}>
              {duty.badgeEmoji}
            </div>
            <div>
              <div className="office-badge-row">
                <span className="badge badge-analysis">Guia Cívico do Cargo</span>
                <span className="chip chip-blue">{duty.sphere}</span>
                <span className="chip chip-gray">Poder {duty.branch}</span>
              </div>
              <h2 className="office-card-title">
                O que faz um(a) {OFFICE_LABEL[office]}?
              </h2>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm office-guide-btn"
            onClick={() => setIsModalOpen(true)}
            title="Abrir guia cívico completo com perguntas e respostas"
          >
            📖 Guia Completo do Cargo
          </button>
        </div>

        {/* Resumo executivo */}
        <p className="office-card-summary">
          {duty.shortSummary}
        </p>

        {/* Mini tabs internas para alternar a visão */}
        <div className="office-card-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'does'}
            className={`office-card-tab ${activeTab === 'does' ? 'active' : ''}`}
            onClick={() => setActiveTab('does')}
          >
            💼 O que faz na prática ({duty.whatItDoes.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'should'}
            className={`office-card-tab ${activeTab === 'should' ? 'active' : ''}`}
            onClick={() => setActiveTab('should')}
          >
            🎯 O que deveria fazer ({duty.whatItShouldDo.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'notDoes'}
            className={`office-card-tab ${activeTab === 'notDoes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notDoes')}
          >
            🚫 O que NÃO faz / Cuidado ({duty.whatItDoesNotDo.length})
          </button>
        </div>

        {/* Conteúdo da sub-aba selecionada */}
        <div className="office-card-content">
          {activeTab === 'does' && (
            <div className="office-items-grid">
              {duty.whatItDoes.slice(0, 4).map((item, idx) => (
                <div key={idx} className="office-mini-item">
                  <span className="office-item-icon">{item.icon}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p className="small muted">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'should' && (
            <div className="office-items-grid">
              {duty.whatItShouldDo.map((item, idx) => (
                <div key={idx} className="office-mini-item office-mini-item-should">
                  <span className="office-item-icon">{item.icon}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p className="small muted">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'notDoes' && (
            <div>
              <div className="office-warning-callout">
                <span>⚠️</span>
                <p className="small">
                  <strong>Não caia em promessas enganosas de campanha:</strong> candidatos a este cargo frequentemente prometem entregas que dependem de outros poderes ou esferas.
                </p>
              </div>
              <div className="office-items-grid" style={{ marginTop: 10 }}>
                {duty.whatItDoesNotDo.map((item, idx) => (
                  <div key={idx} className="office-mini-item office-mini-item-not">
                    <span className="office-item-icon">{item.icon}</span>
                    <div>
                      <strong>{item.title}</strong>
                      <p className="small muted">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com atalho e base legal */}
        <div className="office-card-foot">
          <div className="small muted">
            🏛️ <strong>Sede:</strong> {duty.bodyName} · ⏳ <strong>Mandato:</strong> {duty.mandateYears} anos · 👥 <strong>Representa:</strong> {duty.representedEntity}
          </div>
          {showFullLink && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setIsModalOpen(true)}
              style={{ fontSize: '0.8rem', padding: '4px 10px' }}
            >
              Ver base legal e checklist completo ↗
            </button>
          )}
        </div>
      </div>

      <OfficeExplanationModal
        office={office}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
