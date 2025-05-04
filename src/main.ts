import '@unocss/reset/tailwind.css';
import { createHead } from '@vueuse/head';
import { createPinia } from 'pinia';
import 'virtual:uno.css';
import { createApp } from 'vue';
import Toast, { POSITION, type PluginOptions } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import { VueFire, VueFireAuth } from 'vuefire';
import App from './App.vue';
import { firebaseApp } from './firebase';
import i18n from './i18n';
import router from './router';

const app = createApp(App);
const head = createHead();

app.use(head);
app.use(createPinia());
app.use(router);

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
  closeButton: 'button',
  icon: true,
  rtl: false,
};

app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
});

app.use(Toast, options);

app.use(i18n);

app.mount('#app');
