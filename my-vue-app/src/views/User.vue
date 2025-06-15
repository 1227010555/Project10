<script setup>
import { ref, reactive, onMounted, nextTick, getCurrentInstance } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

const { proxy } = getCurrentInstance();

// --- 常量定义 ---
const COLUMNS = [
  { prop: "name", label: "姓名", width: 120 },
  { prop: "age", label: "年龄", width: 80 },
  { prop: "sexLabel", label: "性别", width: 100 },
  { prop: "birth", label: "出生日期", width: 180 },
  { prop: "addr", label: "地址", width: 300 },
];
const RULES = {
  name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
  age: [
    { required: true, message: "年龄是必填项", trigger: "blur" },
    { type: "number", message: "年龄必须为数字" },
  ],
  sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
  birth: [{ required: true, message: "出生日期是必选项" }],
  addr: [{ required: true, message: "地址是必填项", trigger: "blur" }],
};
function formatDate(val) {
  const d = new Date(val);
  const pad = (m) => (m < 10 ? "0" + m : m);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// --- 响应式状态 ---
const tableData = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const action = ref("add"); // add | edit

const formInline = reactive({ keyword: "" });
const pagination = reactive({ page: 1, total: 0 });

const formUser = reactive({
  id: null,
  name: "",
  age: null,
  sex: "1",
  birth: "",
  addr: "",
});
const rules = reactive(RULES);

// --- 数据操作函数 ---
async function loadTable() {
  loading.value = true;
  const params = {
    name: formInline.keyword,
    page: pagination.page,
  };
  const res = await proxy.$api.getUserData(params);
  tableData.value = res.list.map((u) => ({
    ...u,
    sexLabel: u.sex == "1" ? "男" : "女",
    birth: formatDate(u.birth),
  }));
  pagination.total = res.count;
  loading.value = false;
}

function onSearch() {
  pagination.page = 1;
  loadTable();
}

function onPageChange(page) {
  pagination.page = page;
  loadTable();
}

async function onDelete(row) {
  await ElMessageBox.confirm("此操作将删除该用户，是否继续？");
  await proxy.$api.deleteUser({ id: row.id });
  ElMessage.success("删除成功");
  if (tableData.value.length === 1 && pagination.page > 1) {
    pagination.page--;
  }
  loadTable();
}

function openDialog(mode, row = null) {
  action.value = mode;
  if (mode === "edit" && row) {
    nextTick(() => {
      Object.assign(formUser, {
        id: row.id,
        name: row.name,
        age: row.age,
        sex: row.sex,
        birth: row.birth,
        addr: row.addr,
      });
    });
  } else {
    Object.assign(formUser, {
      id: null,
      name: "",
      age: null,
      sex: "1",
      birth: "",
      addr: "",
    });
  }
  dialogVisible.value = true;
}

function closeDialog() {
  dialogVisible.value = false;
  proxy.$refs.userForm.resetFields();
}

async function onSubmit() {
  proxy.$refs.userForm.validate(async (valid) => {
    if (!valid) {
      return ElMessage.error("请填写完整且正确的信息");
    }
    const payload = { ...formUser };
    let ok = false;
    if (action.value === "add") {
      ok = await proxy.$api.addUser(payload);
    } else {
      ok = await proxy.$api.editUser(payload);
    }
    if (ok) {
      ElMessage.success(action.value === "add" ? "新增成功" : "修改成功");
      closeDialog();
      loadTable();
    }
  });
}

// --- 生命周期 ---
onMounted(loadTable);
</script>

<template>
  <div class="user-container">
    <!-- 顶部操作栏 -->
    <div class="operation-bar">
      <el-button type="primary" icon="Plus" @click="openDialog('add')">
        新增用户
      </el-button>

      <el-form inline class="search-form">
        <el-form-item>
          <el-input
            v-model="formInline.keyword"
            placeholder="请输入姓名搜索"
            clearable
            @keyup.enter="onSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <div class="table-wrapper">
      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        height="100%"
        style="width: 100%"
      >
        <el-table-column
          v-for="col in COLUMNS"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
        />
        <el-table-column label="操作" fixed="right" width="150" align="center">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="openDialog('edit', row)"
            />
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="onDelete(row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页控件 -->
    <div class="pagination-container">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page="pagination.page"
        :page-size="10"
        :total="pagination.total"
        @current-change="onPageChange"
      />
    </div>

    <!-- 用户表单弹窗 -->
    <el-dialog
      :title="action === 'add' ? '新增用户' : '编辑用户信息'"
      v-model="dialogVisible"
      width="500px"
      :before-close="closeDialog"
      top="5vh"
    >
      <el-form
        ref="userForm"
        :model="formUser"
        :rules="rules"
        label-width="80px"
        label-position="left"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formUser.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input-number
                v-model="formUser.age"
                :min="0"
                :max="120"
                controls-position="right"
                placeholder="请输入年龄"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="formUser.sex">
                <el-radio label="1">男</el-radio>
                <el-radio label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birth">
              <el-date-picker
                v-model="formUser.birth"
                type="date"
                placeholder="选择日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="地址" prop="addr">
          <el-input
            v-model="formUser.addr"
            placeholder="请输入详细地址"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.user-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .operation-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    height: 50px;
    flex-shrink: 0;

    .search-form {
      display: flex;
      align-items: center;

      :deep(.el-input) {
        width: 280px;
        margin-right: 10px;
      }
    }
  }

  .table-wrapper {
    flex: 1;
    min-height: 0; // 防止溢出
    overflow: hidden;
    border: 1px solid #ebeef5;
    border-radius: 6px;

    :deep(.el-table) {
      height: 100%;
    }
  }

  .pagination-container {
    padding: 16px 0;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #f0f0f0;
    margin-top: 16px;
    height: 60px;
    flex-shrink: 0;
  }
}

// 弹窗表单样式优化
:deep(.el-dialog) {
  border-radius: 8px;

  .el-dialog__header {
    padding: 15px 20px;
    margin: 0;
    border-bottom: 1px solid #eee;
  }

  .el-dialog__body {
    padding: 20px;
    max-height: 70vh;
    overflow-y: auto;
  }

  .el-dialog__footer {
    padding: 10px 20px;
    border-top: 1px solid #eee;
  }

  .el-form-item {
    margin-bottom: 18px;
  }
}
</style>