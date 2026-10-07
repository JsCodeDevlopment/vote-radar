'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Empty, ErrorState, KindBadge, Loading, RequireLogin } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { api } from '@/lib/api';
import type { PolicyPosition, PolicyTopic, UserPositions } from '@/lib/types';

export default function PoliciesPage() {
  const { user, ready } = useAuth();
  const router = useRouter();

  const topics = useAsync(() => api.getPolicies(), []);
  const myPolicies = useAsync(() => api.getMyPolicies(), [user?.id], ready && !!user);

  const [positions, setPositions] = useState<UserPositions>({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string>();

  useEffect(() => {
    if (myPolicies.data) {
      setPositions(myPolicies.data);
      setDirty(false);
    }
  }, [myPolicies.data]);

  const handlePositionChange = (policyId: string, position: PolicyPosition) => {
    setPositions((prev) => {
      const next = { ...prev };
      if (next[policyId] === position) {
        delete next[policyId]; // Clicar na mesma posição desseleciona
      } else {
        next[policyId] = position;
      }
      return next;
    });
    setDirty(true);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(undefined);
    try {
      await api.putMyPolicies(positions);
      setDirty(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      setSaveError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (!ready) return <Loading />;
  if (!user) {
    return (
      <RequireLogin message="Para definir suas preferências de políticas públicas e calcular compatibilidade com seus parlamentares, entre ou crie sua conta.">
        <p className="small muted" style={{ marginTop: 12 }}>
          Suas escolhas são estritamente <strong>privadas</strong> e usadas apenas para confrontar os votos nominais.
        </p>
      </RequireLogin>
    );
  }

  if (topics.loading || myPolicies.loading) return <Loading />;
  if (topics.error) return <ErrorState error={topics.error} onRetry={topics.reload} />;
  const topicList = topics.data ?? [];

  const answeredCount = Object.keys(positions).length;
  const totalPolicies = topicList.reduce((acc, t) => acc + t.policies.length, 0);

  return (
    <div style={{ maxWidth: 840, margin: '0 auto' }}>
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="row between">
          <div>
            <h1>Minhas Políticas Públicas</h1>
            <p className="muted">
              Defina como você se posiciona sobre temas concretos. O sistema confrontará essas escolhas com as
              votações reais dos parlamentares.
            </p>
          </div>
          <KindBadge kind="USER" />
        </div>
        <div className="row between" style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <span className="small muted">
            {answeredCount} de {totalPolicies} políticas respondidas · Dados estritamente privados (LGPD)
          </span>
          <span className="badge badge-user">Somente você vê</span>
        </div>
      </div>

      {saveSuccess && (
        <div className="alert alert-success" style={{ marginBottom: 16 }}>
          ✓ Suas posições foram salvas com sucesso! A compatibilidade com os parlamentares já foi recalculada.
        </div>
      )}
      {saveError && (
        <div className="alert alert-error" style={{ marginBottom: 16 }}>
          {saveError}
        </div>
      )}

      {topicList.length === 0 ? (
        <Empty>Nenhum tema cadastrado no momento.</Empty>
      ) : (
        <div className="stack">
          {topicList.map((topic: PolicyTopic) => (
            <section key={topic.id} className="card">
              <h2 style={{ fontSize: '1.2rem', marginBottom: 4 }}>{topic.name}</h2>
              {topic.description && <p className="muted small" style={{ marginBottom: 16 }}>{topic.description}</p>}

              <div className="stack">
                {topic.policies.map((pol) => {
                  const currentPos = positions[pol.id];
                  return (
                    <div key={pol.id} className="policy-row">
                      <div style={{ flex: 1, minWidth: 260 }}>
                        <strong>{pol.name}</strong>
                        {pol.description && <p className="muted small" style={{ margin: '2px 0 0' }}>{pol.description}</p>}
                      </div>
                      <div className="segmented">
                        <button
                          type="button"
                          className={currentPos === 'AGREE' ? 'on-agree' : ''}
                          onClick={() => handlePositionChange(pol.id, 'AGREE')}
                        >
                          {currentPos === 'AGREE' ? '✓ Concordo' : 'Concordo'}
                        </button>
                        <button
                          type="button"
                          className={currentPos === 'DISAGREE' ? 'on-disagree' : ''}
                          onClick={() => handlePositionChange(pol.id, 'DISAGREE')}
                        >
                          {currentPos === 'DISAGREE' ? '✕ Discordo' : 'Discordo'}
                        </button>
                        <button
                          type="button"
                          className={currentPos === 'NEUTRAL' ? 'on-neutral' : ''}
                          onClick={() => handlePositionChange(pol.id, 'NEUTRAL')}
                        >
                          Neutro
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="sticky-save">
        {dirty && <span className="small muted">Você tem alterações não salvas.</span>}
        <button
          className="btn btn-primary"
          style={{ minWidth: 160 }}
          disabled={saving || !dirty}
          onClick={handleSave}
        >
          {saving ? 'Salvando…' : 'Salvar posições'}
        </button>
      </div>
    </div>
  );
}
