<template>
  <div class="list">
    <ul class="list__post">
      <li @click="createPost" class="list__post__button"><i class="fa fa-plus" aria-hidden="true" />&nbsp;新建文章</li>
      <li v-for="(post, index) in posts" :key="index" @click="switchPost(post.id)" class="list__post__item" :class="{ 'list__post__item--active': currentPost.index == index }">
        <h1 class="list__post__item__title">{{ cutTitle(post.title) }}</h1>
        <div class="list__post__item__info">
          <i class="fa fa-tag" aria-hidden="true" />
          <span v-for="(tag, index) in post.tags" :key="index"> {{ tag.name }}</span>
          <p class="list__post__item__createTime"><i class="fa fa-calendar" aria-hidden="true" />&nbsp; {{ post.created_at }}</p>
          <p class="list__post__item__publish" v-if="post.is_published">已发布</p>
        </div>
      </li>
      <div class="post-paginator">
        <el-pagination @current-change="changePage" :current-page="curPage" :page-size="10" :total="total" background layout="prev, pager, next"> </el-pagination>
      </div>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useEditorStore } from '@/stores/editor';

defineOptions({
  name: 'PostList'
});

const router = useRouter();
const editorStore = useEditorStore();
const { posts, currentPost, total, curPage } = storeToRefs(editorStore);

const cutTitle = computed(() => {
  return (value) => {
    if (value.length > 24) {
      return `${value.substring(0, 24)}...`;
    }
    return value;
  };
});

// watch(
//   () => editorStore.selectTagArr,
//   (val) => {
//     editorStore.indexPost({
//       tags: val
//     });
//   }
// );

onMounted(() => {
  editorStore.indexPost().then(() => {});
  editorStore.indexTag();
});

const toggleSelectFn = (id) => {
  editorStore.toggleSelectTag(id);
};

const switchPost = (id) => {
  editorStore.showCurrentPost(id);
  router.push({ name: 'post-edit' });
};

const createPost = () => {
  editorStore.showCurrentPost('');
  router.push({ name: 'post-edit' });
};

const destroyPost = () => {
  // this.$messageBox
  //   .confirm('此操作将永久删除该文章, 是否继续?', '提示', {
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消',
  //     type: 'warning'
  //   })
  // .then(() => {
  editorStore
    .destroyPost({
      id: currentPost.value.id,
      index: currentPost.value.index
    })
    .then(() => {
      // this.$message({
      //   message: '删除成功',
      //   type: 'success'
      // });
    })
    .catch((err) => {
      // this.$message.error(err.response.data.message);
    });
  // })
  // .catch(() => {});
};

const changePage = (index: number) => {
  editorStore
    .indexPost({
      index
    })
    .then(() => {});
};
</script>

<style lang="scss" scoped>
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
  // width: 100%;
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
  // width: 100%;
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
