<template>
  <el-row class="web-main">
    <el-table :data="tableData" style="width: 100%" size="small">
      <el-table-column prop="type" label="类型" width="60" />
      <el-table-column label="题目" align="center">
        <template #default="scope">
          <el-button type="primary" text='primary' size="small" v-for="item in scope.row.content"
            @click="clickQuestion(item.answer)">{{ item.question
            }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
  <el-dialog v-model="dialogVisible" width="80%" :show-close="false">
    <pre>{{ answer }}</pre>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
const tableData = window.__exams
let dialogVisible = ref(false)
let answer = ref('')
const clickQuestion = function (ans) {
  answer = ans
  dialogVisible.value = true
}
</script>

<style scoped lang="less">
.web-main {
  height: 100vh;
  min-height: 100vh;
  padding: 0.5rem;
  flex-direction: column;
  background-color: #f9f9f9;

  .el-button--small {
    padding: 5px;
  }

}
</style>

<style>
.el-dialog {
  .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    padding: 10px;
  }
}
</style>
