import Vue from 'vue';
import Axios from 'axios';
import { Message } from 'element-ui';
import App from './App';
import router from './router';
import store from './store';
import config from './assets/js/config';

Vue.config.productionTip = false;
Axios.defaults.baseURL = config.baseUri;
Axios.interceptors.request.use((request) => {
  const req = Object.assign({}, request);
  if (store.state.auth.token) {
    req.headers.Authorization = store.state.auth.token;
  }
  return req;
}, error => Promise.reject(error));
Axios.interceptors.response.use(response => response, error => Promise.reject(error));
Vue.prototype.$message = (options) => {
  const option = Object.assign({}, options, { duration: 500 });
  return Message(option);
};
Vue.prototype.$message.error = (err) => {
  const option = {
    message: err,
    duration: 2000,
    type: 'error',
  };
  return Message(option);
};

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store,
});
