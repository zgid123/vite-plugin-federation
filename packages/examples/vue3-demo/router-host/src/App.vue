<template id="app">
  <div class="layout">
    <el-container v-if="state.showMenu" class="container">
      <el-aside class="aside">
        <div class="head">
          <div>
            <img src="https://avatars.githubusercontent.com/u/81556572?s=200&v=4" alt="logo">
            <span>vite-plugin-federation</span>
          </div>
        </div>
        <div class="line"/>
        <el-menu
            :default-openeds="state.defaultOpen"
            background-color="#222832"
            text-color="#fff"
            :router="true"
            :default-active='state.currentPath'
        >
          <router-remote-el-sub-menu-dashboard/>
          <router-host-el-sub-menu-system-management/>
        </el-menu>
      </el-aside>
      <el-container class="content">
        <Header/>
        <div class="main">
          <router-view/>
        </div>
        <Footer/>
      </el-container>
    </el-container>
    <el-container v-else class="container">
      <router-view/>
    </el-container>
  </div>
  <hr/>
  <h1>Hello App! This is router-host</h1>
  <router-remote-element-plus/>
  <div>
    <p>
      <!--使用 router-link 组件进行导航 -->
      <!--通过传递 `to` 来指定链接 -->
      <!--`<router-link>` 将呈现一个带有正确 `href` 属性的 `<a>` 标签-->
      <router-link to="/">Go to Home |</router-link>
      <router-link to="/router-remote-element-plus"> Go to About |</router-link>

    </p>
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view></router-view>
  </div>
</template>

<script>
import {defineAsyncComponent, reactive} from 'vue'
import ElSubMenuSystemManagement from './components/ElSubMenuSystemManagement.vue'

const RouterRemoteElSubMenuDashboard = defineAsyncComponent(() => import("router-remote/ElSubMenuDashboard"));

export default {
  components: {
    "router-remote-el-sub-menu-dashboard": RouterRemoteElSubMenuDashboard,
    "router-host-el-sub-menu-system-management": ElSubMenuSystemManagement
  },
  setup() {
    const state = reactive({
      defaultOpen: ['1', '2', '3', '4'],
      showMenu: true,
      currentPath: '/dashboard',
      count: {
        number: 1
      }
    })
    return {
      state
    }
  }
}
</script>
<style scoped>
.layout {
  min-height: 100vh;
  background-color: #ffffff;
}

.container {
  height: 100vh;
}

.aside {
  width: 200px !important;
  background-color: #222832;
  overflow: hidden;
  overflow-y: auto;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

.aside::-webkit-scrollbar {
  display: none;
}

.head {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}

.head > div {
  display: flex;
  align-items: center;
}

.head img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.head span {
  font-size: 20px;
  color: #ffffff;
}

.line {
  border-top: 1px solid hsla(0, 0%, 100%, .05);
  border-bottom: 1px solid rgba(0, 0, 0, .2);
}

.content {
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow: hidden;
}

.main {
  height: calc(100vh - 100px);
  overflow: auto;
  padding: 10px;
}
</style>
<style>
body {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.el-menu {
  border-right: none !important;
}

.el-submenu {
  border-top: 1px solid hsla(0, 0%, 100%, .05);
  border-bottom: 1px solid rgba(0, 0, 0, .2);
}

.el-submenu:first-child {
  border-top: none;
}

.el-submenu [class^="el-icon-"] {
  vertical-align: -1px !important;
}

a {
  color: #409eff;
  text-decoration: none;
}

.el-pagination {
  text-align: center;
  margin-top: 20px;
}

.el-popper__arrow {
  display: none;
}
</style>

