import axios from 'axios';
// import { Message } from 'element-ui'
// import store from '@/store';

const tip = () => {
  // Message.error(msg)
};

const baseUrl = '/dev';
const instance = axios.create({
  baseURL: baseUrl + '/api',
  timeout: 10 * 60 * 1000
});

instance.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem('token');
    if (token) {
      request.headers['Authorization'] = JSON.parse(token);
    }
    return request;
  },
  (err) => {
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (err.response) {
      switch (err.response.status) {
        case 400:
          tip(err.response.data.message);
          break;
        case 401:
          window.location.href = '/login';
          tip(err.response.data.message);
          break;
        case 404:
          tip('请求失败，请检查网络连接');
          break;
        default:
          tip(err.response.data.message);
          break;
      }
    } else {
      tip(err.message);
    }
    return Promise.reject(err);
  }
);

export default instance;
