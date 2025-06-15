<template>
  <el-aside :width="asideWidth" class="common-aside">
    <div class="logo">
      <h3 v-if="!isCollapsed">后台管理系统</h3>
      <h3 v-else>管理</h3>
    </div>
    <el-menu
      :collapse="isCollapsed"
      :default-active="activePath"
      class="menu"
      background-color="rgb(42, 89, 137.5)"
      text-color="var(--el-color-white)"
      active-text-color="var(--el-color-success)"
    >
      <template v-for="item in flatMenu">
        <el-menu-item
          v-if="!item.children"
          :key="item.path"
          :index="item.path"
          @click="onSelect(item)"
        >
          <component :is="item.icon" class="icon" />
          <span>{{ item.label }}</span>
        </el-menu-item>

        <el-sub-menu v-else :key="item.path" :index="item.path">
          <template #title>
            <component :is="item.icon" class="icon" />
            <span>{{ item.label }}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
              v-for="sub in item.children"
              :key="sub.path"
              :index="sub.path"
              @click="onSelect(sub)"
            >
              <component :is="sub.icon" class="icon" />
              <span>{{ sub.label }}</span>
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </template>
    </el-menu>
  </el-aside>
</template>

<script setup>
defineOptions({ name: "CommonAside" });

import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAllDataStore } from "@/stores";

const store = useAllDataStore();
const router = useRouter();
const route = useRoute();

const isCollapsed = computed(() => store.state.isCollapse);
const asideWidth = computed(() => (isCollapsed.value ? "64px" : "180px"));
const activePath = computed(() => route.path);

const flatMenu = computed(() => store.state.menuList);

const onSelect = (item) => {
  router.push(item.path);
  store.selectMenu(item);
};
</script>

<style scoped lang="less">
.common-aside {
  background: rgb(42, 89, 137.5); /* 使用 element-plus 主要颜色作为背景 */
  height: 100%;
  .logo {
    text-align: center;
    padding: 16px 0;
    h3 {
      margin: 0;
      color: var(--el-color-white); /* 使用白色作为文字颜色 */
      font-size: 16px;
    }
  }
  .menu {
    border-right: none;
    .icon {
      width: 18px;
      height: 18px;
      margin-right: 8px;
    }
  }
}
</style>
