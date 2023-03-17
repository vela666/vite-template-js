import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@/styles/index.scss'
/*import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'*/

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
