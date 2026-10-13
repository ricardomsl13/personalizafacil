<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CAPACIDADE } from '../config/negocio'
import { usePedidosStore } from '../stores/pedidos'
import { moeda } from '../utils/datas'
import StepBar from '../components/StepBar.vue'

const store = usePedidosStore()
const router = useRouter()
const r = store.rascunho
const max = CAPACIDADE.porHorario // um pedido precisa caber em UM horário
const erroImagem = ref('')
const nomeImagem = ref('')
const tamanhoMaximoImagem = 1024 * 1024

const valido = computed(() => !!r.produtoId && Number.isInteger(r.quantidade) &&
                              r.quantidade >= 1 && r.quantidade <= max &&
                              !!r.descricaoPersonalizacao.trim())

function carregarImagem(event: Event) {
  const input = event.target as HTMLInputElement
  const arquivo = input.files?.[0]
  erroImagem.value = ''
  r.imagemReferencia = null
  nomeImagem.value = ''
  if (!arquivo) return
  if (!arquivo.type.startsWith('image/')) {
    erroImagem.value = 'Selecione um arquivo de imagem.'
    input.value = ''
    return
  }
  if (arquivo.size > tamanhoMaximoImagem) {
    erroImagem.value = 'A imagem deve ter no máximo 1 MB.'
    input.value = ''
    return
  }

  nomeImagem.value = arquivo.name
  const leitor = new FileReader()
  leitor.onload = () => {
    if (typeof leitor.result === 'string') r.imagemReferencia = leitor.result
    else erroImagem.value = 'Não foi possível carregar a imagem. Tente novamente.'
  }
  leitor.onerror = () => { erroImagem.value = 'Não foi possível carregar a imagem. Tente novamente.' }
  leitor.readAsDataURL(arquivo)
}

function removerImagem() {
  r.imagemReferencia = null
  nomeImagem.value = ''
  erroImagem.value = ''
  const input = document.getElementById('imagem-referencia') as HTMLInputElement | null
  if (input) input.value = ''
}

function avancar() {
  r.data = null // a quantidade pode ter mudado, então a escolha de data anterior pode não valer mais
  r.hora = null
  router.push({ name: 'agenda' })
}
</script>

<template>
  <section>
    <StepBar :atual="1" />
    <h1>O que vamos personalizar?</h1>
    <div class="grade produtos">
      <label v-for="p in store.produtosAtivos" :key="p.id" class="card escolha" :class="{ ativo: r.produtoId === p.id }">
        <input type="radio" v-model="r.produtoId" :value="p.id" />
        <span class="emoji">{{ p.emoji }}</span>
        <strong>{{ p.nome }}</strong>
        <small>{{ moeda(p.preco) }} por unidade</small>
      </label>
    </div>

    <div class="pedido-personalizacao">
      <div class="coluna-quantidade">
        <label class="campo" for="quantidade-produto">
          <span class="rotulo-personalizacao">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4.3 7.6 7.7 4.3 7.7-4.3M12 12v9m-3.8-16.9 7.6 4.3v4.4"/></svg>
            <span>Quantidade <small>(de 1 a {{ max }} por pedido)</small><b aria-hidden="true"> *</b></span>
          </span>
          <input id="quantidade-produto" type="number" v-model.number="r.quantidade" min="1" :max="max" />
          <small class="ajuda-campo">Informe a quantidade de itens que deseja solicitar.</small>
        </label>
        <button class="btn avancar-produto" :disabled="!valido" @click="avancar">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h12l4 4v14H3V3h2Z"/><path d="M7 3v6h10V3M7 21v-8h10v8"/></svg>
          Escolher data e horário
        </button>
      </div>

      <div class="campos-personalizacao">
        <label class="campo" for="descricao-personalizacao">
          <span class="rotulo-personalizacao">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5 5 5M4 20l4.5-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20Z"/><path d="M3 22h18"/></svg>
            <span>Como você quer a personalização? <small>(obrigatório)</small><b aria-hidden="true"> *</b></span>
          </span>
          <textarea id="descricao-personalizacao" v-model="r.descricaoPersonalizacao" maxlength="1000" required
                    placeholder="Descreva cores, texto, estilo ou outros detalhes..."></textarea>
        </label>
        <small class="ajuda-campo exemplo-personalizacao">
          <span aria-hidden="true">ⓘ</span> Exemplo: cor azul, texto “Parabéns”, estilo minimalista, etc.
        </small>

        <div class="upload-referencia">
          <label class="rotulo-personalizacao" for="imagem-referencia">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/></svg>
            <span>Imagem de referência <small>(opcional)</small></span>
          </label>
          <label class="escolher-arquivo">
            <input id="imagem-referencia" type="file" accept="image/jpeg,image/png,image/gif" @change="carregarImagem" />
            <span class="botao-arquivo">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 12.5 7.1-7.1a3 3 0 0 1 4.2 4.2L9.4 19.5a5 5 0 0 1-7.1-7.1L13 1.7"/></svg>
              Escolher arquivo
            </span>
            <span class="nome-arquivo">{{ nomeImagem || 'Nenhum arquivo escolhido' }}</span>
          </label>
          <small class="ajuda-campo">
            <span aria-hidden="true">ⓘ</span> Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 1 MB.
          </small>
        </div>
        <p v-if="erroImagem" class="erro" role="alert">{{ erroImagem }}</p>
        <div v-if="r.imagemReferencia" class="referencia-imagem">
          <img :src="r.imagemReferencia" alt="Prévia da imagem de referência" />
          <button class="link" type="button" @click="removerImagem">Remover imagem</button>
        </div>
      </div>
    </div>
  </section>
</template>
