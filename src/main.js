import Vue from 'vue';
import { Message, MessageBox } from 'element-ui';
import Furoshiki from 'furoshiki';
import App from './views/app';
import router from './router';
import store from './store';
import './assets/scss/index.scss';

Vue.config.productionTip = false;
Vue.use(Furoshiki);

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
Vue.prototype.$messageBox = MessageBox;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store,
});
