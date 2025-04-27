import '@unocss/reset/tailwind.css'
import { createPinia } from 'pinia'
import 'virtual:uno.css'
import { createApp } from 'vue'
import { VueFire, VueFireAuth } from 'vuefire'
import App from './App.vue'
import { firebaseApp } from './firebase'
import router from './router'
import "vue-toastification/dist/index.css"
import Toast, { POSITION, type PluginOptions } from 'vue-toastification'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const options: PluginOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 2000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
  rtl: false
};

app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()]
})

app.use(Toast, options);

app.mount('#app')
