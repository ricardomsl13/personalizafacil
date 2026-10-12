<script setup lang="ts">
import { ref } from 'vue'
import { HORARIOS, STATUS } from '../config/negocio'
import { usePedidosStore } from '../stores/pedidos'
import { curto } from '../utils/datas'

const store = usePedidosStore()
const log = ref<{ ok: boolean; texto: string }[]>([])
const codigo = ref('')
const rodando = ref(false)
const add = (ok: boolean, texto: string) => log.value.push({ ok, texto })
const pausa = (ms: number) => new Promise(r => setTimeout(r, ms))

// Percorre o fluxo inteiro chamando as mesmas funções que as telas usam.
async function executar() {
  rodando.value = true; log.value = []; codigo.value = ''
  const id = Date.now().toString(36)
  const c = store.cadastrarCliente({ nome: 'Cliente Demo', email: `demo-${id}@exemplo.com`, telefone: '71' + String(Date.now()).slice(-9) })
  const produto = store.produtosAtivos[0]
  if (!c.ok || !produto) { add(false, c.ok ? 'Nenhum produto ativo.' : c.erro); rodando.value = false; return }
  add(true, `1. Cliente cadastrado: ${c.cliente.nome}`); await pausa(700)

  const slot = store.dias.flatMap(d => HORARIOS.map(h => ({ d, h }))).find(s => store.disponivel(s.d, s.h) >= 20)
  if (!slot) { add(false, 'Nenhum horário com 20 vagas livres.'); rodando.value = false; return }
  add(true, `2. Disponibilidade: ${curto(slot.d)} às ${slot.h} tem ${store.disponivel(slot.d, slot.h)} vagas`); await pausa(700)

  Object.assign(store.rascunho, { produtoId: produto.id, quantidade: 20, data: slot.d, hora: slot.h })
  const r1 = store.confirmar(c.cliente.id)
  if (!r1.ok) { add(false, r1.erro); rodando.value = false; return }
  codigo.value = r1.codigo
  add(true, `3. Pedido ${r1.codigo} registrado: 20 × ${produto.nome}. Vagas restantes no horário: ${store.disponivel(slot.d, slot.h)}`); await pausa(700)

  Object.assign(store.rascunho, { produtoId: produto.id, quantidade: 40, data: slot.d, hora: slot.h })
  const r2 = store.confirmar(c.cliente.id)
  add(!r2.ok, r2.ok ? '4. ERRO: o sistema aceitou um pedido acima do limite!' : `4. Pedido de 40 peças no mesmo horário BLOQUEADO: ${r2.erro}`); await pausa(700)

  for (let s = 1; s <= 3; s++) {
    store.definirStatus(r1.codigo, s)
    add(true, `${4 + s}. Administrador altera o status para “${STATUS[s]}”`); await pausa(700)
  }
  add(true, '8. Fluxo completo: cadastro → disponibilidade → pedido → bloqueio por capacidade → produção → entrega')
  rodando.value = false
}
</script>

<template>
  <section>
    <h1>Demonstração do fluxo completo</h1>
    <p class="sub">Roda sozinha as etapas de um pedido, inclusive a tentativa de passar do limite de capacidade.</p>
    <button class="btn" :disabled="rodando" @click="executar">{{ rodando ? 'Executando…' : 'Executar demonstração' }}</button>

    <ul class="log">
      <li v-for="(l, i) in log" :key="i" :class="l.ok ? 'ok' : 'falha'">{{ l.ok ? '✓' : '✗' }} {{ l.texto }}</li>
    </ul>
    <RouterLink v-if="codigo && !rodando" class="btn secundario" :to="{ name: 'pedido', params: { codigo } }">Ver o pedido criado</RouterLink>

    <h2>Ou faça o roteiro manualmente</h2>
    <ol class="roteiro">
      <li><RouterLink to="/cadastro">Cadastre um cliente</RouterLink></li>
      <li><RouterLink to="/">Consulte a disponibilidade</RouterLink></li>
      <li><RouterLink to="/pedido/produto">Registre um pedido</RouterLink> (produto, quantidade, data e horário)</li>
      <li>Tente pedir 40 peças num horário com poucas vagas e veja o bloqueio</li>
      <li><RouterLink to="/entrar">Entre como administrador</RouterLink> (PIN admin123) e altere o status em <RouterLink to="/admin/pedidos">Pedidos</RouterLink></li>
      <li><RouterLink to="/acompanhar">Acompanhe</RouterLink> o andamento como cliente</li>
    </ol>
  </section>
</template>
