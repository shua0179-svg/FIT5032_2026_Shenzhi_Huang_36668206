import './assets/main.css'
// import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// PrimeVue 配置
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

// Firebase
import { initializeApp } from 'firebase/app'

const app = createApp(App)

app.use(router)

// 4.2 让整个 app 使用 PrimeVue，并选用 Aura 主题
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

app.mount('#app')

// ---- Firebase config ----
const firebaseConfig = {
  apiKey: 'AIzaSyD_Qhu1tmwFqOCYfjm4eei6ya4uGF0C_ec',
  authDomain: 'fit5032-f3735.firebaseapp.com',
  projectId: 'fit5032-f3735',
  storageBucket: 'fit5032-f3735.firebasestorage.app',
  messagingSenderId: '915200458647',
  appId: '1:915200458647:web:280bd716c248a5a73d0ed2',
  measurementId: 'G-TBCTBMTLE7',
}

initializeApp(firebaseConfig)
