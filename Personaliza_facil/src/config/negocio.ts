import type { Produto } from '../types'

// Regras do negócio num só lugar: para mudar a capacidade, mexa SÓ aqui.
export const PRODUTOS_INICIAIS: Produto[] = [
  { id: 'caneca',   nome: 'Caneca',          emoji: '☕', preco: 29.9, ativo: true },
  { id: 'camiseta', nome: 'Camiseta',        emoji: '👕', preco: 39.9, ativo: true },
  { id: 'ecobag',   nome: 'Ecobag',          emoji: '👜', preco: 24.9, ativo: true },
  { id: 'garrafa',  nome: 'Garrafa térmica', emoji: '🧴', preco: 49.9, ativo: true },
]

export const HORARIOS: string[] = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']

export const CAPACIDADE = {
  porHorario: 40,            // peças que a produção dá conta por faixa de horário
  porDia: 200,               // peças por dia (menor que 7 × 40, então o dia também limita)
  diasAFrente: 14,
  diasUteis: [1, 2, 3, 4, 5, 6] as number[], // 0 = domingo ... 6 = sábado
}

export const STATUS: string[] = ['Recebido', 'Em produção', 'Pronto para retirada', 'Entregue', 'Cancelado']
export const CANCELADO = 4                 // pedido cancelado NÃO ocupa capacidade
export const ETAPAS = STATUS.slice(0, CANCELADO) // o caminho normal de um pedido

// Só para demonstração: autenticação real exige um servidor.
export const USUARIO_ADMIN = 'admin'
export const SENHA_ADMIN = 'admin123'
export const ADMIN_CLIENTE_ID = 'admin'
export const ADMIN_CLIENTE_NOME = 'Administrador'
