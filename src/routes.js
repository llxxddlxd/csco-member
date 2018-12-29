// import Login from './views/Login.vue'Home
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
//业务
import statisticindex from './views/statistic/indexPage.vue'
import statisticmember from './views/statistic/memberPage.vue'
import statistictitle from './views/statistic/titlePage.vue'
import statisticjob from './views/statistic/jobPage.vue'
import statisticmajor from './views/statistic/majorPage.vue'
import statisticregion from './views/statistic/regionPage.vue' 
// import echarts from './views/statistic/echarts.vue'
// import vae from './views/charts/vae.vue'

let routes = [
    // {
    //     path: '/login',
    //     component: Login,
    //     name: '',
    //     hidden: true
    // },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '会员系统',
        iconCls: '',
        leaf:true,
        children: [
            { path: '/indexpage', component: statisticindex, name: '首页' },
            // { path: '/memberpage', component: statisticmember, name: '新增会员统计' },
            // { path: '/regionpage', component: statisticregion, name: '地域分布' },
            // { path: '/titlepage', component: statistictitle, name: '职称统计' },
            // { path: '/jobpage', component: statisticjob, name: '单位职务统计' },
            // { path: '/majorpage', component: statisticmajor, name: '专业特长及研究方向统计' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '会员系统',
        iconCls: '',
        leaf:true,
        children: [
            { path: '/memberpage', component: statisticmember, name: '新增会员统计' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '会员系统',
        iconCls: '',
        leaf:true,
        children: [
            { path: '/regionpage', component: statisticregion, name: '地域分布' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '会员系统',
        iconCls: '',
        leaf:true,
        children: [
            { path: '/titlepage', component: statistictitle, name: '职称统计' }, 
        ]
    },
    {
        path: '/',
        component: Home,
        name: '会员系统',
        iconCls: '',
        leaf:true,
        children: [
            { path: '/jobpage', component: statisticjob, name: '单位职务统计' },
            // { path: '/majorpage', component: statisticmajor, name: '专业特长及研究方向统计' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '会员系统',
        iconCls: '',
        leaf:true,
        children: [
            { path: '/majorpage', component: statisticmajor, name: '专业特长及研究方向统计' },
        ]
    },

    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;