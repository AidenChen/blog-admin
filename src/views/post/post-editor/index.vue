<template>
  <div class="editor-box">
    <p class="editor-box__title">
      <i class="fa fa-pencil-square" aria-hidden="true"></i>&nbsp;&nbsp;添加文章
    </p>
    <div class="editor-box__input-box">
      <label for="title">文章标题:</label>
      <input type="text" placeholder="文章标题" v-model="postTitle" class="editor-box__input" id="title">
    </div>
    <div class="editor-box__input-box">
      <label for="title">添加标签:</label>
      <input type="text" placeholder="回车添加文章标签" v-model="postTag" @keyup.enter="createTag">
    </div>
    <ul class="editor-box__tagList">
      <li v-for="(tag, index) in currentPost.tags" :key="index">
        <span>{{ tag.name }}</span>&nbsp;&nbsp;
        <i class="fa fa-trash-o" aria-hidden="true" @click="destroyCurrentTag(index)"></i>
      </li>
    </ul>
    <textarea id="editor" />
    <div class="editor-box__button-box">
      <button @click="createPost" v-if="currentPost.id === -1">添加</button>
      <button @click="updatePost({button: 'true'})" v-else>保存</button>
      <template v-if="currentPost.id !== -1">
        <button @click="publishPost" v-if="!currentPost.is_published">发布</button>
        <button @click="withdrawPost" v-else>撤回</button>
      </template>
      <button @click="destroyPost">删除</button>
    </div>
  </div>
</template>

<script>
import SimpleMDE from 'simplemde';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import 'simplemde/dist/simplemde.min.css';
import marked from '../../../assets/js/marked';
import '../../../assets/js/inline-attachment.min';
import '../../../assets/js/codemirror-4.inline-attachment.min';

let simplemde;
export default {
  name: 'post-editor',
  data() {
    return {
      postTag: '',
      tags: [],
      postTitle: '',
      postContent: '',
    };
  },
  computed: {
    ...mapGetters(['currentPost', 'selectTagArr', 'token']),
  },
  mounted() {
    // dom渲染完成后置入编辑器当前文章内容
    this.$nextTick(() => {
      this.postTitle = this.currentPost.title;
      this.postContent = this.currentPost.content;
      simplemde.value(this.postContent);
    });
    const inlineAttachmentConfig = {
      // uploadUrl: 'http://localhost:3000/api/files',
      uploadUrl: `${process.env.API_BASE}files`,
      extraHeaders: {
        Authorization: this.token,
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
      },
    };
    simplemde = new SimpleMDE({
      autoDownloadFontAwesome: false,
      element: document.getElementById('editor'),
      spellChecker: false,
      previewRender: plainText => marked(plainText),
    });
    simplemde.codemirror.on('change', () => {
      const value = simplemde.value();
      // 如果文章内容相同就不保存了
      if (this.currentPost.content === value) {
        return;
      }
      // 如果文章已经保存
      if (this.currentPost.save) {
        // 改变文章状态 => 未保存
        this.$store.dispatch('postChanged');
      }
      this.postContent = value;
    });
    window.inlineAttachment.editors.codemirror4.attach(simplemde.codemirror, inlineAttachmentConfig);
  },
  methods: {
    ...mapActions(['showCurrentPost', 'indexTag', 'indexPost']),
    ...mapMutations({
      clearSelect: 'CLEAR_SELECT_TAG',
    }),
    createPost() {
      let abstract;
      if (this.postContent.indexOf('<!--more-->') !== -1) {
        abstract = this.postContent.split('<!--more-->')[0];
      } else {
        this.$message.error('请填写摘要');
        return;
      }
      const info = {
        title: this.postTitle,
        content: this.postContent,
        abstract,
        is_published: false,
        tags: this.currentPost.tags,
      };
      this.$store
        .dispatch('createPost', info)
        .then(() => {
          this.$message({
            message: '创建成功',
            type: 'success',
          });
          this.clearSelect();
        })
        .catch(err => {
          this.$message.error(err.response.data.message);
        });
    },
    updatePost() {
      const content = this.postContent;
      const button = false;
      let abstract;
      if (content.indexOf('<!--more-->') !== -1) {
        abstract = content.split('<!--more-->')[0];
      } else {
        this.$message.error('请填写摘要');
        return;
      }
      const post = {
        title: this.postTitle,
        content,
        abstract,
        tags: this.currentPost.tags,
      };
      this.$store
        .dispatch('updatePost', {
          id: this.currentPost.id,
          post,
        })
        .then(() => {
          if (button) {
            this.$message({
              message: '保存成功',
              type: 'success',
            });
          }
        })
        .catch(err => {
          this.$message.error(err.response.data.message);
        });
    },
    publishPost() {
      this.$store
        .dispatch('publishPost', {
          id: this.currentPost.id,
        })
        .then(() => {
          this.$message({
            message: '发布成功',
            type: 'success',
          });
        })
        .catch(err => {
          this.$message.error(err.response.data.message);
        });
    },
    withdrawPost() {
      this.$store
        .dispatch('withdrawPost', {
          id: this.currentPost.id,
        })
        .then(() => {
          this.$message({
            message: '撤回成功',
            type: 'success',
          });
        })
        .catch(err => {
          this.$message.error(err.response.data.message);
        });
    },
    destroyPost() {
      this.$messageBox
        .confirm('此操作将永久删除该文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          // if (this.currentPost.id === -1) {
          //   this.showCurrentPost(0);
          //   return;
          // }
          this.$store
            .dispatch('destroyPost', {
              id: this.currentPost.id,
              index: this.currentPost.index,
            })
            .then(() => {
              this.$message({
                message: '删除成功',
                type: 'success',
              });
              this.clearSelect();
            })
            .catch(err => {
              this.$message.error(err.response.data.message);
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    createTag() {
      if (this.currentPost.tags.find(p => p.name === this.postTag)) {
        this.$message.error('该标签已存在');
      } else {
        if (this.currentPost.tags.length >= 5) {
          this.$message({
            type: 'error',
            message: '不能创建超过5个标签',
          });
          return;
        }
        this.$store
          .dispatch('createTag', {
            name: this.postTag,
          })
          .then(() => {
            this.$message({
              message: '创建成功',
              type: 'success',
            });
            this.indexTag();
            this.postTag = '';
            if (this.currentPost.id !== -1) {
              this.updatePost({});
            }
          })
          .catch(err => {
            this.$message.error(err.response.data.message);
          });
      }
    },
    destroyCurrentTag(index) {
      this.$store
        .dispatch('destroyCurrentTag', { index })
        .then(() => {
          if (this.currentPost.id !== -1) {
            this.updatePost({});
          }
          this.indexTag();
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
  },
  watch: {
    currentPost(val, oldVal) {
      // 监听vuex current变化改变组件data
      this.postTitle = val.title;
      this.postContent = val.content;
      this.postTag = '';
      if (oldVal.id !== val.id && simplemde.isPreviewActive()) {
        simplemde.togglePreview();
      }
      simplemde.value(this.postContent);
    },
    postTitle(val) {
      // 监听v-model, 假如变化并且不是新建文章则保存
      if (this.currentPost.title !== val && this.currentPost.id !== -1) {
        this.$store.dispatch('postChanged');
        this.updatePost({
          title: val,
        });
      }
    },
  },
};
</script>

<style lang="scss">
@import '../../../assets/scss/preview.scss';

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
