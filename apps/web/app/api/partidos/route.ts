import { NextResponse } from 'next/server';

interface PartyData {
  sigla: string;
  nome: string;
  logoUrl: string;
  color?: string;
  numero?: number;
}

const PARTIES_REGISTRY: Record<string, PartyData> = {
  PT: {
    sigla: 'PT',
    nome: 'Partido dos Trabalhadores',
    logoUrl: '/partidos/pt.svg',
    color: '#CC0000',
    numero: 13,
  },
  PL: {
    sigla: 'PL',
    nome: 'Partido Liberal',
    logoUrl: '/partidos/pl.svg',
    color: '#002776',
    numero: 22,
  },
  UNIÃO: {
    sigla: 'UNIÃO',
    nome: 'União Brasil',
    logoUrl: '/partidos/uniao.svg',
    color: '#002B49',
    numero: 44,
  },
  UNIAO: {
    sigla: 'UNIÃO',
    nome: 'União Brasil',
    logoUrl: '/partidos/uniao.svg',
    color: '#002B49',
    numero: 44,
  },
  PSD: {
    sigla: 'PSD',
    nome: 'Partido Social Democrático',
    logoUrl: '/partidos/psd.svg',
    color: '#005CAA',
    numero: 55,
  },
  MDB: {
    sigla: 'MDB',
    nome: 'Movimento Democrático Brasileiro',
    logoUrl: '/partidos/mdb.svg',
    color: '#008000',
    numero: 15,
  },
  PP: {
    sigla: 'PP',
    nome: 'Progressistas',
    logoUrl: '/partidos/pp.svg',
    color: '#005A9C',
    numero: 11,
  },
  REPUBLICANOS: {
    sigla: 'REPUBLICANOS',
    nome: 'Republicanos',
    logoUrl: '/partidos/republicanos.svg',
    color: '#0C2340',
    numero: 10,
  },
  PSDB: {
    sigla: 'PSDB',
    nome: 'Partido da Social Democracia Brasileira',
    logoUrl: '/partidos/psdb.svg',
    color: '#004A97',
    numero: 45,
  },
  PSOL: {
    sigla: 'PSOL',
    nome: 'Partido Socialismo e Liberdade',
    logoUrl: '/partidos/psol.svg',
    color: '#F59E0B',
    numero: 50,
  },
  NOVO: {
    sigla: 'NOVO',
    nome: 'Partido Novo',
    logoUrl: '/partidos/novo.svg',
    color: '#FF5E00',
    numero: 30,
  },
  PDT: {
    sigla: 'PDT',
    nome: 'Partido Democrático Trabalhista',
    logoUrl: '/partidos/pdt.gif',
    color: '#C4122D',
    numero: 12,
  },
  PSB: {
    sigla: 'PSB',
    nome: 'Partido Socialista Brasileiro',
    logoUrl: '/partidos/psb.gif',
    color: '#E2001A',
    numero: 40,
  },
  PODE: {
    sigla: 'PODE',
    nome: 'Podemos',
    logoUrl: '/partidos/pode.svg',
    color: '#5F259F',
    numero: 20,
  },
  PODEMOS: {
    sigla: 'PODE',
    nome: 'Podemos',
    logoUrl: '/partidos/pode.svg',
    color: '#5F259F',
    numero: 20,
  },
  PV: {
    sigla: 'PV',
    nome: 'Partido Verde',
    logoUrl: '/partidos/pv.gif',
    color: '#00843D',
    numero: 43,
  },
  PCDOB: {
    sigla: 'PCdoB',
    nome: 'Partido Comunista do Brasil',
    logoUrl: '/partidos/pcdob.svg',
    color: '#C8102E',
    numero: 65,
  },
  'PC DO B': {
    sigla: 'PCdoB',
    nome: 'Partido Comunista do Brasil',
    logoUrl: '/partidos/pcdob.svg',
    color: '#C8102E',
    numero: 65,
  },
  REDE: {
    sigla: 'REDE',
    nome: 'Rede Sustentabilidade',
    logoUrl: '/partidos/rede.svg',
    color: '#00A88F',
    numero: 18,
  },
  AVANTE: {
    sigla: 'AVANTE',
    nome: 'Avante',
    logoUrl: '/partidos/avante.gif',
    color: '#003399',
    numero: 70,
  },
  SOLIDARIEDADE: {
    sigla: 'SOLIDARIEDADE',
    nome: 'Solidariedade',
    logoUrl: '/partidos/solidariedade.svg',
    color: '#FF7F00',
    numero: 77,
  },
  PRD: {
    sigla: 'PRD',
    nome: 'Partido Renovação Democrática',
    logoUrl: '/partidos/prd.svg',
    color: '#002D62',
    numero: 25,
  },
  CIDADANIA: {
    sigla: 'CIDADANIA',
    nome: 'Cidadania',
    logoUrl: '/partidos/cidadania.svg',
    color: '#E40046',
    numero: 23,
  },
  AGIR: {
    sigla: 'AGIR',
    nome: 'Agir',
    logoUrl: '/partidos/agir.png',
    color: '#00A859',
    numero: 36,
  },
  PMB: {
    sigla: 'PMB',
    nome: 'Partido da Mulher Brasileira',
    logoUrl: '/partidos/pmb.png',
    color: '#002B49',
    numero: 35,
  },
  DC: {
    sigla: 'DC',
    nome: 'Democracia Cristã',
    logoUrl: '/partidos/dc.png',
    color: '#002B49',
    numero: 27,
  },
  PRTB: {
    sigla: 'PRTB',
    nome: 'Partido Renovador Trabalhista Brasileiro',
    logoUrl: '/partidos/prtb.png',
    color: '#002B49',
    numero: 28,
  },
  PTB: {
    sigla: 'PTB',
    nome: 'Partido Trabalhista Brasileiro',
    logoUrl: '/partidos/ptb.png',
    color: '#CC0000',
    numero: 14,
  },
  PSC: {
    sigla: 'PSC',
    nome: 'Partido Social Cristão',
    logoUrl: '/partidos/psc.png',
    color: '#005CAA',
    numero: 20,
  },
  PROS: {
    sigla: 'PROS',
    nome: 'Partido Republicano da Ordem Social',
    logoUrl: '/partidos/pros.png',
    color: '#FF6600',
    numero: 90,
  },
  PMN: {
    sigla: 'PMN',
    nome: 'Partido da Mobilização Nacional',
    logoUrl: '/partidos/pmn.png',
    color: '#CC0000',
    numero: 33,
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sigla = searchParams.get('sigla');

  if (sigla) {
    const key = sigla.toUpperCase().trim();
    const party = PARTIES_REGISTRY[key];
    if (party) {
      return NextResponse.json(party, {
        headers: { 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' },
      });
    }
    return NextResponse.json(
      { sigla: key, nome: key, logoUrl: null },
      { status: 404, headers: { 'Cache-Control': 'public, max-age=3600' } }
    );
  }

  return NextResponse.json(PARTIES_REGISTRY, {
    headers: { 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' },
  });
}
