// Datas viajam como texto "AAAA-MM-DD" (fácil de comparar e de guardar).
export function paraISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${dia}`
}

// Cria a data no fuso local (new Date('2026-10-07') seria UTC e poderia cair no dia anterior).
export function deISO(iso: string): Date {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1, d)
}

export const curto = (iso: string) =>
  deISO(iso).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })

export const longo = (iso: string) =>
  deISO(iso).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })

export const moeda = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
