import { createRouter, createWebHistory } from "vue-router";
import { getToken } from '@/utils';
import { useAuthStore } from '@/store'
import User from './modules/user'

// 路由信息
let routes = [
  
  {
    path: "/",
    component: () => import("@/views/home/home.vue"),
    children: [

      // 个人模块
      // ...User,
      
      {
        path: '/',
        component: () => import("@/views/index.vue"),
        name: 'Index',
        meta: {
          loginRequired: false,
          keepAlive: true, // 需要缓存
          deepth: 0.1 // 定义路由的层级
        }
      },
      {
        path: '/market',
        component: () => import("@/views/marketplace/marketplace.vue"),
        name: 'Marketplace',
        meta: {
          loginRequired: false,
          keepAlive: true, // 需要缓存
          deepth: 0.1 // 定义路由的层级
        }
      },
      {
        path: '/market/detail/:id?',
        component: () => import("@/views/detail/detail.vue"),
        name: 'Detail',
        meta: {
          loginRequired: false,
          keepAlive: true, // 需要缓存
          deepth: 0.1 // 定义路由的层级
        }
      },
      {
        path: '/dashboard',
        component: () => import("@/views/dashboard/dashboard.vue"),
        name: 'Dashboard',
        meta: {
          loginRequired: false,
          keepAlive: true, // 需要缓存
          deepth: 0.1 // 定义路由的层级
        }
      },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', redirect: '/' },
];

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export async function setupRouter(app) {
  app.use(router)
  await router.isReady()
}

router.beforeEach((to, from, next) => {
  
  // 如果有 token
  if (getToken()) {

    const authStore = useAuthStore()
    if (!authStore.user) { // 有 token ，没有用户信息，则请求用户信息
      authStore.userLoginInfo()
    }

    next()

  } else {
    next()
  }
})

export default router;
