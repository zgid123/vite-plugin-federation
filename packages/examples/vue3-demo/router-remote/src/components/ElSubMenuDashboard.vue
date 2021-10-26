<template>
  <el-sub-menu index="1">
    <template #title>
      <span>Dashboard</span>
    </template>
    <el-menu-item-group>
      <el-menu-item index="/introduce"><i class="el-icon-data-line"/>系统介绍</el-menu-item>
      <el-menu-item index="/add"><i class="el-icon-plus"/>添加商品</el-menu-item>
    </el-menu-item-group>
  </el-sub-menu>
</template>

<script>
import {ElMenuItem, ElMenuItemGroup, ElSubMenu} from 'element-plus'

export default {
  components: {ElSubMenu, ElMenuItemGroup, ElMenuItem}
}
</script>

<style module>
</style>
