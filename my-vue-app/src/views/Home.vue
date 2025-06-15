<script setup>
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  watchEffect,
  computed,
} from "vue";
import userImg from "@/assets/images/user.png";
import * as echarts from "echarts";
import { useAllDataStore } from "@/stores";
const store = useAllDataStore();
const userName = computed(() => store.state.userName);
const loginTime = computed(() => store.state.loginTime);
const { proxy } = getCurrentInstance();

// 数据 refs
const tableData = ref([]);
const countData = ref([]);
const chartData = reactive({
  order: { date: [], data: [] },
  user: [],
  video: [],
});

// 表格列定义
const tableColumns = [
  { prop: "name", label: "产品名称", minWidth: 120 },
  { prop: "todayBuy", label: "今日销量", minWidth: 100 },
  { prop: "monthBuy", label: "本月销量", minWidth: 100 },
  { prop: "totalBuy", label: "总销量", minWidth: 100 },
];

// 卡片组件（可复用）
const StatCard = {
  props: ["icon", "color", "value", "label"],
  template: `
    <el-card shadow="hover" :body-style="{ display: 'flex', padding: '12px', height: '100%' }">
      <div class="stat-icon" :style="{ background: color }">
        <component :is="icon" style="font-size: 24px; color: white;"/>
      </div>
      <div class="stat-content">
        <p class="stat-value">￥{{ value }}</p>
        <p class="stat-label">{{ label }}</p>
      </div>
    </el-card>
  `,
};

// 初始化通用图表的方法
function initChart(refName, options) {
  const el = proxy.$refs[refName];
  if (!el) return;
  const chart = echarts.init(el);
  chart.setOption(options);
  // 自动响应容器变化
  new ResizeObserver(() => chart.resize()).observe(el);
  return chart;
}

// 折线图配置
const lineOptions = reactive({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: [],
    axisLine: {
      lineStyle: {
        color: "#999",
      },
    },
  },
  yAxis: {
    type: "value",
    axisLine: {
      show: true,
      lineStyle: {
        color: "#999",
      },
    },
    splitLine: {
      lineStyle: {
        color: "#eee",
      },
    },
  },
  series: [
    {
      name: "销量",
      type: "line",
      smooth: true,
      data: [],
      itemStyle: {
        color: "#5470c6",
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(84, 112, 198, 0.5)" },
          { offset: 1, color: "rgba(84, 112, 198, 0.1)" },
        ]),
      },
    },
  ],
});

// 柱状图配置
const barOptions = reactive({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: [],
    axisLine: {
      lineStyle: {
        color: "#999",
      },
    },
  },
  yAxis: {
    type: "value",
    axisLine: {
      show: true,
      lineStyle: {
        color: "#999",
      },
    },
    splitLine: {
      lineStyle: {
        color: "#eee",
      },
    },
  },
  series: [
    {
      name: "用户量",
      type: "bar",
      data: [],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#83bff6" },
          { offset: 0.5, color: "#188df0" },
          { offset: 1, color: "#188df0" },
        ]),
      },
    },
  ],
});

// 饼图配置
const pieOptions = reactive({
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
  },
  legend: {
    orient: "horizontal",
    bottom: 0,
    data: [],
  },
  series: [
    {
      name: "分布比例",
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2,
      },
      label: {
        show: true,
        formatter: "{b}: {c}",
      },
      emphasis: {
        label: {
          show: true,
          fontSize: "14",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: true,
      },
      data: [],
    },
  ],
});

// API 调用
async function fetchTable() {
  const { tableData: data } = await proxy.$api.getTableData();
  tableData.value = data;
}
async function fetchCount() {
  countData.value = await proxy.$api.getCountData();
}
async function fetchCharts() {
  const { orderData, userData, videoData } = await proxy.$api.getChartData();
  chartData.order = orderData;
  chartData.user = userData;
  chartData.video = videoData;
}

// 当 chartData 更新时，自动渲染图表
watchEffect(() => {
  if (chartData.order.date.length) {
    lineOptions.xAxis.data = chartData.order.date;
    lineOptions.series[0].data = chartData.order.data;
    initChart("chartOrder", lineOptions);
  }
  if (chartData.user.length) {
    barOptions.xAxis.data = chartData.user.map((v) => v.date);
    barOptions.series[0].data = chartData.user.map((v) => v.new);
    initChart("chartUser", barOptions);
  }
  if (chartData.video.length) {
    pieOptions.legend.data = chartData.video.map((v) => v.name);
    pieOptions.series[0].data = chartData.video.map((v) => ({
      value: v.value,
      name: v.name,
    }));
    initChart("chartVideo", pieOptions);
  }
});

// 初始加载
onMounted(() => {
  fetchTable();
  fetchCount();
  fetchCharts();
});
</script>

