import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Furoshiki from 'furoshiki';
import App from './views/app';
import router from './router';
import store from './store';
import './assets/scss/index.scss';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(Furoshiki);

Vue.prototype.$message = options => {
  const option = Object.assign({}, options, { duration: 500 });
  return ElementUI.Message(option);
};
Vue.prototype.$message.error = err => {
  const option = {
    message: err,
    duration: 2000,
    type: 'error',
  };
  return ElementUI.Message(option);
};
Vue.prototype.$messageBox = ElementUI.MessageBox;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store,
});
