import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
function initState() {
    return {
        isCollapse: false,
        tags: [
            {
                path: "/home",
                name: "home",
                label: "首页",
                icon: "home",
            },
        ],
        currentMenu: null,
        menuList: [],
        token: "",
        routerList: [],
        userName: '',
        loginTime: "",
    }
}

export const useAllDataStore = defineStore('allData', () => {
    //ref state属性
    //computed getters
    //function actions
    const state = ref(initState())

    watch(state, (newObj) => {
        if (!newObj.token) return;
        localStorage.setItem("store", JSON.stringify(newObj))
    },
        { deep: true }
    )
    function selectMenu(val) {
        if (val.name === 'home') {
            state.value.currentMenu = null
        } else {
            state.value.currentMenu = val;
            let index = state.value.tags.findIndex(item => item.name === val.name)
            index === -1 ? state.value.tags.push(val) : ''
        }
    }
    function updateTags(tag) {
        let index = state.value.tags.findIndex(item => item.name === tag.name)
        state.value.tags.splice(index, 1)
    }
    function updateMenuList(val, userName) {
        state.value.menuList = val;
        state.value.userName = userName
    }

    function addMenu(router, type) {
        if (type === 'refresh') {
            const stored = JSON.parse(localStorage.getItem('store'));
            if (stored) {
                state.value = stored;
                state.value.routerList = [];
            } else {
                return;
            }
        }

        const menu = state.value.menuList;
        // 动态导入所有 vue 组件
        const module = import.meta.glob('../views/**/*.vue');
        const routerArr = [];

        // 遍历菜单，为每个路由加上 meta.keepAlive
        menu.forEach(item => {
            if (item.children) {
                item.children.forEach(val => {
                    const path = `../views/${val.url}.vue`;
                    val.component = module[path];
                    // 加上 keepAlive 标记
                    val.meta = { ...(val.meta || {}), keepAlive: true };
                    routerArr.push(val);
                });
            } else {
                const path = `../views/${item.url}.vue`;
                item.component = module[path];
                item.meta = { ...(item.meta || {}), keepAlive: true };
                routerArr.push(item);
            }
        });

        // 清除旧的动态路由
        router.getRoutes().forEach(r => {
            if (!['main', 'login', '404'].includes(r.name)) {
                router.removeRoute(r.name);
            }
        });

        // 重新添加，并记录到 state.routerList
        state.value.routerList = routerArr.map(route => {
            return router.addRoute('main', {
                path: route.path,
                name: route.name,
                component: route.component,
                meta: route.meta
            });
        });
    }

    //定义重置方法
    function clean() {
        //把保存的删除路由方法都执行一遍
        state.value.routerList.forEach(item => {
            if (item) item()
        })
        //重置state的数据
        state.value = initState()
        //删除本地缓存，因为这个clean方法是用户退出执行的
        localStorage.removeItem('store')
    }
    return {
        state,
        selectMenu,
        updateTags,
        updateMenuList,
        addMenu,
        clean,
    }
})