import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { HORARIOS, CAPACIDADE, PRODUTOS_INICIAIS, CANCELADO } from '../config/negocio'
import { paraISO } from '../utils/datas'
import type { Pedido, Rascunho, Cliente, NovoCliente, Produto, SituacaoDia,
              Resultado, ResultadoCliente, ResultadoConfirmacao } from '../types'

// Um ref que se salva sozinho no localStorage (nosso "banco de dados" provisório).
function persistente<T>(chave: string, inicial: () => T): Ref<T> {
  const salvo = localStorage.getItem(chave)
  const r = ref(salvo ? JSON.parse(salvo) : inicial()) as Ref<T>
  watch(r, v => localStorage.setItem(chave, JSON.stringify(v)), { deep: true })
  return r
}

function gerarDias(): string[] {
  const dias: string[] = []
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  while (dias.length < CAPACIDADE.diasAFrente) {
    d.setDate(d.getDate() + 1)
    if (CAPACIDADE.diasUteis.includes(d.getDay())) dias.push(paraISO(d))
  }
  return dias
}

const CLIENTE_DEMO: Cliente = { id: 'demo', nome: 'Reserva de exemplo', telefone: '', email: '' }

function gerarDemo(dias: string[]): Pedido[] {
  const lista: Pedido[] = []
  dias.slice(0, 8).forEach((data, i) => {
    let totalDia = 0
    HORARIOS.forEach((hora, j) => {
      const quantidade = ((i * 7 + j * 13) % 5) * 10
      if (!quantidade || totalDia + quantidade > CAPACIDADE.porDia) return
      totalDia += quantidade
      lista.push({ codigo: `DEMO-${i}${j}`, clienteId: 'demo', produtoId: 'caneca', precoUnitario: 29.9,
                   quantidade, data, hora, status: 0 })
    })
  })
  return lista
}

const novoRascunho = (): Rascunho => ({ produtoId: null, quantidade: 10, data: null, hora: null })
const soDigitos = (s: string) => s.replace(/\D/g, '')