<template>
  <div class="dashboard-container">
    <!-- 顶部用户信息栏 -->
    <el-card class="user-card" style="height: 150px">
      <div class="user-info">
        <img :src="userImg" class="avatar" />
        <div class="user-details">
          <h2>{{ userName }}</h2>
          <div class="login-info">
            <p>
              <span class="label">上次登录时间：</span>
              <span class="value">{{ loginTime }}</span>
            </p>
            <p>
              <span class="label">上次登录地点：</span>
              <span class="value">深圳市</span>
            </p>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 统计卡片 -->
    <div class="stats-grid" style="height: 20px">
      <StatCard
        v-for="item in countData"
        :key="item.name"
        :icon="item.icon"
        :color="item.color"
        :value="item.value"
        :label="item.label"
      />
    </div>

    <!-- 图表区域 -->
    <div class="charts-container" style="height: 380px">
      <!-- 左侧：主图表 -->
      <el-card class="main-chart" style="height: 100%">
        <div class="chart-title">图表一</div>
        <div
          ref="chartOrder"
          class="chart-content"
          style="height: calc(100% - 40px)"
        ></div>
      </el-card>

      <!-- 右侧：表格 -->
      <el-card class="data-table" style="height: 100%">
        <div class="table-title">图表二</div>
        <el-table
          :data="tableData"
          height="calc(100% - 40px)"
          stripe
          style="width: 100%"
        >
          <el-table-column
            v-for="col in tableColumns"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
            :min-width="col.minWidth"
          />
        </el-table>
      </el-card>
    </div>

    <!-- 底部小图表 -->
    <div class="sub-charts" style="height: 320px">
      <el-card class="sub-chart" style="height: 100%">
        <div class="chart-title">图表三</div>
        <div
          ref="chartUser"
          class="chart-content"
          style="height: calc(100% - 40px)"
        ></div>
      </el-card>
      <el-card class="sub-chart" style="height: 100%">
        <div class="chart-title">图表四</div>
        <div
          ref="chartVideo"
          class="chart-content"
          style="height: calc(100% - 40px)"
        ></div>
      </el-card>
    </div>
  </div>
</template>

<style scoped lang="less">
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  height: 100%;
  box-sizing: border-box;
  background-color: #f5f7fa;
  overflow: auto;
}

.user-card {
  height: 150px;
  flex-shrink: 0;

  .user-info {
    display: flex;
    align-items: center;
    height: 100%;

    .avatar {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      margin-right: 20px;
      border: 3px solid #ebeef5;
      object-fit: cover;
    }

    .user-details {
      flex: 1;

      h2 {
        margin: 0 0 10px 0;
        font-size: 24px;
        color: #303133;
      }

      .login-info {
        display: flex;
        flex-wrap: wrap;
        gap: 15px 30px;

        p {
          margin: 5px 0;
          font-size: 14px;
          min-width: 220px;

          .label {
            color: #909399;
          }

          .value {
            color: #606266;
            font-weight: 500;
          }
        }
      }
    }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  height: 100px;
  flex-shrink: 0;

  .stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 10px;
    margin-right: 12px;
    flex-shrink: 0;
  }

  .stat-content {
    .stat-value {
      margin: 0;
      font-size: 22px;
      font-weight: bold;
      line-height: 1.2;
    }

    .stat-label {
      margin: 5px 0 0 0;
      font-size: 13px;
      color: #909399;
    }
  }
}

.charts-container {
  display: flex;
  gap: 16px;
  height: 380px;
  flex-shrink: 0;

  .main-chart,
  .data-table {
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;
  }

  .chart-content {
    height: calc(100% - 40px);
    width: 100%;
  }
}

.sub-charts {
  display: flex;
  gap: 16px;
  height: 320px;
  flex-shrink: 0;

  .sub-chart {
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;

    .chart-content {
      height: calc(100% - 40px);
      width: 100%;
    }
  }
}

.chart-title {
  padding: 0 0 12px 0;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 5px;
  height: 40px;
}

.el-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;

  :deep(.el-card__body) {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 16px;
  }
}

// 确保表格正确显示
.data-table {
  :deep(.el-card__body) {
    padding: 16px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .table-title {
    height: 40px;
    padding-bottom: 12px;
    font-size: 16px;
    font-weight: bold;
    color: #303133;
    border-bottom: 1px solid #ebeef5;
    margin-bottom: 5px;
  }

  .el-table {
    flex: 1;
    min-height: 0; // 防止表格溢出
  }
}

// 图表容器确保正确渲染
.chart-content {
  position: relative;
  min-height: 200px; // 确保有最小高度

  > div {
    width: 100%;
    height: 100%;
  }
}
</style>