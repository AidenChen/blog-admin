import * as types from '../mutation-types';
import HttpService from '../../services/http';

const authState = {
  token: sessionStorage.getItem('blog-admin-token'),
};

const actions = {
  createToken({ commit }, { username, password }) {
    return HttpService.post('auth/login', {
      username,
      password,
    })
      .then((res) => {
        if (res.headers.authorization) {
          commit(types.CREATE_TOKEN, res.headers.authorization);
        } else {
          commit(types.DELETE_TOKEN);
        }
        return new Promise((resolve) => {
          resolve(res);
        });
      });
  },
};

const mutations = {
  [types.CREATE_TOKEN](state, token) {
    state.token = token;
    sessionStorage.setItem('blog-admin-token', token);
  },
  [types.DELETE_TOKEN](state) {
    state.token = null;
    sessionStorage.setItem('blog-admin-token', '');
  },
};

export default {
  state: authState,
  actions,
  mutations,
};
