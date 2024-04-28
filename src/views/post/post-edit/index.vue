<template>
  <div class="editor-box">
    <p class="editor-box__title"><i class="fa fa-pencil-square" aria-hidden="true"></i>&nbsp;&nbsp;添加文章</p>
    <div class="editor-box__input-box">
      <label for="title">文章标题:</label>
      <input type="text" placeholder="文章标题" v-model="postTitle" class="editor-box__input" id="title" />
    </div>
    <div class="editor-box__input-box">
      <label for="title">添加标签:</label>
      <input type="text" placeholder="回车添加文章标签" v-model="postTag" @keyup.enter="createTag" />
    </div>
    <ul class="editor-box__tagList">
      <li v-for="(tag, index) in currentPost.tags" :key="index">
        <span>{{ tag.name }}</span
        >&nbsp;&nbsp;
        <i class="fa fa-trash-o" aria-hidden="true" @click="destroyCurrentTag(index)"></i>
      </li>
    </ul>
    <textarea id="editor" />
    <div class="editor-box__button-box">
      <button @click="createPost" v-if="currentPost.id === -1">添加</button>
      <button @click="updatePost({ button: 'true' })" v-else>保存</button>
      <template v-if="currentPost.id !== -1">
        <button @click="publishPost" v-if="!currentPost.is_published">发布</button>
        <button @click="withdrawPost" v-else>撤回</button>
      </template>
      <button @click="destroyPost">删除</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useEditorStore } from '@/stores/editor';
import SimpleMDE from 'simplemde/dist/simplemde.min.js';
import 'simplemde/dist/simplemde.min.css';
import 'inline-attachment';
import marked from '@/assets/scripts/marked';

defineOptions({
  name: 'PostEdit'
});

const authStore = useAuthStore();
const { token } = storeToRefs(authStore);
const editorStore = useEditorStore();
const { currentPost } = storeToRefs(editorStore);

let simplemde: any;
const postTag = ref<string>('');
const postTitle = ref<string>('');
const postContent = ref<string>('');

onMounted(() => {
  // dom渲染完成后置入编辑器当前文章内容
  nextTick(() => {
    postTitle.value = currentPost.value.title;
    postContent.value = currentPost.value.content;
    simplemde.value(postContent.value);
    inlineAttachment.editors.codemirror4.attach(simplemde.codemirror, inlineAttachmentConfig);
  });
  const inlineAttachmentConfig = {
    uploadUrl: '/dev/api/files',
    // uploadUrl: `${process.env.API_BASE}files`,
    extraHeaders: {
      Authorization: token.value
    },
    onFileUploadResponse(xhr) {
      const result = JSON.parse(xhr.responseText);
      const filename = result.data.path;
      let newValue;
      if (typeof this.settings.urlText === 'function') {
        newValue = this.settings.urlText.call(this, filename, result);
      } else {
        newValue = this.settings.urlText.replace(this.filenameTag, filename);
      }
      const text = this.editor.getValue().replace(this.lastValue, newValue);
      this.editor.setValue(text);
      this.settings.onFileUploaded.call(this, filename);
    }
  };
  simplemde = new SimpleMDE({
    autoDownloadFontAwesome: false,
    element: document.getElementById('editor'),
    spellChecker: false,
    previewRender: (plainText: any) => marked.parse(plainText)
  });
  simplemde.codemirror.on('change', () => {
    const value = simplemde.value();
    // 如果文章内容相同就不保存了
    if (currentPost.value.content === value) {
      return;
    }
    // 如果文章已经保存
    if (currentPost.value.save) {
      // 改变文章状态 => 未保存
      editorStore.postChanged();
    }
    postContent.value = value;
  });
});

onBeforeRouteLeave((to, from, next) => {
  const res = confirm('您确定要离开此页面吗？您的更改可能不会保存。');
  if (!res) {
    next(false);
    return;
  }

  next();
});

const createPost = () => {
  let abstract;
  if (postContent.value.indexOf('<!--more-->') !== -1) {
    abstract = postContent.value.split('<!--more-->')[0];
  } else {
    // this.$message.error('请填写摘要')
    return;
  }
  const info = {
    title: postTitle.value,
    content: postContent.value,
    abstract,
    is_published: false,
    tags: currentPost.value.tags
  };
  editorStore
    .createPost(info)
    .then(() => {
      // this.$message({
      //   message: '创建成功',
      //   type: 'success'
      // })
      editorStore.clearSelect();
    })
    .catch((err) => {
      // this.$message.error(err.response.data.message)
    });
};

