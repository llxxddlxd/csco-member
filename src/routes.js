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
import echarts from './views/statistic/echarts.vue'
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
        name: '首页',
        iconCls: 'fa fa-user',
        children: [
            { path: '/indexpage', component: statisticindex, name: '新增会员统计' },
            { path: '/echarts', component: echarts, name: '新增会员统计' },
            // { path: '/vae', component: vae, name: '地域分布' },
            // { path: '/vae', component: vae, name: '职称统计' },
            // { path: '/vae', component: vae, name: '单位职务统计' },
            // { path: '/vae', component: vae, name: '专业特长及研究方向统计' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;