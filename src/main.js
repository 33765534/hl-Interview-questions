import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import './assets/css/base.css'
import './assets/css/normalize.css'

const app = createApp(App)


app.use(ElementPlus)

app.mount('#app')
