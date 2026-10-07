const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const brlCompact = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});
const num = new Intl.NumberFormat('pt-BR');

export function formatBRL(cents: number, compact = false): string {
  return (compact ? brlCompact : brl).format(cents / 100);
}

export function formatNumber(n: number): string {
  return num.format(n);
}

export function formatPercent(ratio: number | null | undefined): string {
  if (ratio === null || ratio === undefined || Number.isNaN(ratio)) return '—';
  return `${Math.round(ratio * 100)}%`;
}

export function formatDate(iso?: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

export function formatDateTime(iso?: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');
}

export function proposalLabel(p: { type: string; number: number; year: number }): string {
  return `${p.type} ${p.number}/${p.year}`;
}

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
export function monthLabel(month: number): string {
  return MONTHS[month - 1] ?? String(month);
}
