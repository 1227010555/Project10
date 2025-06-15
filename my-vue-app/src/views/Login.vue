<script setup>
import { reactive, getCurrentInstance, ref } from "vue";
import { useAllDataStore } from "../stores";
import { useRouter } from "vue-router";
const store = useAllDataStore();
const loginForm = reactive({
  username: "",
  password: "",
});
const { proxy } = getCurrentInstance();
const router = useRouter();

// 添加鼠标悬停状态
const isHovered = ref(false);

const handleLogin = async () => {
  const res = await proxy.$api.getMenu(loginForm);
  store.state.userName = loginForm.username;
  const now = new Date();
  const pad = (n) => (n < 10 ? "0" + n : n);
  store.state.loginTime =
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  store.updateMenuList(res.menuList, store.state.userName);
  store.state.token = res.token;
  store.addMenu(router);
  router.push("/home");
};
</script>

<template>
  <div class="login-container" :class="{ 'blur-background': isHovered }">
    <div
      class="login-card"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div class="login-header">
        <h1>系统登录</h1>
        <p>欢迎回来，请登录您的账号</p>
      </div>

      <el-form :model="loginForm" class="login-form">
        <el-form-item>
          <el-input
            v-model="loginForm.username"
            placeholder="账号:admin/test"
            size="large"
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码:admin/test"
            size="large"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            @click="handleLogin"
            class="login-btn"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="login-background">
      <div class="background-overlay"></div>
    </div>
  </div>
</template>

<style scoped lang="less">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  transition: filter 0.5s ease;

  // 默认状态
  .login-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("../assets/images/background.png");
    background-size: cover;
    background-position: center;
    z-index: 0;
    transition: filter 0.5s ease;

    .background-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.1);
      transition: background 0.5s ease;
    }
  }

  // 悬停状态 - 背景模糊
  &.blur-background {
    .login-background {
      filter: blur(8px);

      .background-overlay {
        background: rgba(255, 255, 255, 0.5);
      }
    }

    .login-card {
      transform: scale(1.02);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0);
    }
  }

  .login-card {
    width: 420px;
    background-color: #fff;
    border-radius: 12px;
    padding: 40px 35px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    z-index: 1;
    position: relative;
    transition: all 0.4s ease;

    .login-header {
      text-align: center;
      margin-bottom: 30px;

      h1 {
        font-size: 24px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 10px;
      }

      p {
        font-size: 14px;
        color: #909399;
      }
    }

    .login-form {
      .el-form-item {
        margin-bottom: 24px;
      }

      .el-input {
        :deep(.el-input__inner) {
          height: 48px;
          line-height: 48px;
          padding-left: 40px;
          border-radius: 8px;
          font-size: 15px;
        }

        :deep(.el-input__prefix) {
          display: flex;
          align-items: center;
          left: 15px;
          color: #c0c4cc;
          font-size: 16px;
        }
      }

      .login-btn {
        width: 100%;
        height: 48px;
        font-size: 16px;
        border-radius: 8px;
        letter-spacing: 2px;
        margin-top: 10px;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
        }
      }
    }

    .login-footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;

      p {
        font-size: 12px;
        color: #909399;
        margin: 0;
      }
    }
  }
}

@media (max-width: 768px) {
  .login-container {
    padding: 0 20px;

    .login-card {
      width: 100%;
      max-width: 420px;
    }
  }
}
</style>