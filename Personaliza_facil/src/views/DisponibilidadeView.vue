<script setup lang="ts">
import { HORARIOS, CAPACIDADE } from '../config/negocio'
import { usePedidosStore } from '../stores/pedidos'
import { curto } from '../utils/datas'
import HorarioChip from '../components/HorarioChip.vue'
const store = usePedidosStore()
const rotulo = { livre: 'Livre', poucas: 'Poucas vagas', lotado: 'Lotado' }
</script>

<template>
  <section>
    <h1>Quando podemos produzir o seu pedido?</h1>
    <p class="sub">Cada dia comporta {{ CAPACIDADE.porDia }} peças, e cada horário até {{ CAPACIDADE.porHorario }}.</p>
    <RouterLink class="btn" to="/pedido/produto">Fazer um pedido</RouterLink>

    <div class="grade dias">
      <article v-for="dia in store.dias" :key="dia" class="card">
        <header class="linha">
          <strong>{{ curto(dia) }}</strong>
          <span class="selo" :class="store.situacaoDia(dia)">{{ rotulo[store.situacaoDia(dia)] }}</span>
        </header>
        <div class="barra"><i :class="store.situacaoDia(dia)"
             :style="{ width: (store.usadoNoDia(dia) / CAPACIDADE.porDia * 100) + '%' }"></i></div>
        <small>{{ store.restanteDia(dia) }} de {{ CAPACIDADE.porDia }} peças livres</small>
        <ul class="horarios">
          <HorarioChip v-for="h in HORARIOS" :key="h" :hora="h"
                       :vagas="store.disponivel(dia, h)" :max="CAPACIDADE.porHorario" />
        </ul>
      </article>
    </div>
  </section>
</template>
