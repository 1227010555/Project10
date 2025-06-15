<script setup>
import { reactive, watch, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
import { useAllDataStore } from "@/stores"; // 引入 Pinia 仓库
import { useRouter } from "vue-router";

const store = useAllDataStore();
const router = useRouter();

// 当前登录用户名
const userName = computed(() => store.state.userName || "guest");

// 为每个用户生成独立的 localStorage key
const STORAGE_KEY = computed(() => `user-settings-${userName.value}`);

// 表单初始结构
const form = reactive({
  username: "",
  email: "",
  language: "zh",
  notifications: {
    order: true,
    message: false,
    newsletter: true,
  },
  theme: "light",
});

// 选项数据（不变）
const languageOptions = [
  /* ... */
];
const themeOptions = [
  /* ... */
];

// 载入逻辑：先尝试 localStorage，再调用后端
async function loadSettings() {
  const key = STORAGE_KEY.value;
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      Object.assign(form, JSON.parse(saved));
      return;
    } catch {}
  }
  // 没有本地缓存就向后端拉
  try {
    const res = await proxy.$api.getUserSettings();
    Object.assign(form, res);
    localStorage.setItem(key, JSON.stringify(form));
  } catch (err) {
    console.error("拉取用户设置失败", err);
  }
}

// 保存到后端，并更新本地缓存
async function saveSettings() {
  try {
    await proxy.$api.updateUserSettings(form);
    localStorage.setItem(STORAGE_KEY.value, JSON.stringify(form));
    ElMessage.success("设置已保存");
  } catch {
    // ElMessage.error("保存失败");
  }
}

// 表单任意变更时，同步到本地
watch(
  form,
  () => {
    localStorage.setItem(STORAGE_KEY.value, JSON.stringify(form));
  },
  { deep: true }
);

// 用户切换（或登出后登录新用户）时，重载表单
watch(userName, () => {
  loadSettings();
});

onMounted(() => {
  // 如果未登录，直接跳回登录页
  if (!store.state.token) {
    router.push("/login");
    return;
  }
  loadSettings();
});
</script>


<template>
  <el-row class="settings-page" :gutter="20">
    <el-col :span="12" style="margin-top: 20px">
      <el-card shadow="hover">
        <h3>个人信息</h3>
        <el-form :model="form" label-width="100px">
          <el-form-item label="用户名">
            <el-input v-model="form.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>

    <el-col :span="12" style="margin-top: 20px">
      <el-card shadow="hover">
        <h3>偏好设置</h3>
        <el-form :model="form" label-width="100px">
          <el-form-item label="语言">
            <el-select v-model="form.language" placeholder="选择语言">
              <el-option
                v-for="opt in languageOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="主题">
            <el-radio-group v-model="form.theme">
              <el-radio
                v-for="opt in themeOptions"
                :key="opt.value"
                :label="opt.value"
                >{{ opt.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>

    <el-col :span="24" style="margin-top: 20px">
      <el-card shadow="hover">
        <h3>通知设置</h3>
        <el-form :model="form" label-width="120px">
          <el-form-item label="订单通知">
            <el-switch v-model="form.notifications.order" />
          </el-form-item>
          <el-form-item label="消息通知">
            <el-switch v-model="form.notifications.message" />
          </el-form-item>
          <el-form-item label="订阅信息">
            <el-switch v-model="form.notifications.newsletter" />
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>

    <el-col :span="24" style="text-align: center; margin: 30px 0">
      <el-button type="primary" size="medium" @click="saveSettings">
        保存设置到服务器
      </el-button>
    </el-col>
  </el-row>
</template>


<style scoped lang="less">
.settings-page {
  .el-card {
    padding: 20px;
    h3 {
      margin-bottom: 15px;
      font-size: 18px;
      color: #303133;
    }
    .el-form-item {
      margin-bottom: 20px;
    }
  }
  .el-button {
    width: 200px;
  }
}
</style>
