import {createRouter, createWebHashHistory} from "vue-router";
import Home from "../views/Home.vue";

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    }, {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                meta: {
                    title: '系统首页'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
            }, {
                path: "/entity",
                name: "entity",
                meta: {
                    title: '实体查询'
                },
                component: () => import (  "../views/Entity.vue")
            }, {
                path: "/relation",
                name: "relation",
                meta: {
                    title: '关系查询'
                },
                component: () => import ( "../views/Relation.vue")
            }, {
                path: "/analysis",
                name: "analysis",
                meta: {
                    title: '智能分析'
                },
                component: () => import (  "../views/Analysis.vue")
            }, {
                path: "/upload",
                name: "upload",
                meta: {
                    title: '上传数据'
                },
                component: () => import (  "../views/Upload.vue")
            },  {
                path: '/404',
                name: '404',
                meta: {
                    title: '找不到页面'
                },
                component: () => import ( '../views/404.vue')
            }
            
           
           
           
        ]
    }
];


const router = createRouter({
    history: createWebHashHistory(),
    routes
});


export default router;