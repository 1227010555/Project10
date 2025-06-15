<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from "vue";
import * as echarts from "echarts";
const { proxy } = getCurrentInstance();
defineOptions({ name: "center" });
import userImg from "@/assets/images/user.png";
// 假数据容器
const userInfo = ref({});
const statsData = ref([]);
const activityList = ref([]);
const chartData = ref([]);

// 获取用户信息
const getUserInfo = async () => {
  const res = await proxy.$api.getUserInfo();
  userInfo.value = res;
};

// 获取统计卡片数据
const getStatsData = async () => {
  const res = await proxy.$api.getUserStats();
  statsData.value = res;
};

// 获取最近活动列表
const getActivityList = async () => {
  const res = await proxy.$api.getUserActivities();
  activityList.value = res.list;
};

// 获取折线图数据
const getChartData = async () => {
  const res = await proxy.$api.getUserChart();
  chartData.value = res;
  const options = {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: res.map((item) => item.date),
      axisLine: { lineStyle: { color: "#409EFF" } },
      axisLabel: { color: "#333" },
    },
    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: "#409EFF" } },
    },
    series: [
      {
        name: "登录次数",
        type: "line",
        data: res.map((item) => item.logins),
      },
      {
        name: "发布动态",
        type: "bar",
        data: res.map((item) => item.posts),
      },
    ],
    color: ["#409EFF", "#67C23A"],
    grid: { left: "10%", right: "10%", bottom: "15%" },
  };
  const chart = echarts.init(proxy.$refs.activityChart);
  chart.setOption(options);

  const observer = new ResizeObserver(() => chart.resize());
  observer.observe(proxy.$refs.activityChart);
};

onMounted(() => {
  getUserInfo();
  getStatsData();
  getActivityList();
  getChartData();
});
</script>

<template>
  <el-row class="profile-home" :gutter="20">
    <!-- 左侧：用户信息与设置 -->
    <el-col :span="8" style="margin-top: 20px">
      <el-card shadow="hover" class="profile-card">
        <div class="avatar-wrap">
          <img :src="userImg" class="avatar" />
        </div>
        <div class="info">
          <p class="name">{{ userInfo.name }}</p>
          <p class="email">{{ userInfo.email }}</p>
        </div>
      </el-card>
      <el-card shadow="hover" class="settings-card" style="margin-top: 20px">
        <el-menu router>
          <el-menu-item index="/profile">基本资料</el-menu-item>
          <el-menu-item index="/security">安全设置</el-menu-item>
          <el-menu-item index="/notifications">消息中心</el-menu-item>
          <el-menu-item index="/privacy">隐私设置</el-menu-item>
        </el-menu>
      </el-card>
    </el-col>

    <!-- 右侧：统计卡片、最近活动和图表 -->
    <el-col :span="16" style="margin-top: 20px">
      <!-- 统计卡片 -->
      <div class="stats-cards">
        <el-card
          v-for="item in statsData"
          :key="item.title"
          :body-style="{ display: 'flex', padding: '12px' }"
        >
          <component
            :is="item.icon"
            class="stats-icon"
            :style="{ background: item.color }"
          />
          <div class="stats-detail">
            <p class="stats-value">{{ item.value }}</p>
            <p class="stats-title">{{ item.title }}</p>
          </div>
        </el-card>
      </div>

      <!-- 最近活动 -->
      <el-card class="activity-card">
        <div slot="header" class="clearfix">
          <span>最近活动</span>
        </div>
        <el-timeline>
          <el-timeline-item
            v-for="(act, idx) in activityList"
            :key="idx"
            :timestamp="act.time"
          >
            {{ act.text }}
          </el-timeline-item>
        </el-timeline>
      </el-card>

      <!-- 折线/柱状图 -->
      <el-card class="chart-card" style="margin-top: 20px">
        <div ref="activityChart" style="height: 300px"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped lang="less">
.profile-home {
  height: 100%;

  .profile-card {
    text-align: center;
    .avatar-wrap {
      margin-top: 20px;
      .avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
      }
    }
    .info {
      margin: 20px 0;
      .name {
        font-size: 24px;
        font-weight: bold;
      }
      .email {
        color: #909399;
      }
    }
  }

  .settings-card {
    .el-menu {
      border: none;
    }
  }

  .stats-cards {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 20px;
    .el-card {
      width: 30%;
      margin-bottom: 20px;
    }
    .stats-icon {
      width: 60px;
      height: 60px;
      font-size: 28px;
      color: #fff;
      text-align: center;
      line-height: 60px;
      border-radius: 8px;
    }
    .stats-detail {
      margin-left: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .stats-value {
        font-size: 24px;
        margin: 0;
      }
      .stats-title {
        color: #666;
        margin: 0;
      }
    }
  }

  .activity-card {
    .el-timeline {
      padding: 0 20px;
    }
  }

  .chart-card {
    .echart {
      width: 100%;
    }
  }
}
</style>
