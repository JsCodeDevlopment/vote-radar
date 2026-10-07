'use client';

import { Bar, ErrorState, KindBadge, Loading, SourceLink, Stat } from '@/components/ui';
import { useAsync } from '@/hooks/useAsync';
import { api } from '@/lib/api';

export function StaffTab({ politicianId }: { politicianId: string }) {
  const staff = useAsync(() => api.getPoliticianStaff(politicianId), [politicianId]);
  if (staff.loading) return <Loading />;
  if (staff.error) return <ErrorState error={staff.error} onRetry={staff.reload} />;
  const s = staff.data!;
  const max = Math.max(1, ...s.byRole.map((r) => r.count));

  return (
    <div className="card">
      <div className="row between">
        <div className="card-title">Gabinete</div>
        <KindBadge kind="OFFICIAL" />
      </div>
      <Stat value={s.total} label="servidores no gabinete" />
      <div style={{ marginTop: 12, maxWidth: 520 }}>
        {s.byRole.map((r) => (
          <Bar key={r.role} label={r.role} value={String(r.count)} ratio={r.count / max} />
        ))}
      </div>
      <p className="small muted">Dados pessoais de servidores não são exibidos; apenas a composição por função.</p>
      <SourceLink source={s.source} />
    </div>
  );
}