export const usePedidosStore = defineStore('pedidos', () => {
  const dias = gerarDias()
  const produtos = persistente<Produto[]>('personalizados-v2-produtos', () => PRODUTOS_INICIAIS.map(p => ({ ...p })))
  const clientes = persistente<Cliente[]>('personalizados-v2-clientes', () => [{ ...CLIENTE_DEMO }])
  const pedidos = persistente<Pedido[]>('personalizados-v2-pedidos', () => gerarDemo(dias))
  const rascunho = ref<Rascunho>(novoRascunho())

  // ---- Consultas ----
  const produtosAtivos = computed(() => produtos.value.filter(p => p.ativo))
  const produtoPorId = (id: string | null) => produtos.value.find(p => p.id === id)
  const clientePorId = (id: string | null) => clientes.value.find(c => c.id === id)
  const nomeCliente = (id: string) => clientePorId(id)?.nome ?? '—'
  const buscar = (codigo: string): Pedido | undefined => pedidos.value.find(p => p.codigo === codigo)

  // ---- Capacidade (o coração do sistema) ----
  // Pedido cancelado não conta: cancelar libera as vagas automaticamente.
  const somar = (filtro: (p: Pedido) => boolean): number =>
    pedidos.value.filter(p => p.status !== CANCELADO && filtro(p)).reduce((s, p) => s + p.quantidade, 0)
  const usadoNoDia = (data: string) => somar(p => p.data === data)
  const usadoNoHorario = (data: string, hora: string) => somar(p => p.data === data && p.hora === hora)
  const restanteDia = (data: string) => Math.max(0, CAPACIDADE.porDia - usadoNoDia(data))

  // Vagas reais = o MENOR entre o que sobra no horário e o que sobra no dia.
  const disponivel = (data: string, hora: string): number =>
    Math.max(0, Math.min(CAPACIDADE.porHorario - usadoNoHorario(data, hora), restanteDia(data)))

  const situacaoDia = (data: string): SituacaoDia => {
    const r = restanteDia(data)
    return r === 0 ? 'lotado' : r <= CAPACIDADE.porDia * 0.25 ? 'poucas' : 'livre'
  }

  // ---- Clientes ----
  function cadastrarCliente(dados: NovoCliente): ResultadoCliente {
    const nome = dados.nome.trim(), email = dados.email.trim().toLowerCase(), tel = soDigitos(dados.telefone)
    const usuario = dados.usuario?.trim() ?? '', senha = dados.senha ?? ''
    if (nome.length < 2) return { ok: false, erro: 'Informe o nome completo.' }
    if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, erro: 'E-mail inválido.' }
    if (tel.length < 10) return { ok: false, erro: 'Telefone inválido (informe o DDD).' }
    if (usuario.length < 3) return { ok: false, erro: 'O nome de usuário deve ter pelo menos 3 caracteres.' }
    if (senha.length < 6) return { ok: false, erro: 'A senha deve ter pelo menos 6 caracteres.' }
    if (clientes.value.some(c => c.email === email || soDigitos(c.telefone) === tel))
      return { ok: false, erro: 'Já existe um cliente com esse e-mail ou telefone.' }
    if (clientes.value.some(c => c.usuario?.toLowerCase() === usuario.toLowerCase()))
      return { ok: false, erro: 'Esse nome de usuário já está em uso.' }
    const cliente: Cliente = { id: 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
                               nome, email, telefone: dados.telefone.trim(), usuario, senha }
    clientes.value.push(cliente)
    return { ok: true, cliente }
  }

  function autenticarCliente(usuario: string, senha: string): Cliente | undefined {
    const nomeUsuario = usuario.trim().toLowerCase()
    return clientes.value.find(c => c.usuario?.toLowerCase() === nomeUsuario && c.senha === senha)
  }

  // ---- Produtos ----
  function adicionarProduto(dados: { nome: string; emoji: string; preco: number }): Resultado {
    const nome = dados.nome.trim()
    if (nome.length < 2) return { ok: false, erro: 'Informe o nome do produto.' }
    if (!(dados.preco > 0)) return { ok: false, erro: 'O preço deve ser maior que zero.' }
    produtos.value.push({ id: 'p' + Date.now().toString(36), nome, emoji: dados.emoji.trim() || '🎁',
                          preco: dados.preco, ativo: true })
    return { ok: true }
  }

  // ---- Pedidos ----
  function confirmar(clienteId: string): ResultadoConfirmacao {
    const { produtoId, quantidade, data, hora } = rascunho.value
    if (!produtoId || !data || !hora) return { ok: false, erro: 'Pedido incompleto. Escolha produto, data e horário.' }
    const produto = produtoPorId(produtoId)
    if (!produto || !produto.ativo) return { ok: false, erro: 'Esse produto não está mais disponível.' }
    // Nunca confie só nos campos da tela: valida de novo aqui.
    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > CAPACIDADE.porHorario)
      return { ok: false, erro: `A quantidade deve estar entre 1 e ${CAPACIDADE.porHorario}.` }
    // Revalida a capacidade na hora de gravar: outra pessoa pode ter ocupado a vaga.
    if (disponivel(data, hora) < quantidade)
      return { ok: false, erro: 'Esse horário não tem mais vagas para essa quantidade. Escolha outro.' }
    const codigo = 'PED-' + Math.random().toString(36).slice(2, 7).toUpperCase()
    pedidos.value.push({ codigo, clienteId, produtoId, precoUnitario: produto.preco, quantidade, data, hora, status: 0 })
    rascunho.value = novoRascunho()
    return { ok: true, codigo }
  }

  function definirStatus(codigo: string, status: number): Resultado {
    const p = buscar(codigo)
    if (!p) return { ok: false, erro: 'Pedido não encontrado.' }
    // Reativar um pedido cancelado devolve a quantidade à agenda, então precisa caber de novo.
    if (p.status === CANCELADO && status !== CANCELADO && disponivel(p.data, p.hora) < p.quantidade)
      return { ok: false, erro: 'Não há mais capacidade nesse horário para reativar o pedido.' }
    p.status = status
    return { ok: true }
  }

  const reiniciar = () => {
    produtos.value = PRODUTOS_INICIAIS.map(p => ({ ...p }))
    clientes.value = [{ ...CLIENTE_DEMO }]
    pedidos.value = gerarDemo(dias)
    rascunho.value = novoRascunho()
  }

  return { dias, produtos, clientes, pedidos, rascunho, produtosAtivos, produtoPorId, clientePorId, nomeCliente,
           buscar, usadoNoDia, usadoNoHorario, restanteDia, disponivel, situacaoDia,
           cadastrarCliente, autenticarCliente, adicionarProduto, confirmar, definirStatus, reiniciar }
})
