<template>
  <div class="editor-box">
    <p class="editor-box__title"><i class="fa fa-pencil-square" aria-hidden="true"></i>&nbsp;&nbsp;添加文章</p>
    <div class="editor-box__input-box">
      <label for="title">文章标题:</label>
      <input type="text" placeholder="文章标题" v-model="articleTitle" class="editor-box__input" id="title">
    </div>
    <div class="editor-box__input-box">
      <label for="title">添加标签:</label>
      <input type="text" placeholder="回车添加文章标签" v-model="articleTag" @keyup.enter="createTag">
    </div>
    <ul class="editor-box__tagList">
      <li v-for="(tag, index) in currentArticle.tags">
        <span>{{ tag.name }}</span>&nbsp;&nbsp;
        <i class="fa fa-trash-o" aria-hidden="true" @click="destroyCurrentTag(index)"></i>
      </li>
    </ul>
    <textarea id="editor"/>
    <div class="editor-box__button-box">
      <button @click="createArticle" v-if="currentArticle.id === -1">添加</button>
      <button @click="updateArticle({button: 'true'})" v-else>保存</button>
      <template v-if="currentArticle.id !== -1">
        <button @click="publishArticle" v-if="!currentArticle.is_published">发布</button>
        <button @click="withdrawArticle" v-else>撤回</button>
      </template>
      <button @click="destroyArticle">删除</button>
    </div>
  </div>
</template>

<script>
import SimpleMDE from 'simplemde';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import 'simplemde/dist/simplemde.min.css';
import debounce from '../assets/js/debounce';
import marked from '../assets/js/marked';

let simplemde;
export default {
  name: 'Editor',
  data() {
    return {
      articleTag: '',
      tags: [],
      articleTitle: '',
      articleContent: ''
    };
  },
  computed: {
    ...mapGetters(['currentArticle', 'selectTagArr'])
  },
  mounted() {
    // dom渲染完成后置入编辑器当前文章内容
    this.$nextTick(() => {
      this.articleTitle = this.currentArticle.title;
      this.articleContent = this.currentArticle.content;
      simplemde.value(this.articleContent);
    });
    simplemde = new SimpleMDE({
      autoDownloadFontAwesome: false,
      element: document.getElementById('editor'),
      spellChecker: false,
      previewRender: (plainText) => marked(plainText)
    });
    simplemde.codemirror.on('change', () => {
      const value = simplemde.value();
      // 如果文章内容相同就不保存了
      if (this.currentArticle.content === value) {
        return;
      }
      // 如果文章已经保存
      if (this.currentArticle.save) {
        // 改变文章状态 => 未保存
        this.$store.dispatch('articleChanged');
      }
      // 如果不是新建的文章，则保存，这是自动保存，如果不要自动保存可以注释
      if (this.currentArticle.id !== -1) {
        this.updateArticle({
          content: value
        });
      }
      this.articleContent = value;
    });
  },
  methods: {
    ...mapActions(['showCurrentArticle', 'indexTag', 'indexArticle']),
    ...mapMutations({
      clearSelect: 'CLEAR_SELECT_TAG'
    }),
    createArticle() {
      const info = {
        title: this.articleTitle,
        content: this.articleContent,
        is_published: false,
        tags: this.currentArticle.tags
      };
      this.$store
        .dispatch('createArticle', info)
        .then(() => {
          this.$message({
            message: '创建成功',
            type: 'success'
          });
          this.clearSelect();
        })
        .catch(err => {
          this.$message.error(err.response.data.message);
        });
    },
    // 保存文章引入去抖
    updateArticle: debounce(function ({
      title = this.articleTitle,
      content = this.articleContent,
      button = false
    }) {
      let abstract;
      if (content.indexOf('<!--more-->') !== -1) {
        abstract = content.split('<!--more-->')[0];
      } else {
        this.$message.error('请填写摘要');
        return;
      }
      const article = {
        title,
        content,
        abstract,
        tags: this.currentArticle.tags
      };
      this.$store
        .dispatch('updateArticle', {
          id: this.currentArticle.id,
          article
        })
        .then(() => {
          if (button) {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          }
        })
        .catch(err => {
          this.$message.error(err.response.data.message);
        });
    }),
    publishArticle() {
      this.$store
        .dispatch('publishArticle', {
          id: this.currentArticle.id
        })
        .then(() => {
          this.$message({
            message: '发布成功',
            type: 'success'
          });
        })
        .catch(err => {
          this.$message.error(err.response.data.message);
        });
    },
    withdrawArticle() {
      this.$store
        .dispatch('withdrawArticle', {
          id: this.currentArticle.id
        })
        .then(() => {
          this.$message({
            message: '撤回成功',
            type: 'success'
          });
        })
        .catch(err => {
          this.$message.error(err.response.data.message);
        });
    },
    destroyArticle() {
      this.$messageBox.confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (this.currentArticle.id === -1) {
            this.showCurrentArticle(0);
            return;
          }
          this.$store
            .dispatch('destroyArticle', {
              id: this.currentArticle.id,
              index: this.currentArticle.index
            })
            .then(() => {
              this.$message({
                message: '删除成功',
                type: 'success'
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
            message: '已取消删除'
          });
        });
    },
    createTag() {
      if (this.currentArticle.tags.find(p => p.name === this.articleTag)) {
        this.$message.error('该标签已存在');
      } else {
        if (this.currentArticle.tags.length >= 5) {
          this.$message({
            type: 'error',
            message: '不能创建超过5个标签'
          });
          return;
        }
        this.$store
          .dispatch('createTag', {
            name: this.articleTag
          })
          .then(() => {
            this.$message({
              message: '创建成功',
              type: 'success'
            });
            this.indexTag();
            this.articleTag = '';
            if (this.currentArticle.id !== -1) {
              this.updateArticle({});
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
          if (this.currentArticle.id !== -1) {
            this.updateArticle({});
          }
          this.indexTag();
        })
        .catch(err => {
          this.$message.error(err);
        });
    }
  },
  watch: {
    currentArticle(val, oldVal) {
      // 监听vuex current变化改变组件data
      this.articleTitle = val.title;
      this.articleContent = val.content;
      this.articleTag = '';
      if (oldVal.id !== val.id && simplemde.isPreviewActive()) {
        simplemde.togglePreview();
      }
      simplemde.value(this.articleContent);
    },
    articleTitle(val) {
      // 监听v-model, 假如变化并且不是新建文章则保存
      if (this.currentArticle.title !== val && this.currentArticle.id !== -1) {
        this.$store.dispatch('articleChanged');
        this.updateArticle({
          title: val
        });
      }
    }
  }
};
</script>

<style lang="scss">
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
      verticle-align: center;
      text-algin: center;
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
