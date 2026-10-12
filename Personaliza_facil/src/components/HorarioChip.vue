<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ hora: string; vagas: number; max: number }>()

// 3 estados visuais: esgotado (0), poucas vagas (metade ou menos) e livre (mais da metade).
const nivel = computed(() =>
  props.vagas === 0 ? 'esgotado' : props.vagas / props.max > 0.5 ? 'livre' : 'poucas')
// A barrinha de baixo cresce com as vagas e fica encostada à direita, como no exemplo.
const largura = computed(() => Math.min(100, (props.vagas / props.max) * 100) + '%')
const descricao = computed(() =>
  props.vagas === 0 ? `${props.hora}: esgotado` : `${props.hora}: ${props.vagas} itens disponíveis`)
</script>

<template>
  <li class="slot" :class="nivel" :title="descricao" :aria-label="descricao">
    <span class="slot-hora">{{ hora }}</span>
    <span class="slot-itens">
      <span class="caixa">
        <!-- Caixa de presente em SVG: as cores vêm de variáveis CSS do estado (livre/poucas/esgotado) -->
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <path d="M20 13 C14 2 6 7 12 13 Z M20 13 C26 2 34 7 28 13 Z" class="laco" />
          <rect x="5" y="13" width="30" height="7" rx="1.5" class="tampa" />
          <rect x="7" y="20" width="26" height="16" rx="1.5" class="corpo" />
          <rect x="18" y="13" width="4" height="23" class="fita" />
        </svg>
        <b v-if="vagas">{{ vagas }}</b>
        <em v-else>ESGOTADO</em>
      </span>
      <small>itens</small>
    </span>
    <i class="slot-barra" :style="{ width: largura }"></i>
  </li>
</template>
