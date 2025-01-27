//资讯首页模块
const home = () => import('../views/homenew/index.vue');
const homeDetail = () => import('../views/homenew/detail/homeDetail.vue');

export default [{
        path: '/',
        component: home,
        meta: {
            keepAlive: true
        }
    }, {
        path: '/home',
        name: 'home',
        component: home,
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/homeDetail/:id',
        name: 'homeDetail',
        component: homeDetail,
        meta: {
            parent: '/home'
        }
    },
    { //统一跳转默认路由
        path: '*',
        component: home
    }
]
