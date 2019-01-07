import * as types from '../mutation-types';
import HttpService from '../../services/http';

const editorState = {
  posts: [],
  currentPost: {
    id: -1,
    index: -1,
    content: '',
    title: '',
    tags: [],
    save: true,
    is_published: false,
  },
  total: 1,
  curPage: 1,
  tagList: [],
  selectTagArr: [],
};

const getters = {
  posts: state => state.posts,
  currentPost: state => state.currentPost,
  total: state => state.total,
  curPage: state => state.curPage,
  tagList: state => state.tagList,
  selectTagArr: state => state.selectTagArr,
};

const actions = {
  // 添加文章
  /* eslint-disable no-unused-vars */
  createPost({ commit }, post) {
    /* eslint-enable no-unused-vars */
    return HttpService.post('posts', post).then(
      res =>
        new Promise(resolve => {
          resolve(res);
        }),
    );
  },
  // 删除文章
  destroyPost({ commit, state }, { id }) {
    return HttpService.delete(`posts/${id}`).then(res => {
      if (state.posts.length <= 1) {
        const post = {
          id: -1,
          index: 0,
          content: '',
          title: '',
          tags: [],
          save: false,
          is_published: false,
        };
        commit(types.SHOW_CURRENT_POST, post);
      }
      return new Promise(resolve => {
        resolve(res);
      });
    });
  },
  // 更新文章
  updatePost({ commit }, { id, post }) {
    return HttpService.patch(`posts/${id}`, post).then(res => {
      commit(types.UPDATE_POST);
      return new Promise(resolve => {
        resolve(res);
      });
    });
  },
  // 查询文章列表
  /* eslint-disable no-unused-vars */
  indexPost(
    { commit, state, dispatch },
    { tags = '', index = 1, size = 10 } = {},
  ) {
    /* eslint-enable no-unused-vars */
    return HttpService.get('posts', {
      tags,
      index,
      size,
    }).then(res => {
      commit(types.INDEX_POST, {
        posts: res.data.data.items,
        total: Math.ceil(res.data.data.total / size),
        curPage: index,
      });
      // dispatch('showCurrentPost', 0);
      return new Promise(resolve => {
        resolve(res);
      });
    });
  },
  // 显示当前文章
  showCurrentPost({ commit, state }, id) {
    let post;
    if (state.posts.length === 0 || !id) {
      post = {
        id: -1,
        index: -1,
        title: '',
        content: '<!--more-->',
        tags: [],
        save: true,
        is_published: false,
      };
    } else {
      const currentPost = state.posts.find(item => item.id === id);
      post = {
        id: currentPost.id,
        index: currentPost.index,
        title: currentPost.title,
        content: currentPost.content,
        tags: currentPost.tags,
        save: true,
        is_published: currentPost.is_published,
      };
    }
    commit(types.SHOW_CURRENT_POST, post);
  },
  // 发布文章
  publishPost({ commit }, { id }) {
    return HttpService.patch(`posts/${id}`, {
      is_published: true,
    }).then(res => {
      commit(types.PUBLISH_POST, id);
      return new Promise(resolve => {
        resolve(res);
      });
    });
  },
  // 撤回文章
  withdrawPost({ commit }, { id }) {
    return HttpService.patch(`posts/${id}`, {
      is_published: false,
    }).then(res => {
      commit(types.WITHDRAW_POST, id);
      return new Promise(resolve => {
        resolve(res);
      });
    });
  },
  postChanged({ commit }) {
    commit(types.POST_CHANGED);
  },
  createTag({ commit }, { name }) {
    return HttpService.post('tags', { name }).then(res => {
      commit(types.CREATE_TAG, res.data.data);
      return new Promise(resolve => {
        resolve(res);
      });
    });
  },
  destroyTag({ commit }, { id }) {
    return HttpService.delete(`tags/${id}`).then(res => {
      commit(types.DESTROY_TAG, id);
      return new Promise(resolve => {
        resolve(res);
      });
    });
  },
  updateTag({ commit }, { id, name }) {
    return HttpService.put(`tags/${id}`, { name }).then(res => {
      commit(types.UPDATE_TAG, { id, name });
      return new Promise(resolve => {
        resolve(res);
      });
    });
  },
  indexTag({ commit }) {
    return HttpService.get('tags').then(res => {
      commit(types.INDEX_TAG, res.data.data.items);
      return new Promise(resolve => {
        resolve(res);
      });
    });
  },
  destroyCurrentTag({ commit }, { index }) {
    commit(types.DESTROY_CURRENT_TAG, index);
    return new Promise(resolve => {
      resolve();
    });
  },
};

const mutations = {
  [types.CREATE_POST](state, post) {
    state.posts.unshift(post);
    state.currentPost = post;
  },
  [types.DESTROY_POST](state, index) {
    state.posts.splice(index, 1);
    if (state.posts.length === 0) {
      return;
    }
    if (index > state.posts.length - 1) {
      /* eslint-disable no-param-reassign */
      index = state.posts.length - 1;
      /* eslint-enable no-param-reassign */
    }
    state.currentPost = state.posts[index];
    state.currentPost.index = index;
    state.currentPost.save = true;
  },
  [types.UPDATE_POST](state) {
    state.currentPost.save = true;
  },
  [types.INDEX_POST](state, { posts, total, curPage }) {
    state.posts = posts;
    state.total = total;
    state.curPage = curPage;
  },
  [types.SHOW_CURRENT_POST](state, post) {
    state.currentPost = post;
  },
  [types.PUBLISH_POST](state, id) {
    state.currentPost.is_published = true;
    state.posts.find(p => p.id === id).is_published = true;
  },
  [types.WITHDRAW_POST](state, id) {
    state.currentPost.is_published = false;
    state.posts.find(p => p.id === id).is_published = false;
  },
  [types.POST_CHANGED](state) {
    state.currentPost.save = false;
  },
  [types.CREATE_TAG](state, tag) {
    state.currentPost.tags.push(tag);
  },
  [types.DESTROY_TAG](state, id) {
    state.tagList = state.tagList.filter(tag => tag.id !== id);
    state.currentPost.tags = state.currentPost.tags.filter(
      tag => tag.id !== id,
    );
    state.selectTagArr = state.selectTagArr.filter(e => e !== id);
  },
  [types.UPDATE_TAG](state, tag) {
    state.currentPost.tags.push(tag);
  },
  [types.INDEX_TAG](state, tagList) {
    state.tagList = tagList;
  },
  [types.DESTROY_CURRENT_TAG](state, index) {
    state.currentPost.tags.splice(index, 1);
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
  },
};

export default {
  state: editorState,
  getters,
  actions,
  mutations,
};