const updatePost = ({ button = false } = {}) => {
  let abstract;
  if (postContent.value.indexOf('<!--more-->') !== -1) {
    abstract = postContent.value.split('<!--more-->')[0];
  } else {
    // this.$message.error('请填写摘要')
    return;
  }
  const post = {
    title: postTitle.value,
    content: postContent.value,
    abstract,
    tags: currentPost.value.tags
  };
  editorStore
    .updatePost(currentPost.value.id, post)
    .then(() => {
      if (button) {
        // this.$message({
        //   message: '保存成功',
        //   type: 'success'
        // })
      }
    })
    .catch((err) => {
      // this.$message.error(err.response.data.message)
    });
};

const publishPost = () => {
  editorStore
    .publishPost(currentPost.value.id)
    .then(() => {
      // this.$message({
      //   message: '发布成功',
      //   type: 'success'
      // })
    })
    .catch((err) => {
      // this.$message.error(err.response.data.message)
    });
};

const withdrawPost = () => {
  editorStore
    .withdrawPost(currentPost.value.id)
    .then(() => {
      // this.$message({
      //   message: '撤回成功',
      //   type: 'success'
      // })
    })
    .catch((err) => {
      // this.$message.error(err.response.data.message)
    });
};

const destroyPost = () => {
  // this.$messageBox
  //   .confirm('此操作将永久删除该文章, 是否继续?', '提示', {
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消',
  //     type: 'warning'
  //   })
  //   .then(() => {
  // if (this.currentPost.id === -1) {
  //   this.showCurrentPost(0);
  //   return;
  // }
  editorStore
    .destroyPost({
      id: currentPost.value.id,
      index: currentPost.value.index
    })
    .then(() => {
      // this.$message({
      //   message: '删除成功',
      //   type: 'success'
      // })
      editorStore.clearSelect();
    })
    .catch((err) => {
      // this.$message.error(err.response.data.message)
    });
  // })
  // .catch(() => {
  //   this.$message({
  //     type: 'info',
  //     message: '已取消删除'
  //   })
  // })
};

const createTag = () => {
  if (currentPost.value.tags.find((p) => p.name === postTag.value)) {
    // this.$message.error('该标签已存在')
  } else {
    if (currentPost.value.tags.length >= 5) {
      // this.$message({
      //   type: 'error',
      //   message: '不能创建超过5个标签'
      // })
      return;
    }
    editorStore
      .createTag({
        name: postTag.value
      })
      .then(() => {
        // this.$message({
        //   message: '创建成功',
        //   type: 'success'
        // })
        editorStore.indexTag();
        postTag.value = '';
        if (currentPost.value.id !== -1) {
          updatePost();
        }
      })
      .catch((err) => {
        // this.$message.error(err.response.data.message)
      });
  }
};

const destroyCurrentTag = (index) => {
  editorStore
    .destroyCurrentTag({ index })
    .then(() => {
      if (currentPost.value.id !== -1) {
        updatePost();
      }
      editorStore.indexTag();
    })
    .catch((err) => {
      // this.$message.error(err)
    });
};

watch(
  () => editorStore.currentPost,
  (val, oldVal) => {
    // 监听vuex current变化改变组件data
    postTitle.value = val.title;
    postContent.value = val.content;
    postTag.value = '';
    if (oldVal.id !== val.id && simplemde.isPreviewActive()) {
      simplemde.togglePreview();
    }
    simplemde.value(postContent.value);
  }
);

watch(
  () => postTitle.value,
  (val) => {
    // 监听v-model, 假如变化并且不是新建文章则保存
    if (currentPost.value.title !== val && currentPost.value.id !== -1) {
      editorStore.postChanged();
      updatePost();
    }
  }
);
</script>

<style lang="scss" scoped>
// @import '@/assets/styles/preview.scss';

.editor-box {
  position: relative;
  padding: 15px;

  input {
    padding: 7px;
    background-color: #efefef;
    width: 350px;
  }

  .editor-box__title {
    font-size: 25px;
    color: #0288d1;
    padding: 10px;
  }

  .editor-box__input-box {
    font-size: 17px;
    margin: 15px 0;
  }

  .editor-box__tagList {
    list-style: none;
    overflow: hidden;
    margin-bottom: 15px;

    li {
      float: left;
      height: 30px;
      line-height: 30px;
      margin-right: 20px;
      vertical-align: center;
      text-align: center;
      border-radius: 5px;
      padding: 0 5px;
      cursor: pointer;
    }

    li:hover {
      background-color: #efefef;
    }
  }

  .editor-box__button-box {
    float: right;
    margin: 10px;

    button {
      width: 80px;
      padding: 5px;
      background-color: #0288d1;
      color: white;
      margin-left: 15px;
    }
  }
}
</style>
