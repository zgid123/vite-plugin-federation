<template>
  <div id="home-element-plus-button">
    <h1>{{ title }}</h1>
    <el-button @click="title = title + '!'">I am ElButton</el-button>
  </div>
</template>

<script>
import {ElButton} from 'element-plus'

export default {
  components: { ElButton },
  data: function () {
    return {
      title: 'I will not be used'
    }
  }
}
</script>

<style module>
</style>

