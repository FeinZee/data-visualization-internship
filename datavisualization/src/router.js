import Vue from "vue";
import VueRouter from "vue-router";

// 引入组件
import about from "./components/About.vue";
import home from "./components/Home.vue";
import Layout from "./layout"

// 要告诉 vue 使用 vueRouter
Vue.use(VueRouter);

const routes = [
    {
        path:'/',
        component: Layout,
        redirect:'/pvuv'
    },
    {
        path:"/pvuv",
        component: Layout,
        children: [
            {
                path: "home",
                component: home
            },
            {
                path: "about",
                component: about
            }
        ]
    },
    {
        path: "/other",
        component: Layout
    }
]

var router =  new VueRouter({
    routes
})
export default router;

