import { createApp } from 'vue'
// 添加状态管理（pinia）
import pinia from './stores'
import App from './App.vue'
import router from './router'
import './permission'
import '@/styles/index.scss'
/*import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'*/

const app = createApp(App)
app.use(pinia)
app.use(router)

app.mount('#app')
