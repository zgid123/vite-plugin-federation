import {createRouter, createWebHashHistory} from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
    routes: [
        {
            path: '/',
            redirect: '/introduce'
        },
        {
            path: '/introduce',
            name: 'introduce',
            component: () => import(/* webpackChunkName: "introduce" */ '../views/Introduce.vue')
        },
        {
            path: '/add',
            name: 'add',
            component: () => import(/* webpackChunkName: "add" */ '../views/AddGood.vue')
        },
        {
            path: '/account',
            name: 'account',
            component: () => import(/* webpackChunkName: "account" */ '../views/Account.vue')
        }
    ]
})

export default router
