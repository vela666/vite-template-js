import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
import usePermissionStore from '@/stores/modules/permission' // progress bar style

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const WHITE_LIST = ['/login'] // 路由白名单
/*function getPathList(list, prefix = '') {
  return list.reduce((p, c) => {
    // 判断有没有子路由 及 长度
    if (c.children && c.children.length > 0) {
      // 每次递归都给prefix 重新赋值新地址
      p.push(...getPathList(c.children, `${prefix}${c.path}`))
      // p.push(...getPathList(c.children))
    } else {
      // p.push(prefix === '/' ? `${prefix}${c.path}` : `${prefix}/${c.path}`)
      // p.push(prefix === '/' ? prefix : `${c.path}`)
      p.push(c.path)
    }
    return p
  }, [])
}*/
router.beforeEach(async (to) => {
  NProgress.start()
  const store = usePermissionStore()
  if (store.asyncRoutesRequested) {
    if (store.generateRoutes.length === 0 && to.path !== '/401') {
      // next('/401')
      return '/401'
    } else if (store.generateRoutes.length !== 0 && to.path === '/401') {
      // next('/')
      return '/'
    } else {
      if (router.hasRoute(to.name)) {
        // next()
        return true
      }
      /*else {
         // 路由中没有添加404 且用户进入的路由不存在时
        // 如果路由不存在，则根据路径向上一级跳转，直到找到存在的路由
        return to.path.replace('/' + to.path.split('/').pop(), '')
        // next(to.path.replace('/' + to.path.split('/').pop(), ''))
      }*/
    }
  } else {
    await store.getMenus()
    // console.log(store.generateRoutes, 'store.generateRoutes')
    store.generateRoutes.forEach((route) => {
      router.addRoute(route.name, route)
    })
    router.addRoute({
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/404'),
    })
    /* // 这个方式需要使用hash模式 不然404页面进不去
    const pathList = getPathList(store.generateRoutes)
    // 如果不包含直接跳转路由数组里的第一个
    if (!pathList.includes(to.path)) {
      // to.path = pathList[0]
      console.log(pathList)
      return {
        ...to,
        path: pathList[0],
        replace: true,
      }
    } else {
      return { ...to, replace: true }
    }*/
    router.addRoute({
      path: '/',
      name: 'Index',
      redirect: store.generateRoutes[0].path,
    })
    return { ...to, replace: true }
    // return to.fullPath
  }
})

router.afterEach((to) => {
  NProgress.done()
  document.title = `${to.meta.title} | ${import.meta.env.VITE_APP_TITLE}`
})
