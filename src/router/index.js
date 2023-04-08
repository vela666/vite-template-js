import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({ showSpinner: false }) // NProgress Configuration
// import usePermissionStore from '@/stores/modules/permission'
import constantRoutes from './constant-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
})

/*const WHITE_LIST = ['/login', '/share'] // 路由白名单

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const store = usePermissionStore()

  console.log(store.generateRoutes, 'store')
  if (store.asyncRoutesRequested) {
    if (store.generateRoutes.length === 0 && to.path !== '/401') {
      next('/401')
    } else if (store.generateRoutes.length !== 0 && to.path === '/401') {
      next('/')
    } else {
      if (router.hasRoute(to.name)) {
        next()
      } else {
        // 如果路由不存在，则根据路径向上一级跳转，直到找到存在的路由
        next(to.path.replace('/' + to.path.split('/').pop(), ''))
      }
    }
  } else {
    console.log(111)
    await store.getMenus()
    store.generateRoutes.forEach((route) => {
      console.log(route.name, route)
      router.addRoute(route.name, route)
    })
    router.addRoute({
      path: '/',
      name: 'Index',
      redirect: store.generateRoutes[0].path,
    })
    next({
      ...to,
    })
  }
})

router.afterEach((to) => {
  NProgress.done()
  // document.title = `${to.meta.title} | ${process.env.VUE_APP_META_TITLE}`
})*/

export default router
