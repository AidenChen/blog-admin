<template>
  <div class="list">
    <div class="list__top-title">
      <i class="fa fa-tags" aria-hidden="true"></i>&nbsp;标签
    </div>
    <ul class="list__tag">
      <li v-for="tag in tagList" @click="toggleSelectFn(tag.id)" class="list__tag__item" :class="{ 'list__tag__item--active': selectTagArr.includes(tag.id)}">
        <i class="fa fa-tag" aria-hidden="true"></i>&nbsp;&nbsp;
        <span>{{tag.name}}</span>
        <i class="fa fa-trash-o" aria-hidden="true" @click.stop="deleteTagFn(tag.id)"></i>
      </li>
    </ul>
    <ul class="list__article">
      <li @click="createArticle" class="list__article__button"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;新建文章</li>
      <li v-for="(article, index) in articleList" @click="switchArticle(index)" class="list__article__item" :class="{'list__article__item--active': currentArticle.index == index}">
        <h1 class="list__article__item__title">{{ article.title | cutTitle}}</h1>
        <div class="list__article__item__info">
          <i class="fa fa-tag" aria-hidden="true"></i>
          <span v-for="tag in article.tags"> {{tag.name}}</span>
          <p class="list__article__item__createTime"><i class="fa fa-calendar" aria-hidden="true"></i>&nbsp; {{article.created_at}}</p>
          <p class="list__article__item__publish" v-if="article.is_published">
            已发布
          </p>
        </div>
      </li>
      <paginator :curPage='curPage' :total='total' @changePage='changePage'></paginator>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import Paginator from './Paginator';

export default {
  name: 'List',
  computed: {
    ...mapGetters([
      'articleList',
      'tagList',
      'currentArticle',
      'total',
      'curPage',
      'selectTagArr'
    ])
  },
  components: {
    Paginator
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
    }
  },
  methods: {
    ...mapActions([
      'indexArticle',
      'indexTag',
      'showCurrentArticle',
      'destroyTag'
    ]),
    ...mapMutations({
      toggleSelectTag: 'TOGGLE_SELECT_TAG'
    }),
    toggleSelectFn(id) {
      this.toggleSelectTag(id);
    },
    switchArticle(index) {
      if (!this.currentArticle.save) {
        this.$message.error('请先保存当前文章');
        return;
      }
      this.showCurrentArticle(index);
    },
    createArticle() {
      this.showCurrentArticle(-1);
    },
    destroyArticle() {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store
            .dispatch('destroyArticle', {
              id: this.currentArticle._id,
              index: this.currentArticle.index
            })
            .then(() => {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            })
            .catch(err => {
              this.$message.error(err.response.data.message);
            });
        })
        .catch(() => {});
    },
    destroyTagFn(id) {
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.destroyTag({
            id
          })
            .then(() => {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            })
            .catch(err => {
              this.$message.error(err.response.data.message);
            });
        })
        .catch(() => {});
    },
    changePage(cur) {
      this.indexArticle({
        index: cur,
        tags: this.selectTagArr
      }).then(() => {
        this.showCurrentArticle(0);
      });
    }
  },
  mounted() {
    this.indexArticle().then(() => {});
    this.indexTag();
  },
  watch: {
    selectTagArr(val) {
      console.log(val);
      console.log('change selectTagArr');
      this.indexArticle({
        tags: val
      });
    }
  }
};
</script>

<style lang="scss">
.list {
  padding: 15px;
}

.list__top-title {
  width: 100%;
  font-size: 25px;
  padding: 10px;
  color: #0288d1;

  span {
    padding-left: 15px;
  }
}

.list__tag {
  height: 140px;
  overflow: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  list-style: none;
  align-content: flex-start;
}

.list__tag__item {
  // flex-grow 1
  flex-shrink: 1;
  background-color: #0288d1;
  color: white;
  border-radius: 5px;
  text-align: center;
  margin: 5px;
  padding: 7px;
  cursor: pointer;
  height: 36px;
}

.list__tag__item--active {
  background-color: #FF8400;
}

.list__article {
  margin-top: 5px;
  list-style: none;
}

.list__article__item__title {
  font-size: 22px;
}

.list__article__button {
  padding: 10px;
  font-size: 25px;
  color: #0288d1;
  cursor: pointer;
}

.list__article__item {
  position: relative;
  width: 100%;
  height: 100px;
  background-color: #efefef;
  padding: 15px;
  margin-bottom: 5px;
  cursor: pointer;
}

.list__article__item--active {
  border-left: 10px solid #0288d1;
}

.list__article__item__info {
  position: absolute;
  bottom: 5px;
  right: 15px;
  text-align: right;
}

.list__article__item__abstract {
  width: 100%;
  max-height: 50px;
  word-wrap: break-word;
  word-break: all;
}

.list__article__item__publish {
  position: absolute;
  top: -45px;
  right: -3px;
  font-size: 13px;
  color: #aab2b3;
}
</style>
