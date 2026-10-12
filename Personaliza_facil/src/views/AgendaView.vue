<script setup lang="ts">
import { computed } from 'vue'
import { HORARIOS } from '../config/negocio'
import { useRouter } from 'vue-router'
import { usePedidosStore } from '../stores/pedidos'
import { curto, longo } from '../utils/datas'
import StepBar from '../components/StepBar.vue'

const store = usePedidosStore()
const router = useRouter()
const r = store.rascunho

// Um dia só fica clicável se ALGUM horário comporta a quantidade pedida.
const diaTemVaga = (d: string) => HORARIOS.some(h => store.disponivel(d, h) >= r.quantidade)
const escolherDia = (d: string) => { r.data = d; r.hora = null }
// r.data pode ser null, e o TS não mantém essa checagem dentro de um v-for; por isso estas funções.
const vagas = (hora: string) => (r.data ? store.disponivel(r.data, hora) : 0)
const dataLonga = computed(() => (r.data ? longo(r.data) : ''))
</script>

<template>
  <section>
    <StepBar :atual="2" />
    <h1>Quando você quer receber as {{ r.quantidade }} peças?</h1>

    <h2>Dia</h2>
    <div class="chips">
      <button v-for="d in store.dias" :key="d" class="chip" :class="{ ativo: r.data === d }"
              :disabled="!diaTemVaga(d)" @click="escolherDia(d)">
        {{ curto(d) }}
        <small v-if="!diaTemVaga(d)">sem vaga</small>
      </button>
    </div>

    <template v-if="r.data">
      <h2>Horário em {{ dataLonga }}</h2>
      <div class="chips">
        <button v-for="h in HORARIOS" :key="h" class="chip" :class="{ ativo: r.hora === h }"
                :disabled="vagas(h) < r.quantidade" @click="r.hora = h">
          {{ h }}
          <small>{{ vagas(h) < r.quantidade ? 'indisponível' : `restam ${vagas(h)}` }}</small>
        </button>
      </div>
    </template>

    <div class="acoes">
      <button class="btn secundario" @click="router.push({ name: 'produto' })">Voltar</button>
      <button class="btn" :disabled="!r.data || !r.hora" @click="router.push({ name: 'resumo' })">
        Revisar pedido
      </button>
    </div>
  </section>
</template>
