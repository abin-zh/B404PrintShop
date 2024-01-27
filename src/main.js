import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import { ElMessage } from 'element-plus';
//element-plus 暗黑主题 https://element-plus.org/zh-CN/guide/dark-mode.html#%E5%A6%82%E4%BD%95%E5%90%AF%E7%94%A8%EF%BC%9F
import 'element-plus/theme-chalk/dark/css-vars.css';
//引入message组件样式
//https://juejin.cn/post/7114295680339804173
import 'element-plus/theme-chalk/src/message-box.scss';
import 'element-plus/theme-chalk/src/message.scss';

import './style.css'

const app = createApp(App)

//创建pinia实例
const pinia = createPinia()
//pinia.use(pinaPluginPersistedstate)

//挂载路由
app.use(router)
//挂载pinia
app.use(pinia)

app.mount('#app')