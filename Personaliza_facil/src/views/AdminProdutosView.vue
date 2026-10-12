<script setup lang="ts">
import { reactive, ref } from 'vue'
import { usePedidosStore } from '../stores/pedidos'
import AdminNav from '../components/AdminNav.vue'

const store = usePedidosStore()
const novo = reactive({ nome: '', emoji: '', preco: 0 })
const erro = ref('')

function adicionar() {
  const r = store.adicionarProduto(novo)
  erro.value = r.ok ? '' : r.erro
  if (r.ok) { novo.nome = ''; novo.emoji = ''; novo.preco = 0 }
}
</script>

<template>
  <section>
    <h1>Administração</h1>
    <AdminNav />
    <h2>Cadastrar produto</h2>
    <form class="busca" @submit.prevent="adicionar">
      <input v-model="novo.nome" placeholder="Nome" />
      <input v-model="novo.emoji" placeholder="Emoji" style="max-width: 90px" />
      <input v-model.number="novo.preco" type="number" min="0" step="0.01" placeholder="Preço" style="max-width: 120px" />
      <button class="btn">Adicionar</button>
    </form>
    <p v-if="erro" class="erro">{{ erro }}</p>

    <h2>Catálogo</h2>
    <div class="rolagem">
      <table class="tabela">
        <thead><tr><th></th><th>Produto</th><th>Preço (R$)</th><th>À venda</th></tr></thead>
        <tbody>
          <tr v-for="p in store.produtos" :key="p.id">
            <td>{{ p.emoji }}</td>
            <td><input v-model="p.nome" /></td>
            <td><input v-model.number="p.preco" type="number" min="0" step="0.01" style="max-width: 110px" /></td>
            <td><label><input v-model="p.ativo" type="checkbox" /> {{ p.ativo ? 'Sim' : 'Não' }}</label></td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="sub">Desativar um produto o tira da tela de pedidos, mas os pedidos já feitos continuam intactos.</p>
  </section>
</template>
