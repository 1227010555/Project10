import Mock from 'mockjs'
export default {
    getMenu: config => {
        const { username, password } = JSON.parse(config.body)
        // 先判断用户是否存在
        // 判断账号和密码是否对应
        //menuList用于后面做权限分配，也就是用户可以展示的菜单
        if (username === 'admin' && password === 'admin') {
            return {
                code: 200,
                data: {
                    menuList: [
                        {
                            path: '/home',
                            name: 'home',
                            label: '首页',
                            icon: 'house',
                            url: 'Home',
                            meta: { keepAlive: true }
                        },
                        {
                            path: '/mall',
                            name: 'mall',
                            label: '商品管理',
                            icon: 'video-play',
                            url: 'Mall',
                            meta: { keepAlive: true }
                        },
                        {
                            path: '/user',
                            name: 'user',
                            label: '用户管理',
                            icon: 'user',
                            url: 'User',
                            meta: { keepAlive: true }
                        },
                        {
                            path: 'other',
                            label: '其他',
                            icon: 'location',
                            children: [
                                {
                                    path: '/center',
                                    name: 'center',
                                    label: '个人中心',
                                    icon: 'setting',
                                    url: 'Center',
                                    meta: { keepAlive: true }
                                },
                                {
                                    path: '/setting',
                                    name: 'setting',
                                    label: '设置',
                                    icon: 'setting',
                                    url: 'Setting',
                                    meta: { keepAlive: true }
                                }
                            ]
                        }
                    ],
                    token: Mock.Random.guid(),
                    userName: "test",
                    message: '获取成功'
                }
            }
        } else if (username === 'test' && password === 'test') {
            return {
                code: 200,
                data: {
                    menuList: [
                        {
                            path: '/home',
                            name: 'home',
                            label: '首页',
                            icon: 'house',
                            url: 'Home',
                            meta: { keepAlive: true }
                        },
                        {
                            path: 'other',
                            label: '其他',
                            icon: 'location',
                            children: [
                                {
                                    path: '/center',
                                    name: 'center',
                                    label: '个人中心',
                                    icon: 'setting',
                                    url: 'Center',
                                    meta: { keepAlive: true }
                                },
                                {
                                    path: '/setting',
                                    name: 'setting',
                                    label: '设置',
                                    icon: 'setting',
                                    url: 'Setting',
                                    meta: { keepAlive: true }
                                }
                            ]
                        }
                    ],
                    token: Mock.Random.guid(),
                    userName: "test",
                    message: '获取成功'
                }
            }
        } else {

            return {
                code: -999,
                data: {
                    message: '密码错误'
                }
            }

        }

    }
}