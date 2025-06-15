<script setup>
import CommonAside from "../components/CommonAside.vue";
import CommonHeader from "../components/CommonHeader.vue";
import CommonTab from "../components/CommonTab.vue";
</script>

<template>
  <div class="common-layout">
    <keep-alive>
      <el-container class="lay-container">
        <!--自定义左侧组件-->
        <common-aside />
        <el-container>
          <el-header class="el-header">
            <common-header />
          </el-header>
          <common-tab />
          <el-main class="right-main"><router-view></router-view> </el-main>
        </el-container>
      </el-container>
    </keep-alive>
  </div>
</template>

<style scoped lang="less">
.common-layout,
.lay-container {
  height: 100%;
}
.el-header {
  background-color: rgb(106.8, 108.9, 113.1);
}
</style>


