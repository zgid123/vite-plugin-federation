const users =
    [{
        loginUserName: "Admin",
        nickName: "Tom",
        password: "123456",
        permissions: "1",
        token: "e2b490f6-106f-455f-b0ac-afb6c52d3aeb"
    }, {
        loginUserName: "Customer",
        nickName: "Jack",
        password: "666666",
        permissions: "2",
        token: "674fc935-c283-42e4-9b7e-f2001ec3b862"
    }
    ]

export const getUserInfo = (token) => {
    const result = users.find(user => user.token === token)
    console.log(`[method]getUserInfo token:${token}, result:${result}`)
    return result;
}

export const login = (loginUserName, password) => {
    const result = users.find(user => (user.loginUserName === loginUserName && user.password === password))
    console.log(`[method]login loginUserName:${loginUserName}, password:${password}, result:${result}`)
    return result;
}

export function localGet(key) {
    const value = window.localStorage.getItem(key)
    try {
        return JSON.parse(window.localStorage.getItem(key))
    } catch (error) {
        return value
    }
}

export function localSet(key, value) {
    console.log(`[method]getUserInfo token:${key}, token:${value}`)
    window.localStorage.setItem(key, JSON.stringify(value))
    console.log(window.localStorage)
}

export function localRemove(key) {
    window.localStorage.removeItem(key)
}

export const pathMap = {
    login: '登录',
    introduce: '系统介绍',
    dashboard: '大盘数据',
    add: '添加商品',
    swiper: '轮播图配置',
    hot: '热销商品配置',
    new: '新品上线配置',
    recommend: '为你推荐配置',
    category: '分类管理',
    level2: '分类二级管理',
    level3: '分类三级管理',
    good: '商品管理',
    guest: '会员管理',
    order: '订单管理',
    order_detail: '订单详情',
    account: '修改账户'
}
