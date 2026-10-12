import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// Ordem importa: o Pinia precisa existir antes do router (o guard usa as stores).
createApp(App).use(createPinia()).use(router).mount('#app')
