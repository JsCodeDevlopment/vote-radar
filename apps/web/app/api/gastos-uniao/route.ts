import { NextResponse } from 'next/server';
import { getFederalBudgetData, getAllRecipients } from '@/lib/federalBudgetData';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const yearParam = searchParams.get('ano');
  const areaParam = searchParams.get('area');
  const queryParam = searchParams.get('q')?.toLowerCase().trim();
  const syncParam = searchParams.get('sync') === 'true';

  const year = yearParam ? parseInt(yearParam, 10) : 2025;
  const budgetData = getFederalBudgetData(year);

  let liveGovStatus = {
    connected: false,
    latencyMs: 0,
    ckanPackagesCount: 20,
    lastGovUpdate: budgetData.lastUpdated,
    serverTimestamp: new Date().toISOString(),
  };

  // Se solicitado ou no carregamento, faz uma checagem ativa na API do Tesouro Transparente
  if (syncParam || true) {
    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(
        'https://www.tesourotransparente.gov.br/ckan/api/3/action/package_search?q=despesas&rows=2',
        {
          signal: controller.signal,
          headers: {
            'User-Agent': 'VoteRadar-CivicTracker/1.0',
            Accept: 'application/json',
          },
          next: { revalidate: 3600 },
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        const latency = Date.now() - startTime;
        const mostRecentPackage = json?.result?.results?.[0];
        liveGovStatus = {
          connected: true,
          latencyMs: latency,
          ckanPackagesCount: json?.result?.count || 20,
          lastGovUpdate: mostRecentPackage?.metadata_modified
            ? new Date(mostRecentPackage.metadata_modified).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : budgetData.lastUpdated,
          serverTimestamp: new Date().toISOString(),
        };
      }
    } catch {
      // Fallback gracioso mantendo os dados consolidados da STN
      liveGovStatus.connected = false;
    }
  }

  // Filtragem seletiva se parâmetros forem fornecidos
  let filteredAreas = budgetData.areas;
  if (areaParam && areaParam !== 'todos') {
    filteredAreas = filteredAreas.filter((a) => a.id === areaParam);
  }

  const allRecipients = getAllRecipients(budgetData);
  let filteredRecipients = allRecipients;

  if (areaParam && areaParam !== 'todos') {
    filteredRecipients = filteredRecipients.filter((r) => r.areaId === areaParam);
  }

  if (queryParam) {
    filteredRecipients = filteredRecipients.filter(
      (r) =>
        r.name.toLowerCase().includes(queryParam) ||
        r.document.toLowerCase().includes(queryParam) ||
        r.objectDescription.toLowerCase().includes(queryParam) ||
        r.actionName.toLowerCase().includes(queryParam) ||
        r.city.toLowerCase().includes(queryParam) ||
        r.uf.toLowerCase().includes(queryParam)
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: {
        ...budgetData,
        areas: filteredAreas,
        liveGovStatus,
      },
      recipients: filteredRecipients,
      totalRecipients: filteredRecipients.length,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
      },
    }
  );
}
