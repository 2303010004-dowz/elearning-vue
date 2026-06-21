import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css' // Mengaktifkan Tailwind

const app = createApp(App)

app.use(router) // Mengaktifkan Vue Router

app.mount('#app')