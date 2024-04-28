import { ref } from 'vue';
import { defineStore } from 'pinia';
import api from '@/api';

export const useEditorStore = defineStore('editor', () => {
  const currentPost = ref<any>({
    id: -1,
    index: -1,
    content: '',
    title: '',
    tags: [],
    save: true,
    is_published: false
  });

  const posts = ref<any[]>([]);
  const tagList = ref<any[]>([]);
  const selectTagArr = ref<any[]>([]);

  const total = ref<number>(1);
  const curPage = ref<number>(1);

  // 添加文章
  function createPost(post) {
    return api.post.create(post).then((res) => {
      new Promise((resolve) => {
        resolve(res);
      });
    });
  }

  // 删除文章
  function destroyPost(id) {
    return api.post.delete(id).then((res) => {
      if (posts.value.length <= 1) {
        const post = {
          id: -1,
          index: 0,
          content: '',
          title: '',
          tags: [],
          save: false,
          is_published: false
        };
        currentPost.value = post;
      }
      return new Promise((resolve) => {
        resolve(res);
      });
    });
  }

  // 更新文章
  function updatePost(id, post) {
    return api.post.change(id, post).then((res) => {
      currentPost.value.save = true;
      return new Promise((resolve) => {
        resolve(res);
      });
    });
  }

  // 查询文章列表
  function indexPost({ tags = '', index = 1, size = 10 } = {}) {
    return api.post.index({ tags, index, size }).then((res) => {
      posts.value = res.data.data.items;
      total.value = res.data.data.total;
      curPage.value = index;
      return new Promise((resolve) => {
        resolve(res);
      });
    });
  }

  // 显示当前文章
  function showCurrentPost(id) {
    let post;
    if (posts.value.length === 0 || !id) {
      post = {
        id: -1,
        index: -1,
        title: '',
        content: '<!--more-->',
        tags: [],
        save: true,
        is_published: false
      };
    } else {
      const currentPost = posts.value.find((item) => item.id === id);
      post = {
        id: currentPost.id,
        index: currentPost.index,
        title: currentPost.title,
        content: currentPost.content,
        tags: currentPost.tags,
        save: true,
        is_published: currentPost.is_published
      };
    }
    currentPost.value = post;
  }

  // 发布文章
  function publishPost(id) {
    return api.post.change(id, { is_published: true }).then((res) => {
      currentPost.value.is_published = true;
      posts.value.find((p) => p.id === id).is_published = true;
      return new Promise((resolve) => {
        resolve(res);
      });
    });
  }

  // 撤回文章
  function withdrawPost(id) {
    return api.post.change(id, { is_published: false }).then((res) => {
      currentPost.value.is_published = false;
      posts.value.find((p) => p.id === id).is_published = false;
      return new Promise((resolve) => {
        resolve(res);
      });
    });
  }

  function postChanged() {
    currentPost.value.save = false;
  }

  function createTag({ name }) {
    return api.tag
      .create({ name })
      .then((res) => {
        currentPost.value.tags.push(res.data.data);
        return new Promise((resolve) => {
          resolve(res);
        });
      })
      .catch(() => {
        currentPost.value.tags.push(tagList.value.find((item) => item.name === name));
      });
  }

  function destroyTag(id) {
    return api.tag.delete(id).then((res) => {
      tagList.value = tagList.value.filter((tag) => tag.id !== id);
      currentPost.value.tags = currentPost.value.tags.filter((tag) => tag.id !== id);
      selectTagArr.value = selectTagArr.value.filter((e) => e !== id);
      return new Promise((resolve) => {
        resolve(res);
      });
    });
  }

  function updateTag(id, name) {
    return api.tag.update(id, { name }).then((res) => {
      currentPost.value.tags.push({ id, name });
      return new Promise((resolve) => {
        resolve(res);
      });
    });
  }

  function indexTag() {
    return api.tag.index({}).then((res) => {
      tagList.value = res.data.data.items;
      return new Promise((resolve) => {
        resolve(res);
      });
    });
  }

  function destroyCurrentTag(index) {
    currentPost.value.tags.splice(index, 1);
    return new Promise((resolve) => {
      resolve();
    });
  }

  function toggleSelectTag(id) {
    if (!selectTagArr.value.includes(id)) {
      selectTagArr.value.push(id);
    } else {
      selectTagArr.value = selectTagArr.value.filter((e) => e !== id);
    }
  }

  function clearSelectTag() {
    selectTagArr.value = [];
  }

  return {
    posts,
    tagList,
    total,
    curPage,
    selectTagArr,
    currentPost,
    createPost,
    destroyPost,
    updatePost,
    indexPost,
    showCurrentPost,
    publishPost,
    withdrawPost,
    postChanged,
    createTag,
    destroyTag,
    updateTag,
    indexTag,
    destroyCurrentTag,
    toggleSelectTag,
    clearSelectTag
  };
});
