<script setup lang="ts">
defineProps<{ atual: number }>()
const etapas = ['Produto', 'Data e horário', 'Confirmação']
</script>

<template>
  <ol class="etapas">
    <li v-for="(nome, i) in etapas" :key="nome"
        :class="{ feita: i + 1 < atual, atual: i + 1 === atual }">
      <span>{{ i + 1 }}</span> {{ nome }}
    </li>
  </ol>
</template>
