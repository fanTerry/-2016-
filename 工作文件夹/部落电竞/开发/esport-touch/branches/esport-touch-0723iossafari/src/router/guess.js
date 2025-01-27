//预测模块
const guessHome = () => import('../views/guess/home/home.vue');
const allGuess = () => import('../views/guess/allGuess.vue');
const guessMix = () => import('../views/guess/mix/index.vue');
const guessRules = () => import('../views/guess/rules.vue');
const guessRecord = () => import('../views/guess/record.vue');
const guessSign = () => import('../views/guess/sign.vue');
const guessRecharge = () => import('../views/guess/recharge/recharge.vue');
const guessMessage = () => import('../views/guess/guessMessage.vue');
const guessShare = () => import('../views/guess/share.vue');
const ddBjnews = () => import('../views/guess/bjnews.vue');

//跟单
const followPlan = () => import('../views/guess/followplan/index.vue');
const masterHome = () => import('../views/guess/followplan/master/masterHome.vue');
const recommendPlanDetail = () => import('../views/guess/followplan/detail/recommendPlanDetail.vue');
const myRecomendPlan = () => import('../views/guess/followplan/record/myRecomendPlan.vue');

//专家方案
const expertMasterHome = () => import('../views/guess/expert/master/masterHome.vue');
const myRecommendProject = () => import('../views/guess/expert/record/myRecommendProject.vue');
const recommendProjectDetail = () => import('../views/guess/expert/detail/recommendProjectDetail.vue');

export default [{
    path: '/guess/home',
    name: 'guessHome',
    component: guessHome,
    meta: {
        keepAlive: true,
        title: ''
    }
}, {
    path: '/guess/allGuess',
    name: 'allGuess',
    component: allGuess,
    meta: {
        keepAlive: true,
        isBack: false, // 用于判断上一个页面是哪个
        parent: '/guess/home'
    }
}, {
    path: '/guess/mix',
    name: 'guessMix',
    component: guessMix,
}, {
    path: '/guess/rules',
    name: 'guessRules',
    component: guessRules
}, {
    path: '/guess/record',
    name: 'guessRecord',
    component: guessRecord,
    meta: {
        parent: '/userCenter'
    }
}, {
    path: '/guess/sign',
    name: 'guessSign',
    component: guessSign
}, {
    path: '/guess/recharge',
    name: 'guessRecharge',
    component: guessRecharge
}, {
    path: '/guess/message',
    name: 'guessMessage',
    component: guessMessage
}, {
    path: '/guess/share',
    name: 'guessShare',
    component: guessShare
}, {
    path: '/guess/ddBjnews',
    name: 'ddBjnews',
    component: ddBjnews
}, {
    path: '/followPlan',
    name: 'followPlan',
    component: followPlan,
    meta: {
        keepAlive: true
    }
}, {
    path: '/followPlan/masterHome',
    name: 'masterHome',
    component: masterHome,
    meta: {
        parent: '/followPlan'
    }
}, {
    path: '/followPlan/recommendPlanDetail',
    name: 'recommendPlanDetail',
    component: recommendPlanDetail,
    meta: {
        parent: '/followPlan'
    }
}, {
    path: '/followPlan/myRecomendPlan',
    name: 'myRecomendPlan',
    component: myRecomendPlan,
    meta: {
        parent: '/userCenter'
    }
}, {
    path: '/expertMasterHome',
    name: 'expertMasterHome',
    component: expertMasterHome,
}, {
    path: '/myRecommendProject',
    name: 'myRecommendProject',
    component: myRecommendProject,
}, {
    path: '/recommendProjectDetail',
    name: 'recommendProjectDetail',
    component: recommendProjectDetail,
    meta: {
        parent: '/followPlan'
    }
}]
