export interface Produto { id: string; nome: string; emoji: string; preco: number; ativo: boolean }
export interface Cliente {
  id: string
  nome: string
  telefone: string
  email: string
  usuario?: string
  senha?: string
}
export type NovoCliente = Omit<Cliente, 'id'>

export interface Pedido {
  codigo: string
  clienteId: string
  produtoId: string
  precoUnitario: number // "foto" do preço no momento da compra
  quantidade: number
  data: string          // "AAAA-MM-DD"
  hora: string          // "HH:MM"
  status: number        // índice em STATUS
  descricaoPersonalizacao?: string
  imagemReferencia?: string | null
}

// O pedido "em construção": os campos começam nulos e são preenchidos etapa a etapa.
export interface Rascunho {
  produtoId: string | null
  quantidade: number
  data: string | null
  hora: string | null
  descricaoPersonalizacao: string
  imagemReferencia: string | null
}

export type SituacaoDia = 'livre' | 'poucas' | 'lotado'
export type Resultado = { ok: true } | { ok: false; erro: string }
export type ResultadoCliente = { ok: true; cliente: Cliente } | { ok: false; erro: string }
export type ResultadoConfirmacao = { ok: true; codigo: string } | { ok: false; erro: string }
