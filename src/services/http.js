import axios from 'axios';
import store from '../store';

// 请求拦截
axios.interceptors.request.use((request) => {
  // 若用户已登录，则给请求头中带上令牌
  const req = Object.assign({}, request);
  if (store.state.auth.token) {
    req.headers.Authorization = store.state.auth.token;
  }
  return req;
}, err => Promise.reject(err));

// 响应拦截
axios.interceptors.response.use(response => response, (err) => {
  if (err.response) {
    switch (err.response.status) {
      case 400:
        /* eslint-disable no-alert */
        alert(err.response.data.message);
        break;
      case 401:
        window.location.href = '/login';
        alert(err.response.data.message);
        break;
      default:
        alert(err.response.data.message);
        break;
    }
  } else {
    alert(err.message);
  }
  return Promise.reject(err);
});

axios.defaults.baseURL = process.env.API_BASE;

export default class Http {
  static get(endpoint, params) {
    return axios({
      method: 'GET',
      url: endpoint,
      params,
    });
  }

  static post(endpoint, data) {
    return axios({
      method: 'POST',
      url: endpoint,
      data,
    });
  }

  static put(endpoint, data) {
    return axios({
      method: 'PUT',
      url: endpoint,
      data,
    });
  }

  static patch(endpoint, data) {
    return axios({
      method: 'PATCH',
      url: endpoint,
      data,
    });
  }

  static delete(endpoint) {
    return axios({
      method: 'DELETE',
      url: endpoint,
    });
  }
}
