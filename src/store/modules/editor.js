import * as types from '../mutation-types';
import articleApi from '../../api/article';
import tagApi from '../../api/tag';

const state = {
  articleList: [],
  currentArticle: {
    id: -1,
    index: -1,
    content: '',
    title: '',
    tags: [],
    save: true,
    is_published: false
  },
  total: 1,
  curPage: 1,
  tagList: [],
  selectTagArr: []
};

const getters = {
  articleList: state => state.articleList,
  currentArticle: state => state.currentArticle,
  total: state => state.total,
  curPage: state => state.curPage,
  tagList: state => state.tagList,
  selectTagArr: state => state.selectTagArr
};

const actions = {
  createArticle({ commit, state }, { title, content, is_published, tags }) {
    return articleApi
      .create(title, content, is_published, tags)
      .then(res => new Promise((resolve) => {
        resolve(res);
      }));
  },
  destroyArticle({ commit, state }, { id }) {
    return articleApi.destroy(id).then(res => {
      if (state.articleList.length <= 1) {
        const article = {
          id: -1,
          index: 0,
          content: '',
          title: '',
          tags: [],
          save: false,
          is_published: false
        };
        commit(types.SHOW_CURRENT_ARTICLE, article);
      }
      return new Promise((resolve) => {
        resolve(res);
      });
    });
  },
  updateArticle({ commit, state }, { id, article }) {
    return articleApi.update(id, article).then(res => {
      commit(types.UPDATE_ARTICLE);
      return new Promise((resolve) => {
        resolve(res);
      });
    });
  },
  indexArticle({ commit, state, dispatch }, { tags = '', index = 1, size = 10 } = {}) {
    return articleApi.index(tags, index, size).then(res => {
      commit(types.INDEX_ARTICLE, { articleList: res.data.data.items, total: Math.ceil(res.data.data.total / size), curPage: index });
      dispatch('showCurrentArticle', 0);
      return new Promise((resolve) => {
        resolve(res);
      });
    });
  },
  showCurrentArticle({ commit, state }, index) {
    let article;
    if (state.articleList.length === 0 || index === -1) {
      article = {
        id: -1,
        index: -1,
        title: '',
        content: '<!--more-->',
        tags: [],
        save: true,
        is_published: false
      };
    } else {
      article = {
        id: state.articleList[index].id,
        index,
        title: state.articleList[index].title,
        content: state.articleList[index].content,
        tags: state.articleList[index].tags,
        save: true,
        is_published: state.articleList[index].is_published
      };
    }
    commit(types.SHOW_CURRENT_ARTICLE, article);
  },
  publishArticle({ commit, state }, { id }) {
    return articleApi.publish(id).then(res => {
      commit(types.PUBLISH_ARTICLE, id);
      return new Promise((resolve) => {
        resolve(res);
      });
    });
  },
  withdrawArticle({ commit, state }, { id }) {
    return articleApi.withdraw(id).then(res => {
      commit(types.WITHDRAW_ARTICLE, id);
      return new Promise((resolve) => {
        resolve(res);
      });
    });
  },
  articleChanged({ commit }) {
    commit(types.ARTICLE_CHANGED);
  },
  createTag({ commit, state }, { name }) {
    return tagApi.create(name).then(res => {
      commit(types.CREATE_TAG, res.data.data);
      return new Promise((resolve) => {
        resolve(res);
      });
    });
  },
  destroyTag({ commit, state }, { id }) {
    return tagApi.destroy(id).then(res => {
      commit(types.DESTROY_TAG, id);
      return new Promise((resolve) => {
        resolve(res);
      });
    });
  },
  updateTag({ commit, state }, { id, name }) {
    return tagApi.update(id, name).then(res => {
      commit(types.UPDATE_TAG, { id, name });
      return new Promise((resolve) => {
        resolve(res);
      });
    });
  },
  indexTag({ commit }) {
    return tagApi.index().then(res => {
      commit(types.INDEX_TAG, res.data.data.items);
      return new Promise((resolve) => {
        resolve(res);
      });
    });
  },
  destroyCurrentTag({ commit, state }, { index }) {
    commit(types.DESTROY_CURRENT_TAG, index);
    return new Promise((resolve) => {
      resolve();
    });
  }
};

const mutations = {
  [types.CREATE_ARTICLE](state, article) {
    state.articleList.unshift(article);
    state.currentArticle = article;
  },
  [types.DESTROY_ARTICLE](state, index) {
    state.articleList.splice(index, 1);
    if (state.articleList.length === 0) {
      return;
    }
    if (index > state.articleList.length - 1) {
      index = state.articleList.length - 1;
    }
    state.currentArticle = state.articleList[index];
    state.currentArticle.index = index;
    state.currentArticle.save = true;
  },
  [types.UPDATE_ARTICLE](state) {
    state.currentArticle.save = true;
  },
  [types.INDEX_ARTICLE](state, { articleList, total, curPage }) {
    state.articleList = articleList;
    state.total = total;
    state.curPage = curPage;
  },
  [types.SHOW_CURRENT_ARTICLE](state, article) {
    state.currentArticle = article;
  },
  [types.PUBLISH_ARTICLE](state, id) {
    state.currentArticle.is_published = true;
    state.articleList.find(p => p.id === id).is_published = true;
  },
  [types.WITHDRAW_ARTICLE](state, id) {
    state.currentArticle.is_published = false;
    state.articleList.find(p => p.id === id).is_published = false;
  },
  [types.ARTICLE_CHANGED](state) {
    state.currentArticle.save = false;
  },
  [types.CREATE_TAG](state, tag) {
    state.currentArticle.tags.push(tag);
  },
  [types.DESTROY_TAG](state, id) {
    state.tagList = state.tagList.filter(tag => tag.id !== id);
    state.currentArticle.tags = state.currentArticle.tags.filter(tag => tag.id !== id);
    state.selectTagArr = state.selectTagArr.filter(e => e !== id);
  },
  [types.UPDATE_TAG](state, tag) {
    state.currentArticle.tags.push(tag);
  },
  [types.INDEX_TAG](state, tagList) {
    state.tagList = tagList;
  },
  [types.DESTROY_CURRENT_TAG](state, index) {
    state.currentArticle.tags.splice(index, 1);
  },
  [types.TOGGLE_SELECT_TAG](state, id) {
    if (!state.selectTagArr.includes(id)) {
      state.selectTagArr.push(id);
    } else {
      state.selectTagArr = state.selectTagArr.filter(e => e !== id);
    }
  },
  [types.CLEAR_SELECT_TAG](state) {
    state.selectTagArr = [];
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
