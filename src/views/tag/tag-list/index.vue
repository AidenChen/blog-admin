<template>
  <div class="tag-list">
    <div class="list__top-title"><i class="fa fa-tags" aria-hidden="true" />&nbsp;标签</div>
    <ul class="list__tag">
      <li v-for="(tag, index) in tagList" :key="index" class="list__tag__item">
        <i class="fa fa-tag" aria-hidden="true" />&nbsp;&nbsp;
        <span>{{ tag.name }}</span>
        <i class="fa fa-trash-o" aria-hidden="true" @click.stop="destroyTagFn(tag.id)" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useEditorStore } from '@/stores/editor';

defineOptions({
  name: 'TagList'
});

const editorStore = useEditorStore();
const { tagList } = storeToRefs(editorStore);

const destroyTagFn = (id) => {
  // this.$messageBox
  //   .confirm('此操作将永久删除该标签, 是否继续?', '提示', {
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消',
  //     type: 'warning'
  //   })
  //   .then(() => {
  editorStore
    .destroyTag(id)
    .then(() => {
      // this.$message({
      //   message: '删除成功',
      //   type: 'success'
      // })
    })
    .catch((err) => {
      // this.$message.error(err.response.data.message)
    });
  // })
  // .catch(() => {})
};

onMounted(() => {
  editorStore.indexTag();
});
</script>

<style lang="scss" scoped>
.list__top-title {
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
</style>
