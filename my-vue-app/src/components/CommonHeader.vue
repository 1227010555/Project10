<template>
  <header class="common-header">
    <div class="left">
      <el-button size="small" @click="toggleCollapse">
        <component :is="menuIcon" class="icon" />
      </el-button>
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="currentMenu" :to="currentMenu.path">
          {{ currentMenu.label }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="right">
      <el-dropdown trigger="click">
        <span class="avatar-wrapper">
          <img :src="getImageUrl('user')" alt="头像" class="avatar" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="goProfile">个人中心</el-dropdown-item>
            <el-dropdown-item @click="logout" divided
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup>
defineOptions({ name: "CommonHeader" });

import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAllDataStore } from "@/stores";
import { useAssets } from "@/composables/useAssets";

const { getImageUrl } = useAssets();
const store = useAllDataStore();
const router = useRouter();

const isCollapsed = computed(() => store.state.isCollapse);
const currentMenu = computed(() => store.state.currentMenu);

const toggleCollapse = () => {
  store.state.isCollapse = !store.state.isCollapse;
};

const logout = () => {
  store.clean();
  router.push("/login");
};

const goProfile = () => {
  router.push("/setting");
};

const menuIcon = "menu"; // 使用的图标名称
</script>

<style scoped lang="less">
.common-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  background: rgb(106.8, 108.9, 113.1);
  height: 56px;
}

.left {
  display: flex;
  align-items: center;
  .breadcrumb {
    margin-left: 16px;
    color: #fff;
    ::v-deep span {
      cursor: pointer;
      color: #fff !important;
    }
  }
}

.right {
  .avatar-wrapper {
    display: inline-block;
    cursor: pointer;
  }
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}

.icon {
  width: 20px;
  height: 20px;
}
</style>
