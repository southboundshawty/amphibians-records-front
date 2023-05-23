import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import axios from 'axios';
import VueAxios from 'vue-axios';

import moment from 'moment';
import { createApp } from 'vue';

import ElementPlus from 'element-plus';
import Http from '@/api';
import App from './App.vue';
import router from './router';
import store from './store';
import 'element-plus/theme-chalk/dark/css-vars.css';
import '@/assets/style/element/index.scss';
import '@/assets/style/index.scss';
import { getFormErrorMessage } from './plugins/vuelidate-errors';

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.config.globalProperties.$axios = Http;
app.config.globalProperties.$moment = moment;
app.config.globalProperties.$errorsMessages = getFormErrorMessage;
app.config.globalProperties.LONG_DASH = '—';
// app.provide('$axios', Http);
// app.provide('$errorsMessages', getFormErrorMessage);
// app.provide('$moment', moment);
// app.config.globalProperties.$http = Http;
app.use(store).use(router).use(ElementPlus).use(VueAxios, axios)
  .mount('#app');
