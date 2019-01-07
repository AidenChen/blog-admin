<template>
  <div class="list">
    <ul class="list__post">
      <li @click="createPost" class="list__post__button">
        <i class="fa fa-plus" aria-hidden="true" />&nbsp;新建文章
      </li>
      <li v-for="(post, index) in posts" :key="index" @click="switchPost(post.id)" class="list__post__item" :class="{'list__post__item--active': currentPost.index == index}">
        <h1 class="list__post__item__title">{{ post.title | cutTitle }}</h1>
        <div class="list__post__item__info">
          <i class="fa fa-tag" aria-hidden="true" />
          <span v-for="(tag, index) in post.tags" :key="index"> {{tag.name}}</span>
          <p class="list__post__item__createTime">
            <i class="fa fa-calendar" aria-hidden="true" />&nbsp; {{ post.created_at }}
          </p>
          <p class="list__post__item__publish" v-if="post.is_published">
            已发布
          </p>
        </div>
      </li>
      <div class="post-paginator">
        <f-paginator :page-index="curPage" :page-size="10" :total="total" :pager-length="3" :layout="'pager'" :background="true" @page-changed="changePage" />
      </div>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: 'post-list',
  computed: {
    ...mapGetters([
      'posts',
      'tagList',
      'currentPost',
      'total',
      'curPage',
      'selectTagArr',
    ]),
  },
  data() {
    return {};
  },
  filters: {
    cutTitle(value) {
      if (value.length > 24) {
        return `${value.substring(0, 24)}...`;
      }
      return value;
    },
  },
  methods: {
    ...mapActions(['indexPost', 'indexTag', 'showCurrentPost']),
    ...mapMutations({
      toggleSelectTag: 'TOGGLE_SELECT_TAG',
    }),
    toggleSelectFn(id) {
      this.toggleSelectTag(id);
    },
    switchPost(id) {
      this.showCurrentPost(id);
      this.$router.push({ name: 'post-editor' });
    },
    createPost() {
      this.showCurrentPost('');
      this.$router.push({ name: 'post-editor' });
    },
    destroyPost() {
      this.$messageBox
        .confirm('此操作将永久删除该文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
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
            })
            .catch(err => {
              this.$message.error(err.response.data.message);
            });
        })
        .catch(() => {});
    },
    changePage(cur) {
      this.indexPost({
        index: cur,
        tags: this.selectTagArr,
      }).then(() => {});
    },
  },
  mounted() {
    this.indexPost().then(() => {});
    this.indexTag();
  },
  watch: {
    selectTagArr(val) {
      this.indexPost({
        tags: val,
      });
    },
  },
};
</script>

<style lang="scss">
.list {
  padding: 15px;

  ul {
    padding: 0;
  }
}

.list__post {
  margin-top: 5px;
  list-style: none;
}

.list__post__item__title {
  font-size: 22px;
}

.list__post__button {
  padding: 10px;
  font-size: 25px;
  color: #0288d1;
  cursor: pointer;
}

.list__post__item {
  position: relative;
  width: 100%;
  height: 100px;
  background-color: #efefef;
  padding: 15px;
  margin-bottom: 5px;
  cursor: pointer;
}

.list__post__item--active {
  border-left: 10px solid #0288d1;
}

.list__post__item__info {
  position: absolute;
  bottom: 5px;
  right: 15px;
  text-align: right;
}

.list__post__item__abstract {
  width: 100%;
  max-height: 50px;
  word-wrap: break-word;
}

.list__post__item__publish {
  position: absolute;
  top: -45px;
  right: -3px;
  font-size: 13px;
  color: #aab2b3;
}

.post-paginator {
  display: table;
  margin: 60px auto;
}
</style>
