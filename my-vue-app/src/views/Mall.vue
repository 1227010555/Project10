<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from "vue";
import * as echarts from "echarts";
const { proxy } = getCurrentInstance();

// 假数据容器，后续用 axios 请求接口填充
const productList = ref([]);
const statsData = ref([]);
const chartData = ref({ trend: [], category: [] });

// 表格列标签
const tableLabel = ref({
  name: "商品名称",
  price: "单价（¥）",
  todaySales: "今日销量",
  monthSales: "本月销量",
  totalSales: "总销量",
});

// ECharts 折线/柱状图公共配置
const xOptions = reactive({
  textStyle: { color: "#333" },
  tooltip: { trigger: "axis" },
  xAxis: {
    type: "category",
    data: [],
    axisLine: { lineStyle: { color: "#409EFF" } },
    axisLabel: { color: "#333" },
  },
  yAxis: [{ type: "value", axisLine: { lineStyle: { color: "#409EFF" } } }],
  color: ["#409EFF", "#67C23A", "#E6A23C"],
  series: [],
  grid: { left: "10%", right: "10%", bottom: "15%" },
});

// ECharts 饼图配置
const pieOptions = reactive({
  tooltip: { trigger: "item" },
  legend: { orient: "vertical", left: "left" },
  series: [],
  color: ["#F56C6C", "#E6A23C", "#67C23A", "#909399", "#409EFF"],
});

// 获取表格数据
const getProductList = async () => {
  const res = await proxy.$api.getProductList(); // 接口需实现
  productList.value = res.list;
};

// 获取统计卡片数据
const getStatsData = async () => {
  const res = await proxy.$api.getStatsData();
  statsData.value = res.stats;
};

// 获取图表数据
const getChartData = async () => {
  const res = await proxy.$api.getChartData();
  chartData.value = res;

  // 销售趋势折线图
  xOptions.xAxis.data = res.trend.map((item) => item.date);
  xOptions.series = [
    {
      name: "销量",
      type: "line",
      data: res.trend.map((item) => item.sales),
    },
    {
      name: "访客",
      type: "bar",
      data: res.trend.map((item) => item.visitors),
    },
  ];
  const trendChart = echarts.init(proxy.$refs.trendChart);
  trendChart.setOption(xOptions);

  // 分类饼图
  pieOptions.series = [
    {
      name: "销量占比",
      type: "pie",
      radius: "60%",
      center: ["60%", "50%"],
      data: res.category,
    },
  ];
  const pieChart = echarts.init(proxy.$refs.pieChart);
  pieChart.setOption(pieOptions);

  // 自适应容器变化
  const observer = new ResizeObserver(() => {
    trendChart.resize();
    pieChart.resize();
  });
  observer.observe(proxy.$refs.trendChart);
  observer.observe(proxy.$refs.pieChart);
};

onMounted(() => {
  getProductList();
  getStatsData();
  getChartData();
});
</script>

<template>
  <el-row class="product-home" :gutter="20">
    <!-- 左侧：商品列表 -->
    <el-col :span="8" style="margin-top: 20px">
      <el-card shadow="hover" class="product-table">
        <el-table :data="productList">
          <el-table-column
            v-for="(label, key) in tableLabel"
            :key="key"
            :prop="key"
            :label="label"
          />
        </el-table>
      </el-card>
    </el-col>

    <!-- 右侧：统计卡片与图表 -->
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
            <p class="stats-value">¥{{ item.value }}</p>
            <p class="stats-title">{{ item.title }}</p>
          </div>
        </el-card>
      </div>
      <!-- 折线/柱状图 -->
      <el-card class="chart-card">
        <div ref="trendChart" style="height: 300px"></div>
      </el-card>
      <!-- 饼图 -->
      <el-card class="chart-card" style="margin-top: 20px">
        <div ref="pieChart" style="height: 300px"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped lang="less">
.product-home {
  height: 100%;
  .product-table {
    .el-table {
      max-height: 600px;
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
  .chart-card {
    .echart {
      width: 100%;
    }
  }
}
</style>
