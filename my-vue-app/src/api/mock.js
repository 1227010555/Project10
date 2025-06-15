import Mock from 'mockjs'
import homeApi from './mockData/home'
import userApi from './mockData/user'
import menuApi from './mockData/permission'
//拦截的路径
//方法（get，post）
//制造出假数据
Mock.mock(/api\/home\/getTableData/, "get", homeApi.getTableData);
Mock.mock(/api\/home\/getCountData/, "get", homeApi.getCountData);
Mock.mock(/api\/home\/getChartData/, "get", homeApi.getChartData);
Mock.mock(/\/user\/getUserData/, 'get', (config) => userApi.getUserList(config))
Mock.mock(/\/user\/deleteUser/, 'get', (config) => userApi.deleteUser(config))
Mock.mock(/\/user\/addUser/, 'post', (config) => userApi.createUser(config))
Mock.mock(/\/user\/editUser/, 'post', (config) => userApi.updateUser(config))
Mock.mock(/api\/permission\/getMenu/, 'post', (config) => menuApi.getMenu(config))