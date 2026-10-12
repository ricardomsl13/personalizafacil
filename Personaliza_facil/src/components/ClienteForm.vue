<script setup lang="ts">
import { reactive, ref } from 'vue'
import { usePedidosStore } from '../stores/pedidos'
import type { Cliente } from '../types'

const emit = defineEmits<{ salvo: [cliente: Cliente] }>() // avisa a tela que usou o formulário
const store = usePedidosStore()
const f = reactive({ nome: '', telefone: '', email: '', usuario: '', senha: '' })
const erro = ref('')

function salvar() {
  const r = store.cadastrarCliente(f)
  if (!r.ok) { erro.value = r.erro; return }
  erro.value = ''
  emit('salvo', r.cliente)
  f.nome = f.telefone = f.email = f.usuario = f.senha = ''
}
</script>

<template>
  <form @submit.prevent="salvar">
    <label class="campo">Nome completo <input v-model="f.nome" autocomplete="name" /></label>
    <label class="campo">Nome de usuário <input v-model="f.usuario" autocomplete="username" /></label>
    <label class="campo">Senha <input v-model="f.senha" type="password" autocomplete="new-password" /></label>
    <label class="campo">E-mail <input v-model="f.email" type="email" autocomplete="email" /></label>
    <label class="campo">Telefone com DDD <input v-model="f.telefone" type="tel" autocomplete="tel" /></label>
    <p v-if="erro" class="erro">{{ erro }}</p>
    <div class="acoes"><button class="btn">Cadastrar cliente</button></div>
  </form>
</template>
