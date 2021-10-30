<template>
  <el-card class="account-container">
    <h1>系统简介</h1>
    <div style="line-height: 30px">
      使用 vite-plugin-federation 将系统拆分为`router-host`(Host)和`router-remote`(Remote)两部分，协同运行。
    </div>
    <h1>开发及部署文档</h1>
    <div style="line-height: 30px">
      http://localhost:5004/
      http://localhost:5005/
    </div>
    <ul class="course" @click="goGithub">
      <li>Github</li>
    </ul>
    <h1>技术选型</h1>
    <ul style="font-weight: bold;">
      <li>Vue 3.x</li>
      <li>Vite 2.x</li>
      <li>Vue-Router 4.x</li>
      <li>Element-Plus（适配全新 Vue 3.x 的 PC 端组件库）</li>
      <li>Echarts 5.0</li>
      <li>axios</li>
      <li>wangEditor</li>
    </ul>
    <h1>联系作者</h1>
    <ul>
      <li></li>
      <li></li>
    </ul>
  </el-card>
</template>

<script>
export default {
  name: 'Introduce',
  setup() {
    console.log(`The router-remote‘s  Introduce call its own setup.`);
    const goGithub = () => {
      console.log('goGithub')
      window.open('https://github.com/originjs/vite-plugin-federation', 'target')
    }

    return {
      goGithub
    }
  }
}
</script>
<style scoped>
.course {
  font-weight: bold;
  display: inline-block;
}

.course li {
  line-height: 36px;
  color: #409eff;
  cursor: pointer;
}
</style>
