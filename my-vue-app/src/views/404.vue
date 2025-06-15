<script setup>
import { useRouter } from "vue-router";
import { useAllDataStore } from "@/stores";

const router = useRouter();
const store = useAllDataStore();

// 获取本地静态图片
const getImageUrl = (img) => {
  return new URL(`../assets/images/${img}.png`, import.meta.url).href;
};

// 返回上两个历史记录
const goHome = () => {
  router.go(-2);
};

// 清除状态并跳转到登录页
const goLoginOut = () => {
  store.clean(); // 与 commonheader.vue 中 handleLoginOut 一致
  router.push("/login");
};
</script>

<template>
  <div class="exception-container">
    <div class="error-content">
      <div class="error-code">404</div>
      <div class="error-message">PAGE NOT FOUND</div>
      <div class="error-description">网页不存在或权限不足</div>

      <div class="btn-group">
        <el-button class="btn-home" @click="goHome">
          <span class="btn-icon">←</span>
          <span class="btn-text">回到上一页</span>
        </el-button>
        <el-button class="btn-logout" @click="goLoginOut">
          <span class="btn-icon">⌂</span>
          <span class="btn-text">回到登录页</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.exception-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
  font-family: "Arial", sans-serif;
  padding: 20px;

  .error-content {
    text-align: center;
    max-width: 600px;
    padding: 40px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
    animation: fadeIn 0.6s ease-out;
  }

  .error-code {
    font-size: 120px;
    font-weight: 900;
    color: #2c3e50;
    line-height: 1;
    margin-bottom: 10px;
    text-shadow: 8px 8px 0 rgba(44, 62, 80, 0.1);
  }

  .error-message {
    font-size: 32px;
    font-weight: 700;
    color: #3498db;
    margin-bottom: 20px;
    letter-spacing: 1px;
  }

  .error-description {
    font-size: 18px;
    color: #7f8c8d;
    line-height: 1.6;
    margin-bottom: 40px;
    max-width: 500px;
  }

  .btn-group {
    display: flex;
    justify-content: center;
    gap: 25px;
    flex-wrap: wrap;

    .el-button {
      border: none;
      border-radius: 50px;
      padding: 16px 35px;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 1px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
      }

      &:active {
        transform: translateY(-2px);
      }

      .btn-icon {
        font-size: 24px;
        margin-right: 10px;
      }
    }

    .btn-home {
      background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
      color: white;

      &:hover {
        background: linear-gradient(135deg, #2980b9 0%, #2573a7 100%);
      }
    }

    .btn-logout {
      background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
      color: white;

      &:hover {
        background: linear-gradient(135deg, #27ae60 0%, #219653 100%);
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .exception-container {
    .error-content {
      padding: 30px 20px;
    }

    .error-code {
      font-size: 80px;
    }

    .error-message {
      font-size: 24px;
    }

    .error-description {
      font-size: 16px;
    }

    .btn-group {
      flex-direction: column;
      gap: 15px;

      .el-button {
        width: 100%;
        justify-content: center;
      }
    }
  }
}
</style>