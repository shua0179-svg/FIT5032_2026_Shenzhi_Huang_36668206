import './assets/main.css'
// import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// PrimeVue 配置
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

const app = createApp(App)

app.use(router)

// 4.2 让整个 app 使用 PrimeVue，并选用 Aura 主题
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

app.mount('#app')
